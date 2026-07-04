function render(){
  ['catalog','bookings','requests','mail'].forEach(v=>{
    const el = document.getElementById('nav-'+v);
    if (el) el.classList.toggle('active', state.view===v || (v==='catalog' && state.view==='detail'));
  });
  
  const activeCity = (typeof currentCity === 'function') ? currentCity() : null;
  document.getElementById('cityLabel').textContent = activeCity || 'Выбрать город';

  const mail = LS.get(K.MAIL,[]);
  const unread = mail.length - LS.get(K.MAILREAD, 0);
  const mb = document.getElementById('mailBadge');
  mb.classList.toggle('hidden', unread<=0 || state.view==='mail');
  mb.textContent = unread;

  const pend = LS.get(K.BOOK,[]).filter(b=>b.status==='pending').length;
  const newReq = pend - LS.get(K.REQSEEN, 0);
  const rb = document.getElementById('reqBadge');
  rb.classList.toggle('hidden', newReq<=0 || state.view==='requests');
  rb.textContent = newReq;

  const app = document.getElementById('app');
  let view;

  switch (state.view) {
    case 'catalog':
      view = buildCatalogView();
      break;
    case 'detail':
      view = buildDetailView();
      break;
    case 'create':
      view = buildCreateView();
      break;
    case 'bookings':
      view = buildBookingsView();
      break;
    case 'requests':
      view = buildRequestsView();
      break;
    case 'mail':
      view = buildMailView();
      break;
  }

  app.replaceChildren(view);
}