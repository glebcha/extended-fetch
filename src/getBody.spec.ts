/* eslint-disable @typescript-eslint/require-await */
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { getBody } from './getBody';
import { query } from './mock';

const getBodySuite = suite('getBody');

getBodySuite('should output object with formatted sql string', async () => {
  const result = getBody(query);

  assert.equal(result.length, 22);
});

getBodySuite.run();
