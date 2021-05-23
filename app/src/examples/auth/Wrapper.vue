<template>
  <v-app :style="{ padding: '10%' }">
    <div class="header black">
      <div class="white--text text-center">
        <div>DITTO AUTH</div>
      </div>
    </div>

    <div :style="{ marginTop: '100px' }">
      <router-view :style="{ flexBasis: '400px' }" />
    </div>
  </v-app>
</template>

<style>
body {
  background: lightgray;
}
</style>
