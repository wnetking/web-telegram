import auth from './auth.js';
import input_error from './input_errors.js';

function combineStates(update){
  const states = [
    auth,
    input_error
  ]

  states.forEach(state => {
    state(update)
  })
}

export default combineStates;