"use strict";

// Sorry, der Code hier ist komplett schlimm

let maximized = false;

export async function initialize() {
  try {
    const mainEl = document.querySelector("main");
    if (!mainEl) {
      console.warn("Fullscreen Media could not be initialized: No <main>-element found.");
      return;
    }

    // Container für Fullscreen in Dokument einfügen
    const fullscreenContainerEl = document.createElement("div");
    fullscreenContainerEl.id = "fullscreen-img-container";

    fullscreenContainerEl.innerHTML = `
    <div id="fullscreen-icons"></div>
    <div id="fullscreen-img-wrapper">
    </div>
    <div id="fullscreen-img-footer">
      <div id="fullscreen-img-description">
        <em>Keine Beschreibung verfügbar</em>
      </div>
      <div id="fullscreen-img-license">
        <strong>Titel:</strong> <span id="fullscreen-img-license-title"></span>&emsp;
        <strong>Autor:</strong> <span id="fullscreen-img-license-author"></span>&emsp;
        <strong>Quelle:</strong> <span id="fullscreen-img-license-source"></span>&emsp;
        <strong>Lizenz:</strong> <span id="fullscreen-img-license-license"></span>
      </div>
    </div>`;

    // Icons zum Vergrößern / Schließen
    const iconCloseEl = lucide.createElement(lucide.X);
    const iconMaximizeEl = lucide.createElement(lucide.Maximize);
    const iconMinimizeEl = lucide.createElement(lucide.Minimize);
    iconCloseEl.onclick = closeTextImgFullscreen;
    iconMinimizeEl.style.display = "none";

    const wrapperEl = fullscreenContainerEl.querySelector("#fullscreen-img-wrapper")
    new ResizeObserver(fitImage).observe(wrapperEl);

    iconMaximizeEl.onclick = () => {
      iconMaximizeEl.style.display = "none";
      iconMinimizeEl.style.display = "";
      maximized = true;
      fitImage(wrapperEl);
    };
    iconMinimizeEl.onclick = () => {
      iconMaximizeEl.style.display = "";
      iconMinimizeEl.style.display = "none";
      maximized = false;
      fitImage(wrapperEl);
    };

    fullscreenContainerEl.querySelector("#fullscreen-icons").append(iconMinimizeEl, iconMaximizeEl, iconCloseEl);

    // Icons zum Weiterklicken
    const nextIconEl = lucide.createElement(lucide.ChevronRight);
    const backIconEl = lucide.createElement(lucide.ChevronLeft);
    nextIconEl.id = "fullscreen-img-control-icon-next";
    backIconEl.id = "fullscreen-img-control-icon-back";
    nextIconEl.classList.add("fullscreen-img-control-icon");
    backIconEl.classList.add("fullscreen-img-control-icon");
    fullscreenContainerEl.append(nextIconEl, backIconEl);

    mainEl.after(fullscreenContainerEl);



    // Einstellungen für die kleinen Bilder
    document.querySelectorAll(".text-img-wrapper").forEach(async wrapperElem => {
      const imgElem = wrapperElem.querySelector("img")
      wrapperElem.addEventListener("click", () => {
        openTextImgFullscreen();
        loadImgIntoFullscreen(imgElem);
      });

      // Icon in jedem Bild
      const enlargeIcon = lucide.createElement(lucide.Maximize2);
      enlargeIcon.classList.add("text-img-enlarge-icon");
      wrapperElem.append(enlargeIcon);


      // Lizenz laden
      injectLicense(imgElem);

      // Schließen mit Escape
      window.addEventListener("keydown", event => {
        if (
          window.getComputedStyle(fullscreenContainerEl).display !== "none" &&
          event.key === "Escape"
        ) {
          closeTextImgFullscreen();
        }
      });

      // Schließen durch Klicken auf Hintergrund
      fullscreenContainerEl.addEventListener("click", event => {
        if (
          event.target === fullscreenContainerEl ||
          event.target.id === "fullscreen-img-wrapper"
        ) {
          closeTextImgFullscreen();
        }
      });
    });
  } catch (error) {
    console.error(error.name + ": " + error.message)
  }
}


