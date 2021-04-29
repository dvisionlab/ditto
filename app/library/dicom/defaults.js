// Default DICOM settings
// ----------------------

import metadata from "./metadata";

// Top level stacks metadata
export const stackMetadata = {
  patient: [
    metadata.PatientID,
    metadata.PatientName,
    metadata.PatientBirthDate,
    metadata.PatientSex
  ],
  study: [
    metadata.StudyInstanceUID,
    metadata.AccessionNumber,
    metadata.StudyDate,
    metadata.StudyTime,
    metadata.StudyDescription
  ],
  series: [
    metadata.SeriesInstanceUID,
    metadata.SeriesDate,
    metadata.SeriesTime,
    metadata.SeriesDescription,
    metadata.Modality,
    metadata.SliceThickness,
    // Larvitar tags
    "numberOfImages"
  ]
};

// Cornerstone tools
export const stackTools = {
  default: [
    // TODO all?
    { name: "Wwwc", configuration: {} },
    { name: "StackScrollMouseWheel", configuration: {} }
  ],
  preview: [
    { name: "Wwwc", configuration: {} },
    { name: "StackScrollMouseWheel", configuration: {} }
  ]
};
