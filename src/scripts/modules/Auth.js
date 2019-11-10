import {
  trans
} from '../../services';
import {
  push
} from '../../services/router';
import {
  api
} from '../../services';
const t = trans('auth');

const template = document.createElement('template');

template.innerHTML = `
    <style>
        app-input, app-button{
          width: 100%;
          margin-bottom: 25px;
        }

        .hidden {
          display: none;
        }
    </style>
    <app-auth-section heading="${t.sign_in}" desc="${t.sign_in_desc}" img-src="./public/images/telegram.svg" >
      <app-input type="text" label="${t.country}" value="test" has-error error-message="error"></app-input>
      <app-input type="tel" value='' label="${t.phone}" pattern="^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$"></app-input>
      <app-button class="hidden">${t.phone_submit}</app-button>
    </app-auth-section>
`;

window.customElements.define(
  'app-auth',
  class extends AppElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({
        mode: 'open'
      });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this.$submitButton = this._shadowRoot.querySelector('app-button');
      this.$inputPhone = this._shadowRoot.querySelector('[type=tel]');

      this.$submitButton.addEventListener(
        'click',
        this.sendPhoneHandle.bind(this)
      );

      this.$inputPhone.addEventListener(
        'change',
        this.onChangePhoneHandle.bind(this)
      );

      this.$inputPhone.addEventListener(
        'keyup',
        this.onKeydownPhoneHandler.bind(this)
      );

      this.telephone = '';
    }

    onKeydownPhoneHandler(e) {
      if (e) {
        this.telephone = String(this.$inputPhone.$input.value);
      }

      if (this.telephone.length >= 13) {
        this.$submitButton.classList.remove('hidden');
      } else {
        this.$submitButton.classList.add('hidden');
      }
    }

    onChangePhoneHandle(e) {
      this.onKeydownPhoneHandler();

      this.telephone = String(e.detail.value);
    }

    sendPhoneHandle() {
      if (!this.telephone) {
        return false;
      }
      this.$submitButton.setAttribute('is-loading', null);
      api.send({
        '@type': 'setAuthenticationPhoneNumber',
        phone_number: this.telephone
      });
    }
  }
);