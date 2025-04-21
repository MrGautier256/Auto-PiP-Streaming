let wasVisible = true;
let pipActive = false;

// Fonction pour détecter le bouton Picture-in-Picture selon les plateformes
function getPiPButton() {
  const titles = document.querySelectorAll('title, [title]');
  for (const el of titles) {
    if (el.innerText?.includes('Picture In Picture') || el.getAttribute?.('title') === 'Picture In Picture') {
      return el.closest('button') || el.closest('div');
    }
  }
  const svgMatches = document.querySelectorAll('svg, g');
  for (const svg of svgMatches) {
    const title = svg.querySelector('title');
    if (title && title.textContent === 'Picture In Picture') {
      return svg.closest('button') || svg.closest('div');
    }
  }
  return null;
}

function isPlaying() {
  const video = document.querySelector('video');
  return video && !video.paused && !video.ended;
}

function triggerPiP(toggle = true) {
  const button = getPiPButton();
  if (button) {
    button.click();
    pipActive = toggle;
  }
}

// Gère le changement de visibilité de l’onglet
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isPlaying()) {
    triggerPiP(true);
  } else if (!document.hidden && pipActive) {
    triggerPiP(false);
  }
});
