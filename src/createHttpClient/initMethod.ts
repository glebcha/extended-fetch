import { mergeMiddleware } from '../applyMiddleware/mergeMiddleware';
import {  Methods } from '../constants';
import {
  CreateHttpClientOptions,
  CreateMethod,
  Method
} from '../types';
import { is } from '../utils';

import { createMethod } from './createMethod';

/**
 * @namespace httpClient
 * @module initMethod
 * @description Wrapper that return REST method.
 * @param {string} method
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

export function initMethod(method: `${Lowercase<Methods>}`, options?: CreateHttpClientOptions) {
  return (methodOptions?: unknown) => {

    if (!is.Object(methodOptions)) {
      throw new Error('httpClient method options should be object');
    }

    const { middleware = {}, ...params } = methodOptions as CreateMethod;
    return createMethod({
      ...params,
      baseUrl: options?.baseUrl,
      middleware: mergeMiddleware(middleware, options?.middleware),
      method: method.toUpperCase() as Method,
    });
  };
}
