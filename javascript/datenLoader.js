const zinkDaten = new Map([
	["atommasse", "65,38"],
	["protonenzahl", "30"],
	["elementsymbol", "Zn"],
	["elementname", "Zink"],
	["atomradius", "133"],
	["siedetemperatur", "906"],
	["ionenradius-oxidationszahl", "74 (+II)"],
	["schmelztemperatur", "419"],
	["ionisierungsenergie", "913"],
	["dichte", "7,14"],
	["elektronegativitaet", "1,65 (II)"],
	["anteil-haeufigstes-isotop", "48,6"]
]);


function loadDaten() {
	let datenGrafikContent = "";
	zinkDaten.forEach(function(value, key) {
		datenGrafikContent += '<div id="daten-grafik-' + key +
			'" class="daten-grafik-wert" class="daten-' + key + '">' + value + '</div>';
	});


	document.getElementById("daten-grafik").innerHTML = datenGrafikContent;
}

loadDaten();