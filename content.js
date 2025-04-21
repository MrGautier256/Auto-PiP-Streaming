console.log("📺 Auto PiP Streaming: content script loaded");

function waitForVideoElement(callback) {
  const check = setInterval(() => {
    const video = document.querySelector("video");
    if (video) {
      clearInterval(check);
      callback(video);
    }
  }, 500);
}

function setupAutoPiP(video) {
  document.addEventListener("visibilitychange", async () => {
    const video = document.querySelector("video");

    if (!video) return;

    if (document.hidden) {
      try {
        if (document.pictureInPictureElement !== video) {
          await video.requestPictureInPicture();
        }
      } catch (err) {
      }
    } else {
      if (document.pictureInPictureElement === video) {
        try {
          await document.exitPictureInPicture();
        } catch (err) {
        }
      }
    }
  });

}

waitForVideoElement((video) => {
  setupAutoPiP(video);
});
