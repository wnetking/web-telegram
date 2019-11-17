import core, { Element } from '../../../services/api/core';

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: inline-flex;
    padding: 10px;
    border-radius: 10px;
    word-break: break-word;
    line-height: 1.3;
  }
</style>
<div></div>
`;

core.define(
  'app-chat-message',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this._message = null;
      this.$wrap = this.shadow.$('div');
    }

    connectedCallback() {
      this.render();
    }

    set message(value) {
      this._message = value;
    }

    getContent() {
      if (!this._message) {
        return '';
      }
      const message = this._message.content.text;

      if (message) {
        return message.text;
      } else {
        return 'not support yet';
      }
    }

    render() {
      this.$wrap.innerHTML = this.getContent();
    }
  }
);
