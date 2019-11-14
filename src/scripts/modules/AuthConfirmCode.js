import { trans, api } from '../../services';
import { catchPaste } from '../../utils/common';
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
      this._code = null;

      this.$input.addEventListener('change', this.onChangeInputHanlde.bind(this));

      this.$input.addEventListener('focus', this.inputFocus.bind(this));
      this.$input.addEventListener('focusout', this.inputFocusOut.bind(this));
      this.$input.addEventListener('keydown', this.onKeydownPhoneHandler.bind(this));
      this.$input.addEventListener('paste', this.onPasteHandle.bind(this));
    }

    disconnectedCallback() {
      this.$input.removeEventListener('change', this.onChangeInputHanlde.bind(this));
      this.$input.removeEventListener('focus', this.inputFocus.bind(this));
      this.$input.removeEventListener('focusout', this.inputFocusOut.bind(this));
      this.$input.removeEventListener('keydown', this.onKeydownPhoneHandler.bind(this));
      this.$input.removeEventListener('paste', this.onPasteHandle.bind(this));
    }

    onChangeInputHanlde(e) {
      const {
        detail: { value }
      } = e;
      this._code = value;
    }

    onKeydownPhoneHandler(e) {
      if (e.keyCode === 13) {
        this._code = e.target.$input.value;
        this.onSubmitHandle();
      }
    }

    onPasteHandle(e) {
      catchPaste(e, this, code => {
        this._code = code;
        this.onSubmitHandle();
      });
    }

    onSubmitHandle() {
      api.send({
        '@type': 'checkAuthenticationCode',
        code: this._code
      });
    }

    connectedCallback() {
      this.section = this._shadowRoot.querySelector('app-auth-section');
      this.player = this.section.player;
    }

    inputFocus() {
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
  }
);
