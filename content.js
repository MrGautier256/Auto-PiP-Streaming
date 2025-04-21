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
  function shouldRun(callback) {
    chrome.storage.sync.get(["enabled"], (result) => {
      if (result.enabled !== false) {
        callback();
      }
    });
  }

  document.addEventListener("visibilitychange", () => {
    shouldRun(async () => {
      if (!video) return;
      if (document.hidden) {
        try {
          if (document.pictureInPictureElement !== video) {
            await video.requestPictureInPicture();
          }
        } catch (err) { }
      } else {
        if (document.pictureInPictureElement === video) {
          try {
            await document.exitPictureInPicture();
          } catch (err) { }
        }
      }
    });
  });

  let lastWasMinimized = false;

  window.addEventListener("blur", () => {
    setTimeout(() => {
      shouldRun(async () => {
        if (window.outerWidth <= 160 && window.outerHeight <= 160) {
          lastWasMinimized = true;
          if (document.pictureInPictureElement !== video) {
            try {
              await video.requestPictureInPicture();
            } catch (err) { }
          }
        }
      });
    }, 300);
  });

  window.addEventListener("focus", () => {
    shouldRun(async () => {
      if (lastWasMinimized) {
        lastWasMinimized = false;
        if (document.pictureInPictureElement === video) {
          try {
            await document.exitPictureInPicture();
          } catch (err) { }
        }
      }
    });
  });
}

waitForVideoElement((video) => {
  setupAutoPiP(video);
});
