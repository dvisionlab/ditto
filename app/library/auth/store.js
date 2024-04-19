// Dependencies
import Vue from "vue";
import persist from "./persist";

// Local variables and methods
const initialState = () => {
  return {
    isValidSession: false,
    user: null
  };
};

// Store
export default options => ({
  namespaced: true,
  state: () => initialState(),
  getters: {
    isAuth: state => state.isValidSession
  },
  actions: {
    login({ commit, dispatch }, { email, password }) {
      return new Promise((resolve, reject) => {
        Vue.$http.auth
          .login(email, password)
          .then(message => {
            console.log(message);
            Vue.$http.auth
              .getUser()
              .then(user => {
                commit("update", { key: "user", value: user });
                persist.setUser(user);

                commit("update", { key: "isValidSession", value: true });

                if (options.onLoginSuccess) {
                  options.onLoginSuccess(user);
                }

                resolve({
                  user
                });
              })
              .catch(error => {
                reject(error);
              });
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        Vue.$http.auth
          .logout()
          .then(message => {
            console.log(message);
            persist.reset();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
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
});
