import { DatabaseService } from '@/database/database.service';
import { SigninDto, SignupDto } from '@/dto';
import { IAuthRes, IReqInfo, ITokens } from '@/interfaces';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcryptjs from 'bcryptjs';

@Injectable({})
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(req: IReqInfo, dto: SignupDto): Promise<IAuthRes | never> {
    const hashPassword = await this.getHashedPassword(dto.password);
    try {
      const user = await this.db.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashPassword,
        },
      });
      const tokens = await this.getTokens(user.id, user.email);
      await this.createSession(req, user.id, tokens.refresh_token);
      return {
        code: 'SUCCESS',
        message: 'Registration successful',
        ...tokens,
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

  async signinLocal(req: IReqInfo, dto: SigninDto): Promise<IAuthRes | never> {
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
    const tokens = await this.getTokens(user.id, user.email);
    await this.createSession(req, user.id, tokens.refresh_token);
    return {
      code: 'SUCCESS',
      message: 'Login successful',
      ...tokens,
    };
  }

  async logoutLocal(userId: string) {
    await this.deleteSession(userId);
    return {
      message: 'user logged out',
    };
  }

  refreshToken() {
    return {
      message: 'token refreshed',
    };
  }

  private async getTokens(userId: string, email: string): Promise<ITokens> {
    const payload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }),
      this.jwt.signAsync(payload, {
        expiresIn: '7day',
        secret: this.config.get('JWT_SECRET'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async createSession(req: IReqInfo, user_id: string, refresh_token: string) {
    const hashRt = await this.getHashedPassword(refresh_token);
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
