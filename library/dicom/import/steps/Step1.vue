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
      class="d-flex dropzone pa-4"
      :class="{ dragging, 'primary--text': dragging }"
      @drop.prevent.stop="loadSeries"
      @dragover.prevent.stop="onDragOver"
      @dragend="onDragEnd"
      @dragleave="onDragEnd"
    >
      <div class="text-center text-uppercase ma-auto">
        <!-- TODO customizable icon -->
        <img :draggable="false" src="/media/images/drag-and-drop.svg" alt="" />
        <h3>drop files and folders here</h3>
        <div class="line-wraps"><span>or</span></div>
        <v-btn block color="primary" @click="$refs.inputFile.click()">
          browse files
        </v-btn>
      </div>
    </div>

    <div v-else class="d-flex h-100 text-center text-uppercase">
      <div class="ma-auto">
        <v-progress-linear indeterminate color="primary" />
        <h3 class="primary--text">parsing {{ totalSize }}MB</h3>
      </div>
    </div>
  </div>
</template>

<script>
import fs from "@/../ditto/fileSystemApi";
import { parseFiles } from "../../utils";

export default {
  name: "DicomImportStep1",
  props: {
    series: { required: true, type: Array },
    metadata: { required: false, type: Array }
  },
  data: () => ({
    dragging: false,
    loading: false,
    totalSize: 0 // total files size in mb
  }),
  methods: {
    async loadSeries(event) {
      let allErrors = [];
      this.loading = true;
      this.dragging = false;

      // Read selected files and folders
      const { files, errors } = await fs.readFiles(event);
      allErrors.push(...errors);

      // Initialize progress
      const currentSize = (
        files.reduce((accumulator, value) => accumulator + value.size, 0) /
        (1024 * 1024)
      ).toFixed(2);
      this.totalSize = this.totalSize + parseFloat(currentSize);

      // Get DICOM series
      parseFiles(files, this.metadata).then(({ series, errors }) => {
        allErrors.push(...errors);
        this.loading = false;
        this.$emit("new-series", { errors: allErrors, series });
      });
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
.dropzone {
  height: 100%;
  width: 100%;
  border: 0.5em solid var(--v-primary-base);
  overflow: auto;

  &.dragging {
    opacity: 0.5;
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
