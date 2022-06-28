# [Hackable HTTP client based on native fetch](https://www.npmjs.com/package/extended-fetch)
![](https://img.shields.io/npm/v/extended-fetch?style=flat-square)
![](https://img.shields.io/node/v/extended-fetch?style=flat-square)
![](https://img.shields.io/npm/dm/extended-fetch?style=flat-square)

* No dependencies
* Middleware can be applied for all requests or single
* Requests can be aborted by timeout
* Modular architecture
* Typescript
* ESM + UMD
* Tiny size < 4KB

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
  const response = await pureResponseInstance.json();

  return { status, statusText, response };
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
