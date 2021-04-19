<template>
  <v-navigation-drawer
    v-if="$vuetify.breakpoint[mobileBreakpoint]"
    app
    class="sm-menu"
    clipped
    :dark="dark"
    :stateless="stateless"
    :value="value"
    @input="value => $emit('input', value)"
  >
    <v-list class="h-100 py-0">
      <slot
        v-bind:class-name="'h-100 d-flex flex-column'"
        v-bind:dark="dark"
        v-bind:mobile="true"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "MobileTopMenu",
  props: {
    dark: { default: false, type: Boolean },
    mobileBreakpoint: { default: "xs", type: String },
    stateless: { default: true, type: Boolean },
    value: { default: false, type: Boolean }
  }
};
</script>
