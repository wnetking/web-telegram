import { createStore, applyMiddleware } from 'redux';
import combineReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {};
const store = createStore(
  combineReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...[]))
);

const { dispatch, subscribe } = store;

export { dispatch, subscribe };
export default store;
