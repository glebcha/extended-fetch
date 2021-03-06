import {  Methods } from './constants';
import { createMethod } from './createMethod';
import { initMethod } from './initMethod';
import {
  CreateHttpClientOptions,
  Method
} from './types';

/**
 * @namespace httpClient
 * @module createHttpClient
 * @description General wrapper that return REST methods.
 * @example
 * const api = createHttpClient();
 *
 *  api.post({ url: '/api/books', query: { text: 'New record' } })
 *  .then((jsonFormattedResponse) => {})
 *  .catch((jsonFormattedError) => {});
 * @returns {Object} - REST API methods as functions
 */

export function createHttpClient(options?: CreateHttpClientOptions) {
  const methods: Array<`${Lowercase<Methods>}`> = Object.values(Methods);
  const client =  methods.reduce((methodsMap, method) => ({
    ...methodsMap,
    [method]: initMethod(method, options),
  }), {} as Record<Lowercase<Method>, typeof createMethod>);

  return client;
}
