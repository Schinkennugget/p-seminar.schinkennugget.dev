"use strict";


function spawnPoppingParticles({
  xPos = event?.clientX,
  yPos = event?.clientY,
  count = 12,
  size = 6,
  durationMin = 1550,
  durationMax = 1600,
  radiusMin = 25,
  radiusMax = 27,
  color = "var(--text-muted)"
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
  document.querySelectorAll("h2.text-header, h3.text-subheader").forEach(elem => {
    elem.addEventListener("click", event => {

      navigator.clipboard.writeText(`${window.location.origin + window.location.pathname}#${elem.classList.contains("text-subheader") ? event.currentTarget.id : event.currentTarget.parentElement.id}`);

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