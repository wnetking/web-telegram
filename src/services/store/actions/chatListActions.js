import api from '../../api';
import { bindActionCreators } from 'redux';
import { dispatch } from '../';

export const setChatIds = bindActionCreators(
  chat_ids => ({
    type: 'chatList.setChatIds',
    payload: {
      chat_ids
    }
  }),
  dispatch
);

export const setChatInfo = bindActionCreators(
  (id, data) => ({
    type: 'chatList.setChatInfo',
    payload: {
      [id]: data
    }
  }),
  dispatch
);

export const setRequestSettings = bindActionCreators(
  params => ({
    type: 'chatList.setRequestSettings',
    payload: {
      params
    }
  }),
  dispatch
);

export const getChatAction = params => {
  setRequestSettings(params);

  const { callback, ...rest } = params;
  api
    .send({
      '@type': 'getChats',
      ...rest
    })
    .then(data => {
      setChatIds(data.chat_ids);

      if (callback) {
        callback();
      }

      data.chat_ids && data.chat_ids.forEach(loadChatAction);
    });
};

export const loadChatAction = chat_id => {
  api
    .send({
      '@type': 'getChat',
      chat_id
    })
    .then(data => {
      setChatInfo(chat_id, data);
    });
};

let isLoadMoreChats = false;

export const getChatListOnScroll = (e) => {
  const target = e.target;

  if (!target) {
    return false;
  }

  const scrollTop = target.scrollTop;
  const clientHeight = target.clientHeight;
  const scrollHeight = target.scrollHeight;

  const scrollTopReal = scrollHeight - (scrollTop + clientHeight);

  if (scrollTopReal < 200) {
    const lastChild = target.lastChild;

    if (!lastChild || isLoadMoreChats) {
      return;
    }

    const offset_chat_id = lastChild._data.id;
    const offset_order = lastChild._data.order;
    isLoadMoreChats = true;

    getChatAction({
      offset_chat_id,
      offset_order,
      limit: 30,
      callback: () => {
        isLoadMoreChats = false;
      }
    });

  }
}