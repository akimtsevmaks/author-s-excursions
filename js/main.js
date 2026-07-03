seed();

document.getElementById('logoBtn').addEventListener('click', ()=>go('catalog'));
document.getElementById('cityBtn').addEventListener('click', ()=>openCityModal());
document.getElementById('nav-catalog').addEventListener('click', ()=>go('catalog'));
document.getElementById('nav-bookings').addEventListener('click', ()=>go('bookings'));
document.getElementById('nav-requests').addEventListener('click', ()=>go('requests'));
document.getElementById('nav-mail').addEventListener('click', ()=>go('mail'));
document.getElementById('fabBtn').addEventListener('click', ()=>go('create'));

if (!currentCity()){
  render();
  openCityModal(true);
} else {
  render();
}

document.getElementById('modalBack').addEventListener('click', ev=>{
  if (ev.target.id==='modalBack' && currentCity()) closeModal();
});

(function handleEmailDecision(){
  const params = new URLSearchParams(location.search);
  const decision = params.get('decision');
  const bookingId = params.get('booking');

  if (decision && bookingId){
    const bk = LS.get(K.BOOK, []).find(b => b.id === bookingId);
    if (!bk){
      toast('Бронирование не найдено');
    } else if (bk.status !== 'pending'){
      toast('Эта заявка уже была обработана ранее');
    } else if (decision === 'approved' || decision === 'rejected'){
      decide(bk.id, decision);
    }
    history.replaceState(null, '', location.pathname);
  }
})();