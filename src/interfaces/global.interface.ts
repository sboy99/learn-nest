export interface IResMessage {
  code: 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
}
