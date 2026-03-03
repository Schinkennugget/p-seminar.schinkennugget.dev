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



let alleElemente = null;

async function loadElemente() {
  if (!alleElemente) {
    const response = await fetch('data/elements.json');
    alleElemente = await response.json();
  }
  return alleElemente;
}

async function findElementWithName(name) {
  const elemente = await loadElemente();
  for (let key in elemente) {
    if (elemente[key].elementname === name) {
      return elemente[key];
    }
  }
  return null; // explizit null zurückgeben
}

export async function insertDatenIntoGrafik(elementName) {
  try {
    const elementObj = await findElementWithName(elementName);
    const grafikEl = document.getElementById("daten-grafik");

    if (!elementObj) {
      console.error(`Kein Element mit dem Namen "${elementName}" gefunden.`);
      return;
    }

    for (let key in elementObj) {
      let value = elementObj[key];
      if (value === "" || value === undefined) {
        value = "?";
      }
      if (typeof value == typeof 1) {
        value = value.toLocaleString();
      }

      let divEl = document.createElement("div");
      divEl.id = "daten-grafik-" + key;
      divEl.classList.add("daten-grafik-wert");
      divEl.classList.add("daten-grafik-" + key);
      divEl.style.gridArea = key;
      divEl.innerHTML = value;
      // if (key == "ionenradius" && elementObj.ionenradius != "?" && elementObj.oxidationszahl != "?" && elementObj.oxidationszahl != "" && elementObj.oxidationszahl != undefined) {
      //   divEl.innerHTML += " (" + elementObj.oxidationszahl + ")";
      // }
      if (key != "background_color") {
        grafikEl.append(divEl);
      }

      grafikEl.style.backgroundColor = elementObj.background_color || "darkgray";
    }

  } catch (err) {
    console.error(err.name + "\n" + err.message); // .description → .message
  }
}




export async function insertDatenIntoDatenliste(elementName) {
  try {
    const elementObj = await findElementWithName(elementName);
    let alleElementeObj = await loadElemente() ?? {};
    let unitObj = alleElementeObj.units;
    const listeEl = document.getElementById("daten-liste");

    if (!elementObj) {
      console.error(`No elements found with name "${elementName}"`);
      return;
    }

    if (!unitObj) {
      console.error("Units could not be loaded");
      unitObj = {};
    }

    function addListenElement({ icon, key, datenName, info }) {
      /* Adds an element like this:
        
        <tr>
          <th class="daten-*key*">
            <i data-lucide="*icon*" class="daten-icon"></i>
            *datenName*
          </th>
          <td class="daten-*key* daten-wert" id="daten-*key*-wert">
            *value + unit*
            <div id="daten-info-*key*" class="daten-info">*info*</div>
          </td>
        </tr>
                
        */
      let trEl = document.createElement("tr");
      let thEl = document.createElement("th");
      let tdEl = document.createElement("td");
      const iconEl = lucide.createElement(lucide[icon])

      let value = elementObj[key];
      if (typeof value == typeof 1) {
        value = value.toLocaleString();
      }
      let unit = unitObj[key] ?? "";


      iconEl.classList.add("daten-icon")
      thEl.prepend(iconEl);
      thEl.classList.add("daten-" + key);
      thEl.innerHTML += datenName;
      if (key == "ionenradius") {
        if (value.includes("I") || value.includes("V")) {
          thEl.innerHTML += " (für Oxidationszahl)";
        } else {
          thEl.innerHTML += " (bei Ladung)";
        }
      }

      tdEl.classList.add("daten-" + key);
      tdEl.classList.add("daten-wert");
      tdEl.id = "daten-" + key + "-wert";
      //Setzt den Wert auf den Wert mit Einheit, sonst auf unbekannt oder -
      if (value == "-") {
        tdEl.innerHTML = "–";
      } else if (value != "" && value != "?" && value != undefined) {
        tdEl.innerHTML = value + unit;
      } else { tdEl.innerHTML = "<i>unbekannt</i>" }

      if (info) {
        let infoEl = document.createElement("div");
        infoEl.classList.add("daten-info-" + key);
        infoEl.classList.add("daten-info");
        infoEl.innerHTML = info;
        thEl.append(infoEl);
      }

      trEl.append(thEl);
      trEl.append(tdEl);
      listeEl.append(trEl);
    }

    addListenElement({
      icon: "Tag",
      key: "elementname",
      datenName: "Elementname"
    });

    addListenElement({
      icon: "ALargeSmall",
      key: "elementsymbol",
      datenName: "Elementsymbol",
      info: "Das Elementsymbol ist die Kurzschreibweise des Elementnames. Es wird z.B. in chemischen Gleichungen verwendet. Das Elementsymbol ist meist eine Abkürzung des lateinischen Namens des Elements und ist so international gleich."
    });

    addListenElement({
      icon: "BadgePlus",
      key: "ordnungszahl",
      datenName: "Ordnungszahl/Protonenzahl",
      info: "Die Anzahl der Protonen im Atomkern. Anders als die Neutronenzahl ist sie bei jedem Element eindeutig und bestimmt die Stellung im PSE, deswegen auch Ordnugszahl."
    });

    addListenElement({
      icon: "WeightTilde",
      key: "atommasse",
      datenName: "Atommasse (Massenzahl)",
      info: " "
    });

    addListenElement({
      icon: "Atom",
      key: "atomradius",
      datenName: "Atomradius",
      info: " "
    });

    addListenElement({
      icon: "Radius",
      key: "ionenradius",
      datenName: "Ionenradius",
      info: " "
    });

    addListenElement({
      icon: "ThermometerSun",
      key: "siedepunkt",
      datenName: "Siedepunkt",
      info: " "
    });

    addListenElement({
      icon: "ThermometerSnowflake",
      key: "schmelzpunkt",
      datenName: "Schmelzpunkt",
      info: " "
    });

    addListenElement({
      icon: "Zap",
      key: "ionisierungsenergie",
      datenName: "1. Ionisierungsenergie",
      info: " "
    });

    addListenElement({
      icon: "FoldHorizontal",
      key: "dichte",
      datenName: "Dichte",
      info: " "
    });

    addListenElement({
      icon: "CircleMinus",
      key: "elektronegativitaet",
      datenName: "Elektronegativität",
      info: " "
    });

    addListenElement({
      icon: "ChartPie",
      key: "anteil_haeufigstes_isotop",
      datenName: "Anteil des häufigsten Isotops",
      info: " "
    });

  } catch (err) {
    console.error(err.name + "\n" + err.message); // .description → .message
  }
}




/*
Loads the periodic table data
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
        atommasse: roundNumber(element.atomic_mass, 5) ?? "?",
        atomradius: "",
        ionenradius: "",
        oxidationszahl: "",
        siedepunkt: roundNumber(element.boil - 273.15, 1) ?? "?",
        schmelzpunkt: roundNumber(element.melt - 273.15, 1) ?? "?",
        ionisierungsenergie: roundNumber(element.ionization_energies[0], 0) ?? "?",
        dichte: roundNumber(element.density, 1) ?? "?",
        elektronegativitaet: element.electronegativity_pauling ?? "?",
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
  ); */


export function loadDaten() {
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