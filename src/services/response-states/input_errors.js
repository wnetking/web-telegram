import core from '../api/core';

function checkInputError(error){
  switch (error['message']) {
    case 'PHONE_NUMBER_INVALID' : core.emmit('phone_invalid', {message : 'Invalid phone'}); break;
  }
}

export default checkInputError;