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

// favicon.js

export async function generateAndInjectFavicon(elementName) {
  try {
    const elementObj = await findElementWithName(elementName);
    const FAVICON_TEXT = elementObj.elementsymbol;
    const FAVICON_BG_COLOR = elementObj?.additional_data?.background_color;
    const FAVICON_TEXT_COLOR = "#ffffff";

    // --- SVG (scalable, modern browsers) ---
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="15" fill="${FAVICON_BG_COLOR}"/>
      <text
        x="50" y="54"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-weight="bold"
        font-size="${FAVICON_TEXT.length > 2 ? '36' : FAVICON_TEXT.length > 1 ? '48' : '60'}"
        fill="${FAVICON_TEXT_COLOR}"
      >${FAVICON_TEXT}</text>
    </svg>`.trim();

    const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;

    // --- Canvas helper: renders icon at given px size, returns data URL ---
    function renderToCanvas(size) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const r = size * 0.15;

      // Rounded rect background
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fillStyle = FAVICON_BG_COLOR;
      ctx.fill();

      // Text
      const fontSize = FAVICON_TEXT.length > 2 ? size * 0.36 : FAVICON_TEXT.length > 1 ? size * 0.48 : size * 0.60;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = FAVICON_TEXT_COLOR;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(FAVICON_TEXT, size / 2, size / 2);

      return canvas.toDataURL("image/png");
    }

    // --- ICO: encode a 32x32 PNG inside an ICO container ---
    async function buildIcoDataUrl() {
      const png32 = renderToCanvas(32);
      const pngBytes = await fetch(png32).then((r) => r.arrayBuffer());
      const pngArray = new Uint8Array(pngBytes);

      const icoHeader = new Uint8Array(6);
      const view = new DataView(icoHeader.buffer);
      view.setUint16(0, 0, true); // reserved
      view.setUint16(2, 1, true); // type: ICO
      view.setUint16(4, 1, true); // image count

      const dirEntry = new Uint8Array(16);
      const de = new DataView(dirEntry.buffer);
      de.setUint8(0, 32); // width
      de.setUint8(1, 32); // height
      de.setUint8(2, 0); // color palette
      de.setUint8(3, 0); // reserved
      de.setUint16(4, 1, true); // color planes
      de.setUint16(6, 32, true); // bits per pixel
      de.setUint32(8, pngArray.byteLength, true); // image size
      de.setUint32(12, 6 + 16, true); // offset to image data

      const ico = new Uint8Array(6 + 16 + pngArray.byteLength);
      ico.set(icoHeader, 0);
      ico.set(dirEntry, 6);
      ico.set(pngArray, 22);

      const blob = new Blob([ico], {
        type: "image/x-icon"
      });
      return URL.createObjectURL(blob);
    }

    // --- Inject all favicons into <head> ---
    function setOrCreate(id, rel, type, sizes) {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("link");
        el.id = id;
        el.rel = rel;
        if (type) el.type = type;
        if (sizes) el.sizes = sizes;
        document.head.appendChild(el);
      }
      return el;
    }

    // PNG 96×96
    setOrCreate("favicon-96", "icon", "image/png", "96x96").href = renderToCanvas(96);

    // SVG
    setOrCreate("favicon-svg", "icon", "image/svg+xml").href = svgDataUrl;

    // Apple Touch Icon 180×180
    setOrCreate("favicon-apple", "apple-touch-icon", "image/png", "180x180").href = renderToCanvas(180);

    // ICO (async, injected when ready)
    buildIcoDataUrl().then((icoUrl) => {
      setOrCreate("favicon-ico", "shortcut icon", "image/x-icon").href = icoUrl;
    });
  } catch (err) {
    console.error(err.name + "\n" + err.message)
  }
}

export async function createFavicon(elementName) {
  alert(1)
  try {
    const elementObj = await findElementWithName(elementName);

    const FAVICON_TEXT = elementObj.elementsymbol;
    const FAVICON_BG = elementObj?.additional_data?.background_color ?? "darkgrey";
    const FAVICON_COLOR = "#ffffff";

    function drawFavicon(size) {
      alert(2)
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');

      const radius = size * 0.15;
      const fontSize = Math.round(size * 0.6);

      ctx.fillStyle = FAVICON_BG;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();

      ctx.fillStyle = FAVICON_COLOR;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(FAVICON_TEXT, size / 2, size / 2);

      return canvas.toDataURL('image/png');
    }

    function generateSVGFavicon() {
      alert(3)
      const letters = FAVICON_TEXT.slice(0, 2).toUpperCase();
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
          <rect width="96" height="96" rx="14" fill="${FAVICON_BG}"/>
          <text x="48" y="48" font-family="sans-serif" font-weight="bold"
                font-size="38" fill="${FAVICON_COLOR}"
                text-anchor="middle" dominant-baseline="central">${letters}</text>
        </svg>`.trim();
      return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    function applyFavicons() {
      alert(4)
      document.getElementById('favicon-96').href = drawFavicon(96);
      document.getElementById('favicon-ico').href = drawFavicon(32);
      document.getElementById('favicon-apple').href = drawFavicon(180);
      document.getElementById('favicon-svg').href = generateSVGFavicon();
    }

    // ✅ Fix: DOM schon bereit? Sofort ausführen, sonst warten.
    if (document.readyState === 'loading') {
      alert(5)
      document.addEventListener('DOMContentLoaded', applyFavicons);
    } else {
      alert(6)
      applyFavicons();
    }

  } catch (err) {
    console.error(err.name + "\n" + err.message);
  }
}

