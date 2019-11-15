import { getMessage } from '../../../utils/getMessage';
import core, { Element } from '../../../services/api/core';

const template = document.createElement('template');
template.innerHTML = ``;

core.define(
  'app-chat-item-last-message',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this._data = null;
    }

    set message(val) {
      this._data = val;
      this.render();
    }

    render() {
      this.shadow.innerHTML = getMessage(this._data);
    }
  }
);
