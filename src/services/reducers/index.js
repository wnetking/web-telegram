import auth from './auth.js';

function combineReducers(update){
  const reducers = [
    auth
  ]

  reducers.forEach(reducer => {
    reducer(update)
  })
}

export default combineReducers;