function openTextImgFullscreen() {
  const contEl = document.getElementById("fullscreen-img-container");
  contEl.style.display = "grid";
  requestAnimationFrame(() => {
    contEl.style.opacity = "1";
    contEl.style.backdropFilter = "blur(40px)";
  });
}

function closeTextImgFullscreen() {
  const contEl = document.getElementById("fullscreen-img-container");
  const imgEl = document.getElementById("fullscreen-img");

  contEl.style.opacity = "0";
  contEl.style.backdropFilter = "blur(0)";

  contEl.addEventListener("transitionend", function handler() {
    contEl.style.display = "none";
    imgEl?.remove(); // sicher auch wenn kein Bild geladen wurde
    contEl.removeEventListener("transitionend", handler);
  });
}




function loadImgIntoFullscreen(smallImgElem) {
  if (!smallImgElem) return;

  const allImgs = [...document.querySelectorAll(".text-img-small img, .text-img-large img")];
  const currentIndex = allImgs.indexOf(smallImgElem);
  const backIcon = document.querySelector("#fullscreen-img-control-icon-back");
  const nextIcon = document.querySelector("#fullscreen-img-control-icon-next");
  const contEl = document.getElementById("fullscreen-img-container");
  const wrapperEl = document.getElementById("fullscreen-img-wrapper");

  // Vorherige Event-Handler und Bild entfernen
  document.querySelector("#fullscreen-img")?.remove();
  window.removeEventListener("keydown", arrowLeftEventHandler)
  window.removeEventListener("keydown", arrowRightEventHandler);

  // sizes groß machen, damit die höhere Qualität geladen werden kann
  smallImgElem.sizes = "100vw";
  const fullscreenImgEl = smallImgElem.cloneNode();
  fullscreenImgEl.id = "fullscreen-img";
  fullscreenImgEl.classList.remove("text-img-small", "text-img-large");

  wrapperEl.append(fullscreenImgEl);



  // Funktion für Pfeil-Icons (nächstes/vorheriges Bild) & Pfeiltasten
  if (currentIndex === -1) {
    console.warn("loadImgIntoFullscreen: Bild nicht in der Liste gefunden.");
  }

  // Zurück
  if (currentIndex > 0) {
    backIcon.classList.add("enabled");
    backIcon.onclick = () => loadImgIntoFullscreen(allImgs[currentIndex - 1]);
    window.addEventListener("keydown", arrowLeftEventHandler);
  } else {
    backIcon.classList.remove("enabled");
    backIcon.onclick = null;
  }

  // Vor
  if (currentIndex < allImgs.length - 1) {
    nextIcon.classList.add("enabled");
    nextIcon.onclick = () => loadImgIntoFullscreen(allImgs[currentIndex + 1]);
    window.addEventListener("keydown", arrowRightEventHandler);
  } else {
    nextIcon.classList.remove("enabled");
    nextIcon.onclick = null;
  }

  // Event Handler für alt + links
  function arrowLeftEventHandler(event) {
    if (event.key === "ArrowLeft" && event.altKey && contEl.style.display != "none") {
      window.removeEventListener("keydown", arrowLeftEventHandler);
      window.removeEventListener("keydown", arrowRightEventHandler);
      loadImgIntoFullscreen(allImgs[currentIndex - 1]);
    }
  }

  function arrowRightEventHandler(event) {
    if (event.key === "ArrowRight" && event.altKey && contEl.style.display != "none") {
      window.removeEventListener("keydown", arrowLeftEventHandler);
      window.removeEventListener("keydown", arrowRightEventHandler);
      loadImgIntoFullscreen(allImgs[currentIndex + 1]);
    }
  }

  //fitImage(wrapperEl);


  // Beschreibung laden
  const descriptionEl = document.querySelector("#fullscreen-img-description");
  const description = smallImgElem.alt?.trim();
  const fallback = smallImgElem.nextElementSibling?.innerHTML;

  descriptionEl.innerHTML = description || fallback || "<em>Keine Beschreibung verfügbar</em>";

  // Lizenz laden
  document.querySelector("#fullscreen-img-license-title").innerHTML = smallImgElem.dataset.title || "<em>unbekannt</em>";
  document.querySelector("#fullscreen-img-license-author").innerHTML = smallImgElem.dataset.author || "<em>unbekannt</em>";
  document.querySelector("#fullscreen-img-license-source").innerHTML = smallImgElem.dataset.source || "<em>unbekannt</em>";
  document.querySelector("#fullscreen-img-license-license").innerHTML = smallImgElem.dataset.license || "<em>unbekannt</em>";

}

