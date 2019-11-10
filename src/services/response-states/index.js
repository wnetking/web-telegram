import auth from './auth.js';

function combineStates(update){
  const states = [
    auth
  ]

  states.forEach(state => {
    state(update)
  })
}

export default combineStates;