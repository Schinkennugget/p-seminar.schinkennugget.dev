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


let obj = {};

fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/refs/heads/master/PeriodicTableJSON.json")
  .then((response) => {
    return response.json();
  })
  .then(function(jsonData) {
    function roundNumber(number, digits) {
      var multiple = Math.pow(10, digits);
      var rndedNum = Math.round(number * multiple) / multiple;
      return rndedNum;
    }

    for (let element of jsonData.elements) {
      obj[element.symbol.toLowerCase()] = {
        elementname: "",
        elementsymbol: element.symbol,
        ordnungszahl: element.number,
        atommasse: roundNumber(element.atomic_mass, 5),
        atomradius: "",
        ionenradius: "",
        oxidationszahl: "",
        siedepunkt: roundNumber(element.boil - 273.15, 1),
        schmelzpunkt: roundNumber(element.melt - 273.15, 1),
        ionisierungsenergie: roundNumber(element.ionization_energies[0], 0),
        dichte: roundNumber(element.density, 1),
        elektronegativitaet: element.electronegativity_pauling,
        anteil_haeufigstes_isotop: ""
      };
    }

    fetch("https://raw.githubusercontent.com/komed3/periodic-table/master/_db/elements.json")
      .then((response) => {
        return response.json();
      })
      .then(function(jsonData) {
        for (let key in jsonData) {
          obj[key].elementname = jsonData[key].names.de;
        }

        console.log(JSON.stringify(obj))
      })
      .catch(err =>
        console.error(`Could not load periodic table data from json.\n${err.name}\n${err.message}`)
      );
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