// Persist auth data in local storage

export default {
  getUser: () => JSON.parse(localStorage.getItem("user")),
  reset: () => {
    localStorage.removeItem("user");
  },
  setUser: value => localStorage.setItem("user", JSON.stringify(value))
};
