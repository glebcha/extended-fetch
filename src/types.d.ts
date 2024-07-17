import { Methods } from './constants';

export type BasicObject = Record<string, unknown>;

export type Method = keyof typeof Methods;

export interface MiddlewareMeta extends Partial<Response> {
  request?: Omit<Partial<Request>, 'signal'>;
  signal?: Request['signal'];
}

export type MiddlewareType = 'request' | 'response';
export type MiddlewareHandler = (params: unknown, meta: MiddlewareMeta) => Promise<typeof params>;
export type MiddlewareHandlers = Array<MiddlewareHandler>;
export type Middleware = {
  [key in MiddlewareType]?: MiddlewareHandlers
};

export type CreateMethod = {
  query?: unknown,
  url?: string,
  baseUrl?: string,
  timeout?: number,
  middleware?: Middleware,
  params?: Partial<RequestInit>,
  method?: Uppercase<`${Methods}`>,
  format?: keyof Omit<Body, 'body' | 'bodyUsed'>,
};

type CreateHttpClientOptions = {
  baseUrl?: string;
  middleware?: Middleware;
};

type ErrorText = 'ErrorText' | 'error_text';
type ErrorCode = 'ErrorCode' | 'error_code';
type ErrorFields = ErrorText | ErrorCode;
type ErrorBody = {
  [key in ErrorFields]?: string
};

type ResponseFormats = keyof Omit<Body, 'body' | 'bodyUsed' | 'json'>;
export type FormattedResponse = ReturnType<Body[ResponseFormats]> | Record<string, unknown>;
