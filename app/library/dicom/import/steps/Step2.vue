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
      :style="{ height: tableHeight }"
      disable-pagination
      fixed-header
      group-by="studyUID"
      :headers="headers"
      height="100%"
      hide-default-footer
      :items="series"
      item-key="seriesUID"
      show-select
      :value="selectedSeries"
      @item-selected="event => $emit('select-series', event)"
      @toggle-select-all="event => $emit('select-series', event)"
    >
      <template v-slot:[`group.header`]="{ items }">
        <td
          class="text-center"
          :colspan="headers.length + 1"
          :style="{ height: '2em' }"
        >
          <b>{{
            items[0].studyDescription || "[missing study description]"
          }}</b>

          | <b class="primary--text">{{ items.length }} series</b>
        </td>
      </template>

      <template v-slot:[`item.preview`]="{ item }">
        <!-- clear-on-destroy is true when series is not selected (user discard from open/updload) -->
        <dicom-canvas
          :canvas-id="item.seriesUID"
          :get-progress-fn="getProgressFn"
          :get-viewport-fn="getViewportFn"
          :series-id="item.seriesUID"
          :show-progress="false"
          :stack="item"
          :style="{ width: '10em', height: '10em' }"
          :tools="tools"
        />
      </template>

      <template v-if="!patientHeader.slot" v-slot:[`item.patient`]="{ item }">
        <div v-for="key in patientHeader.keys" :key="key">{{ item[key] }}</div>
      </template>

      <!-- Add a slot for each header item that requires it (component customization) -->
      <template
        v-for="h in headers.filter(({ slot }) => slot)"
        v-slot:[`item.${h.value}`]="{ item }"
      >
        <slot v-bind:item="item" :name="h.value" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import RelativeHeight from "../../../relative-height";
const DicomCanvas = () => import("../../render/Canvas");

export default {
  name: "DicomImportStep2",
  components: { DicomCanvas },
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
      patientHeader: this.headers.find(h => h.value == "patient"),
      showErrorDetails: false,
      tableHeight: "100%"
    };
  }
};
</script>
