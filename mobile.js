// Import/export mobile modules
/* eslint-disable */

import * as fullscreenUtils from "./app/library/mobile/fullscreen";
import viewportMixin from "./app/library/mobile/viewportMixin";

export default Vue => {
  // add instance method
  Vue.prototype.$mobile = fullscreenUtils;

  // inject some component options
  Vue.mixin(viewportMixin);
};
