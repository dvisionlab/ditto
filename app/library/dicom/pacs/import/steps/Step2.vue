<template>
  <v-data-table
    disable-pagination
    fixed-header
    :headers="headers"
    height="100%"
    hide-default-footer
    :items="data"
    :item-key="queryResultsKey"
    :mobile-breakpoint="0"
    show-select
    :style="{ height: tableHeight }"
    :value="selectedData"
    @item-selected="event => $emit('select-data', event)"
    @toggle-select-all="event => $emit('select-data', event)"
  >
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
</template>

<script>
import RelativeHeight from "../../../../relative-height";
import dicomDataTypes from "../../../../data-types/dicom";
import metadataDictionary from "../../../metadata";

const customSlotMetadata = [
  "PatientName",
  "ReferringPhysicianName",
  "NameOfPhysiciansReadingStudy",
  "PatientSex",
  "PatientBirthDate",
  "AcquisitionDate",
  "AcquisitionTime"
];

export default {
  name: "DicomImportStep2",
  components: { ...dicomDataTypes },
  directives: { RelativeHeight },
  props: {
    headers: { required: true, type: Array },
    data: { required: true, type: Array },
    queryResultsKey: { required: true, type: String },
    selectedData: { required: true, type: Array }
  },
  data() {
    return {
      metadata: metadataDictionary,
      tableHeight: "100%"
    };
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
