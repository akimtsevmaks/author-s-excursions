function filteredExcursions() {
  const all = LS.get(K.EXC, []);
  const f = state.filter;

  if (!f) {
    const city = currentCity();
    return {
      list: city ? all.filter(e => e.city === city) : all,
      label: city ? `Экскурсии в городе ${city}` : 'Все экскурсии'
    };
  }

  let list = all;

  if (f.country) {
    list = list.filter(e => e.country.toLowerCase().includes(f.country.toLowerCase()));
  }
  if (f.city) {
    list = list.filter(e => e.city.toLowerCase().includes(f.city.toLowerCase()));
  }
  if (f.people) {
    list = list.filter(e => e.format !== 'Групповая' || !e.groupSize || e.groupSize >= f.people);
  }
  if (f.kids === 'yes') {
    list = list.filter(e => e.kids);
  }

  if (f.from || f.to) {
    const from = f.from ? new Date(f.from + 'T00:00') : null;
    const to = f.to ? new Date(f.to + 'T23:59') : null;

    list = list.filter(e => !e.slots.length || e.slots.some(s => {
      const t = new Date(s);
      return (!from || t >= from) && (!to || t <= to);
    }));
  }

  return {
    list,
    label: 'Результаты поиска'
  };
}

function buildTicketCard(e) {
  const tpl = document.getElementById('tpl-ticket-card');
  const frag = tpl.content.cloneNode(true);
  const article = frag.querySelector('.ticket');

  const img = document.createElement('img');
  img.src = e.photos[0] || '';
  img.alt = e.name;
  frag.querySelector('[data-field="photo"]').appendChild(img);

  const stamp = frag.querySelector('[data-field="stamp"]');
  stamp.textContent = e.format;
  stamp.classList.add(stampClass(e.format));

  frag.querySelector('[data-field="name"]').textContent = e.name;
  frag.querySelector('[data-field="desc"]').textContent = e.short;
  frag.querySelector('[data-field="city"]').textContent = e.city;
  frag.querySelector('[data-field="duration"]').textContent = e.duration;
  frag.querySelector('[data-field="priceValue"]').textContent = fmtMoney(e.price);
  frag.querySelector('[data-field="priceUnit"]').textContent = e.priceType === 'person' ? '/ чел.' : '/ группа';
  frag.querySelector('[data-field="photoCount"]').textContent = e.photos.length;

  article.setAttribute('aria-label', e.name);
  article.addEventListener('click', () => go('detail', e.id));
  article.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') go('detail', e.id);
  });

  return frag;
}

function buildCatalogView() {
  const tpl = document.getElementById('tpl-catalog');
  const frag = tpl.content.cloneNode(true);
  const f = state.filter || {};

  const countryInput = frag.querySelector('#f-country');
  const cityInput = frag.querySelector('#f-city');
  const fromInput = frag.querySelector('#f-from');
  const toInput = frag.querySelector('#f-to');
  const peopleInput = frag.querySelector('#f-people');
  const kidsSelect = frag.querySelector('#f-kids');

  countryInput.value = f.country || '';
  cityInput.value = f.city || '';
  fromInput.value = f.from || '';
  toInput.value = f.to || '';
  peopleInput.value = f.people || '';
  kidsSelect.value = f.kids === 'yes' ? 'yes' : 'any';

  const countries = [...new Set(LS.get(K.EXC, []).map(e => e.country))].sort((a, b) => a.localeCompare(b, 'ru'));
  const countryList = frag.querySelector('#dl-country');
  countries.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    countryList.appendChild(opt);
  });

  const cityList = frag.querySelector('#dl-city');
  allCities().forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    cityList.appendChild(opt);
  });

  const resetBtn = frag.querySelector('#resetBtn');
  resetBtn.classList.toggle('hidden', !state.filter);
  resetBtn.addEventListener('click', () => {
    state.filter = null;
    render();
  });

  frag.querySelector('#searchBtn').addEventListener('click', () => {
    state.filter = {
      country: countryInput.value.trim(),
      city: cityInput.value.trim(),
      from: fromInput.value,
      to: toInput.value,
      people: parseInt(peopleInput.value) || null,
      kids: kidsSelect.value
    };
    render();
  });

  const { list, label } = filteredExcursions();
  frag.querySelector('#resultsMeta').textContent = `${label} · найдено: ${list.length}`;

  const cardsContainer = frag.querySelector('#cardsContainer');
  const emptyState = frag.querySelector('#emptyState');

  if (list.length) {
    list.forEach(e => cardsContainer.appendChild(buildTicketCard(e)));
  } else {
    emptyState.classList.remove('hidden');
  }

  return frag;
}
