function buildRequestsView(){
  const tpl = document.getElementById('tpl-requests');
  const frag = tpl.content.cloneNode(true);
  const bookings = LS.get(K.BOOK,[]);
  const container = frag.querySelector('#requestsList');
  const emptyState = frag.querySelector('#emptyState');

  if (!bookings.length){
    emptyState.classList.remove('hidden');
    return frag;
  }

  bookings.forEach(bItem=>{
    const itemTpl = document.getElementById('tpl-request-item');
    const itemFrag = itemTpl.content.cloneNode(true);
    itemFrag.querySelector('[data-field="name"]').textContent = bItem.excName;
    itemFrag.querySelector('[data-field="time"]').textContent = bItem.slot ? `Время: ${fmtDT(bItem.slot)}` : 'Время: свободный формат';
    itemFrag.querySelector('[data-field="people"]').textContent = bItem.people;
    itemFrag.querySelector('[data-field="pay"]').textContent = bItem.pay==='online' ? 'онлайн (демо)' : 'на месте';
    itemFrag.querySelector('[data-field="email"]').textContent = bItem.email;

    const actions = itemFrag.querySelector('[data-block="pending"]');
    const statusEl = itemFrag.querySelector('[data-block="decided"]');

    if (bItem.status==='pending'){
      itemFrag.querySelector('[data-action="approve"]').addEventListener('click', ()=>decide(bItem.id, 'approved'));
      itemFrag.querySelector('[data-action="reject"]').addEventListener('click', ()=>decide(bItem.id, 'rejected'));
    } else {
      actions.classList.add('hidden');
      statusEl.classList.remove('hidden');
      statusEl.textContent = STATUS_RU[bItem.status];
      statusEl.classList.add(bItem.status);
    }

    container.appendChild(itemFrag);
  });

  return frag;
}

function decide(id, status){
  const bookings = LS.get(K.BOOK,[]);
  const bItem = bookings.find(x=>x.id===id);
  if (!bItem) return;
  bItem.status = status;
  LS.set(K.BOOK, bookings);
  const e = LS.get(K.EXC,[]).find(x=>x.id===bItem.excId);
  if (status==='approved'){
    sendMail(bItem.email, `Экскурсия подтверждена: ${bItem.excName}`,
`Гид подтвердил ваше бронирование — всё в силе!

Экскурсия: ${bItem.excName}
${bItem.slot ? 'Время: ' + fmtDT(bItem.slot) : 'Время: гид свяжется с вами, чтобы договориться'}
Участников: ${bItem.people}

Контакты гида:
${e ? e.contacts : '—'}

Напишите или позвоните гиду, чтобы уточнить место встречи. Хорошей прогулки!`, true);
    toast('Заявка подтверждена — контакты гида отправлены на почту');
  } else {
    sendMail(bItem.email, `Бронирование отклонено: ${bItem.excName}`,
`К сожалению, гид не подтвердил это бронирование.

Экскурсия: ${bItem.excName}
${bItem.slot ? 'Время: ' + fmtDT(bItem.slot) : ''}

${bItem.pay==='online' ? 'Оплата будет возвращена на карту (демо-режим).' : 'Оплата не потребуется.'}
Загляните в каталог — там есть другие маршруты в этом городе.`, true);
    toast('Заявка отклонена — уведомление отправлено на почту');
  }
  render();
}