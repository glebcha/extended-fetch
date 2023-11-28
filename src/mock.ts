import { AuthMiddlewareParams } from './middleware/auth/types';

export const query =  { id: 1, name: 'test' };

export const endpoint = 'https://test.test/';
export const authRefreshEndpoint = `${endpoint}auth/refresh`;
export const queryInvalid = 'ERROR';

export function getTokens(tokens?: unknown) {
  return tokens as ReturnType<AuthMiddlewareParams['getTokens']> ?? { accessToken: '1234', refreshToken: 'refresh1234' };
}
