// Default DICOM settings
// ----------------------

// Top level stacks metadata

// TODO all codes?
export const stackMetadata = {
  patient: ["patientName", "x00100030", "patientSex"],
  study: ["studyUID", "studyDescription"],
  series: [
    "seriesUID",
    "seriesDescription",
    "seriesModality",
    "x00080022",
    "numberOfImages",
    "sliceThickness"
  ]
};

// Cornerstone tools

export const stackTools = {
  canvas: [], // TODO all?
  preview: [
    { name: "Wwwc", configuration: {} },
    { name: "StackScrollMouseWheel", configuration: {} }
  ]
};