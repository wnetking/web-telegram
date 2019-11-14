const template = document.createElement('template');

template.innerHTML = `
    <style>
        :host {
            display: inline-block;
            font-family: sans-serif;

            --focus-color: #4da3f6;
            --focus-error-color: #e54035;
          }
        * {
          box-sizing: border-box;
        }

        .input-wrap{
          position: relative;
        }

        input {
          box-sizing: border-box;
          display: inline-block;
          width: 100%;
          padding: 17px 18px;
          border: 1px solid #e6e7ea;
          border-radius: 10px;
          outline: none !important;
          font-size: 16px;
        }

        input.has-error{
          border-color: var(--focus-error-color);
        }

        input.has-error:focus {
          border: 1px solid var(--focus-error-color);
          box-shadow: 0 0 0 1px var(--focus-error-color);
        }

        input:focus {
          border: 1px solid var(--focus-color);
          box-shadow: 0 0 0 1px var(--focus-color);
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
          color: var(--focus-color);
        }
        button{
          position:absolute;
          top: 50%;
          right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          font-size:23px;
          outline: none;  
        }
        input.with-value.has-error + label {
          color: var(--focus-error-color);
        }
    </style>
    <div class="input-wrap">
      <input type="text" id="my-input"/>
      <label for="my-input"></label>
    </div>
`;


export class Input extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({
      mode: 'open'
    });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$input = this._shadowRoot.querySelector('input');
    this.$label = this._shadowRoot.querySelector('label');
    this.$inputWrap = this._shadowRoot.querySelector('.input-wrap');

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

  connectedCallback() {
    const attributes = Object.values(this.attributes);

    if (attributes.length) {
      attributes.forEach(attr => {
        if (!this.customAttr.includes(attr.name)) {
          this.$input.setAttribute(attr.name, attr.value);
        }
      });
    }

    if (this.getAttribute('type') === 'password') {
      this.typePasswordRendered();
    }

    if (this.hasAttribute('data-error-event')) {
      document.addEventListener(this.getAttribute('data-error-event'), this.customErrorHandle.bind(this))
    }

    this.$input.addEventListener('click', this.clickHandler.bind(this))
    this.$input.addEventListener('keyup', this.keyupHandler.bind(this));
    this.$input.addEventListener('change', this.changeHandler.bind(this));
    this.extendConnectedCallback();
  }

  disconnectedCallback() {
    this.$input.removeEventListener('click', this.clickHandler.bind(this))
    this.$input.removeEventListener('keyup', this.keyupHandler.bind(this));
    this.$input.removeEventListener('change', this.changeHandler.bind(this));
  }

  extendConnectedCallback() {

  }

  customErrorHandle(e) {
    const {
      detail: {
        message
      }
    } = e
    this.setAttribute('has-error', true);
    this.setAttribute('error-message', message);
  }

  typePasswordRendered() {
    const button = document.createElement('button');
    this.icon = document.createElement('app-icon');
    this.icon.setAttribute('icon', 'eye1_svg');
    button.appendChild(this.icon);
    button.addEventListener('click', this.togglePasswordType.bind(this));
    this.$inputWrap.appendChild(button);
  }

  /**
   * @description
   * @param {object} e
   */
  keyupHandler(e) {
    const value = e.target.value;

    if (value) {
      this.$input.classList.add('with-value');
    } else {
      this.$input.classList.remove('with-value');
      this.resetErrorState();
    }
  }

  clickHandler(e) {
    const event = new CustomEvent('click', {
      detail: {
        value: e.target.value,
        target: e.target
      }
    });
    this.dispatchEvent(event);
  }

  /**
   * @description
   * @param {object} e
   */
  changeHandler(e) {
    const event = new CustomEvent('change', {
      detail: {
        value: e.target.value,
        target: e.target
      }
    });
    this.dispatchEvent(event);
  }

  togglePasswordType(e) {
    const needShowPassword = this.$input.getAttribute('type') === 'password';

    if (needShowPassword) {
      this.$input.setAttribute('type', 'text');
      this.icon.setAttribute('icon', 'eye2_svg');
    } else {
      this.$input.setAttribute('type', 'password');
      this.icon.setAttribute('icon', 'eye1_svg');
    }

    const event = new CustomEvent('toggle-password', {
      detail: {
        isPasswordShow: needShowPassword
      }
    });
    this.dispatchEvent(event);
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
}
window.customElements.define(
  'app-input', Input
);