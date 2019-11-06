import { trans } from '../../services';
import { push } from '../../services/router';
const t = trans('auth');

const template = document.createElement('template');

template.innerHTML = `
    <style>
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .section{
          max-width: 355px;
        }

        .tc {
          text-align: center;
        }

        .main-logo{
          max-width: 160px;
          margin-top: 108px;
          margin-bottom: 17px;
        }

        h2 {
          margin-bottom: 17px;
          font-size: 30px;
        }

        p {
          margin-bottom: 50px;
          padding: 0 55px;
          color: #b9bbbd;
          font-size: 15px;
          line-height: 20px;
        }

        app-input, button{
          width: 100%;
          margin-bottom: 25px;
        }
    </style>
      <section class="section tc">
        <img width="160" height="160" src='./public/images/telegram.svg' class="main-logo" alt="main logo"/>
        <h2>${t.password_header}</h2>
        <p>${t.password_desc}</p>
        <div>
        <app-input type="text" label="${t.country}"></app-input>
                
        <button is="app-button">${t.phone_submit}</button>
        </div>
      </section>
`;

window.customElements.define(
  'app-auth-password',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$submitButton = this._shadowRoot.querySelector('button');
      this.$submitButton.addEventListener('click', this._auth.bind(this));
    }

    _auth() {
      push('/#/code-confirm');
    }
  }
);
