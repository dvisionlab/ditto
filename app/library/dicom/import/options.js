// Import steps configuration
// --------------------------

import metadataDictionary from "../metadata";
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

const requiredMetadata = [
  metadataDictionary.StudyInstanceUID,
  "larvitarSeriesInstanceUID"
];

const computeHeaders = metadata => {
  return [
    { sortable: false, text: "", value: "preview" },
    ...metadata.map(value => ({
      cellClass: `cell-${value}`,
      sortable: true,
      text: `metadata-${value}`,
      value
    }))
  ];
};

// Loaded series actions
const defaultActions = [
  {
    cacheStacks: false,
    closeOnEmit: false,
    disabled: true,
    emitter: "dicom-import-upload",
    hint: "series will be saved in your dashboard",
    storeStacks: true, // TODO clear once uploaded
    text: "upload series"
  },
  {
    cacheStacks: false,
    closeOnEmit: false,
    disabled: true,
    emitter: "dicom-import-upload-and-open",
    hint: "series will be saved in your dashboard",
    storeStacks: true,
    text: "upload series and open viewer"
  },
  {
    cacheStacks: false,
    closeOnEmit: true,
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
    actions: [
      {
        cacheStacks: false,
        closeOnEmit: true,
        disabled: false,
        emitter: "dicom-import-open",
        // hint: "upload will continue in background",
        storeStacks: true,
        text: "open viewer"
      }
    ],
    component: () => import("./steps/Step3"),
    label: "upload",
    back: () => false,
    next: () => false,
    // closeConfirmation: () => this.uploadStatus.completed,
    uploadStatus: null // { loading: false, errors: null, progress: {} }
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

  const omit = [
    ...patientMetadata,
    ...studyMetadata,
    ...requiredMetadata,
    metadataDictionary.SeriesTime
  ];
  let headers = computeHeaders(
    defaultMetadata.filter(v => !omit.find(vv => vv == v))
  );

  // Merge date and time
  let seriesDateHeader = headers.find(
    h => h.value == metadataDictionary.SeriesDate
  );
  seriesDateHeader.keys = [
    metadataDictionary.SeriesDate,
    metadataDictionary.SeriesTime
  ];
  seriesDateHeader.keyTag = "span";
  seriesDateHeader.keyClass = "ml-1";

  // Add patient header
  headers.splice(1, 0, {
    cellClass: "cell-patient",
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
