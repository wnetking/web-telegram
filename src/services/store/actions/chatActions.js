import api from '../../api';
import { bindActionCreators } from 'redux';
import { dispatch } from '../';

export const getChatHistory = (params = {}) => {
  // api.send({
  //   '@type': 'openChat',
  //   chat_id: params.chat_id
  // });
  getChatHistoryRequest();

  api
    .send({
      '@type': 'getChatHistory',
      ...params,
      offset: 0,
      limit: 50
    })
    .then(data => {
      setChatHistoryToStore(params.chat_id, data);
    });
};

let isLoadMoreMessages = false;
export const getChatHistoryOnScroll = e => {
  const target = e.target;

  if (!target) {
    return false;
  }

  const scrollTop = target.scrollTop;

  if (scrollTop < 200) {
    const lastMessage = target._shadowRoot.querySelector('app-chat-message');

    if (!lastMessage || isLoadMoreMessages) {
      return;
    }

    const chat_id = lastMessage._message.chat_id;
    const from_message_id = lastMessage._message.id;
    isLoadMoreMessages = true;

    api
      .send({
        '@type': 'getChatHistory',
        chat_id,
        from_message_id,
        offset: 0,
        limit: 50
      })
      .then(data => {
        updateChatHistory(data);
        isLoadMoreMessages = false;
      });
  }
};

const updateChatHistory = bindActionCreators(
  data => ({
    type: 'chat.updateChatHistory',
    payload: data
  }),
  dispatch
);

const getChatHistoryRequest = bindActionCreators(
  () => ({ type: 'chat.getChatHistoryRequest' }),
  dispatch
);

const setChatHistoryToStore = bindActionCreators(
  (chat_id, data) => ({
    type: 'chat.setChatHistoryToStore',
    payload: {
      chat_id,
      data
    }
  }),
  dispatch
);
