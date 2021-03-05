// Data type base name
const dataTypeName = "SliceThickness";

export default {
  [`DataTypeString${dataTypeName}`]: () => import("./String")
};
