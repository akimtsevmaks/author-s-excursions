const LS = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch (e) {
      return d;
    }
  },
  set(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  }
};

const K = {
  EXC: 'sm_excursions',
  BOOK: 'sm_bookings',
  MAIL: 'sm_mail',
  CITY: 'sm_city',
  SEED: 'sm_seeded_v1',
  MAILREAD: 'sm_mailread',
  REQSEEN: 'sm_reqseen'
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const fmtMoney = n => Number(n).toLocaleString('ru-RU') + ' ₽';

const fmtDT = iso => new Date(iso).toLocaleString('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit'
});

const fmtD = iso => new Date(iso).toLocaleDateString('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});