<template>
  <div class="d-flex flex-column">
    <h3
      class="text-uppercase text-center mx-auto py-4"
      :style="{ width: 'fit-content' }"
    >
      <template v-if="step.status.loading">
        Importing <b>{{ selectedData.length }}</b> exam{{
          selectedData.length == 1 ? "" : "s"
        }}
        <v-progress-linear color="warning" indeterminate />
      </template>

      <div v-else-if="step.status.completed">
        <template v-if="allErrors">import failed</template>
        <template v-else>import completed</template>
        <v-progress-linear
          :color="!hasErrors ? 'success' : 'black'"
          :value="100"
        />

        <div class="text-lowercase pt-2">
          <div v-if="progressCounter.success">
            {{ progressCounter.success }} exams imported
          </div>
          <div v-if="progressCounter.error">
            {{ progressCounter.error }} imports failure
          </div>
        </div>
      </div>
    </h3>

    <div class="flex-grow-1">
      <v-data-table
        disable-pagination
        fixed-header
        :headers="headersWithProgress"
        height="100%"
        hide-default-footer
        :items="selectedData"
        :item-key="queryResultsKey"
        :mobile-breakpoint="0"
        :style="{ height: '100%' }"
      >
        <template v-slot:[`item.progress`]="{ item }">
          <v-tooltip v-if="step.status.errors[item[queryResultsKey]]" right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" icon v-bind="attrs" v-on="on">
                <v-icon>mdi-alert</v-icon>
              </v-btn>
            </template>
            <div>{{ step.status.errors[item[queryResultsKey]] }}</div>
          </v-tooltip>

          <v-progress-circular
            v-else-if="step.status.progress[item[queryResultsKey]] === 0"
            indeterminate
            color="primary"
          ></v-progress-circular>

          <v-icon
            v-else-if="step.status.progress[item[queryResultsKey]] === 100"
            class="mx-auto"
            color="success"
          >
            mdi-check
          </v-icon>

          <div v-else>pending</div>
        </template>

        <template v-for="h in headers" v-slot:[`item.${h.value}`]="{ item }">
          <!-- Add default slots using data types for other headers fields -->
          <component
            v-if="getComponentName(h.value)"
            :key="`${h.value}.component`"
            :is="getComponentName(h.value)"
            :dicom="true"
            :value="item[h.value]"
          />
          <div v-else :key="h.value">{{ item[h.value] }}</div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import dicomDataTypes from "../../../../data-types/dicom";
import metadataDictionary from "../../../metadata";

const customSlotMetadata = [
  "PatientName",
  "PatientSex",
  "PatientBirthDate",
  "AcquisitionDate",
  "AcquisitionTime"
];

export default {
  name: "DicomImportStep3",
  props: {
    headers: { required: true, type: Array },
    queryResultsKey: { required: true, type: String },
    selectedData: { required: true, type: Array },
    step: { required: true, type: Object }
  },
  components: { ...dicomDataTypes },
  computed: {
    allErrors() {
      const p = this.step.status.progress;
      return (
        Object.keys(p).filter(k => p[k] !== 100).length == Object.keys(p).length
      );
    },
    hasErrors() {
      return !!Object.keys(this.step.status.errors).length;
    },
    headersWithProgress() {
      return [{ value: "progress" }, ...this.headers];
    },
    progressCounter() {
      const p = this.step.status.progress;
      const keys = Object.keys(p);

      return {
        error: keys.filter(k => p[k] !== 100).length,
        success: keys.filter(k => p[k] === 100).length
      };
    }
  },
  methods: {
    getComponentName(field) {
      if (customSlotMetadata.findIndex(v => v === field) >= 0) {
        const key = metadataDictionary[field];
        return key && this.$options.components[`${key}-string`]
          ? `${key}-string`
          : null;
      }
    }
  }
};
</script>
