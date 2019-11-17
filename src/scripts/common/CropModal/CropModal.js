import core, { Element } from '../../../services/api/core';
import trans from '../../../services/translates';

let Cropper = null;
const t = trans('auth');
const cropperCssPath = '@import url("./public/vendor/cropper.min.css")';
const template = document.createElement('template');
template.innerHTML = `
<style>
  
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  width: 160px;
  cursor: pointer;
  background-color: var(--primary-color);
  background-size: cover;
  border-radius: 50%;
  margin: 0 auto;
}

.file-label:before {
  z-index: 1;
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: none;
}

.file-label.with-cropp-image:before{
  display: block;
}

.file-label:focus {
  box-shadow: 0 0 2px var(--primary-color);
  outline: none;
}

.file-wrapper .file-label app-icon{
  z-index: 2;
  position: relative;
  color: var(--white);
  font-size: 50px;
}

#image{
  display: inline-block;
  width: 100%;
  max-width: 100%;
}

#result{
  margin: 0 45px;
  margin-bottom: 50px;
}

.ok {
  position: absolute;
  bottom: 16px;
  right: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0;
  width: 55px;
  height: 55px;
  border: none;
  border-radius: 100%;
  text-transform: uppercase;
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 25px;
  outline: none;
  font-weight: 700;
  cursor: pointer;
  transition:background-color 0.2s ease-out;
}

.ok:hover{
  background-color: var(--primary-color-darker);
}

img.with-cropped-image{
  display: block
}

h2 {
  margin-top: 0;
  margin-bottom: 27px;
  padding-left: 11px;
  text-align: left;
  font-size: 19px;
}
.cropper-view-box,
.cropper-face {
  border-radius: 50%;
}

#result .cropper-modal {
  background-color: var(--white);
  opacity: 0.8;
}

#result .cropper-view-box {
  outline: none;
}
</style>
<div class='file-wrapper'>
  <div class='section tc'>
    <app-input type="file"></app-input>
    <div class='file-label'>
      <app-icon icon='cameraadd_svg'></app-icon>
    </div>
  </div>

  <app-modal>
    <div id="result">
      <h2>${t.cropp_title}</h2>
      <img id="image" src="" alt="Cropp Image">
      <button class="ok">
        <app-icon icon="check_svg"></app-icon>
      </button>
    </div>
  </app-modal>
</div>
`;

core.define(
  'app-crop-modal',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this.$result = this.shadow.$('#result');
      this.$image = this.shadow.$('#image');
      this.$file = this.shadow.$('[type="file"]');
      this.$fileLable = this.shadow.$('.file-label');
      this.$modal = this.shadow.$('app-modal');
      this.$submitBtn = this.shadow.$('.ok');

      this.cropper = false;

      this.fileChangeHandler = this.fileChangeHandler.bind(this);
      this.onModalOpen = this.onModalOpen.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onLableClick = this.onLableClick.bind(this);
    }

    connectedCallback() {
      core.on('change', this.fileChangeHandler, this.$file);
      core.on('open', this.onModalOpen, this.$modal);
      core.on('click', this.onSubmit, this.$submitBtn);
      core.on('click', this.onLableClick, this.$fileLable);
    }

    onLableClick() {
      this.$file.$input.click();
    }

    fileChangeHandler(e) {
      const files = e.detail.target.files;
      const done = (url) => {
        this.$file.value = '';
        this.$image.src = url;
        this.$modal.visible = true;
      };
      let reader;
      let file;

      if (files && files.length > 0) {
        file = files[0];

        if (URL) {
          done(URL.createObjectURL(file));
        } else if (FileReader) {
          reader = new FileReader();
          reader.onload = function (e) {
            done(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }

    loadCropper(callback) {
      if (Cropper) {
        return callback(Cropper)
      }

      import('./cropper.js').then(({ default: cropper }) => {
        Cropper = cropper;
        return callback(Cropper)
      })
    }

    onModalOpen() {
      if (this.cropper) {
        this.cropper.destroy();
      }

      this.loadCropper((Cropper) => {
        this.cropper = new Cropper(this.$image, {
          aspectRatio: 1,
          viewMode: 1,
          movable: false,
          zoomable: false,
          rotatable: false,
          scalable: false,
          guides: false,
          background: false,
          highlight: false,
          cropBoxResizable: false,
          autoCropArea: 0.7,
          ready: () => {
            this.croppable = true;
          },
        });
      })

      const sheet = new CSSStyleSheet();
      sheet.replace(cropperCssPath)
        .then(sheet => {
          this.shadow.adoptedStyleSheets = [sheet];
        })
        .catch(err => {
          console.error('Failed to load:', err);
        });
    }

    onSubmit() {
      if (!this.croppable) {
        return;
      }

      const croppedCanvas = this.cropper.getCroppedCanvas();
      const roundedCanvas = getRoundedCanvas(croppedCanvas);
      this.dataURLImage = roundedCanvas.toDataURL();

      roundedCanvas.toBlob(blob => {
        this.blopImage = blob;
      })

      this.$fileLable.setAttribute("style", `background-image: url(${this.dataURLImage})`);
      this.$fileLable.classList.add("with-cropp-image");
      this.$modal.visible = false;
    }
  }
);


function getRoundedCanvas(sourceCanvas) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.drawImage(sourceCanvas, 0, 0, width, height);
  context.globalCompositeOperation = 'destination-in';
  context.beginPath();
  context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
  context.fill();
  return canvas;
}