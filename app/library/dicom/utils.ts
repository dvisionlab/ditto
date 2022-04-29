// DICOM parsing and loading utilities
// Larvitar interface
// -----------------------------------

// Dependencies
import * as lt from "larvitar";
import { saveAs } from "file-saver";
import print from "print-js";

// Public methods
// --------------

// Tools functionalities
export const activateTool = (
  tool,
  elementIds,
  options = { mouseButtonMask: 1 }
) => {
  const mouseOptions = { ...tool.options, ...options };
  lt.setToolActive(tool.name, mouseOptions, elementIds);
};

export const addTools = (tools, elementId, handlers) => {
  // Add mouse button tools
  tools.forEach(t => {
    lt.addTool(t.name, t.configuration, elementId);
    if (t.defaultActive) {
      activateTool(t, [elementId], t.options);
    }
  });

  // Add tools keyboard handlers
  if (handlers) {
    lt.addMouseKeyHandlers(handlers, [elementId]);
  }
};

export const disableTool = (tool, elements) => {
  lt.setToolEnabled(tool.name, elements); // tool not editable but visible
};

export const editTool = (tool, elements) => {
  lt.setToolPassive(tool.name, elements); // only existing tools editable
};

export const hideTool = (tool, elements) => {
  lt.setToolDisabled(tool.name, elements); // tool hidden
};

export const showTool = (tool, elements) => {
  lt.setToolEnabled(tool.name, elements); // tool not editable but visible
};

// Build data and header functions
export const buildData = stack => {
  return new Promise((resolve, reject) => {
    // wait for 30 seconds for garbage collector
    lt.buildDataAsync(stack, 30, resolve, reject);
  });
};

export const buildHeader = lt.buildHeader;

export const clearSeriesCache = lt.clearImageCache;

// Delete and clean the seriesStack object
export const clearSeriesStack = seriesStack =>
  lt.clearImageParsing(seriesStack);

// Remove viewport data from larvitar stores
export const clearSeriesData = (seriesId, clearCache = false) => {
  lt.removeSeriesFromLarvitarManager(seriesId);

  if (clearCache) {
    lt.clearImageCache(seriesId);
  }

  lt.larvitar_store.removeSeriesIds(seriesId);
};

export const getViewport = elementId => {
  return lt.larvitar_store.get("viewports")[elementId];
};

// Remove a viewport from the larvitar store
export const deleteViewport = elementId =>
  lt.larvitar_store.deleteViewport(elementId);

// Call the Larvitar "disableViewport" function:
// unrender an image on a html div using cornerstone
export const disableCanvas = lt.disableViewport;

// Return the cinematic data of a series
export const getCinematicData = seriesId => {
  const stack = getSeriesStack(seriesId);
  if (!stack) {
    return null;
  }
  const { frameDelay, frameTime } = stack;
  return { frameDelay, frameTime };
};

// Return series stack stored in larvitar dicom manager
export const getSeriesStack = seriesId => {
  const stack = lt.getSeriesDataFromLarvitarManager(seriesId);
  return stack && Object.keys(stack).length !== 0 ? stack : null;
};

// update larvitar stack tool state with imageIds
export const csToolsUpdateImageIds = (elementId, imageIds, imageId) => {
  let imageIdIndex = imageIds.indexOf(imageId);
  lt.csToolsUpdateImageIds(elementId, imageIds, imageIdIndex);
};

// update larvitar imageIndex and numberOfSlices in store
export const setImageIndexes = (elementId, numberOfImages) => {
  lt.larvitar_store.set("maxSliceId", [elementId, numberOfImages]);
};

// Merge parsed files with previous parsed files if the instance uids matches
export const mergeSeries = (...series) => {
  if (!series.length) {
    return series;
  }

  let instances = {};
  series.forEach(s => {
    let allIds = Object.values(instances).map(
      (v: any) => v.metadata.instanceUID
    );
    Object.keys(s.instances).forEach(key => {
      if (!allIds.find(v => v == s.instances[key].metadata.instanceUID)) {
        instances[key] = s.instances[key];
      }
    });
  });

  let merged = series.reduce((result, s) => ({ ...result, ...s }), {});
  merged = { ...merged, instances };
  merged.imageIds = Object.keys(merged.instances);

  return merged;
};

