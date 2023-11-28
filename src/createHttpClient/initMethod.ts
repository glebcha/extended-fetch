import { mergeMiddleware } from '../applyMiddleware/mergeMiddleware';
import {  Methods } from '../constants';
import {
  CreateHttpClientOptions,
  CreateMethod,
  Method
} from '../types';
import { is } from '../utils/getType';

import { createMethod } from './createMethod';

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
