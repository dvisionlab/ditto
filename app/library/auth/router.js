// Dependencies
import persist from "./persist";
import LoginForm from "./components/LoginForm";
import AuthWrapper from "./components/Wrapper";

// Local variables
let alreadyAutoLoggedIn = false;

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
          children: [
            {
              path: "",
              name: "forgot-password",
              meta: { guest: true },
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
        next(`${options.baseRoute}${options.redirectAuthUsers}`);
      }
    }
    // auth needed
    else if (to.matched.some(record => record.meta.auth)) {
      if (persist.getAccessToken() == null) {
        // but user not logged in
        next(`${options.baseRoute}${options.redirectGuestUsers}`);
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
