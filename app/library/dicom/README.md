# DICOM pack

A Vue plugin that provides a set of functionalities and components to read and render DICOM images and their metadata.

## Dependencies

- DITTO [file-system-api](../file-system-api/README.md)
- DITTO [relative-height](../relative-height/README.md)
- DITTO [data-types/dicom](../data-types/README.md)
- Larvitar
- Vue
- Vuetify
- vue-resize-directive

## Usage

Import the plugin and register it:

```js
import dicomPlugin from "@/../ditto/dicom";
Vue.use(dicomPlugin, {...});
```

## Options

Available plugin options:

| Option         | Description                                                                                                                                                                                        | Default     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **canvas**     | whether this plugin should register the `ditto-dicom-canvas` and `ditto-dicom-canvas-data` components globally                                                                                     | `true`      |
| **dataTypes**  | whether this plugin should register the dicom data types components globally with the name of `ditto-data-type-[name]` (see the [data-types](../data-types/README.md) docs for more information)   | `false`     |
| **import**     | whether this plugin should register the `ditto-dicom-import` and `ditto-dicom-import-modal` components globally                                                                                    | `true`      |
| **series**     | whether this plugin should register the `ditto-dicom-series-summary` component globally                                                                                                            | `false`     |
| **store**      | the _vuex_ store object of your application; when provided, this plugin tells _larvitar_ to use a _vuex_ store named _larvitar_ (that currently should be registered manually by your application) | `undefined` |
| **toolsStyle** | the configuration object of the _cornerstone tools_ style; available keys: `activeColor`, `backgroundColor`,`color`,`fillColor`,`fontFamily`,`fontSize`, `width`                                   | `undefined` |
| **utils**      | whether this plugin should expose its utilities methods at `Vue.prototype.$ditto.dicom`                                                                                                            | `false`     |

Here is a custom configuration example:

```js
import store from "./store";

const lightTheme = vuetify.userPreset.theme.themes.light;

let toolsStyle = {
  activeColor: lightTheme.secondary,
  backgroundColor: "rgba(1, 1, 1, 0.85)",
  color: lightTheme.dicomTool,
  fillColor: lightTheme.dicomTool,
  fontFamily: "Comfortaa",
  fontSize: 14,
  width: 2
};

const dicomPluginOptions = {
  dataTypes: true,
  series: true,
  store,
  toolsStyle,
  utils: true
};

Vue.use(dicomPlugin, dicomPluginOptions);
```

## Components interface

### ditto-dicom-canvas

// TODO

### ditto-dicom-canvas-data

// TODO

### ditto-dicom-import

// TODO

### ditto-dicom-import-modal

// TODO

### ditto-dicom-series-summary

// TODO

## Utils methods

// TODO

- activateTool
- addTools
- disableTool
- editTool
- hideTool
- showTool
- buildData
- buildHeader
- clearSeriesData
- deleteViewport
- disableCanvas
- getCinematicData
- getSeriesStack
- mergeSeries
- parseFiles
- renderSeries
- resizeViewport
- seriesIdToElementId
- setup
- storeSeriesStack
- updateSeriesSlice
- updateViewportProperty

## DICOM metadata

TODO available as extra module

## Example code

See the [DICOM examples code](https://github.com/dvisionlab/ditto/tree/examples/app/src/master/dicom) for more information.
