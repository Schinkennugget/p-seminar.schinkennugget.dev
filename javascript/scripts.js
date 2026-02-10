"use strict";

const media = window.matchMedia('(prefers-color-scheme: dark)');
let darkModeEnabled = false;
const cssRoot = document.documentElement;

// Alle Farben
const backgroundLight = "#fff";
const backgroundDark = "#111";
const accent1TransparentLight = "rgba(248, 248, 255, 0.75)";
const accent1TransparentDark = "rgba(50, 50, 50, 0.75)";
const accent1Light = "#f8f8ff";
const accent1Dark = "#222";
const accent2Light = "#f5f5f6";
const accent2Dark = "#333";
const accent3Light = "#ededef";
const accent3Dark = "#444";
const accent4Light = "#e0e0e2";
const accent4Dark = "#555";
const accent5Light = "#444";
const accent5Dark = "#666";
const textColorLight = "#000";
const textColorDark = "#fff";
const linkColorLight = "#11a";
const linkColorDark = "#66f";

function toggleDarkMode() {
  darkModeEnabled = darkModeEnabled ? false : true;

  if (darkModeEnabled) {
    cssRoot.style.setProperty('--background', backgroundDark);
    cssRoot.style.setProperty('--accent1-transparent', accent1TransparentDark);
    cssRoot.style.setProperty('--accent1', accent1Dark);
    cssRoot.style.setProperty('--accent2', accent2Dark);
    cssRoot.style.setProperty('--accent3', accent3Dark);
    cssRoot.style.setProperty('--accent4', accent4Dark);
    cssRoot.style.setProperty('--accent5', accent5Dark);
    cssRoot.style.setProperty('--text', textColorDark);
    cssRoot.style.setProperty('--link-color', linkColorDark);
    document.getElementById("navbar-icon-moon").style.display = "none";
    document.getElementById("navbar-icon-sun").style.display = "inline";
  } else {
    cssRoot.style.setProperty('--background', backgroundLight);
    cssRoot.style.setProperty('--accent1-transparent', accent1TransparentLight);
    cssRoot.style.setProperty('--accent1', accent1Light);
    cssRoot.style.setProperty('--accent2', accent2Light);
    cssRoot.style.setProperty('--accent3', accent3Light);
    cssRoot.style.setProperty('--accent4', accent4Light);
    cssRoot.style.setProperty('--accent5', accent5Light);
    cssRoot.style.setProperty('--text', textColorLight);
    cssRoot.style.setProperty('--link-color', linkColorLight);
    document.getElementById("navbar-icon-sun").style.display = "none";
    document.getElementById("navbar-icon-moon").style.display = "inline";
  }
}

// initialisierung dark mode
toggleDarkMode(media.matches);

// live changes vom dark mode
if (media.addEventListener) {
  media.addEventListener('change', e => toggleDarkMode(e.matches));
} else {
  media.addListener(e => toggleDarkMode(e.matches));
}








//Event Listener für expandable
try {
  let i = 0;
  for ( ; i < document.getElementsByClassName("expandable-header").length; i++) {
    document.getElementsByClassName("expandable-header")[i]
      .addEventListener("click", toggleExpandable);
      
  }
  // console.debug("Added click event listeners for " + i + " expandables.")
} catch(err) {
  console.error(`Event Listener for expandable could not be registered.\nError: ${err.name}\nMessage: ${err.message}`)
}


function toggleExpandable(event) {
  const expandableHeaderEl = event.currentTarget;
  const expandableContainerEl = expandableHeaderEl.parentElement;
  const expandableContentEl = expandableContainerEl.getElementsByClassName("expandable-content")[0];
  let expanded = Boolean(Number(expandableContainerEl.dataset.expanded));

  expanded = !expanded;
  expandableContainerEl.dataset.expanded = String(Number(expanded));
  
  if (expanded) { //Soll ausklappen
    expandableContentEl.style.overflow = "hidden";
    expandableContentEl.style.display = "";
    expandableContentEl.style.height = expandableContentEl.scrollHeight + "px";
    // expandableContentEl.style.transform = "scaleY(1)";
    expandableContainerEl.querySelector(".expandable-header-icon").style.rotate = "-90deg";

    // nach der Animation auf auto setzen
    expandableContentEl.addEventListener("transitionend", function handler() {
      expandableContentEl.style.height = "auto";
      expandableContentEl.style.overflow = "show";
      expandableContentEl.removeEventListener("transitionend", handler);
    });
  } else {
    
    expandableContentEl.style.overflow = "hidden";
    expandableContainerEl.querySelector(".expandable-header-icon").style.rotate = "90deg";
    // expandableContentEl.style.transform = "scaleY(0.01)";
    expandableContentEl.style.height = expandableContentEl.offsetHeight + "px";
    requestAnimationFrame(() => {
      expandableContentEl.style.height = "0";
    });
    
    expandableContentEl.addEventListener("transitionend", function handler() {
      expandableContentEl.style.display = "none";
      expandableContentEl.style.overflow = "show";
      expandableContentEl.removeEventListener("transitionend", handler);
    });
  }
}




function injectSourceNotes() {
  try {
    document.querySelectorAll("[data-sources]").forEach(elementWithSource => {
      //sources-Attribut vom Element (getrennt mit Leerzeichen oder ,) in einen Array umwandeln
      const sources = elementWithSource.dataset.sources.split(/[,\s]+/).map(Number);
      sources.forEach(source => {
        const sourceEl = document.createElement("sup");
        sourceEl.innerHTML = `[${source}]`;
        sourceEl.tabIndex = "0";
        sourceEl.className = "source";
        sourceEl.style.color = "var(--link-color)";
        elementWithSource.appendChild(sourceEl);
        sourceEl.addEventListener("click", showSourceMenu)
      });
    });
  } catch (err) {
    console.error(`could not inject source notes.\n${err.name}\n${err.message}`);
  }
}

injectSourceNotes();
function showSourceMenu(event) {
  const sourceEl = event.currentTarget
}



function injectSourceFooterContent() {
  
}








function copyURIWithID(id) {
  navigator.clipboard.writeText(`${document.baseURI}#${id}`)
}