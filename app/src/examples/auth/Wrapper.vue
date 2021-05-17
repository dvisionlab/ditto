<template>
  <div :style="{ padding: '10%' }">
    <div class="header black">
      <div class="app-name mt-4 white--text text-center">
        <div>DITTO AUTH</div>
      </div>
    </div>

    <div :style="{ marginTop: '100px' }">
      <router-view :style="{ flexBasis: '400px' }" />
    </div>
  </div>
</template>

<style>
body {
  background: lightgray;
}
</style>
