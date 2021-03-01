// Dependencies
import { beforeEachGuard, getRoutes } from "./router";
import store from "./store";
import http from "../http/plugin";
import authHttp from "./http";
import persist from "./persist";

// Local variables
const defaultOptions = {
  allowPasswordReset: true,
  allowUserRegistration: true,
  automaticLogin: true
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
      forceLogout: message => {
        options.store.dispatch("auth/logout");
        if (options.router.currentRoute.name !== "login") {
          options.router.replace({
            name: "login",
            query: { alertType: "warning", alertMessage: message }
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
    options.router.beforeEach((to, from, next) =>
      beforeEachGuard(to, from, next)
    );

    // Register auth vuex module
    options.store.registerModule("auth", store);

    // Automatic login on start application (router guards will redirect accordingly)
    // TODO test with forgot password and do sync before entering root route (add a meta field and run on beforeCreate?)

    // if (options.automaticLogin) {
    //   options.store
    //     .dispatch("auth/autoLogin")
    //     .then(user => {
    //       console.log("Automatically logged in:", user);
    //     })
    //     .catch(error => {
    //       // Token found but refresh failed
    //       options.forceLogout();
    //       console.warn("Automatic login failed:", error);
    //     });
    // }
  }
};
