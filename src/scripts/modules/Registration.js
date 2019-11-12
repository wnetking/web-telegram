import {
  trans,
  api
} from '../../services';

const t = trans('auth');
const template = document.createElement('template');

template.innerHTML = `
    <style>
    app-input, app-button{
      width: 100%;
      margin-bottom: 25px;
    }

    .registration-wrapper{
      height : 100%;
    }

    .file-wrapper{
      margin-top: 108px;
      margin-bottom: 17px;
    }

    .file-wrapper .section{
      max-width: 355px;
    }
    .file-wrapper .tc{
      text-align: center;
      margin: 0 auto;
    }

    .file-wrapper app-input[type="file"]{
      display: none;
    }

    .file-wrapper .file-label{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 160px;
      width: 160px;
      background-color: #4da3f6;
      border-radius: 50%;
      margin: 0 auto;
    }

    .file-wrapper .file-label app-icon{
      color: #fff;
      font-size: 50px;
    }

    </style>
    <div class='registration-wrapper'>
      <div class='file-wrapper'>
        <div class='section tc'>
          <app-input type="file" id='set-profile-image'></app-input>
          <div class='file-label'>
            <app-icon icon='cameraadd_svg'></app-icon>
          </div>
        </div>
      </div>
      <app-auth-section heading="${t.registration_name}" desc="${t.registration_desc}">
        <app-input type="text" class='set-profile-name' label="${t.name}"></app-input>
        <app-input type="text" class='set-profile-lastname' label="${t.last_name}"></app-input>         
        <app-button class='set-profile-submit'>${t.start_messanging.toUpperCase()}</app-button>
      </app-auth-section>
    </div>
`;

window.customElements.define(
  'app-registration',
  class extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({
        mode: 'open'
      });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this.$name_input = this._shadowRoot.querySelector('.set-profile-name');
      this.$lastname_input = this._shadowRoot.querySelector('.set-profile-lastname');
      this.$button = this._shadowRoot.querySelector('.set-profile-submit');
      this.$file_label = this._shadowRoot.querySelector('.file-label');
      this.$file = this._shadowRoot.querySelector('[type="file"]');

      this.$name_input.addEventListener('change', this.onChangeName.bind(this));
      this.$lastname_input.addEventListener('change', this.onChangeLastName.bind(this));
      this.$button.addEventListener('click', this.onSubmitButton.bind(this));
      this.$file_label.addEventListener('click', this.onClickLabelFile.bind(this));

      this.name = null;
      this.lastName = null;
    }

    disconnectedCallback() {
      this.$name_input.removeEventListener('change', this.onChangeName.bind(this));
      this.$lastname_input.removeEventListener('change', this.onChangeLastName.bind(this));
      this.$button.removeEventListener('click', this.onSubmitButton.bind(this));
      this.$file_label.removeEventListener('click', this.onClickLabelFile.bind(this));
    }

    onChangeName(e) {
      const {
        detail: {
          value
        }
      } = e;
      this.name = value;
    }

    onChangeLastName(e) {
      const {
        detail: {
          value
        }
      } = e;
      this.lastName = value
    }

    onClickLabelFile() {
      this.$file.click();
    }

    onSubmitButton() {
      api.send({
        '@type': 'registerUser',
        first_name: this.name,
        last_name: this.lastName
      })
    }
  }
)