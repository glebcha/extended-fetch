import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { applyMiddleware } from './applyMiddleware';

const processOptionsSuite = suite('Middleware');

processOptionsSuite('should output valid options despite of invalid middleware', async () => {
  const middleware = [
    null,
    (options: unknown, headers: Request['headers']) => Promise.resolve({ ...options ?? {}, headers }),
    'invalidString',
  ];
  // @ts-expect-error faulty middleware assertion
  const result = await applyMiddleware({}, new Headers({ Test: 'Header' }), middleware);
  // @ts-expect-error faulty middleware assertion
  const resultWihoutMiddleware = await applyMiddleware({ response: [] });

  // @ts-expect-error assertion
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  assert.ok(result?.headers.has('Test'));

  assert.instance((resultWihoutMiddleware as Record<string, unknown>).response, Array);
});

processOptionsSuite.run();
