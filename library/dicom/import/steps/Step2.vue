<template>
  <div>
    <!-- previous step errors -->
    <div
      v-if="importErrors.length || !series.length"
      class="pa-3"
      v-relative-height
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
          <div class="mt-2">
            <v-btn color="red lighten-2" dark @click="currentStep--">
              Try again
            </v-btn>
          </div>
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

    <!-- <slot v-bind:test="'test2'" name="metadata" /> -->

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

          | <b>{{ items.length }} series</b>
        </td>
      </template>

      <template v-slot:[`item.preview`]="{ item }">
        <!-- clear-on-destroy is true when series is not selected (user discard from open/updload) -->
        <!-- TODO LT always clear-on-destroy if upload without opening in viewer -->
        <dicom-canvas
          :canvas-id="item.seriesUID"
          :clear-cache-on-destroy="true"
          :clear-on-destroy="
            selectedSeries.find(
              ({ seriesUID }) => seriesUID == item.seriesUID
            ) == null
          "
          :get-viewport-fn="getViewportFn"
          :series-id="item.seriesUID"
          :stack="item"
          :style="{ width: '10em', height: '10em' }"
          :tools="tools"
        />
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
const DicomCanvas = () => import("../../render/Canvas");

const updateTableHeight = (el, vnode) => {
  setTimeout(() => {
    vnode.context.updateTableHeight(el.offsetHeight);
  }, 0);
};

export default {
  name: "DicomImportStep2",
  components: { DicomCanvas },
  directives: {
    // TODO extract directive
    relativeHeight: {
      inserted(el, binding, vnode) {
        updateTableHeight(el, vnode);
      },
      update(el, binding, vnode) {
        setTimeout(() => {
          updateTableHeight(el, vnode);
        }, 0);
      }
    }
  },
  props: {
    getViewportFn: { required: false, type: Function },
    headers: { required: true, type: Array },
    importErrors: { required: false, type: Array },
    series: { required: true, type: Array },
    selectedSeries: { required: true, type: Array },
    step: { required: true, type: Object },
    tools: { required: false, type: Array }
  },
  data: () => ({
    showErrorDetails: false,
    tableHeight: "100%"
  }),
  methods: {
    updateTableHeight(alertHeight) {
      this.tableHeight = `calc(100% - ${alertHeight}px - 2px)`;
    }
  }
};
</script>
