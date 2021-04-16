<template>
  <wireframe-wrapper>
    <!-- top menu -->
    <app-bar
      :color="bar.color"
      :dark="bar.dark"
      :dense="bar.dense"
      :height="bar.height"
      :left="false"
      :mobile-breakpoint="mobileBreakpoint"
      :mobile-menu-component="bar.mobileMenuComponent"
      :mobile-menu-visible="mobileMenuVisible"
      @toggle-mobile-menu="mobileMenuVisible = !mobileMenuVisible"
    />

    <!-- mobile top menu -->
    <mobile-top-menu
      :dark="bar.dark"
      :mobile-breakpoint="mobileBreakpoint"
      :steteless="bar.stateless"
      v-model="mobileMenuVisible"
    />

    <!-- left navigation drawer -->
    <app-navigation
      v-if="show('nav-left')"
      :clipped="false"
      :color="navLeft.color"
      :collapsable="false"
      :dark="navLeft.dark"
      mini-variant
      :mini-variant-width="navLeft.width"
      :mobile-breakpoint="mobileBreakpoint"
      :width="navLeft.width"
      v-model="navLeftVisible"
    />

    <!-- right navigation drawer -->
    <app-navigation
      v-if="show('nav-right')"
      :clipped="true"
      :color="navRight.color"
      :dark="navRight.dark"
      :mobile-breakpoint="mobileBreakpoint"
      :right="true"
      :width="navRight.width"
      v-model="navRightVisible"
    />

    <!-- Sizes your content based upon application components -->
    <v-main>
      <v-container class="d-flex pa-0" fluid :style="{ height: '100%' }">
        <app-navigation
          v-if="show('nav-inner')"
          :app="false"
          :color="nav.color"
          route-name="nav-inner"
          :width="nav.width"
          v-model="navVisible"
        />

        <!-- router default component -->
        <router-view />
      </v-container>
    </v-main>

    <v-footer
      v-if="show('footer')"
      app
      :dark="footer.dark"
      :height="footer.height"
      inset
    >
      <router-view name="footer" />
    </v-footer>

    <!-- togglers -->
    <template
      v-if="show('nav-inner') && !navVisible"
      v-slot:navigation-drawer-toggler-inner
    >
      <navigation-toggler
        :style="{ ...navTogglerStyle, left: `${$vuetify.application.left}px` }"
        @toggle="navVisible = !navVisible"
      />
    </template>

    <template
      v-if="show('nav-right') && !navRightVisible"
      v-slot:navigation-drawer-toggler-right
    >
      <navigation-toggler
        right
        :style="navTogglerStyle"
        @toggle="navRightVisible = !navRightVisible"
      />
    </template>
  </wireframe-wrapper>
</template>

<script>
import Common from "./common/mixin";

const AppBar = () => import("./common/Bar");
const AppNavigation = () => import("./common/Navigation");
const MobileTopMenu = () => import("./common/MobileTopMenu");
const NavigationToggler = () => import("./common/NavigationToggler");

export default {
  name: "BasicWireframe",
  mixins: [Common],
  components: { AppBar, AppNavigation, MobileTopMenu, NavigationToggler },
  props: {
    nav: { default: () => ({}), type: Object }
  },
  data() {
    return {
      navVisible: !this.$vuetify.breakpoint[this.mobileBreakpoint]
    };
  }
};
</script>

<style lang="scss" scoped src="./common/style.scss" />
