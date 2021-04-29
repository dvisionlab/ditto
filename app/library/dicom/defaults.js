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
