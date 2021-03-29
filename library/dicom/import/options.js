// Import steps configuration
// --------------------------

// Preview canvas tools
const defaultCanvasTools = [
  { name: "Wwwc", configuration: {} },
  { name: "StackScrollMouseWheel", configuration: {} }
];

const defaultGetViewportFn = (store, seriesId, canvasId) =>
  store.getters["larvitar/viewport"](canvasId) || {};

// Loaded series extracted metadata and table headers
// TODO all codes?
const defaultMetadata = [
  "patientName",
  "patientSex",
  "seriesDescription",
  "seriesModality",
  "x00080022",
  "numberOfImages",
  "sliceThickness"
];

const computeHeaders = metadata => {
  return [
    { sortable: false, text: "", value: "preview" },
    ...metadata.map(value => ({
      sortable: true,
      text: `metadata-${value}`,
      value
    }))
  ];
};

// Loaded series actions
const defaultActions = [
  {
    disabled: true,
    emitter: "dicom-import-upload",
    hint: "series will be saved in your dashboard",
    storeStacks: false,
    text: "upload series"
  },
  {
    disabled: true,
    emitter: "dicom-import-upload-and-open",
    hint: "series will be saved in your dashboard",
    storeStacks: true,
    text: "upload series and open viewer"
  },
  {
    default: true,
    disabled: false,
    emitter: "dicom-import-open",
    hint:
      "you won't be able to access these series again once the browser session will be lost",
    storeStacks: true,
    text: "open viewer without uploading"
  }
];

// Default import steps configuration
const defaultSteps = [
  {
    component: () => import("./steps/Step1"),
    label: "import-files",
    back: () => false,
    next: series => series.length > 0
  },
  {
    actions: defaultActions,
    component: () => import("./steps/Step2"),
    label: "select-series",
    back: () => true,
    next: () => false
  },
  {
    component: () => import("./steps/Step3"),
    label: "upload",
    back: () => false,
    next: () => false
  }
];

// Exports
// -------

export const getCanvasTools = options => options.tools || defaultCanvasTools;

export const getMetadata = options => options.metadata || defaultMetadata;

export const getHeaders = options => {
  if (options.headers) {
    return options.headers;
  }

  return computeHeaders(options.metadata || defaultMetadata);
};

export const getSteps = (options = {}) => {
  let steps = [...defaultSteps];
  if (options.steps) {
    options.steps.forEach((step, i) => {
      if (step) {
        steps[i] = { ...steps[i], ...step };
      }
    });
  }
  return steps;
};

export const getViewportFn = options =>
  options.getViewportFn || defaultGetViewportFn;
