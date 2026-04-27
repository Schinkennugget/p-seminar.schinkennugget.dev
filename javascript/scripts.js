"use strict";


//if (localStorage.getItem("darkModeEnabled") === null) { 
//  localStorage.setItem("darkModeEnabled", JSON.stringify(false));
//}
const rootStyle = document.documentElement.style;

// Alle Farben
const bgBodyLight = "hsl(0 0 100)";
const bgElevatedLight = "hsl(0 0 95)";
const bgHighlightLight = "hsl(0 0 90)";
const bgNavbarLight = "rgba(248, 248, 255, 0.75)";
const bgNavbarSolidLight = "rgb(248, 248, 255)";
const textColorLight = "hsl(0 0 0)";
const mutedTextColorLight = "hsl(0 0 5)";
const linkColorLight = "#22d";
const linkHoverLight = "#00a";
const missingLinkLight = "#d11";
const missingLinkHoverLight = "#a00";
const shadowLight = "rgba(0, 0, 0, 0.2)";

const bgBodyDark = "hsl(0 0 0)";
const bgElevatedDark = "hsl(0 0 12)";
const bgHighlightDark = "hsl(0 0 20)";
const bgNavbarDark = "rgba(50, 50, 50, 0.75)";
const bgNavbarSolidDark = "rgb(50, 50, 50)";
const textColorDark = "hsl(0 0 95)";
const mutedTextColorDark = "hsl(0 0 90)";
const linkColorDark = "#66f";
const linkHoverDark = "#77f";
const missingLinkDark = "#e00"
const missingLinkHoverDark = "#f00";
const shadowDark = "rgba(0, 0, 0, 0.2)";

function enableDarkMode() {
  rootStyle.setProperty('--bg-body', bgBodyDark);
  rootStyle.setProperty('--bg-elevated', bgElevatedDark);
  rootStyle.setProperty('--bg-highlight', bgHighlightDark);
  rootStyle.setProperty('--bg-navbar', bgNavbarDark);
  rootStyle.setProperty('--bg-navbar-solid', bgNavbarSolidDark);
  rootStyle.setProperty('--text', textColorDark);
  rootStyle.setProperty('--text-muted', mutedTextColorDark);
  rootStyle.setProperty('--link-color', linkColorDark);
  rootStyle.setProperty('--link-hover', linkHoverDark);
  rootStyle.setProperty('--missing-link', missingLinkDark);
  rootStyle.setProperty('--missing-link-hover', missingLinkHoverDark);
  rootStyle.setProperty('--shadow-color', shadowDark);
  document.getElementById("navbar-icon-moon").style.display = "none";
  document.getElementById("navbar-icon-sun").style.display = "inline";

  document.querySelectorAll(".darkmode-invert").forEach(elem => elem.style.filter = "invert(1)");
}

function disableDarkMode() {
  rootStyle.setProperty('--bg-body', bgBodyLight);
  rootStyle.setProperty('--bg-elevated', bgElevatedLight);
  rootStyle.setProperty('--bg-highlight', bgHighlightLight);
  rootStyle.setProperty('--bg-navbar', bgNavbarLight);
  rootStyle.setProperty('--bg-navbar-solid', bgNavbarSolidLight);
  rootStyle.setProperty('--text', textColorLight);
  rootStyle.setProperty('--text-muted', mutedTextColorLight);
  rootStyle.setProperty('--link-color', linkColorLight);
  rootStyle.setProperty('--link-hover', linkHoverLight);
  rootStyle.setProperty('--missing-link', missingLinkLight);
  rootStyle.setProperty('--missing-link-hover', missingLinkHoverLight);
  rootStyle.setProperty('--shadow-color', shadowLight);
  document.getElementById("navbar-icon-sun").style.display = "none";
  document.getElementById("navbar-icon-moon").style.display = "inline";

  document.querySelectorAll(".darkmode-invert").forEach(elem => elem.style.filter = "invert(0)");
}

