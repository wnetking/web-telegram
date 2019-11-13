import api from '../../api';
import core from '../../api/core';
import fileController from '../../api/controllers/FileController';
import { bindActionCreators } from 'redux';
import { dispatch } from '../';



export const downloadFile = (file) => {
  fileController.get(file);
};