const template = document.createElement('template');

template.innerHTML = `
    <style>
        :host {
            display: inline-block;
            font-family: sans-serif;
        }
        .input-wrap{
          position: relative;
        }

        input {
          box-sizing: border-box;
          display: inline-block;
          width: 100%;
          padding: 18px;
          border: 1px solid #e6e7ea;
          border-radius: 10px;
          outline: none !important;
        }

        input.has-error{
          border-color: #e54035;
        }

        input.has-error:focus {
          border: 1px solid #e54035;
          box-shadow: 0 0 0 1px #e54035;
        }

        input:focus {
          border: 1px solid #4da3f6;
          box-shadow: 0 0 0 1px #4da3f6;
        }
        
        label {
          position:absolute;
          top: 50%;
          left: 20px;
          transform: translateY(-50%);
          transition: all 0.1s ease-out; 
          color: #b0b9c0;
          background-color:#fff;
        }

        input.with-value + label {
          font-size: 12px;
          top: 0px;
          transform: translateY(-50%);
          padding: 0 5px;
          color: #4da3f6;
        }
        input.with-value.has-error + label {
          color: #e54035;
        }
    </style>
    <div class="input-wrap">
      <input type="text" id="my-checkbox"/>
      <label for="my-checkbox"></label>
    </div>
`;

window.customElements.define(
  'app-input',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this.$input = this._shadowRoot.querySelector('input');
      this.$label = this._shadowRoot.querySelector('label');

      this.customAttr = ['label'];
      this.value = this.hasAttribute('value') ? this.getAttribute('value') : '';

      if (this.value) {
        this.$input.classList.add('with-value');
      }

      if (this.hasAttribute('label')) {
        this.$label.innerHTML = this.getAttribute('label');
      }

      this.setErrorState();
    }

    connectedCallback() {
      if (!this.attributes.length) {
        return;
      }

      const attributes = Object.values(this.attributes);

      attributes.forEach(attr => {
        if (!this.customAttr.includes(attr.name)) {
          this.$input.setAttribute(attr.name, attr.value);
        }
      });

      this.$input.addEventListener('keyup', e => {
        const value = e.target.value;

        if (value) {
          this.$input.classList.add('with-value');
        } else {
          this.$input.classList.remove('with-value');
          this.resetErrorState();
        }

        var event = new KeyboardEvent('keyup', e);
        this.dispatchEvent(event);
      });

      this.$input.addEventListener('change', e => {
        var event = new CustomEvent('change', {
          detail: { value: e.target.value, target: e.target }
        });
        this.dispatchEvent(event);
      });
    }

    setErrorState() {
      if (this.hasAttribute('has-error')) {
        this.$input.classList.add('has-error');

        if (this.hasAttribute('error-message')) {
          this.$label.innerHTML = this.getAttribute('error-message');
        }
      }
    }

    resetErrorState() {
      this.$input.classList.remove('has-error');
      this.$label.innerHTML = this.getAttribute('label');
    }

    static get observedAttributes() {
      return ['has-error'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'has-error' && newVal === true) {
        this.setErrorState();
      }

      if (name === 'has-error' && newVal === false) {
        this.resetErrorState();
      }
    }
  }
);
