import { AuthGuard } from '@nestjs/passport';

export class AccessTokenGuard extends AuthGuard('check-access-token') {
  constructor() {
    super();
  }
}
