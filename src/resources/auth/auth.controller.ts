import { AuthDto } from '@/dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   *
   * @returns registration data
   */
  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.handleRegistration(dto);
  }
  /**
   *
   * @returns login data
   */
  @Post('login')
  login(@Body() dto: Omit<AuthDto, 'username'>) {
    return this.authService.handleLogin(dto);
  }
}
