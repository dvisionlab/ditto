<template>
  <v-dialog max-width="1200px" width="95wv" v-model="showDialog">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot v-bind="{ on, attrs }">
          <!-- default slot content -->
          <v-btn height="100%" text v-bind="attrs" v-on="on">
            <div class="text-center lh-small">
              <v-icon class="mb-1" color="accent">{{ icon }}</v-icon>
              <div class="lh-small">
                <b>{{ label }}</b>
              </div>
            </div>
          </v-btn>
        </slot>
      </div>
    </template>

    <dicom-import
      v-if="showDialog"
      :options="options"
      @dicom-import-open="data => $emit('dicom-import-open', data)"
      @cancel="showDialog = false"
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
    icon: { default: "mdi-upload-multiple", type: String },
    label: { default: "import-exams", type: String },
    options: { default: () => ({}), type: Object }
  },
  data: () => ({
    showDialog: false
  })
};
</script>

<style></style>
