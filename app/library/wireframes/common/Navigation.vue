<template>
  <v-navigation-drawer
    :app="app"
    :clipped="clipped"
    :color="color"
    :dark="dark"
    :mini-variant="miniVariant"
    :mini-variant-width="miniVariantWidth"
    :mobile-breakpoint="mobileBreakpoint"
    :right="right"
    :width="width"
    :value="value"
    @input="value => $emit('input', value)"
  >
    <slot v-bind:dark="dark" />

    <template v-if="collapsable" v-slot:append>
      <v-divider />

      <div class="d-flex">
        <v-spacer />

        <v-btn class="toggler" text @click="$emit('input', !value)">
          <v-icon :dark="dark">{{
            `mdi-chevron-${right ? "right" : "left"}`
          }}</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Navigation",
  props: {
    app: { default: true, type: Boolean },
    clipped: { default: true, type: Boolean },
    collapsable: { default: true, type: Boolean },
    color: { required: false, type: String },
    dark: { default: false, type: Boolean },
    miniVariant: { default: false, type: Boolean },
    miniVariantWidth: { required: false, type: Number },
    mobileBreakpoint: { default: "xs", type: String },
    right: { default: false, type: Boolean },
    routeName: { required: false, type: String },
    value: { default: false, type: Boolean },
    width: { required: false, type: Number }
  }
};
</script>

<style scoped>
.toggler {
  width: 2em;
  min-width: auto !important;
  padding: 0 !important;
}
</style>
