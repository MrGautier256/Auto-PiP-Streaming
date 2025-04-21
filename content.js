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
    if (!video) return;

    if (document.hidden) {
      try {
        if (document.pictureInPictureElement !== video) {
          await video.requestPictureInPicture();
        }
      } catch (err) {
        console.warn("Erreur PiP (changement onglet):", err.message);
      }
    } else {
      if (document.pictureInPictureElement === video) {
        try {
          await document.exitPictureInPicture();
        } catch (err) {
          console.warn("Erreur sortie PiP:", err.message);
        }
      }
    }
  });

  // Gestion de la réduction de la fenêtre
  let lastWasMinimized = false;

  window.addEventListener("blur", async () => {
    setTimeout(async () => {
      if (window.outerWidth <= 160 && window.outerHeight <= 160) {
        lastWasMinimized = true;
        if (video && document.pictureInPictureElement !== video) {
          try {
            await video.requestPictureInPicture();
            console.log("🎬 PiP activé après réduction fenêtre");
          } catch (err) {
            console.warn("Erreur PiP (réduction fenêtre):", err.message);
          }
        }
      }
    }, 300);
  });

  window.addEventListener("focus", async () => {
    if (lastWasMinimized) {
      lastWasMinimized = false;
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
