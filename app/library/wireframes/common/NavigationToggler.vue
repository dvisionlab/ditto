<template>
  <div
    class="navigation-drawer-toggler"
    :class="{ right }"
    @click="$emit('toggle')"
  >
    <a class="d-flex align-middle">
      <v-icon>{{ `mdi-chevron-${right ? "left" : "right"}` }}</v-icon>
    </a>
  </div>
</template>

<script>
export default {
  name: "NavigationToggler",
  props: {
    // Right status of the navigation-drawer parent component
    right: { default: false, type: Boolean }
  }
};
</script>
