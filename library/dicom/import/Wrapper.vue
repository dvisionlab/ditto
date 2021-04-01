<template>
  <v-dialog
    max-width="1200px"
    persistent
    width="95wv"
    v-model="visible"
    @click:outside="() => minimize()"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot v-bind="{ on, attrs }">
        <!-- default slot content -->
        <v-btn
          :class="activatorClass"
          height="100%"
          text
          v-bind="attrs"
          v-on="on"
        >
          <div class="text-center lh-small">
            <v-badge bordered :color="badgeColor" overlap :value="minimizedSeries">
              <template v-slot:badge>
                <span>{{ minimizedSeries }}</span>
              </template>

              <v-icon class="mb-1" :color="iconColor">{{ icon }}</v-icon>
            </v-badge>
            <div>
              <b>{{ label }}</b>
            </div>
          </div>
        </v-btn>
      </slot>
    </template>

    <dicom-import
      v-if="isOpen || minimizedSeries"
      :icon="icon"
      :label="label"
      :options="options"
      ref="content"
      @cancel="isOpen = false"
      @dicom-import-open="data => $emit('dicom-import-open', data)"
      @minimize="minimize"
    >
      <!-- Add a slot for each header item that requires it (component customization) -->
      <template
        v-for="h in (options.headers || []).filter(({ slot }) => slot)"
        v-slot:[h.value]="{ item }"
      >
        <slot v-bind:item="item" :name="h.value" />
      </template>
    </dicom-import>
  </v-dialog>
</template>

<script>
import DicomImport from "./Component";

export default {
  name: "DicomImportModal",
  components: { DicomImport },
  props: {
    activatorClass: { required: false, type: String },
    badgeColor: { default: "primary", type: String },
    icon: { default: "mdi-upload-multiple", type: String },
    iconColor: { required: false, type: String },
    label: { default: "import-exams", type: String },
    options: { default: () => ({}), type: Object }
  },
  data: () => ({
    isOpen: false,
    minimizedSeries: 0
  }),
  computed: {
    visible: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.minimizedSeries = 0;
        this.isOpen = value;
      }
    }
  },
  methods: {
    minimize() {
      this.minimizedSeries = this.$refs.content.selectedSeries.length;
      this.isOpen = false;
    }
  }
};
</script>

<style scoped>
::v-deep .v-badge__badge {
  height: 15px;
  min-width: 15px;
  font-size: x-small;
  padding: 3px;
}
</style>
