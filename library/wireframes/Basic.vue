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
      <template v-if="$vuetify.breakpoint[mobileBreakpoint]">
        <v-btn
          height="100%"
          text
          @click="mobileMenuVisible = !mobileMenuVisible"
        >
          <div class="text-center lh-small">
            <v-icon>mdi-menu</v-icon>
            <!-- <b class="d-flex align-center">menu</b> -->
          </div>
        </v-btn>

        <component
          v-if="bar.mobileMenuComponent"
          :is="bar.mobileMenuComponent"
          class="pl-0"
        />
      </template>

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
      <v-list class="h-100">
        <router-view
          class="h-100 d-flex flex-column"
          :dark="bar.dark"
          mobile
          name="bar"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- left navigation drawer -->
    <v-navigation-drawer
      v-if="show('nav-left')"
      app
      clipped
      :color="navLeft.color"
      :dark="navLeft.dark"
      :mobile-breakpoint="mobileBreakpoint"
      :style="navStyle"
      :width="navLeft.width"
      v-model="navLeftVisible"
    >
      <router-view :dark="navLeft.dark" name="nav-left" />

      <template v-slot:append>
        <v-btn block text @click="navLeftVisible = !navLeftVisible">
          <v-spacer />
          <v-icon :dark="navLeft.dark">mdi-chevron-left</v-icon>
        </v-btn>
      </template>
    </v-navigation-drawer>

    <!-- right navigation drawer -->
    <v-navigation-drawer
      v-if="show('nav-right')"
      app
      clipped
      :color="navRight.color"
      :dark="navRight.dark"
      :mobile-breakpoint="mobileBreakpoint"
      right
      :style="navStyle"
      :width="navRight.width"
      v-model="navRightVisible"
    >
      <router-view :dark="navRight.dark" name="nav-right" />

      <template v-slot:append>
        <v-btn block text @click="navRightVisible = !navRightVisible">
          <v-icon :dark="navRight.dark">mdi-chevron-right</v-icon>
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
      <div
        class="navigation-drawer-toggler"
        :style="navStyle"
        @click="navLeftVisible = !navLeftVisible"
      >
        <a class="d-flex align-middle">
          <v-icon>mdi-chevron-right</v-icon>
        </a>
      </div>
    </template>

    <template
      v-if="show('nav-right') && !navRightVisible"
      v-slot:navigation-drawer-toggler-right
    >
      <div
        class="navigation-drawer-toggler right"
        :style="navStyle"
        @click="navRightVisible = !navRightVisible"
      >
        <a class="d-flex align-middle">
          <v-icon>mdi-chevron-left</v-icon>
        </a>
      </div>
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
    navStyle() {
      return {
        height: `calc(calc(var(--vh, 1vh) * 100) - ${this.$vuetify.application.top}px)`,
        top: `${this.$vuetify.application.top}px`
      };
    },
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
  .v-list-item {
    flex: 0 1 auto;
  }

  .v-list-item__title {
    text-transform: uppercase;
  }
}

.navigation-drawer-toggler {
  position: absolute;
  display: flex;

  &.right {
    right: 0;
  }

  a {
    margin: auto;
    height: 4rem;
    background: var(--v-grey-base);
    opacity: 0.75;

    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
}
</style>
