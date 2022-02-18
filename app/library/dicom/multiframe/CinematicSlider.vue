<template>
  <v-slider
    class="align-center"
    dense
    hide-details
    :min="options.min"
    :max="options.max"
    :step="options.step"
    :thumb-size="10"
    :value="value"
    :vertical="vertical"
    @click.stop
    @change="value => $emit('change', value)"
    @end="$emit('restart')"
  >
    <template v-slot:prepend>
      <v-icon small @click.stop="$emit('change', value - options.step)"
        >mdi-minus</v-icon
      >
    </template>

    <template v-slot:append>
      <v-icon small @click.stop="$emit('change', value + options.step)"
        >mdi-plus</v-icon
      >
    </template>
  </v-slider>
</template>

<script>
export default {
  name: "CinematicSlider",
  props: {
    value: { required: true, type: Number },
    options: { required: true, type: Object },
    vertical: { default: true, type: Boolean }
  }
};
</script>
