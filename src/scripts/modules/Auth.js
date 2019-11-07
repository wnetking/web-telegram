import { trans } from '../../services';
import { push } from '../../services/router';
const t = trans('auth');

const template = document.createElement('template');

template.innerHTML = `
    <style>
        app-input, button{
          width: 100%;
          margin-bottom: 25px;
        }
    </style>
    <app-auth-section heading="${t.sign_in}" desc="${t.sign_in_desc}" img-src="./public/images/telegram.svg" >
      <app-input type="text" label="${t.country}" value="test" has-error error-message="error"></app-input>
      <app-input type="tel" label="${t.phone}" pattern="^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$"></app-input>
      <button is="app-button">${t.phone_submit}</button>
    </app-auth-section>
`;

window.customElements.define(
  'app-auth',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$submitButton = this._shadowRoot.querySelector('button');
      this.$submitButton.addEventListener('click', this._auth.bind(this));
    }

    _auth() {
      push('/#/code-confirm');
    }
  }
);
