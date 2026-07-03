seed();

document.getElementById('logoBtn').addEventListener('click', ()=>go('catalog'));
document.getElementById('cityBtn').addEventListener('click', ()=>{
  if (typeof openCityModal === 'function') openCityModal();
  else toast('Выбор города будет доступен на следующем шаге');
});
document.getElementById('nav-catalog').addEventListener('click', ()=>go('catalog'));
document.getElementById('nav-bookings').addEventListener('click', ()=>go('bookings'));
document.getElementById('nav-requests').addEventListener('click', ()=>go('requests'));
document.getElementById('nav-mail').addEventListener('click', ()=>go('mail'));

render();