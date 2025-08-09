// script.js
document.addEventListener('DOMContentLoaded', () => {
  /* --- ハンバーガー（モバイル） --- */
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('nav-list');
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
    });

    // ナビのリンクをクリックしたら閉じる（モバイル）
    navList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (navList.classList.contains('open')) {
          navList.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* --- サイドバー開閉（モバイル向け） --- */
  const sidebar = document.getElementById('sidebar');
  const sidebarInner = document.getElementById('sidebarInner');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebar && sidebarToggle && sidebarInner) {
    sidebarToggle.addEventListener('click', () => {
      const expanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
      sidebarToggle.setAttribute('aria-expanded', String(!expanded));
      // モバイル時はサイドバーをトグル表示（CSSで非表示）
      sidebar.classList.toggle('collapsed');
      // simple visual feedback
      if (expanded) {
        sidebarInner.style.display = 'none';
      } else {
        sidebarInner.style.display = 'block';
      }
    });
  }

  /* --- IntersectionObserver: フェードイン --- */
  const ioTargets = document.querySelectorAll('.section, .service-card');
  if ('IntersectionObserver' in window && ioTargets.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    ioTargets.forEach(t => io.observe(t));
  } else {
    ioTargets.forEach(t => t.classList.add('is-visible'));
  }

  /* --- レビュー（スライダー） --- */
  const reviewsList = document.getElementById('reviewsList');
  const reviewItems = reviewsList ? Array.from(reviewsList.querySelectorAll('.review-card')) : [];
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  const dotsWrap = document.getElementById('reviewDots');

  let reviewIndex = 0;
  function updateReviews(index) {
    reviewItems.forEach((item, i) => {
      const hidden = i === index ? 'false' : 'true';
      item.setAttribute('aria-hidden', hidden);
    });
    // dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      reviewItems.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'review-dot' + (i === index ? ' active' : '');
        dot.setAttribute('aria-label', `レビュー ${i+1}`);
        dot.addEventListener('click', () => {
          reviewIndex = i;
          updateReviews(reviewIndex);
        });
        dotsWrap.appendChild(dot);
      });
    }
  }

  if (reviewItems.length) {
    updateReviews(reviewIndex);
    if (prevBtn) prevBtn.addEventListener('click', () => {
      reviewIndex = (reviewIndex - 1 + reviewItems.length) % reviewItems.length;
      updateReviews(reviewIndex);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      reviewIndex = (reviewIndex + 1) % reviewItems.length;
      updateReviews(reviewIndex);
    });

    // keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        reviewIndex = (reviewIndex - 1 + reviewItems.length) % reviewItems.length;
        updateReviews(reviewIndex);
      } else if (e.key === 'ArrowRight') {
        reviewIndex = (reviewIndex + 1) % reviewItems.length;
        updateReviews(reviewIndex);
      }
    });
  }

  /* --- クイック予約フォーム（サイドバー） --- */
  const quickForm = document.getElementById('quick-form');
  const quickMsg = document.getElementById('quick-msg');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = quickForm.querySelector('[name="name"]');
      const date = quickForm.querySelector('[name="date"]');
      if (!name.value.trim()) {
        quickMsg.textContent = 'お名前を入力してください。';
        return;
      }
      if (!date.value) {
        quickMsg.textContent = '日時を選択してください。';
        return;
      }
      quickMsg.textContent = '送信しました。追ってご連絡します。';
      quickForm.reset();
      setTimeout(() => quickMsg.textContent = '', 4000);
    });
  }

  /* --- メインのお問い合わせフォーム --- */
  const form = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // clear
      form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
      formMessage.textContent = '';

      let valid = true;
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const date = form.querySelector('#date');

      if (!name.value.trim()) {
        name.nextElementSibling.textContent = 'お名前を入力してください。';
        valid = false;
      }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.value)) {
        email.nextElementSibling.textContent = '有効なメールアドレスを入力してください。';
        valid = false;
      }
      if (!date.value) {
        date.nextElementSibling.textContent = 'ご希望日時を入力してください。';
        valid = false;
      } else if (new Date(date.value) < new Date()) {
        date.nextElementSibling.textContent = '未来の日付を選択してください。';
        valid = false;
      }

      if (!valid) return;

      // success (mock)
      formMessage.textContent = 'ご予約ありがとうございます。追ってご連絡いたします。';
      form.reset();
      setTimeout(() => formMessage.textContent = '', 6000);
    });
  }
});
