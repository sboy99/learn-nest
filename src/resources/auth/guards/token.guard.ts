import { AuthGuard } from '@nestjs/passport';

export class AccessTokenGuard extends AuthGuard('check-access-token') {
  constructor() {
    super();
  }
}
export class RefreshTokenGuard extends AuthGuard('check-refresh-token') {
  constructor() {
    super();
  }
}
