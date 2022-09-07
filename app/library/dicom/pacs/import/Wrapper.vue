<template>
  <v-dialog
    max-width="1200px"
    persistent
    width="95wv"
    v-model="visible"
    :disabled="disabled"
    @click:outside="() => minimize()"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot v-bind="{ on, attrs, minimizedSeries, uploading }">
        <!-- default slot content -->
        <!-- mobile -->
        <v-list-item
          v-if="mobile"
          :disabled="disabled"
          v-bind="attrs"
          v-on="on"
        >
          <v-list-item-icon>
            <activator-content
              :badge-color="badgeColor"
              :icon="icon"
              :icon-color="iconColor"
              :minimized-series="minimizedSeries"
            />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- desktop -->
        <v-btn
          v-else
          :class="activatorClass"
          :disabled="disabled"
          height="100%"
          text
          v-bind="attrs"
          v-on="on"
        >
          <activator-content
            :badge-color="badgeColor"
            :icon="icon"
            :icon-color="iconColor"
            :label="label"
            :loading="uploading"
            :minimized-series="minimizedSeries"
          />
        </v-btn>
      </slot>
    </template>

    <dicom-import-pacs
      v-if="isOpen || minimizedSeries"
      :icon="icon"
      :label="label"
      :options="options"
      ref="content"
      @cancel="isOpen = false"
      @minimize="minimize"
      @pacs-retrieve-complete="onComplete"
      @pacs-retrieve-open="data => $emit('pacs-retrieve-open', data)"
    >
      <!-- Add a slot for each header item that requires it (component customization) -->
      <template
        v-for="h in (options.headers || []).filter(({ slot }) => slot)"
        v-slot:[h.value]="{ item }"
      >
        <slot v-bind:item="item" :name="h.value" />
      </template>
    </dicom-import-pacs>
  </v-dialog>
</template>

<script>
import DicomImportPacs from "./Component";
import ActivatorContent from "../../import/Activator";

export default {
  name: "DicomImportModal",
  components: { ActivatorContent, DicomImportPacs },
  props: {
    disabled: { default: false, type: Boolean },
    activatorClass: { required: false, type: String },
    badgeColor: { default: "primary", type: String },
    icon: { default: "mdi-server", type: String },
    iconColor: { required: false, type: String },
    label: { default: "pacs-import.query-retrieve", type: String },
    mobile: { default: false, type: Boolean },
    options: { default: () => ({}), type: Object }
  },
  data: () => ({
    isOpen: false,
    minimizedSeries: 0,
    uploading: false
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
      const status = this.$refs.content.steps[this.$refs.content.currentStep]
        .status;

      if (status) {
        this.uploading = status.loading;
      }

      this.minimizedSeries =
        !status || status.loading ? this.$refs.content.selectedData.length : 0;

      this.isOpen = false;
    },
    onComplete(data) {
      this.minimizedSeries = 0;
      this.$emit("pacs-retrieve-complete", data);
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
