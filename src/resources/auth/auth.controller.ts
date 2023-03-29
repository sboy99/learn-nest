import { ReqInfo, User } from '@/decorators';
import { SigninDto, SignupDto } from '@/dto';
import { IReqInfo } from '@/interfaces';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User as TUser } from '@prisma/client';
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
  signupLocal(@ReqInfo() req: IReqInfo, @Body() dto: SignupDto) {
    return this.authService.signupLocal(req, dto);
  }
  /**
   *
   * @returns login data
   */
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@ReqInfo() req: IReqInfo, @Body() dto: SigninDto) {
    return this.authService.signinLocal(req, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('local/logout')
  @HttpCode(HttpStatus.OK)
  logout(@User() user: TUser) {
    return this.authService.logoutLocal(user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken() {
    return this.authService.refreshToken();
  }
}
