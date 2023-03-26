import { IResMessage } from './global.interface';

export interface IAuthRes extends IResMessage {
  access_token: string;
}
