<template>
  <v-app>
    <router-view v-if="$route.meta.guest" />
    <template v-else>
      <slot />

      <!-- root elements -->
      <slot name="navigation-drawer-toggler-left" />
      <slot name="navigation-drawer-toggler-right" />
    </template>
  </v-app>
</template>

<script>
// !!! Wrapper is recommended for apps that use ditto auth
export default {
  name: "WireframeWrapper"
};
</script>
