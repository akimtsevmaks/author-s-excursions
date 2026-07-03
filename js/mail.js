function sendMail(to, subject, body, real) {
  const mail = LS.get(K.MAIL, []);
  mail.unshift({
    id: uid(),
    to,
    subject,
    body,
    date: new Date().toISOString()
  });
  LS.set(K.MAIL, mail);
  if (real) {
    sendRealMail(to, subject, body);
  }
}