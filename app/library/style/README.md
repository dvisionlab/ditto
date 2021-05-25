# Style

A Js library to provide style-related functionalities.

## Features

### CSS to RGB converter

A Js function to convert HEX colors into RGB colors. The reason is explained [here](https://github.com/vuetifyjs/vuetify/issues/9282).

### Usage

Import the _hexToRgbaCustomVariables_ method and use it passing as parameter an object where each key is a color name and each value is a hex color value.

```js
import { hexToRgbaCustomVariables } from "@/../ditto/style";
hexToRgbaCustomVariables({
  primary: "#3477A3",
  secondary: "#D9B60A",
  accent: "#30B052",
  anchor: "#3477A3",
  black: "#262626",
  grey: "#EAEAEA"
});
```

This methods generates a RGB custom variable for each hex color, that you can use into css files as follows:

```css
.your-class {
  color: rgba(var(--v-primary-rgb), 1);
  background: rgba(var(--v-grey-rgb), 0.55);
}
```
