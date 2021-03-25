export const openFullscreen = () => {
  /* Get the documentElement (<html>) to display the page in fullscreen */
  var elem = document.documentElement;

  /* View in fullscreen */
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
};

export const closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
};

// The fullscreenEnabled property tells you whether or not it is possible to engage full-screen mode.
// This is false if full-screen mode is not available for any reason (such as the "fullscreen" feature
// not being allowed, or full-screen mode not being supported).
export const isFullscreenEnabled = document.fullscreenEnabled;

// The fullscreenElement property tells you the Element that's currently being displayed in full-screen mode
// on the DOM (or shadow DOM). If this is null, the document (or shadow DOM) is not in full-screen mode.
export const isFullscreenMode = () => document.fullscreenElement !== null;
