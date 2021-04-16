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
  footer: { height: 80 },
  navLeft: { color: "orange", dark: false, width: 300 },
  navRight: { color: "purple", dark: true, width: 200 },
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
