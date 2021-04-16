<template>
  <basic-wireframe v-bind="options" />
</template>

<script>
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
  navLeft: { color: "orange", width: 300 },
  navRight: { dark: true, width: 200 },
  mobileBreakpoint: "xs" // default: xs
};

export default {
  name: "BasicWireframeExample",
  components: {
    BasicWireframe
  },
  data: () => ({
    options
  })
};
</script>
