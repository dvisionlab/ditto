<template>
  <wireframe-wrapper>
    <!-- top menu -->
    <v-app-bar
      app
      clipped-left
      clipped-right
      :color="bar.color"
      :dark="bar.dark"
      dense
      flat
      :height="bar.height"
    >
      <v-btn
        v-if="$vuetify.breakpoint[mobileBreakpoint]"
        height="100%"
        text
        @click="mobileMenuVisible = !mobileMenuVisible"
      >
        <div class="text-center lh-small">
          <v-icon>mdi-menu</v-icon>
          <b class="d-flex align-center">menu</b>
        </div>
      </v-btn>

      <router-view
        v-else
        class="d-flex flex-grow-1 align-center h-100"
        name="bar"
      />
    </v-app-bar>

    <!-- mobile top menu -->
    <v-navigation-drawer
      v-if="$vuetify.breakpoint[mobileBreakpoint]"
      app
      class="sm-menu"
      clipped
      :dark="bar.dark"
      v-model="mobileMenuVisible"
    >
      <v-list><router-view :dark="bar.dark" mobile name="bar" /></v-list>
    </v-navigation-drawer>

    <!-- left navigation drawer -->
    <v-navigation-drawer
      v-if="show('nav-left')"
      app
      clipped
      :color="navLeft.color"
      :mobile-breakpoint="mobileBreakpoint"
      :style="{
        height: `calc(calc(var(--vh, 1vh) * 100) - ${$vuetify.application.top}px)`,
        top: `${$vuetify.application.top}px`
      }"
      :width="navLeft.width"
      v-model="navLeftVisible"
    >
      <router-view name="nav-left" />

      <template v-slot:append>
        <v-btn block text @click="navLeftVisible = !navLeftVisible">
          <v-spacer />
          <v-icon color="accent">mdi-chevron-left</v-icon>
        </v-btn>
      </template>
    </v-navigation-drawer>

    <!-- right navigation drawer -->
    <v-navigation-drawer
      v-if="show('nav-right')"
      app
      clipped
      :color="navRight.color"
      :mobile-breakpoint="mobileBreakpoint"
      right
      :style="{
        height: `calc(calc(var(--vh, 1vh) * 100) - ${$vuetify.application.top}px)`,
        top: `${$vuetify.application.top}px`
      }"
      :width="navRight.width"
      v-model="navRightVisible"
    >
      <router-view name="nav-right" />

      <template v-slot:append>
        <v-btn block text @click="navRightVisible = !navRightVisible">
          <v-icon color="accent">mdi-chevron-right</v-icon>
          <v-spacer />
        </v-btn>
      </template>
    </v-navigation-drawer>

    <!-- main content -->
    <v-main>
      <v-container class="h-100 pa-0" fluid>
        <!-- router default component -->
        <router-view />
      </v-container>
    </v-main>

    <!-- footer -->
    <v-footer v-if="show('footer')" app :height="footer.height">
      <router-view name="footer" />
    </v-footer>

    <!-- togglers -->
    <template
      v-if="show('nav-left') && !navLeftVisible"
      v-slot:navigation-drawer-toggler-left
    >
      <a
        class="d-flex align-middle navigation-drawer-toggler"
        @click="navLeftVisible = !navLeftVisible"
      >
        <v-icon color="accent">mdi-chevron-right</v-icon>
      </a>
    </template>

    <template
      v-if="show('nav-right') && !navRightVisible"
      v-slot:navigation-drawer-toggler-right
    >
      <a
        class="d-flex align-middle navigation-drawer-toggler right"
        @click="navRightVisible = !navRightVisible"
      >
        <v-icon color="accent">mdi-chevron-left</v-icon>
      </a>
    </template>
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
    mobileBreakpoint: { default: "xs", type: String },
    navLeft: { default: () => ({}), type: Object },
    navRight: { default: () => ({}), type: Object }
  },
  data() {
    return {
      mobileMenuVisible: false,
      navLeftVisible: !this.$vuetify.breakpoint[this.mobileBreakpoint],
      navRightVisible: !this.$vuetify.breakpoint[this.mobileBreakpoint]
    };
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

<style lang="scss" scoped>
::v-deep .sm-menu {
  .v-list-item__title {
    text-transform: uppercase;
  }
}

.navigation-drawer-toggler {
  position: absolute;
  top: 50%;

  height: 4rem;
  background: var(--v-grey-base);
  border-bottom-right-radius: 0.5rem;
  border-top-right-radius: 0.5rem;

  &.right {
    right: 0;
    border-bottom-right-radius: 0rem;
    border-top-right-radius: 0rem;
    border-bottom-left-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
  }
}
</style>
