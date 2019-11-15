import { bindActionCreators } from 'redux';
import { dispatch } from '../';

export const authorizationStateReady = bindActionCreators(
  () => ({
    type: 'auth.authorizationStateReady',
  }),
  dispatch
);

export const authorizationStateWaitPhoneNumber = bindActionCreators(
  () => ({
    type: 'auth.authorizationStateWaitPhoneNumber',
  }),
  dispatch
);

export const authorizationStateClosed = bindActionCreators(
  () => ({
    type: 'auth.authorizationStateClosed',
  }),
  dispatch
);

export const authorizationStateWaitCode = bindActionCreators(
  () => ({
    type: 'auth.authorizationStateWaitCode',
  }),
  dispatch
);

export const authorizationStateWaitPassword = bindActionCreators(
  () => ({
    type: 'auth.authorizationStateWaitPassword',
  }),
  dispatch
);

export const setTemploaryPhone = bindActionCreators(
  (phone) => ({
    type: 'auth.setTemploaryPhone',
    payload : phone
  }),
  dispatch
)