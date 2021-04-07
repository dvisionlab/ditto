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
          <v-icon>mdi-menu</v-icon>
          <!-- <b class="d-flex align-center">menu</b> -->
        </div>
      </v-btn>

      <component
        v-if="mobileMenuComponent"
        :is="mobileMenuComponent"
        class="pl-0"
      />
    </template>

    <router-view
      v-else
      class="d-flex flex-grow-1 align-center h-100"
      name="bar"
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
    mobileMenuComponent: { required: false, type: Function },
    right: { default: true, type: Boolean }
  }
};
</script>
