document.addEventListener('DOMContentLoaded', function () {
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var triggers = document.querySelectorAll('.link-preview-trigger');
  var openCard = null;

  triggers.forEach(function (link) {
    var title = link.getAttribute('data-preview-title');
    var summary = link.getAttribute('data-preview-summary');
    var image = link.getAttribute('data-preview-image');

    if (!title && !summary && !image) return;

    var card = document.createElement('div');
    card.className = 'link-preview-card';

    if (image) {
      var img = document.createElement('img');
      img.src = image;
      img.alt = '';
      card.appendChild(img);
    }
    if (title) {
      var titleEl = document.createElement('div');
      titleEl.className = 'link-preview-title';
      titleEl.textContent = title;
      card.appendChild(titleEl);
    }
    if (summary) {
      var summaryEl = document.createElement('div');
      summaryEl.className = 'link-preview-summary';
      summaryEl.textContent = summary;
      card.appendChild(summaryEl);
    }

    link.appendChild(card);

    function positionCard() {
      card.style.left = '';
      card.style.right = '';
      var rect = card.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        card.style.right = '0';
      }
    }

    if (isTouch) {
      // 手機/平板：第一次點擊顯示預覽並攔截跳轉，第二次點擊才真正導頁
      link.addEventListener('click', function (e) {
        if (card.classList.contains('is-visible')) {
          return; // 卡片已顯示 -> 放行，正常導頁
        }
        e.preventDefault();
        if (openCard && openCard !== card) {
          openCard.classList.remove('is-visible');
        }
        card.classList.add('is-visible');
        positionCard();
        openCard = card;
      });
    } else {
      // 桌機：滑鼠 hover / 鍵盤 focus 觸發
      var showTimer, hideTimer;

      function show() {
        clearTimeout(hideTimer);
        showTimer = setTimeout(function () {
          card.classList.add('is-visible');
          positionCard();
        }, 200);
      }

      function hide() {
        clearTimeout(showTimer);
        hideTimer = setTimeout(function () {
          card.classList.remove('is-visible');
        }, 100);
      }

      link.addEventListener('mouseenter', show);
      link.addEventListener('mouseleave', hide);
      link.addEventListener('focus', show);
      link.addEventListener('blur', hide);
    }
  });

  if (isTouch) {
    // 點畫面其他地方（非目前開啟的連結/卡片）時關閉預覽
    document.addEventListener('click', function (e) {
      if (
        openCard &&
        !openCard.contains(e.target) &&
        !openCard.parentElement.contains(e.target)
      ) {
        openCard.classList.remove('is-visible');
        openCard = null;
      }
    });
  }
});