// Dependencies
import persist from "./persist";
import LoginForm from "./components/LoginForm";

// Auth plugin routes
export const routes = [
  {
    component: LoginForm,
    path: "/login",
    meta: {
      guest: true
    },
    name: "login",
    props: route => ({ autoLoggedOut: route.query.autoLoggedOut })
  },
  // TODO optionals
  {
    component: () => import("./components/ForgotPassword"),
    path: "/forgot-password",
    meta: {
      guest: true
    },
    name: "forgot-password"
  },
  {
    component: () => import("./components/ResetPassword"),
    path: "/reset-password",
    meta: {
      guest: true
    },
    name: "reset-password"
  },
  {
    component: null,
    path: "/register",
    meta: {
      guest: true
    },
    name: "register"
  }
];

// Before each navigation guard
// TODO verify token?
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
      next({ name: "login", query: { autoLoggedOut: "unauthorized" } });
    } else {
      next();
    }
  }
};
