import {
  Middleware,
  MiddlewareType
} from './types';

function createArray<Result = Array<unknown>>(...args: Array<unknown>) {
  return args.reduce((result: Array<Result>, arg) => Array.isArray(arg) ? result.concat(arg) : result, []);
}

export function mergeMiddleware(additional: Middleware, general: Middleware = {}) {
  return Object.keys(additional).reduce((result, key) => {
    const generalMiddlewareByKey = result[key as MiddlewareType];
    const additionalMiddlewareByKey = additional[key as MiddlewareType];
    const value =
      Array.isArray(generalMiddlewareByKey) ?
        createArray(generalMiddlewareByKey, additionalMiddlewareByKey) :
        additionalMiddlewareByKey;

    return { ...result, [key]: value };
  }, general);
}
