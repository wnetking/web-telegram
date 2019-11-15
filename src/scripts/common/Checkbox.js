import {
  trans
} from '../../services';
import core, {
  Element
} from '../../services/api/core';

const t = trans('core');
const template = document.createElement('template');

template.innerHTML = `
<style>
  .app-checkbox{
    text-align: left;
    margin-left : 20px;
    margin-bottom: 35px;
  }


  .container {
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 16px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .container .label-text{
    padding-left: 45px;
  }

  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 15px;
    width: 15px;
    background-color: #e6e7ea;
    border-radius: 3px;
  }

  .container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  .container input:checked ~ .checkmark {
    background-color: #4ca3f6;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }


  .container input:checked ~ .checkmark:after {
    display: block;
  }

  .container .checkmark:after {
    left: 5px;
    top: 0px;
    width: 3px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style>
</style>
  <div class='app-checkbox'>
    <label class="container">
      <input type='checkbox' name='app-checkbox' />
      <span class='checkmark'></span>
    </label>
  </div>
`;

core.define(
  'app-checkbox',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this.$wrapper = this.shadow.$('.app-checkbox');
      this.$label = this.shadow.$('label');
      this.$checkbox = this.shadow.$('[type="checkbox"]');
    }

    connectedCallback() {
      core.on('change', this.changeHandler.bind(this), this.$checkbox);
      if (this.hasAttribute('is-checked')) {
        const isChecked = this.getAttribute('is-checked') == 'false' ? false : true;
        this.setAttributesForCheckox(isChecked);
      }
      if (this.hasAttribute('label-text')) {
        this.setLabelText();
      }
    }

    disconnectedCallback() {
      core.off('change', this.changeHandler.bind(this), this.$checkbox);
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'is-checked' && oldVal !== newVal) {
        this.setAttributeForCheckox(newVal)
      }
    }

    static get observedAttributes() {
      return ['is-checked'];
    }

    setAttributesForCheckox(isChecked) {
      this.$checkbox.value = isChecked;
    }

    setLabelText() {
      const span = document.createElement("span");
      span.classList.add('label-text')
      span.innerHTML = this.getAttribute('label-text');
      this.$label.appendChild(span);
    }

    changeHandler(e) {
      const event = new CustomEvent('change', {
        detail: {
          value: e.target.checked,
          target: e.target
        }
      });
      this.dispatchEvent(event);
    }
  }

);