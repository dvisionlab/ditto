// Data type base name
const dataTypeName = "SeriesModality";

export default {
  [`DataTypeString${dataTypeName}`]: () => import("./String")
};
