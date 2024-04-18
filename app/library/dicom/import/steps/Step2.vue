<template>
  <div :class="{ 'dark-bg': dark }">
    <!-- previous step errors -->
    <div
      v-if="importErrors.length"
      class="pa-3"
      v-relative-height:2px="'tableHeight'"
    >
      <v-alert
        border="left"
        :dark="dark"
        class="ma-0"
        icon="mdi-alert-circle"
        type="error"
        text
      >
        <h3 class="headline mb-1">
          Some errors occured while parsing your DICOM files.
        </h3>
        <div v-if="importErrors.length">
          <v-btn
            :dark="dark"
            color="red lighten-2"
            text
            @click="showErrorDetails = !showErrorDetails"
          >
            <v-icon :dark="dark"
              >mdi-chevron-{{ showErrorDetails ? "up" : "down" }}</v-icon
            >
            {{ showErrorDetails ? "hide" : "show" }} errors details
          </v-btn>

          <div v-if="showErrorDetails" class="error-list black--text">
            <div v-for="(v, i) in importErrors" :key="i">{{ i }} - {{ v }}</div>
          </div>
        </div>
      </v-alert>
    </div>
    <div
      class="data-group"
      v-for="groupedSeries in groupedSeriesByStudyUID(series)"
      :key="groupedSeries.id"
    >
      <div :class="{ 'dark-table-head': dark }" class=" d-flex flex-row pa-1">
        <div class="ma-3">
          <h3>Patient</h3>
          <div
            v-if="patientItems(groupedSeries.series)"
            class="pt-1 text-body-2"
          >
            <div :class="{ 'white--text': dark }">
              <div>
                <b class="text-uppercase">{{
                  patientItems(groupedSeries.series).name || "[unknown patient]"
                }}</b>
                <span v-if="patientItems(groupedSeries.series).gender"
                  >, {{ patientItems(groupedSeries.series).gender }}</span
                >
                <template v-if="patientItems(groupedSeries.series).birth_date">
                  <span>, </span>
                  <component
                    :is="getComponentName(metadata.StudyDate)"
                    :value="patientItems(groupedSeries.series).birth_date"
                    tag="span"
                  />
                </template>
              </div>
            </div>
            <component
              :is="getComponentName(metadata.PatientID)"
              tag="span"
              :value="groupedSeries.series[0][metadata.PatientID]"
            />
          </div>
        </div>
        <div v-if="groupedSeries && groupedSeries.series[0]" class="ma-3 pl-3">
          <h3>Study</h3>
          <div class="pt-1 text-body-2">
            <div>
              <span>
                AN
                <b>{{ groupedSeries.series[0][metadata.AccessionNumber] }}</b> ,
              </span>
              <component
                :is="getComponentName(metadata.StudyDate)"
                :dicom="true"
                tag="span"
                :value="groupedSeries.series[0][metadata.StudyDate]"
              />
              <component
                class="ml-1"
                :is="getComponentName(metadata.StudyTime)"
                :dicom="true"
                tag="span"
                :value="groupedSeries.series[0][metadata.StudyTime]"
              />
            </div>
            <div>
              {{
                groupedSeries.series[0][metadata.StudyDescription] || "&mdash;"
              }}
            </div>
            <div>
              <span>
                <b> [{{ getModalitiesInStudy(groupedSeries.series) }}] </b>
                <b class="primary--text">{{ groupedSeries.series.length }}</b>
                series in study
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- TODO show parsing warnings/errors related to parsed series -->
      <v-data-table
        :dark="dark"
        dense
        disable-pagination
        fixed-header
        :headers="headersInTable(headers)"
        height="100%"
        hide-default-footer
        :items="groupedSeries.series"
        item-key="larvitarSeriesInstanceUID"
        :mobile-breakpoint="0"
        show-select
        :style="{ height: tableHeight }"
        :value="selectedSeries"
        @item-selected="event => $emit('select-series', event)"
        @toggle-select-all="event => $emit('select-series', event)"
      >
        <template v-slot:[`item.preview`]="{ item }">
          <v-lazy>
            <dicom-canvas
              :canvas-id="item.larvitarSeriesInstanceUID"
              :get-progress-fn="getProgressFn"
              :get-viewport-fn="getViewportFn"
              :series-id="item.larvitarSeriesInstanceUID"
              show-multiframe-icon
              :stack="item"
              :style="{ width: '8em', height: '8em' }"
              :tools="tools"
            />
          </v-lazy>
        </template>
        <template v-if="allowAnonymization" v-slot:[`header.anonymized`]>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-checkbox
                v-bind="attrs"
                v-on="on"
                v-model="groupedSeries.anonymizeAll"
                @change="event => onAnonymizeAllChecked(event, groupedSeries)"
              >
                <template v-slot:label>
                  <span style="font-size: 10.5px;">Anonymize</span>
                </template>
              </v-checkbox>
            </template>
            <span> Anonymize All</span>
          </v-tooltip>
        </template>
        <template
          v-if="allowAnonymization"
          v-slot:[`item.anonymized`]="{ item }"
        >
          <v-checkbox class="text-center" v-model="item.anonymized" />
        </template>

        <template
          v-for="h in headers.filter(
            ({ value }) => value !== 'preview' && value !== 'anonymized'
          )"
          v-slot:[`item.${h.value}`]="{ item }"
        >
          <!-- Add a slot for each header item that requires it (component customization) -->
          <slot v-if="h.slot" :name="h.value" v-bind:item="item" />

          <!-- Add default slots using data types for other headers fields -->
          <template v-else>
            <component
              :key="h.value"
              v-if="getComponentName(h.value)"
              :is="getComponentName(h.value)"
              :dicom="true"
              :value="item[h.value]"
            />
            <div v-else :key="h.value">{{ item[h.value] }}</div>
          </template>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </div>
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
    allowAnonymization: { default: false, type: Boolean },
    dark: { default: false, type: Boolean },
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
      showErrorDetails: false,
      tableHeight: "100%"
    };
  },
  methods: {
    groupedSeriesByStudyUID(series) {
      let groupedSeriesByStudyUID = [];
      if (series && series.length > 0) {
        const groupedSeries = Object.groupBy(
          series,
          ({ studyUID }) => studyUID
        );
        // transform object in array
        Object.keys(groupedSeries).forEach(k => {
          groupedSeriesByStudyUID.push({
            id: k,
            anonymizeAll: false,
            series: groupedSeries[k]
          });
        });
        return groupedSeriesByStudyUID;
      }
      return groupedSeriesByStudyUID;
    },
    patientItems: series => {
      if (series && series[0]) {
        return {
          name: series[0]["x00100010"],
          birth_date: series[0]["x00100030"],
          gender: series[0]["x00100040"]
        };
      }
      return null;
    },
    getComponentName(field) {
      const name = `${field}-string`;
      return this.$options.components[name] ? name : null;
    },
    headersInTable(headers) {
      return headers.filter(item => item.value !== "patient");
    },
    getModalitiesInStudy(series) {
      if (series && series.length) {
        let modalities = [];
        series.forEach(item => {
          if (modalities.length === 0) {
            modalities.push(item.modality);
          } else if (modalities.findIndex(m => m === item.modality) < 0) {
            modalities.push(item.modality);
          }
        });
        let modInStudies = "";
        modalities.forEach((m, i) => {
          if (i !== 0) {
            modInStudies = modInStudies + "," + m;
          } else {
            modInStudies = modInStudies + m;
          }
        });
        return modInStudies;
      }
      return "";
    },
    onAnonymizeAllChecked(event, groupedSeries, data) {
      if (event) {
        if (groupedSeries && groupedSeries.id) {
          this.$emit("anonymize-all", groupedSeries.id);
        }
      }
    }
  }
};
</script>

<style scoped>
.dark-table-head {
  background-color: #484848;
  color: white;
}
.dark-bg {
  background-color: #1e1e1e;
}
.data-group {
  border-bottom: 1px solid var(--v-grey-base);
}
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
::v-deep .v-data-table > .v-data-table__wrapper {
  overflow: hidden !important;
}
::v-deep th {
  white-space: nowrap;
}

::v-deep td.cell-x00081030,
::v-deep td.cell-x0008103e {
  min-width: 200px;
  max-width: 250px;
  width: max-content;
}

::v-deep td.cell-x00080020,
::v-deep td.cell-x00080021 {
  min-width: 35px;
  max-width: 120px;
  width: max-content;
}

::v-deep td.cell-patient {
  max-width: 200px;
  width: max-content;
}
</style>
