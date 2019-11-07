import { routes, push } from '../services/router';
// import TdLibController from '../controllers/TdLibController.js';

// Отпрвка кода  на мой телефон
// TdLibController.send({
//   '@type': 'setAuthenticationPhoneNumber',
//   // Твой телефон
//   phone_number: "+380934282332"
// })

const template = document.createElement('template');

template.innerHTML = `
    <style>
    app-auth-section app-input, app-auth-section button{
      width: 100%;
      margin-bottom: 25px;
    }
    </style>
    <main id="app" class="main-container">Main page</main>
`;

window.customElements.define(
  'main-app',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({
        mode: 'open'
      });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._isAuth = false;

      this.$app = this._shadowRoot.getElementById('app');
    }

    connectedCallback() {
      window.addEventListener('popstate', () => {
        const hash = window.location.hash;
        this.render(hash);
      });

      if (this._isAuth) {
        this.render('/');
      } else {
        push('/#/auth');
      }
    }

    static get observedAttributes() {
      return ['is-auth'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'is-auth') {
        this.isAuth = newVal;
      }
    }

    get isAuth() {
      return this._isAuth;
    }

    set isAuth(value = false) {
      this._isAuth = value;

      this.render();
    }

    render(path) {
      if (routes[path]) {
        this.$app.innerHTML = routes[path];
      }
    }
  }
);
