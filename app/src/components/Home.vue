<template>
  <div>
    <div :style="{ textAlign: 'center' }">
      <img src="@/assets/logo.png" alt="" />
      <h3>DITTO</h3>
    </div>

    <div :style="{ padding: '3em' }">
      <h3>EXAMPLES</h3>
      <div>
        <router-link to="/basic-wireframe">/basic-wireframe</router-link>
      </div>
      <div>
        <router-link to="/double-navigation-wireframe"
          >/double-navigation-wireframe</router-link
        >
      </div>
    </div>
  </div>
</template>
