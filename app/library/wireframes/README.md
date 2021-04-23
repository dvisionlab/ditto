# Wireframes

Provides a component collections of application wireframes. Intended to use as root component of Vue apps.

## Basic wireframe

Basic wireframe component.

### Dependencies

- Vuetify

### Props

| Name             | Description                   | Type                                            | Required | Default |
| ---------------- | ----------------------------- | ----------------------------------------------- | -------- | ------- |
| bar              | `bar` slot configuration      | `Object`                                        | `false`  | `{}`    |
| footer           | `footer` slot configuration   | `Object`                                        | `false`  | `{}`    |
| mobileBreakpoint | Mobile breakpoint             | `String` - one of the `$vuetify.breakpoint` key | `false`  | `xs`    |
| navLeft          | `navLeft` slot configuration  | `Object`                                        | `false`  | `{}`    |
| navRight         | `navRight` slot configuration | `Object`                                        | `false`  | `{}`    |

**bar** options:

- color: _color_ of the vuetify _v-app-bar_ component (working when _dark_ is not defined)
- dark: _dark_ status of the vuetify _v-app-bar_ component, default `false`
- dense: _dense_ status of the vuetify _v-app-bar_ component, default `false`
- height: _height_ of the vuetify _v-app-bar_ component
- mobileMenuComponent: Vue component for mobile screens, to render instead of the _bar_ slot
- stateless: _stateless_ status of the vuetify _v-navigation-drawer_ component, used for mobile bars only, default `true`

**footer** options:

- dark: _dark_ status of the vuetify _v-footer_ component, default `false`
- height: _height_ of the vuetify _v-footer_ component

**navLeft**/**navRight** options:

- color: _color_ of the vuetify _v-navigation-drawer_ component (working when _dark_ is not defined)
- dark: _dark_ status of the vuetify _v-navigation-drawer_ component, default `false`
- width: _width_ of the vuetify _v-navigation-drawer_ component
- visible: initial visibility of the _navLeft_/_navRight_ slot

### Slots

| Name     | Description                  | Default Slot Content | Optional |
| -------- | ---------------------------- | -------------------- | -------- |
| default  | Main app container           | -                    | `true`   |
| bar      | Top bar                      | -                    | `true`   |
| navLeft  | Left navigator, collapsable  | -                    | `true`   |
| navRight | Right navigator, collapsable | -                    | `true`   |
| default  | Main content                 | -                    | `true`   |
| footer   | Footer                       | -                    | `true`   |

## Double navigation wireframe

Wireframe component with a fixed left mini-variant navigator.

### Dependencies

- Vuetify

### Props

Like _basic wireframe_, plus:

| Name | Description              | Type     | Required | Default |
| ---- | ------------------------ | -------- | -------- | ------- |
| nav  | `nav` slot configuration | `Object` | `false`  | `{}`    |

**nav** options:

- color: _color_ of the vuetify _v-navigation-drawer_ component
- width: _width_ of the vuetify _v-navigation-drawer_ component

### Slots

Like _basic wireframe_, plus:

| Name | Description                       | Default Slot Content | Optional |
| ---- | --------------------------------- | -------------------- | -------- |
| nav  | Inner left navigator, collapsable | -                    | `true`   |

## Usage

1. Import the desired wireframe

```js
import { BasicWireframe } from "@/../ditto/wireframes";
// or
// import { DoubleNavigationWireframe } from "@/../ditto/wireframes";
```

1. Register the component and the desired wireframe options

```js
export default {
  components: { BasicWireframe },
  data: () => ({
    options: { bar: {...}, navRight: {...}, ... }
  })
};
```

1. use the wireframe component in the html section

```html
<template>
  <basic-wireframe v-bind="options">
    <!-- default slot -->
    <router-view />

    <!-- named slots -->
    <template v-slot:bar="{ className, dark, mobile }">
      <div :class="className" :dark="dark" :mobile="mobile">bar</div>
    </template>

    <template v-slot:navLeft="{ dark }">
      <div :dark="dark">nav left</div>
    </template>

    <template v-slot:navRight="{ dark }">
      <div :dark="dark">nav right</div>
    </template>

    <template v-slot:footer>
      <div>footer</div>
    </template>
  </basic-wireframe>
</template>
```

## Notes

TODO

- guest section
- router/slot definition
