"use strict";



let alleElemente = null;

async function loadElemente() {
  if (!alleElemente) {
    const response = await fetch('data/elements.json');
    alleElemente = await response.json();
  }
  return alleElemente;
}

async function findElementWithName(name) {
  const all = await loadElemente();
  const elemente = all.elements;
  for (let key in elemente) {
    if (elemente[key].elementname === name) {
      return elemente[key];
    }
  }
  return null; // explizit null zurückgeben
}


//const atomradien = `{"h":53,"he":31,"li":167,"be":112,"b":87,"c":67,"n":56,"o":48,"f":42,"ne":38,"na":190,"mg":145,"al":118,"si":111,"p":98,"s":88,"cl":79,"ar":71,"k":243,"ca":194,"sc":184,"ti":176,"v":171,"cr":166,"mn":161,"fe":156,"co":152,"ni":149,"cu":145,"zn":142,"ga":136,"ge":125,"as":114,"se":103,"br":94,"kr":88,"rb":265,"sr":219,"y":212,"zr":206,"nb":198,"mo":190,"tc":183,"ru":178,"rh":173,"pd":169,"ag":165,"cd":161,"in":156,"sn":145,"sb":133,"te":123,"i":115,"xe":108,"cs":298,"ba":253,"pr":247,"nd":206,"pm":205,"sm":238,"eu":231,"gd":233,"tb":225,"dy":228,"ho":226,"er":226,"tm":222,"yb":222,"lu":217,"hf":208,"ta":200,"w":193,"re":188,"os":185,"ir":180,"pt":177,"au":174,"hg":171,"tl":156,"pb":154,"bi":143,"po":135,"at":127,"rn":120}`;



export async function insertDatenIntoGrafik(elementName) {
  try {
    const elementObj = await findElementWithName(elementName);
    const grafikEl = document.getElementById("daten-grafik");

    if (!elementObj) {
      console.error(`Kein Element mit dem Namen "${elementName}" gefunden.`);
      return;
    }

    for (let key in elementObj) {
      if (key != "additional_data") {
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
        divEl.classList.add("daten-" + key);
        divEl.dataset.datatype = key
        divEl.style.gridArea = key;
        divEl.innerHTML = value;
        if (key == "ionenradius") {
          divEl.innerHTML += ` (${elementObj.additional_data.ionenradius_ladung})`;
        }
        if (key == "elektronegativitaet") {
          divEl.innerHTML += ` (${elementObj.additional_data.elektronegativitaet_oxidationszahl})`;
        }
        // if (key == "ionenradius" && elementObj.ionenradius != "?" && elementObj.oxidationszahl != "?" && elementObj.oxidationszahl != "" && elementObj.oxidationszahl != undefined) {
        //   divEl.innerHTML += " (" + elementObj.oxidationszahl + ")";
        // }

        grafikEl.append(divEl);

        grafikEl.style.backgroundColor = elementObj.additional_data.background_color || "darkgray";
      }
      // console.debug(grafikEl.outerHTML);
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

    function addListenElement({
      icon,
      key,
      datenName,
      info
    }) {
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
        
        //Beim Ionenradius muss der Ert zusammengesetzt werden aus Radius und Ladung/Oxidationszahl
      } else if (key == "ionenradius" && elementObj.additional_data.ionenradius_ladung) {
        if (elementObj.additional_data.ionenradius_ladung.includes("I") || elementObj.additional_data.ionenradius_ladung.includes("V")) {
          
          value + unit + "bei " + elementObj.elementsymbol + `(${elementObj.additional_data.ionenradius_ladung})`
        } else {

          tdEl.innerHTML = 
          value + unit + " bei " + elementObj.elementsymbol + `<sup>${elementObj.additional_data.ionenradius_ladung}</sup>`
        }
        
      } else if (key == "elektronegativitaet" && elementObj.additional_data.elektronegativitaet_oxidationszahl) {
        
          tdEl.innerHTML = 
          value + ` (${elementObj.additional_data.elektronegativitaet_oxidationszahl})`
        
      } else if (value != "" && value != "?" && value != undefined) {
        tdEl.innerHTML = value + unit;
        
      } else {
        tdEl.innerHTML = "<i>unbekannt</i>"
      }

      if (info) {
        let infoEl = document.createElement("div");
        infoEl.classList.add("daten-info-" + key);
        infoEl.classList.add("daten-info");
        infoEl.innerHTML = info;
        thEl.append(infoEl);
      }

      trEl.append(thEl);
      trEl.append(tdEl);
      trEl.dataset.datatype = key;
      trEl.classList.add("daten-" + key)
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
      datenName: "Elektronegativität (für Oxidationszahl",
      info: " "
    });

    addListenElement({
      icon: "ChartPie",
      key: "anteil_haeufigstes_isotop",
      datenName: "Anteil des häufigsten Isotops",
      info: " "
    });

    // console.debug(listeEl.outerHTML);

  } catch (err) {
    console.error(err.name + "\n" + err.message); // .description → .message
  }
}

async function promptDaten() {
  try {
    const allData = await loadElemente();
    const alleElementeObj = allData.elements;
    const newAlleElementeObj = {};

    for (let key in alleElementeObj) {
      const elementKey = key;
      const element = alleElementeObj[key]

      //Für jeden Datensatz eines Elements
      for (let key in element) {
        // if (element[key] == "-" && key == "atomradius") {
        //   let answer = prompt(key + " " + element.elementname);
        //   if (!answer) {
        //     console.log(JSON.stringify(newAlleElementeObj));
        //     return;
        //   }
        //   if (Number(answer)) {
        //     answer = Number(answer);
        //   }
        //   element[key] = answer;
        // }
        // if (key == "elektronegativitaet" && !elektro.includes("(") && elektro != "-") {
        //   let answer = prompt(key + " " + element.elementname, elektro + " (");
        //   if (!answer) {
        //     console.log(JSON.stringify(newAlleElementeObj));
        //     return;
        //   }
        //   if (answer.includes("(")) {
        //     answer += ")";
        //   }
        //   element[key] = answer;
        // }
        if (key == "elektronegativitaet" && element.elektronegativitaet.includes(" (")) {
          let elektro = element.elektronegativitaet.split(" (")[0];
          let oxi = element.elektronegativitaet.split(" (")[1];
          elektro = elektro.replace(",", ".");
          elektro = Number(elektro);

          element.elektronegativitaet = elektro;

          oxi = oxi.replace(")", "");
          element.additional_data ??= {};
          element.additional_data.elektronegativitaet_oxidationszahl = oxi;
        }


      }
      newAlleElementeObj[key] = element;
    }
    console.log(JSON.stringify(newAlleElementeObj));
  } catch (err) {
    console.error(err.name + " " + err.message);
  }
}
// promptDaten();



/*
Loads the periodic table data
let obj = {};

fetch("https://raw.githubusercontent.com/komed3/periodic-table/master/_db/elements.json")
  .then((response) => {
    return response.json();
  })
  .then(function(jsonDataa) {
    // function roundNumber(number, digits) {
    //   var multiple = Math.pow(10, digits);
    //   var rndedNum = Math.round(number * multiple) / multiple;
    //   return rndedNum;
    // }
    let obj = {}

    for (let key in jsonDataa) {
      const andereObj = jsonDataa[key];
      // console.log(andereObj.radius)
      if (andereObj) {
        if (andereObj.radius) {
          if (andereObj.radius.calculated) {
            let radiusi = andereObj.radius.calculated.value ?? "-";
            obj[key] = radiusi;
          }
        }
      }
    }

    console.log(JSON.stringify(obj));
  })
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
  );*/