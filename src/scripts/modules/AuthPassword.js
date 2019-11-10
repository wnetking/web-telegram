import {
  trans,
  api
} from '../../services';
import {
  push
} from '../../services/router';
const t = trans('auth');

const template = document.createElement('template');

template.innerHTML = `
    <style>
    app-input, app-button{
      width: 100%;
      margin-bottom: 25px;
    }
    </style>
    <app-auth-section heading="${t.password_header}" desc="${t.password_desc}" img-src="./public/images/TwoFactorSetupMonkeyClose.tgs">
      <app-input type="password" label="${t.password}"></app-input>
              
      <app-button>${t.phone_submit}</app-button>
    </app-auth-section>
`;

window.customElements.define(
  'app-auth-password',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({
        mode: 'open'
      });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this.$submitButton = this._shadowRoot.querySelector('app-button');
      this.$submitButton.addEventListener('click',this.onSubmitButtonHandle.bind(this));

      this.$input = this._shadowRoot.querySelector('app-input');
      this.$input.addEventListener(
        'toggle-password',
        this.inputFocus.bind(this)
      );
      this.$input.addEventListener('change', this.onChangeHandle.bind(this));

      this._password = null;
    }

    connectedCallback() {
      this.section = this._shadowRoot.querySelector('app-auth-section');
      this.player = this.section.player;

      if (this.player) {
        this.pause();
      }
    }

    pause() {
      setTimeout(() => {
        this.player.pause();
      }, 1000);
    }

    inputFocus(e) {
      const {
        isPasswordShow
      } = e.detail;

      if (isPasswordShow) {
        const stikerPath = './public/images/TwoFactorSetupMonkeyPeek.tgs';

        if (this.player) {
          this.player.load(stikerPath);
          setTimeout(() => {
            this.player.pause();
          }, 390);
        }

        return false;
      }

      this.player.play();
    }

    onChangeHandle(e) {
      const {
        detail: {
          value
        }
      } = e;

      this._password = String(value)
    }

    onSubmitButtonHandle(){
      api.send({
        '@type': 'setPassword',
        old_password: '',
        new_password : this._password,
        new_hint: '',
        set_recovery_email_address: false
      })
    }


    _auth() {
      push('/#/chat');
    }
  }
);