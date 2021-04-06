<template>
  <wireframe-wrapper>
    <v-navigation-drawer
      app
      :color="nav.color"
      mini-variant
      :mini-variant-width="nav.width"
    >
      <router-view name="nav" />
    </v-navigation-drawer>

    <v-app-bar app clipped-right :color="bar.color" flat :height="bar.height">
      <router-view class="d-flex flex-grow-1 align-center h-100" name="bar" />
    </v-app-bar>

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
      <v-container class="d-flex h-100 pa-0" fluid>
        <!-- TODO auto hide on small screens + toggle button -->
        <v-navigation-drawer
          v-if="show('nav-left')"
          :color="navLeft.color"
          :width="navLeft.width"
          v-model="drawer"
        >
          <router-view name="nav-left" />
        </v-navigation-drawer>

        <!-- router default component -->
        <router-view />
      </v-container>
    </v-main>

    <v-footer v-if="show('footer')" app inset>
      <router-view name="footer" :height="footer.height" />
    </v-footer>
  </wireframe-wrapper>
</template>

<script>
import WireframeWrapper from "./common/Wrapper";

export default {
  name: "BasicWireframe",
  components: { WireframeWrapper },
  props: {
    bar: { default: () => ({}), type: Object },
    footer: { default: () => ({}), type: Object },
    nav: { default: () => ({}), type: Object },
    navLeft: { default: () => ({}), type: Object },
    navRight: { default: () => ({}), type: Object }
  },
  data: () => ({ drawer: null }), // TODO show/hide button + automatic on small screens
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
