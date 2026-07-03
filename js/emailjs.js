const MAIL_CFG = { //не воруйте пж
  PUBLIC_KEY: '6M7M7DhyUIZctaA5n',
  SERVICE_ID: 'service_2cuhk3l',
  TEMPLATE_ID: 'template_j057xf8',
  GUIDE_EMAIL: 'akimtsev.maks@gmail.com'
};

if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: MAIL_CFG.PUBLIC_KEY });
}

function sendRealMail(to, subject, body) {
  if (typeof emailjs === 'undefined') return;
  emailjs.send(MAIL_CFG.SERVICE_ID, MAIL_CFG.TEMPLATE_ID, {
    to_email: to,
    subject: subject,
    message: body
  }).catch(err => console.error('EmailJS error:', err));
}
