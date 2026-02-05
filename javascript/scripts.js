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

let datenShown = false;

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









function toggleExpandableA(expandableContainerElement) {
  //expanded-Attribut vom Parent in Boolean umwandeln
  let expanded = false;
  try {
    expanded = Boolean(Number(expandableContainerElement.dataset.expanded));
    expanded = expanded ? false : true;
    // Als Attribut setzen
    expandableContainerElement.dataset.expanded = String(Number(expanded));
  } catch (err) {
    console.log(err.message);
  }

  const expandableContentElement = expandableContainerElement.querySelector(".expandable-content");

  expandableContentElement.style.display = "grid";
  expandableContentElement.style.transition = "none";
  expandableContentElement.style.height = "auto";
  const expandableContentHeight = expandableContentElement.offsetHeight;
  // expandableContentElement.style.height = "0"; 
  // Kann man aktivieren, dann ist die Animation an sich schöner, aber es ruckelt
  expandableContentElement.style.transition = "height 0.3s, transform 0.3s";

  if (expanded) {
    //Finde die Höhe, die es ausgeklappt hätte, setze die Höhe auf 0, zeig das
    //Element, setze die Höhe auf die vorher bestimmte Höhe, setze nach Verzögerung
    //für Animation die Höhe auf auto (damit Bildschirm resized werden kann)

    expandableContainerElement.querySelector(".expandable-header-icon").style.rotate = "90deg";
    setTimeout(function() {
      expandableContentElement.style.height = (expandableContentHeight * 1.05) + "px";
      // console.log("höhe beim bounce: " + expandableContentElement.offsetHeight);
      // console.log("höhe beim bounce (style): " + expandableContentElement.style.height);
      // console.log("scrollHeight beim bounce: " + expandableContentElement.scrollHeight);
      expandableContentElement.style.transform = "scaleY(1.05)";
    }, 0);
    setTimeout(function() {
      expandableContentElement.style.height = expandableContentHeight + "px";
      // console.log("höhe beim normal: " + expandableContentElement.offsetHeight);
      // console.log("höhe beim normal (style): " + expandableContentElement.style.height);
      // console.log("scrollHeight bei normal: " + expandableContentElement.scrollHeight);
      expandableContentElement.style.transform = "scaleY(1)";

      setTimeout(() => expandableContentElement.style.height = "auto", 1000);
    }, 300);


  } else {
    expandableContentElement.style.transform = "scaleY(0.1)";
    expandableContainerElement.querySelector(".expandable-header-icon").style.rotate = "0deg";
    setTimeout(function() {
      expandableContentElement.style.height = expandableContentHeight;
      setTimeout(() => expandableContentElement.style.height = "0", 1);
    }, 1);

    setTimeout(function() {
      expandableContentElement.style.display = "none";
    }, 300);
  }
}


function toggleExpandableB(expandableContainerElement) {
  //expanded-Attribut vom Parent in Boolean umwandeln
  let expanded = false;
  try {
    expanded = Boolean(Number(expandableContainerElement.dataset.expanded));
    expanded = expanded ? false : true;
    // Als Attribut setzen
    expandableContainerElement.dataset.expanded = String(Number(expanded));
  } catch (err) {
    console.log(err.message);
  }

  const expandableContentElement = expandableContainerElement.querySelector(".expandable-content");

  expandableContentElement.style.display = "grid";
  expandableContentElement.style.transition = "none";
  expandableContentElement.style.height = "auto";
  const expandableContentHeight = expandableContentElement.offsetHeight;
  expandableContentElement.style.height = "0"; 
  // Kann man aktivieren, dann ist die Animation an sich schöner, aber es ruckelt
  expandableContentElement.style.transition = "height 0.3s, transform 0.3s";

  if (expanded) {
    //Finde die Höhe, die es ausgeklappt hätte, setze die Höhe auf 0, zeig das
    //Element, setze die Höhe auf die vorher bestimmte Höhe, setze nach Verzögerung
    //für Animation die Höhe auf auto (damit Bildschirm resized werden kann)

    expandableContainerElement.querySelector(".expandable-header-icon").style.rotate = "90deg";
    setTimeout(function() {
      expandableContentElement.style.height = (expandableContentHeight * 1.05) + "px";
      // console.log("höhe beim bounce: " + expandableContentElement.offsetHeight);
      // console.log("höhe beim bounce (style): " + expandableContentElement.style.height);
      // console.log("scrollHeight beim bounce: " + expandableContentElement.scrollHeight);
      expandableContentElement.style.transform = "scaleY(1.05)";
    }, 0);
    setTimeout(function() {
      expandableContentElement.style.height = expandableContentHeight + "px";
      // console.log("höhe beim normal: " + expandableContentElement.offsetHeight);
      // console.log("höhe beim normal (style): " + expandableContentElement.style.height);
      // console.log("scrollHeight bei normal: " + expandableContentElement.scrollHeight);
      expandableContentElement.style.transform = "scaleY(1)";

      setTimeout(() => expandableContentElement.style.height = "auto", 1000);
    }, 300);


  } else {
    expandableContentElement.style.transform = "scaleY(0.1)";
    expandableContainerElement.querySelector(".expandable-header-icon").style.rotate = "0deg";
    setTimeout(function() {
      expandableContentElement.style.height = expandableContentHeight;
      setTimeout(() => expandableContentElement.style.height = "0", 1);
    }, 1);

    setTimeout(function() {
      expandableContentElement.style.display = "none";
    }, 300);
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
      });
    });
  } catch (err) {
    alert(err.description)
  }
}

injectSourceNotes();


function injectSourceFooterContent() {

}



function copyURIWithID(id) {
  navigator.clipboard.writeText(`${document.baseURI}#${id}`)
}