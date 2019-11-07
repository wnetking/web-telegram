import {
  trans
} from '../../services';
import {
  push
} from '../../services/router';
const t = trans('auth');
import {
  api
} from '../../services';


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
      <app-input type="tel" value='' label="${t.phone}" pattern="^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$"></app-input>
      <button is="app-button">${t.phone_submit}</button>
    </app-auth-section>
`;

window.customElements.define(
  'app-auth',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({
        mode: 'open'
      });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this.$submitButton = this._shadowRoot.querySelector('button');
      this.$inputPhone = this._shadowRoot.querySelector('[type=tel]');

      this.$submitButton.addEventListener('click', this.sendPhoneHandle.bind(this));
      this.$inputPhone.addEventListener('change', this.onChangePhoneHandle.bind(this));

      this.telephone = '';
    }

    onChangePhoneHandle(e) {
      this.telephone = String(e.detail.value);
    }

    sendPhoneHandle() {
      api.send({
        '@type': 'setAuthenticationPhoneNumber',
        // Твой телефон
        phone_number: this.telephone
      }).then(resp => {
        if(resp['@type'] == 'ok'){
          push('/#/code-confirm');
        }
      })
    }
  }
);