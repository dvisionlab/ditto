// Import/export form modules

import Form from "./app/library/form/Form.vue";

import { customizeRules } from "./app/library/form/rules";
import props from "./app/library/form/fieldsProps";

export default {
  component: Form,
  customizeRules,
  fieldsProps: props
};
