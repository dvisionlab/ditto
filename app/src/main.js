import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

// Mobile plugin
import mobileViewportMixin from "@/../library/mobile/viewportMixin";

Vue.config.productionTip = false;
Vue.mixin(mobileViewportMixin);

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
