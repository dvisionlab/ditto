import * as utils from "./utils";
import metadata from "./metadata";

// Async imports based on options for partial functionalities support
const defaultOptions = {
  canvas: true,
  dataTypes: false,
  import: true,
  multiframe: true,
  pacs: false,
  series: false,
  store: undefined,
  toolsStyle: undefined,
  utils: false
};

export default async (Vue, options) => {
  options = { ...defaultOptions, ...options };

  // setup larvitar
  utils.setup(options.store, options.toolsStyle);

  // canvas component
  if (options.canvas) {
    Vue.component("ditto-dicom-canvas", () => import("./render/Canvas"));
    Vue.component("ditto-dicom-canvas-data", () =>
      import("./render/CanvasData")
    );
  }

  if (options.dataTypes) {
    const dicomDataTypes = () => import("../data-types/dicom");
    dicomDataTypes().then(({ default: components }) => {
      Object.keys(components).forEach(key => {
        const name = key
          .split(/(?=[A-Z])/)
          .reduce((string, chunk) => `${string}-${chunk.toLowerCase()}`, "");
        Vue.component(`ditto-data-type${name}`, components[key]);
      });
    });
  }

  // import component
  if (options.import) {
    Vue.component("ditto-dicom-import", () => import("./import/Component"));
    Vue.component("ditto-dicom-import-modal", () => import("./import/Wrapper"));
  }

  // multiframe components
  if (options.multiframe) {
    Vue.component("ditto-dicom-cinematic-tool", () =>
      import("./multiframe/CinematicTool")
    );
  }

  // pacs component
  if (options.pacs) {
    Vue.component("ditto-dicom-pacs-import", () =>
      import("./pacs/import/Component")
    );
    Vue.component("ditto-dicom-pacs-import-modal", () =>
      import("./pacs/import/Wrapper")
    );
  }

  // series components
  if (options.series) {
    Vue.component("ditto-dicom-series-summary", () =>
      import("./sop/SeriesSummary")
    );
  }

  // expose utilities functions
  if (options.utils) {
    Vue.prototype.$ditto = {
      ...Vue.prototype.$ditto,
      dicom: { ...utils, metadataDictionary: metadata }
    };
  }
};
