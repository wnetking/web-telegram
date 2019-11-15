import * as a from '../../../services/store/actions/filesActions';
import core, { Element } from '../../../services/api/core';

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    position: relative;
  }
  * {
    box-sizing: border-box;
  }
  img {
    max-width: 100%;
    border-radius: 50%;
  }
</style>
<div class="thumb">
<img src="./public/images/telegram.svg" alt="thumb"/>
</div>
`;

core.define(
  'app-chat-thumb',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this._file = {};
      this.isFileUpdated = false;
      this.$img = this.shadow.$('img');
      this.uploadFile = this.uploadFile.bind(this);
      this.updateFile = this.updateFile.bind(this);
    }

    connectedCallback() {
      a.downloadFile(this._file);
      core.on('file.uploadFile', this.uploadFile);
      core.on('file.updateFile', this.updateFile);
    }

    disconnectedCallback() {
      core.off('file.uploadFile', this.uploadFile);
      core.off('file.updateFile', this.updateFile);
    }

    get file_id() {
      this.getAttribute('file_id')
    }

    set file(value) {
      this._file = value;
    }

    uploadFile({ detail }) {
      if (!this._file) {
        return;
      }

      if (this._file.id === detail.file_id) {
        this.updateImage(detail.file_url);
      }
    }

    updateFile({ detail }) {
      if (!this._file) {
        return;
      }


      if (detail.file.id === this._file.id) {
        a.downloadFile(this._file);
      }
    }

    updateImage(url) {
      this.$img.setAttribute('src', url);
    }
  }
);
