// Dependencies
import { beforeEachGuard, routes } from "../router";
import store from "../store";

// Local variables
const defaultOptions = {}; // TODO

// Plugin
export default {
  install(Vue, options) {
    if (!options || !options.router) {
      throw new Error("Please initialise the auth plugin with a Vue router.");
    }

    if (!options || !options.store) {
      throw new Error("Please initialise the auth plugin with a Vuex store.");
    }

    // Register auth routes
    routes.forEach(route => options.router.addRoute(route));
    // Register navigation guard
    options.router.beforeEach = beforeEachGuard;

    // Register auth vuex module
    options.store.registerModule("auth", store);

    // Automatic login on start application
    Vue.mixin({
      created() {
        options.store
          .dispatch("auth/login")
          // TODO match with router navigation guard
          .then(resp => console.log("Automatic login", resp))
          .catch(error => {
            options.store.dispatch("auth/logout");
            console.error(error);
          });
      }
    });
  }
};
