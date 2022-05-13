import Vue from "vue";

export default Vue.extend({
  created() {
    if (this.$vuetify) {
      import("./vuetifyViewportStyle.module.css");
    }
  },
  mounted() {
    // Listen for resize events to update viewport unit variable
    window.addEventListener("resize", this.updateViewportVariable);
    // Trigger first event
    this.updateViewportVariable();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateViewportVariable);
  },
  methods: {
    updateViewportVariable() {
      // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  }
});
