<template>
  <!-- personal account panel -->
  <v-menu v-if="user" :offset-x="offsetX" :offset-y="offsetY" tile>
    <template v-slot:activator="{ on, attrs }">
      <slot v-bind="{ on, attrs }">
        <!-- default slot content -->
        <v-btn height="100%" text v-bind="attrs" v-on="on">
          <div class="text-center lh-small">
            <v-icon :color="iconColor">{{ icon }}</v-icon>
            <div>
              <b :class="`${iconColor}--text`">{{ label }}</b>
            </div>
          </div>
        </v-btn>
      </slot>
    </template>

    <v-card flat tile>
      <v-card-title class="d-inline-block">
        <span class="text-capitalize">{{ user.firstname }}</span>
        &nbsp;
        <span class="text-capitalize">{{ user.lastname }}</span>
      </v-card-title>
      <v-card-subtitle>{{ user.email }}</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn v-if="settingsRoute" color="primary" text :to="settingsRoute">
          Personal settings
        </v-btn>
        <v-btn color="primary" text @click="logout">Log out</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "AccountPanel",
  props: {
    icon: { default: "mdi-account", type: String },
    label: { default: "account", type: String },
    offsetX: { default: true, type: Boolean },
    offsetY: { default: false, type: Boolean },
    settingsRoute: { required: false, type: String }
  },
  computed: {
    iconColor() {
      return this.settingsRoute && this.$route.name == this.settingsRoute
        ? "accent"
        : "inherit";
    },
    user() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.replace({ name: "login" });
    }
  }
};
</script>
