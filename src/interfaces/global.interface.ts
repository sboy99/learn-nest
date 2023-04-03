export interface IResMessage {
  code: 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
}

export interface IRes<TData = unknown, TTokens = unknown> extends IResMessage {
  data?: TData;
  tokens?: TTokens;
}
