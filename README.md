# [Hackable HTTP client based on native fetch](https://www.npmjs.com/package/extended-fetch)
![](https://img.shields.io/npm/v/extended-fetch?style=flat-square)
![](https://img.shields.io/node/v/extended-fetch?style=flat-square)
![](https://img.shields.io/npm/dm/extended-fetch?style=flat-square)
[![](https://data.jsdelivr.com/v1/package/npm/extended-fetch/badge)](https://www.jsdelivr.com/package/npm/extended-fetch)

* No dependencies
* Middleware can be applied for all requests or single
* Requests can be aborted by timeout
* Modular architecture
* Typescript
* ESM + UMD
* Tiny size < 4KB

React + Typescript sandbox:

[![Edit extended-fetch](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/extended-fetch-react-typescript-ryxrdj?file=/src/App/App.tsx)

Browser sandbox:

[![Edit extended-fetch](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lingering-shape-8pml00?fontsize=14&hidenavigation=1&theme=dark)

### **Install:**

```
npm i extended-fetch
```

### **Interface:**

```typescript
type MiddlewareType = 'request' | 'response';
type MiddlewareHandlers = Array<MiddlewareHandler | unknown>;
type Middleware = {
  [key in MiddlewareType]?: MiddlewareHandlers
};
type MiddlewareHandler = (params: RequestInit) => Promise<RequestInit>;

type CreateMethod = {
  query?: unknown,
  url?: string,
  baseUrl?: string,
  timeout?: number,
  middleware?: Middleware,
  params?: RequestInit,
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  format?: (property) format?: "formData" | "text" | "blob" | "json" | "arrayBuffer">,
}
```

[More info about params can be found on MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters)

### **Basic usage:**

```javascript
const api = createHttpClient();

api.get('/api/books/12')
 .then((jsonFormattedResponse) => {})
 .catch(async (pureResponseInstance) => {
  const { status, statusText } = pureResponseInstance;

  return { status, statusText };
 });
```

### **Basic error handling:**

```javascript
const api = createHttpClient();

api.get('/api/books/12')
 .then((jsonFormattedResponse) => {})
 .catch(async (pureResponseInstance) => {
  const {
    status,
    statusText,
    formattedResponse: response
  } = pureResponseInstance;

  return { status, statusText, response };
 });
```

### **Custom response type:**

```typescript
const api = createHttpClient();

interface Book {
  id: string,
  description?: string,
}

api.get<Book>('/api/books/12')
 .then(({ id, description }) => {})
 .catch(async (pureResponseInstance) => {
  const { status, statusText } = pureResponseInstance;

  return { status, statusText };
 });
```

### **Abort request by timeout:**

```javascript
const api = createHttpClient();

api.get({ url: '/api/books/12', timeout: 10000 });
```

### **Abort with signal passed:**

```javascript
const api = createHttpClient();
const abortController = new AbortController();

api.get({
  url: '/api/books/12',
  params: { signal: abortController.signal }
});

setTimeout(() => abortController.abort(), 5000);
```

### **Middleware:**

```javascript
function setAuthHeader(options) {
  const headers = { ...options.headers, Authorization = 'Bearer shdkjhf798798jsjjs' };

  return Object.assign(options, { headers });
}

function collectErrors(response) {
  const { errors = [] } = response;
  const errorText = errors.reduce((merged, { message }) =>  `${merged}${message}`, '');

  response.errorText = errorText;

  return response;
}

const middleware = {
  request: [setAuthHeader],
  response: [collectErrors]
};
const api = createHttpClient({ middleware });

api.post({
  url: '/api/books',
  query: { text: 'New record' }
  middleware: {
    request: [
      (options) => ({ ...options, format: 'text' })
    ]
  }
});
```

### **Auth Middleware:**

```javascript
import { createHttpClient, initAuthMiddleware } from 'extended-fetch';

const middleware = {
  request: [
    setRequestHeaders: async (options) => options,
  ],
  response: [
    initAuthMiddleware({
      url: async () => 'refresh',
      getTokens: () => ({ accessToken: '', refreshToken: '' }),
      setTokens: () => {},
      handleAuthError: (error) => console.log(error.message),
    }),
  ],
};
const api = createHttpClient({ middleware });

export const getPerson = (id: number) => {

  return api
    .get({ url: `person/${id}` })
    .catch((error) => {
      const errorResponse = {
        status: 'error',
        code: error.status ?? 0
      };

      return errorResponse;
    });
};
```

### **Utilities:**

* Check data type

>  - Array
>  - AbortSignal
>  - AbortController
>  - AsyncFunction
>  - Boolean
>  - Date
>  - Function
>  - Headers
>  - Number
>  - Null
>  - Object
>  - Promise
>  - String
>  - Symbol


```javascript
import { is } from 'extended-fetch';

const year = is.Date(unknownVar) ? unknownVar.getFullYear() : null;

console.log({ year });
```

* Safely stringify JSON

```javascript
import { safeJsonStringify } from 'extended-fetch';

const stringifiedJson = safeJsonStringify({ data: ['test'] });
const stringifiedJsonPretty = safeJsonStringify({ pretty: { data: 'test' } }, 2);

console.log({ stringifiedJson, stringifiedJsonPretty });
```

* Extend fetch headers

```javascript
import { applyHeaders } from 'extended-fetch';

const authHeaders = { 'Authorization': `Bearer ${tokens.accessToken}` };

applyHeaders(authHeaders, responseHeadersFromFetchInstance);

console.log(responseHeadersFromFetchInstance);
```
