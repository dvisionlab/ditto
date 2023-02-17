<template>
  <splitpanes
    :class="theme"
    :dbl-click-splitter="maximizeOnDoubleClick"
    :horizontal="horizontal"
    :push-other-panes="pushOtherPanes"
    :size="layout.size"
    @resized="e => $emit('resized', e)"
  >
    <pane
      v-for="(pane, i) in layout.panes"
      :key="i"
      :min-size="minPaneSize"
      :size="pane.size"
    >
      <dynamic-layout
        v-if="pane.panes"
        :dbl-click-splitter="maximizeOnDoubleClick"
        :layout="pane"
        :parent-id="`${parentId}${i}`"
        :push-other-panes="pushOtherPanes"
      >
        <!-- Recursively pass down scoped slot -->
        <template v-slot="{ pane }">
          <slot v-bind:pane="pane" />
        </template>
      </dynamic-layout>
      <slot v-else v-bind:pane="{ ...pane, id: getPaneId(pane, i) }">
        <div class="text-center" :id="getPaneId(pane, i)">
          <div class="ma-auto">
            This is the default slot content for pane
            <b>{{ parentId }}{{ i }}</b
            >.<br />You can customize this pane using the default Vue slot.
          </div>
        </div>
      </slot>
    </pane>
  </splitpanes>
</template>

<script>
import { Splitpanes, Pane } from "splitpanes";

export default {
  name: "DynamicLayout",
  components: { Splitpanes, Pane },
  props: {
    // Double click on splitter to maximize the next pane
    maximizeOnDoubleClick: {
      default: false,
      type: Boolean
    },
    // All panes have a min width of 10%
    minPaneSize: {
      default: "10",
      type: String
    },
    // Panes structure
    layout: {
      default: () => ({ panes: [{}] }),
      type: Object
    },
    // Parent component id
    parentId: {
      default: "",
      type: String
    },
    // Whether it should push the next splitter when dragging a splitter until it reached another one
    pushOtherPanes: {
      default: false,
      type: Boolean
    },
    // Theme (default-theme or mobile-theme or custom theme - should provide scss style)
    theme: {
      default: "default-theme",
      type: String
    }
  },
  computed: {
    // The orientation of the panes splitting
    // Vertical by default, meaning the splitters are vertical, but you can resize horizontally
    horizontal() {
      return this.layout.horizontal || false;
    }
  },
  methods: {
    getPaneId(pane, i) {
      return pane.id || `dynamic-pane-${this.parentId}${i}`;
    }
  }
};
</script>

<style lang="scss">
@import "~splitpanes/dist/splitpanes.css";

.splitpanes__pane {
  display: flex;
  justify-content: center;
  align-items: center;
}

.splitpanes.mobile-theme {
  .splitpanes__splitter {
    background-color: #ccc;
    position: relative;
  }
  .splitpanes__splitter:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    transition: opacity 0.4s;
    background-color: rgba(#ccc, 0.2);
    opacity: 0;
    z-index: 2;
  }
  .splitpanes__splitter:hover:before {
    opacity: 1;
  }
  &.splitpanes--vertical > .splitpanes__splitter:hover:before {
    left: -30px;
    right: -30px;
    height: 100%;
  }
  &.splitpanes--horizontal > .splitpanes__splitter:before {
    top: -30px;
    bottom: -30px;
    width: 100%;
  }
}
</style>
