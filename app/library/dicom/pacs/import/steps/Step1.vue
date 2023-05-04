<template>
  <div>
    <v-alert v-if="modalities.error" class="ma-4" outlined type="error">
      An error occured while retrieving PACS modalities.
    </v-alert>

    <div
      v-else-if="!step.status.loading"
      class="d-flex flex-column justify-center pa-4"
    >
      <div class="mx-auto text-center text-uppercase mb-4">
        <h4 v-html="disclaimer" class="primary--text"></h4>
      </div>

      <!-- select aet -->
      <v-form class="mb-2" ref="aetForm">
        <v-select
          :hint="value ? `${value.aet}, ${value.host}:${value.port}` : null"
          :items="modalities.results"
          item-text="tag"
          item-value="tag"
          label="Remote PACS"
          persistent-hint
          required
          return-object
          :rules="[v => !!v || 'Please select a remote PACS']"
          :value="value"
          @change="v => $emit('input', v)"
        ></v-select>
      </v-form>

      <ditto-form
        :fields="fields"
        :footer-style="{ display: 'none !important' }"
        v-model="form"
      />
    </div>

    <div v-else class="d-flex h-100 text-center text-uppercase">
      <div class="ma-auto">
        <v-progress-linear indeterminate color="primary" />
        <h3 class="primary--text">querying</h3>
      </div>
    </div>

    <v-dialog :value="step.status.error" max-width="300">
      <v-card>
        <v-card-title class="headline warning--text">
          Querying error
        </v-card-title>
        <v-card-text>{{ step.status.error }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="step.status.error = null">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Form from "../../../../form/Form";

export default {
  name: "DicomImportStep1",
  components: { DittoForm: Form },
  props: {
    disclaimer: { required: true, type: String },
    form: { required: true, type: Object },
    headers: { required: true, type: Array },
    modalities: { required: false, type: Object },
    step: { required: true, type: Object },
    value: { required: false, type: Object } // selected AET
  },
  data() {
    return {
      fields: this.headers.map(({ value, ...f }) => ({
        ...f,
        key: value,
        label: this.$t(`pacs-import.metadata-${value}`)
      }))
    };
  }
};
</script>
