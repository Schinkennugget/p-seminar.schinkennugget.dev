"use strict";

class LabeledIcon extends HTMLElement {
  render({renderIcon = true, renderText = true}) {
    const iconName = this.getAttribute("icon");
    let icon;
    if (lucide && iconName && lucide[iconName]) {
      icon = lucide.createElement(lucide[iconName]);
    } else if (lucide && lucide.CircleQuestionMark) {
      icon = lucide.createElement(lucide.CircleQuestionMark)
    } else {
      icon = "?"
    }
    
    let fontSize = window.getComputedStyle(this).fontSize;
    fontSize = fontSize.slice(0, fontSize.length - 2);
    fontSize = Number(fontSize);
    icon.style.height = (fontSize + fontSize * 0.25) + "px";
    icon.style.width = (fontSize + fontSize * 0.25) + "px";

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
    
    if (renderIcon) {
      this.shadowRoot?.firstElementChild?.matches("svg") ? this.shadowRoot.firstElementChild.replaceWith(icon) : this.shadowRoot.prepend(icon);
    }

    if (renderText && !this.shadowRoot?.lastElementChild?.matches("slot")) {
      this.shadowRoot.append(document.createElement("slot"));
    }
    
    this.style.cssText = `
    display: inline-flex;
    flex-dircetion: row;
    flex-wrap: nowrap;
    gap: 5px;
    align-items: center;
    vertical-align: ${fontSize * -0.25 + "px"};`;
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render({renderIcon: true, renderText: true});
      this.rendered = true;
    }
  }

  static get observedAttributes() {
    return ["icon"];
  }

  attributeChangedCallback() {
    this.render({renderIcon: true, renderText: false});
  }
}

customElements.define("labeled-icon", LabeledIcon);