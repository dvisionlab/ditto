<template>
  <v-app>
    <div class="pa-4">
      <div>
        valid date string ("2021-05-25T08:40:49.732Z"):
        <date-string tag="span" value="2021-05-25T08:40:49.732Z" />
      </div>
      <div>
        invalid date string ("asd"): <date-string tag="span" value="asd" />
      </div>

      <div class="mt-4">
        valid time string ("10:15:50"):
        <time-string tag="span" value="10:15:50" />
      </div>
      <div>
        invalid time string ("asd"): <time-string tag="span" value="asd" />
      </div>

      <div class="mt-4">
        patient name string ("mr^anonymous^patient"):
        <x00100010-string tag="span" value="mr^anonymous^patient" />
      </div>
      <div>
        patient id string (SDF45): <x00100020-string tag="span" value="SDF45" />
      </div>
      <div>
        patient sex string (m): <x00100040-string tag="span" value="m" />
      </div>

      <div class="mt-4">
        slice thickness (5.123456):
        <x00180050-string tag="span" :value="5.123456" />
      </div>

      <div class="mt-4">
        thumbnail string ("https://www.dvisionlab.com/images/logo_dv.png"):
        <thumbnail-string
          value="https://www.dvisionlab.com/images/logo_dv.png"
        />
      </div>
      <div>
        large thumbnail string
        ("https://www.dvisionlab.com/images/logo_dv.png"):
        <thumbnail-string
          value="https://www.dvisionlab.com/images/logo_dv.png"
          width="40em"
        />
      </div>
    </div>
  </v-app>
</template>

<script>
import dataTypes from "@/../library/data-types/index";
import dicomDataTypes from "@/../library/data-types/dicom";

export default {
  components: {
    ...dataTypes,
    ...dicomDataTypes,
  },
};
</script>
