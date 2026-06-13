"use strict";

export function injectSourceNotes() {
  try {
    document.querySelectorAll("[data-sources]").forEach(elementWithSource => {
      //sources-Attribut vom Element (getrennt mit Leerzeichen oder ,) in einen Array umwandeln
      const sources = elementWithSource.dataset.sources.split(/[,\s]+/).map(Number);
      // Einzelne Verweise
      sources.forEach(sourceID => {
        const sourceEl = document.createElement("sup");
        sourceEl.innerHTML = `[${sourceID}]`;
        sourceEl.tabIndex = "0";
        sourceEl.classList.add("source-note");
        elementWithSource.appendChild(sourceEl);
        sourceEl.addEventListener("click", () => {
          if (document.getElementById("quellen-container").dataset.expanded == "false") {
            document.getElementById("quellen-header").click();
            document.getElementById("quellen").display = "";
          }
          
          const bigSourceEl = document.querySelector("#quelle-" + sourceID);
          bigSourceEl.scrollIntoView();
          bigSourceEl.style.textDecoration = "underline";
          setTimeout(() => bigSourceEl.style.textDecorationLine = "", 2500)
        });
      });
    });
  } catch (err) {
    console.error(`Could not inject source notes.\n${err.name}\n${err.message}`);
  }
}

/*
- [1] laden
- popup injizieren
- quellen in popup laden
- links unten auf der seite injizieren
*/