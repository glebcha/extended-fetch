/* eslint-disable @typescript-eslint/require-await */
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { query } from '../../mock';

import { getBody } from './getBody';

const clientSuite = suite('Safe JSON Stringify');

clientSuite('should output object with formatted sql string', async () => {
  const result = getBody(query);

  assert.equal(result.length, 22);
});

clientSuite.run();
