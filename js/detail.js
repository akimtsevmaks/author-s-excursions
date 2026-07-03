function buildDetailView() {
  const e = LS.get(K.EXC, []).find(x => x.id === state.excId);

  if (!e) {
    const div = document.createElement('div');
    div.className = 'empty';
    const strong = document.createElement('b');
    strong.textContent = 'Экскурсия не найдена';
    div.appendChild(strong);
    return div;
  }

  const tpl = document.getElementById('tpl-detail');
  const frag = tpl.content.cloneNode(true);
  const booking = state.booking;

  frag.querySelector('#backBtn').addEventListener('click', () => go('catalog'));

  const gallery = frag.querySelector('#gallery');
  e.photos.slice(0, 3).forEach(p => {
    const img = document.createElement('img');
    img.src = p;
    img.alt = e.name;
    gallery.appendChild(img);
  });

  const stamp = frag.querySelector('[data-field="stamp"]');
  stamp.textContent = e.format;
  stamp.classList.add(stampClass(e.format));

  frag.querySelector('[data-field="name"]').textContent = e.name;
  frag.querySelector('[data-field="place"]').textContent = `📍 ${e.country}, ${e.city}`;
  frag.querySelector('[data-field="full"]').textContent = e.full;
  frag.querySelector('[data-field="format"]').textContent = e.format;
  frag.querySelector('[data-field="duration"]').textContent = e.duration;

  const groupRow = frag.querySelector('[data-row="groupSize"]');
  if (e.format === 'Групповая' && e.groupSize) {
    groupRow.querySelector('[data-field="groupSize"]').textContent = `до ${e.groupSize} чел.`;
  } else {
    groupRow.classList.add('hidden');
  }

  frag.querySelector('[data-field="kids"]').textContent = e.kids ? 'Можно с детьми' : 'Только взрослые';
  frag.querySelector('[data-field="transport"]').textContent = e.transport;
  frag.querySelector('[data-field="priceValue"]').textContent = fmtMoney(e.price);
  frag.querySelector('[data-field="priceUnit"]').textContent = e.priceType === 'person' ? 'за одного человека' : 'за всю группу';

  const peopleInput = frag.querySelector('#b-people');
  peopleInput.value = booking.people != null ? booking.people : '2';

  const groupSizeHint = frag.querySelector('#groupSizeHint');
  if (e.format === 'Групповая' && e.groupSize) {
    peopleInput.max = e.groupSize;
    groupSizeHint.textContent = `Максимум ${e.groupSize} чел. в группе`;
    groupSizeHint.classList.remove('hidden');
  }

  const emailInput = frag.querySelector('#b-email');
  emailInput.value = booking.email != null ? booking.email : '';

  const withSlots = frag.querySelector('[data-block="withSlots"]');
  const noSlots = frag.querySelector('[data-block="noSlots"]');

  if (e.slots.length) {
    noSlots.classList.add('hidden');
    const slotsContainer = frag.querySelector('#slotsContainer');

    e.slots.forEach(s => {
      const slotTpl = document.getElementById('tpl-slot-button');
      const slotFrag = slotTpl.content.cloneNode(true);
      const btn = slotFrag.querySelector('.slot');

      btn.textContent = fmtDT(s);
      if (booking.slot === s) btn.classList.add('sel');

      btn.addEventListener('click', () => {
        state.booking.people = peopleInput.value;
        state.booking.email = emailInput.value;
        state.booking.slot = s;
        render();
      });
      slotsContainer.appendChild(slotFrag);
    });
  } else {
    withSlots.classList.add('hidden');
  }

  const payOnline = frag.querySelector('#payOnline');
  const payOnsite = frag.querySelector('#payOnsite');

  payOnline.classList.toggle('sel', booking.pay === 'online');
  payOnsite.classList.toggle('sel', booking.pay === 'onsite');

  payOnline.addEventListener('click', () => {
    state.booking.people = peopleInput.value;
    state.booking.email = emailInput.value;
    state.booking.pay = 'online';
    render();
  });

  payOnsite.addEventListener('click', () => {
    state.booking.people = peopleInput.value;
    state.booking.email = emailInput.value;
    state.booking.pay = 'onsite';
    render();
  });

  frag.querySelector('#submitBookingBtn').addEventListener('click', () => {
    if (typeof submitBooking === 'function') {
      submitBooking(e, peopleInput, emailInput);
    } else {
      toast('Оформление бронирования заработает на следующем шаге');
    }
  });

  return frag;
}


