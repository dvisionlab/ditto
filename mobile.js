// Import/export mobile modules

import * as fullscreenUtils from "./library/mobile/fullscreen";
import viewportMixin from "./library/mobile/viewportMixin";

export default Vue => {
  // add instance method
  Vue.prototype.$mobile = fullscreenUtils;

  // inject some component options
  Vue.mixin(viewportMixin);
};
