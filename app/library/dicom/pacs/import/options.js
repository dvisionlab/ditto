const defaultQueryParameters = [
  "PatientID",
  "PatientName",
  "PatientBirthDate",
  "PatientSex",
  "AccessionNumber",
  "StudyDescription",
  "Modality",
  "AcquisitionDate",
  "AcquisitionTime",
  "ReferringPhysicianName",
  "NameOfPhysiciansReadingStudy",
  "InstitutionName"
];

const defaultQueryResultsKey = "index";

const defaultSteps = [
  {
    action: { disabled: () => false, text: "query" },
    back: () => false,
    next: data => data.length > 0,
    status: { loading: false, error: null }
  },
  {
    action: {
      disabled: selectedData => selectedData.length <= 0,
      text: "retrieve"
    },
    back: () => true,
    next: selectedData => selectedData.length > 0
  },
  {
    action: {
      disabled: (_, status) =>
        status.completed !== true ||
        Object.values(status.progress).findIndex(v => v === 100) < 0,
      text: "open viewer"
    },
    back: status => status.completed === true,
    next: () => false,
    closeConfirmation: status => status.completed,
    status: { completed: false, loading: false, errors: {}, progress: {} }
  }
];

const getHeaders = () =>
  defaultQueryParameters.map(value => ({
    cellClass: `cell-${value}`,
    sortable: true,
    text: `metadata-${value}`,
    value
  }));

const getQueryResultsKey = options =>
  options.queryResultsKey || defaultQueryResultsKey;

const getSteps = () => [...defaultSteps];

export { getHeaders, getQueryResultsKey, getSteps };

