import { trans } from '../../services';
import core, { Element } from '../../services/api/core';
import * as a from '../../services/store/actions/authActions';

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
  <app-crop-modal></app-crop-modal>
  <app-auth-section heading="${t.registration_name}" desc="${t.registration_desc}">
    <app-input data-error-event='emty_first_name' type="text" class='set-profile-name' label="${t.name}"></app-input>
    <app-input type="text" class='set-profile-lastname' label="${t.last_name}"></app-input>         
    <app-button class='set-profile-submit'>${t.start_messanging.toUpperCase()}</app-button>
  </app-auth-section>
</div>
`;

core.define(
  'app-registration',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);

      this.$name_input = this.shadow.$('.set-profile-name');
      this.$lastname_input = this.shadow.$('.set-profile-lastname');
      this.$button = this.shadow.$('.set-profile-submit');
      this.$file_label = this.shadow.$('.file-label');
      this.$file = this.shadow.$('app-crop-modal');

      this.name = null;
      this.lastName = null;

      this.onChangeName = this.onChangeName.bind(this);
      this.onKeyDownHandle = this.onKeyDownHandle.bind(this);
      this.onChangeLastName = this.onChangeLastName.bind(this);
      this.onKeyDownHandle = this.onKeyDownHandle.bind(this);
      this.onSubmitHandle = this.onSubmitHandle.bind(this);
      this.onClickLabelFile = this.onClickLabelFile.bind(this);
    }

    connectedCallback() {
      core.on('change', this.onChangeName, this.$name_input);
      core.on('keydown', this.onKeyDownHandle, this.$name_input);
      core.on('change', this.onChangeLastName, this.$lastname_input);
      core.on('keydown', this.onKeyDownHandle, this.$lastname_input);
      core.on('click', this.onSubmitHandle, this.$button);
    }

    disconnectedCallback() {
      core.off('change', this.onChangeName, this.$name_input);
      core.off('keydown', this.onKeyDownHandle, this.$name_input);
      core.off('change', this.onChangeLastName, this.$lastname_input);
      core.off('keydown', this.onKeyDownHandle, this.$lastname_input);
      core.off('click', this.onSubmitHandle, this.$button);
      core.off('click', this.onClickLabelFile, this.$file_label);
    }

    onChangeName(e) {
      const {
        detail: {
          value
        }
      } = e;
      this.name = String(value);
    }

    onChangeLastName(e) {
      const {
        detail: {
          value
        }
      } = e;
      this.lastName = String(value);
    }

    onKeyDownHandle(e) {
      if (e.keyCode === 13) {
        this.name = String(this.$name_input.$input.value);
        this.lastName = String(this.$lastname_input.$input.value) || '';
        this.onSubmitHandle();
      }
    }

    onClickLabelFile() {
      this.$file.$input.click();
    }

    onSubmitHandle() {
      const fileToSend = this.$file.blopImage;

      if (!this.name || this.name.length < 1) {
        this.$name_input.$input.focus();
        return false;
      }

      a.registrationUser({
        first_name: this.name,
        last_name: this.lastName,
        file: fileToSend
      })

      // ; (async (file) => {
      //   const responce = await api.send({
      //     '@type': 'registerUser',
      //     first_name: this.name,
      //     last_name: this.lastName
      //   })

      //   if (responce['@type'] === 'ok' && fileToSend) {
      //     const responce = await api.send({
      //       '@type': 'setProfilePhoto',
      //       photo: {
      //         "@type": 'inputFileBlob',
      //         data: fileToSend,
      //         name: 'profilePhoto'
      //       },
      //     })
      //   }
      // })().catch(e => console.error(e))
    }
  }
)