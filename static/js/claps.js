document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.claps-container');
  const apiBase = 'https://claps.khcomic.com';
  
  // 總觀看次數
  const totalViewsEl = document.getElementById('total-views');
  if (totalViewsEl) {
    fetch(`${apiBase}?type=views`)
      .then(r => r.json())
      .then(data => {
        totalViewsEl.textContent = data.count;
      });
  }
  // 觀看次數
  const viewsEl = document.getElementById('views-count');
  if (viewsEl) {
    const pageId = viewsEl.getAttribute('data-page');
    fetch(`${apiBase}?page=${encodeURIComponent(pageId)}&type=views`, {
      method: 'POST'
    })
      .then(r => r.json())
      .then(data => {
        viewsEl.textContent = data.count;
      });
  }

  // 拍手
  if (!container) return;
  const pageId = container.getAttribute('data-page');
  const btn = document.getElementById('claps-btn');
  const count = document.getElementById('claps-count');
  
  // 載入目前拍手數
  fetch(`${apiBase}?page=${encodeURIComponent(pageId)}&type=claps`)
    .then(r => r.json())
    .then(data => {
      count.textContent = data.count;
    });
  
  // 點擊拍手
  btn.addEventListener('click', function() {
    fetch(`${apiBase}?page=${encodeURIComponent(pageId)}&type=claps`, {
      method: 'POST'
    })
      .then(r => r.json())
      .then(data => {
        count.textContent = data.count;
        btn.classList.add('clapped');
        setTimeout(() => btn.classList.remove('clapped'), 300);
      });
  });
});