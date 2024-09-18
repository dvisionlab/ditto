// Default DICOM settings
// ----------------------

import metadata from "./metadata";
import { DEFAULT_TOOLS } from "larvitar";

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
    "numberOfTemporalPositions",
    // Larvitar info
    "isMultiframe",
    "is4D",
    "anonymized"
  ]
};

// Cornerstone tools
export const stackTools = DEFAULT_TOOLS;
