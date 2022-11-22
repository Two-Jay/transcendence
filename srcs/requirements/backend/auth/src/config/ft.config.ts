export default () => {
  return {
    ft: {
      client_id: process.env.FT_CLIENT_ID,
      client_secret: process.env.FT_CLIENT_SECRET,
      // callback: 'http://' + process.env.BACKEND_HOST_IP + ':' + process.env.BACKEND_PORT,
      callback: 'http://10.14.10.4:8080',
      email_tail: process.env.FT_EMAIL_TAIL,
      nickname_prefix: process.env.FT_NICKNAME_PREFIX,
      host_ip: process.env.BACKEND_HOST_IP,
      port: process.env.BACKEND_PORT,
    },
    token: {
      secret: process.env.JWT_SECRET,
      expire: process.env.JWT_EXPIRE,
    },
    tfa: {
      email: process.env.TFA_EMAIL,
      email_pass: process.env.TFA_PASS,
    },
    email: {
      transport:
        'smtps://' +
        process.env.TFA_EMAIL +
        ':' +
        process.env.TFA_PASS +
        '@smtp.gmail.com',
      defaults: {
        from: `ft.transcendence.2fa <ft.transcendence.2fa@gmail.com>`,
      },
    },
    front: {
      host_ip: process.env.CLIENT_HOST,
      port: process.env.CLIENT_PORT,
    },
    redis: {
      host: 'http://' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT,
      port: process.env.REDIS_PORT,
    },
  };
};
