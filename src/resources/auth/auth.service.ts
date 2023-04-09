import { DatabaseService } from '@/database/database.service';
import { IJwtUser, IReqInfo, ITokens } from '@/interfaces';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User as TUser } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcryptjs from 'bcryptjs';
import { SigninDto, SignupDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signupLocal(
    dto: SignupDto
  ): Promise<(ITokens & { user: TUser }) | never> {
    const hashPassword = await this.getHashedPassword(dto.password);
    try {
      const user = await this.db.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashPassword,
          ShoppingSession: {
            create: {},
          },
        },
      });
      const tokens = await this.getTokens(user.id, user.email, user.role);
      return {
        ...tokens,
        user,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      }
      throw error;
    }
  }

  async signinLocal(
    dto: SigninDto
  ): Promise<(ITokens & { user: TUser }) | never> {
    // find user by email address
    const user = await this.db.user.findFirst({
      where: { email: dto.email },
    });
    // if user is not found throw exception
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // check if password matches
    const valid = await this.comparePassword(dto.password, user.password);
    if (!valid) {
      throw new ForbiddenException('Invalid password');
    }
    const tokens = await this.getTokens(user.id, user.email, user.role);
    return {
      ...tokens,
      user,
    };
  }

  async logoutLocal(userId: string) {
    await this.deleteSession(userId);
    return {
      message: 'user logged out',
    };
  }
  /**
   * Refresh all tokens
   * @param user IJwtPayload
   * @returns
   */
  async refreshToken(user: IJwtUser): Promise<ITokens | never> {
    const session = await this.db.sessions.findUnique({
      where: {
        user_id: user.userId,
      },
    });
    if (!session) throw new ForbiddenException('Access Denied');
    const hasValidRefreshToken = await this.comparePassword(
      user.refreshToken.split('.')[2], // as last section of jwt changes so this is getting targeted due to limitation of bcrypt
      session.refresh_token
    );

    if (!hasValidRefreshToken || session.is_blocked) {
      throw new UnauthorizedException('You are not authorized');
    }
    return this.getTokens(user.userId, user.email, user.role);
  }
  /**
   * Get Access and Refresh tokens
   * @param userId string
   * @param email string
   * @returns ITokens: {access_token:string,refresh_token:string}
   */
  private async getTokens(
    userId: string,
    email: string,
    userRole: TUser['role']
  ): Promise<ITokens> {
    const payload = {
      sub: userId,
      email: email,
      role: userRole,
    };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_ACCESS_SECRET'),
      }),
      this.jwt.signAsync(payload, {
        expiresIn: '7day',
        secret: this.config.get('JWT_REFRESH_SECRET'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async createSession(req: IReqInfo, user_id: string, refresh_token: string) {
    const hashRt = await this.getHashedPassword(refresh_token.split('.')[2]);
    return this.db.sessions.upsert({
      where: {
        user_id,
      },
      create: {
        ip: req.ip,
        refresh_token: hashRt,
        user_agent: req.userAgent,
        user_id,
      },
      update: {
        ip: req.ip,
        refresh_token: hashRt,
        user_agent: req.userAgent,
      },
    });
  }

  deleteSession(user_id: string) {
    return this.db.sessions.deleteMany({
      where: {
        user_id,
      },
    });
  }

  // utility
  async getHashedPassword(pwd: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(pwd, salt);
    return hash;
  }

  async comparePassword(pwd: string, hash: string): Promise<boolean> {
    const isMatch = await bcryptjs.compare(pwd, hash);
    return isMatch;
  }
}
