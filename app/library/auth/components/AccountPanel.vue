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
        <span>&nbsp;</span>
        <b class="text-capitalize">{{ user.last_name }}</b>
      </v-list-item-title>

      <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>

      <div class="mt-2">
        <v-btn
          v-if="settingsRouteName"
          block
          class="mb-1"
          :dark="dark"
          outlined
          small
          :to="{ name: settingsRouteName }"
          >Personal settings</v-btn
        >
        <v-btn block :dark="dark" outlined small @click="logout">Log out</v-btn>
      </div>
    </v-list-item-content>
  </v-list-item>

  <v-list-item v-else-if="!user && mobile">
    <v-list-item-content>
      <div class="mt-2">
        <v-btn block :dark="dark" outlined small @click="login">Log in</v-btn>
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
        <span>&nbsp;</span>
        <span class="text-capitalize">{{ user.last_name }}</span>
      </v-card-title>
      <v-card-subtitle>{{ user.email }}</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <template v-if="buildId">
          {{ buildId }}
        </template>
        <template v-else>
          <span style="color: red;">Error: Build ID is missing.</span>
        </template>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          v-if="settingsRouteName"
          color="primary"
          :dark="dark"
          text
          :to="{ name: settingsRouteName }"
        >
          Personal settings
        </v-btn>
        <v-btn color="primary" :dark="dark" text @click="logout">Log out</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>

  <v-menu
    v-else-if="!user && !mobile"
    :open-on-hover="openOnHover"
    tile
    v-bind="options"
  >
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
      <v-card-actions>
        <v-btn color="primary" :dark="dark" text @click="login">Log in</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
const defaultGetUserFn = _this => _this.$store.state.auth.user;
const defaultLoginFn = _this => _this.$router.replace({ name: "login" });
const defaultLogoutFn = _this => {
  _this.$store.dispatch("auth/logout");
  _this.$router.replace({ name: "login" });
};

import buildData from "@/../BUILD_ID.json";

export default {
  name: "AccountPanel",
  props: {
    activatorClass: { required: false, type: String },
    dark: { default: false, type: Boolean },
    direction: { required: false, type: String },
    getUserFn: { default: defaultGetUserFn, type: Function },
    icon: { default: "mdi-account", type: String },
    label: { default: "account", type: String },
    loginFn: { default: defaultLoginFn, type: Function },
    logoutFn: { default: defaultLogoutFn, type: Function },
    mobile: { default: false, type: Boolean },
    settingsRouteName: { required: false, type: String },
    openOnHover: { default: false, type: Boolean }
  },
  data() {
    return {
      user: this.getUserFn(this),
      buildId: buildData.build_id
    };
  },
  computed: {
    iconColor() {
      return this.settingsRouteName &&
        this.$route.name == this.settingsRouteName
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
    }
  },
  methods: {
    logout() {
      this.logoutFn(this);
    },
    login() {
      this.loginFn(this);
    }
  }
};
</script>
