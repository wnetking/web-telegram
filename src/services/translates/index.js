const state = {
  auth: {
    sign_in: 'Sign in to Telegram',
    sign_in_desc: 'Please confirm your country and enter your phone number.',
    country: 'Country',
    phone: 'Phone Number',
    phone_submit: 'NEXT',
    code: 'Code',
    code_desc: 'We have send you an SMS with the code.',
    password_header: 'Enter a Password',
    password_desc: 'You account is protected with an additional password',
    password: 'Password'
  }
};

function trans(ns) {
  if (state[ns]) {
    return state[ns];
  }

  throw new Error(`Not Have this namespace: ${ns}`);
}

export default trans;
