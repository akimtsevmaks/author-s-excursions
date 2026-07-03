function buildMailView(){
  const tpl = document.getElementById('tpl-mail');
  const frag = tpl.content.cloneNode(true);
  const mail = LS.get(K.MAIL,[]);
  const container = frag.querySelector('#mailList');
  const emptyState = frag.querySelector('#emptyState');

  if (!mail.length){
    emptyState.classList.remove('hidden');
    return frag;
  }

  mail.forEach(m=>{
    const itemTpl = document.getElementById('tpl-letter');
    const itemFrag = itemTpl.content.cloneNode(true);
    itemFrag.querySelector('[data-field="subject"]').textContent = m.subject;
    itemFrag.querySelector('[data-field="to"]').textContent = `Кому: ${m.to} · ${new Date(m.date).toLocaleString('ru-RU')}`;
    itemFrag.querySelector('[data-field="body"]').textContent = m.body;
    container.appendChild(itemFrag);
  });

  return frag;
}