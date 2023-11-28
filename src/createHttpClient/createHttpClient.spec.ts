import { fetch } from 'cross-fetch';
import {
  http,
  HttpResponse
} from 'msw';
import { setupServer } from 'msw/node';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { createHttpClient } from '../createHttpClient';
import {
  endpoint,
  query as mockQuery,
  queryInvalid
} from '../mock';
import { BasicObject, CreateMethod } from '../types';
import { is } from '../utils';

async function handleRequest({ request }: Parameters<Parameters<typeof http.all>[1]>[0]) {
  const body = await request.json().catch(() => '');
  const headers = request.headers;
  const isInvalid = String(body) === queryInvalid;

  return HttpResponse.json(
    isInvalid ?
      Object.assign(body ?? {}, { errors: ['ERROR'] }) :
      body,
    { headers, status: isInvalid ? 404 : 200 },
  );
}

const clientSuite = suite('Create Http Client');

const server = setupServer(
  http.post(endpoint, handleRequest),
  http.get(endpoint, handleRequest),
);

global.fetch = fetch;

clientSuite.before(() => server.listen());
clientSuite.after.each(() => server.resetHandlers());
clientSuite.after(() => server.close());

clientSuite('should not send body in GET request', async () => {
  const { get } = createHttpClient();
  const params = { url: endpoint, query: mockQuery };
  const response = await get<Record<string, BasicObject>>(params);

  assert.equal(response, '');
});

clientSuite('should throw error if api responded with error status', async () => {
  const { post } = createHttpClient();
  const params = { url: endpoint, query: queryInvalid };
  const { status } = await post(params).catch(({ status }: Response) => ({ status })) as Record<string, BasicObject>;

  assert.equal(status, 404);
});

clientSuite('should throw error if method options is not an object', () => {
  const { get } = createHttpClient();
  // @ts-expect-error faulty assertion
  assert.throws(() => get(''));
});

clientSuite('should apply middleware', async () => {
  const { post } = createHttpClient({
    middleware: {
      request: [
        options => {
          const hasOptions = is.Object(options);
          const headers = hasOptions ? { ...(options?.headers as Record<string, unknown>), auth: true } : {};
          const output = hasOptions ? { ...options, headers } : {};

          return Promise.resolve(output);
        },
      ],
    },
  });
  const params: CreateMethod = {
    url: endpoint,
    query: mockQuery,
    middleware: {
      request: [
        (options, { headers, ...meta }) => {
          const hasOptions = is.Object(options);

          if (hasOptions && headers) {
            headers?.append('auth', 'true');
            headers?.append('X-Auth', 'none');
            Object.entries(options?.headers ?? {}).forEach(([key, value]) => headers?.append(key, String(value)));
          }

          const output = hasOptions ? { ...options, ...meta, headers } : {};

          return Promise.resolve(output);
        },
      ],
      response: [
        options => {
          return Promise.resolve({ ...options ?? {}, id: null });
        },
        (options, headers) => {
          return Promise.resolve({ ...options ?? {}, ...headers, additional: true });
        },
      ],
    },
  };
  const response = await post<BasicObject & { headers: Request['headers'] }>(params);

  assert.ok(response?.headers?.get('auth'));
  assert.equal(response.id, null);
  assert.equal(response.additional, true);
});

clientSuite.run();
