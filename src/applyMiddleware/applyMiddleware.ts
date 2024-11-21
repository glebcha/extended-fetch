import type { MiddlewareHandlers, MiddlewareMeta } from '../types';
import { is } from '../utils';

export function applyMiddleware(
  options: unknown,
  meta: MiddlewareMeta,
  middleware?: MiddlewareHandlers,
) {
  const isValidMiddleware = Array.isArray(middleware) && middleware.length > 0;

  return isValidMiddleware ? apply(options, meta, middleware) : Promise.resolve(options);
}


function apply(
  options: unknown,
  meta: MiddlewareMeta,
  middleware: MiddlewareHandlers,
) {
  const accessorTypes = ['Function', 'AsyncFunction', 'Promise'] as const;
  const isValidProcessor = (processor: unknown) => accessorTypes.some((accessor) => is[accessor](processor));

  return  middleware.reduce<Promise<unknown>>((changedOptions, processor) => {
    const shouldProcess = isValidProcessor(processor);

    return shouldProcess ?
      changedOptions.then(data => processor(data, meta)).catch(() => ({})) :
      Promise.resolve(changedOptions);
  }, Promise.resolve(options));
}
