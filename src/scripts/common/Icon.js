import core, { Element } from '../../services/api/core';

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: inline-flex;
  }

  .icon{
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
  }
</style>
<svg class="icon "><use xlink:href="#icon_chevron_down"></use></svg>
`;

core.define(
  'app-icon',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this.$wrap = this.shadow.$('use');
    }

    connectedCallback() {
      this.$wrap.setAttribute(
        'xlink:href',
        this.getIconPath(this.getAttribute('icon'))
      );
    }

    static get observedAttributes() {
      return ['icon'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'icon') {
        this.$wrap.setAttribute('xlink:href', this.getIconPath(newVal));
      }
    }

    getIconPath(icon) {
      return `./public/images/symbol-defs.svg#icon-${icon}`;
    }
  }
);
