document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.claps-container');
  if (!container) return;

  const pageId = container.getAttribute('data-page');
  const btn = document.getElementById('claps-btn');
  const count = document.getElementById('claps-count');
  const apiBase = 'https://claps.khcomic.com';

  // 載入目前拍手數
  fetch(`${apiBase}?page=${encodeURIComponent(pageId)}`)
    .then(r => r.json())
    .then(data => {
      count.textContent = data.claps;
    });

  // 點擊拍手
  btn.addEventListener('click', function() {
    fetch(`${apiBase}?page=${encodeURIComponent(pageId)}`, {
      method: 'POST'
    })
      .then(r => r.json())
      .then(data => {
        count.textContent = data.claps;
        btn.classList.add('clapped');
        setTimeout(() => btn.classList.remove('clapped'), 300);
      });
  });
});