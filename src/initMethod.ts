import {  Methods } from './constants';
import { createMethod } from './createMethod';
import { is } from './getType';
import { mergeMiddleware } from './mergeMiddleware';
import {
  CreateHttpClientOptions,
  CreateMethod,
  Method
} from './types';

export function initMethod(method: `${Lowercase<Methods>}`, options?: CreateHttpClientOptions) {
  return (methodOptions?: unknown) => {

    if (!is.Object(methodOptions)) {
      throw new Error('httpClient method options should be object');
    }

    const { middleware = {}, ...params } = methodOptions as CreateMethod;
    return createMethod({
      ...params,
      middleware: mergeMiddleware(middleware, options?.middleware),
      method: method.toUpperCase() as Method,
    });
  };
}
