import store from '../services/store';
import { routes, push, Router } from '../services/router';

import { api } from '../services/';

api.init();
api.sendTdParameters();
// Needed for correct another request
api.send({
  '@type': 'checkDatabaseEncryptionKey'
});

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
      this.appendChild(template.content.cloneNode(true));

      this._isAuth = false;
      this.$app = document.getElementById('app');
      this.router = new Router(this.$app, routes, store);
    }

    connectedCallback() {
      this.router.init();

      if (this._isAuth) {
        push('/');
      } else {
        push('/#/chat');
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

      push('/');
    }

    render(path) {}
  }
);
