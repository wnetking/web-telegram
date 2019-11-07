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
    <app-auth-section heading="${t.password_header}" desc="${t.password_desc}" img-src="./public/images/TwoFactorSetupMonkeyClose.tgs">
      <app-input type="text" label="${t.password}"></app-input>
              
      <button is="app-button">${t.phone_submit}</button>
    </app-auth-section>
`;

window.customElements.define(
  'app-auth-password',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$submitButton = this._shadowRoot.querySelector('button');
      this.$submitButton.addEventListener('click', this._auth.bind(this));
    }

    connectedCallback() {
      const section = this._shadowRoot.querySelector('app-auth-section');
      const player = section.player;

      if (player) {
        setTimeout(() => {
          player.pause();
        }, 1000);
      }
    }

    _auth() {
      push('/#/chat');
    }
  }
);
