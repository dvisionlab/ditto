<template>
  <v-app>
    <router-view v-if="$route.meta.guest" />
    <slot v-else />
  </v-app>
</template>

<script>
// !!! Wrapper is recommended for apps that use ditto auth
export default {
  name: "WireframeWrapper"
};
</script>
