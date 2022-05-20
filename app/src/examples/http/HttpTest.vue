<template>
  <div>
    <h1>Http plugin</h1>

    <div>GET response:</div>
    <p>
      endpoint <b>{{ url }}</b>
    </p>
    <p>{{ data }}</p>

    <hr />

    <div>GET error:</div>
    <p>endpoint <b>fakeurl</b></p>
    <p>{{ error }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import httpPlugin from "@/../library/http/plugin";
import { InstallParams } from "@/../library/http/types";

const params: InstallParams = { options: {} };
Vue.use(httpPlugin, params);

export default {
  data: () => ({
    error: null,
    data: null,
    url: "http://headers.jsontest.com/"
  }),
  mounted() {
    // get request to a test server
    this.$http.get(this.url).then(response => (this.data = response.data));
    // get request failure test
    this.$http
      .get("fakeurl", { a: 1, b: 2 })
      .then(response => console.log(response))
      .catch(error => (this.error = error));
  }
};
</script>
