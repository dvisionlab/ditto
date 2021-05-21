# DICOM plugin

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

This component renders a series stack into a canvas using _larvitar_.

#### Props

| Name                    | Description                                                                                                                                                   | Type           | Default                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------- |
| **clearCacheOnDestroy** | whether to tell _larvitar_ to clear the image cache for the rendered series on component unmount; it works only with _clearOnDestroy_ set to `true`           | Boolean        | `false`                                                                             |
| **clearOnDestroy**      | whether to tell _larvitar_ to clear the data stored by _larvitar_ for the rendered series on component unmount (see _clearSeriesData_ in [utils](./utils.js)) | Boolean        | `false`                                                                             |
| **canvasId**            | the id to assign to the canvas element                                                                                                                        | String         | `true`                                                                              |
| **getProgressFn**       | the function the component should use to get the series loading status; should return a value between 0 and 100                                               | Function       | `(store, seriesId) => (store.state.larvitar.series[seriesId] || {}).progress`       |
| **getViewportFn**       | the function the component should use to get the viewport object                                                                                              | Function       | `(store, seriesId, canvasId) => store.getters["larvitar/viewport"](canvasId) || {}` |
| **seriesId**            | the id of the series you want to render; when the stack is not provided by the _stack_ prop this value is used to get the series stack from _larvitar_        | String, Number | `true`                                                                              |
| **showProgress**        | whether this component shoul show a a loading progress                                                                                                        | Boolean        | `false`                                                                             |
| **stack**               | the stack of the series you want to render (_larvitar_ stack format is required)                                                                              | Object         | `undefined`                                                                         |
| **tools**               | the list of the tools you want to activate on this canvas (_larvitar_ tools format is required)                                                               | Array          | `stackTools.default`, see [defaults](./defaults.js)                                 |
| **toolsHandlers**       | the tools handlers configuration (_larvitar_ tools handlers format is required)                                                                               | Object         | `undefined`                                                                         |

#### Slots

| Name                | Description                                                                                                                     | v-bind                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **stack-metadata**  | Allows your application to access the stack metadata; generally used to show static metadata fields over the canvas             | an object with the stack metadata                           |
| **viewport-data**   | Allows your application to access the viewport data; generally used to show dynamic viewport data over the canvas               | an object with the viewport data                            |
| **viewport-slider** | Allows your application to access the viewport `sliceId` and `maxSliceId` information, needed to build a stack slider component | `{i: [the current slice id], n: [the series max slide id]}` |

#### Events

| Name      | Description                         | Args ! |
| --------- | ----------------------------------- | ------ |
| **ready** | emitted when the series is rendered | none   |

#### Usage

Basic usage:

```html
<ditto-dicom-canvas canvas-id="main" series-id="1234125" />
```

With slots:

```html
<ditto-dicom-canvas :canvas-id="main" :series-id="1234125">
  <template v-slot:stack-metadata="data"><div>...</div></template>
  <template v-slot:viewport-data="data"><div>...</div></template>
  <template v-slot:viewport-slider="{ i, n }"><div>...</div></template>
</ditto-dicom-canvas>
```

With events:

```html
<ditto-dicom-canvas
  canvas-id="main"
  series-id="1234125"
  @ready="onCanvasReady"
/>
```

### ditto-dicom-canvas-data

This component renders a set of common dynamic viewport data (the viewport _size_, _spacing_, _thickness_, _voi_...). Is generally used as slot content of the _stack-metadata_ slot provided by the _ditto-dicom-canvas_ component.

#### Props

| Name     | Description              | Type   |
| -------- | ------------------------ | ------ |
| **data** | the viewport data object | Object |

#### Usage

```html
<ditto-dicom-canvas-data :data="data" />
```

### ditto-dicom-import

// TODO

### ditto-dicom-import-modal

// TODO

### ditto-dicom-series-summary

This component renders a set of a series stack infromation.

#### Props

| Name                    | Description                                                                                                                                                                                                  | Type    | Default                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | --------------------------------------------------- |
| **canvasId**            | the id to assign to the canvas element, when the series canvas is required                                                                                                                                   | String  | `undefined`                                         |
| **clearCacheOnDestroy** | whether to tell _larvitar_ to clear the image cache for the rendered series on component unmount; it works only with _clearOnDestroy_ set to; used only when the _showCanvas_ prop is `true`                 | Boolean | `true`                                              |
| **clearOnDestroy**      | whether to tell _larvitar_ to clear the data stored by _larvitar_ for the rendered series on component unmount (see _clearSeriesData_ in [utils](./utils.js); used only when the _showCanvas_ prop is `true` | Boolean | `true`                                              |
| **data**                | the series stack data (_larvitar_ stack format is required)                                                                                                                                                  | Object  | `undefined`                                         |
| **showCanvas**          | whether this component should render the series canvas using the _ditto-dicom-canvas_ component                                                                                                              | Boolean | `true`                                              |
| **showProgress**        | whether this component shoul show a a loading progress; used only when the _showCanvas_ prop is `true`                                                                                                       | Boolean | `false`                                             |
| **showThumbnail**       | whether this component should render the series thumbnail; the thumbnail should be an image url or a base64 string available at `data.thumbnail`                                                             | Boolean | `false`                                             |
| **tools**               | the list of the tools you want to activate on this canvas (_larvitar_ tools format is required); used only when the _showCanvas_ prop is `true`                                                              | Array   | `stackTools.preview`, see [defaults](./defaults.js) |

#### Slots

A default slot is available to add your preferred content.

#### Usage

Basic usage:

```html
<ditto-dicom-series-summary :canvas-id="summary-main" :data="series" />
```

With series thumbnail instead of canvas:

```html
<ditto-dicom-series-summary
  :canvas-id="summary-main"
  :data="{ ...series, thumbnail: '...' }"
  show-thumbnail
/>
```

Without tools:

```html
<ditto-dicom-series-summary
  :canvas-id="summary-main"
  :data="series"
  :tools="[]"
/>
```

With slot:

```html
<ditto-dicom-series-summary :canvas-id="summary-main" :data="series">
  <div>custom content</div>
</ditto-dicom-series-summary>
```

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
