<template>
  <basic-wireframe v-bind="options">
    <!-- default wireframe slot -->
    <div>
      Current route: {{ $route.name }}
      <v-btn
        @click="
          $router.push({
            name:
              $route.name == 'basic-wireframe-home'
                ? 'basic-wireframe-other'
                : 'basic-wireframe-home',
          })
        "
      >
        switch route
      </v-btn>
      <!-- route dependant wiereframe components: defined in router -->
      <router-view />
    </div>

    <!-- named wireframe slots -->
    <template v-slot:bar="{ className, dark, mobile }">
      <!-- fixed wireframe components: imported here -->
      <app-bar :class="className" :dark="dark" :mobile="mobile" />
    </template>

    <template v-slot:navLeft="{ dark }">
      <!-- route dependant wiereframe components: defined in router -->
      <router-view name="navLeft" :dark="dark" />
    </template>

    <!-- fixed wireframe components: imported here -->
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
      template: "<div>Mobile menu</div>",
    },
  },
  footer: { dark: true, height: 80 },
  navLeft: { color: "primary", width: 300 },
  navRight: { dark: true, width: 200 },
  mobileBreakpoint: "xs", // default: xs
};

export default {
  name: "BasicWireframeExample",
  components: {
    AppBar,
    BasicWireframe,
  },
  data: () => ({
    options,
  }),
};
</script>
