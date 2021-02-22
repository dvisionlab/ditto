// Persist auth data in local storage

export default {
  getAccessToken: () => localStorage.getItem("access-token"),
  getRefreshToken: () => localStorage.getItem("refresh-token"),
  getUser: () => JSON.parse(localStorage.getItem("user")),
  reset: () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("user");
  },
  setAccessToken: value => localStorage.setItem("access-token", value),
  setRefreshToken: value => localStorage.setItem("refresh-token", value),
  setUser: value => localStorage.setItem("user", JSON.stringify(value))
};
