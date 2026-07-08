"use strict";
import tinycolor from "./tinycolor.js";



let alleElemente = null;

export async function loadElemente() {
  try {
    if (!alleElemente) {
      const response = await fetch('data/elements.json');
      alleElemente = await response.json();
    }
    return alleElemente;
  } catch (error) {
    console.error("Elemente konnten nicht geladen werden. " + error.name + ": " + error.message)
  }
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

    let svgContent;
    let svgDataUrl;
    // --- SVG (scalable, modern browsers) ---
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="15" fill="${FAVICON_BG_COLOR}"/>
      <text
        x="50" y="54"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="${document.baseURI.includes("localhost") ? "'SF Mono', SFMono-Regular, ui-monospace, 'JetBrains Mono', monospace" : "Inter, Helvetica, Arial, sans-serif"}"
        font-weight="bold"
        font-size="${FAVICON_TEXT.length > 2 ? '36' : FAVICON_TEXT.length > 1 ? '48' : '60'}"
        fill="${document.baseURI.includes("localhost") ? "#f0f" : FAVICON_TEXT_COLOR}"
      >${FAVICON_TEXT}</text>
    </svg>`.trim();

    svgDataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;


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
      const fontSize = FAVICON_TEXT.length > 2 ? size * 0.5 : size * 0.60;
      ctx.font = `bold ${fontSize}px Inter, Helvetica, Arial, sans-serif`;
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





export async function insertPSE() {
  try {
    const pseElem = document.getElementById("pse-container");
    const loadingWheel = lucide.createElement(lucide.LoaderCircle);
    loadingWheel.classList.add("loading-wheel");
    pseElem.append(loadingWheel);

    // Lädt die Daten der Elemente und entfernt das Lade-Icon, wenn die Daten geladen sind. Wenn ein Fehler auftritt, wird eine Fehlermeldung angezeigt.
    const alleElementDatenObj = await loadElemente()
      .then(result => {
        pseElem.innerHTML = "";
        return result;
      })
      .catch(error => {
        pseElem.innerHTML = "";
        const errorIcon = lucide.createElement(lucide.OctagonAlert);
        errorIcon.classList.add("icon-error");
        const errorText = document.createElement("span");
        errorText.innerHTML = `Das Periodensystem konnte nicht geladen werden. (<code>${error.name}: ${error.message}</code>)`;

        pseElem.append(errorIcon);
        pseElem.append(errorText);
        pseElem.style.display = "block"
        return;
      })

    if (!alleElementDatenObj) {
      console.error(`Could not load elements data for PSE.`);
      pseElem.innerHTML = "";

      const errorIcon = lucide.createElement(lucide.OctagonX);
      errorIcon.classList.add("icon-error");
      const errorText = document.createElement("span");
      errorText.innerHTML = `Das Periodensystem konnte nicht geladen werden.`;

      pseElem.append(errorIcon);
      pseElem.append(errorText);
      pseElem.style.display = "block"
      return;
    }

    const alleElementeObj = alleElementDatenObj.elements;



    const smallPseElem = document.createElement("nav");
    smallPseElem.id = "pse-container-small";
    const pseHauptgruppenElem = document.createElement("div");
    pseHauptgruppenElem.id = "hauptgruppen";
    const pseNebengruppenElem = document.createElement("div");
    pseNebengruppenElem.id = "nebengruppen";
    const pseLanthanoideActinoideElem = document.createElement("div");
    pseLanthanoideActinoideElem.id = "lanthanoide-actinoide";

    for (let key in alleElementeObj) {
      // const wrapperLink = document.createElement("a");
      const elementElem = document.createElement("a");
      const atommasseElem = document.createElement("div");
      const ordnungszahlElem = document.createElement("div");
      const elementsymbolElem = document.createElement("div");
      const elementnameElem = document.createElement("div");

      const isLocal = new URL(document.baseURI).host.includes('localhost');
      elementElem.href = isLocal ? `http://localhost:3000/${replaceUmlauts(alleElementeObj[key].elementname)}.html` : `https://p-seminar.schinkennugget.dev/${replaceUmlauts(alleElementeObj[key].elementname)}.html`;
      elementElem.title = alleElementeObj[key].elementname;

      const elementsymbolTextElem = document.createElement("span")
      elementsymbolTextElem.classList.add("pse-item-elementsymbol-text");
      elementsymbolTextElem.innerText = alleElementeObj[key].elementsymbol
      elementsymbolElem.append(elementsymbolTextElem);
      ordnungszahlElem.innerHTML = alleElementeObj[key].ordnungszahl;
      atommasseElem.innerHTML = Number(alleElementeObj[key].atommasse).toLocaleString('de-DE', { maximumSignificantDigits: 3 });
      elementnameElem.innerHTML = alleElementeObj[key].elementname;
      elementsymbolElem.classList.add("pse-item-elementsymbol");
      ordnungszahlElem.classList.add("pse-item-ordnungszahl");
      atommasseElem.classList.add("pse-item-atommasse");
      elementnameElem.classList.add("pse-item-elementname");


      if ([
          "h", "li", "na", "k", "rb", "cs", "fr", "be", "mg", "ca", "sr", "ba", "ra",
          "b", "al", "ga", "in", "tl", "nh", "c", "si", "ge", "sn", "pb", "fl",
          "n", "p", "as", "sb", "bi", "mc", "o", "s", "se", "te", "po", "lv",
          "f", "cl", "br", "i", "at", "ts", "he", "ne", "ar", "kr", "xe", "rn", "og"
        ].includes(key)) {
        elementElem.classList.add("hauptgruppe");
      } else if ([
          "la", "ce", "pr", "nd", "pm", "sm", "eu", "gd", "tb", "dy", "ho", "er",
          "tm", "yb", "ac", "th", "pa", "u", "np", "pu", "am", "cm", "bk",
          "cf", "es", "fm", "md", "no", "lu", "lr"
        ].includes(key)) {
        elementElem.classList.add("lanthanoid-actinoid");
      } else {
        elementElem.classList.add("nebengruppe");
      }

      elementElem.append(atommasseElem);
      elementElem.append(ordnungszahlElem);
      elementElem.append(elementsymbolElem);
      elementElem.append(elementnameElem);
      elementElem.style.gridArea = key;
      elementElem.classList.add("pse-item");
      const bgColorName = alleElementeObj[key]?.additional_data?.background_color ?? "lightgrey";
      const bgTinyColor = tinycolor(bgColorName);
      elementElem.style.backgroundColor = bgColorName;
      elementElem.classList.add(bgTinyColor.isDark() ? "light-text" : "dark-text");

      if (["zn", "s", "mg", "cu", "h"].includes(key)) elementElem.classList.add("has-content");


      if (alleElementeObj[key]?.additional_data?.kuenstlich) {
        elementsymbolTextElem.classList.add("outlined");
        elementsymbolTextElem.style.color = bgColorName;
        elementsymbolTextElem.style.fontWeight = "600";
      }

      if (alleElementeObj[key]?.additional_data?.radioaktiv) {
        const radioaktivIcon = document.createElement("span");
        radioaktivIcon.classList.add("pse-item-radioaktiv");
        radioaktivIcon.innerText = "*";
        elementsymbolElem.append(radioaktivIcon);
      }

      pseElem.append(elementElem);



      // Kleinste Ansicht: Braucht verschiedene Grid-Container, damit alle gleich breit sind
      const clonedElementElem = elementElem.cloneNode(true);

      // lu/lr ist in der kleinen ansicht in der nebengruppe, damit kein loch da ist
      if (key == "lu" || key == "lr") {
        clonedElementElem.classList.remove("lanthanoid-actinoid");
        clonedElementElem.classList.add("nebengruppe");
      }
      if (clonedElementElem.classList.contains("hauptgruppe")) {
        pseHauptgruppenElem.append(clonedElementElem);
      } else if (clonedElementElem.classList.contains("lanthanoid-actinoid")) {
        pseLanthanoideActinoideElem.append(clonedElementElem);
      } else {
        pseNebengruppenElem.append(clonedElementElem);
      }
    }
    pseElem.innerHTML += `<div class="pse-item" id="pse-item-lanthanoide" style="grid-area: lx; display: none;">
      <div class="pse-item-elementsymbol" style="letter-spacing: -1px;">La-Lu</div>
      <div class="pse-item-atommasse" hidden></div>
      <div class="pse-item-ordnungszahl">57-71</div>
      <div class="pse-item-elementname">Lanthanoide</div>
    </div>
    <div class="pse-item" id="pse-item-actinoide" style="grid-area: ax; display: none;">
      <div class="pse-item-elementsymbol" style="letter-spacing: -1px;">Ac-Lr</div>
      <div class="pse-item-atommasse" hidden></div>
      <div class="pse-item-ordnungszahl">89-103</div>
      <div class="pse-item-elementname">Actinoide</div>
    </div>`;

    smallPseElem.append(pseHauptgruppenElem);
    smallPseElem.append(pseNebengruppenElem);
    smallPseElem.append(pseLanthanoideActinoideElem);
    smallPseElem.hidden = true;
    pseElem.after(smallPseElem);

  } catch (err) {
    console.error(`${err.name} at ${err.lineNumber ?? "?"}:${err.columnNumber ?? "?"}\n${err.message}`);

    const pseElem = document.getElementById("pse-container");
    if (!pseElem) return;

    pseElem.innerHTML = "";
    const errorIcon = lucide?.createElement(lucide.OctagonAlert) || "";
    errorIcon.classList.add("icon-error");
    const errorText = document.createElement("span");
    errorText.innerHTML = `Das Periodensystem konnte nicht geladen werden. (<code>${err.name} at ${err.lineNumber ?? "?"}:${err.columnNumber ?? "?"}: ${err.message}</code>)`;

    pseElem.append(errorIcon);
    pseElem.append(errorText);
    pseElem.style.display = "block";
  }
}



