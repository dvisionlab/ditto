import WireframeWrapper from "./Wrapper.vue";

export default {
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
    navTogglerStyle(): { height: string; top: string } {
      return {
        height: `calc(calc(var(--vh, 1vh) * 100) - ${this.$vuetify.application.top}px)`,
        top: `${this.$vuetify.application.top}px`
      };
    }
  }
};
