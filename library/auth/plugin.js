// Dependencies
import { beforeEachGuard, routes } from "./router";
import store from "./store";

// Local variables
const defaultOptions = {
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
    options = { ...defaultOptions, ...options };

    // Register auth routes
    routes.forEach(route => options.router.addRoute(route));
    // Register navigation guard
    options.router.beforeEach((to, from, next) =>
      beforeEachGuard(to, from, next)
    );

    // Register auth vuex module
    options.store.registerModule("auth", store);

    // Automatic login on start application
    if (options.automaticLogin) {
      options.store
        .dispatch("auth/autoLogin")
        // TODO match with router navigation guard
        .then(resp => console.log("Automatically logged in:", resp))
        .catch(error => {
          options.store.dispatch("auth/logout");
          console.warn("Automatic login failed:", error);
        });
    }
  }
};
