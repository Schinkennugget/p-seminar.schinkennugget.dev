"use strict";

const zinkDaten = new Map([
  ["atommasse", "65,38"],
  ["protonenzahl", "30"],
  ["elementsymbol", "Zn"],
  ["elementname", "Zink"],
  ["atomradius", "133"],
  ["siedetemperatur", "906"],
  ["ionenradius-oxidationszahl", "74 (+II)"],
  ["schmelztemperatur", "419"],
  ["ionisierungsenergie", "913"],
  ["dichte", "7,14"],
  ["elektronegativitaet", "1,65 (II)"],
  ["anteil-haeufigstes-isotop", "48,6"]
]);
let elementDaten = undefined;



/*try {
  fetch("https://raw.githubusercontent.com/komed3/periodic-table/master/_db/elements.json")
    .then((response) => response.json())
    .then(function(json) {
      document.addEventListener("click", (event) => {
        // Beispiel: Taste "k"
        // if ((event.ctrlKey || event.metaKey) && event.key === "c") {
          navigator.clipboard.writeText(JSON.stringify(json));
          alert("Text kopiert per Keypress!");
        // }
      });

    })
} catch (err) {
  console.error(`could not load periodic table data from json.\n${err.name}\n${err.message}`);
}*/


function loadDaten() {
  let datenGrafikContent = "";
  zinkDaten.forEach(function(value, key) {
    datenGrafikContent += `<div id="daten-grafik-${key}" class="daten-grafik-wert daten-${key}">${value}</div>`;
  });


  document.getElementById("daten-grafik").innerHTML = datenGrafikContent;
}

loadDaten();