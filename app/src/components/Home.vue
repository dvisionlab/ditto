<template>
  <div>
    <div :style="{ textAlign: 'center' }">
      <img src="@/assets/logo.png" alt="" />
      <h3>DITTO</h3>
    </div>

    <div :style="{ padding: '3em' }">
      <table :style="{ width: '100%' }">
        <thead>
          <th>MODULE</th>
          <th>EXAMPLE</th>
          <th>DOCS</th>
        </thead>
        <tbody>
          <tr>
            <td>auth</td>
            <td><router-link to="/auth" target="_blank">/auth</router-link></td>
            <td>
              <a
                href="https://github.com/dvisionlab/ditto/blob/master/app/library/auth/README.md"
                target="_blank"
              >
                docs
              </a>
            </td>
          </tr>

          <tr>
            <td>http</td>
            <td><router-link to="/http" target="_blank">/http</router-link></td>
            <td>
              <a
                href="https://github.com/dvisionlab/ditto/blob/master/app/library/http/README.md"
                target="_blank"
              >
                docs
              </a>
            </td>
          </tr>

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
              <a
                href="https://github.com/dvisionlab/ditto/blob/master/app/library/wireframes/README.md"
                target="_blank"
              >
                docs
              </a>
            </td>
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
