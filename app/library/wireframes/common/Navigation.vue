<template>
  <v-navigation-drawer
    :absolute="absolute"
    :app="app"
    :clipped="clipped"
    :color="color"
    :dark="dark"
    :mini-variant="miniVariant"
    :mini-variant-width="miniVariantWidth"
    :mobile-breakpoint="mobileBreakpoint"
    :right="right"
    :style="{ transition: 'none' }"
    :width="width"
    :value="value"
    @input="value => $emit('input', value)"
  >
    <!-- Navigation drawer content -->
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

<script lang="ts">
export default {
  name: "AppNavigation",
  props: {
    // Absolute status of the v-navigation-drawer component
    absolute: { default: false, type: Boolean },
    // App status of the v-navigation-drawer component
    app: { default: true, type: Boolean },
    // Clipped status of the v-navigation-drawer component
    clipped: { default: true, type: Boolean },
    // Wheter the navigation drawer can be collapsed or not
    collapsable: { default: true, type: Boolean },
    // Color of the v-navigation-drawer component
    color: { required: false, type: String },
    // Dark status of the v-navigation-drawer component
    dark: { default: false, type: Boolean },
    // Mini variant status of the v-navigation-drawer component
    miniVariant: { default: false, type: Boolean },
    // Mini variant width of the v-navigation-drawer component
    miniVariantWidth: { required: false, type: Number },
    // Mobile breakpoint
    mobileBreakpoint: {
      default: "xs",
      // One of the $vuetify.breakpoint key
      stype: String
    },
    // Right status of the v-navigation-drawer component
    right: { default: false, type: Boolean },
    // Navigation drawer visibility
    value: { default: false, type: Boolean },
    // Width of the v-navigation-drawer component
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
