"use strict";
const rootStyle = document.documentElement.style;

// Alle Farben
const bgBodyLight = "#fff";
const bgElevatedLight = "#f2f2f2";
const bgHighlightLight = "#e6e6e6";
const bgNavbarLight = "rgba(248, 248, 255, 0.75)";
const bgNavbarSolidLight = "rgb(248, 248, 255)";
const bgTransparentLight = "rgba(250, 250, 250, 0.5)"
const textColorLight = "#000";
const mutedTextColorLight = "#0d0d0d";
const linkColorLight = "#22d";
const linkHoverLight = "#00a";
const missingLinkLight = "#d11";
const missingLinkHoverLight = "#a00";
const shadowLight = "rgba(0, 0, 0, 0.2)";
const disabledLight = "lightgrey";

const bgBodyDark = "#000";
const bgElevatedDark = "#1f1f1f";
const bgHighlightDark = "#333";
const bgNavbarDark = "rgba(50, 50, 50, 0.75)";
const bgNavbarSolidDark = "rgb(50, 50, 50)";
const bgTransparentDark = "rgba(20, 20, 20, 0.6)";
const textColorDark = "#f2f2f2";
const mutedTextColorDark = "#e6e6e6";
const linkColorDark = "#77f";
const linkHoverDark = "#88f";
const missingLinkDark = "#e00"
const missingLinkHoverDark = "#f00";
const shadowDark = "rgba(0, 0, 0, 0.2)";
const disabledDark = "grey";

function enableDarkMode() {
  rootStyle.setProperty('--bg-body', bgBodyDark);
  rootStyle.setProperty('--bg-elevated', bgElevatedDark);
  rootStyle.setProperty('--bg-highlight', bgHighlightDark);
  rootStyle.setProperty('--bg-navbar', bgNavbarDark);
  rootStyle.setProperty('--bg-navbar-solid', bgNavbarSolidDark);
  rootStyle.setProperty('--bg-transparent', bgTransparentDark);
  rootStyle.setProperty('--text', textColorDark);
  rootStyle.setProperty('--text-muted', mutedTextColorDark);
  rootStyle.setProperty('--link-color', linkColorDark);
  rootStyle.setProperty('--link-hover', linkHoverDark);
  rootStyle.setProperty('--missing-link', missingLinkDark);
  rootStyle.setProperty('--missing-link-hover', missingLinkHoverDark);
  rootStyle.setProperty('--shadow-color', shadowDark);
  rootStyle.setProperty('--disabled', disabledDark);
  document.getElementById("navbar-icon-moon").style.display = "none";
  document.getElementById("navbar-icon-sun").style.display = "inline";

  document.querySelectorAll(".darkmode-invert").forEach(elem => elem.style.filter = "invert(1)");
}

function disableDarkMode() {
  rootStyle.setProperty('--bg-body', bgBodyLight);
  rootStyle.setProperty('--bg-elevated', bgElevatedLight);
  rootStyle.setProperty('--bg-highlight', bgHighlightLight);
  rootStyle.setProperty('--bg-navbar', bgNavbarLight);
  rootStyle.setProperty('--bg-navbar-solid', bgNavbarSolidLight);
  rootStyle.setProperty('--bg-transparent', bgTransparentLight);
  rootStyle.setProperty('--text', textColorLight);
  rootStyle.setProperty('--text-muted', mutedTextColorLight);
  rootStyle.setProperty('--link-color', linkColorLight);
  rootStyle.setProperty('--link-hover', linkHoverLight);
  rootStyle.setProperty('--missing-link', missingLinkLight);
  rootStyle.setProperty('--missing-link-hover', missingLinkHoverLight);
  rootStyle.setProperty('--shadow-color', shadowLight);
  rootStyle.setProperty('--disabled', disabledLight);
  document.getElementById("navbar-icon-sun").style.display = "none";
  document.getElementById("navbar-icon-moon").style.display = "inline";

  document.querySelectorAll(".darkmode-invert").forEach(elem => elem.style.filter = "invert(0)");
}

function toggleDarkMode() {
  if (JSON.parse(localStorage.getItem("darkModeEnabled"))) {
    localStorage.setItem("darkModeEnabled", JSON.stringify(false));
    disableDarkMode();
  } else {
    localStorage.setItem("darkModeEnabled", JSON.stringify(true));
    enableDarkMode();
  }
}

export function initialize() {
  try {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    // initialisierung dark mode
    if (localStorage.getItem("darkModeEnabled") === null) {
      if (media.matches) {
        localStorage.setItem("darkModeEnabled", JSON.stringify(true));
        enableDarkMode();
      } else {
        localStorage.setItem("darkModeEnabled", JSON.stringify(false));
        disableDarkMode();
      }
    } else {
      if (JSON.parse(localStorage.getItem("darkModeEnabled"))) {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
    }

    // live changes vom dark mode
    media.addEventListener('change', e => {
      media.matches ? enableDarkMode() : disableDarkMode();
    });

    document.getElementById("navbar-button-darkmode").addEventListener("click", toggleDarkMode);
  } catch (err) {
    console.error(`Could not initialize dark mode.\n${err.name}: ${err.message} at ${err.lineNumber ?? "?"}:${err.columnNumber ?? "?"}`);
  }
}