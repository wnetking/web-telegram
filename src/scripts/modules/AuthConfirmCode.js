import {
  trans,
  api
} from "../../services";
import {
  catchPaste
} from "../../utils/common";
import core, {
  Element
} from '../../services/api/core';
import store from "../../services/store/";

const t = trans("auth");
const template = document.createElement("template");
template.innerHTML = `
<style>
  app-input, button{
    width: 100%;
    margin-bottom: 25px;
  }
</style>
<app-auth-section heading="${t.phone}" desc="${t.code_desc}" isEdit img-src="./public/images/TwoFactorSetupMonkeyIdle.tgs" >
  <app-input data-error-event='phone_code_invalid' class='confirmation-code' type="text" label="${t.code}"></app-input>
</app-auth-section>
`;

core.define(
  "app-auth-code-confirm",
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this.$input = this.shadow.$(".confirmation-code");
      this.$section = this.shadow.$("app-auth-section");

      this._code = null;

      this.onChangeInputHanlde = this.onChangeInputHanlde.bind(this);
      this.inputFocus = this.inputFocus.bind(this);
      this.inputFocusOut = this.inputFocusOut.bind(this);
      this.onKeydownPhoneHandler = this.onKeydownPhoneHandler.bind(this);
      this.onPasteHandle = this.onPasteHandle.bind(this);
    }

    connectedCallback() {
      const {
        userInfo
      } = store.getState();

      this.player = this.$section.player;
      this.$section.setAttribute('heading', userInfo.temporaryPhone);

      core.on("change", this.onChangeInputHanlde, this.$input);
      core.on("focus", this.onChangeInputHanlde, this.$input);
      core.on("focusin", this.inputFocus, this.$input);
      core.on("focusout", this.inputFocusOut, this.$input);
      core.on("keydown", this.onKeydownPhoneHandler, this.$input);
      core.on("paste", this.onPasteHandle, this.$input);
    }

    disconnectedCallback() {
      core.off("change", this.onChangeInputHanlde, this.$input);
      core.off("focus", this.onChangeInputHanlde, this.$input);
      core.off("focusin", this.inputFocus, this.$input);
      core.off("focusout", this.inputFocusOut, this.$input);
      core.off("keydown", this.onKeydownPhoneHandler, this.$input);
      core.off("paste", this.onPasteHandle, this.$input);

    }

    onChangeInputHanlde(e) {
      const {
        detail: {
          value
        }
      } = e;
      this._code = String(value);
    }

    onKeydownPhoneHandler(e) {
      if (e.keyCode === 13) {
        this._code = String(e.target.$input.value);
        this.onSubmitHandle();
      }
    }

    onPasteHandle(e) {
      console.log('paste')
      catchPaste(e, this, code => {
        this._code = code;
        this.onSubmitHandle();
      });
    }

    onSubmitHandle() {
      if (!this._code || this._code.length < 1) {
        this.$input.$input.focus();
        return false;
      }

      api.send({
        "@type": "checkAuthenticationCode",
        code: this._code
      });
    }

    inputFocus() {
      const stikerPath = "./public/images/TwoFactorSetupMonkeyTracking.tgs";

      if (this.player) {
        this.player.load(stikerPath);
        this.player.setLooping(true);
      }
    }

    inputFocusOut(e) {
      if (this.player) {
        this.player.load(this.$section.getAttribute("img-src"));
        this.player.setLooping(false);
      }
    }
  }
);