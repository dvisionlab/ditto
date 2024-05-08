// DICOM parsing and loading utilities
// Larvitar interface
// -----------------------------------

// Dependencies
import * as lt from "larvitar/dist/larvitar";
import { saveAs } from "file-saver";
import print from "print-js";

// Private methods
// ---------------

const ANONYMIZED_TAGS = [
  "x00080014", // Instance Creator UID
  "x00080050", // Accession Number
  "x00080080", // Institution Name
  "x00080081", // Institution Address
  "x00080090", // Referring Physician's Name
  "x00080092", // Referring Physician's Address
  "x00080094", // Referring Physician's Telephone numbers
  "x00081010", // Station Name
  "x00081030", // Study Description
  "x0008103e", // Series Description
  "x00081040", // Institutional Department name
  "x00081048", // Physician(s) of Record
  "x00081050", // Performing Physicians' Name
  "x00081060", // Name of Physician(s) Reading study
  "x00081070", // Operator's Name
  "x00081080", // Admitting Diagnoses Description
  "x00082111", // Derivation Description
  "x00100010", // Patient's Name
  "x00100020", // Patient ID
  "x00100030", // Patient's Birth Date
  "x00100032", // Patient's Birth Time
  "x00100040", // Patient's Sex
  "x00101000", // Other Patient Ids
  "x00101001", // Other Patient Names
  "x00101010", // Patient's Age
  "x00101020", // Patient's Size
  "x00101030", // Patient's Weight
  "x00101090", // Medical Record Locator
  "x00102160", // Ethnic Group
  "x00102180", // Occupation
  "x001021b0", // Additional Patient's History
  "x00104000", // Patient Comments
  "x00181000", // Device Serial Number
  "x00181030", // Protocol Name
  "x00200010", // Study ID
  "x00200052", // Frame of Reference UID
  "x00200200", // Synchronization Frame of Reference UID
  "x00204000", // Image Comments
  "x00400275", // Request Attributes Sequence
  "x0040a124", // UID
  "x00880140", // Storage Media File-set UID
  "x30060024", // Referenced Frame of Reference UID
  "x300600c2" // Related Frame of Reference UID
];

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

// Add mouse button tools
export const addTools = (tools, elementId) => {
  tools.forEach(t => {
    lt.addTool(t.name, t.configuration, elementId);
    if (t.defaultActive) {
      activateTool(t, [elementId], t.options);
    }
  });
};

// Add tools keyboard handlers
export const addMouseKeyHandlers = lt.addMouseKeyHandlers;

// Anonymize series
export const anonymizeSeriesStack = (stack, extractMetadata = []) => {
  let anonymizedStack = lt.anonymize(stack);

  const meta =
    anonymizedStack.instances[Object.keys(anonymizedStack.instances)[0]]
      .metadata;
  const anonymizedStackMeta = extractMetadata.reduce((result, k) => {
    if (ANONYMIZED_TAGS.find(t => t === k)) {
      result[k] = meta[k];
    }
    return result;
  }, {});

  return { ...anonymizedStack, ...anonymizedStackMeta };
};

// Remove tools keyboard handlers
export const removeMouseKeyHandlers = lt.removeMouseKeyHandlers;

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
  //Without the following seems that the series are kept in cache.
  //lt.removeSeriesFromLarvitarManager(seriesId);

  if (clearCache) {
    lt.clearImageCache(seriesId);
  }

  lt.store.removeSeriesId(seriesId);
};

// Extract series and viewport objects from larvitar store
export const getSeries = seriesId => lt.store.get(["series", seriesId]);
export const getViewport = elementId => lt.store.get(["viewports", elementId]);

// Remove a viewport from the larvitar store
export const deleteViewport = elementId => lt.store.deleteViewport(elementId);

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

// Returns an array of metadata objects:
// tag: the metadata tag e.g. (0010,0010)
// name: the metadata name in a human readable format e.g. PatientName
// value: the metadata value e.g. Mario^Rossi
export const getImageMetadata = lt.getImageMetadata;

