export interface IResMessage {
  code: 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
}

export interface IRes<TData = unknown, TToken = unknown> extends IResMessage {
  data?: TData;
  tokens?: TToken;
}