function showPayModal(e, people, total, onConfirm){
  const tpl = document.getElementById('tpl-pay-modal');
  const frag = tpl.content.cloneNode(true);
  frag.querySelector('[data-field="name"]').textContent = e.name;
  frag.querySelector('[data-field="people"]').textContent = people;
  frag.querySelector('[data-field="total"]').textContent = fmtMoney(total);
  frag.querySelector('[data-field="totalBtn"]').textContent = fmtMoney(total);
  frag.querySelector('#payCancelBtn').addEventListener('click', closeModal);
  frag.querySelector('#payBtn').addEventListener('click', onConfirm);
  showModal(frag);
}

function submitBooking(e, peopleInput, emailInput){
  const people = parseInt(peopleInput.value);
  const email = emailInput.value.trim();
  if (e.slots.length && !state.booking.slot) return toast('Выберите время экскурсии');
  if (!people || people < 1) return toast('Укажите количество человек');
  if (e.format==='Групповая' && e.groupSize && people > e.groupSize) return toast(`В группе максимум ${e.groupSize} человек`);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast('Укажите корректную почту');
  if (!state.booking.pay) return toast('Выберите способ оплаты');

  const finish = () => {
    const bookings = LS.get(K.BOOK,[]);
    const bk = { id:uid(), excId:e.id, excName:e.name, slot:state.booking.slot, people, email,
                 pay:state.booking.pay, status:'pending', createdAt:new Date().toISOString() };
    bookings.unshift(bk);
    LS.set(K.BOOK, bookings);
    const total = e.priceType==='person' ? e.price*people : e.price;
    sendMail(email, `Бронирование оформлено: ${e.name}`,
`Ваше бронирование принято и ожидает подтверждения гида.

Экскурсия: ${e.name}
Город: ${e.country}, ${e.city}
${bk.slot ? 'Время: ' + fmtDT(bk.slot) : 'Время: свободный формат, гид свяжется с вами'}
Участников: ${people}
Оплата: ${bk.pay==='online' ? 'онлайн (оплачено, демо)' : 'на месте'}
Сумма: ${fmtMoney(total)}

Как только гид подтвердит бронирование, мы пришлём его контакты отдельным письмом.`);

    const appUrl = location.origin + location.pathname;
    sendMail(MAIL_CFG.GUIDE_EMAIL, `Новая заявка на бронирование: ${e.name}`,
`Поступила новая заявка на экскурсию.

Экскурсия: ${e.name}
Город: ${e.country}, ${e.city}
${bk.slot ? 'Время: ' + fmtDT(bk.slot) : 'Время: свободный формат'}
Участников: ${people}
Почта гостя: ${email}
Оплата: ${bk.pay==='online' ? 'онлайн (оплачено, демо)' : 'на месте'}
Сумма: ${fmtMoney(total)}

Подтвердить бронирование: ${appUrl}?decision=approved&booking=${bk.id}
Отклонить бронирование: ${appUrl}?decision=rejected&booking=${bk.id}`);

    closeModal();
    toast('Бронирование оформлено — подтверждение отправлено на почту');
    go('bookings');
  };

  if (state.booking.pay === 'online'){
    const total = e.priceType==='person' ? e.price*people : e.price;
    showPayModal(e, people, total, finish);
  } else {
    finish();
  }
}