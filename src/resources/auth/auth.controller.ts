import { ReqInfo, User } from '@/decorators';
import { SigninDto, SignupDto } from '@/dto';
import { IJwtUser, IReqInfo, IRes, ITokens } from '@/interfaces';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   *
   * @returns registration data
   */
  @Post('local/signup')
  async signupLocal(
    @ReqInfo() req: IReqInfo,
    @Body() dto: SignupDto,
  ): Promise<IRes<unknown, ITokens>> {
    const { access_token, refresh_token, user } =
      await this.authService.signupLocal(dto);
    await this.authService.createSession(req, user.id, refresh_token);
    return {
      code: 'SUCCESS',
      message: 'successfully signed up',
      tokens: {
        access_token,
        refresh_token,
      },
    };
  }
  /**
   *
   * @returns login data
   */
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @ReqInfo() req: IReqInfo,
    @Body() dto: SigninDto,
  ): Promise<IRes<unknown, ITokens>> {
    const { refresh_token, access_token, user } =
      await this.authService.signinLocal(dto);
    await this.authService.createSession(req, user.id, refresh_token);

    return {
      code: 'SUCCESS',
      message: 'success',
      tokens: {
        access_token,
        refresh_token,
      },
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get('local/logout')
  @HttpCode(HttpStatus.OK)
  logout(@User('userId') userId: IJwtUser['userId']) {
    return this.authService.logoutLocal(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @User() user: IJwtUser,
    @ReqInfo() req: IReqInfo,
  ): Promise<IRes<unknown, ITokens>> {
    const tokens = await this.authService.refreshToken(user);
    await this.authService.createSession(
      req,
      user.userId,
      tokens.refresh_token,
    );

    return {
      code: 'SUCCESS',
      message: '',
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }
}
