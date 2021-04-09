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
  }

  if (options.dataTypes) {
    // TODO + update dv import
    // Vue.component("ditto-dicom-data-series-modality", () =>
    //   import("../data-types/dicom/series-modality")
    // );
    // Vue.component("ditto-dicom-data-series-thumbnail", () =>
    //   import("../data-types/dicom/series-thumbnail")
    // );
    // Vue.component("ditto-dicom-data-slice-thickness", () =>
    //   import("../data-types/dicom/slice-thickness")
    // );
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
