const toggle = document.getElementById("toggle");

// Initialiser l’état du toggle
chrome.storage.sync.get(["enabled"], (result) => {
  toggle.checked = result.enabled !== false; // true par défaut
});

// Sauvegarder le nouvel état au changement
toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});
