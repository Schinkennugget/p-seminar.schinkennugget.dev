"use strict";

class ExperimentLink extends HTMLElement {
  constructor() {
    super();
    this._anchor = document.createElement("a");
    this._renderedHref = null;
    this._pendingHref = null;
  }

  render = async () => {
    const href = this.getAttribute("href");
    if (!href) {
      console.warn("An ExperimentLink could not be loaded, because there is no href attribute defined");
      return;
    }

    // schon fertig gerendert oder gerade am Laden für dieselbe href? dann nichts tun
    if (href === this._renderedHref || href === this._pendingHref) {
      return;
    }
    this._pendingHref = href;

    async function getMetaPreview(url) {
      let title = "<em>Fehler beim Laden</em>";
      let imageUrl = "";

      try {
        const response = await fetch(url);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        title = doc.querySelector('meta[property="og:title"]')?.content
          || doc.querySelector('title')?.textContent;
        imageUrl = doc.querySelector('meta[property="og:image"]')?.content;
      } catch {
        console.warn(`Data for an ExperimentLink could not be fetched, maybe the href (${url}) is badly formatted`);
      }

      return { title, imageUrl };
    }

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    const meta = await getMetaPreview(href);

    // falls sich href zwischenzeitlich geändert hat, Ergebnis verwerfen
    if (this.getAttribute("href") !== href) {
      return;
    }

    this._anchor.replaceChildren();
    this._anchor.setAttribute("href", href);

    const headerEl = document.createElement("h3");
    headerEl.innerHTML = `<labeled-icon icon="FlaskConical">${meta.title}</labeled-icon>`;
    const imgEl = document.createElement("img");
    imgEl.src = meta.imageUrl;

    this._anchor.append(headerEl, imgEl);

    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
    a {
      color: var(--text-color);
      text-decoration: none;
      background-color: var(--bg-elevated);
      transition: background-color var(--animation-speed-fast) linear;
      display: flex;
      justify-content: space-between;
      border-radius: 18px;
      padding: 10px;
      margin: 0;
    }
      
    a:hover {
      background-color: var(--bg-highlight)
    }

    h3 {
      margin: 3px;
    }
      
    img {
      display: block;
      max-width: 40%;
      max-height: 150px;
      height: auto;
      width: auto;
      border-radius: 8px;
    }`;

    this.style.display = "block";

    if (!this._anchor.isConnected) {
      this.shadowRoot.appendChild(this._anchor);
      this.shadowRoot.append(styleEl);
    }

    this._renderedHref = href;
    this._pendingHref = null;
  };

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["href"];
  }

  attributeChangedCallback() {
    this.render();
  }
}

customElements.define("experiment-link", ExperimentLink);