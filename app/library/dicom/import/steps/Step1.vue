<template>
  <div>
    <input
      ref="inputFile"
      multiple
      type="file"
      v-show="false"
      @change="loadSeries"
    />

    <div
      v-if="!loading"
      class="d-flex flex-column justify-center dropzone pa-4"
      :class="{ dragging, 'primary--text': dragging, black: dark }"
     
      @drop.prevent.stop="loadSeries"
      @dragover.prevent.stop="onDragOver"
      @dragend="onDragEnd"
      @dragleave="onDragEnd"
    ><div :class="{ 'white--text': dark}" class="mx-auto text-center text-uppercase">
        <h3 >drop files and folders here</h3>
        <!--<div class="line-wraps"><span>or</span></div>-->
        
      </div>
      <v-img
        :dark="dark"
        class="mx-auto flex-shrink-1 drop-icon"
        :class="{ 'dark-icon': dark }"
        contain
        :draggable="false"
        max-height="350px"
        max-width="260px"
        width="100%"
        :src="icon"
      />

      
      <div v-if="ddisclaimer && disclaimer !== ''" :class="{ 'white--text': dark}" class="mx-auto text-center text-uppercase mt-10">
        <h4 v-html="disclaimer" class="primary--text"></h4>
      </div>
      <div class="text-center">
        <v-btn :dark="dark" 
          class="flex-grow-1"
          x-large
          block
          color="primary" @click="$refs.inputFile.click()">
          browse files
        </v-btn>
      </div>
      
    </div>
    
    <div v-else class="d-flex h-100 text-center text-uppercase">
      <div class="ma-auto">
        <v-progress-linear indeterminate color="primary" />
        <h3 class="primary--text" :class="{ 'white--text': dark}">parsing {{ totalSize }}MB</h3>
      </div>
    </div>

    <v-dialog :dark="dark" :value="parsingFailure" max-width="300">
      <v-card :dark="dark">
        <v-card-title class="headline warning--text">
          Parsing error
        </v-card-title>
        <v-card-text>{{ parsingFailure }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :dark="dark" color="warning" text @click="parsingFailure = null">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as fs from "../../../file-system-api";
import { parseFiles } from "../../utils";
import icon from "../drag-and-drop.svg";

const defaultParsingFailureMessage =
  "Unfortunately none of your files can be loaded: please check your files complies with the DICOM standard format.";

export default {
  name: "DicomImportStep1",
  props: {
    series: { required: true, type: Array },
    metadata: { required: false, type: Array },
    disclaimer: { required: false, type: String },
    dark: { default: false, type: Boolean}
  },
  data: () => ({
    dragging: false,
    icon,
    loading: false,
    parsingFailure: null,
    totalSize: 0 // total files size in mb
  }),
  methods: {
    async loadSeries(event) {
      let parsingErrors = [];
      this.parsingFailure = null;
      this.loading = true;
      this.dragging = false;

      // Read selected files and folders
      const { files, errors } = await fs.readFiles(event);
      parsingErrors.push(...errors);

      // Initialize progress
      const currentSize = (
        files.reduce((accumulator, value) => accumulator + value.size, 0) /
        (1024 * 1024)
      ).toFixed(2);
      this.totalSize = this.totalSize + parseFloat(currentSize);

      // Get DICOM series
      parseFiles(files, this.metadata)
        .then(series => {
          if (!series || !series.length) {
            this.parsingFailure = defaultParsingFailureMessage;
          } else {
            this.$emit("new-series", { errors: parsingErrors, series });
          }
        })
        .catch(error => {
          // parseFiles error is a string and is a blocking error (no series can be loaded)
          console.error(error);
          this.parsingFailure =
            typeof error == "string" ? error : defaultParsingFailureMessage;
        })
        .finally(() => (this.loading = false));
    },
    onDragEnd() {
      this.dragging = false;
    },
    onDragOver(event) {
      this.dragging = true;
      fs.onDragOver(event);
    }
  }
};
</script>

<style lang="scss" scoped>

.dark-icon {
  filter: invert(100%);
}

.dropzone {
  height: 100%;
  width: 100%;
  border: 0.5em solid var(--v-primary-base);
  overflow: auto;

  &.dragging {
    opacity: 0.5;
  }

  .drop-icon {
    @media (max-height: 600px) {
      display: none;
    }
  }
}

.line-wraps {
  border-bottom: 1px solid var(--v-black-base);
  line-height: 0.1em;
  margin: 15px 0 20px;
  & > span {
    background: var(--v-grey-base);
    padding: 0 10px;
  }
}
</style>
