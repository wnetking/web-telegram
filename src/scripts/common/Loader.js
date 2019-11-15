import { trans } from '../../services';
import core, { Element } from '../../services/api/core';

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

  span.big{
    width: 40px;
    height: 40px;
    border-color: #4da3f6;
    border-top-color: transparent;
    border-width: 3px;
  }

  @keyframes loadingspin {
    100% {
        transform: rotate(360deg)
    }
  }
</style>
<span></span>
`;

core.define(
  'app-loader',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this.$span = this.shadow.$('span');

      if (this.hasAttribute('big')) {
        this.$span.classList.add('big');
      }
    }
  }
);
