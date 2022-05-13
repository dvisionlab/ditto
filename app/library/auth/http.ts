// Dependencies
import Vue from "vue";
import { skipAuthorizationInterceptorUrls } from "./utils";

// Local variables

// UNAUTHORIZED: Although the HTTP standard specifies "unauthorized",
// semantically this response means "unauthenticated". That is, the client must
// authenticate itself to get the requested response.
const UNAUTHORIZED_STATUS = 401;

// FORBIDDEN: The client does not have access rights to the content, i.e. they
// are unauthorized, so server is rejecting to give proper response. Unlike
// 401, the client's identity is known to the server.
// const FORBIDDEN_STATUS = 403;

// Utilities

const getQueryStringParams = query => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split("&")
        .reduce((params, param) => {
          const [key, value] = param.split("=");
          params[key] = value
            ? decodeURIComponent(value.replace(/\+/g, " "))
            : "";
          return params;
        }, {})
    : {};
};

const skipAuthorizationInterceptor = url =>
  skipAuthorizationInterceptorUrls.some(skipUrl =>
    url.replace(/^\/|\/$/g, "").startsWith(skipUrl)
  );

// Get current logged user info
const getUser = () => {
  return Vue.$http.get("auth/users/me");
};

// Login and get json web tokens
const login = (email, password) => {
  return new Promise((resolve, reject) => {
    Vue.$http
      .post("auth/jwt/create", null, { email, password })
      .then(({ body: tokens }) => resolve(tokens))
      .catch(error => reject(error));
  });
};

// Refresh access token using the refresh one
const refreshToken = refresh => {
  return new Promise((resolve, reject) => {
    Vue.$http
      .post("auth/jwt/refresh", null, { refresh })
      .then(({ body }) => resolve(body.access))
      .catch(error => reject(error));
  });
};

// Verify access token
const verifyToken = (access, refresh) => {
  return new Promise((resolve, reject) => {
    Vue.$http
      .post("auth/jwt/verify", null, { token: access })
      .then(() => resolve(access))
      .catch(error => {
        if (refresh) {
          refreshToken(refresh)
            .then(token => resolve(token))
            .catch(error => reject(error));
        } else {
          reject(error);
        }
      });
  });
};

// Create a user and send activation email
const createUser = (firstname, lastname, email, password) => {
  const data = {
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
const addAuthorizationInterceptor = ({
  forceLogout,
  readAccessToken,
  readRefreshToken,
  writeAccessToken
}) => {
  // Register the refresh token interceptor (https://laracasts.com/discuss/channels/vue/jwt-auth-with-vue-resource-interceptor)
  Vue.http.interceptors.push((request: any, next: any) => {
    if (skipAuthorizationInterceptor(request.url)) {
      return;
    }

    // Add jwt to all requests
    request.headers.set("Authorization", "Bearer " + readAccessToken());

    next((response: any) => {
      // Update token
      if (response.headers["Authorization"]) {
        writeAccessToken(response.headers["Authorization"]);
      }

      // Check for expired token response and if expired refresh token and resubmit original request,
      // but allow refresh only once
      const [requestUrl, requestParamsString] = request.url.split("?");
      const requestParams = getQueryStringParams(requestParamsString);

      if (response.status === UNAUTHORIZED_STATUS) {
        if (requestParams.alreadyRefreshed) {
          forceLogout(response.statusText);
        } else {
          refreshToken(readRefreshToken())
            .then(token => {
              // Store refreshed token
              writeAccessToken(token);

              // Resubmit original request
              request.url = Vue.$http.getUrl(requestUrl, {
                ...requestParams,
                alreadyRefreshed: true
              });
              Vue.http(request).then(data => data);
            })
            .catch(error => {
              forceLogout(error.statusText);
            });
        }
      }
    });
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
      verifyToken
    };
  }
};
