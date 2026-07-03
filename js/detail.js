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