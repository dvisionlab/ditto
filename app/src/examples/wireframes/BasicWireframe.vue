<template>
  <basic-wireframe :options="options" />
</template>

<script>
import BasicWireframe from "@/../library/wireframes/Basic";
const options = {
  bar: { dark: true },
  "nav-left": { dark: false, width: 200 }
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
