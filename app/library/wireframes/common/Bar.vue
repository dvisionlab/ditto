<template>
  <v-app-bar
    app
    :clipped-left="left"
    :clipped-right="right"
    :color="color"
    :dark="dark"
    :dense="dense"
    flat
    :height="height"
  >
    <template v-if="$vuetify.breakpoint[mobileBreakpoint]">
      <v-btn height="100%" text @click="$emit('toggle-mobile-menu')">
        <div class="text-center lh-small">
          <v-icon>{{ `mdi-${mobileMenuVisible ? "close" : "menu"}` }}</v-icon>
          <span class="d-flex align-center text-caption">menu</span>
        </div>
      </v-btn>

      <component
        v-if="mobileMenuComponent"
        :is="mobileMenuComponent"
        class="pl-1"
      />
    </template>

    <!-- App bar content -->
    <slot
      v-else
      v-bind:class-name="'d-flex flex-grow-1 align-center h-100'"
      v-bind:dark="dark"
    />
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  props: {
    // Color of the v-app-bar component
    color: { required: false, type: String },
    // Dark status of the v-app-bar component
    dark: { default: false, type: Boolean },
    // Dense status of the v-app-bar component
    dense: { default: false, type: Boolean },
    // Height of the v-app-bar component
    height: { required: false, type: Number },
    // Clipped left status of the v-app-bar component
    left: { default: true, type: Boolean },
    // Mobile breakpoint
    mobileBreakpoint: {
      default: "xs",
      // One of the $vuetify.breakpoint keys
      type: String
    },
    // Vue component to render in mobile screens, instead of the default slot
    mobileMenuComponent: { required: false, type: [Object, Function] },
    // Mobile menu visibility
    mobileMenuVisible: { default: false, type: Boolean },
    // Clipped right status of the v-app-bar component
    right: { default: true, type: Boolean }
  }
};
</script>
