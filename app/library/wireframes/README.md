# Wireframes

Provides a component collections of application wireframes. Intended to use as root component of Vue apps.

Available wireframes:

- basic
- double navigation

## Dependencies

- Vuetify

## Basic wireframe

Basic wireframe component.

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

2. Register the component and the desired wireframe options

```js
export default {
  components: { BasicWireframe },
  data: () => ({
    options: { bar: {...}, navRight: {...}, ... }
  })
};
```

3. Use the wireframe component in the html section (usually the wifreframe is the application root component)

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

### Guest section

All routes with `$route.meta.guest == true` (see _ditto_ **auth** module) are mounted outside the layout structure. If needed, a specific wireframe configuration must be specified in the _AuthWrapper_ component.

## Slots definition

To customize the wireframe slots you can:

- **import your custom components locally** and use them inside the wireframes slots definition:

```js
const MyBarComponent = () => import("@/components/MyBarComponent");

export default {
  components: { BasicWireframe, MyBarComponent },
  data: () => ({ ... })
};
```

```html
<template>
  <basic-wireframe v-bind="options">
    ...

    <!-- named slots -->
    <template v-slot:bar="{ className, ...data }">
      <my-bar-component :class="className" v-bind="data" />
    </template>

    ...
  </basic-wireframe>
</template>
```

Use this option for slots whose content are fixed through all your application routes.

- **use named routes**, defining your custom components in the router configuration:

```js
{
  name: "basic-wireframe-home",
  path: "home",
  components: {
    ...
    bar: () => import("@/components/MyBarComponent")
  }
},
```

```html
<template>
  <basic-wireframe v-bind="options">
    ...

    <!-- named slots -->
    <template v-slot:bar="{ className, ...data }">
      <router-view name="bar" :class="className" v-bind="data" />
    </template>

    ...
  </basic-wireframe>
</template>
```

Use this option for slots whose content change through your application routes.

See the [wireframes examples code](https://github.com/dvisionlab/ditto/tree/master/app/src/examples/wireframes) for more information.
