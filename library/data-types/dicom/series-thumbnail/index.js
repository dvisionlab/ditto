// Data type base name
const dataTypeName = "SeriesThumbnail";

export default {
  [`DataTypeString${dataTypeName}`]: () => import("./String")
};
