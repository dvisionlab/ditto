// Async imports based on options for partial functionalities support
const defaultOptions = {
  canvas: true,
  import: true
};

export default (Vue, options) => {
  options = { ...defaultOptions, ...options };

  // canvas component
  if (options.canvas) {
    Vue.component("ditto-dicom-canvas", () => import("./render/Canvas"));
  }

  // import component
  if (options.import) {
    Vue.component("ditto-dicom-import", () => import("./import/Component"));
  }
};
