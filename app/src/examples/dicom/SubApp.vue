<template>
  <v-app data-app>
    <div :style="{ marginBottom: '5px' }">Basic usage</div>
    <div :style="{ height: '100px' }">
      <ditto-dicom-import-modal @dicom-import-open="openViewer" />
    </div>

    <div :style="{ marginTop: '20px', marginBottom: '5px' }">
      Custom metadata
    </div>
    <div :style="{ height: '100px' }">
      <ditto-dicom-import-modal
        :options="{ metadata }"
        @dicom-import-open="openViewer"
      />
    </div>

    <div :style="{ marginTop: '20px', marginBottom: '5px' }">
      Activate actions
    </div>
    <div :style="{ height: '100px' }">
      <ditto-dicom-import-modal
        :options="{ steps }"
        @dicom-import-open="openViewer"
        @dicom-import-upload="uploadData"
      />
    </div>

    <div :style="{ marginTop: '20px', marginBottom: '5px' }">Custom slot</div>
    <div :style="{ height: '100px' }">
      <ditto-dicom-import-modal
        :options="{ headers, metadata }"
        @dicom-import-open="openViewer"
      >
        <template v-slot:patient="{ item }">
          patient custom slot content {{ Object.keys(item) }}
        </template>
      </ditto-dicom-import-modal>
    </div>
  </v-app>
</template>

<script>
const steps = [
  // step 1: preserve default options
  undefined,
  // step 2: enable first default action
  { actions: [{ disabled: false }] }
];
const metadata = ["x00100010", "x00100040", "x0008103e"];
const headers = [
  { sortable: false, text: "", value: "preview" },
  {
    cellClass: "cell-patient",
    sortable: false,
    slot: true,
    text: "patient",
    value: "patient"
  },
  {
    cellClass: "cell-x0008103e",
    sortable: true,
    slot: true,
    text: "metadata-x0008103e",
    value: "x0008103e"
  }
];

export default {
  data: () => ({
    headers,
    metadata,
    steps
  }),
  methods: {
    openViewer(data) {
      console.log("open viewer", data);
    },
    uploadData(data) {
      console.log("open viewer", data);
    }
  }
};
</script>

<style>
.h-100 {
  height: 100%;
}
.w-100 {
  width: 100%;
}
</style>
