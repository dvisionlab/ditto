<template>
  <v-navigation-drawer
    v-if="$vuetify.breakpoint[mobileBreakpoint]"
    absolute
    class="sm-menu"
    clipped
    :dark="dark"
    :stateless="stateless"
    :style="{
      height: `calc(100% - ${$vuetify.application.top}px)`,
      marginTop: `${$vuetify.application.top}px`
    }"
    :value="value"
    @input="value => $emit('input', value)"
  >
    <v-list class="h-100 py-0">
      <!-- Navigation drawer > list content -->
      <slot
        v-bind:class-name="'h-100 d-flex flex-column'"
        v-bind:dark="dark"
        v-bind:mobile="true"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
export default {
  name: "MobileTopMenu",
  props: {
    // Dark status of the v-navigation-drawer component
    dark: { default: false, type: Boolean },
    // Mobile breakpoint
    mobileBreakpoint: {
      default: "xs",
      // One of the $vuetify.breakpoint keys
      type: String
    },
    // Stateless status of the v-navigation-drawer component
    stateless: { default: true, type: Boolean },
    // Navigation drawer visibility
    value: { default: false, type: Boolean }
  }
};
</script>
