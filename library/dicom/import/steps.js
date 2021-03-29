// Import steps configuration
// --------------------------

// Loaded series table headers
const defaultTableHeaders = [
  { sortable: false, text: "", value: "preview" },
  { sortable: false, text: "series-description", value: "seriesDescription" }
];

// Loaded series actions
const defaultActions = [
  {
    disabled: true,
    emitter: "dicom-import-upload",
    hint: "series will be saved in your dashboard",
    text: "upload series",
    value: 0
  },
  {
    disabled: true,
    emitter: "dicom-import-upload-and-open",
    hint: "series will be saved in your dashboard",
    text: "upload series and open viewer",
    value: 1
  },
  {
    disabled: false,
    emitter: "dicom-import-open",
    default: true,
    hint:
      "you won't be able to access these series again once the browser session will be lost",
    text: "open viewer without uploading",
    value: 2
  }
];

// TODO remove back/next, review confirm options
const defaultSteps = [
  {
    label: "import-files",
    component: () => import("./steps/Step1"),
    back: () => false,
    next: series => series.length > 0
  },
  {
    label: "select-series",
    component: () => import("./steps/Step2"),
    back: () => true,
    next: () => false,
    actions: defaultActions,
    tableHeaders: defaultTableHeaders
  },
  {
    label: "upload",
    component: () => import("./steps/Step3"),
    back: () => false,
    next: () => false
  }
];

export default (options = {}) => {
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
