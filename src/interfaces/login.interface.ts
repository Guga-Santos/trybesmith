export interface ILogin {
  username: string;
  password: string;
}

export interface IMessage {
  message?: string;
  token?: string;
}

export interface IResponse {
  code: number ; 
  message: IMessage;
  response?: unknown;
}
