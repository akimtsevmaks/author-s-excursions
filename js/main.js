seed();

document.getElementById('logoBtn').addEventListener('click', ()=>go('catalog'));
document.getElementById('cityBtn').addEventListener('click', ()=>openCityModal());
document.getElementById('nav-catalog').addEventListener('click', ()=>go('catalog'));
document.getElementById('nav-bookings').addEventListener('click', ()=>go('bookings'));
document.getElementById('nav-requests').addEventListener('click', ()=>go('requests'));
document.getElementById('nav-mail').addEventListener('click', ()=>go('mail'));

if (!currentCity()){
  render();
  openCityModal(true);
} else {
  render();
}

document.getElementById('modalBack').addEventListener('click', ev=>{
  if (ev.target.id==='modalBack' && currentCity()) closeModal();
});