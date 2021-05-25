# Http

A Vue plugin that setups the [vue-resource](https://github.com/pagekit/vue-resource) module and exposes some http utilities methods.

## Dependencies

- [vue-resource](https://github.com/pagekit/vue-resource)

## Usage

1. Import the plugin and register it:

```js
import httpPlugin from "@/../ditto/http";
Vue.use(httpPlugin);
```

2. Use the exposed methods as you wish (the methods are available at `Vue.$http` (or `this.$http` if you have access to a component scope)):

```js
Vue.$http
  .get("test")
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### Options

Available plugin options:

| Option                          | Description                                                                                                                                                        | Default |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| **httpRoot**                    | the base url of _all_ the http requests, (see the [docs](https://github.com/pagekit/vue-resource/blob/develop/docs/config.md) for more information)                | `/`     |
| **addTrailingSlashInterceptor** | whether to add an interceptor that adds a trailing slash `/` to all http request urls, should be used only until the django/vue router bug is resolved **@simone** | `false` |

```js
Vue.use(httpPlugin, {
  httpRoot: "/api",
  addTrailingSlashInterceptor: true
});
```

### Extensions

Extensions consists in custom plugins that you want to install _after_ http plugin setup ends. The plugin extensions can access to the http plugin functionalities and can have their _options_ object.

```js
import customPlugin from "...";
const customPluginOptions = {...};

Vue.use(httpPlugin, {
  extensions: [
    {
      plugin: customPlugin,
      options: customPluginOptions
    }
  ]
});
```

## Methods

The plugin exposes the following methods, available at `Vue.$http` (or `this.$http` if you have access to a component scope):

- `addHeader(key, value)` adds a new (key, value) pair to the http headers of _all_ the http requests
- `setRoot(url)` updates the base url of _all_ the http requests (see _options_)
- `getUrl(endpoint, params, useRandomString = true)` given an object of _params_ returns the string composed adding to the _endpoint_ string the required request parameters; when _useRandomString_ is true, a random parameter is added to the resulting string (the random parameter is used to prevent request result caching in IE); **example**: `getUrl("test", {a: 1, b: 2})` => `test?a=1&b=2&r=asdfasd`

All these methods return a _Promise_:

- `get(endpoint, params)` computes the request url using the _getUrl_ function and resolves the promise when the http _get_ request receives a response, returning that response as a _json_ object
- `patch(endpoint, params, data)` computes the request url using the _getUrl_ function and resolves the promise when the http _patch_ request receives a response; _data_ is the body of the http request
- `post(endpoint, params, data)` computes the request url using the _getUrl_ function and resolves the promise when the http _post_ request receives a response; _data_ is the body of the http request
- `remove(endpoint, params)` computes the request url using the _getUrl_ function and resolves the promise when the http _delete_ request receives a response

## Example code

See the [http examples code](https://github.com/dvisionlab/ditto/tree/master/app/src/examples/http) for more information.
