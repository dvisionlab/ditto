// Dependencies
import persist from "./persist";
import LoginForm from "./components/LoginForm";
import AuthWrapper from "./components/Wrapper";
import Vue from "vue";

// Local variables
//let alreadyAutoLoggedIn = false;

// Auth plugin routes
export const getRoutes = options => {
  const Wrapper = options.wrapperComponent
    ? options.wrapperComponent
    : AuthWrapper;

  return [
    {
      component: Wrapper,
      path: `${options.baseRoute}/login`,
      meta: {
        autoLogin: options.autoLogin,
        guest: true
      },
      children: [
        {
          path: "",
          name: "login",
          component: LoginForm,
          meta: { guest: true },
          props: route => ({
            ...route.query,
            allowPasswordReset: options.allowPasswordReset,
            allowUserRegistration: options.allowUserRegistration,
            title: "",
            dark: true,
            baseRoute: options.baseRoute
          })
        }
      ]
    },
    options.allowPasswordReset
      ? {
          component: Wrapper,
          path: `${options.baseRoute}/forgot-password`,
          meta: { guest: true },
          props: () => ({
            dark: true
          }),
          children: [
            {
              path: "",
              name: "forgot-password",
              meta: { guest: true },
              props: () => ({
                dark: true
              }),
              component: () => import("./components/ForgotPassword")
            }
          ]
        }
      : null,
    options.allowPasswordReset
      ? {
          component: Wrapper,
          path: `${options.baseRoute}/reset-password/:uid/:token`,
          meta: { guest: true },
          children: [
            {
              path: "",
              name: "reset-password",
              meta: { guest: true },
              component: () => import("./components/ChangePassword"),
              props: true
            }
          ]
        }
      : null,
    options.allowUserRegistration
      ? {
          component: Wrapper,
          path: `${options.baseRoute}/register`,
          meta: { guest: true },
          children: [
            {
              path: "",
              name: "register",
              meta: { guest: true },
              component: () => import("./components/SignUp") // TODO
            }
          ]
        }
      : null
  ].filter(Boolean); // equal to _.compact
};

// Before each navigation guard
export const getBeforeEachGuard = options => {
  // meta.guest = true ==> solo utenti non autenticati
  // meta.auth = true ==> solo utenti autenticati
  return async function(to, from, next) {
    let isValidSession = options.store.getters["auth/isAuth"];
    try {
      const response = await Vue.$http.get("auth/check-session");
      console.log(response.message);
      if (response.status == "logged") isValidSession = true;
      else isValidSession = false;
    } catch (error) {
      console.log(error);
      isValidSession = false;
    }

    options.store.commit("auth/update", {
      key: "isValidSession",
      value: isValidSession
    });

    if (!options.store.state.auth.user && isValidSession) {
      options.store.commit("auth/update", {
        key: "user",
        value: persist.getUser()
      });
      Vue.prototype.$isDemoUser = persist.getUser().is_demo;
      Vue.prototype.$isAdminUser = persist.getUser().is_admin;
    }

    // auth not needed
    if (to.matched.some(record => record.meta.guest)) {
      if (!isValidSession) {
        // and user not logged in
        next();
      } else {
        // but user is logged in
        next(`${options.baseRoute}${options.redirectAuthUsers}`);
      }
    }
    // auth needed
    else if (to.matched.some(record => record.meta.auth)) {
      if (!isValidSession) {
        // but user not logged in
        next(`${options.baseRoute}${options.redirectGuestUsers}`);
      } else {
        // and user logged in
        if (options.store.state.auth.user.is_temp) {
          next(false);
        } else {
          next();
        }
      }
    }
    // free route
    else {
      next();
    }
  };
};
