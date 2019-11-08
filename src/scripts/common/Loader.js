import { trans } from '../../services';
const t = trans('core');

const template = document.createElement('template');

template.innerHTML = `
    <style>
    :host {
      display: inline-flex;
    }
    span {
      display: inline-block;
      pointer-events: none;
      width: 23px;
      height: 23px;
      border: 2px solid transparent;
      border-color: #eee;
      border-top-color: transparent;
      border-radius: 50%;
      animation: loadingspin 1s linear infinite;
    }
    
    @keyframes loadingspin {
      100% {
          transform: rotate(360deg)
      }
    }
    </style>
    <span></span>
`;

window.customElements.define(
  'app-loader',
  class extends HTMLElement {
    constructor() {
      super(); // always call super() first in the constructor.
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
);
