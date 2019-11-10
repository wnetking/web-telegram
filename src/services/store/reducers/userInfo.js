const initialState = {
  isUserAuth: false,
  authWaitPhoneNumber: false,
  authWaitCode: false,
  authHasErrors: false
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

    default:
      return state;
  }
};