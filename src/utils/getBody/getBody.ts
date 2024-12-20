import { safeJsonStringify } from './safeJsonStringify';

const { warn } = console;

const LIB_ID = process.env.LIB_ID ?? 'ExtendedFetch';

export function getBody(query?: unknown) {
  if (typeof query === 'string') {
    return query;
  }

  let body = '{}';

  try {
    body = safeJsonStringify(query);
  } catch (error) {
    warn(`${LIB_ID}: Failed to parse query ${String(error)}`);
  }

  return body;
}
