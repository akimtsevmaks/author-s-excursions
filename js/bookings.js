function buildBookingsView(){
  const tpl = document.getElementById('tpl-bookings');
  const frag = tpl.content.cloneNode(true);
  const list = LS.get(K.BOOK,[]);
  const container = frag.querySelector('#bookingsList');
  const emptyState = frag.querySelector('#emptyState');

  if (!list.length){
    emptyState.classList.remove('hidden');
    return frag;
  }

  list.forEach(bItem=>{
    const itemTpl = document.getElementById('tpl-booking-item');
    const itemFrag = itemTpl.content.cloneNode(true);
    itemFrag.querySelector('[data-field="name"]').textContent = bItem.excName;
    itemFrag.querySelector('[data-field="time"]').textContent = bItem.slot ? `Время: ${fmtDT(bItem.slot)}` : 'Время: свободный формат';
    itemFrag.querySelector('[data-field="people"]').textContent = bItem.people;
    itemFrag.querySelector('[data-field="pay"]').textContent = bItem.pay==='online' ? 'онлайн' : 'на месте';
    itemFrag.querySelector('[data-field="email"]').textContent = bItem.email;
    itemFrag.querySelector('[data-field="createdAt"]').textContent = fmtD(bItem.createdAt);
    const status = itemFrag.querySelector('[data-field="status"]');
    status.textContent = STATUS_RU[bItem.status];
    status.classList.add(bItem.status);
    container.appendChild(itemFrag);
  });

  return frag;
}