// Bildgröße anpassen
function fitImage(container) {
  if (!container?.querySelector?.("img")) return;

  const img = container.querySelector("img")

  if (!(img.complete && img.naturalWidth > 0 && img.naturalHeight)) {
    const containerRatio = container.clientWidth / container.clientHeight;
    console.log("container width: " + container.clientWidth + " height: " + container.clientHeight + "\nimg w: " + img.scrollWidth + " height: " + img.scrollHeight);
    const imgRatio = img.scrollWidth / img.scrollHeight;

    if (imgRatio > containerRatio && maximized || imgRatio < containerRatio && !maximized) {
      // Bild ist "breiter" als Container → Höhe ist der Engpass
      container.style.overflowY = maximized ? "auto" : "hidden"
      console.log(imgRatio + " in " + containerRatio + " mit maximized = " + maximized + ", höhe 100%")
      img.style.height = '100%';
      img.style.width = 'auto';
    } else {
      // Bild ist "schmaler" als Container → Breite ist der Engpass
      container.style.overflowX = maximized ? "auto" : "hidden"
      console.log(imgRatio + " in " + containerRatio + " mit maximized = " + maximized + ", breite 100%")
      img.style.width = '100%';
      img.style.height = 'auto';
    }
  } else {
    img.addEventListener('load', () => fitImage(container), { once: true });
  }
}

async function injectLicense(elem) {
  try {
    // Schauen, ob lizenz schon festgelegt wurde
    // Alles schon geladen
    if (elem.dataset.title && elem.dataset.author && elem.dataset.source && elem.dataset.license) {
      return;
    }

    // Nur einzelne Infos geladen
    let title = elem.dataset.title || "";
    let author = elem.dataset.author || "";
    let source = elem.dataset.source ? `<a href="${elem.src}">${elem.dataset.source}</a>"` : "";
    // Sollte im Attribut schon als <a> stehen
    let license = elem.dataset.license || "";

    const imgSrc = elem.src;

    // Information von WikiMedia abrufen
    if (new URL(imgSrc).hostname === "upload.wikimedia.org") {
      const filename = "File:" + decodeURIComponent(imgSrc.split("/").pop()); // exakter Name auf Commons

      const url = new URL("https://commons.wikimedia.org/w/api.php");
      url.searchParams.set("action", "query");
      url.searchParams.set("titles", filename);
      url.searchParams.set("prop", "imageinfo");
      url.searchParams.set("iiprop", "extmetadata"); // enthält Lizenz, Autor, etc.
      url.searchParams.set("format", "json");
      url.searchParams.set("origin", "*"); // CORS

      const response = await fetch(url);
      const data = await response.json();

      const pages = data.query.pages;
      const page = Object.values(pages)[0];
      if (!page.imageinfo) {
        console.warn("Lizenz eines Bilds konnte nicht von WikiMedia geladen werden, weil die src-URL ungültig ist (Auf der Vorschau vom Bild auf das Bild klicken und Link kopieren)");
        if (source == "") source = `<a href="${elem.src}">${elem.src}</a>`
        elem.dataset.source = source;
        return;
      }
      const meta = page.imageinfo[0].extmetadata;

      if (title == "") title = meta.ObjectName?.value;
      if (author == "") author = meta.Artist?.value;
      if (source == "") source = `<a href="${elem.src}">WikiMedia Commons</a>`
      if (license == "") license = `<a href="${meta.LicenseUrl?.value}">${meta.LicenseShortName?.value}</a>`;
    } else {
      // Wenn nur einzelne Informationen verfügbar sind
      console.warn("Lizenz von einem Bild unvollständig");
      // Quelle wurde nicht definiert und ist nicht Wikimedia
      if (source == "") source = `<a href="${elem.src}">${elem.src}</a>`;
    }

    elem.dataset.title = title;
    elem.dataset.author = author;
    elem.dataset.source = source;
    elem.dataset.license = license;
  } catch (err) {
    console.error("Could not load license information: " + err.name + ": " + err.message + " " + err?.lineNumber + ":" + err?.columnNumber);
  }
}