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