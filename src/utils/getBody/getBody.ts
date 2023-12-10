const { warn } = console;

const LIB_ID = process.env.LIB_ID ?? 'ExtendedFetch';

export function getBody(query?: unknown) {
  let body = '{}';

  try {
    body = JSON.stringify(query);
  } catch (error) {
    warn(`${LIB_ID}: Failed to parse query ${String(error)}`);
  }

  return body;
}
