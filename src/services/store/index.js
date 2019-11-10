import { createStore, applyMiddleware } from 'redux';
import combineReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import middlewares from './middleware';
const initialState = {};
const store = createStore(
  combineReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

const { dispatch, subscribe } = store;

export { dispatch, subscribe };
export default store;
