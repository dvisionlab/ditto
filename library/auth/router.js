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
  {
    component: null, // TODO
    path: "/reset-password",
    meta: {
      guest: true
    },
    name: "reset-password"
  },
  // TODO optional
  {
    component: null, // TODO
    path: "/register",
    meta: {
      guest: true
    },
    name: "register"
  }
];

// Before each navigation guard
export const beforeEachGuard = (to, from, next) => {
  console.log("BEFORE EACH");
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
