<template>
  <wireframe-wrapper>
    <!-- top menu -->
    <app-bar
      :color="bar.color"
      :dark="bar.dark"
      :dense="bar.dense"
      :height="bar.height"
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
      :color="navLeft.color"
      :dark="navLeft.dark"
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
      <navigation-toggler
        :style="navStyle"
        @toggle="navLeftVisible = !navLeftVisible"
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
  components: { AppBar, AppNavigation, MobileTopMenu, NavigationToggler }
};
</script>

<style lang="scss" scoped src="./common/style.scss" />
