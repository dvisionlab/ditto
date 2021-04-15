// Import steps configuration
// --------------------------

import { stackMetadata, stackTools } from "../defaults";

// Preview canvas tools
const defaultCanvasTools = stackTools.preview;

// Loaded series extracted metadata and table headers
const patientMetadata = stackMetadata.patient;
const studyMetadata = stackMetadata.study;

const defaultMetadata = [
  ...patientMetadata,
  ...studyMetadata,
  ...stackMetadata.series
];

const requiredMetadata = ["studyUID", "studyDescription", "seriesUID"];

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
    cacheStacks: false,
    storeStacks: true,
    text: "upload series"
  },
  {
    disabled: true,
    emitter: "dicom-import-upload-and-open",
    hint: "series will be saved in your dashboard",
    cacheStacks: true,
    storeStacks: true,
    text: "upload series and open viewer"
  },
  {
    default: true,
    disabled: false,
    emitter: "dicom-import-open",
    hint:
      "you won't be able to access these series again once the browser session will be lost",
    cacheStacks: true,
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

export const getMetadata = options => {
  if (options.metadata) {
    // Add required keys if missing
    requiredMetadata.forEach(key => {
      if (!options.metadata.find(value => key == value)) {
        options.metadata.push(key);
      }
    });
    return options.metadata;
  }

  return defaultMetadata;
};

export const getHeaders = options => {
  if (options.headers) {
    return options.headers;
  }

  if (options.metadata) {
    return computeHeaders(
      options.metadata.filter(v => !studyMetadata.find(vv => vv == v))
    );
  }

  const omit = [...patientMetadata, ...requiredMetadata];
  let headers = computeHeaders(
    defaultMetadata.filter(v => !omit.find(vv => vv == v))
  );
  // Add patient header
  headers.splice(1, 0, {
    keys: patientMetadata,
    sortable: false,
    text: "patient",
    value: "patient"
  });

  return headers;
};

export const getSteps = (options = {}) => {
  let steps = [...defaultSteps];
  if (options.steps) {
    options.steps.forEach((step, i) => {
      if (step) {
        if (step.actions && steps[i].actions) {
          step.actions = steps[i].actions.map((a, j) => ({
            ...a,
            ...step.actions[j]
          }));
        }

        steps[i] = { ...steps[i], ...step };
      }
    });
  }
  return steps;
};
