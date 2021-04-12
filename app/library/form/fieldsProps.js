// Props passed to fields components
export default {
  disabled: { default: false, type: Boolean },
  label: { required: false, type: String },
  required: { default: false, type: Boolean },
  rules: { default: () => [], type: Array },
  type: { required: false, type: String },
  value: { required: false }
};
