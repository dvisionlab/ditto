// Dependencies
import Vue from "vue";
import persist from "./persist";

// Local variables and methods
const initialState = () => {
  return {
    accessToken: null,
    refreshToken: null,
    user: null
  };
};

// Store
export default {
  namespaced: true,
  state: () => initialState(),
  getters: {
    isAuth: state => state.accessToken !== null
  },
  actions: {
    autoLogin({ commit, dispatch }) {
      const accessToken = persist.getAccessToken();

      return new Promise((resolve, reject) => {
        if (accessToken) {
          Vue.$http.auth
            .verifyToken(accessToken, persist.getRefreshToken())
            .then(newAccessToken => {
              persist.setAccessToken(newAccessToken);
              commit("update", { key: "accessToken", value: newAccessToken });
              commit("update", {
                key: "refreshToken",
                value: persist.getRefreshToken()
              });
              commit("update", { key: "user", value: persist.getUser() });
              resolve(persist.getUser());
            })
            .catch(error => {
              dispatch("logout");
              reject(
                error.body && error.body.detail ? error.body.detail : error.body
              );
            });
        } else {
          dispatch("logout");
          reject("Access token not found.");
        }
      });
    },
    login({ commit, dispatch }, { email, password }) {
      return new Promise((resolve, reject) => {
        Vue.$http.auth
          .login(email, password)
          .then(tokens => {
            persist.setAccessToken(tokens.access);
            persist.setRefreshToken(tokens.refresh);

            Vue.$http.auth
              .getUser()
              .then(user => {
                commit("update", { key: "accessToken", value: tokens.access });
                commit("update", {
                  key: "refreshToken",
                  value: tokens.refresh
                });
                commit("update", { key: "user", value: user });
                persist.setUser(user);
                resolve({
                  ...tokens,
                  user
                });
              })
              .catch(error => {
                dispatch("logout");
                reject(error);
              });
          })
          .catch(error => {
            dispatch("logout");
            reject(error);
          });
      });
    },
    logout({ commit }) {
      commit("reset");
      persist.reset();
    }
  },
  mutations: {
    reset(state) {
      Object.keys(initialState()).forEach(key => (state[key] = null));
    },
    update(state, { key, value }) {
      if (!Object.prototype.hasOwnProperty.call(initialState(), key)) {
        console.warn(`Can not update key "${key}" of the auth store.`);
        return;
      }

      state[key] = value;
    }
  }
};
