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

| Name                    | Description                                                                                                                                                   | Type           | Default                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------- |
| **clearCacheOnDestroy** | whether to tell _larvitar_ to clear the image cache for the rendered series on component unmount; it works only with _clearOnDestroy_ set to `true`           | Boolean        | `false`                                                                     |
| **clearOnDestroy**      | whether to tell _larvitar_ to clear the data stored by _larvitar_ for the rendered series on component unmount (see _clearSeriesData_ in [utils](./utils.js)) | Boolean        | `false`                                                                     |
| **canvasId**            | the id to assign to the canvas element                                                                                                                        | String         | `true`                                                                      |
| **getProgressFn**       | the function the component should use to get the series loading status; should return a value between 0 and 100                                               | Function       | (store, seriesId) => (store.state.larvitar.series[seriesId]                 |  | {}).progress |
| **getViewportFn**       | the function the component should use to get the viewport object                                                                                              | Function       | (store, seriesId, canvasId) => store.getters["larvitar/viewport"](canvasId) |  | {} |
| **seriesId**            | the id of the series you want to render; when the stack is not provided by the _stack_ prop this value is used to get the series stack from _larvitar_        | String, Number | `true`                                                                      |
| **showProgress**        | whether this component shoul show a a loading progress                                                                                                        | Boolean        | `false`                                                                     |
| **stack**               | the stack of the series you want to render (_larvitar_ stack format is required)                                                                              | Object         | `undefined`                                                                 |
| **tools**               | the list of the tools you want to activate on this canvas (_larvitar_ tools format is required)                                                               | Array          | `stackTools.default`, see [defaults](./defaults.js)                         |
| **toolsHandlers**       | the tools handlers configuration (_larvitar_ tools handlers format is required)                                                                               | Object         | `undefined`                                                                 |

#### Slots

| Name                | Description                                                                                                                     | v-bind                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **stack-metadata**  | Allows your application to access the stack metadata; generally used to show static metadata fields over the canvas             | an object with the stack metadata                           |
| **viewport-data**   | Allows your application to access the viewport data; generally used to show dynamic viewport data over the canvas               | an object with the viewport data                            |
| **viewport-slider** | Allows your application to access the viewport `sliceId` and `maxSliceId` information, needed to build a stack slider component | `{i: [the current slice id], n: [the series max slide id]}` |

#### Events

| Name      | Description                         | Args |
| --------- | ----------------------------------- | ---- |
| **ready** | emitted when the series is rendered | none |

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

This component allows a user to select and parse DICOM files, renders a preview of the parsed series with a subset of their metadata and then performs one of the available actions before returning the control to your application.

#### Props

| Name        | Description                           | Type   | Default                                        |
| ----------- | ------------------------------------- | ------ | ---------------------------------------------- |
| **icon**    | the icon shown in the import modal    | String | `mdi-upload-multiple`                          |
| **label**   | the label shown in the import modal   | String | `import-exams`                                 |
| **options** | the import modal customization object | Object | use all default [options](./import/options.js) |

**!!! NOTE**: you can use the **option** prop to customize the behaviour of this component. The options prop values will override the default options you can find at [options](./import/options.js).

##### Customize the import steps

Each import step is described by an object with the following keys:

- _component_: the Vue component to be rendered for that step
- _label_: the name of the step
- _back_: a function that returns `true` if the navigation to the previous step is allowed
- _next_: a function that returns `true` if the navigation to the next step is allowed (this function receives the parsed series list as parameter)
- _actions_: a list of allowed actions; when a list of actions is available the user should select one action to go to the next step and the _next_ function is ignored
- _closeConfirmation_: a function that returns `true` if the import modal can be closed (this function receives the _status_ value as parameter); if the modal can not be close it is minimized but not destroyed; default is `true`
- _status_: an object that describes the status of the step, updated by your application by reference; it accepts the following keys: _completed_ (Boolean), _loading_ (Boolean), _errors_ (Array) and _progress_ (Object); this is currently supported by step 3 only, but could be extended to the other steps too (each default step component can be replaced by a custom one)

Each _action_ is described by an object with the following keys:

- _cacheStacks_: whether to tell _larvitar_ to cache the parsed images before emitting the action event; it works only if _storeStacks_ is `true`
- _closeOnEmit_: whether to close the import modal after emitting the action event (by default the component renders the next steps)
- _default_: whether the action is selected by default,
- _disabled_: whether the action is disabled or not,
- _emitter_: the name of the event emitted to your application when the action is selected; the event receives as argument the list of the selected parsed series with the subset of the required metadata (or the default ones: see next section)
- _hint_: the action subtitle
- _storeStacks_: whether to tell _larvitar_ to store the series stacks before emitting the action event
- _text_: the action title

**!!!**: you can customize these steps with an array of objects using the described keys. The values of the keys of the object at index 0 will override the values of the keys at step 0 and so on. The same happens for the _actions_ array. Add the _steps_ key to the _options_ prop with your overrides data. Go to the _usage_ section to see some examples.

##### Customize the parsed series metadata you want to extract

By deafult this component extracts from the parsed series stacks a list of metadata that are used to present basic series information to the user. You can find this list at [options](./import/options.js). You can replace this list with a custom one: use the standard dicom metadata tags (_x00000000_) to write your own list. You can also use the [metadata dictionary](./metadata.js), that you can import into your application indipendently. Some metatada are required by this component to work correctly, but don't worry: if you don't include theme into your custom list, will be added automatically.

Remember that you need to exctract a specific metadata to:

- see that information into the list of parsed series (import modal, step 2)
- receive that information with the data emitted by the step actions

**!!!**: to customize the metadata add the _metadata_ key to the _options_ prop with your metadata list. Go to the _usage_ section to see some examples.

##### Customize the parsed series table headers you want to render

The table headers represents the information shown in the parsed series table: each table header is a vuetify table column (see the vuetify doc for more information).

This components manages the following cases:

- by deafult this component uses the list of table headers you can find at [options](./import/options.js)
- if you customize the _metadata_ option key the table headers will be automatically computed based on your custom metadata (each metadata will be a table header)
- if you add the _headers_ key to the _options_ prop with a custom table headers list this component will use your customized list (see the vuetify doc for the headers configuration options)

TODO preview header
TODO slot headers
TODO header keys

##### Customize the parsed series canvas tools

TODO

##### Customize the getProgressFn

TODO

##### Customize the getViewportFn

TODO

#### Slots

| Name | Description | v-bind |
| ---- | ----------- | ------ |


TODO

#### Events

| Name | Description | Args |
| ---- | ----------- | ---- |


TODO

#### Usage

TODO basic usage and customization examples

### ditto-dicom-import-modal

TODO

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

TODO

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

## TODO and TOFIX

- modal minimization is lost if the application mounts this component in a page that can be unmounted (eg after a route change)
