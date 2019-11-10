import api from '../../api';
import { bindActionCreators } from 'redux';
import { dispatch } from '../';

export const getChatHistory = (params = {}) => {
  // api.send({
  //   '@type': 'openChat',
  //   chat_id: params.chat_id
  // });

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
