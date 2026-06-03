"use strict";
export function injectFooter() {
  const footerEl = document.createElement("footer");
  const base = new URL("../", import.meta.url).href;

  footerEl.innerHTML = `<ul>
      <li><a href="${base + "impressum.html"}">Impressum</a></li>
      <li><a href="${base + "datenschutz.html"}">Datenschutz</a></li>
      <li><a target="_blank" href="https://github.com/Schinkennugget/p-seminar.schinkennugget.dev/issues/new">Feedback auf GitHub geben</a><li>Feedback per E-Mail geben
        <div class="dropdown">
          <div><a id="mail-bugreport" href=""><labeled-icon icon="Bug">Problem melden</labeled-icon></a></div>
          <div><a id="mail-feature" href="mailto:kontakt@schinkennugget.dev?body=Welches%20Feature%20h%C3%A4ttest%20du%20gerne?%0A"><labeled-icon icon="Lightbulb">Feature vorschlagen</labeled-icon></a></div>
          <div><a id="mail-feedback" href="mailto:kontakt@schinkennugget.dev"><labeled-icon icon="MessageSquareText">Anderes Feedback</labeled-icon></a></div>
        </div>
      </li></li></ul>`;


  const mailTextBug = `Problem:



Genaue Schritte, um das Problem zu rekonstruieren:




Debug-Daten (Daten über deinen Browser, die uns helfen, das Problem zu beheben. Wenn du diese nicht mitsenden möchtest, lösche sie, aber verändere bitte keine Werte!):
userAgent: ${navigator.userAgent}
Bildschirmauflösung: ${screen.width} : ${screen.height}
devicePixelRatio: ${window.devicePixelRation}
Tatsächliche Fenstergröße: ${window.innerWidth} : ${window.innerHeight}

Seite: ${document.baseURI}
document.referrer: ${document.referrer}
Timestamp: ${new Date()}
performance.navigation.type: ${performance.navigation.type}`;


  footerEl.querySelector("#mail-bugreport").href = `mailto:support@schinkennugget.dev?body=${encodeURIComponent(mailTextBug)}`;
  document.body.append(footerEl);
}