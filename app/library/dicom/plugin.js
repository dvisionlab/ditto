import * as utils from "./utils";

// Async imports based on options for partial functionalities support
const defaultOptions = {
  canvas: true,
  dataTypes: false,
  import: true,
  series: false,
  utils: false
};

export default async (Vue, options) => {
  options = { ...defaultOptions, ...options };

  // setup larvitar
  utils.setup(options.store);

  // canvas component
  if (options.canvas) {
    Vue.component("ditto-dicom-canvas", () => import("./render/Canvas"));
    Vue.component("ditto-dicom-canvas-data", () =>
      import("./render/CanvasData")
    );
  }

  if (options.dataTypes) {
    const dicomDataTypes = () => import("../../../dicomDataTypes");
    dicomDataTypes().then(({ default: components }) => {
      Object.keys(components).forEach(key =>
        Vue.component(`DittoDataType${key}`, components[key])
      );
    });
  }

  // import component
  if (options.import) {
    Vue.component("ditto-dicom-import", () => import("./import/Component"));
    Vue.component("ditto-dicom-import-modal", () => import("./import/Wrapper"));
  }

  // series components
  if (options.series) {
    Vue.component("ditto-dicom-series-summary", () =>
      import("./sop/SeriesSummary.vue")
    );
  }

  // expose utilities functions
  if (options.utils) {
    Vue.prototype.$ditto = {
      ...Vue.prototype.$ditto,
      dicom: utils
    };
  }
};
