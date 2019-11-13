import * as a from '../../../services/store/actions/filesActions';

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

window.customElements.define(
  'app-chat-thumb',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._file = {};
      this.isFileUpdated = false;
      this.$img = this._shadowRoot.querySelector('img');
    }

    get file_id() {
      this.getAttribute('file_id')
    }

    set file(value) {
      this._file = value;
    }

    connectedCallback() {
      a.downloadFile(this._file);
      document.addEventListener('file.uploadFile', ({ detail }) => {
        if (!this._file) {
          return;
        }

        if (this._file.id === detail.file_id) {
          this.updateImage(detail.file_url);
        }
      });

      document.addEventListener('file.updateFile', ({ detail }) => {
        if (!this._file) {
          return;
        }


        if (detail.file.id === this._file.id) {
          a.downloadFile(this._file);
        }
      });
    }

    updateImage(url) {
      this.$img.setAttribute('src', url);
    }

    render() {

    }
  }
);
