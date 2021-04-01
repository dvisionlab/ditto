<template>
  <!-- personal account panel -->
  <v-menu v-if="user" :open-on-hover="openOnHover" tile v-bind="options">
    <template v-slot:activator="{ on, attrs }">
      <slot v-bind="{ on, attrs }">
        <!-- default slot content -->
        <v-btn height="100%" text v-bind="attrs" v-on="on">
          <div class="text-center lh-small">
            <v-icon :color="iconColor">{{ icon }}</v-icon>
            <div class="d-flex align-center">
              <b :class="`${iconColor}--text`">{{ label }}</b>
              <v-icon :color="iconColor" small>mdi-chevron-down</v-icon>
            </div>
          </div>
        </v-btn>
      </slot>
    </template>

    <v-card color="grey" flat tile>
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
    direction: { required: false, type: String },
    icon: { default: "mdi-account", type: String },
    label: { default: "account", type: String },
    settingsRoute: { required: false, type: String },
    openOnHover: { default: false, type: Boolean },
    title: { default: "account", type: String }
  },
  computed: {
    iconColor() {
      return this.settingsRoute && this.$route.name == this.settingsRoute
        ? "accent"
        : "inherit";
    },
    options() {
      let result = {};

      switch (this.direction) {
        case "bottom":
          result["offset-y"] = true;
          break;

        case "right":
          result["offset-x"] = true;
          result["top"] = true;
          break;

        default:
          break;
      }

      return result;
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
