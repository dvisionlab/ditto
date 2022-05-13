// Import/export dicom data types modules
import metadata from "../dicom/metadata";

import accessionNumberComponents from "./dicom/accession-number";
import modalityComponents from "./dicom/modality";
import patientIdComponents from "./dicom/patient-id";
import patientNameComponents from "./dicom/patient-name";
import patientSexComponents from "./dicom/patient-sex";
import sliceThicknessComponents from "./dicom/slice-thickness";
import thumbnailComponents from "./dicom/thumbnail";

const genericDateComponents = {
  string: () => import("./date/DataTypeString.vue")
};

const genericTimeComponents = {
  string: () => import("./time/DataTypeString.vue")
};

const components = {
  [metadata.AccessionNumber]: accessionNumberComponents,
  [metadata.Modality]: modalityComponents,
  [metadata.PatientBirthDate]: genericDateComponents,
  [metadata.PatientID]: patientIdComponents,
  [metadata.PatientName]: patientNameComponents,
  [metadata.PatientSex]: patientSexComponents,
  [metadata.StudyDate]: genericDateComponents,
  [metadata.StudyTime]: genericTimeComponents,
  [metadata.SeriesDate]: genericDateComponents,
  [metadata.SeriesTime]: genericTimeComponents,
  [metadata.SliceThickness]: sliceThicknessComponents,
  thumbnail: thumbnailComponents
};

export default Object.keys(components).reduce((result, name) => {
  Object.keys(components[name]).forEach(
    key => (result[`${name}-${key}`] = components[name][key])
  );
  return result;
}, {});
