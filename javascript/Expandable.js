"use strict";

class Expandable extends HTMLElement {
  render() {
    this.style.margin = "0";
    this.style.borderRadius = "2rem";
    this.style.backgroundColor = "var(--bg-elevated)";
  }
  
  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
  
  static get observedAttributes() {
    return ["expanded"];
  }
  
  attributeChangedCallback() {
    this.render()
  } 
}


class ExpandableHeader extends HTMLButtonElement {
  render() {
    
  }
  
  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
  
  static get observedAttributes() {
    return ["expanded"];
  }
  
  attributeChangedCallback() {
    this.render()
  } 
}

customElements.define("expandable-container", Expandable);
// customElements.define("expandable-header", ExpandableHeader);
// customElements.define("expandable-content", ExpandableContent)