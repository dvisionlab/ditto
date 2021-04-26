// Import/export dicom data types modules
// TODO automatic import

import patientNameComponents from "./dicom/patient-name";
import patientSexComponents from "./dicom/patient-sex";
import seriesAcquisitionDateComponents from "./dicom/series-acquisition-date";
import seriesModalityComponents from "./dicom/series-modality";
import seriesThumbnailComponents from "./dicom/series-thumbnail";
import sliceThicknessComponents from "./dicom/slice-thickness";
import x00100030Components from "./dicom/x-00100030";
import x00080022Components from "./dicom/x-00100030";

const components = {
  PatientName: patientNameComponents,
  PatientSex: patientSexComponents,
  SeriesAcquisitionDate: seriesAcquisitionDateComponents,
  SeriesModality: seriesModalityComponents,
  SeriesThumbnail: seriesThumbnailComponents,
  SliceThickness: sliceThicknessComponents,
  X00100030: x00100030Components,
  X00080022: x00080022Components
};

export default Object.keys(components).reduce((result, name) => {
  Object.keys(components[name]).forEach(
    key => (result[`${name}${key}`] = components[name][key])
  );
  return result;
}, {});
