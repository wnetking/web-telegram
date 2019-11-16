import {
  trans
} from '../../services';
import {
  api
} from '../../services';
import core, {
  Element
} from '../../services/api/core';
import {
  setTemploaryPhone
} from '../../services/store/actions/userInfo';

const t = trans('auth');
const template = document.createElement('template');
template.innerHTML = `
<style>
  app-chat-country-phone-code, app-input, app-button{
    width: 100%;
    margin-bottom: 25px;
  }

  app-chat-country-phone-code{
    z-index: 2;
  }

  .hidden {
    display: none;
  }
</style>
<app-auth-section heading="${t.sign_in}" desc="${t.sign_in_desc}" img-src="./public/images/telegram.svg" >
  <app-chat-country-phone-code type="text" label="${t.country}"></app-chat-country-phone-code>
  <app-input data-error-event='phone_invalid' type="tel" value='' label="${t.phone}" pattern="^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$"></app-input>
  <app-checkbox is-checked='false' label-text='${t.checkbox_label}'></app-checkbox>
  <app-button class="hidden">${t.phone_submit}</app-button>
</app-auth-section>
`;

core.define(
  'app-auth',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);

      this.$submitButton = this.shadow.$('app-button');
      this.$inputPhone = this.shadow.$('[type=tel]');
      this.$country = this.shadow.$('app-chat-country-phone-code');
      this.$checkbox = this.shadow.$('app-checkbox');

      this.telephone = '';
      this.selectedData = {};

      this.sendPhoneHandle = this.sendPhoneHandle.bind(this);
      this.onChangePhoneHandle = this.onChangePhoneHandle.bind(this);
      this.onKeydownPhoneHandler = this.onKeydownPhoneHandler.bind(this);
      this.dropdownChange = this.dropdownChange.bind(this);
      this.onChangeCheckboxHandle = this.onChangeCheckboxHandle.bind(this);
    }

    connectedCallback() {
      core.on('click', this.sendPhoneHandle, this.$submitButton);
      core.on('change', this.onChangePhoneHandle, this.$inputPhone);
      core.on('keyup', this.onKeydownPhoneHandler, this.$inputPhone);
      core.on('dropdown.change', this.dropdownChange, this.$country);
      core.on('change', this.onChangeCheckboxHandle, this.$checkbox);
    }

    disconnectedCallback() {
      core.off('click', this.sendPhoneHandle, this.$submitButton);
      core.off('change', this.onChangePhoneHandle, this.$inputPhone);
      core.off('keyup', this.onKeydownPhoneHandler, this.$inputPhone);
      core.off('dropdown.change', this.dropdownChange, this.$country);
      core.off('change', this.onChangeCheckboxHandle, this.$checkbox);
    }

    dropdownChange({
      detail
    }) {
      this.$inputPhone.$input.value = `+${detail.dialCode}`;
      this.selectedData = detail;

      this.$inputPhone.keyupHandler({
        target: this.$inputPhone.$input,
      });
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

      // Submit enter
      if (e.keyCode === 13) {
        this.sendPhoneHandle();
      }
    }

    onChangePhoneHandle(e) {
      this.telephone = String(e.detail.value);
    }

    sendPhoneHandle() {
      if (!this.telephone) {
        this.$inputPhone.$input.focus();
        return false;
      }
      setTemploaryPhone(this.telephone);
      this.$submitButton.setAttribute('is-loading', null);
      api.send({
        '@type': 'setAuthenticationPhoneNumber',
        phone_number: this.telephone,
      });
    }

    onChangeCheckboxHandle(e) {
      const { detail: { value } } = e;
      this.$checkbox.setAttribute('is-checked', value);
    }
  }
);