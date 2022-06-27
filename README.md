## Hackable HTTP client based on native fetch

* No dependencies
* Middleware
* Requests can be aborted by timeout
* Modular architecture
* Typescript
* ESM + UMD
* Tiny size < 4KB


### **Basic usage:**

```javascript
const api = createHttpClient();

api.get('/api/books/12')
 .then((jsonFormattedResponse) => {})
 .catch((pureResponseInstance) => {});
```

### **Abort request by timeout:**

```javascript
const api = createHttpClient();

api.get({ url: '/api/books/12', timeout: 10000 });
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
