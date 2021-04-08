<template>
  <!-- personal account panel -->
  <!-- mobile -->
  <v-list-item v-if="user && mobile">
    <v-list-item-icon>
      <v-icon :color="iconColor">{{ icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>
        <b class="text-capitalize">{{ user.first_name }}</b>
        &nbsp;
        <b class="text-capitalize">{{ user.last_name }}</b>
      </v-list-item-title>

      <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>

      <div class="mt-2">
        <v-btn
          v-if="settingsRoute"
          block
          class="mb-1"
          :dark="dark"
          outlined
          small
          :to="settingsRoute"
          >Personal settings</v-btn
        >
        <v-btn block :dark="dark" outlined small @click="logout">Log out</v-btn>
      </div>
    </v-list-item-content>
  </v-list-item>

  <!-- desktop -->
  <v-menu v-else-if="user" :open-on-hover="openOnHover" tile v-bind="options">
    <template v-slot:activator="{ on, attrs }">
      <slot v-bind="{ on, attrs }">
        <!-- default slot content -->
        <v-btn
          :class="activatorClass"
          height="100%"
          text
          v-bind="attrs"
          v-on="on"
        >
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

    <v-card :dark="dark" flat tile>
      <v-card-title class="d-inline-block">
        <span class="text-capitalize">{{ user.first_name }}</span>
        &nbsp;
        <span class="text-capitalize">{{ user.last_name }}</span>
      </v-card-title>
      <v-card-subtitle>{{ user.email }}</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-actions>
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
    activatorClass: { required: false, type: String },
    dark: { default: false, type: Boolean },
    direction: { required: false, type: String },
    icon: { default: "mdi-account", type: String },
    label: { default: "account", type: String },
    mobile: { default: false, type: Boolean },
    settingsRoute: { required: false, type: String },
    openOnHover: { default: false, type: Boolean }
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

        case "bottom-left":
          result["offset-y"] = true;
          result["left"] = true;
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