//createFavicon("Zink")




export async function insertPSE() {
  try {
    const alleElementDatenObj = await loadElemente();
    const alleElementeObj = alleElementDatenObj.elements;
    const pseElem = document.getElementById("pse-container")

    for (let key in alleElementeObj) {
      const elementElem = document.createElement("div");
      const elementsymbolElem = document.createElement("div");

      elementsymbolElem.innerHTML = alleElementeObj[key].elementsymbol;
      elementsymbolElem.classList.add("pse-item-elementname");

      elementElem.append(elementsymbolElem);
      elementElem.style.gridArea = key;
      elementElem.classList.add("pse-item");
      elementElem.style.backgroundColor = alleElementeObj[key]?.additional_data?.background_color ?? "lightgrey";
      pseElem.append(elementElem);
    }
  } catch (err) {
    console.error(err.name + "\n" + err.message)
  }
}
insertPSE();




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
        divEl.dataset.datatype = key;
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
          tdEl.innerHTML =
            value + unit + " bei " + elementObj.elementsymbol + `(${elementObj.additional_data.ionenradius_ladung})`
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
      datenName: "Elektronegativität (für Oxidationszahl)",
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

export function insertDaten() {
  const elementName = document.querySelector("#header-text > h1").innerText;
  insertDatenIntoGrafik(elementName);
  insertDatenIntoDatenliste(elementName);
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
        if (element[key] == "" && key == "anteil_haeufigstes_isotop") {
          let answer = prompt(key + " " + element.elementname);
          if (!answer) {
            console.log(JSON.stringify(newAlleElementeObj));
            return;
          }
          if (Number(answer)) {
            answer = Number(answer);
          }
          element[key] = answer;
        }
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
        // if (key == "elektronegativitaet" && element.elektronegativitaet.includes(" (")) {
        //   let elektro = element.elektronegativitaet.split(" (")[0];
        //   let oxi = element.elektronegativitaet.split(" (")[1];
        //   elektro = elektro.replace(",", ".");
        //   elektro = Number(elektro);

        //   element.elektronegativitaet = elektro;

        //   oxi = oxi.replace(")", "");
        //   element.additional_data ??= {};
        //   element.additional_data.elektronegativitaet_oxidationszahl = oxi;
        // }


      }
      newAlleElementeObj[key] = element;
    }
    console.log(JSON.stringify(newAlleElementeObj));
  } catch (err) {
    console.error(err.name + " " + err.message);
  }
}
// promptDaten();