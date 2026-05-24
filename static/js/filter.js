let posts = [];
let selected = new Set();
let tagSet = new Set();

const results = document.getElementById('results');

// 初始狀態

// =========================
// ① fetch posts
// =========================
fetch('/index.json')
  .then(res => res.json())
  .then(data => {
    posts = data;

    // =========================
    // ② build tagSet（核心）
    // =========================
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });

    // =========================
    // ③ prune UI tags（隱藏不存在tag）
    // =========================
    document.querySelectorAll('.filter-tag').forEach(el => {
      const tag = el.dataset.tag;

      if (!tagSet.has(tag)) {
        el.style.display = "none";
      }
    });

    // =========================
    // ④ initial render
    // =========================
    applyFilters();
  });

// =========================
// ⑤ render
// =========================
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

// =========================
// ⑥ click handler
// =========================
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

// =========================
// ⑦ filter logic
// =========================
function applyFilters() {

  // ✔ 未選任何 tag → 顯示「未篩選」
  if (selected.size === 0) {
    results.innerHTML = `<div class="text-muted">目前沒有篩選任何tag</div>`;
    return;
  }

  // 篩選資料
  const filtered = posts.filter(post =>
    [...selected].every(tag => post.tags.includes(tag))
  );

  // render 結果
  render(filtered);
}