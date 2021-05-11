<template>
  <div class="text-center lh-small">
    <v-badge bordered :color="badgeColor" overlap :value="minimizedSeries">
      <template v-slot:badge>
        <span>{{ minimizedSeries }}</span>
        <v-progress-circular
          v-if="loading"
          color="black"
          indeterminate
          :size="23"
          :style="{ position: 'absolute', top: '-4px', left: '-4px' }"
          :width="2"
        />
      </template>

      <v-icon class="mb-1" :color="iconColor">{{ icon }}</v-icon>
    </v-badge>
    <div v-if="label">
      <b>{{ label }}</b>
    </div>
  </div>
</template>

<script>
export default {
  name: "Activator",
  props: {
    badgeColor: { default: "primary", type: String },
    icon: { default: "mdi-upload-multiple", type: String },
    iconColor: { required: false, type: String },
    label: { required: false, type: String },
    loading: { default: false, type: Boolean },
    minimizedSeries: { default: 0, type: Number }
  }
};
</script>
