<template>
  <div>
    <div :style="{ textAlign: 'center' }">
      <img src="@/assets/logo.png" alt="" />
      <h3>DITTO</h3>
    </div>

    <div :style="{ padding: '3em' }">
      <table :style="{ width: '100%' }">
        <thead>
          <th>TOOL</th>
          <th>EXAMPLE</th>
          <th>DOCS</th>
        </thead>
        <tbody>
          <tr>
            <td>wireframes</td>
            <td>
              <div>
                <router-link to="/basic-wireframe" target="_blank"
                  >/basic-wireframe</router-link
                >
              </div>
              <div>
                <router-link to="/double-navigation-wireframe" target="_blank"
                  >/double-navigation-wireframe</router-link
                >
              </div>
            </td>
            <td>
              <a href="" target="_blank"
                >docs</a
              >
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              ...
            </td>
            <td>docs</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
thead {
  text-align: left;
}
</style>
