"use strict";


import * as animations from "./javascript/animations.js";
export function addTextHeaderClickListener() {
  document.querySelectorAll("h2.text-header, h3.text-subheader").forEach(elem => {
    elem.addEventListener("click", event => {

      navigator.clipboard.writeText(`${document.baseURI}#${event.currentTarget.parentElement.id}`);

      const icon = event.currentTarget.querySelector(".text-header-icon");

      icon.style.animation = "rescale-bounce 0.25s ease 0s 2 alternate";
      setTimeout(() => {
        const iconCoords = icon.getBoundingClientRect();
        
        animations.spawnPoppingParticles({
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