import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { applyMiddleware } from './applyMiddleware';

const processOptionsSuite = suite('processOptions');

processOptionsSuite('should output valid options despite of invalid middleware', async () => {
  const middleware = [
    null,
    // eslint-disable-next-line @typescript-eslint/require-await
    async (options: RequestInit) => ({ ...options, headers: { 'Test': 'Header' } }),
    'invalidString',
  ];
  const result = await applyMiddleware<RequestInit>({}, middleware);
  const resultWihoutMiddleware = await applyMiddleware({ headers: [] });

  assert.ok(result?.headers && 'Test' in result.headers);
  assert.is(Array.isArray(resultWihoutMiddleware?.headers) && resultWihoutMiddleware.headers.length, 0);
});

processOptionsSuite.run();
