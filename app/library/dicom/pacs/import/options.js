const defaultQueryParameters = [
  { value: "PatientID" },
  { value: "PatientName" },
  { value: "PatientBirthDate", type: "date" },
  {
    value: "PatientSex",
    type: "select",
    items: [
      { text: "Male", value: "M" },
      { text: "Female", value: "F" },
      { text: "Other", value: "O" }
    ],
    clearable: true
  },
  { value: "AccessionNumber" },
  { value: "StudyDescription" },
  {
    value: "Modality",
    type: "select",
    items: [
      "AR",
      "ASMT",
      "AU",
      "BDUS",
      "BI",
      "BMD",
      "CR",
      "CT",
      "CTPROTOCOL",
      "DG",
      "DOC",
      "DX",
      "ECG",
      "EPS",
      "ES",
      "FID",
      "GM",
      "HC",
      "HD",
      "IO",
      "IOL",
      "IVOCT",
      "IVUS",
      "KER",
      "KO",
      "LEN",
      "LS",
      "MG",
      "MR",
      "M3D",
      "NM",
      "OAM",
      "OCT",
      "OP",
      "OPM",
      "OPT",
      "OPTBSV",
      "OPTENF",
      "OPV",
      "OSS",
      "OT",
      "PLAN",
      "PR",
      "PT",
      "PX",
      "REG",
      "RESP",
      "RF",
      "RG",
      "RTDOSE",
      "RTIMAGE",
      "RTINTENT",
      "RTPLAN",
      "RTRAD",
      "RTRECORD",
      "RTSEGANN",
      "RTSTRUCT",
      "RWV",
      "SEG",
      "SM",
      "SMR",
      "SR",
      "SRF",
      "STAIN",
      "TEXTUREMAP",
      "TG",
      "US",
      "VA",
      "XA",
      "XC"
    ],
    clearable: true
  },
  {
    value: "StudyDate",
    component: () => import("./InputStudyDate")
  },
  {
    value: "StudyTime",
    type: "time",
    hint: "since this time to midnight"
  },
  { value: "ReferringPhysicianName" },
  { value: "NameOfPhysiciansReadingStudy" },
  { value: "InstitutionName" },
  {
    value: "QueryLevel",
    type: "select",
    items: [
      { text: "Study", value: "Study" },
      { text: "Series", value: "Series" }
    ],
    clearable: true
  }
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
  defaultQueryParameters.map(p => ({
    cellClass: `cell-${p.value}`,
    sortable: true,
    text: `metadata-${p.value}`,
    ...p
  }));

const getQueryResultsKey = options =>
  options.queryResultsKey || defaultQueryResultsKey;

const getSteps = () => [...defaultSteps];

export { getHeaders, getQueryResultsKey, getSteps };
