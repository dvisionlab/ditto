import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

// Mobile plugin
import mobileViewportMixin from "@/../library/mobile/viewportMixin";
Vue.mixin(mobileViewportMixin);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
