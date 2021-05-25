# Data types

A Vue components collection to easily render different data types.

For each data type there are 2 different representation of the data:

- **string**: the textual rapresentation of the data; eg: a date data type will be formatted
- **input**: the input element needed to insert/edit the data (not implemented yet); eg: the calendar for dates data types

## Dependencies

- Ditto [dicom plugin](../dicom/README.md) (for the _dicom data types_ module only)
- Vue
- Vuetify

## Usage

1. Import the data type module and register the provided components (or only the ones you need):

```js
import dataTypes from "@/../ditto/dataTypes";

export default {
  name: "...",
  components: {
    ...dataTypes
  }
};
```

2. Use the data type components in your application:

```html
<date-string :value="..." />
```

### Available components

| Component name | Description               | Expected _value_ prop                                                  |
| -------------- | ------------------------- | ---------------------------------------------------------------------- |
| date-string    | local date representation | any valid js date string, will be converted into the local date string |
| time-string    | local time representation | any valid js time string, will be converted into the local time string |

## DICOM data types

Specific data types are available to manage DICOM metadata values. These data types components works exaclty like the basic ones, but are provided by a different module:

```js
import dicomDataTypes from "@/../ditto/dicomDataTypes";

export default {
  name: "...",
  components: {
    ...dicomDataTypes
  }
};
```

```html
<thumbnail-string :value="..." />
```

These data types components are used by the _ditto dicom plugin_. If you already use this plugin you don't need to import the dicom data types explicitly, you can configure the plugin to do that for you (see the [dicom plugin docs](../dicom/README.md))

### Available components

| Component name   | Description                       | Expected _value_ prop                                                                                                        |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| x00080020-string | study date metadata string        | see _date-string_ component                                                                                                  |
| x00080021-string | series date metadata string       | see _date-string_ component                                                                                                  |
| x00080030-string | study time metadata string        | see _time-string_ component                                                                                                  |
| x00080031-string | series time metadata string       | see _time-string_ component                                                                                                  |
| x00080050-string | accession number metadata string  | any string, the string "AN" will be prepended                                                                                |
| x00080060-string | modality metadata string          | any string, will be rendered uppercased                                                                                      |
| x00100010-string | patient name metadata string      | any string, will be splitted according to the dicom standard _PN_ type and capitalized                                       |
| x00100020-string | patient id metadata string        | any string, the string "ID" will be prepended                                                                                |
| x00100030-string | patient birthdate metadata string | see _date-string_ component                                                                                                  |
| x00100040-string | patient sex metadata string       | the char "F", "M" or "O" (this is the dicom stardard gender format), that will be converted into "Female", "Male" or "Other" |
| x00180050-string | slice thickness metadata string   | any number, will be rounded to 2 decimals and the string "mm" will be appended                                               |
| thumbnail-string | thumbnail url                     | an image url; this components also accepts a _width_ prop                                                                    |

**!!!** Metadata tags are used instead of the simpler description of the tag to automatically render all the series metadata returned by _larvitar_ in the series stack; **usually the component name is computed, not manually written in the code** (that's also the reason there are components with different name but the same content). See the following example:

```js
import dicomDataTypes from "@/../ditto/dicomDataTypes";
import metadataDictionary from "@/../ditto/dicomMetadata";

export default {
  name: "...",
  components: {
    ...dicomDataTypes
  },
  data: () => ({
    metadata: ["PatientID", "PatientName", "PatientSex", "PatientBirthdate"],
    metadataDictionary
  }),
  methods: {
    getComponentName(field) {
      const name = `${field}-string`;
      return this.$options.components[name] ? name : null;
    }
  }
};
```

```html
<template v-for="key in metadata">
  <!-- use data type component if exists -->
  <component
    v-if="getComponentName(metadataDictionary[key])"
    :key="key"
    :is="getComponentName(metadataDictionary[key])"
    :value="data[metadataDictionary[key]]"
  />
  <!-- else render the raw value -->
  <div v-else :key="key">{{ data[metadataDictionary[key]] }}</div>
</template>
```

**!!!** Remember that if you use these components through the dicom plugin each component is registered into your application **globally** and each component name has the _ditto-data-type-_ prefix.

## Data types props

Each data type _string_ component accepts the following props:

- **value** the data type value to parse and/or manipulate before rendering
- **tag** the component name where to wrap the resulting data type value (default is _div_)

## Example code

See the [data types examples code](https://github.com/dvisionlab/ditto/tree/master/app/src/examples/data-types) for more information.

# TODO

- Extend the available data types
- Provide the _input_ component for each available data type
