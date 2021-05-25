// Import/export base data types modules

const components = {
  date: {
    string: () => import("./date/String")
  },
  time: {
    string: () => import("./time/String")
  }
};

export default Object.keys(components).reduce((result, name) => {
  Object.keys(components[name]).forEach(
    key => (result[`${name}-${key}`] = components[name][key])
  );
  return result;
}, {});
