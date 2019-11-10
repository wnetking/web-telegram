import {
  trans
} from '../../services';
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
          width: 160px;
          height: 160px;
          margin-top: 108px;
          margin-bottom: 17px;
          margin-left: auto;
          margin-right: auto;
        }

        h2 {
          margin-bottom: 17px;
          font-size: 30px;
          user-select: none;
        }

        p {
          margin-bottom: 50px;
          padding: 0 55px;
          color: #b9bbbd;
          font-size: 15px;
          line-height: 20px;
          user-select: none;
        }

        app-input, button{
          width: 100%;
          margin-bottom: 25px;
        }
    </style>
      <section class="section tc">
        <h2></h2>
        <p></p>
        <div>
          <slot></slot>
        </div>
      </section>
`;

window.customElements.define(
  'app-auth-section',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({
        mode: 'open'
      });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$heading = this._shadowRoot.querySelector('h2');
      this.$section = this._shadowRoot.querySelector('section');
      this.$desc = this._shadowRoot.querySelector('p');
      this.isAminatedSticker = false;

      if (this.hasAttribute('heading')) {
        this.$heading.innerHTML = this.getAttribute('heading');
      }

      if (this.hasAttribute('desc')) {
        this.$desc.innerHTML = this.getAttribute('desc');
      }

      if (this.hasAttribute('img-src')) {
        const src = this.getAttribute('img-src');
        this.isAminatedSticker = src.indexOf('.tgs') !== -1;
        this.$section.insertAdjacentHTML(
          'afterbegin',
          this.getImageTemplate(src)
        );
      }

      this.player = this._shadowRoot.querySelector('tgs-player');
    }

    getImageTemplate(src) {
      if (this.isAminatedSticker) {
        return `
        <tgs-player
          width="160" height="160"
          class="main-logo"
          autoplay
          mode="bounce"
          direction='2'
          src="${src}"
        >
        </tgs-player>
      `;
      }

      return `<img src="${src}" alt="image" width="160" height="160" class="main-logo"/>`;
    }

    connectedCallback() {
      if (this.isAminatedSticker) {
        this.player = this._shadowRoot.querySelector('tgs-player');
      }
    }

    static get observedAttributes() {
      return ['heading', 'desc', 'img-src'];
    }

    attributeChangedCallback(name, oldVal, newVal) {}
  }
);