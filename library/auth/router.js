// Dependencies
import persist from "./persist";
import LoginForm from "./components/LoginForm";

// Auth plugin routes
export const getRoutes = options => {
  return [
    {
      component: LoginForm,
      path: "/login",
      meta: {
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
          path: "/forgot-password",
          meta: {
            guest: true
          },
          name: "forgot-password"
        }
      : null,
    options.allowPasswordReset
      ? {
          component: () => import("./components/ChangePassword"),
          path: "/reset-password/:uid/:token",
          meta: {
            guest: true
          },
          name: "reset-password",
          props: true
        }
      : null,
    options.allowUserRegistration
      ? {
          component: () => import("./components/SignUp"),
          path: "/register",
          meta: {
            guest: true
          },
          name: "register"
        }
      : null
  ].filter(Boolean); // equal to _.compact
};

// Before each navigation guard
export const beforeEachGuard = (to, from, next) => {
  // auth not needed
  if (to.matched.some(record => record.meta.guest)) {
    if (persist.getAccessToken() == null) {
      next();
    } else {
      // but user is logged in
      next("/");
    }
  }
  // auth needed
  else {
    // but user not logged in
    if (persist.getAccessToken() == null) {
      next({ name: "login" });
    } else {
      next();
    }
  }
};
