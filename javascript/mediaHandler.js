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
    fullscreenContainerEl.id = "fullscreen-media-container";

    fullscreenContainerEl.innerHTML = `
    <div id="fullscreen-icons"></div>
    <div id="fullscreen-media-wrapper">
    </div>
    <div id="fullscreen-media-footer">
      <div id="fullscreen-media-description">
        <em>Keine Beschreibung verfügbar</em>
      </div>
      <div id="fullscreen-media-license">
        <strong>Titel:</strong> <span id="fullscreen-media-license-title"></span>&emsp;
        <strong>Autor:</strong> <span id="fullscreen-media-license-author"></span>&emsp;
        <strong>Quelle:</strong> <span id="fullscreen-media-license-source"></span>&emsp;
        <strong>Lizenz:</strong> <span id="fullscreen-media-license-license"></span>
      </div>
      <span hidden id="load-resolution">Höchste Auflösung laden</span>
    </div>`;

    // Icons zum Vergrößern / Schließen
    const iconCloseEl = lucide.createElement(lucide.X);
    const iconMaximizeEl = lucide.createElement(lucide.Maximize);
    const iconMinimizeEl = lucide.createElement(lucide.Minimize);
    iconCloseEl.onclick = closeTextMediaFullscreen;
    iconMinimizeEl.style.display = "none";
    iconMinimizeEl.classList.add("fullscreen-media-minmax-icon")
    iconMaximizeEl.classList.add("fullscreen-media-minmax-icon")

    const wrapperEl = fullscreenContainerEl.querySelector("#fullscreen-media-wrapper")
    new ResizeObserver(fitMedia).observe(wrapperEl);

    iconMaximizeEl.onclick = () => {
      const fullscreenMedia = document.querySelector("#fullscreen-media");

      if (fullscreenMedia.tagName == "VIDEO") {
        if (fullscreenMedia.requestFullscreen) {
          fullscreenMedia.requestFullscreen();
        } else if (fullscreenMedia.mozRequestFullScreen) { /* Firefox */
          fullscreenMedia.mozRequestFullScreen();
        } else if (fullscreenMedia.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          fullscreenMedia.webkitRequestFullscreen();
        } else if (fullscreenMedia.msRequestFullscreen) { /* IE/Edge */
          fullscreenMedia.msRequestFullscreen();
        }
      } else {
        iconMaximizeEl.style.display = "none";
        iconMinimizeEl.style.display = "";
        maximized = true;
      }
      fitMedia(wrapperEl);
    };
    iconMinimizeEl.onclick = () => {
      iconMaximizeEl.style.display = "";
      iconMinimizeEl.style.display = "none";
      maximized = false;
      fitMedia(wrapperEl);
    };

    fullscreenContainerEl.querySelector("#fullscreen-icons").append(iconMinimizeEl, iconMaximizeEl, iconCloseEl);

    // Icons zum Weiterklicken
    const nextIconEl = lucide.createElement(lucide.ChevronRight);
    const backIconEl = lucide.createElement(lucide.ChevronLeft);
    nextIconEl.id = "fullscreen-media-control-icon-next";
    backIconEl.id = "fullscreen-media-control-icon-back";
    nextIconEl.classList.add("fullscreen-media-control-icon");
    backIconEl.classList.add("fullscreen-media-control-icon");
    fullscreenContainerEl.append(nextIconEl, backIconEl);

    mainEl.after(fullscreenContainerEl);



    // Einstellungen für die kleinen Bilder
    document.querySelectorAll(".text-media-wrapper").forEach(async wrapperElem => {
      const mediaElem = wrapperElem.querySelector("img, video")
      const isVideo = mediaElem.tagName == "VIDEO";
      if (!isVideo) {
        wrapperElem.addEventListener("click", () => {
          openTextMediaFullscreen();
          loadMediaIntoFullscreen(mediaElem);
        });

        // Icon in jedem Bild
        const enlargeIcon = lucide.createElement(lucide.Maximize2);
        enlargeIcon.classList.add("text-media-enlarge-icon");
        wrapperElem.append(enlargeIcon);

        // Schließen mit Escape
        window.addEventListener("keydown", event => {
          if (
            window.getComputedStyle(fullscreenContainerEl).display !== "none" &&
            event.key === "Escape"
          ) {
            closeTextMediaFullscreen();
          }
        });
      }

      // Lizenz laden
      injectLicense(mediaElem);

      // Schließen durch Klicken auf Hintergrund
      fullscreenContainerEl.addEventListener("click", event => {
        if (
          event.target === fullscreenContainerEl ||
          event.target.id === "fullscreen-media-wrapper"
        ) {
          closeTextMediaFullscreen();
        }
      });
    });
    // setTimeout(() => console.log(fullscreenContainerEl.outerHTML), 2000);
  } catch (error) {
    console.error(error.name + ": " + error.message)
  }
}


