const initialState = {
  data: {},
  chat_ids: [],
  loading: false,
  requestParams: {}
};

module.exports = function(state = initialState, action) {
  switch (action.type) {
    case 'chatList.setChatInfo':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        }
      };
    case 'chatList.setChatIds':
      return {
        ...state,
        chat_ids: action.payload.chat_ids
      };
    case 'chatList.setRequestSettings':
      return {
        ...state,
        requestParams: action.payload.params
      };
    default:
      return state;
  }
};
