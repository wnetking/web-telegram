import { trans, api } from '../../services';
import core, { Element } from '../../services/api/core';

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
  <app-input data-error-event="password_invalid" type="password" label="${t.password}"></app-input>
  <app-button>${t.phone_submit}</app-button>
</app-auth-section>
`;

core.define(
  'app-auth-password',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this.$submitButton = this.shadow.$('app-button');
      this.$input = this.shadow.$('app-input');
      this._password = null;
      this.inputFocus = this.inputFocus.bind(this);
      this.onChangeHandle = this.onChangeHandle.bind(this);
      this.onKeyDownHandle = this.onKeyDownHandle.bind(this);
      this.onSubmitButtonHandle = this.onSubmitButtonHandle.bind(this);

    }

    connectedCallback() {
      this.section = this.shadow.$('app-auth-section');
      this.player = this.section.player;

      if (this.player) {
        this.pause();
      }

      core.on('toggle-password', this.inputFocus, this.$input);
      core.on('change', this.onChangeHandle, this.$input);
      core.on('keydown', this.onKeyDownHandle, this.$input);
      core.on('click', this.onSubmitButtonHandle, this.$submitButton);
    }

    disconnectedCallback() {
      core.off('toggle-password', this.inputFocus, this.$input);
      core.off('change', this.onChangeHandle, this.$input);
      core.off('keydown', this.onKeyDownHandle, this.$input);
      core.off('click', this.onSubmitButtonHandle, this.$submitButton);
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

    onKeyDownHandle(e) {
      if (e.keyCode === 13) {
        this._password = String(this.$input.$input.value);
        this.onSubmitButtonHandle();
      }
    }

    onSubmitButtonHandle() {
      if (!this._password || this._password.length < 1) {
        this.$input.$input.focus();
        return false;
      }

      api.send({
        '@type': 'checkAuthenticationPassword',
        password: this._password,
      })
    }
  }
);