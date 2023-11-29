import { is } from './getType';

export function applyHeaders(source: Record<string, string>, target?: unknown) {
  const isValid = is.Headers(target);

  if (isValid) {
    Object.entries(source).forEach(([key, value]) => {
      target.append(key, value);
    });
  }
}
