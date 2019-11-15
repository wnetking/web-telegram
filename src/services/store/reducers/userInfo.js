const initialState = {
  isUserAuth: false,
  authWaitPhoneNumber: false,
  authWaitCode: false,
  authWaitPassword: false,
  authHasErrors: false,
  temporaryPhone : null
};

module.exports = function (state = initialState, action) {
  switch (action.type) {
    case 'auth.authorizationStateReady':
      return {
        ...state,
        isUserAuth: true,
          authHasErrors: false
      };

    case 'auth.authorizationStateWaitPhoneNumber':
      return {
        ...state,
        authWaitPhoneNumber: true
      };

    case 'auth.authorizationStateClosed':
      return {
        ...state,
        isUserAuth: false,
        authHasErrors: true
      };

    case 'auth.authorizationStateWaitCode':
      return {
        ...state,
        authWaitCode: true
      };

    case 'auth.authorizationStateWaitPassword':
      return {
        ...state,
        authWaitPassword: true
      }

    case 'auth.setTemploaryPhone':
      return {
        ...state,
        temporaryPhone : action.payload
      }

    default:
      return state;
  }
};