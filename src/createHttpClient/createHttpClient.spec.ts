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
  const url = new URL(request.url);
  const body = await request.json().catch(() => '');
  const headers = request.headers;
  const extractedHeaders =
    is.Headers(headers) &&
    [...headers.entries()].reduce((result, [key, value]) => ({ ...result, [key]: value }), {});
  const isInvalid = url.searchParams.has('invalid');

  return HttpResponse.json(
    isInvalid ?
      Object.assign(body ?? {}, { url }, { errors: ['ERROR'] }) :
      Object.assign(body ?? {}, { url },  extractedHeaders && { headers: extractedHeaders }),
    { headers, status: isInvalid ? 404 : 200 },
  );
}

const clientSuite = suite('Create Http Client');

const server = setupServer(
  http.post(endpoint, handleRequest),
  http.post(`${endpoint}data`, handleRequest),
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

clientSuite('should set baseUrl', async () => {
  const { post } = createHttpClient({ baseUrl: endpoint });
  const params = { url: 'data', query: mockQuery };
  const response = await post<Record<string, BasicObject>>(params);

  assert.equal(response.url, `${endpoint}data`);
});

clientSuite('should throw error if api responded with error status', async () => {
  const { post } = createHttpClient();
  const params = { url: `${endpoint}?invalid=true`, query: queryInvalid };
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
            headers?.append('X-Auth', 'none');
            Object.entries(options?.headers ?? {}).forEach(([key, value]) => headers?.append(key, String(value)));
          }

          const output = hasOptions ? { ...options, ...meta, headers } : {};

          return Promise.resolve(output);
        },
      ],
    },
  };
  const response = await post<BasicObject & { headers: Record<string, string> }>(params);

  assert.ok(response?.headers?.auth);
  assert.match(response?.headers['x-auth'], 'none');

});

clientSuite('should modify response in middleware', async () => {
  const { post } = createHttpClient({
    middleware: {
      response: [
        (options) => {
          return Promise.resolve({ ...(options ?? {}), modifiedResponse: 'MODIFIED_RESPONSE', ok: true });
        },
      ],
    },
  });
  const params: CreateMethod = {
    url: endpoint,
    query: mockQuery,
  };
  const response = await post<string>(params);

  assert.match(response, 'MODIFIED_RESPONSE');

});

clientSuite.run();
