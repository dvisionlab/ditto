<template>
  <wireframe-wrapper>
    <!-- top menu -->
    <app-bar
      v-if="$scopedSlots.bar"
      :color="bar.color"
      :dark="bar.dark"
      :dense="bar.dense"
      :height="bar.height"
      :mobile-breakpoint="mobileBreakpoint"
      :mobile-menu-component="bar.mobileMenuComponent"
      :mobile-menu-visible="mobileMenuVisible"
      @toggle-mobile-menu="mobileMenuVisible = !mobileMenuVisible"
    >
      <template v-slot="data">
        <!-- App bar slot (desktop) -->
        <slot name="bar" v-bind="data" />
      </template>
    </app-bar>

    <!-- mobile top menu -->
    <mobile-top-menu
      v-if="$scopedSlots.bar"
      :dark="bar.dark"
      :mobile-breakpoint="mobileBreakpoint"
      :stateless="bar.stateless"
      v-model="mobileMenuVisible"
    >
      <template v-slot="data">
        <!-- App bar slot (mobile) -->
        <slot name="bar" v-bind="data" />
      </template>
    </mobile-top-menu>

    <!-- left navigation drawer -->
    <app-navigation
      v-if="$scopedSlots.navLeft && navLeft.visible !== false"
      :color="navLeft.color"
      :collapsable="navLeft.collapsable"
      :dark="navLeft.dark"
      :mobile-breakpoint="mobileBreakpoint"
      :width="navLeft.width"
      v-model="navLeftVisible"
    >
      <template v-slot="data">
        <!-- Left navigator slot -->
        <slot name="navLeft" v-bind="data" />
      </template>
    </app-navigation>

    <!-- right navigation drawer -->
    <app-navigation
      v-if="$scopedSlots.navRight && navRight.visible !== false"
      :clipped="true"
      :color="navRight.color"
      :collapsable="navRight.collapsable"
      :dark="navRight.dark"
      :mobile-breakpoint="mobileBreakpoint"
      :right="true"
      :width="navRight.width"
      v-model="navRightVisible"
    >
      <template v-slot="data">
        <!-- Right navigator slot -->
        <slot name="navRight" v-bind="data" />
      </template>
    </app-navigation>

    <!-- main content -->
    <v-main class="h-100">
      <v-container class="h-100 pa-0" fluid>
        <!-- Main content slot -->
        <slot />
      </v-container>
    </v-main>

    <!-- footer -->
    <v-footer
      v-if="$scopedSlots.footer"
      app
      :dark="footer.dark"
      :height="footer.height"
    >
      <!-- Footer slot -->
      <slot name="footer" />
    </v-footer>

    <!-- togglers -->
    <template
      v-if="
        $scopedSlots.navLeft && navLeft.visible !== false && !navLeftVisible
      "
      v-slot:navigation-drawer-toggler-left
    >
      <navigation-toggler
        :style="navTogglerStyle"
        @toggle="navLeftVisible = !navLeftVisible"
      />
    </template>

    <template
      v-if="
        $scopedSlots.navRight && navRight.visible !== false && !navRightVisible
      "
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

// Basic wireframe component.
// Available slots:
// - default: main app container
// - bar: top menu (optional)
// - navLeft: collapsable left navigator (optional)
// - navRight: collapsable right navigator (optional)
// - footer (optional)

export default {
  name: "BasicWireframe",
  mixins: [Common],
  components: { AppBar, AppNavigation, MobileTopMenu, NavigationToggler }
};
</script>

<style lang="scss" scoped src="./common/style.scss" />
