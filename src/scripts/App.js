import store from '../services/store';
import {
  api,
} from '../services/';
import core, {
  Element
} from '../services/api/core';
import {
  routes,
  Router,
  push
} from '../services/router';
import {
  getCookie,
  deleteCookie
} from '../utils/common';

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
    }

    connectedCallback() {
      this.router.init();
      this.logOut();
    }

    logOut() {
      if (getCookie('activeSession') && !getCookie('keepMeAuth')) {
        api.send({
          '@type': 'logOut',
        }).then(() => {
          deleteCookie('activeSession');
        });
      }
    }
  }
);