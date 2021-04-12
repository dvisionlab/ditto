// Import/export dicom data types modules

import seriesAcquisitionDateComponents from "./library/data-types/dicom/series-acquisition-date";
import seriesModalityComponents from "./library/data-types/dicom/series-modality";
import seriesThumbnailComponents from "./library/data-types/dicom/series-thumbnail";
import sliceThicknessComponents from "./library/data-types/dicom/slice-thickness";

const components = {
  SeriesAcquisitionDate: seriesAcquisitionDateComponents,
  SeriesModality: seriesModalityComponents,
  SeriesThumbnail: seriesThumbnailComponents,
  SliceThickness: sliceThicknessComponents
};

export default Object.keys(components).reduce((result, name) => {
  Object.keys(components[name]).forEach(
    key => (result[`${name}${key}`] = components[name][key])
  );
  return result;
}, {});
