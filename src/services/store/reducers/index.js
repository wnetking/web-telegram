import { combineReducers } from 'redux';

function lastAction(state = null, action) {
  return action;
}

const combinedReducer = combineReducers({
  chatList: require('./chatsList'),
  chat: require('./chat'),
  lastAction
});

export default combinedReducer;
