# Relative height directive

A Vue directive that updates an element height (the "realtive" height) according to another element height.

Binding options:

- **value**: the name of the Vue variable to update with the relative height
- **arg**: height offset used in the relative height computation

The relative height is computed as follow: `calc(100% - ${el.offsetHeight}px - ${offset})`.

Usage example with an offset of 5px:

```js
import RelativeHeight from "@/../ditto/relativeHeight";

export default {
  directives: { RelativeHeight },
  data: () => ({
    contentHeight: null
  })
};
```

```html
<div v-relative-height:5px="'contentHeight'">fixed height element</div>
<div :style="{ height: contentHeight }">relative height element</div>
```
