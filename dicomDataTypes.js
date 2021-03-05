// Import/export dicom data types modules

import seriesModalityComponents from "./library/data-types/dicom/series-modality";
import seriesThumbnailComponents from "./library/data-types/dicom/series-thumbnail";
import sliceThicknessComponents from "./library/data-types/dicom/slice-thickness";

export default {
  ...seriesModalityComponents,
  ...seriesThumbnailComponents,
  ...sliceThicknessComponents
};
