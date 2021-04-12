<template>
  <div class="text-center lh-small">
    <v-badge bordered :color="badgeColor" overlap :value="minimizedSeries">
      <template v-slot:badge>
        <span>{{ minimizedSeries }}</span>
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
    minimizedSeries: { default: 0, type: Number }
  }
};
</script>
