# Form component

A Vue component that allows you to easily generate and manage an html form starting from a list of fields.

## Dependencies

- Vue
- Vuetify

## Usage

Import the form module and register the component into your application:

```js
import form from "@/../ditto/form";

export default {
  components: { DittoForm: form.component },
  data: () => ({
    fields: [...],
    form: {}
  })
};
```

```html
<ditto-form :fields="fields" v-model="form" @submit="submit" />
```

## Props

| Name               | Description                                                                                  | Type    | Default     |
| ------------------ | -------------------------------------------------------------------------------------------- | ------- | ----------- |
| **(\*)fields**     | the list of the fields you want to see in the form                                           | Array   | `undefined` |
| **fieldsStyle**    | the style to apply to each form field                                                        | Object  | `undefined` |
| **footerStyle**    | the style to apply to the form footer                                                        | Object  | `undefined` |
| **lazyValidation** | whether to set the _lazy-validation_ prop of the vuetify _v-form_ component to true          | Boolean | `true`      |
| **loading**        | whether to show the form in a loading status (all fields and submit button disabled)         | Boolean | `false`     |
| **submitLabel**    | the string of the submit button                                                              | String  | `submit`    |
| **value**          | the values of the form fields (reference an empty object if you don't have prefilled fields) | Object  | `{}`        |

### Fields configuration

The _fields_ prop should be a list of objects, each object representing **one field** or **a group of fields**.

A single field can be configured using the following keys:

- _appendIcon_: the icon to show in the _append_ slot of the field (see the vuetify _v-text-field_ doc)
- _autofocus_: whether the field should be autofocused (see the vuetify _v-text-field_ doc)
- _component_: the component used to represent the field (actually by default boolean fields are represented using the _v-checkbox_ component, the others using the _v-text-field_ component - this component will replace the default one)
- _disabled_: a function that returns true if the field should be disabled
- _hint_: the hint of the field (see the vuetify _v-text-field_ doc)
- _key_: the field key to be used to read/save its value in the form _value_ prop
- _label_: the label of the field
- _required_: a function that returns true if the field should be required
- _rules_: the list of **extra** rules for the field (see the vuetify _v-text-field_ doc); these rules will be added to the default rules (the default rule is added automatically when the field is required, other default [rules](./rules.js) are added automatically according to the field type); the default rules can be customized, see next sections of this doc
- _slot_: a custom component to show along with the field component
- _type_: the type of the input field; you can use all html input types (eg number, text, email, password, ...), unknown types will be rendered as _text_ fields (unless a custom component is defined)

Single field configuration example (keys without custom values can be omitted):

```js
const fields = [
  {
    appendIcon: "mdi-email",
    autofocus: true,
    component: null,
    disabled: (field, value) => false,
    hint: "insert a valid email",
    key: "email",
    label: "email",
    required: (field, value) => false,
    rules: [],
    slot: null,
    type: "email"
  },
  ...
];
```

A group of fields can be configured using the key **group** with the name of the group and the key **list** for the list of the single fields configuration. The only difference between single fields and group of fields is the resulting UI.

Group of fields configuration example:

```js
const fields = [
    group: "login",
    list: [
        {
            appendIcon: "mdi-email",
            autofocus: true,
            component: null,
            disabled: (field, value) => false,
            hint: "insert a valid email",
            key: "email",
            label: "email",
            required: (field, value) => false,
            rules: [],
            slot: null,
            type: "email"
        },
        ...
    ]
];
```

Custom _components_ and _slots_ keys should contain a Vue component instance that will be used as the field component instance or as an extra component. Since all fields instances receives the same props, this modules provides the list of the fields properties, so that you only have to import it as follows:

```js
import form from "@/../ditto/form";

const CustomField = {
  props: form.fieldsProps,
  template: `<div class="accent white--text">custom COMPONENT! {{ $props }}</div>`
};

const CustomSlot = {
  props: form.fieldsProps,
  template: `<div class="primary white--text">custom SLOT! {{ $props }}</div>`
};

const fields = [
  {
    component: CustomField,
    label: "email",
    key: "email"
  },
  {
    slot: CustomSlot,
    label: "password",
    key: "password"
  },
  ...
];
```

## Slots

| Name       | Description                          | v-bind                                   |
| ---------- | ------------------------------------ | ---------------------------------------- |
| **header** | custom form header (see vuetify doc) | `{ value }` (the value prop of the form) |
| **footer** | custom form footer (see vuetify doc) | `{ value }` (the value prop of the form) |

## Events

| Name           | Description                               | Args                                                                                |
| -------------- | ----------------------------------------- | ----------------------------------------------------------------------------------- |
| **icon-click** | emitted when a field icon is clicked      | the clicked field object                                                            |
| **submit**     | emitted when the submit button is clicked | none (the form value is passed by reference: you already have it and is up to date) |

## Rules customization

The default form rules can be customized using the _customizeRules_ function provided by the form module. This function needs a configuration object where you can specify the following keys:

- _emailValidationRegex_, default is `/.+@.+\..+/`
- _passwordMinLength_, default is `8`
- _passwordValidationRegex_, default is `new RegExp(`^(?=._[a-z])(?=._[A-Z])(?=.\*[0-9])(?=.{\${passwordMinLength},})`)`

Rules customization example:

```js
import form from "@/../ditto/form";
form.customizeRules({ passwordMinLength: 4 });
```

## Example code

See the [form examples code](https://github.com/dvisionlab/ditto/tree/master/app/src/examples/form) for more information.

## TODO

- Automatically support standard field types with custom components (eg dates, ...) using the ditto [data-types](../data-types/README.md) module
