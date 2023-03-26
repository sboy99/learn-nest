import { User } from '@prisma/client';
import { IResMessage } from './global.interface';

export interface IAuthRes extends IResMessage {
  user: Omit<User, 'password'>;
}
