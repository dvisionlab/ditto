import Vue from "vue";
import { skipAuthorizationInterceptorUrls, getCookie } from "./utils";

const skipAuthorizationInterceptor = url =>
  skipAuthorizationInterceptorUrls.some(skipUrl =>
    url.replace(/^\/|\/$/g, "").startsWith(skipUrl)
  );

// Get current logged user info
const getUser = () => {
  return Vue.$http.get("auth/users/me");
};

// Session login
const login = (username, password) => {
  return new Promise((resolve, reject) => {
    Vue.$http
      .post("auth/login-session", null, { username, password })
      .then(response => {
        resolve(response.data.message);
      })
      .catch(error => reject(error));
  });
};

// Check BE session validity
const checkSession = () => {
  return Vue.$http.get("auth/check-session");
};

const logout = () => {
  return new Promise((resolve, reject) => {
    Vue.$http
      .post("auth/logout-session")
      .then(response => {
        resolve(response.data.message);
      })
      .catch(error => reject(error));
  });
};

const tempSession = data => {
  return new Promise((resolve, reject) => {
    Vue.$http
      .post("auth/temp-session", null, data)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => reject(error));
  });
};

// Create a user and send activation email
const createUser = (firstname, lastname, email, password) => {
  let data = {
    email,
    firstname,
    lastname,
    password
  };

  return Vue.$http.post("auth/users", null, data);
};

// Request password reset and send a reset password email
const requestPasswordReset = email =>
  Vue.$http.post("auth/users/reset_password", null, { email });

// Send new password
const resetPassword = (uid, token, new_password, re_new_password) =>
  Vue.$http.post("/auth/users/reset_password_confirm", null, {
    uid,
    token,
    new_password,
    re_new_password
  });

// Authorization interceptor
const addAuthorizationInterceptor = () => {
  Vue.http.interceptors.push(request => {
    if (skipAuthorizationInterceptor(request.url)) {
      return;
    }

    // Add CSRF Token to requests header
    if (request.method !== "GET") {
      const csrfToken = getCookie("csrftoken");
      if (csrfToken) {
        request.headers.set("X-CSRFToken", csrfToken);
      }
    }
  });
};

// Install http extension for vue-resource
export default {
  install(Vue, options) {
    // Interceptors
    addAuthorizationInterceptor(options);

    // Exposed methods
    Vue.$http.auth = {
      createUser,
      getUser,
      login,
      requestPasswordReset,
      resetPassword,
      checkSession,
      logout,
      tempSession
    };
  }
};
