import api from '../index';
import core from '../core';

const PRIORITY = 1;

class FileController {
  constructor() {
    this.blobs = new Map();
    this.urls = new WeakMap();
    this.downloads = new Map();
  }

  getBlob(fileId) {
    return blobs.get(fileId);
  };

  setBlob(fileId, blob) {
    this.blobs.set(fileId, blob);
  };

  getBlobUrl(blob) {
    if (!blob) {
      return null;
    }

    if (this.urls.has(blob)) {
      return this.urls.get(blob);
    }

    const url = URL.createObjectURL(blob);
    this.urls.set(blob, url);

    return url;
  };


  download(id) {
    if (this.downloads.has(id)) {
      return true;
    }

    api.send({
      '@type': 'downloadFile',
      file_id: id,
      priority: PRIORITY,
    });

    this.downloads.set(id, true)

    return false;
  }

  get(file, eventNameEmmit = 'file.uploadFile') {
    if (!file) {
      return;
    }

    if (!this.download(file.id)) {
      return;
    }

    (async (file) => {
      const response = await api.send({
        '@type': 'readFile',
        file_id: file.id
      });

      this.setBlob(file.id, response.data);
      const url = this.getBlobUrl(response.data, file.id);

      core.emmit(eventNameEmmit, { file_id: file.id, file_url: url })
    })(file).catch(err => err)
  }
}

const fileController = new FileController();

export default fileController;