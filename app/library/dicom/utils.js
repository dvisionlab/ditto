// DICOM parsing and loading utilities
// Larvitar interface
// -----------------------------------

// Dependencies
import * as lt from "larvitar";

// Public methods
// --------------

// Tools functionalities
export const activateTool = (tool, options = { mouseButtonMask: 1 }) => {
  lt.setToolActive(tool.name, { ...tool.options, ...options });
};

export const addTools = (elementId, tools) => {
  tools.forEach(t => {
    lt.addTool(t.name, t.configuration, elementId);

    if (t.defaultActive) {
      // TODO TOOL @mattia move in larvitar? use default options and default interactions
      // lt.setToolActive(t.name, t.options);
      lt.cornerstoneTools.setToolActiveForElement(
        document.getElementById(elementId),
        t.name,
        t.options || { mouseButtonMask: 1 }
      );
    }
  });
};

export const disableTool = tool => {
  lt.setToolEnabled(tool.name); // tool not editable but visible
};

export const hideTool = tool => {
  lt.setToolDisabled(tool.name); // tool hidden
};

// Build data and header functions
export const buildData = stack => {
  return new Promise((resolve, reject) => {
    try {
      lt.buildDataAsync(stack, data => resolve(data));
    } catch (error) {
      reject(error);
    }
  });
};

export const buildHeader = lt.buildHeader;

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

// Return series stack stored in larvitar dicom manager
export const getSeriesStack = seriesId => {
  const stack = lt.getSeriesDataFromLarvitarManager(seriesId);
  return stack && Object.keys(stack).length !== 0 ? stack : null;
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
    lt.resetImageParsing();
    lt.readFiles(files, (series, errors = []) => {
      const list = Object.values(series).map(s => {
        const meta = s.instances[Object.keys(s.instances)[0]].metadata;
        return {
          ...[].concat(extractMetadata).reduce((result, value) => {
            result[value] = meta[value];
            return result;
          }, {}),
          ...s
        };
      });
      return resolve({ series: list, errors });
    });
  });
};

// Use Larvitar to render a series into a canvas
export const renderSeries = (elementId, seriesStack) => {
  lt.larvitar_store.addViewport(elementId);
  lt.renderImage(seriesStack, elementId);
};

// Call the Larvitar "resizeViewport" function
export const resizeViewport = elementId => lt.resizeViewport(elementId);

// Replace dots with underscores to get a valid element id
export const seriesIdToElementId = seriesId =>
  seriesId.toString().replaceAll(".", "_");

// Setup Larvitar
export const setup = store => {
  lt.clearImageCache();

  if (store) {
    lt.initLarvitarStore(store, "larvitar");
  } else {
    lt.initLarvitarStore();
  }

  lt.initializeImageLoader();
  lt.registerMultiFrameImageLoader();
  lt.initializeCSTools();
};

// Call the Larvitar "populateLarvitarManager" function
export const storeSeriesStack = (seriesId, stack, cache = false) => {
  lt.populateLarvitarManager(seriesId, stack);
  if (cache) {
    lt.cacheImages(seriesId, stack);
  }
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
  }
};
