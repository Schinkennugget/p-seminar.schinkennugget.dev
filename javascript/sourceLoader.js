"use strict";

export function injectSourceNotes() {
  try {
    document.querySelectorAll("[data-sources]").forEach(elementWithSource => {
      //sources-Attribut vom Element (getrennt mit Leerzeichen oder ,) in einen Array umwandeln
      const sources = elementWithSource.dataset.sources.split(/[,\s]+/).map(Number);
      sources.forEach(source => {
        const sourceEl = document.createElement("sup");
        sourceEl.innerHTML = `[${source}]`;
        sourceEl.tabIndex = "0";
        sourceEl.classList.add("source-note");
        elementWithSource.appendChild(sourceEl);
        // sourceEl.addEventListener("click", showSourceMenu)
      });
    });
  } catch (err) {
    console.error(`Could not inject source notes.\n${err.name}\n${err.message}`);
  }
}