<template>
  <wireframe-wrapper>
    <v-app-bar
      app
      clipped-left
      clipped-right
      :color="bar.color"
      :dark="bar.dark"
      flat
      :height="bar.height"
    >
      <router-view class="d-flex flex-grow-1 align-center h-100" name="bar" />
    </v-app-bar>

    <v-navigation-drawer
      v-if="show('nav-left')"
      app
      clipped
      :color="navLeft.color"
      :width="navLeft.width"
    >
      <router-view name="nav-left" />
    </v-navigation-drawer>

    <v-navigation-drawer
      v-if="show('nav-right')"
      app
      clipped
      :color="navRight.color"
      right
      :width="navRight.width"
    >
      <router-view name="nav-right" />
    </v-navigation-drawer>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <v-container class="h-100 pa-0" fluid>
        <!-- router default component -->
        <router-view />
      </v-container>
    </v-main>

    <v-footer v-if="show('footer')" app :height="footer.height">
      <router-view name="footer" />
    </v-footer>
  </wireframe-wrapper>
</template>

<script>
import WireframeWrapper from "./Wrapper";

export default {
  name: "DoubleNavigationWireframe",
  components: { WireframeWrapper },
  props: {
    bar: { default: () => ({}), type: Object },
    footer: { default: () => ({}), type: Object },
    navLeft: { default: () => ({}), type: Object },
    navRight: { default: () => ({}), type: Object }
  },
  computed: {
    components() {
      const route = this.$router.options.routes.find(
        r => r.name == this.$route.name
      );
      if (!route) {
        return;
      }

      return Object.keys(route.components || {});
    }
  },
  methods: {
    show(name) {
      return (this.components || []).find(v => v == name);
    }
  }
};
</script>
