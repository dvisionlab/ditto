<template>
  <div
    class="px-3 modal-controllers"
    :class="{
      'd-flex flex-column-reverse': $vuetify.breakpoint.smAndDown
    }"
  >
    <v-btn icon x-small @click="$emit('minimize')">
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <v-btn icon x-small @click="$emit('cancel')">
      <v-icon>mdi-window-close</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ModalControllers"
};
</script>

<style lang="scss" scoped>
.modal-controllers {
  overflow: hidden;

  .v-btn::before {
    background-color: transparent;
  }
  .v-btn i:hover {
    color: var(--v-primary-base);
    transform: scale(1.15);
  }
}
</style>
