// Nur fürs Portfolio wichtig
// Not important for the rest of the page

const data = {
  artikel: {
    struktur: "100%",
    experimente: "100%",
    text_batterie_experiment: "100%",
    text_münzen_experiment: "100%",
    immunsystem: "5%",
    batterietechnik: "0%",
    eigenschaften: "100%",
    texte_ueberarbeiten: "15%"
  },
  webseite: {
    struktur_webseite: "100%",
    lernen: "ist man nie fertig",
    grobe_struktur: "100%",
    texte: "100%",
    datenansicht: "100%",
    automatisierung: "75%",
    rechtliches: "100%",
    hosting: "100%",
    quellen: "100%",
    pse: "75%",
    startseite_konzept: "5%",
    startseite_recherche: "0%",
    startseite_bauen: "0%",
    experimente_konzept: "20%",
    experimente_bauen: "0%",
    andere_einbauen: "5%"
  }
};


document.querySelectorAll(".arbeitspaket-progress").forEach(elem => {
  const fullName = elem.dataset.arbeitspaket;
  const base = fullName.split(".")[0];
  const name = fullName.split(".")[1];
  const progress = data?.[base]?.[name];

  if (progress == "100%") {
    elem.innerHTML = `<labeled-icon icon="Check">100%</labeled-icon>`
    elem.style.color = "green";
  } else {
    elem.innerHTML = `<labeled-icon icon="FileCog">${progress}</labeled-icon>`
  }
});