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
  class extends AppElement {
    constructor() {
      super();
      this.appendChild(template.content.cloneNode(true));

      this.$app = document.getElementById('app');
      this.router = new Router(this.$app, routes, store);
      // Закрытие окна
      window.addEventListener('beforeunload', this.beforeunloadHandler.bind(this))
    }

    connectedCallback() {
      this.router.init();
    }

    beforeunloadHandler(){
      api.send({ '@type': 'logOut' });
    }

    render(path) {}
  }
);
