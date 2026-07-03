function showModal(node){
  const b = document.getElementById('modalBack');
  b.replaceChildren(node);
  b.classList.remove('hidden');
}

function closeModal(){
  const b = document.getElementById('modalBack');
  b.classList.add('hidden');
  b.replaceChildren();
}