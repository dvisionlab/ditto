// Import/export form modules

import Form from "./library/form/Form";

import { customizeRules } from "./library/form/rules";
import props from "./library/form/fieldsProps";

export default {
  component: Form,
  customizeRules,
  fieldsProps: props
};
