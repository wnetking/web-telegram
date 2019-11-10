import { combineReducers } from 'redux';

function lastAction(state = null, action) {
  return action;
}

const combinedReducer = combineReducers({
  chatList: require('./chatsList'),
  chat: require('./chat'),
  userInfo : require('./userInfo'),
  lastAction
});

export default combinedReducer;
