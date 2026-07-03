function sendMail(to, subject, body) {
  const mail = LS.get(K.MAIL, []);
  mail.unshift({
    id: uid(),
    to,
    subject,
    body,
    date: new Date().toISOString()
  });
  LS.set(K.MAIL, mail);
  if (to === MAIL_CFG.GUIDE_EMAIL) {
    sendRealMail(to, subject, body);
  }
}