// DICOM parsing and loading utilities
// Larvitar interface
// -----------------------------------

// Dependencies
import * as lt from "larvitar";

// Public methods

export const addTools = (elementId, tools) => {
  tools.forEach(t => {
    lt.addTool(t.name, t.configuration, elementId);
    lt.setToolActive(t.name, t.options);
  });

  lt.setToolActive(lt.larvitar_store.state.leftMouseHandler);
};

// Remove viewport data from larvitar stores
export const clearSeriesData = (seriesId, clearCache = false) => {
  lt.larvitar_store.removeSeriesIds(seriesId);
  lt.removeSeriesFromDicomManager(seriesId);

  // TODO LT evaluate when clearing cache
  if (clearCache) {
    lt.clearImageCache(seriesId);
  }
};

// Remove a viewport from the larvitar store
export const deleteViewport = elementId =>
  lt.larvitar_store.deleteViewport(elementId);

// Call the Larvitar "disableViewport" function:
// unrender an image on a html div using cornerstone
// export const disableCanvas = lt.disableViewport;
export const disableCanvas = element => {
  // lt.enableMouseHandlers(elementId, true); // flagged true to disable handlers
  lt.cornerstone.disable(element);
};

// Return series stack stored in larvitar dicom manager
export const getSeriesStack = seriesId => lt.dicomManager[seriesId];

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

  let merged = { ...series[0], instances };
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
  lt.initializeCSTools();
};

// Call the Larvitar "populateDicomManager" function
export const storeSeriesStack = (seriesId, stack) => {
  return new Promise(resolve =>
    lt.populateDicomManager(seriesId, stack, () => resolve())
  );
};
