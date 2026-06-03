"use strict";
// Event Listener für expandable
export function addClickListener() {
  try {
    document.querySelectorAll(".expandable-header").forEach(elem => {
      elem.addEventListener("click", toggleExpandable);

      //Damit es am Anfang schon mal gesetzt ist und nicht in HTML jedes mal eingefügt werden muss
      // Default mäßig an
      if (elem.parentElement.dataset.bghover !== "false") elem.classList.add("on-hover-bg-highlight");
    });
  } catch (err) {
    console.error(`Event Listener for expandable could not be registered.\nError: ${err.name}\nMessage: ${err.message}`)
  }
}





export function toggleExpandable(event) {
  const expandableHeaderEl = event.currentTarget;
  const expandableContainerEl = expandableHeaderEl.parentElement;
  const expandableContentEl = expandableContainerEl.querySelector(".expandable-content");
  const doBackgroundHover = Boolean(JSON.parse(expandableContainerEl.dataset.bghover ?? "true")); // Default an
  const ANIMATION_DURATION_DIVIDER = 2500; // Höher = kürzere Animation

  // Laufende Transition sofort abbrechen
  expandableContentEl.style.transition = "none";
  void expandableContentEl.offsetHeight; // Reflow erzwingen
  const currentHeight = expandableContentEl.offsetHeight; // Aktuellen Zwischenstand einfrieren
  expandableContentEl.style.height = currentHeight + "px";

  // Alten transitionend-Handler entfernen
  const oldHandler = expandableContentEl._transitionHandler;
  if (oldHandler) {
    expandableContentEl.removeEventListener("transitionend", oldHandler);
    delete expandableContentEl._transitionHandler;
  }

  const shouldExpand = !Boolean(JSON.parse(expandableContainerEl.dataset.expanded));
  expandableContainerEl.dataset.expanded = JSON.stringify(shouldExpand);

  if (shouldExpand) {
    if (doBackgroundHover) expandableHeaderEl.classList.remove("on-hover-bg-highlight");
    expandableContentEl.style.display = "";
    expandableContentEl.style.overflow = "hidden";

    const targetHeight = expandableContentEl.scrollHeight;
    const duration = Math.abs(targetHeight - currentHeight) / ANIMATION_DURATION_DIVIDER;

    requestAnimationFrame(() => {
      expandableContentEl.style.transition = `height ${duration}s ease`;
      expandableContentEl.style.height = targetHeight + "px";
    });

    const handler = function() {
      expandableContentEl.style.height = "auto";
      expandableContentEl.style.overflow = "";
      expandableContentEl.removeEventListener("transitionend", handler);
      delete expandableContentEl._transitionHandler;
    };
    expandableContentEl._transitionHandler = handler;
    expandableContentEl.addEventListener("transitionend", handler);

    expandableContainerEl.querySelector(".expandable-header-icon").style.rotate = "-180deg";

  } else {
    void expandableContentEl.offsetHeight; // Reflow erzwingen
    expandableContentEl.style.overflow = "hidden";

    const duration = Math.abs(currentHeight) / ANIMATION_DURATION_DIVIDER;

    // requestAnimationFrame(() => {
    expandableContentEl.style.transition = `height ${duration}s cubic-bezier(.59,0,.59,.81)`;
    expandableContentEl.style.height = "0";
    // });

    const handler = function() {
      expandableContentEl.style.display = "none";
      expandableContentEl.style.overflow = "";
      if (doBackgroundHover) expandableHeaderEl.classList.add("on-hover-bg-highlight");
      expandableContentEl.removeEventListener("transitionend", handler);
      delete expandableContentEl._transitionHandler;
    };
    expandableContentEl._transitionHandler = handler;
    expandableContentEl.addEventListener("transitionend", handler);

    expandableContainerEl.querySelector(".expandable-header-icon").style.rotate = "";
  }
}



function datenElementHoverOn(event) {
  const hoverEl = event.currentTarget;
  const hoverDataType = hoverEl.dataset.datatype;

  //der datatype ist der key des elements, zb elementname oder atommasse
  document.querySelectorAll(".daten-" + hoverDataType).forEach(elem => {
    elem.classList.add("daten-on-hover");
  });
  if (hoverEl.tagName === "TR") {
    hoverEl.classList.add("daten-liste-elem-on-hover");
  }

  function removeDatenHover() {
    document.querySelectorAll(".daten-" + hoverDataType).forEach(elem => {
      elem.classList.remove("daten-on-hover");
      elem.classList.remove("daten-liste-elem-on-hover");
    });
  }

  // Maus: einfach pointerleave nutzen
  if (event.pointerType === "mouse") {
    hoverEl.addEventListener("pointerleave", removeDatenHover, {
      once: true
    });
    return;
  }

  // Touch/Pen: pointermove auf window, aber erst nach einem kurzen Delay,
  // damit das auslösende Event selbst nicht direkt triggert
  function onPointerMove(e) {
    if (e.target !== hoverEl && !hoverEl.contains(e.target)) {
      removeDatenHover();
      window.removeEventListener("pointerover", onPointerMove);
    }
  }

  setTimeout(() => {
    window.addEventListener("pointerover", onPointerMove);
  }, 0);
}

export function addDatenHoverEventListener() {
  // const seen = new WeakSet();

  const observer = new MutationObserver(() => {
    document.querySelectorAll(".daten-element > *").forEach(element => {
      element.addEventListener("pointerenter", datenElementHoverOn);
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}