// Dependencies
import Vue from "vue";
import VueResource from "vue-resource";

// Local variables
const TIMEOUT_STATUS = 0;
const TIMEOUT_STATUS_MESSAGE = "http_response_timeout";
const REQUEST_OPTIONS = {
  timeout: process.env.NODE_ENV == "development" ? 0 : 1000 * 5
};

// Utilities
// ---------

// Generate random string
const getRandomString = () =>
  Math.random()
    .toString(36)
    .substring(2);

// Append params to endpoint
const getUrl = (endpoint, params, useRandomString = true) => {
  // Generate random string to prevent request result caching in IE
  const allParams = useRandomString
    ? { ...(params || {}), r: getRandomString() }
    : params || {};

  let url = endpoint;
  Object.keys(allParams).forEach((key, i) => {
    url += `${i == 0 ? "?" : "&"}${key}=${allParams[key]}`;
  });

  return url;
};

// Customization functions
// -----------------------
const addHeader = (key, value) => (Vue.http.headers.common[key] = value);

const setRoot = url => (Vue.http.options.root = url);

// Interceptors
// ------------
const addTimeoutInterceptor = () => {
  Vue.http.interceptors.push(() => {
    // return response callback
    return response => {
      switch (response.status) {
        // Customize response timeout message
        case TIMEOUT_STATUS:
          response.statusText = response.statusText || TIMEOUT_STATUS_MESSAGE;
          break;
      }
    };
  });
};

const addTrailingSlashInterceptor = () => {
  Vue.http.interceptors.push(request => {
    const [url, params] = request.url.split("?");
    request.url = url.replace(/\/?$/, "/");
    if (params) {
      request.url += `?${params}`;
    }
  });
};

// Requests
// --------

const get = (endpoint, params) => {
  let url = getUrl(endpoint, params);
  return Vue.http.get(url, REQUEST_OPTIONS).then(response => response.json());
};

const patch = (endpoint, params, data) => {
  let url = getUrl(endpoint, params, false);
  return Vue.http.patch(url, data, REQUEST_OPTIONS);
};

// POST request
const post = (endpoint, params, data) => {
  let url = getUrl(endpoint, params, false);
  return Vue.http.post(url, data, REQUEST_OPTIONS);
};

// DELETE requests
const remove = (endpoint, params) => {
  let url = getUrl(endpoint, params, false);
  return Vue.http.delete(url, REQUEST_OPTIONS);
};

// Plugin
export default {
  async install(Vue, { extensions, options }) {
    // Register vue-resource
    Vue.use(VueResource);

    // Setup
    if (options.root) {
      setRoot(options.root);
    }

    // Register interceptors
    addTimeoutInterceptor();

    if (options.addTrailingSlashInterceptor) {
      addTrailingSlashInterceptor();
    }

    // Expose global methods
    Vue.$http = {
      addHeader,
      get,
      getUrl,
      patch,
      post,
      remove,
      setRoot
    };

    // Finally, install http plugin extension
    if (extensions) {
      extensions.map(({ plugin, options }) => Vue.use(plugin, options));
    }
  }
};
