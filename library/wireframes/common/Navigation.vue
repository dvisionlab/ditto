<template>
  <v-navigation-drawer
    app
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
    <router-view
      :dark="dark"
      :name="routeName || `nav-${right ? 'right' : 'left'}`"
    />

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
