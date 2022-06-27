import { fetch } from 'cross-fetch';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { createHttpClient } from './createHttpClient';
import {
  endpoint,
  query as mockQuery,
  queryInvalid
} from './mock';
import { BasicObject } from './types';

const clientSuite = suite('createHttpClient');

const server = setupServer(
  rest.post(endpoint, (req, res, ctx) => {
    const headers = req.headers.all();
    const body = req.body as BasicObject;

    if (String(body) === queryInvalid) {
      return res(ctx.status(404), ctx.json({ errors: ['ERROR'] }));
    }

    return res(ctx.json({ response: { headers, body } }));
  }),
  rest.get(endpoint, (req, res, ctx) => {
    const headers = req.headers.all();
    const body = req.body;

    return res(ctx.json({ response: { headers, body } }));
  }),
);

global.fetch = fetch;

clientSuite.before(() => server.listen());
clientSuite.after.each(() => server.resetHandlers());
clientSuite.after(() => server.close());

clientSuite('should not send body in GET request', async () => {
  const { get } = createHttpClient();
  const params = { url: endpoint, query: mockQuery };
  const { response } = await get(params) as Record<string, BasicObject>;

  assert.equal(response.body, '');
});

clientSuite('should throw error if api responded with error status', async () => {
  const { post } = createHttpClient();
  const params = { url: endpoint, query: queryInvalid };
  const { status } = await post(params).catch(({ status }: Response) => ({ status })) as Record<string, BasicObject>;

  assert.equal(status, 404);
});

clientSuite('should throw error if method options is not an object', () => {
  const { get } = createHttpClient();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  assert.throws(() => get(''));
});

clientSuite('should apply middleware', async () => {
  const { post } = createHttpClient({
    middleware: {
      request: [
        (options: Record<string, BasicObject>) => ({ ...options, headers: { ...options.headers, 'auth': true } }),
      ],
    },
  });
  const params = {
    url: endpoint,
    query: mockQuery,
    middleware: {
      request: [
        (options: Record<string, BasicObject>) => ({ ...options, headers: { ...options.headers, auth: String(options.headers.auth) } }),
      ],
      response: [
        (response: Record<string, BasicObject>) => {

          response.response.body = { id: null };

          return response;
        },
        (response: Record<string, BasicObject>) => {

          response.response.body = Object.assign(
            { additional: true },
            response.response.body,
          );

          return response;
        },
      ],
    },
  };
  const { response: { headers, body } } = await post(params) as Record<string, BasicObject>;

  assert.ok((headers as BasicObject).auth);
  assert.equal((headers as BasicObject).auth, 'true');
  assert.equal((body as BasicObject).id, null);
  assert.equal((body as BasicObject).additional, true);
});

clientSuite.run();
