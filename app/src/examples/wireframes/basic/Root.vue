<template>
  <basic-wireframe v-bind="options">
    <router-view />

    <template v-slot:bar="{ className, dark, mobile }">
      <app-bar :class="className" :dark="dark" :mobile="mobile" />
    </template>
    <template v-slot:navLeft="{ dark }">Left (dark: {{ dark }})</template>
    <template v-slot:navRight="{ dark }">Right (dark: {{ dark }})</template>
    <template v-slot:footer>Footer</template>
  </basic-wireframe>
</template>

<script>
import AppBar from "./Bar";
import BasicWireframe from "@/../library/wireframes/Basic";

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
  navLeft: { color: "primary", width: 300 },
  navRight: { dark: true, width: 200 },
  mobileBreakpoint: "xs" // default: xs
};

export default {
  name: "BasicWireframeExample",
  components: {
    AppBar,
    BasicWireframe
  },
  data: () => ({
    options
  })
};
</script>
