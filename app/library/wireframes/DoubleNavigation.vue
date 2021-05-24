<template>
  <wireframe-wrapper>
    <!-- top menu -->
    <app-bar
      v-if="$scopedSlots.bar"
      :color="bar.color"
      :dark="bar.dark"
      :dense="bar.dense"
      :height="bar.height"
      :left="false"
      :mobile-breakpoint="mobileBreakpoint"
      :mobile-menu-component="bar.mobileMenuComponent"
      :mobile-menu-visible="mobileMenuVisible"
      @toggle-mobile-menu="mobileMenuVisible = !mobileMenuVisible"
    >
      <template v-slot="data"><slot name="bar" v-bind="data"/></template>
    </app-bar>

    <!-- mobile top menu -->
    <mobile-top-menu
      :dark="bar.dark"
      :mobile-breakpoint="mobileBreakpoint"
      :steteless="bar.stateless"
      v-model="mobileMenuVisible"
    >
      <template v-slot="data"><slot name="bar" v-bind="data"/></template>
    </mobile-top-menu>

    <!-- left navigation drawer -->
    <app-navigation
      v-if="$scopedSlots.navLeft"
      :clipped="false"
      :color="navLeft.color"
      :collapsable="false"
      :dark="navLeft.dark"
      mini-variant
      :mini-variant-width="navLeft.width"
      :mobile-breakpoint="mobileBreakpoint"
      :width="navLeft.width"
      v-model="navLeftVisible"
    >
      <template v-slot="data"><slot name="navLeft" v-bind="data"/></template>
    </app-navigation>

    <!-- right navigation drawer -->
    <app-navigation
      v-if="$scopedSlots.navRight"
      :clipped="true"
      :color="navRight.color"
      :dark="navRight.dark"
      :mobile-breakpoint="mobileBreakpoint"
      :right="true"
      :width="navRight.width"
      v-model="navRightVisible"
    >
      <template v-slot="data"><slot name="navRight" v-bind="data"/></template>
    </app-navigation>

    <!-- Sizes your content based upon application components -->
    <v-main class="h-100">
      <v-container class="d-flex pa-0" fluid :style="{ height: '100%' }">
        <app-navigation
          v-if="$scopedSlots.nav"
          :absolute="$vuetify.breakpoint[mobileBreakpoint]"
          :app="false"
          :color="nav.color"
          :width="navVisible ? nav.width : 0"
          v-model="navVisible"
        >
          <template v-slot="data">
            <slot name="nav" v-bind="data" />
          </template>
        </app-navigation>

        <!-- default slot -->
        <div
          :style="
            $scopedSlots.nav && !$vuetify.breakpoint[mobileBreakpoint]
              ? { width: `calc(100% - ${navVisible ? nav.width : 0}px)` }
              : { width: '100%' }
          "
        >
          <slot />
        </div>
      </v-container>
    </v-main>

    <v-footer
      v-if="$scopedSlots.footer"
      app
      :dark="footer.dark"
      :height="footer.height"
      inset
    >
      <slot name="footer" />
    </v-footer>

    <!-- togglers -->
    <template
      v-if="$scopedSlots.nav && !navVisible"
      v-slot:navigation-drawer-toggler-inner
    >
      <navigation-toggler
        :style="{ ...navTogglerStyle, left: `${$vuetify.application.left}px` }"
        @toggle="navVisible = !navVisible"
      />
    </template>

    <template
      v-if="$scopedSlots.navRight && !navRightVisible"
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
