function buildCreateView(){
  const tpl = document.getElementById('tpl-create');
  const frag = tpl.content.cloneNode(true);

  let photos = [];
  let slots = [];

  frag.querySelector('#backBtn').addEventListener('click', ()=>go('catalog'));

  const nameInput = frag.querySelector('#c-name');
  const photosInput = frag.querySelector('#c-photos');
  const photoStrip = frag.querySelector('#photoStrip');
  const shortInput = frag.querySelector('#c-short');
  const fullInput = frag.querySelector('#c-full');
  const countryInput = frag.querySelector('#c-country');
  const cityInput = frag.querySelector('#c-city');
  const formatSelect = frag.querySelector('#c-format');
  const durationInput = frag.querySelector('#c-duration');
  const groupSizeField = frag.querySelector('#groupSizeField');
  const groupSizeInput = frag.querySelector('#c-groupsize');
  const kidsSelect = frag.querySelector('#c-kids');
  const transportSelect = frag.querySelector('#c-transport');
  const priceInput = frag.querySelector('#c-price');
  const contactsInput = frag.querySelector('#c-contacts');
  const notifyEmailInput = frag.querySelector('#c-notify-email');
  const slotList = frag.querySelector('#slotList');
  const slotInput = frag.querySelector('#c-slot');
  const addSlotBtn = frag.querySelector('#addSlotBtn');
  const publishBtn = frag.querySelector('#publishBtn');

  const syncGroupSizeVisibility = () => {
    groupSizeField.classList.toggle('invisible', formatSelect.value !== 'Групповая');
  };
  formatSelect.addEventListener('change', syncGroupSizeVisibility);
  syncGroupSizeVisibility();

  photosInput.addEventListener('change', ()=>{
    const allFiles = [...photosInput.files];
    const files = allFiles.filter(f => f.type.startsWith('image/')).slice(0, 6);
    photos = [];
    photoStrip.replaceChildren();
    if (allFiles.length && !files.length) return toast('Выберите файлы изображений (JPG, PNG и т.п.)');
    if (files.length < allFiles.length) toast('Часть файлов пропущена — это не изображения');
    if (!files.length) return;
    let loaded = 0;
    files.forEach(f=>{
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxSize = 960;
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          photos.push(canvas.toDataURL('image/jpeg', 0.8));
          loaded++;
          if (loaded === files.length){
            photoStrip.replaceChildren();
            photos.forEach(p=>{
              const thumbTpl = document.getElementById('tpl-photo-thumb');
              const thumbFrag = thumbTpl.content.cloneNode(true);
              thumbFrag.querySelector('img').src = p;
              photoStrip.appendChild(thumbFrag);
            });
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(f);
    });
  });

  const renderSlots = () => {
    slotList.replaceChildren();
    slots.forEach((s, i)=>{
      const itemTpl = document.getElementById('tpl-added-slot');
      const itemFrag = itemTpl.content.cloneNode(true);
      itemFrag.querySelector('[data-field="time"]').textContent = fmtDT(s);
      itemFrag.querySelector('[data-action="remove"]').addEventListener('click', ()=>{
        slots.splice(i, 1);
        renderSlots();
      });
      slotList.appendChild(itemFrag);
    });
  };

  addSlotBtn.addEventListener('click', ()=>{
    const v = slotInput.value;
    if (!v) return toast('Выберите дату и время');
    const picked = new Date(v);
    if (picked.getTime() <= Date.now()) return toast('Выберите время в будущем');
    const iso = picked.toISOString();
    if (slots.includes(iso)) return toast('Это время уже добавлено');
    slots.push(iso);
    slots.sort();
    renderSlots();
    slotInput.value = '';
  });

  publishBtn.addEventListener('click', ()=>{
    const fmt = formatSelect.value;
    const groupSize = parseInt(groupSizeInput.value) || null;
    const required = [
      [nameInput,'название'], [shortInput,'краткое описание'], [fullInput,'полное описание'],
      [countryInput,'страну'], [cityInput,'город'], [durationInput,'длительность'],
      [priceInput,'стоимость'], [contactsInput,'контакты']
    ];
    for (const [input, label] of required){
      if (!input.value.trim()) return toast('Заполните ' + label);
    }
    if (!/\d/.test(durationInput.value.trim())) return toast('Укажите длительность с числом, например «3 часа»');
    if (fmt==='Групповая' && (!groupSize || groupSize<2)) return toast('Укажите размер группы (от 2 человек)');
    if (Number(priceInput.value) < 0) return toast('Стоимость не может быть отрицательной');

    const notifyEmailRaw = notifyEmailInput.value.trim();
    const notifyEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(notifyEmailRaw) ? notifyEmailRaw : null;

    const exc = LS.get(K.EXC,[]);
    exc.unshift({
      id:uid(), name:nameInput.value.trim(), short:shortInput.value.trim(), full:fullInput.value.trim(),
      country:countryInput.value.trim(), city:cityInput.value.trim(),
      format:fmt, duration:durationInput.value.trim(),
      groupSize: fmt==='Групповая' ? groupSize : null,
      kids: kidsSelect.value==='yes',
      transport:transportSelect.value,
      price:Number(priceInput.value),
      contacts:contactsInput.value.trim(),
      notifyEmail,
      photos: photos.length ? photos : [cover('#0E7A6B','#16262E','🧭')],
      slots:[...slots], creator:'user'
    });

    try {
      LS.set(K.EXC, exc);
    } catch (err) {
      return toast('Не удалось сохранить экскурсию: слишком много данных в хранилище браузера. Попробуйте меньше/меньшего размера фото');
    }

    toast('Экскурсия опубликована');
    state.filter = { country:'', city:cityInput.value.trim(), from:'', to:'', people:null, kids:'any' };
    go('catalog');
  });

  return frag;
}