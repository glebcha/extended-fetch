const { warn } = console;

export function getBody(query?: unknown) {
  let body = '{}';

  try {
    body = JSON.stringify(query);
  } catch (error) {
    warn(`ExtendedFetch: Failed to parse query ${String(error)}`);
  }

  return body;
}
