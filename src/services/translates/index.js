const state = {
  auth: {
    sign_in: 'Sign in to Telegram',
    sign_in_desc: 'Please confirm your country and enter your phone number.',
    country: 'Country',
    phone: 'Phone Number',
    phone_submit: 'NEXT'
  }
};

function trans(ns) {
  if (state[ns]) {
    return state[ns];
  }

  throw new Error(`Not Have this namespace: ${ns}`);
}

export default trans;
