import { Methods } from '../../constants';
import { MiddlewareHandler } from '../../types';
import {
  applyHeaders,
  getBody,
  is
} from '../../utils';

import { AuthMiddlewareParams } from './types';

const LIB_ID = (process.env.LIB_ID ?? 'ExtendedFetch') as keyof globalThis;

function setWaitingAuthFlag(isWaitingAuth = true) {
  if (globalThis[LIB_ID]) {
    globalThis[LIB_ID].isWaitingAuth = isWaitingAuth;
  } else {
    globalThis[LIB_ID] = { isWaitingAuth };
  }
}

export function initAuthMiddleware(initParams: AuthMiddlewareParams) {
  const {
    url,
    method = 'get',
    errorCodes = [401],
    getTokens,
    setTokens,
    getHeaders,
    handleAuthError,
  } = initParams;

  return async (...params: Parameters<MiddlewareHandler>) => {
    const [options, meta] = params;
    const currentSessionTokens = getTokens();
    const sanitizedUrl = typeof url === 'function' ? await url() : url;
    const sanitizedOptions = is.Object(options) ? options : {};
    const shouldProcessAuth = errorCodes.some(errorCode => errorCode === meta.status);
    const currentSessionToken =
      shouldProcessAuth ?
        currentSessionTokens.refreshToken :
        currentSessionTokens.accessToken;
    const headers =
      typeof getHeaders === 'function' ?
        getHeaders(meta) :
        new Headers({ 'Authorization': `Bearer ${currentSessionToken}` });

    if (!shouldProcessAuth) {
      return { ...sanitizedOptions, headers };
    }

    const body = method !== Methods['GET'] ? getBody({ refreshToken: currentSessionTokens.refreshToken }) : null;
    const errorHandler =
      typeof handleAuthError === 'function' ?
        handleAuthError :
        // eslint-disable-next-line no-console
        () => console.warn('Failed to refresh authorization token');

    if (globalThis[LIB_ID] && globalThis[LIB_ID]?.isWaitingAuth) {
      return Promise.resolve(sanitizedOptions);
    }

    setWaitingAuthFlag();

    return fetch(sanitizedUrl, { method, body, headers })
      .then(async (response) => {
        const tokens = await response.json().catch(() => ({})) as ReturnType<AuthMiddlewareParams['getTokens']>;

        if (!response.ok) {
          errorHandler(response);
        }

        setWaitingAuthFlag(false);

        if (tokens.accessToken) {
          applyHeaders({ 'Authorization': `Bearer ${tokens.accessToken}` }, sanitizedOptions?.headers);
        }

        setTokens(tokens);

        return { ...sanitizedOptions, ok: response.ok };
      })
      .catch(errorHandler);
  };
}
