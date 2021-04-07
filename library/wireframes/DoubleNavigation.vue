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
      :color="navLeft.color"
      :collapsable="false"
      :dark="navLeft.dark"
      mini-variant
      :mini-variant-width="nav.width"
      :mobile-breakpoint="mobileBreakpoint"
      :style="navStyle"
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
      :style="navStyle"
      :width="navRight.width"
      v-model="navRightVisible"
    />

    <!-- Sizes your content based upon application components -->
    <v-main>
      <v-container class="d-flex h-100 pa-0" fluid>
        <app-navigation
          v-if="show('nav-inner')"
          :color="nav.color"
          route-name="nav-inner"
          :width="nav.width"
          v-model="navVisible"
        />

        <!-- router default component -->
        <router-view />
      </v-container>
    </v-main>

    <v-footer v-if="show('footer')" app inset>
      <router-view name="footer" :height="footer.height" />
    </v-footer>

    <!-- togglers -->
    <template
      v-if="show('nav-inner') && !navVisible"
      v-slot:navigation-drawer-toggler-inner
    >
      <navigation-toggler
        :style="navStyle"
        @toggle="navVisible = !navVisible"
      />
    </template>

    <template
      v-if="show('nav-right') && !navRightVisible"
      v-slot:navigation-drawer-toggler-right
    >
      <navigation-toggler
        right
        :style="navStyle"
        @toggle="navLeftVisible = !navLeftVisible"
      />
    </template>
  </wireframe-wrapper>
</template>

<script>
import AppBar from "./common/AppBar";
import AppNavigation from "./common/Navigation";
import Common from "./common/mixin";
import MobileTopMenu from "./common/MobileTopMenu";
import NavigationToggler from "./common/NavigationToggler";

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
