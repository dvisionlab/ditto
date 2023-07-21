<template>
  <div>
    <img
      v-if="value"
      alt="Missing series preview"
      class="relative d-flex"
      :src="base64 ? 'data:image/png;base64,' + value : value"
      :style="{ width, position: 'relative' }"
    />
    <v-tooltip dark v-if="warningIcon" :text="warningMessage">
      <template v-slot:activator="{ props }">
        <v-icon
          dark
          v-bind="props"
          :style="{ position: 'absolute', bottom: '0' }"
        >
          {{ warningIcon }}
        </v-icon>
      </template>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: false,
      type: String
    },
    base64: {
      required: false,
      type: Boolean,
      default: false
    },
    width: {
      default: "6em",
      type: String
    },
    warningMessage: {
      required: false,
      type: String
    },
    warningIcon: {
      required: false,
      type: String
    }
  }
};
</script>
