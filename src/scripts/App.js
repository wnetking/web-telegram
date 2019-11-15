import store from '../services/store';
import { api } from '../services/';
import core, { Element } from '../services/api/core';
import { routes, Router } from '../services/router';

api.init();
api.sendTdParameters();
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

core.define(
  'main-app',
  class extends Element {
    constructor() {
      super();
      this.appendChild(template.content.cloneNode(true));
      this.$app = document.getElementById('app');
      this.router = new Router(this.$app, routes, store);
      window.addEventListener('beforeunload', this.beforeunloadHandler.bind(this))
    }

    connectedCallback() {
      this.router.init();
      // api.send({ '@type': 'logOut' });
    }

    beforeunloadHandler() {
      api.send({ '@type': 'logOut' });
    }
  }
);
