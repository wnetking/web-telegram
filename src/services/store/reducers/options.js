const initialState = {};

module.exports = function(state = initialState, action) {
  switch (action.type) {
    case 'option.updateOption':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      };

    default:
      return state;
  }
};
