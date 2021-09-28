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
    let allIds = Object.values(instances).map(v => v.metadata.instanceUID);
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
  return new Promise(resolve => {
    lt.readFiles(files, (series, error) => {
      const list = Object.values(series || {}).map(s => {
        const meta = s.instances[Object.keys(s.instances)[0]].metadata;
        const stack = {
          ...[].concat(extractMetadata).reduce((result, value) => {
            result[value] = meta[value];
            return result;
          }, {}),
          ...s
        };

        stack.larvitarNumberOfSlices = stack.isMultiframe
          ? stack.numberOfFrames
          : stack.numberOfImages;

        return stack;
      });
      return resolve({ series: list, error });
    });
  });
};

// Use Larvitar to parse a single file and get its dicom image object
export const parseFile = (seriesId, file) => {
  // Get DICOM image object
  return new Promise(resolve => {
    lt.readFile(file, (image, error) => {
      let manager = lt.updateLarvitarManager(image, seriesId)[seriesId];
      let imageIds = manager.imageIds;
      let imageUID = image.metadata.instanceUID;
      let imageId = manager.instanceUIDs[imageUID];
      return resolve({ imageIds, imageId, error });
    });
  });
};

// Use Larvitar to render a series into a canvas
export const renderSeries = (elementId, seriesStack, params = {}) => {
  lt.larvitar_store.addViewport(elementId);
  return new Promise(resolve => {
    lt.renderImage(seriesStack, elementId, params).then(function() {
      return resolve();
    });
  });
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
    lt.initLarvitarStore(store, "larvitar");
  } else {
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
  const stack = getSeriesStack(seriesId);
  lt.larvitar_store.set("sliceId", [elementId, sliceId]);
  lt.updateImage(stack, elementId, sliceId, imageCache);
  lt.updateStackToolState(elementId, sliceId - 1);
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
      let canvas = document.getElementById(element).children[1];
      canvas.toBlob(function (blob) {
        saveAs(blob, "image.png");
      });
      break;
    }

    case "print-viewport": {
      let canvas = document.getElementById(element).children[1];
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
