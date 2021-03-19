// Dependencies
import persist from "./persist";
import LoginForm from "./components/LoginForm";

// Local variables
let alreadyAutoLoggedIn = false;

// Auth plugin routes
export const getRoutes = options => {
  return [
    {
      component: LoginForm,
      path: `${options.authRoot}/login`,
      meta: {
        autoLogin: options.autoLogin,
        guest: true
      },
      name: "login",
      props: route => ({
        ...route.query,
        allowPasswordReset: options.allowPasswordReset,
        allowUserRegistration: options.allowUserRegistration
      })
    },
    options.allowPasswordReset
      ? {
          component: () => import("./components/ForgotPassword"),
          path: `${options.authRoot}/forgot-password`,
          meta: {
            guest: true
          },
          name: "forgot-password"
        }
      : null,
    options.allowPasswordReset
      ? {
          component: () => import("./components/ChangePassword"),
          path: `${options.authRoot}/reset-password/:uid/:token`,
          meta: {
            guest: true
          },
          name: "reset-password",
          props: true
        }
      : null,
    options.allowUserRegistration
      ? {
          component: () => import("./components/SignUp"), // TODO
          path: `${options.authRoot}/register`,
          meta: {
            guest: true
          },
          name: "register"
        }
      : null
  ].filter(Boolean); // equal to _.compact
};

// Before each navigation guard
export const getBeforeEachGuard = options => {
  // meta.guest = true ==> solo utenti non autenticati
  // meta.auth = true ==> solo utenti autenticati
  return async function(to, from, next) {
    if (
      alreadyAutoLoggedIn == false &&
      to.matched.some(record => record.meta.autoLogin)
    ) {
      alreadyAutoLoggedIn = true;
      await options.forceLogin();
    }

    // auth not needed
    if (to.matched.some(record => record.meta.guest)) {
      if (persist.getAccessToken() == null) {
        // and user not logged in
        next();
      } else {
        // but user is logged in
        next(`${options.authRoot}/`);
      }
    }
    // auth needed
    else if (to.matched.some(record => record.meta.auth)) {
      if (persist.getAccessToken() == null) {
        // but user not logged in
        next({ name: "login" });
      } else {
        // and user logged in
        next();
      }
    }
    // free route
    else {
      next();
    }
  };
};
