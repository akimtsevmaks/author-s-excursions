function cover(c1, c2, emoji){
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 640, 420);
  gradient.addColorStop(0, c1);
  gradient.addColorStop(1, c2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 640, 420);

  ctx.fillStyle = 'rgba(255,255,255,.10)';
  ctx.beginPath();
  ctx.arc(530, 90, 130, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,.08)';
  ctx.beginPath();
  ctx.arc(90, 360, 90, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '120px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 320, 227);

  return canvas.toDataURL('image/jpeg', 0.7);
}