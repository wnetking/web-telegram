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

        input:focus {
          border: 1px solid #4da3f6;
          box-shadow: 0 0 2px #4da3f6;
        }
        
        label {
          position:absolute;
          top: 50%;
          left: 18px;
          transform: translateY(-50%);
          transition: all 0.3s ease; 
          color: #b0b9c0;
          background-color:#fff;
        }

        input:focus + label {
          font-size: 12px;
          top: 0px;
          transform: translateY(-50%);
          padding: 0 5px;
          color: #4da3f6;
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

      if (this.hasAttribute('label')) {
        this.$label.innerHTML = this.getAttribute('label');
      }
    }
  }
);
