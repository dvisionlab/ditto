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
    <!-- Navigation drawer content -->
    <slot v-bind:dark="dark" />

    <template v-if="collapsable" v-slot:append>
      <v-btn block text @click="$emit('input', !value)">
        <v-spacer />
        <v-icon :dark="dark">{{
          `mdi-chevron-${right ? "right" : "left"}`
        }}</v-icon>
      </v-btn>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Navigation",
  props: {
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
