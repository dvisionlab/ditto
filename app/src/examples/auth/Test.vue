<template>
  <div id="authApp" />
</template>

<script>
import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";
import vuetify from "../../plugins/vuetify";

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueI18n);

const store = new Vuex.Store({});
const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "main",
      component: () => import("./MainPage"),
      meta: { auth: true }
    }
  ]
});

import authPlugin from "@/../library/auth/plugin";
import SubApp from "./SubApp";
import AuthWrapper from "./Wrapper";

Vue.use(authPlugin, {
  authRoot: "/auth",
  autoLogin: false,
  router,
  store,
  wrapperComponent: AuthWrapper
});

export default {
  mounted() {
    new Vue({
      router,
      store,
      vuetify,
      i18n: new VueI18n(),
      render: h => h(SubApp)
    }).$mount("#authApp");
  }
};
</script>
