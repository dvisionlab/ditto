<template>
  <v-app>
    <slot v-if="$route.meta.guest" name="guest">
      <!-- default guest slot -->
      <router-view />
    </slot>
    <template v-else>
      <!-- !guest slot -->
      <slot />

      <!-- root elements -->
      <slot name="navigation-drawer-toggler-left" />
      <slot name="navigation-drawer-toggler-right" />
      <slot name="navigation-drawer-toggler-inner" />
    </template>
  </v-app>
</template>

<script>
// !!! Wrapper is recommended for apps that use ditto auth
export default {
  name: "WireframeWrapper"
};
</script>
