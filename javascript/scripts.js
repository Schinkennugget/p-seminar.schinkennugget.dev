"use strict";

const media = window.matchMedia('(prefers-color-scheme: dark)');
let darkModeEnabled = false;
const cssRoot = document.documentElement;

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
		cssRoot.style.setProperty('--background', '#111');
		cssRoot.style.setProperty('--accent1-transparent', 'rgba(50, 50, 50, 0.75)');
		cssRoot.style.setProperty('--accent1', '#222');
		cssRoot.style.setProperty('--accent2', '#333');
		cssRoot.style.setProperty('--accent3', '#444');
		cssRoot.style.setProperty('--accent4', '#555');
		cssRoot.style.setProperty('--accent5', '#666');
		cssRoot.style.setProperty('--text', '#fff');
		cssRoot.style.setProperty('--link-color', '#66f');
		document.getElementById("navbar-icon-moon").style.display = "none";
		document.getElementById("navbar-icon-sun").style.display = "inline";
	} else {
		cssRoot.style.setProperty('--background', '#fff');
		cssRoot.style.setProperty('--accent1-transparent', 'rgba(248, 248, 255, 0.75)');
		cssRoot.style.setProperty('--accent1', '#f8f8ff');
		cssRoot.style.setProperty('--accent2', '#f5f5f6');
		cssRoot.style.setProperty('--accent3', '#ededef');
		cssRoot.style.setProperty('--accent4', '#e0e0e2');
		cssRoot.style.setProperty('--accent5', '#444');
		cssRoot.style.setProperty('--text', '#000');
		cssRoot.style.setProperty('--link-color', '#11a');
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