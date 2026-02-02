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
  media.addEventListener('change', e => updateDarkMode(e.matches));
} else {
  media.addListener(e => updateDarkMode(e.matches));
}









function toggleDaten() {
  datenShown = datenShown ? false : true;
  const datenWerteAbschnitt = document.getElementById("daten-werte-abschnitt");

  if (datenShown) {
    //Finde die Höhe, die es ausgeklappt hätte, setze die Höhe auf 0, zeig das
    //Element, setze die Höhe auf die vorher bestimmte Höhe, setze nach Verzögerung
    //für Animation die Höhe auf auto (damit Bilschirm resized werden kann)

    datenWerteAbschnitt.style.transition = "none";
    datenWerteAbschnitt.style.display = "grid";
    datenWerteAbschnitt.style.height = "auto";
    const datenHeight = datenWerteAbschnitt.offsetHeight;
    // console.log(datenHeight + "px");
    datenWerteAbschnitt.style.height = "0";
    datenWerteAbschnitt.style.transition = "height 0.3s, transform 0.3s";

    document.getElementById("daten-header-icon").style.rotate = "90deg";
    datenWerteAbschnitt.style.height = datenHeight + "px";
    datenWerteAbschnitt.style.transform = "scaleY(1)";

    // setTimeout(function() {
    datenWerteAbschnitt.style.height = "auto";
    // }, 500);
  } else {

    datenWerteAbschnitt.style.transition = "height 0.3s, transform 0.15s";
    datenWerteAbschnitt.style.transform = "scaleY(0.1)";
    document.getElementById("daten-header-icon").style.rotate = "0deg";


    setTimeout(function() {
      datenWerteAbschnitt.style.display = "none";
    }, 100);
  }
}