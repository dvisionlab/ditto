# Auth plugin

A Vue plugin that provides a set of functionalities and components to manage the app authentication automatically.

## Dependencies

- Ditto [http](../http/README.md)
- Ditto [form](../form/README.md)
- Vue
- Vuetify

## Usage

1. Configure your application _router_ routes with the following _meta_ options according to your needs:

- **auth**: to make the route accessible by authenticated users **only**
- **guest**: to make the route accessible by **not** authenticated users **only**
- **autoLogin**: to let this plugin try to automatically login a user when entering an **auth** route

If no meta _auth_ or _guest_ option is provided the route will be accessible by both authenticated and not authenticated users.

Router routes configuration example:

```js
const routes = [
  // public section (all users)
  {
    path: "/splash",
    name: "webapp-splash-screen",
    component: ...
  },
  // guest section (unauth users only)
  {
    path: "/guest",
    name: "webapp-guest",
    component: ...,
    meta: { guest: true }
  },
  // private section (auth users only)
  {
    path: "/",
    name: "webapp-home",
    component: ...,
    meta: { auth: true, autoLogin: true }
  }
];
```

If you need to define multiple auth routes and you want to use the _autoLogin_ feature the best approach is to set the _auth_ and the _autoLogin_ meta fields on a top level route and define the other auth routes as sub routes:

```js
const routes = [
  ...,
  // private section (auth users only)
  {
    path: "/",
    name: "webapp-home",
    component: ...,
    meta: { auth: true, autoLogin: true },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: ...
      },
      {
        path: "viewer",
        name: "viewer",
        component: ...
      }
    ]
  }
];
```

2. Import the plugin and register it:

```js
import authPlugin from "@/../ditto/auth";

Vue.use(authPlugin, {
  router,
  store
});
```

The plugin needs your application _router_ and _store_ objects. The plugin registers a _store submodule_ named _auth_ you can access from your application if you need it. You may need to use the following _getters_:

- **isAuth**: is `true` if a user is authenticated

and the following _actions_:

- **autoLogin**: logs the user in looking for the needed information in the _localStorage_
- **login**: logs the user in using the _email_ and _password_ values that che action receives as parameters
- **logout**: logs the user out

## Options

Available plugin options:

| Option                          | Description                                                                                                                                                                                                            | Default |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| **accountPanelComponent**       | whether this plugin should register the `AccountPanel` component globally (this component will be available in your application with the name of `ditto-auth-account-panel` and shows the current logged in user data) | `true`  |
| **addTrailingSlashInterceptor** |                                                                                                                                                                                                                        | `false` |
| **allowPasswordReset**          | whether this plugin should suport password reset                                                                                                                                                                       | `true`  |
| **allowUserRegistration**       | whether this plugin should suport new users registration                                                                                                                                                               | `true`  |
| **authRoot**                    | application path of your private application section (= accessible to authenticated users only) as defined in your application routes                                                                                  | ""      |
| **autoLogin**                   | whether to let this plugin try to login automatically from the `/login` route (this route is created and managed by this plugin)                                                                                       | `true`  |
| **httpRoot**                    | http requests base url, used by the ditto [http](../http/README.md) module                                                                                                                                             | `/`     |
| **logrocket**                   | if you want to activate _logrocket_ this options should be an object like this: `{module: the logrocket module, customString: the logrocket connection string for your app }`                                          | `null`  |
| **wrapperComponent**            | Vue component to wrap the default Vue components (login form, registration form...) provided by this plugin; should contain a `<router-view >` tag to render the default auth component                                | `null`  |

Here is a custom configuration example:

```js
import logrocket from "logrocket";
import AuthWrapper from "@/components/AuthWrapper";

const defaultOptions = {
  accountPanelComponent: false,
  addTrailingSlashInterceptor: true,
  allowPasswordReset: false,
  allowUserRegistration: false,
  authRoot: "/webapp",
  autoLogin: false,
  httpRoot: "/",
  logrocket: { module: logrocket, customString: "asdf" },
  wrapperComponent: AuthWrapper
};
```

### Account panel component options

The account panel component can be customized using its _props_:

| Prop               | Description                                                                                                         | Type    | Default                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------- |
| **activatorClass** | the class of the panel activator button                                                                             | String  |                                             |
| **dark**           | the vuetify _dark_ option                                                                                           | Boolean | `false`                                     |
| **direction**      | where to show the panel on panel activator button click or hover (allowed values: `bottom`, `bottom-left`, `right`) | String  | direction computed automatically by Vuetify |
| **icon**           | the icon of the panel activator button                                                                              | String  | "mdi-account"                               |
| **label**          | the label of the panel activator button                                                                             | String  | "account"                                   |
| **mobile**         | whether to show the mobile version of this component                                                                | Boolean | `false`                                     |
| **settingsRoute**  | the route of the personal settings user page (when specified the component renders a router link to this route)     | String  |                                             |
| **openOnHover**    | whether to open the panel on panel activator hover                                                                  | Boolean | `false`                                     |

and its _slots_:

| Slot    | Content                                    |
| ------- | ------------------------------------------ |
| default | the custom account panel activator element |

## Example code

See the [auth examples code](https://github.com/dvisionlab/ditto/tree/master/app/src/examples/auth) for more information.