function openTextMediaFullscreen() {
  const contEl = document.getElementById("fullscreen-media-container");
  contEl.style.display = "grid";
  requestAnimationFrame(() => {
    contEl.style.opacity = "1";
    contEl.style.backdropFilter = "blur(40px)";
  });
}

function closeTextMediaFullscreen() {
  const contEl = document.getElementById("fullscreen-media-container");
  const mediaEl = document.getElementById("fullscreen-media");

  contEl.style.opacity = "0";
  contEl.style.backdropFilter = "blur(0)";

  contEl.addEventListener("transitionend", function handler() {
    contEl.style.display = "none";
    mediaEl?.remove(); // sicher auch wenn kein Bild geladen wurde
    contEl.removeEventListener("transitionend", handler);
  });
}




function loadMediaIntoFullscreen(smallmediaElem) {
  if (!smallmediaElem) return;

  const isVideo = smallmediaElem.tagName == "VIDEO";
  const allMedia = [...document.querySelectorAll(".text-media-small img, .text-media-large img, .text-media-small video, .text-media-large video")];
  const currentIndex = allMedia.indexOf(smallmediaElem);
  const backIcon = document.querySelector("#fullscreen-media-control-icon-back");
  const nextIcon = document.querySelector("#fullscreen-media-control-icon-next");
  const contEl = document.getElementById("fullscreen-media-container");
  const wrapperEl = document.getElementById("fullscreen-media-wrapper");

  // Vorherige Event-Handler und Bild entfernen
  document.querySelector("#fullscreen-media")?.remove();
  window.removeEventListener("keydown", arrowLeftEventHandler)
  window.removeEventListener("keydown", arrowRightEventHandler);

  // sizes groß machen, damit die höhere Qualität geladen werden kann
  if (smallmediaElem.sizes) smallmediaElem.sizes = "100vw";
  const fullscreenMediaEl = smallmediaElem.cloneNode();
  fullscreenMediaEl.id = "fullscreen-media";
  fullscreenMediaEl.classList.remove("text-media-small", "text-media-large");

  wrapperEl.append(fullscreenMediaEl);

  // Funktion für Pfeil-Icons (nächstes/vorheriges Bild) & Pfeiltasten
  if (currentIndex === -1) {
    console.warn("loadMediaIntoFullscreen: Bild nicht in der Liste gefunden.");
  }

  // Zurück
  if (currentIndex > 0) {
    backIcon.classList.add("enabled");
    backIcon.onclick = () => loadMediaIntoFullscreen(allMedia[currentIndex - 1]);
    window.addEventListener("keydown", arrowLeftEventHandler);
  } else {
    backIcon.classList.remove("enabled");
    backIcon.onclick = null;
  }

  // Vor
  if (currentIndex < allMedia.length - 1) {
    nextIcon.classList.add("enabled");
    nextIcon.onclick = () => loadMediaIntoFullscreen(allMedia[currentIndex + 1]);
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
      loadMediaIntoFullscreen(allMedia[currentIndex - 1]);
    }
  }

  function arrowRightEventHandler(event) {
    if (event.key === "ArrowRight" && event.altKey && contEl.style.display != "none") {
      window.removeEventListener("keydown", arrowLeftEventHandler);
      window.removeEventListener("keydown", arrowRightEventHandler);
      loadMediaIntoFullscreen(allMedia[currentIndex + 1]);
    }
  }

  fitMedia(wrapperEl);


  // Beschreibung laden
  const descriptionEl = document.querySelector("#fullscreen-media-description");
  const description = smallmediaElem.alt?.trim();
  const fallback = smallmediaElem.nextElementSibling?.innerHTML;

  descriptionEl.innerHTML = description || fallback || "<em>Keine Beschreibung verfügbar</em>";

  // Lizenz laden
  document.querySelector("#fullscreen-media-license-title").innerHTML = smallmediaElem.dataset.title || "<em>unbekannt</em>";
  document.querySelector("#fullscreen-media-license-author").innerHTML = smallmediaElem.dataset.author || "<em>unbekannt</em>";
  document.querySelector("#fullscreen-media-license-source").innerHTML = smallmediaElem.dataset.source || "<em>unbekannt</em>";
  document.querySelector("#fullscreen-media-license-license").innerHTML = smallmediaElem.dataset.license || "<em>unbekannt</em>";

  // Volle Auflösung laden
  if (fullscreenMediaEl.srcset) {
    document.querySelector("#load-resolution").hidden = false;
    document.querySelector("#load-resolution").onclick = () => {
      const srcset = smallmediaElem.srcset;
      if (!srcset) return;

      const entries = srcset.split(',').map(entry => {
        const [url, descriptor] = entry.trim().split(/\s+/);
        const width = descriptor ? parseInt(descriptor) : 0;
        return { url, width };
      });

      entries.sort((a, b) => b.width - a.width);

      fullscreenMediaEl.src = smallmediaElem.src = entries[0].url;
      fullscreenMediaEl.srcset = smallmediaElem.srcset = "";

      document.querySelector("#load-resolution").hidden = true;

    }
  } else {
    document.querySelector("#load-resolution").hidden = true;
  }

}

