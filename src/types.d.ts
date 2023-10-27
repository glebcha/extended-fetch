import { Methods } from './constants';

export type BasicObject = Record<string, unknown>;

export type Method = keyof typeof Methods;

export type MiddlewareType = 'request' | 'response';
export type MiddlewareHandlers = Array<MiddlewareHandler | unknown>;
type Middleware = {
  [key in MiddlewareType]?: MiddlewareHandlers
};
export type MiddlewareHandler = (params: RequestInit) => Promise<RequestInit>;

export type CreateMethod = {
  query?: unknown,
  url?: string,
  timeout?: number,
  middleware?: Middleware,
  params?: RequestInit,
  method?: Uppercase<`${Methods}`>,
  format?: keyof Omit<Body, 'body' | 'bodyUsed'>,
};

type CreateHttpClientOptions = { middleware?: Middleware };

type ErrorText = 'ErrorText' | 'error_text';
type ErrorCode = 'ErrorCode' | 'error_code';
type ErrorFields = ErrorText | ErrorCode;
type ErrorBody = {
  [key in ErrorFields]?: string
};

type ResponseFormats = keyof Omit<Body, 'body' | 'bodyUsed' | 'json'>;
export type FormattedResponse = ReturnType<Body[ResponseFormats]> | Record<string, unknown>;
