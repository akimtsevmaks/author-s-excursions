function currentCity(){ return LS.get(K.CITY, null); }

function allCities(){
  const set = new Set(LS.get(K.EXC,[]).map(e=>e.city));
  return [...set].sort((a,b)=>a.localeCompare(b,'ru'));
}

function openCityModal(force){
  const tpl = document.getElementById('tpl-city-modal');
  const frag = tpl.content.cloneNode(true);
  const select = frag.querySelector('#cityPick');
  const cur = currentCity();

  allCities().forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    if (c === cur) opt.selected = true;
    select.appendChild(opt);
  });

  const cancelBtn = frag.querySelector('#cityCancelBtn');
  cancelBtn.classList.toggle('hidden', !!force);
  cancelBtn.addEventListener('click', closeModal);

  frag.querySelector('#cityPickBtn').addEventListener('click', ()=>{
    LS.set(K.CITY, select.value);
    closeModal();
    state.filter = null;
    render();
  });

  showModal(frag);
}