// Convert CSS color variables in RGB
// see https://github.com/vuetifyjs/vuetify/issues/9282

const isObject = value => typeof value === "object" && value !== null;

const hexToRgb = h => {
  let r = 0;
  let g = 0;
  let b = 0;

  if (h.length === 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
  } else if (h.length === 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }
  return `${+r}, ${+g}, ${+b}`;
};

const generateRgbVar = (name, color) => {
  const colorRgb = hexToRgb(color);
  if (!colorRgb.includes("NaN")) {
    document.documentElement.style.setProperty(`--v-${name}-rgb`, colorRgb);
  }
};

export default obj => {
  Object.keys(obj).forEach(key => {
    const colors = obj[key];
    if (isObject(colors)) {
      colors.forEach((color, colorKey) => {
        generateRgbVar(`${key}-${colorKey}`, color);
      });
    } else {
      generateRgbVar(key, colors);
    }
  });
};
