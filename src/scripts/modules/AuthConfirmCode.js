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
        app-input, button{
          width: 100%;
          margin-bottom: 25px;
        }
    </style>
    <app-auth-section heading="${t.phone}" desc="${t.code_desc}" img-src="./public/images/TwoFactorSetupMonkeyIdle.tgs" >
      <app-input class='confirmation-code' type="text" label="${t.code}"></app-input>
    </app-auth-section>
`;

window.customElements.define(
  'app-auth-code-confirm',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({
        mode: 'open'
      });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$input = this._shadowRoot.querySelector('.confirmation-code');
      this.$input.addEventListener('change', this.onChangeInputHanlde.bind(this))
    }

    onChangeInputHanlde(e) {
      const {
        detail: {
          value
        }
      } = e;
      api.send({
        '@type': 'checkAuthenticationCode',
        code: value,
      }).then(() => push('#/chat'))
    }

    connectedCallback() {
      this.section = this._shadowRoot.querySelector('app-auth-section');
      this.player = this.section.player;
    }

    inputFocus(e) {
      const stikerPath = './public/images/TwoFactorSetupMonkeyTracking.tgs';

      if (this.player) {
        this.player.load(stikerPath);
        this.player.setLooping(true);
      }
    }

    inputFocusOut(e) {
      if (this.player) {
        this.player.load(this.section.getAttribute('img-src'));
        this.player.setLooping(false);
      }
    }

    _auth() {}
  }
);