export async function insertDatenIntoGrafik(elementName) {
  try {
    const elementObj = await findElementWithName(elementName);
    const grafikEl = document.getElementById("daten-grafik");

    if (!elementObj) {
      console.error(`Kein Element mit dem Namen "${elementName}" gefunden.`);
      return;
    }

    grafikEl.innerHTML = "";
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
        if (key == "elektronegativitaet" && elementObj.additional_data.elektronegativitaet_oxidationszahl) {
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

        //Beim Ionenradius muss der Wert zusammengesetzt werden aus Radius und Ladung/Oxidationszahl
      } else if (
        key == "ionenradius" &&
        elementObj.additional_data.ionenradius_ladung
      ) {
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

    listeEl.innerHTML = "";
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
      datenName: "Mittlere Atommasse (Massenzahl)",
      info: "Die Atommasse beschreibt, wie schwer ein einzelnes Atom ist. Sie wird in der Einheit u (atomare Masseneinheit) angegeben, da Gramm für Atome viel zu groß wären (1 u = 1,7 • 10<sup>-27</sup> kg). Die Massezahl wiederum zählt einfach die Gesamtzahl der schweren Bausteine (Protonen und Neutronen) im Atomkern zusammen."
    });

    addListenElement({
      icon: "Atom",
      key: "atomradius",
      datenName: "Atomradius",
      info: "Der Atomradius zeigt die Größe eines Atoms, gemessen von der Mitte des Kerns bis zum Rand der Teilchenhülle. Da Atome winzig sind, nutzt man die Einheit pm (Pikometer). Ein Pikometer ist der billionste Teil eines einzelnen Meters."
    });

    addListenElement({
      icon: "Radius",
      key: "ionenradius",
      datenName: "Ionenradius",
      info: "Wenn ein Atom Elektronen aufnimmt oder abgibt, wird es zu einem geladenen Ion und verändert seine Größe. Die Ladung ist die hochgestellte Zahl. Der Ionenradius misst diese neue Größe in Pikometer (pm)."
    });

    addListenElement({
      icon: "ThermometerSun",
      key: "siedepunkt",
      datenName: "Siedepunkt",
      info: "Die Temperatur, bei der der Stoff vom flüssigen zum gasförmigen Aggregatzustand übergeht."
    });

    addListenElement({
      icon: "ThermometerSnowflake",
      key: "schmelzpunkt",
      datenName: "Schmelzpunkt",
      info: "Die Temperatur, bei der der Stoff vom festen zum flüssigen Aggregatzustand übergeht."
    });

    addListenElement({
      icon: "Zap",
      key: "ionisierungsenergie",
      datenName: "1. Ionisierungsenergie",
      info: "Die Energie, die man braucht, um einem Atom sein erstes (am leichtesten zu entfernendes) Elektron wegzunehmen. Dadurch entsteht ein positiv geladenes Teilchen."
    });

    addListenElement({
      icon: "FoldHorizontal",
      key: "dichte",
      datenName: "Dichte"
    });

    addListenElement({
      icon: "CircleMinus",
      key: "elektronegativitaet",
      datenName: "Elektronegativität (für Oxidationszahl)",
      info: "Beschreibt, wie stark ein Atom in einer Verbindung andere Bindungselektronen „an sich zieht“. Je höher der Wert, desto stärker die Anziehungskraft."
    });

    addListenElement({
      icon: "ChartPie",
      key: "anteil_haeufigstes_isotop",
      datenName: "Anteil des häufigsten Isotops",
      info: "Atome desselben Elements können unterschiedlich viele Neutronen im Kern haben; diese Varianten heißen Isotope. Der Prozentwert hier gibt an, wie groß der Anteil der am häufigsten in der Natur vorkommenden Variante eines Elements im Vergleich zu den selteneren Versionen ist."
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
        if (!element[key].additional_data) {
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


function replaceUmlauts(string) {
  let value = string;
  value = string.toLowerCase();
  value = value.replace(/ä/g, 'ae');
  value = value.replace(/ö/g, 'oe');
  value = value.replace(/ü/g, 'ue');
  value = value.replace(/ß/g, 'ss');
  return value;
}


// async function bla() {
//   try {
//     const alleElementeObj = await loadElemente();
//     const elemente = await alleElementeObj.elements;
//     let text = "";

//     setTimeout(() => {
//       for (let element in elemente) {
//         text += `case (${element.elementsymbol} || ${element.elementsymbol}.html) {
//       window.location.pathname = "${""}.html" + window.location.search + window.location.hash;
//     }
//     `;
//       }
//       console.log(text);
//     }, 2000);
//   } catch (error) {
//     console.log(error.name + error.message)
//   }
// }