function toggleDarkMode() {
  if (JSON.parse(localStorage.getItem("darkModeEnabled"))) {
    localStorage.setItem("darkModeEnabled", JSON.stringify(false));
    disableDarkMode();
  } else {
    localStorage.setItem("darkModeEnabled", JSON.stringify(true));
    enableDarkMode();
  }
}

export function initializeDarkMode() {
  try {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    // initialisierung dark mode
    if (localStorage.getItem("darkModeEnabled") === null) {
      if (media.matches) {
        localStorage.setItem("darkModeEnabled", JSON.stringify(true));
        enableDarkMode();
      } else {
        localStorage.setItem("darkModeEnabled", JSON.stringify(false));
        disableDarkMode();
      }
    } else {
      if (JSON.parse(localStorage.getItem("darkModeEnabled"))) {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
    }

    // live changes vom dark mode
    media.addEventListener('change', e => {
      media.matches ? enableDarkMode() : disableDarkMode();
    });

    document.getElementById("navbar-button-darkmode").addEventListener("click", toggleDarkMode);
  } catch (err) {
    console.error(`Could not initialize dark mode.\n${err.name}: ${err.message}`);
  }
}


// Event Listener für expandable
export function addExpandableClickListener() {
  try {
    let i = 0;
    for (; i < document.getElementsByClassName("expandable-header").length; i++) {
      document.getElementsByClassName("expandable-header")[i]
        .addEventListener("click", toggleExpandable);

      //Damit es am Anfang schon mal gesetzt ist und nicht in HTML jedes mal eingefügt werden muss
      document.getElementsByClassName("expandable-header")[i]
        .classList.add("on-hover-bg-highlight");
    }
    // console.debug("Added click event listeners for " + i + " expandables.")
  } catch (err) {
    console.error(`Event Listener for expandable could not be registered.\nError: ${err.name}\nMessage: ${err.message}`)
  }
}





export function toggleExpandable(event) {
  const expandableHeaderEl = event.currentTarget;
  const expandableContainerEl = expandableHeaderEl.parentElement;
  const expandableContentEl = expandableContainerEl.querySelector(".expandable-content");

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

  const expanded = !Boolean(Number(expandableContainerEl.dataset.expanded));
  expandableContainerEl.dataset.expanded = String(Number(expanded));

  if (expanded) {
    expandableHeaderEl.classList.remove("on-hover-bg-highlight");
    expandableContentEl.style.display = "";
    expandableContentEl.style.overflow = "hidden";

    const targetHeight = expandableContentEl.scrollHeight;
    const duration = Math.abs(targetHeight - currentHeight) / 2000;

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

    expandableContainerEl.querySelector(".expandable-header-icon").style.rotate = "-90deg";

  } else {
    expandableContentEl.style.overflow = "hidden";

    const duration = Math.abs(currentHeight) / 2000;

    requestAnimationFrame(() => {
      expandableContentEl.style.transition = `height ${duration}s cubic-bezier(.59,0,.59,.81)`;
      expandableContentEl.style.height = "0";
    });

    const handler = function() {
      expandableContentEl.style.display = "none";
      expandableContentEl.style.overflow = "";
      expandableHeaderEl.classList.add("on-hover-bg-highlight");
      expandableContentEl.removeEventListener("transitionend", handler);
      delete expandableContentEl._transitionHandler;
    };
    expandableContentEl._transitionHandler = handler;
    expandableContentEl.addEventListener("transitionend", handler);

    expandableContainerEl.querySelector(".expandable-header-icon").style.rotate = "90deg";
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
      // if (seen.has(element)) return;
      // seen.add(element);
      element.addEventListener("pointerenter", datenElementHoverOn);
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}


function adjustImageFooterWidth(imageContainerEl) {
  const img = imageContainerEl.getElementsByTagName("img")[0];

  const applyWidth = () => {
    const imgWidth = img.offsetWidth;
    [...imageContainerEl.children].forEach(elem => {
      elem.style.maxWidth = imgWidth + "px";
    });
  };

  if (img.complete) {
    applyWidth();
  } else {
    img.addEventListener("load", applyWidth);
  }
}

try {
  document.querySelectorAll(".text-image").forEach(elem => {
    adjustImageFooterWidth(elem);
  });
} catch (err) {
  console.error(err.name + "\n" + err.message);
}
window.addEventListener("resize", () => {
  try {
    document.querySelectorAll(".text-image").forEach(elem => {
      adjustImageFooterWidth(elem);
    });
  } catch (err) {
    console.error(err.name + "\n" + err.message);
  }
})


export function injectSourceNotes() {
  try {
    document.querySelectorAll("[data-sources]").forEach(elementWithSource => {
      //sources-Attribut vom Element (getrennt mit Leerzeichen oder ,) in einen Array umwandeln
      const sources = elementWithSource.dataset.sources.split(/[,\s]+/).map(Number);
      sources.forEach(source => {
        const sourceEl = document.createElement("sup");
        sourceEl.innerHTML = `[${source}]`;
        sourceEl.tabIndex = "0";
        sourceEl.classList.add("source-note");
        elementWithSource.appendChild(sourceEl);
        sourceEl.addEventListener("click", showSourceMenu)
      });
    });
  } catch (err) {
    console.error(`Could not inject source notes.\n${err.name}\n${err.message}`);
  }
}



function showSourceMenu(event) {
  const sourceEl = event.currentTarget
}


function injectSourceFooterContent() {

}


function copyURIWithID(id) {
  navigator.clipboard.writeText(`${document.baseURI}#${id}`)
}


function spawnPoppingParticles({
  xPos = event?.clientX,
  yPos = event?.clientY,
  count = 15,
  size = 4.5,
  durationMin = 1550,
  durationMax = 1600,
  radiusMin = 25,
  radiusMax = 27,
  color = "#fff"
}) {

  for (let i = 0; i < count; i++) {
    createParticle(i);
  }

  function createParticle(i) {
    const particle = document.createElement("particle");
    document.body.appendChild(particle);

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;

    // Winkel von 0 - 2 Pi (voller Kreis)
    const angle = ((Math.random() * ((i - 0.2) - (i + 0.2)) + (i - 0.2)) / count) * 2 * Math.PI;
    const radius = Math.random() * (radiusMax - radiusMin) + radiusMin;
    //Damit ist die x/y Position auf einem Kreis um die ursprüngliche xPos
    const destinationX = xPos + Math.sin(angle) * radius;
    const destinationY = yPos + Math.cos(angle) * radius;

    // Store the animation in a variable as we will need it later
    const animation = particle.animate(
      [{
          // Set the origin position of the particle
          // We offset the particle with half its size to center it around the mouse
          transform: `translate(-50%, -50%) translate(${xPos}px, ${yPos}px)`,
          opacity: 1
        },
        {
          // We define the final coordinates as the second keyframe
          transform: `translate(${destinationX}px, ${destinationY}px)`,
          opacity: 0
        }
      ], {
        // Set a random duration from 500 to 1500ms
        duration: (Math.random() * (durationMax - durationMin) + durationMin),
        easing: "cubic-bezier(0,1,.35,1)",
        // Delay every particle with a random value of 200ms
        delay: Math.random() * 200
      }
    );

    // When the animation is complete, remove the element from the DOM
    animation.onfinish = () => {
      particle.remove();
    };
  }

}


export function addTextHeaderClickListener() {
  document.querySelectorAll("h2.text-header").forEach(elem => {
    elem.addEventListener("click", event => {

      copyURIWithID(event.currentTarget.parentElement.id);

      const icon = event.currentTarget.querySelector(".text-header-icon");

      icon.style.animation = "rescale-bounce 0.25s ease 0s 2 alternate";
      setTimeout(() => {
        const iconCoords = icon.getBoundingClientRect();
        spawnPoppingParticles({
          xPos: iconCoords.x + (iconCoords.width / 2),
          yPos: iconCoords.y + (iconCoords.height / 2)
        });
      }, 400);
      setTimeout(() => {
        icon.style.animation = "none";
      }, 500);
    });
  });
}