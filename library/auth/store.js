// Dependencies
import * as api from "./api";

// Initial state object
const initialState = options => {
  return {
    accessToken: null,
    refreshToken: null,
    username: null
  };
};

export default {
  namespaced: true,
  state: () => initialState(), // TODO also in localStorage/sessionStorage
  getters: {
    isAuth: state => state.accessToken !== null
  },
  actions: {
    autoLogin({ state }) {
      return api.verifyAndRefresh(state.accessToken);
    },
    login({ commit }, { email, password }) {
      return new Promise((resolve, reject) => {
        api
          .login(email, password)
          .then(({ body }) => {
            const tokens = body;

            api
              .getCurrentUser(tokens.access)
              .then(({ body }) => {
                commit("update", { key: "accessToken", value: tokens.access });
                commit("update", {
                  key: "refreshToken",
                  value: tokens.refresh
                });
                commit("update", { key: "username", value: body });
                resolve({
                  ...tokens,
                  username: body
                });
              })
              .catch(error => {
                commit("reset");
                reject(error);
              });
          })
          .catch(error => reject(error));
      });
    },
    logout({ commit }) {
      commit("reset");
    }
  },
  mutations: {
    reset(state) {
      Object.keys(initialState()).forEach(key => (state[key] = value));
    },
    update(state, { key, value }) {
      if (!initialState().hasOwnProperty(key)) {
        console.warn(`Can not update key "${key}" of the auth store.`);
        return;
      }

      state[key] = value;
    }
  }
};
