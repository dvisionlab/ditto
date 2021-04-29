// Import/export dicom data types modules
import metadata from "../dicom/metadata";

import modalityComponents from "./dicom/modality";
import patientNameComponents from "./dicom/patient-name";
import patientSexComponents from "./dicom/patient-sex";
import sliceThicknessComponents from "./dicom/slice-thickness";
import thumbnailComponents from "./dicom/thumbnail";

const genericDateComponents = {
  string: () => import("./date/String")
};

const components = {
  [metadata.Modality]: modalityComponents,
  [metadata.PatientBirthDate]: genericDateComponents,
  [metadata.PatientName]: patientNameComponents,
  [metadata.PatientSex]: patientSexComponents,
  [metadata.StudyDate]: genericDateComponents,
  [metadata.StudyTime]: genericDateComponents,
  [metadata.SeriesDate]: genericDateComponents,
  [metadata.SeriesTime]: genericDateComponents,
  [metadata.SliceThickness]: sliceThicknessComponents,
  thumbnail: thumbnailComponents
};

export default Object.keys(components).reduce((result, name) => {
  Object.keys(components[name]).forEach(
    key => (result[`${name}-${key}`] = components[name][key])
  );
  return result;
}, {});