// Use Larvitar to parse files and get series stacks
export const parseFiles = (files, extractMetadata = []) => {
  // Get DICOM series
  return lt.readFiles(files).then(series => {
    return Object.values(series || {}).map((s: any) => {
      const meta: any = s.instances[Object.keys(s.instances)[0]].metadata;
      const stack: any = {
        ...[].concat(extractMetadata).reduce((result: any, value) => {
          result[value] = meta[value];
          return result;
        }, {}),
        ...(s as object)
      };

      if (stack.isMultiframe) {
        stack.larvitarNumberOfSlices = stack.numberOfFrames;
      } else {
        stack.larvitarNumberOfSlices = stack.numberOfSlices
          ? stack.numberOfSlices
          : stack.numberOfImages;
      }

      // resolve the promise with this value
      return stack;
    });
  });
};

// Use Larvitar to parse a single file and get its dicom image object
export const parseFile = (seriesId, file) => {
  // Get DICOM image object
  return new Promise((resolve, reject) => {
    lt.readFile(file)
      .then(image => {
        let manager = lt.updateLarvitarManager(image, seriesId)[seriesId];
        let imageIds = manager.imageIds;
        let imageUID = image.metadata.instanceUID;
        let imageId = manager.instanceUIDs[imageUID];
        return resolve({ imageIds, imageId });
      })
      .catch(error => {
        return reject(error);
      });
  });
};

// Use Larvitar to render a series into a canvas
export const renderSeries = (elementId, seriesStack, params = {}) => {
  lt.larvitar_store.addViewport(elementId);
  // renderImage returns a promise which will resolve when image is displayed
  return lt.renderImage(seriesStack, elementId, params);
};

// Reset Larvitar
export const reset = () => {
  lt.clearImageCache();
  lt.resetLarvitarManager();
  lt.larvitar_store.resetSeriesIds();
};

// Call the Larvitar "resizeViewport" function
export const resizeViewport = elementId => lt.resizeViewport(elementId);

// Replace dots with underscores to get a valid element id
export const seriesIdToElementId = seriesId =>
  seriesId.toString().replaceAll(".", "_");

// Setup Larvitar
export const setup = (store, toolsStyle) => {
  lt.clearImageCache();
  lt.resetLarvitarManager();

  if (store) {
    // use larvitar vuex store and register it in the app store
    lt.initLarvitarStore(store, "larvitar", true);
  } else {
    // use without vuex
    lt.initLarvitarStore();
  }

  lt.initializeImageLoader();
  lt.registerMultiFrameImageLoader();

  lt.setToolsStyle(toolsStyle);
  lt.initializeCSTools();
};

// Call the Larvitar "populateLarvitarManager" function
export const storeSeriesStack = (seriesId, stack, cache = false) => {
  lt.populateLarvitarManager(seriesId, stack);
  if (cache) {
    lt.cacheImages(seriesId, stack);
  }
};

// Use Larvitar to update a series slice
export const updateSeriesSlice = (elementId, seriesId, sliceId, imageCache) => {
  // sliceId must be between 0 and n-1
  const stack = getSeriesStack(seriesId);
  lt.larvitar_store.set("sliceId", [elementId, sliceId]);
  lt.updateImage(stack, elementId, sliceId, imageCache);
  lt.updateStackToolState(elementId, sliceId);
};

// Update viewport actions
export const updateViewportProperty = (action, element) => {
  switch (action) {
    case "flip-horizontal": {
      lt.flipImageHorizontal(element);
      break;
    }

    case "flip-vertical": {
      lt.flipImageVertical(element);
      break;
    }

    case "invert": {
      lt.invertImage(element);
      break;
    }

    case "reset-viewport": {
      lt.resetViewports([element]);
      break;
    }
    case "export-viewport": {
      let canvas = <HTMLCanvasElement>(
        document.getElementById(element)!.children[1]
      );
      canvas.toBlob((blob: any) => {
        saveAs(blob, "image.png");
      });
      break;
    }

    case "print-viewport": {
      let canvas = <HTMLCanvasElement>(
        document.getElementById(element)!.children[1]
      );
      canvas.toBlob(function (blob) {
        print({
          printable: URL.createObjectURL(blob),
          type: "image",
          documentTitle: "DICOM Image"
        });
      });
      break;
    }

    default: {
      console.warn("Unknown viewport action", action);
    }
  }
};

// Image presets
export const getImagePresets = () => lt.getImagePresets();

export const setImagePreset = (viewports, preset) =>
  lt.setImagePreset(viewports, preset);

export const setImageCustomPreset = (viewports, { wl, ww }) => {
  lt.setImageCustomPreset(viewports, { wl, ww });
};
