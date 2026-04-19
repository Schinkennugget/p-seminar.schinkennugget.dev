"use strict";

// let lastClickedElement;

// document.querySelectorAll(".testlink").forEach(elem =>
//   elem.addEventListener("click", function handleEvent(event) {
//     if (lastClickedElement !== event.currentTarget) {
//       event.preventDefault();
//     }

//     if (lastClickedElement !== null && lastClickedElement !== undefined) {
//       lastClickedElement.style.color = "";
//       lastClickedElement.style.transform = "";
//     }

//     event.currentTarget.style.color = "orange";
//     event.currentTarget.style.transform = "scale(1.5)";
//     lastClickedElement = event.currentTarget;
//   }));

// document.querySelectorAll(".test").forEach(elem => {
//   elem.addEventListener("touchstart", function handleEvent(event) {
//     event.preventDefault();
//     event.currentTarget.classList.toggle("testhover")
//   });

//   elem.addEventListener("touchend", function handleEvent(event) {

//   });
// });

// function touchHandler(event) {
//   const touch = event.touches[0]; // erster Finger
//     document.getElementById("test").innerHTML = `x: ${touch.clientX} | y: ${touch.clientY}`;
// }

// function mouseHandler(event) {
//   document.getElementById("test").innerHTML = `x: ${event.clientX} | y: ${event.clientY}`;
// }

// document.documentElement.addEventListener("touchstart", touchHandler);
// document.documentElement.addEventListener("touchmove", touchHandler);
// document.documentElement.addEventListener("mousemove", mouseHandler);


// document.documentElement.addEventListener("touchend", function handleEvent(event) {
//   document.getElementById("test").innerText = "Kein Touch";
// });

// function makePath(points) {
//   // punkte = [[x1,y1], [x2,y2], ...]
//   const [start, ...rest] = points;
//   const d = [
//     `M ${start[0]} ${start[1]}`,
//     ...rest.map(([x, y]) => `L ${x} ${y}`),
//     "Z"
//   ].join(" ");

//   const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
//   path.setAttribute("d", d);
//   path.setAttribute("fill", "none");
//   path.setAttribute("stroke", "black");
//   path.setAttribute("stroke-width", "2");

//   return path;
// }



const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", 250 * 5);
svg.setAttribute("height", 130 * 5);

function makeRect(x, y, width, height) {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x * 5);
  rect.setAttribute("y", y * 5);
  rect.setAttribute("width", width * 5)
  rect.setAttribute("height", height * 5);
  rect.setAttribute("fill", "none");
  rect.setAttribute("stroke", "black");
  rect.setAttribute("stroke-width", "1");
  return rect;
}

function makeLine(fromX, fromY, toX, toY) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", fromX);
  line.setAttribute("y1", fromY);
  line.setAttribute("x2", toX);
  line.setAttribute("y2", toY);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "1")
  return line;
}


//Äußere Form
svg.appendChild(makeRect(0,0,250,130));

svg.appendChild(makeRect(5, 7.5, 10, 12.5));
svg.appendChild(makeRect(17.5, 7.5, 10, 12.5));
svg.appendChild(makeRect(60, 7.5, 15, 12.5));


document.body.appendChild(svg);