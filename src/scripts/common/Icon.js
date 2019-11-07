const template = document.createElement('template');

template.innerHTML = `
    <style>

    </style>
    <span></span>
`;

window.customElements.define(
  'app-icon',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$wrap = this._shadowRoot.querySelector('span');
    }

    connectedCallback() {
      this.$wrap.innerHTML = this.getAttribute('icon');
    }
  }
);
