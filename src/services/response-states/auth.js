import { push } from '../router';
import core from '../api/core';
import * as a from '../store/actions/userInfo.js';
import { updateOption } from '../store/actions/options';

function chechAuthState(update) {
  if (update['@type'] === 'updateOption') {
    const { name, value } = update;
    updateOption(name, value);
  }

  if (update['@type'] === 'updateFile') {
    core.emmit('file.updateFile', update);
  }

  console.log(update);
  switch (update['@type']) {
    case 'updateAuthorizationState':
      switch (update.authorization_state['@type']) {
        case 'authorizationStateReady':
          a.authorizationStateReady();
          push('#/chat');
          break;
        case 'authorizationStateWaitPhoneNumber':
          a.authorizationStateWaitPhoneNumber();
          push('#/auth');
          break;
        case 'authorizationStateClosed':
          a.authorizationStateClosed();
          push('#/auth');
          break;
        case 'authorizationStateWaitCode':
          a.authorizationStateWaitCode();
          a.setTemploaryPhone(update.authorization_state.code_info.phone_number)
          push('#/code-confirm');
          break;
        case 'authorizationStateWaitPassword':
          a.authorizationStateWaitPassword();
          push('#/password');
          break;
        case 'authorizationStateWaitRegistration':
          push('#/registration');
          break;
      }
      break;

    default:
      break;
  }
}

export default chechAuthState;
