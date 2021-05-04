<template>
  <div
    :class="{
      'd-flex align-center h-100': !mobile,
      'mobile-menu-content': mobile
    }"
  >
    <div class="mr-1">>>LOGO>></div>

    <ditto-dicom-import-modal
      activator-class="mr-1"
      :dark="dark"
      label="load exams"
      icon="mdi-cloud-upload-outline"
      :mobile="mobile"
      @dicom-import-open="() => {}"
    />

    <menu-item :dark="dark" :mobile="mobile" />
  </div>
</template>

<script>
import Vue from "vue";
import MenuItem from "./MenuItem";
import dicomPlugin from "@/../library/dicom/plugin";

export default {
  components: { MenuItem },
  props: {
    dark: { default: false, type: Boolean },
    mobile: { default: false, type: Boolean }
  },
  beforeMount() {
    Vue.use(dicomPlugin, { store: this.$store });
  }
};
</script>

<style lang="scss">
.header-group {
  height: calc(100% - 0.5rem) !important;
  border: 1px solid rgba(255, 255, 255, 0.12);

  .header-title {
    height: 1rem;
    overflow: hidden;
    text-transform: uppercase;
    text-align: center;

    // text-caption
    font-size: 0.65rem;
    font-weight: 400;
    line-height: 1.25rem;
    letter-spacing: 0.0333333333em;

    & ~ .v-btn-toggle,
    & ~ .v-btn {
      height: calc(100% - 1rem - 1px);
      vertical-align: bottom;
    }

    & ~ .v-btn-toggle > .v-btn {
      height: 100% !important;
      vertical-align: bottom;
    }
  }

  .v-btn-toggle,
  .v-btn {
    height: 100%;

    .v-btn:before {
      background-color: transparent;
    }
  }
}

.mobile-menu-content {
  max-height: calc(100% - 80px);
  overflow: auto;
}
</style>
