import { trans } from '../../services';
import core, { Element } from '../../services/api/core';

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
  <div class='heading-wrapper'>
    <h2></h2>
  </div>
  <p></p>
  <div>
    <slot></slot>
  </div>
</section>
`;

core.define(
  'app-auth-section',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this.$heading = this.shadow.$('h2');
      this.$section = this.shadow.$('section');
      this.$desc = this.shadow.$('p');

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

      this.player = this.shadow.$('tgs-player');
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

      return `<div class='img-wrapper'><img src="${src}" alt="image" width="160" height="160" class="main-logo"/></div>`;
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if(name == 'heading' && oldVal !== newVal){
        this.$heading.innerHTML = newVal;
      }
    }

    static get observedAttributes() {
      return ['heading'];
    }

    connectedCallback() {
      if (this.isAminatedSticker) {
        this.player = this.shadow.$('tgs-player');
      }
    }
  }
);