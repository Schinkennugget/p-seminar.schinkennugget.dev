"use strict";

const media = window.matchMedia('(prefers-color-scheme: dark)');
let darkModeEnabled = false;

// Alle Farben
// const backgroundDark = "#fff";
// const backgroundDark = "#111";
// const accent1TransparentLight = "rgba(248, 248, 255, 0.75)";
// const accent1TransparentDark = "rgba(50, 50, 50, 0.75)";
// const accent1Light = "#f8f8ff";
// const accent1Dark = "#222";
// const accent2Light = "#f5f5f6";
// const accent2Dark = "#333";
// const accent3Light = "#ededef";
// const accent3Dark = "#444";
// const accent4Light = "#e0e0e2";
// const accent4Dark = "#555";
// const accent5Light = "#444";
// const accent5Dark = "#666";
// const textColorLight = "#000";
// const textColorDark = "#fff";
// const linkColorLight = "#11a";
// const linkColorDark = "#66f";

let datenShown = false;

function toggleDarkMode() {
	const r = document.documentElement;
	darkModeEnabled = darkModeEnabled ? false : true;

	if (darkModeEnabled) {
		// r.style.setProperty('--background', backgroundDark);
		// r.style.setProperty('--accent1-transparent', accent1TransparentLight);
		// r.style.setProperty('--accent1', accent1Dark);
		// r.style.setProperty('--accent2', accent2Dark);
		// r.style.setProperty('--accent3', accent3Dark);
		// r.style.setProperty('--accent4', accent4Dark);
		// r.style.setProperty('--accent5', accent5Dark);
		// r.style.setProperty('--text', textColorDark);
		// r.style.setProperty('--link-color', linkColorDark);
		r.style.setProperty('--background', '#111');
		r.style.setProperty('--accent1-transparent', 'rgba(50, 50, 50, 0.75)');
		r.style.setProperty('--accent1', '#222');
		r.style.setProperty('--accent2', '#333');
		r.style.setProperty('--accent3', '#444');
		r.style.setProperty('--accent4', '#555');
		r.style.setProperty('--accent5', '#666');
		r.style.setProperty('--text', '#fff');
		r.style.setProperty('--link-color', '#66f');
	} else {
		r.style.setProperty('--background', '#fff');
		r.style.setProperty('--accent1-transparent', 'rgba(248, 248, 255, 0.75)');
		r.style.setProperty('--accent1', '#f8f8ff');
		r.style.setProperty('--accent2', '#f5f5f6');
		r.style.setProperty('--accent3', '#ededef');
		r.style.setProperty('--accent4', '#e0e0e2');
		r.style.setProperty('--accent5', '#444');
		r.style.setProperty('--text', '#000');
		r.style.setProperty('--link-color', '#11a');
	}
}

// initial
toggleDarkMode(media.matches);

// live changes
if (media.addEventListener) {
	media.addEventListener('change', e => updateDarkMode(e.matches));
} else {
	media.addListener(e => updateDarkMode(e.matches));
}

function toggleDaten() {
	if (datenShown) {
		datenShown = false;
		document.getElementById("daten-werte-abschnitt").style.display = "none";
		document.getElementById("daten-header-icon").style.rotate = "0deg"
		r.style.setProperty('--daten-hover-background', r.style.getProperty('--accent1'));
	} else {
		datenShown = true;
		document.getElementById("daten-werte-abschnitt").style.display = "grid";
		document.getElementById("daten-header-icon").style.rotate = "90deg"
	}
}

//Variable für die Höhe vom Daten-Abschnitt
