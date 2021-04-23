<template>
  <div><b>OTHER</b> nav left (dark: {{ dark }})</div>
</template>

<script>
export default {
  props: { dark: { default: false, type: Boolean } }
};
</script>
