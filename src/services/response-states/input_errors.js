import core from '../api/core';

function checkInputError(error){
  switch (error['message']) {
    case 'PHONE_NUMBER_INVALID' : core.emmit('phone_invalid', {message : 'Invalid phone'}); break;
    case 'PHONE_CODE_EMPTY' :
    case 'PHONE_CODE_INVALID' : core.emmit('phone_code_invalid', {message : 'Invalid phone code'}); break;
    case 'PASSWORD_HASH_INVALID' : core.emmit('password_invalid', {message : 'Invalid password'}); break;
    case "First name can't be empty" : core.emmit('emty_first_name', {message : "First name can't be empty"})
    default : break;
  }
}

export default checkInputError;