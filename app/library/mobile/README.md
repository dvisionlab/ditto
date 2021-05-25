# Mobile plugin

A Vue plugin that provides a set of functionalities to help you manage mobile screens - and setups some things for you without you have to do nothing: always register this into your applications!

## Dependencies

- Vue

## Usage

Import the plugin and register it:

```js
import mobilePlugin from "@/../ditto/mobile";
Vue.use(mobilePlugin);
```

## Functionalities

The plugin registers a _viewport unit variable_ to solve the mobile viewport height issue (see [here](https://css-tricks.com/the-trick-to-viewport-units-on-mobile/)). If your app uses _vuetify_ the plugin automatically inject some css to fix this issue and you don't have to do nothing until you work inside the `<v-app>` tag. If you need it you can use this variable as follow:

```css
.your-root-element {
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100); /* 100% height using the --vh property */
}
```

This plugin also provide a set of utility methods to manage the fullscreen:

- _openFullscreen_: a function to display the application in full-screen mode
- _closeFullscreen_: a function to exit from full-screen mode
- _isFullscreenEnabled_: a property that tells you whether or not it is possible to engage full-screen mode; the property is `false` if full-screen mode is not available for any reason (such as the "fullscreen" feature not being allowed, or full-screen mode not being supported by your browser)
- _isFullscreenMode_: a function that returns `true` if the application is currently displayed in full-screen mode

These methods are available at `Vue.prototype.$mobile`.
