import { MiddlewareHandler } from '../../types';
import { getBody, is } from '../../utils';

import { AuthMiddlewareParams } from './types';

export function initAuthMiddleware(initParams: AuthMiddlewareParams) {
  const {
    url,
    errorCodes = [401],
    getTokens,
    setTokens,
    getHeaders,
    handleAuthError,
  } = initParams;

  return async (...params: Parameters<MiddlewareHandler>) => {
    const [options, meta] = params;
    const currentSessionTokens = getTokens();
    const headers =
      typeof getHeaders === 'function' ?
        getHeaders(meta) :
        { Authorization: `Bearer ${currentSessionTokens.accessToken}` };
    const shouldProcessAuth = errorCodes.some(errorCode => errorCode === meta.status);

    if (shouldProcessAuth) {
      const body = getBody({ refreshToken: currentSessionTokens.refreshToken });
      const sanitizedOptions = is.Object(options) ? options : {};
      const sanitizedHeaders = sanitizedOptions?.headers ?? {};
      const errorHandler =
        typeof handleAuthError === 'function' ?
          handleAuthError :
          // eslint-disable-next-line no-console
          () => console.warn('Failed to refresh authorization token');

      return fetch(url, { method: 'post', body, headers })
        .then(async (response) => {
          const tokens = await response.json().catch(() => null) as ReturnType<AuthMiddlewareParams['getTokens']> | null;
          const { accessToken } = getTokens(tokens);
          const optionsWithAuth = {
            ...sanitizedOptions,
            ok: response.ok,
            headers: {
              ...sanitizedHeaders,
              Authorization: `Bearer ${accessToken}`,
            },
          };

          setTokens(tokens);

          return optionsWithAuth;
        })
        .catch(errorHandler);
    }

    return { ...options ?? {}, headers };
  };
}
