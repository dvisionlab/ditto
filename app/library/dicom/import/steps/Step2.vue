<template>
  <div>
    <!-- previous step errors -->
    <div
      v-if="importErrors.length || !series.length"
      class="pa-3"
      v-relative-height:2px="'tableHeight'"
    >
      <v-alert
        border="left"
        class="ma-0"
        icon="mdi-alert-circle"
        type="error"
        text
      >
        <h3 class="headline mb-1">
          Some errors occured while parsing your DICOM files.
        </h3>
        <div v-if="!series.length">
          Unfortunately none of your files can be loaded: please check your
          files complies with the DICOM standard fromat.
        </div>

        <div v-if="importErrors.length">
          <v-btn
            color="red lighten-2"
            text
            @click="showErrorDetails = !showErrorDetails"
          >
            <v-icon>mdi-chevron-{{ showErrorDetails ? "up" : "down" }}</v-icon>
            {{ showErrorDetails ? "hide" : "show" }} errors details
          </v-btn>

          <div v-if="showErrorDetails" class="error-list black--text">
            <div v-for="(v, i) in importErrors" :key="i">{{ i }} - {{ v }}</div>
          </div>
        </div>
      </v-alert>
    </div>

    <v-data-table
      v-if="series.length"
      disable-pagination
      fixed-header
      :group-by="metadata.StudyInstanceUID"
      :headers="headers"
      height="100%"
      hide-default-footer
      :items="series"
      :item-key="metadata.SeriesInstanceUID"
      show-select
      :style="{ height: tableHeight }"
      :value="selectedSeries"
      @item-selected="event => $emit('select-series', event)"
      @toggle-select-all="event => $emit('select-series', event)"
    >
      <template v-slot:[`group.header`]="{ items }">
        <!-- TODO make this slot customizable -->
        <td></td>
        <td>
          <div>
            <b class="primary--text">{{ items.length }}</b>
            series in study
          </div>
          <div v-if="items[0][metadata.AccessionNumber]">
            AN: {{ items[0][metadata.AccessionNumber] }}
          </div>
        </td>
        <!-- patient col -->
        <td></td>
        <td>
          <div>{{ items[0][metadata.StudyDescription] || "&mdash;" }}</div>
        </td>
        <td>
          <component
            :is="getComponentName(metadata.StudyDate)"
            :value="items[0][metadata.StudyDate]"
          />
        </td>
        <td>
          <component
            :is="getComponentName(metadata.StudyTime)"
            :value="items[0][metadata.StudyTime]"
          />
        </td>
        <td></td>
        <td>{{ items[0][metadata.ModalitiesInStudy] }}</td>
        <td :colspan="headers.length - 1"></td>
      </template>

      <template v-slot:[`item.preview`]="{ item }">
        <!-- clear-on-destroy is true when series is not selected (user discard from open/updload) -->
        <dicom-canvas
          :canvas-id="item[metadata.SeriesInstanceUID]"
          :get-progress-fn="getProgressFn"
          :get-viewport-fn="getViewportFn"
          :series-id="item[metadata.SeriesInstanceUID]"
          :stack="item"
          :style="{ width: '10em', height: '10em' }"
          :tools="tools"
        />
      </template>

      <!-- Default patient slot -->
      <template v-if="!patientHeader.slot" v-slot:[`item.patient`]="{ item }">
        <div v-for="key in patientHeader.keys" :key="key">
          <component
            v-if="getComponentName(key)"
            :is="getComponentName(key)"
            :value="item[key]"
          />
          <div v-else>{{ item[key] }}</div>
        </div>
      </template>

      <!-- Add a slot for each header item that requires it (component customization) -->
      <template
        v-for="h in headers.filter(({ slot }) => slot)"
        v-slot:[`item.${h.value}`]="{ item }"
      >
        <slot v-bind:item="item" :name="h.value" />
      </template>

      <!-- Add default slots using data types for other headers fields -->
      <template
        v-for="h in headers.filter(
          ({ slot, value }) =>
            !slot && value !== 'patient' && value !== 'preview'
        )"
        v-slot:[`item.${h.value}`]="{ item }"
      >
        <component
          :key="h.value"
          v-if="getComponentName(h.value)"
          :is="getComponentName(h.value)"
          :value="item[h.value]"
        />
        <div v-else :key="h.value">{{ item[h.value] }}</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import RelativeHeight from "../../../relative-height";
import dicomDataTypes from "../../../data-types/dicom";
import metadataDictionary from "../../metadata";

const DicomCanvas = () => import("../../render/Canvas");

export default {
  name: "DicomImportStep2",
  components: { ...dicomDataTypes, DicomCanvas },
  directives: { RelativeHeight },
  props: {
    getProgressFn: { required: false, type: Function },
    getViewportFn: { required: false, type: Function },
    headers: { required: true, type: Array },
    importErrors: { required: false, type: Array },
    series: { required: true, type: Array },
    selectedSeries: { required: true, type: Array },
    step: { required: true, type: Object },
    tools: { required: false, type: Array }
  },
  data() {
    return {
      metadata: metadataDictionary,
      patientHeader: this.headers.find(h => h.value == "patient"),
      showErrorDetails: false,
      tableHeight: "100%"
    };
  },
  methods: {
    getComponentName(field) {
      const name = `${field}-string`;
      return this.$options.components[name] ? name : null;
    }
  }
};
</script>

<style scoped>
::v-deep
  .v-data-table--fixed-header
  > .v-data-table__wrapper
  > table
  > thead
  > tr
  > th,
::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  padding: 0.5em;
}

td.cell-x0008103e > * {
  min-width: 200px;
  max-width: 250px;
  width: max-content;
}

td.cell-patient > * {
  max-width: 200px;
  width: max-content;
}
</style>
