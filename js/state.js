let state = { view:'catalog', excId:null, filter:null, booking:{ slot:null, pay:null } };

function go(view, excId){
  state.view = view;
  state.excId = excId || null;
  if (view === 'detail') state.booking = { slot:null, pay:null };
  if (view === 'mail') LS.set(K.MAILREAD, LS.get(K.MAIL,[]).length);
  if (view === 'requests') LS.set(K.REQSEEN, LS.get(K.BOOK,[]).filter(b=>b.status==='pending').length);
  render();
  window.scrollTo({top:0});
}

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(()=>t.classList.remove('show'), 2600);
}