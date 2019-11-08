const template = document.createElement('template');

template.innerHTML = `
    <style>
      :host {
        display: inline-flex;
      }

      .icon{
        display: inline-block;
        width: 1em;
        height: 1em;
        stroke-width: 0;
        stroke: currentColor;
        fill: currentColor;
      }
    </style>
    <svg class="icon "><use xlink:href="#icon_chevron_down"></use></svg>
`;

window.customElements.define(
  'app-icon',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$wrap = this._shadowRoot.querySelector('use');
    }

    connectedCallback() {
      this.$wrap.setAttribute(
        'xlink:href',
        this.getIconPath(this.getAttribute('icon'))
      );
    }

    static get observedAttributes() {
      return ['icon'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'icon') {
        this.$wrap.setAttribute('xlink:href', this.getIconPath(newVal));
      }
    }

    getIconPath(icon) {
      return `./public/images/symbol-defs.svg#icon-${icon}`;
    }
  }
);
