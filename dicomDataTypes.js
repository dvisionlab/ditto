// Import/export dicom data types modules

import seriesModalityComponents from "./app/library/data-types/dicom/series-modality";
import seriesThumbnailComponents from "./app/library/data-types/dicom/series-thumbnail";
import sliceThicknessComponents from "./app/library/data-types/dicom/slice-thickness";

export default {
  ...seriesModalityComponents,
  ...seriesThumbnailComponents,
  ...sliceThicknessComponents
};
