<template>
  <double-navigation-wireframe v-bind="options">
    <router-view />

    <template v-slot:bar="{ className, dark, mobile }">
      <div :class="className">
        Header (dark: {{ dark }}, mobile: {{ mobile }})
      </div>
    </template>
    <template v-slot:nav="{ dark }">Inner (dark: {{ dark }})</template>
    <template v-slot:navLeft="{ dark }">Left (dark: {{ dark }})</template>
    <template v-slot:navRight="{ dark }">Right (dark: {{ dark }})</template>
    <template v-slot:footer>Footer</template>
  </double-navigation-wireframe>
</template>

<script>
import DoubleNavigationWireframe from "@/../library/wireframes/DoubleNavigation";
const options = {
  bar: {
    color: "green",
    dark: true,
    dense: true,
    mobileMenuComponent: {
      template: "<div>Mobile menu</div>"
    }
  },
  footer: { dark: true, height: 80 },
  nav: { color: "blue", width: 300 },
  navLeft: { color: "orange", width: 50 },
  navRight: { color: "purple", dark: true, width: 200 },
  mobileBreakpoint: "xs" // default: xs
};

export default {
  name: "DoubleNavigationWireframeExample",
  components: {
    DoubleNavigationWireframe
  },
  data: () => ({
    options
  })
};
</script>
