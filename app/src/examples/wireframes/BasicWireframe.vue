<template>
  <basic-wireframe />
</template>

<script>
import { BasicWireframe } from "../../../../wireframes";
// console.log(BasicWireframe);
// const wireframeOptions = {
//   bar: { dark: true, mobileMenuComponent: () => import("@/components/Logo") },
//   "nav-left": { dark: false, width: 200 }
// };

export default {
  name: "BasicWireframeExample",
  components: {
    BasicWireframe
  }
};
</script>
