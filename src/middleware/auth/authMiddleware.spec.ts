import { fetch } from 'cross-fetch';
import {
  http,
  HttpResponse
} from 'msw';
import { setupServer } from 'msw/node';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { createHttpClient } from '../../createHttpClient';
import {
  authRefreshEndpoint,
  endpoint,
  getTokens,
  queryInvalid
} from '../../mock';
import { BasicObject } from '../../types';

import { initAuthMiddleware } from './authMiddleware';

const clientSuite = suite('Authorization Middleware');

const server = setupServer(
  http.post(endpoint, async ({ request }) => {
    const body = await request.json().catch(() => '');
    const headers = request.headers;
    const isInvalid = String(body) === queryInvalid;

    return HttpResponse.json(
      body,
      { headers, status: isInvalid ? 401 : 200 },
    );
  }),
  http.post(authRefreshEndpoint, ({ request }) => {
    const headers = request.headers;

    return HttpResponse.json(
      { accessToken: '4321', refreshToken: 'refresh4321' },
      { headers, status: 200 },
    );
  }),
);

global.fetch = fetch;

clientSuite.before(() => server.listen());
clientSuite.after.each(() => server.resetHandlers());
clientSuite.after(() => server.close());

clientSuite.only('should apply auth middleware', async () => {
  const authParams = { url: authRefreshEndpoint, getTokens, setTokens: () => {} };
  const { post } = createHttpClient({ middleware: { response: [initAuthMiddleware(authParams)] } });
  const response = await post<BasicObject & { headers: Request['headers'] }>({ url: endpoint, query: queryInvalid });
  // @ts-expect-error header assertion
  assert.is(response.headers.Authorization, 'Bearer 4321');
});

clientSuite.run();
