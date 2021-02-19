// Dependencies
import request from "superagent";

// TODO expired token interceptor: https://laracasts.com/discuss/channels/vue/jwt-auth-with-vue-resource-interceptor

// ====================================================
// Check token validity and refresh it if necessary ===
// ====================================================
export function verifyAndRefresh(accessToken) {
  return new Promise((resolve, reject) => {
    request
      .post("/auth/jwt/verify/")
      .send({ token: accessToken })
      .then(() => resolve(accessToken))
      .catch(() => {
        refreshToken()
          .then(token => resolve(token))
          .catch(error => reject(error));
      });
  });
}

// ==============================================
// Refresh access token using the refresh one ===
// ==============================================
export function refreshToken(refreshToken) {
  return request.post("/auth/jwt/refresh/").send({ refresh: refreshToken });
}

// ================================
// Login and get json web token ===
// ================================
export function login(email, password) {
  return request.post("/auth/jwt/create/").send({ email, password });
}

// ================================
// Get current logged user info ===
// ================================
export function getCurrentUser(token) {
  return request.get("/auth/users/me/").set("Authorization", "Bearer " + token);
}

// ===========================================
// Create a user and send activation email ===
// ===========================================
export function createUser(firstname, lastname, email, password) {
  let data = {
    email,
    firstname,
    lastname,
    password
  };

  return request.post("/auth/users/").send(data);
}

// ================================================
// Reset password and send reset password email ===
// ================================================
export function resetPasswordWithEmail(email) {
  return request.post("/auth/users/reset_password/").send({ email });
}
