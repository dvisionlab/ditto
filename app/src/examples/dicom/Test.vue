<template>
  <div id="dicomApp" />
</template>

<script>
import Vue from "vue";
import Vuex from "vuex";
import VueI18n from "vue-i18n";
import vuetify from "../../plugins/vuetify";

import SubApp from "./SubApp";
import dicomPlugin from "@/../library/dicom/plugin";

Vue.use(Vuex);
Vue.use(VueI18n);

const store = new Vuex.Store({});
Vue.use(dicomPlugin, { store });

export default {
  mounted() {
    new Vue({
      store,
      vuetify,
      i18n: new VueI18n(),
      render: h => h(SubApp)
    }).$mount("#dicomApp");
  }
};
</script>
