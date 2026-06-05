"use strict";

let enlarged = false;

export function initialize() {
  // Container für Fullscreen in Dokument einfügen
  const fullscreenContainerEl = document.createElement("div");
  fullscreenContainerEl.id = "fullscreen-img-container";

  fullscreenContainerEl.innerHTML = `
  <div id="fullscreen-icons"></div>
  <div id="fullscreen-img-wrapper">

    </div>

    <div id="fullscreen-img-footer">
      <div id="fullscreen-img-description">
      </div>
      <div id="fullscreen-img-license">
        <span id="fullscreen-img-license-title"><strong>Titel:</strong> </span>&emsp;
        <span id="fullscreen-img-license-author"><strong>Autor:</strong> eörkfjbwlurifvbwurfibvw ufvnerifu vrfbh eriufberliufbe hribherliufb elruifb el riufbheriuf bherliuheriberlib uerh fiub her libuher</span>&emsp;
        <span id="fullscreen-img-license-source"><strong>Quelle:</strong> <a></a></span>&emsp;
        <span id="fullscreen-img-license-license"><strong>Lizenz:</strong> <a></a></span>
      </div>
    </div>`;

  // Icons zum Vergrößern / Schließen
  const iconCloseEl = lucide.createElement(lucide.X);
  const iconMaximizeEl = lucide.createElement(lucide.Maximize);
  const iconMinimizeEl = lucide.createElement(lucide.Minimize);
  iconCloseEl.onclick = closeTextImgFullscreen;
  iconMaximizeEl.onclick = maximizeImg;
  iconMinimizeEl.onclick = minimizeImg;
  iconMinimizeEl.style.display = "none";
  iconMaximizeEl.style.color = "gray"; // Deaktiviert
  fullscreenContainerEl.querySelector("#fullscreen-icons").append(iconMinimizeEl, iconMaximizeEl, iconCloseEl);

  // Icons zum Weiterklicken
  const nextIconEl = lucide.createElement(lucide.ChevronRight);
  const backIconEl = lucide.createElement(lucide.ChevronLeft);
  nextIconEl.id = "fullscreen-img-control-icon-next";
  backIconEl.id = "fullscreen-img-control-icon-back";
  nextIconEl.classList.add("fullscreen-img-control-icon");
  backIconEl.classList.add("fullscreen-img-control-icon");
  fullscreenContainerEl.querySelector("#fullscreen-img-wrapper").append(nextIconEl, backIconEl);

  document.querySelector("main").after(fullscreenContainerEl);


  // Einstellungen für die kleinen Bilder
  document.querySelectorAll(".text-img-small, .text-img-large").forEach(elem => {
    // Event Listener für jedes eigene Bild
    elem.querySelectorAll("img").forEach(imgElem => {
      imgElem.addEventListener("click", event => {
        openTextImgFullscreen();
        loadImgIntoFullscreen(imgElem);
      });
    });

    // Icon in jedem Bild
    const enlargeIcon = lucide.createElement(lucide.Maximize2);
    enlargeIcon.classList.add("text-img-enlarge-icon");
    elem.append(enlargeIcon);
  });

  // Schließen mit esc
  window.addEventListener("keydown", event => {
    if (window.getComputedStyle(fullscreenContainerEl).display !== "none" && event.key === "Escape") {
      closeTextImgFullscreen();
    }
  });

  // Schließen durch Klicken auf Hintergrund
  fullscreenContainerEl.addEventListener("click", event => {
    if (event.target === fullscreenContainerEl || event.target.id === "fullscreen-img-wrapper") closeTextImgFullscreen();
  });
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
    imgEl.remove();
    contEl.removeEventListener("transitionend", handler);
  });
}

function loadImgIntoFullscreen(elem) {
  // eventuelle vorherige imgs und event handler löschen
  document.querySelector("#fullscreen-img")?.remove();
  window.removeEventListener("keydown", arrowLeftEventHandler)
  window.removeEventListener("keydown", arrowRightEventHandler);

  // sizes groß machen, damit die höhere Qualität geladen werden kann
  elem.sizes = "100vw";
  const fullscreenImgEl = elem.cloneNode();
  fullscreenImgEl.id = "fullscreen-img";
  fullscreenImgEl.classList.remove("text-img-small");
  fullscreenImgEl.classList.remove("text-img-large");

  const wrapperEl = document.getElementById("fullscreen-img-wrapper");
  const contEl = document.getElementById("fullscreen-img-container");
  wrapperEl.append(fullscreenImgEl);

  // Funktion für Pfeil-Icons (nächstes/vorheriges Bild) & Pfeiltasten
  const allImgs = document.querySelectorAll(".text-img-small img, .text-img-large img");
  // Nummer vom aktuell geöffneten Bild
  let currentIndex;
  for (let i = 0; i < allImgs.length; i++) {
    if (allImgs[i] === elem) {
      currentIndex = i;
    }
  }

  // Event Handler für alt + links
  function arrowLeftEventHandler() {
    if (event.key === "ArrowLeft" && event.altKey &&
      contEl.style.display != "none") {
      loadImgIntoFullscreen(allImgs[currentIndex - 1]);
      window.removeEventListener("keydown", arrowLeftEventHandler);
    }
  }

  function arrowRightEventHandler() {
    if (event.key === "ArrowRight" && event.altKey &&
      contEl.style.display != "none") {
      loadImgIntoFullscreen(allImgs[currentIndex + 1]);
      window.removeEventListener("keydown", arrowRightEventHandler);
    }
  }

  const backIcon = document.querySelector("#fullscreen-img-control-icon-back");
  const nextIcon = document.querySelector("#fullscreen-img-control-icon-next");

  if (currentIndex > 0) {
    backIcon.classList.remove("disabled");
    backIcon.onclick = () => {
      loadImgIntoFullscreen(allImgs[currentIndex - 1]);
    }
    window.addEventListener("keydown", arrowLeftEventHandler);
  } else {
    backIcon.classList.add("disabled");
  }

  if (currentIndex < allImgs.length - 1) {
    nextIcon.classList.remove("disabled");
    nextIcon.onclick = () => {
      loadImgIntoFullscreen(allImgs[currentIndex + 1]);
    }
    window.addEventListener("keydown", arrowRightEventHandler);
  } else {
    nextIcon.classList.add("disabled");
  }
}

function maximizeImg() {

}

function minimizeImg() {

}