import { applyMiddleware } from '../applyMiddleware';
import { CreateMethod, FormattedResponse } from '../types';
import { getBody,is } from '../utils';

/**
 * @namespace httpClient
 * @module createMethod
 * @description Wrapper that return REST method.
 * @param {Object} options
 * @param {string} options.query
 * @param {number} options.timeout
 * @param {string} options.url
 * @param {Function[]} options.middleware
 * @param {Object} options.params
 * @param {string} options.method
 * @param {string} options.format
 * @throws {Response & { formattedResponse: string | object }}
 * @returns {Response} resolved or rejected promise
 */

export async function createMethod<Result = undefined>({
  query,
  timeout,
  url,
  baseUrl,
  middleware = {},
  params = {},
  method = 'GET',
  format = 'json',
}: CreateMethod) {
  const hasBaseUrl = typeof baseUrl === 'string';
  const formattedUrl = `${hasBaseUrl ? baseUrl : ''}${hasBaseUrl && !url ? '' : url ?? '/'}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const {
    signal,
    headers = {},
    ...restParams
  } = params;
  const abortController = new AbortController();
  const abortSignal = is.AbortSignal(signal) ? signal : abortController.signal;
  const shouldSetRequestBody = query && method !== 'GET';
  const options = Object.assign(
    { headers: { ...defaultHeaders, ...headers } },
    shouldSetRequestBody && { body: getBody(query) },
    restParams,
  );
  const processedOptions = await applyMiddleware(
    options,
    { headers: new Headers() },
    middleware.request,
  );
  const isValidOptions = is.Object(processedOptions);
  const requestOptions = Object.assign(
    {
      method,
      signal: abortSignal,
    },
    isValidOptions && processedOptions,
  );

  if (is.Number(timeout)) {
    setTimeout(() => abortController.abort(), timeout);
  }

  return fetch(formattedUrl, requestOptions)
    .then(async (response: Response & { formattedResponse?: unknown }) => {
      const meta = {
        ok: response.ok,
        headers: response.headers,
        status: response.status,
        request: { url, ...requestOptions },
      };
      const clonedResponse = response.clone();
      const formattedResponse =
        await clonedResponse[format]()
          .catch(() => response.text()) as FormattedResponse;
      const processedOptions =
        Array.isArray(middleware.response) ?
          await applyMiddleware(formattedResponse, meta, middleware.response) :
          null;
      const isProcessed =
        is.Object(processedOptions) &&
        'ok' in processedOptions &&
        processedOptions.ok;

      if (!(isProcessed || response.ok)) {
        response.formattedResponse = formattedResponse;

        throw response;
      }

      return formattedResponse as (Result extends undefined ? typeof formattedResponse : Result);
    });
}
