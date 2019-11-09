import {
  push
} from '../router'

function chechAuthState(update) {

  console.log(update);

  switch (update['@type']) {
    case 'updateAuthorizationState':

      switch (update.authorization_state['@type']) {
        case "authorizationStateReady":
          push('#/chat');
          break;
        case "authorizationStateWaitPhoneNumber":
          push('#/auth');
          break;
        case "authorizationStateClosed":
          push('#/auth');
          break;
        case "authorizationStateWaitCode":
          push('#/code-confirm');
          break;
      }
      break;

    default:
      break;
  }

}


export default chechAuthState;