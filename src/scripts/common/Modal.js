import core, { Element } from '../../services/api/core';

const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
 position: relative;
 z-index: 10;
}
.wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.1);
  transition: visibility 0s linear .25s,opacity .25s 0s,transform .25s;
  z-index: 1;
}
.visible {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s,opacity .25s 0s,transform .25s;
}
.modal {
  font-size: 14px;
  padding: 17px 25px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-radius: 10px;
  max-width: 445px;
}

.title {
  font-size: 18px;
}
.button-container {
  text-align: right;
}

.cancel {
  position: absolute;
  top: 17px;
  left: 19px;
  background: none;
  border: none;
  color:white;
  cursor: pointer;
  font-size: 22px;
  color: #707478;
  outline: none;
}

.cancel:focus {
  color: #000;
}
</style>
<div class='wrapper'>
  <div class='modal'>
    <span class='title'></span>
    <div class='content'>
      <slot></slot>
    </div>
    <button class='cancel'><app-icon icon="close_svg"></app-icon></button>
  </div>
</div>`;

core.define('app-modal', class Modal extends Element {
  constructor() {
    super();
  }

  connectedCallback() {
    this._render();
    this._attachEventHandlers();
  }

  static get observedAttributes() {
    return ["visible", "title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title" && this.shadow) {
      this.shadow.$(".title").textContent = newValue;
    }
    if (name === "visible" && this.shadow) {
      if (newValue === null) {
        this.shadow.$(".wrapper").classList.remove("visible");
        this.emmit("close");
      } else {
        this.shadow.$(".wrapper").classList.add("visible");
        this.emmit("open")
      }
    }
  }

  get visible() {
    return this.hasAttribute("visible");
  }

  set visible(value) {
    if (value) {
      this.setAttribute("visible", "");
    } else {
      this.removeAttribute("visible");
    }
  }

  get title() {
    return this.getAttribute('title');
  }

  set title(value) {
    this.setAttribute('title', value);
  }

  _render() {
    this.makeShadow(template)
    this.$wrapp = this.shadow.$('.wrapper');

    if (this.visible) {
      this.$wrapp.classList.add('visible')
    } else {
      this.$wrapp.classList.remove('visible')
    }
  }

  _attachEventHandlers() {
    const cancelButton = this.shadow.$(".cancel");
    const okButton = this.shadow.$(".ok");

    cancelButton.addEventListener('click', e => {
      this.emmit("cancel")
      this.removeAttribute("visible");
    });
  }
})