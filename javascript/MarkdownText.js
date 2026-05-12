"use strict";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

class MarkdownText extends HTMLElement {
  render() {
    let transformedText = this.innerHTML;
    
    transformedText = marked.parse(transformedText);

    transformedText = transformedText.split('\n').reduce((acc, line, i, arr) => {
      if (/[#->]/.test(line.split("")[0]) || i == 0 || arr[i + 1] == "" || line == "") {
        return acc + line + "\n";
      } else {
        return acc + line + "<br>\n"
      }
    }, '');
//Wenn die aktuelle Zeile eine Überschrift, Liste oder ein Zitat ist
  //Wenn die nächste Zeile leer ist, wird ein <p> eingefügt -> kein Linebreak
          

    console.log(transformedText);
    // transformedText = transformedText.replace(/\n+(?![#\-<>])/g, '<br />');
    

    this.innerHTML = transformedText;
    console.log(this.innerHTML);
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
}

customElements.define("md-text", MarkdownText);