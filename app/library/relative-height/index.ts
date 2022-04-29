// Directive to update an element height according to el.offsetHeight
// binding.value = name of the context variable to update with the relative height
// binding.arg = height calc offset

const updateRelativeHeight = (el, node, variable, offset = "0px") => {
  node.context[variable] = `calc(100% - ${el.offsetHeight}px - ${offset})`;
};

export default {
  inserted(el, binding, vnode) {
    updateRelativeHeight(el, vnode, binding.value, binding.arg);
  },
  update(el, binding, vnode) {
    setTimeout(() => {
      updateRelativeHeight(el, vnode, binding.value, binding.arg);
    }, 0);
  }
};
