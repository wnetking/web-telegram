import api from '../../api';

export const registrationUser = ({
  first_name,
  last_name,
  file
}) => {
  ; (async (file) => {
    const responce = await api.send({
      '@type': 'registerUser',
      first_name,
      last_name
    })

    if (responce['@type'] === 'ok' && file) {
      const responce = await api.send({
        '@type': 'setProfilePhoto',
        photo: {
          "@type": 'inputFileBlob',
          data: file,
          name: 'profilePhoto'
        },
      })
    }
  })(file).catch(e => console.error(e))
}