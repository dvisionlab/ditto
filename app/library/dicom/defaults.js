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
    metadata.StudyDescription,
    metadata.StudyDate,
    metadata.StudyTime
  ],
  series: [
    metadata.SeriesDescription,
    metadata.SeriesDate,
    metadata.SeriesTime,
    metadata.Modality,
    metadata.SliceThickness,
    metadata.SeriesNumber,
    // Larvitar tags
    "larvitarSeriesInstanceUID",
    "larvitarNumberOfSlices",
    // Larvitar info
    "isMultiframe"
  ]
};

// Cornerstone tools
export const stackTools = {
  default: [
    {
      name: "Wwwc",
      configuration: {},
      defaultActive: true,
      mixins: ["enabledOrDisabledBinaryTool"]
    },
    {
      name: "Zoom",
      configuration: {},
      mixins: ["enabledOrDisabledBinaryTool"]
    },
    { name: "Pan", configuration: {}, mixins: ["enabledOrDisabledBinaryTool"] },
    {
      name: "StackScrollMouseWheel",
      configuration: {},
      defaultActive: true,
      mixins: ["enabledOrDisabledBinaryTool"]
    }
  ],
  preview: [
    {
      name: "Wwwc",
      configuration: {},
      defaultActive: true,
      mixins: ["enabledOrDisabledBinaryTool"]
    },
    {
      name: "StackScrollMouseWheel",
      configuration: {},
      defaultActive: true,
      mixins: ["enabledOrDisabledBinaryTool"]
    }
  ]
};