export const getFrameMetadata = (seriesID, elementId, instance) => {
  const viewport = getViewport(elementId);
  const sliceId = viewport.sliceId;

  const stack = getSeriesStack(seriesID);
  if (stack && stack.instanceUIDs) {
    const frameId = stack.instanceUIDs[instance] + "?frame=" + sliceId;
    if (stack.instances[frameId]) {
      return stack.instances[frameId].metadata;
    }
  }
  console.debug("not valid stack found for seriesId");
  return null;
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
  lt.store.setMaxSliceId(elementId, numberOfImages);
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
  return lt.readFiles(files).then(series => {
    return Object.values(series || {}).map(s => {
      if (s.isMultiframe) {
        lt.buildMultiFrameImage(s.larvitarSeriesInstanceUID, s);
        const meta = s.instances[Object.keys(s.instances)[0]].metadata;
        const stack = {
          ...[].concat(extractMetadata).reduce((result, value) => {
            result[value] = meta[value];
            return result;
          }, {}),
          ...s
        };
        stack.larvitarNumberOfSlices = stack.numberOfFrames;
        return stack;
      }
      const meta = s.instances[Object.keys(s.instances)[0]].metadata;
      const stack = {
        ...[].concat(extractMetadata).reduce((result, value) => {
          result[value] = meta[value];
          return result;
        }, {}),
        ...s
      };

      if (stack.is4D) {
        stack.larvitarNumberOfSlices =
          stack.imageIds.length / stack.numberOfTemporalPositions;
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
export const parseFile = (seriesId, file, elementId) => {
  // Get DICOM image object
  return new Promise((resolve, reject) => {
    lt.readFile(file)
      .then(image => {
        let manager = lt.updateLarvitarManager(image, seriesId)[seriesId];
        const series = getSeriesStack(seriesId);
        if (series.is4D && elementId) {
          updateTimeInLarvitarViewport(series, elementId);
        }
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
export const renderSeries = async (elementId, seriesStack, params = {}) => {
  lt.store.addViewport(elementId);
  // render returns a promise which will resolve when image is displayed

  //await lt.cacheImages(seriesStack);
  return seriesStack.isPDF
    ? await lt.renderDICOMPDF(seriesStack, elementId)
    : await lt.renderImage(seriesStack, elementId, params);

  //Without using loadAndCacheImageStack the series still seems cached.
};

// Reset Larvitar
export const reset = () => {
  lt.clearImageCache();
  lt.resetLarvitarManager();
  console.log(lt.store);
  // lt.store.resetSeriesIds();
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

  lt.store.initialize();
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
export const updateSeriesSlice = (
  elementId,
  seriesId,
  sliceId,
  imageCache = true
) => {
  // sliceId must be between 0 and n-1
  const stack = getSeriesStack(seriesId);
  lt.store.setSliceId(elementId, sliceId);
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
      const htmlTag = `#${element} canvas`;
      let canvas = document.querySelector(htmlTag);
      canvas.toBlob(function(blob) {
        saveAs(blob, "image.png");
      });
      break;
    }

    case "print-viewport": {
      const htmlTag = `#${element} canvas`;
      let canvas = document.querySelector(htmlTag);
      canvas.toBlob(function(blob) {
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

// Expose store listeners
export const watchStore = lt.store.addStoreListener;
export const unwatchStore = lt.store.removeStoreListener;

export const watchViewportStore = lt.store.addViewportListener;
export const unwatchViewportStore = lt.store.removeViewportListener;

export const watchSeriesStore = lt.store.addSeriesListener;
export const unwatchSeriesStore = lt.store.removeSeriesListener;

export const get4DSliceIndex = (frameNumber, sliceNumber, totFrames) => {
  return sliceNumber * totFrames + frameNumber;
};
export const setTimeFrame = (elementId, frameNumber) => {
  lt.store.set("timeId", [elementId, frameNumber]);
};
export const setToolConfiguration = (tool, parameter, value) => {
  if (parameter && value) {
    lt.DEFAULT_TOOLS[tool][parameter] = value;
  }
};
export const setWheelScrollModality = is4DFrame => {
  let mode = "slice";
  if (is4DFrame) {
    mode = "stack";
  }
  if (
    lt.DEFAULT_TOOLS["CustomMouseWheelScroll"] &&
    lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].configuration &&
    lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].configuration.currentMode
  ) {
    if (mode === "stack") {
      lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].configuration.currentMode =
        "stack";
      lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].currentMode = "stack";
    }
    if (mode === "slice") {
      lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].configuration.currentMode =
        "slice";
      lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].currentMode = "slice";
    }
  }
};
export const switchWheelScrollModality = () => {
  console.log("switching");
  if (
    lt.DEFAULT_TOOLS["CustomMouseWheelScroll"] &&
    lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].configuration &&
    lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].configuration.currentMode
  ) {
    const mode =
      lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].configuration.currentMode;
    if (mode === "slice") {
      lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].configuration.currentMode =
        "stack";
      lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].currentMode = "stack";
    } else {
      lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].configuration.currentMode =
        "slice";
      lt.DEFAULT_TOOLS["CustomMouseWheelScroll"].currentMode = "slice";
    }
  }
};
export const updateTimeInLarvitarViewport = (seriesStack, elementId) => {
  lt.updateTemporalViewportData(seriesStack, elementId);
};
