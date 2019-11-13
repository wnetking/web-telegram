import { bindActionCreators } from 'redux';
import { dispatch } from '../';

export const updateOption = bindActionCreators(
  (name, value) => ({
    type: 'option.updateOption',
    payload: { name, value }
  }),
  dispatch
);
