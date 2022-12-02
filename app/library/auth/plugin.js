// Dependencies
import { getBeforeEachGuard, getRoutes } from "./router";
import getStore from "./store";
import http from "../http/plugin";
import authHttp from "./http";
import persist from "./persist";

// Local variables
const defaultOptions = {
  accountPanelComponent: true,
  addTrailingSlashInterceptor: false,
  allowPasswordReset: true,
  allowUserRegistration: true,
  // try to login automatically from /login route
  autoLogin: true,
  // application base route
  baseRoute: "",
  // http requests base url
  httpRoot: "/",
  // log rocket module and custom string
  logrocket: null,
  // redirect urls for users that...
  redirectAuthUsers: "", // ...are auth but goes on a guest route
  redirectGuestUsers: "/login", // ..are not auth but goes on an auth route
  // wrapper component for auth routes
  wrapperComponent: null
};

// Plugin
export default {
  install(Vue, options) {
    if (!options || !options.router) {
      throw new Error("Please initialise the auth plugin with a Vue router.");
    }

    if (!options || !options.store) {
      throw new Error("Please initialise the auth plugin with a Vuex store.");
    }

    // Options override
    options = {
      ...defaultOptions,
      ...options,
      forceLogin: () => {
        return options.store
          .dispatch("auth/autoLogin")
          .then(user => console.log("Automatically logged in:", user))
          .catch(error => {
            options.store.dispatch("auth/logout");
            console.warn("Automatic login failed:", error);
          });
      },
      forceLogout: message => {
        options.store.dispatch("auth/logout");
        if (options.router.currentRoute.name !== "login") {
          options.router.replace({
            name: "login",
            query: message
              ? { alertType: "warning", alertMessage: message }
              : null
          });
        }
      },
      readAccessToken: persist.getAccessToken,
      readRefreshToken: persist.getRefreshToken,
      writeAccessToken: value => {
        persist.setAccessToken(value);
        options.store.commit("auth/update", { key: "accessToken", value });
      }
    };

    // Setup logrocket
    if (options.logrocket && process.env.NODE_ENV == "production") {
      options.logrocket.module.init(options.logrocket.customString);
      options.oldOnLoginSuccess = options.onLoginSuccess;
      options.onLoginSuccess = user => {
        if (options.oldOnLoginSuccess) {
          options.oldOnLoginSuccess(user);
        }
        options.logrocket.module.identify(user.id, user);
      };
    }

    // Register http plugin with auth extension
    Vue.use(http, {
      extensions: [
        {
          plugin: authHttp,
          options
        }
      ],
      options
    });

    // Register auth routes
    getRoutes(options).forEach(route => options.router.addRoute(route));
    // Register navigation guard
    options.router.beforeEach(getBeforeEachGuard(options));

    // Register auth vuex module
    options.store.registerModule("auth", getStore(options));

    // Register components
    if (options.accountPanelComponent) {
      Vue.component("ditto-auth-account-panel", () =>
        import("./components/AccountPanel")
      );
    }

    // Sync accessToken localStorage value between tabs
    window.addEventListener("storage", e => {
      if (e.key === "access-token") {
        if (!e.newValue) {
          // automatically log out
          options.forceLogout();
        }
      }
    });
  }
};
