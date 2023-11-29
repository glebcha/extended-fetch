export interface AuthMiddlewareParams {
  url: string | (() => string);
  method?: RequestInit['method'];
  errorCodes?: Response['status'][];
  getTokens: (tokens?: unknown) => { accessToken: string; refreshToken: string };
  setTokens: (tokens?: unknown) => void;
  getHeaders?: (meta: Partial<Response>) => Response['headers'];
  handleAuthError?: (error: unknown) => void;
}
