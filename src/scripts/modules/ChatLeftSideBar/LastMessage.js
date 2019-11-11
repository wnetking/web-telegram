import { getMessage } from '../../../utils/getMessage';
const template = document.createElement('template');

template.innerHTML = `
    <style>
    :host {
    }
    </style>
`;

window.customElements.define(
  'app-chat-item-last-message',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._data = null;
    }

    set message(val) {
      this._data = val;
      this.render();
    }

    render() {
      this._shadowRoot.innerHTML = getMessage(this._data);
    }
  }
);
