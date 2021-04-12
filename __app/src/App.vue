<template>
  <div id="app">
    <h1>{{ name }}</h1>
  </div>
</template>

<script>
import { name } from "@/../package.json";

export default {
  name: "App",
  data() {
    return {
      name
    };
  }
};
</script>
