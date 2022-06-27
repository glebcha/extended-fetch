import { applyMiddleware } from './applyMiddleware';
import { getBody } from './getBody';
import { is } from './getType';
import { CreateMethod, FormattedResponse } from './types';

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
 * @returns {Promise} - resolved or rejected promise
 */

export async function createMethod({
  query,
  timeout,
  url = '/',
  middleware = {},
  params = {},
  method = 'GET',
  format = 'json',
}: CreateMethod) {
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
  const processedOptions = await applyMiddleware<RequestInit>(options, middleware.request);
  const requestOptions = {
    ...processedOptions,
    method,
    signal: abortSignal,
  };

  if (is.Number(timeout)) {
    setTimeout(() => abortController.abort(), timeout);
  }

  return fetch(url, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response[format]();
      } else {
        throw response;
      }
    })
    .then(async (formattedResponse: Awaited<FormattedResponse>) => {
      const processedResponse =
        Array.isArray(middleware.response) ?
          await applyMiddleware(formattedResponse, middleware.response) :
          formattedResponse;

      return processedResponse;
    });
}

