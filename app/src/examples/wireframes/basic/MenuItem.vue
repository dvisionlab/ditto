<template>
  <div>
    <!-- mobile menu -->
    <v-list-group v-if="mobile" color="primary">
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>menu item</v-list-item-title>
          <v-list-item-subtitle>
            <div class="d-flex align-center">
              <v-icon color="primary">mdi-check</v-icon>
              <span class="primary--text text-uppercase pl-2">
                {{
                  actions[selectedActionIndex]
                    ? actions[selectedActionIndex].name
                    : null
                }}
              </span>
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>

      <v-list-item-group mandatory v-model="selectedActionIndex">
        <v-list-item v-for="(action, i) in actions" :key="i">
          <v-list-item-icon>
            <v-icon v-if="action.icon">{{ action.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <span>{{ action.name }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list-group>

    <!-- desktop menu -->
    <div v-else class="header-group">
      <div class="header-title">menu item</div>

      <v-btn-toggle
        color="primary"
        group
        height="100%"
        mandatory
        tile
        v-model="selectedActionIndex"
      >
        <template v-for="(action, index) in actions">
          <v-tooltip :key="index" bottom :nudge-bottom="-5" :open-delay="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="ma-0" :value="index" v-bind="attrs" v-on="on">
                <template v-if="action.icon">
                  <v-icon>{{ action.icon }}</v-icon>
                </template>
                <span v-else>{{ action.name }}</span>
              </v-btn>
            </template>
            <span class="text-caption text-uppercase">{{ action.name }}</span>
          </v-tooltip>
        </template>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dark: { default: false, type: Boolean },
    mobile: { default: false, type: Boolean }
  },
  data: () => ({
    actions: [
      { name: "a1", icon: "mdi-alarm-plus" },
      { name: "a2", icon: "mdi-alarm-off" },
      { name: "a3", icon: "mdi-alarm-snooze" }
    ],
    selectedActionIndex: 0
  })
};
</script>
