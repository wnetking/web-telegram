const template = document.createElement('template');

template.innerHTML = `
    <style>
      :host {
        position: relative;
      }

      app-loader{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    </style>
    <div><app-loader big></app-loader></div>
`;

window.customElements.define(
  'app-chat',
  class extends AppElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
);
