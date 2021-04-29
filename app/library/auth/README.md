# Auth

A Vue plugin that provides a set of functionalities and components to manage the app authentication automatically.

## Dependencies

- Ditto
- Vuetify

## Usage

```js
import authPlugin from "@/../ditto/auth";
import AuthWrapper from "@/components/AuthWrapper";

Vue.use(authPlugin, {
  addTrailingSlashInterceptor: true,
  allowUserRegistration: false,
  logrocket: { module: logrocket, customString: "zjgsf2/doors-poc" },
  router,
  store,
  wrapperComponent: AuthWrapper
});
```

## Options

```js
const defaultOptions = {
  accountPanelComponent: true,
  addTrailingSlashInterceptor: false,
  allowPasswordReset: true,
  allowUserRegistration: true,
  // application path of reserved app section
  authRoot: "",
  // try to login automatically from /login route
  autoLogin: true,
  // http requests base url
  httpRoot: "/",
  // log rocket module and custom string
  logrocket: null
};
```
