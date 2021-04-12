import * as utils from "./utils";

// Async imports based on options for partial functionalities support
const defaultOptions = {
  canvas: true,
  import: true,
  utils: false
};

export default async (Vue, options) => {
  options = { ...defaultOptions, ...options };

  // setup larvitar
  utils.setup(options.store);

  // canvas component
  if (options.canvas) {
    Vue.component("ditto-dicom-canvas", () => import("./render/Canvas"));
  }

  // import component
  if (options.import) {
    Vue.component("ditto-dicom-import", () => import("./import/Component"));
    Vue.component("ditto-dicom-import-modal", () => import("./import/Wrapper"));
  }

  // expose utilities functions
  if (options.utils) {
    Vue.prototype.$ditto = {
      ...Vue.prototype.$ditto,
      dicom: utils
    };
  }
};
