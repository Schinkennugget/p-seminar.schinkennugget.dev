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




fetch("data/elements.json")
  .then((response) => {
    console.log(response);
    return response.json();
  })
  .then(function(data) {
    
  })
  .catch(err =>
    console.error(`Could not load periodic table data from json.\n${err.name}\n${err.message}`)
  );


function loadDaten() {
  let datenGrafikContent = "";
  zinkDaten.forEach(function(value, key) {
    datenGrafikContent += `<div id="daten-grafik-${key}" class="daten-grafik-wert daten-${key}">${value}</div>`;
  });

  try {
    const grafikEl = document.getElementById("daten-grafik");
    if (grafikEl != undefined && grafikEl != null) {
      document.getElementById("daten-grafik").innerHTML = datenGrafikContent;
    } else {
      // console.debug("The page doesn't contain an element with id 'daten-grafik'.")
    }
  } catch (err) {}
}




loadDaten();