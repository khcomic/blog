let posts = [];
let selected = new Set();

const results = document.getElementById('results');

// 初始狀態
results.innerHTML = `<div class="text-muted">未篩選</div>`;

fetch('/index.json')
  .then(res => res.json())
  .then(data => {
    posts = data;
    render(posts);
  });

function render(items) {
  if (!items.length) {
    results.innerHTML = `<div class="text-muted">沒有符合條件的結果</div>`;
    return;
  }

  results.innerHTML = `
    <div class="mb-2 text-muted small">
      共 ${items.length} 筆結果
    </div>
    ${items.map(post => `
      <div class="mb-2">
        <a href="${post.url}">${post.title}</a>
      </div>
    `).join('')}
  `;
}

document.querySelectorAll('.filter-tag').forEach(el => {
  el.addEventListener('click', () => {

    const tag = el.dataset.tag;
    const active = selected.has(tag);

    if (active) {
      selected.delete(tag);
    } else {
      selected.add(tag);
    }

    el.classList.toggle('bg-dark', !active);
    el.classList.toggle('text-light', !active);
    el.classList.toggle('text-dark', active);
	el.classList.toggle('bg-light', active);

    applyFilters();
  });
});

function applyFilters() {

  // 未選擇 → 初始狀態
  if (selected.size === 0) {
    render(posts);
    return;
  }

  const filtered = posts.filter(post =>
    [...selected].every(tag => post.tags.includes(tag))
  );

  render(filtered);
}