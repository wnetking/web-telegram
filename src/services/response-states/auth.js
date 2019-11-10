import {
  push
} from '../router';
import * as a from '../store/actions/userInfo.js';

function chechAuthState(update) {
  console.log(update);

  switch (update['@type']) {
    case 'updateAuthorizationState':
      switch (update.authorization_state['@type']) {
        case 'authorizationStateReady':
          a.authorizationStateReady();
          push('#/chat');
          break;
        case 'authorizationStateWaitPhoneNumber':
          a.authorizationStateWaitPhoneNumber()
          push('#/auth');
          break;
        case 'authorizationStateClosed':
          a.authorizationStateClosed()
          push('#/auth');
          break;
        case 'authorizationStateWaitCode':
          a.authorizationStateWaitCode();
          push('#/code-confirm');
          break;
      }
      break;

    default:
      break;
  }
}

export default chechAuthState;