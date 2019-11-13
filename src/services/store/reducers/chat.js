const initialState = {
  data: {},
  currentChat: {},
  currentChatMessages: {},
  loading: false,
  requestParams: {},
  activeChatId: null
};

module.exports = function (state = initialState, action) {
  switch (action.type) {
    case 'chat.setChatInfo':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        }
      };
    case 'chat.setChatHistoryToStore':
      return {
        ...state,
        currentChatMessages: {
          ...state.currentChatMessages,
          ...action.payload.data
        },
        activeChatId: action.payload.chat_id
      };
    default:
      return state;
  }
};
