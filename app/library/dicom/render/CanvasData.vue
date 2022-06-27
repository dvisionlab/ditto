<template>
  <div class="text-uppercase">
    <div>size: [{{ data.rows || 0 }} x {{ data.cols || 0 }}]</div>
    <div v-if="data.spacing_x && data.spacing_y">
      spacing: [{{ data.spacing_x.toFixed(2) }} x
      {{ data.spacing_y.toFixed(2) }}]
    </div>
    <div v-if="data.thickness">
      thickness: {{ data.thickness.toFixed(2) }}
      <span class="text-lowercase">mm</span>
    </div>
    <div v-if="data.viewport && data.viewport.voi">
      WW/WL: [{{ (data.viewport.voi.windowWidth || 0).toFixed(2) }}/{{
        (data.viewport.voi.windowCenter || 0).toFixed(2)
      }}]
    </div>
    <template v-if="data.viewport">
      <div v-if="data.viewport.hasOwnProperty('scale')">
        scale: {{ data.viewport.scale.toFixed(2) }}
      </div>
      <div v-if="data.viewport.hasOwnProperty('rotation')">
        rotation: {{ data.viewport.rotation.toFixed(2) }}°
      </div>
    </template>
    <div v-if="data.maxSliceId">
      <div v-if="data.isTimeserie">
        slice: {{ Math.ceil((data.sliceId + 1) / (data.maxTimeId + 1)) }}/{{
          (data.maxSliceId + 1) / (data.maxTimeId + 1) + 1
        }}
      </div>
      <div v-else>slice: {{ data.sliceId + 1 }}/{{ data.maxSliceId + 1 }}</div>
    </div>
    <div v-if="data.isTimeserie">time: {{ data.timestamp }}</div>
  </div>
</template>

<script>
export default {
  name: "CanvasData",
  props: {
    data: { required: true, type: Object }
  }
};
</script>
