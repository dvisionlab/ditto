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
    color: { required: false, type: String },
    dark: { default: false, type: Boolean },
    dense: { default: false, type: Boolean },
    height: { required: false, type: Number },
    left: { default: true, type: Boolean },
    mobileBreakpoint: { default: "xs", type: String },
    mobileMenuComponent: { required: false, type: [Object, Function] },
    mobileMenuVisible: { default: false, type: Boolean },
    right: { default: true, type: Boolean }
  }
};
</script>
