import { trans } from '../../services';
const t = trans('core');

const template = document.createElement('template');

template.innerHTML = `
    <style>
        :host {
            display: inline-block;
          }
          
        button {
          overflow: hidden;
          position: relative;
          display: inline-block;
          box-sizing: border-box;
          padding: 18px;
          width: 100%;
          border: none;
          border-radius: 10px;
          text-transform: uppercase;
          background-color: #4da3f6;
          color: #fff;
          outline: none;
          font-weight: 700;
          cursor: pointer;
          transition:background-color 0.2s ease-out;
         
        }

        .ripple{
          z-index: 1;
          position: absolute;
          background-color: #408acf;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          transition: transform 0.3s ease-out;
        }

        .ripple.run{
          transform: scale(30);
        }

        button:hover{
          background-color: #4696e1;
        }

        span{
          z-index: 2;
          position: relative;
        }

        app-loader{
          z-index: 2;
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
        }

    </style>
    <button><span><slot></slot></span></button>
`;

window.customElements.define(
  'app-button',
  class extends HTMLElement {
    constructor() {
      super(); // always call super() first in the constructor.
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$button = this._shadowRoot.querySelector('button');
      this.$span = this._shadowRoot.querySelector('span');

      this.$button.addEventListener('click', e =>
        this.drawRipple(e.offsetX, e.offsetY)
      );
    }

    connectedCallback() {
      if (this.hasAttribute('is-loading')) {
        this.loadingAttrRenderer();
      }
    }

    static get observedAttributes() {
      return ['is-loading'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'is-loading' && !this.hasAttribute('is-loading')) {
        this.removeLoadingAttrTemplate();
      }
    }

    removeLoadingAttrTemplate() {
      this.$loadingNode.remove();
      this.$button.appendChild(this.$detachContent);
      this.$loader.remove();
    }

    loadingAttrRenderer() {
      this.$detachContent = this.$span.cloneNode(true);
      this.$span.remove();
      this.$loadingNode = document.createElement('span');
      this.$loader = document.createElement('app-loader');
      this.$loadingNode.innerHTML = t.loading;
      this.$button.appendChild(this.$loadingNode);
      this.$button.appendChild(this.$loader);
    }

    drawRipple(x, y) {
      let div = document.createElement('div');
      div.classList.add('ripple');
      this.$button.prepend(div);
      div.style.top = `${y - div.clientHeight / 2}px`;
      div.style.left = `${x - div.clientWidth / 2}px`;
      div.classList.add('run');
      div.addEventListener('transitionend', e => div.remove());
    }
  }
);
