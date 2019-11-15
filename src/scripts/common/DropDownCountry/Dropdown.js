import { Input } from '../Input';
import core, { Element } from '../../../services/api/core';

let cacheData = null;

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    position: relative;
  }
  .trigger-btn {
    cursor: pointer;
  }

  .drop-down-wrap {
    position: absolute;
    display: none;
    width: 100%;
    top: calc(100% + 10px);
    left: 0;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px #ccc; 
  }

  .drop-down-wrap.active{
    display: block;
  }

  app-icon{
    color: #8c959b;
    transition: all 0.1s ease-out;
  }

  input:focus ~ button app-icon {
    transform: rotate(-180deg);
    color: var(--focus-color);
  }

  .drop-down-wrap{

  }

  .drop-down-wrap{
    overflow-y: auto;
    max-height: 300px;
  }

  .drop-down-wrap::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px transparent;
    background-color: transparent;
  }

  .drop-down-wrap::-webkit-scrollbar {
    width: 5px;
    background-color: transparent;
  }

  .drop-down-wrap::-webkit-scrollbar-thumb {
    background-color: #dadce0;
    border-radius: 3px;
  }
</style>
<div class="drop-down-wrap"></div>
`;
const triggerTmp = `
  <button class="trigger-btn"><app-icon icon="down_svg"></app-icon></button>
`;

core.define(
  'app-chat-country-phone-code',
  class extends Input {
    constructor() {
      super();
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$inputWrap.insertAdjacentHTML('beforeEnd', triggerTmp);
      this.extendConnectedCallback = this.extendConnectedCallback.bind(this);
      this.toggle = this.toggle.bind(this);
      this.onSelect = this.onSelect.bind(this);
      this.onFocusout = this.onFocusout.bind(this);
      this.onTriggerClick = this.onTriggerClick.bind(this);
      this.isDropdownRendered = false;
    }

    extendConnectedCallback() {
      this.$triggerBtn = this._shadowRoot.querySelector('.trigger-btn');
      this.$dropDownWrap = this._shadowRoot.querySelector('.drop-down-wrap');
      core.on('click', this.onTriggerClick, this.$triggerBtn);
      core.on('focus', this.toggle, this.$input);
      core.on('focus', this.toggle, this.$input);
      core.on('keyup', this.onKeyup, this.$input);
      core.on('focusout', this.onFocusout, this.$input);
      core.on('focusout', this.onFocusout, this.$input);
    }

    extendDisconnectedCallback() {
      core.off('click', this.onTriggerClick, this.$triggerBtn);
      core.off('focus', this.toggle, this.$input);
      core.off('keyup', this.onKeyup, this.$input);
      core.off('focusout', this.onFocusout, this.$input);
      core.off('focusout', this.onFocusout, this.$input);
    }

    onTriggerClick() {
      this.$input.focus();
    }

    onKeyup(e) {
      core.emmit('phone.dropdowKeyDown', e.target.value);
    }

    onFocusout() {
      setTimeout(() => {
        this.$dropDownWrap.classList.remove('active');
      }, 200);
    }

    onSelect(item) {
      this.$input.value = item.name;
      this.toggle();
      this.keyupHandler({
        target: this.$input
      });

      core.emmit('dropdown.change', item, this);
    }

    load(callback = () => { }) {
      import('./country_data').then(({ default: data }) => {
        cacheData = data;
        callback();
      });

      import('./FlagIcon.js').then(({ default: FlagItem }) => {
        window.customElements.define('app-flag-item', FlagItem);
      });
    }

    toggle() {
      if (this.$dropDownWrap.classList.contains('active')) {
        this.$dropDownWrap.classList.remove('active');
      } else {
        if (!this.isDropdownRendered) {
          this.renderDropdown();
        }

        this.$dropDownWrap.classList.add('active');
      }
    }

    renderDropdown() {
      this.load(() => {
        if (!cacheData.countries) {
          return false;
        }

        const { countries } = cacheData;
        const fragment = document.createDocumentFragment();

        countries.forEach(country => {
          const item = document.createElement('app-chat-country-phone-code-item');
          item.data = country;
          item.onSelect = this.onSelect;
          fragment.appendChild(item);
        });

        this.$dropDownWrap.appendChild(fragment);
        this.isDropdownRendered = true;
      });
    }
  }
);

const tm = document.createElement('template');
tm.innerHTML = `
<style>
  * {
    box-sizing: border-box;
  }

  div{
    display: flex;
    padding: 15px;
    transition: all 0.1s ease-out;
    cursor: pointer;
  }

  div.hidden{
    display: none;
  }

  div:hover{
    background-color: #f4f4f5;
  }

  .icon{
    margin-right: 20px;
  }
  .name {
    margin-right: auto;
  }
  .code {
    color: #707478;
  }
</style>
<div></div>
`;
core.define(
  'app-chat-country-phone-code-item',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(tm);

      this.$wrap = this.shadow.$('div');
      this.dropdowKeyDownH = this.dropdowKeyDownH.bind(this);
      this.onClick = this.onClick.bind(this);
      this.onSelect = null;
      /**
       * {object}
       *
       * dialCode - {string}
       * format
       * hasAreaCodes - {bool}
       * iso2 - {string}
       * name - {string}
       * priority - {number}
       * regions: {array}
       */
      this._data;
    }

    connectedCallback() {
      core.on('click', this.onClick, this.$wrap);
      core.on('phone.dropdowKeyDown', this.dropdowKeyDownH);
    }

    disconnectedCallback() {
      core.off('click', this.onClick, this.$wrap);
      core.off('phone.dropdowKeyDown', this.dropdowKeyDownH);
    }

    onClick() {
      if (!this.onSelect) {
        return false;
      }

      this.onSelect(this._data);
    }

    dropdowKeyDownH({ detail }) {
      const name = this._data.name.toLowerCase();
      const value = detail.toLowerCase();

      if (!value) {
        return this.$wrap.classList.remove('hidden');
      }

      if (!name.includes(value)) {
        this.$wrap.classList.add('hidden');
      }
    }

    set data(val) {
      this._data = val;
      this.renderItem();
    }

    renderItem() {
      this.$wrap.innerHTML = `
        <app-flag-item class="icon" icon="${this._data.iso2}"></app-flag-item> 
        <span class="name">${this._data.name}</span>
        <span class="code">+${this._data.dialCode}</span>
      `;
    }
  }
);
