import {
  push
} from '../router'

function checkMainState(update) {

  console.log(update);

  switch(update['@type']){
    case 'updateAuthorizationState' : 
      if(update.authorization_state['@type'] === "authorizationStateReady"){
        push('#/chat')
      }; break;

    default : break;
  }
  
}


export default checkMainState;