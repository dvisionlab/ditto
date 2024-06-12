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
      </v-list-item-title>

      <v-list-item-subtitle>{{ user.first_name }}</v-list-item-subtitle>

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
  <v-menu
    content-class="elevation-10"
    v-else-if="user"
    :open-on-hover="openOnHover"
    :close-on-content-click="false"
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

    <v-card
      :color="dark ? '#2c2c2c' : '#FFFFFF'"
      elevation="24"
      :dark="dark"
      flat
      tile
    >
      <v-card-title class="d-inline-block">
        <span class="text-capitalize">{{ user.first_name }}</span>
        <span>&nbsp;</span>
        <span class="text-capitalize">{{ user.last_name }}</span>
      </v-card-title>
      <v-card-subtitle>{{ user.email }}</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" :dark="dark" text @click="openUploadLinkDialog">
          <span>Share external upload link</span>
          <v-icon class="ml-1">mdi-upload-outline</v-icon>
        </v-btn>
        <v-dialog
          overlay-color="black"
          overlay-opacity="0.7"
          :dark="dark"
          max-width="600"
          :value="uploadLinkDialog"
          @click:outside="doNothing"
        >
          <v-card>
            <v-card-title class="headline">
              Share External Upload link
            </v-card-title>
            <v-card-text>
              Share the QR Code or the URL below to share this item
            </v-card-text>
            <div class="qr-code-container">
              <img :src="qrCodeDataURL" alt="QR Code" class="qr-code-img" />
            </div>
            <v-card-text style="user-select: text">
              <v-row class="mt-2">
                <v-col>
                  <v-icon left>mdi-link</v-icon>
                  <span style="user-select: text" class="font-weight-bold">{{
                    uploadLinkURL
                  }}</span>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text style="user-select: text">
              <v-row>
                <v-col>
                  <v-icon left>mdi-clock-outline</v-icon>
                  <span class="font-weight-bold">Expiration: </span>
                  <span style="user-select: text">{{
                    uploadLinkExpiration
                  }}</span>
                </v-col>
              </v-row>
            </v-card-text>

            <!-- Email field and send button -->
            <v-card-text>
              <v-row align="center">
                <v-col cols="9">
                  <v-text-field
                    label="Email"
                    v-model="email"
                    prepend-icon="mdi-email"
                    type="email"
                    :rules="[emailRule]"
                    ref="emailField"
                    @input="sendMailStatus = null"
                  ></v-text-field>
                </v-col>
                <v-col cols="3" class="d-flex align-center">
                  <v-progress-circular
                    v-if="sendMailStatus === 'sending'"
                    class="ml-2"
                    color="accent"
                    indeterminate
                    :size="24"
                    :value="100"
                    :width="3"
                  />
                  <v-btn
                    v-else
                    text
                    @click="sendLinkViaEmail"
                    color="primary"
                    :disabled="!isEmailValid || sendMailStatus !== null"
                  >
                    <span v-if="!sendMailStatus">Send</span>
                    <span v-else-if="sendMailStatus === 'success'">Sent</span>
                    <span v-else-if="sendMailStatus === 'error'">Error</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn id="SLD2" text @click="copyToClipBoard" color="primary">
                <div v-if="copyedToClipBoard">URL copied!</div>
                <div v-if="!copyedToClipBoard">Copy URL</div>
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn
                id="SLD1"
                text
                @click="
                  uploadLinkDialog = null;
                  sendMailStatus = null;
                "
              >
                Close Dialog
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
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
    content-class="elevation-20"
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
import QRCode from "qrcode";
import { toReadableDate } from "@/js/utils.general";
import { generateUploadLink, sendLinkViaMail } from "@/js/api.schema";
const defaultGetUserFn = _this => _this.$store.state.auth.user;
const defaultLoginFn = _this => _this.$router.replace({ name: "login" });
const defaultLogoutFn = async _this => {
  try {
    await _this.$store.dispatch("auth/logout");
    _this.$router.replace({ name: "login" });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

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
      uploadLinkDialog: null,
      qrCodeDataURL: "",
      uploadLinkURL: "",
      uploadLinkExpiration: "",
      email: null,
      emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      sendMailStatus: null,
      copyedToClipBoard: false
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
    },
    emailRule() {
      return value => this.emailPattern.test(value) || "Invalid email address";
    },
    isEmailValid() {
      return this.emailPattern.test(this.email);
    }
  },
  methods: {
    logout() {
      this.logoutFn(this);
    },
    login() {
      this.loginFn(this);
    },
    openUploadLinkDialog() {
      generateUploadLink()
        .then(res => {
          if (res.status == 201) {
            this.copyedToClipBoard = false;
            this.uploadLinkURL =
              window.location.protocol +
              "//" +
              window.location.host +
              "/#/upload/" +
              res.data.uploadID;
            this.generateQRCode(this.uploadLinkURL);
            this.uploadLinkDialog = true;

            this.uploadLinkExpiration = toReadableDate(
              new Date(res.data.expiration)
            );
          } else {
            console.warn("something went wrong while generating the link", res);
            this.loading = false;
          }
        })
        .catch(resp => {
          this.loading = false;
          this.$store.commit("raiseSnackbar", {
            text: `Error:  [${resp.status}] - ${resp.body.detail}`,
            color: "error"
          });
        });
    },
    doNothing({ type, item }) {
      this.uploadLinkDialog = { type, item };
    },
    generateQRCode(url) {
      // Specify a larger width and height for the QR code
      const qrCodeOptions = {
        errorCorrectionLevel: "H",
        margin: 3,
        width: 300, // Adjust the desired width
        height: 300 // Adjust the desired height
      };

      QRCode.toDataURL(url, qrCodeOptions, (error, dataURL) => {
        if (error) {
          console.error("Error generating QR code:", error);
        } else {
          this.qrCodeDataURL = dataURL; // Store the data URL in the component's data
          this.qrCodeGenerated = true; // Set the flag to true when the QR code is ready
        }
      });
    },
    sendLinkViaEmail() {
      this.sendMailStatus = "sending";
      if (!this.$refs.emailField.validate()) {
        console.error("invalid email");
      }
      console.log("Sending email to:", this.email);

      sendLinkViaMail(this.email, this.uploadLinkURL)
        .then(() => {
          this.sendMailStatus = "success";
          this.$store.commit("raiseSnackbar", {
            text: `Success: link sent to ${this.email}`,
            color: "success",
            timeout: 5000
          });
        })
        .catch(() => {
          this.sendMailStatus = "error";
          this.$store.commit("raiseSnackbar", {
            text: `Error: link not sent`,
            color: "error",
            timeout: 5000
          });
        });
    },
    async copyToClipBoard() {
      await navigator.clipboard.writeText(this.uploadLinkURL);
      this.copyedToClipBoard = true;
      // Set copyedToClipBoard to false after 3 seconds
      setTimeout(() => {
        this.copyedToClipBoard = false;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.qr-code-container {
  text-align: center; /* Center-align the container */
  display: inline-block; /* Make the container inline */
  width: 100%; /* Set the
desired width for the QR code */
}
.qr-code-img {
  width: 75%; /* Set the desired
width for the QR code */
  display: block; /* Remove any residual inline display
*/
  margin: 0 auto; /* Center-align the image horizontally within the container
*/
}
</style>
