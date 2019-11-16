const state = {
  core: {
    loading: 'Please Wait...'
  },
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
    password: 'Password',
    registration_name: 'Your name',
    registration_desc: 'Enter yout name and add a profile picture',
    name: 'Name',
    last_name: 'Last name (optional)',
    start_messanging: 'Start messanging',
    checkbox_label: 'Keep me signed in',
    cropp_title: 'Drag to Reposition'
  }
};

function trans(ns) {
  if (state[ns]) {
    return state[ns];
  }

  throw new Error(`Not Have this namespace: ${ns}`);
}

export default trans;
