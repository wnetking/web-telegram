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

  api
    .send({
      '@type': 'getChats',
      ...params
    })
    .then(data => {
      setChatIds(data.chat_ids);

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
