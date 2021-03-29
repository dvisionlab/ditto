// Async imports based on options for partial functionalities support
const defaultOptions = {
  import: true
};

export default (Vue, options) => {
  options = { ...defaultOptions, ...options };

  // import module
  if (options.import) {
    Vue.component("ditto-dicom-import", () => import("./import/Component"));
  }
};
