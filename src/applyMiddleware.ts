import { is } from './getType';
import { MiddlewareHandler, MiddlewareHandlers } from './types';

export function applyMiddleware<Options = RequestInit>(options: Options, middleware?: MiddlewareHandlers) {
  const isValidMiddleware = Array.isArray(middleware) && middleware.length > 0;

  return isValidMiddleware ? apply(options, middleware) : Promise.resolve(options);
}


function apply(options: RequestInit, middleware: MiddlewareHandlers) {
  const isValidProcessor = (processor: unknown) => ['Function', 'AsyncFunction', 'Promise'].some((accessor) => is[accessor](processor));

  return  middleware.reduce<Promise<RequestInit>>((changedOptions, processor) => {
    const shouldProcess = isValidProcessor(processor);

    return shouldProcess ?
      changedOptions.then(processor as MiddlewareHandler).catch(() => ({})) :
      Promise.resolve(changedOptions);
  }, Promise.resolve(options));
}