// Bildgröße anpassen
function fitMedia(container) {
  if (!container?.querySelector?.("img, video")) return;

  const media = container.querySelector("img, video");
  const footer = document.querySelector("#fullscreen-media-footer");

  if (media.complete) {

    footer.style.display = maximized ? "none" : "block";
    document.querySelector("#fullscreen-media-container").style.padding = maximized ? "50.5px 0 0 0" : "";

    const mediaRatio = media.naturalWidth / media.naturalHeight;
    const containerRatio = container.clientWidth / container.clientHeight;
    if (maximized) {
      container.style.display = "block";
      if (mediaRatio >= containerRatio) {
        // Bild breiter als der Container (z.B. Bild 16/9, cont 4/3) -> 
        // Höhe auf 100%
        media.style.maxHeight = "none";
        media.style.maxWidth = "none"
        media.style.width = "auto";
        media.style.height = "100%";
      } else {
        media.style.maxHeight = "none";
        media.style.maxWidth = "none"
        media.style.width = "100%";
        media.style.height = "auto";
      }
    } else {
      container.style.display = "";
      media.style.maxHeight = "";
      media.style.maxWidth = ""
      media.style.width = "";
      media.style.height = "";
    }


  } else {
    media.addEventListener('load', () => {
      // alert("loaded");
      fitMedia(container);
    }, { once: true });
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
    let source = elem.dataset.source ? `<a href="${elem.src}">${elem.dataset.source}</a>` : "";
    // Sollte im Attribut schon als <a> stehen
    let license = elem.dataset.license || "";

    const mediaSrc = elem.src;

    // Information von WikiMedia abrufen
    if (new URL(mediaSrc).hostname === "upload.wikimedia.org") {
      const filename = "File:" + decodeURIComponent(mediaSrc.split("/").pop()); // exakter Name auf Commons

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