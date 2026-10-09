const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('header');

  // --- Header scroll ---
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- Mobile menu ---
  const burger = document.getElementById('burger');
  const mobMenu = document.getElementById('mobMenu');
  const mobClose = document.getElementById('mobClose');

  burger.addEventListener('click', () => mobMenu.classList.add('open'));
  mobClose.addEventListener('click', () => mobMenu.classList.remove('open'));
  document.querySelectorAll('.mob-link').forEach(l =>
    l.addEventListener('click', () => mobMenu.classList.remove('open'))
  );

  // --- Pricing tabs ---
  document.querySelectorAll('.price-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.price-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.price-cat').forEach(c =>
        c.classList.toggle('active', c.dataset.cat === target)
      );
    });
  });

  // --- FAQ ---
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // --- Scroll reveal (fade-up + scale-in) ---
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-up, .scale-in').forEach(el => revealObs.observe(el));

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        e.preventDefault();
        const top = t.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Counter animation ---
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.dataset.counted) return;
      el.dataset.counted = '1';

      const text = el.textContent.trim();
      const match = text.match(/^(\d+)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stat-num').forEach(el => counterObs.observe(el));

  // --- 3D tilt on hover for cards ---
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // --- Magnetic button ---
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // --- Parallax floating emojis on mouse move ---
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const floats = heroSection.querySelectorAll('.hero-float-emoji, .hero-deco');
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      floats.forEach((el, i) => {
        const depth = (i + 1) * 12;
        el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
  }

  // --- Emoji bounce on scroll into view ---
  const emojiObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'none';
        e.target.offsetHeight;
        e.target.style.animation = 'emojiBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.fmt-emoji, .p-icon').forEach(el => emojiObs.observe(el));

  // --- Add emoji bounce keyframes dynamically ---
  const style = document.createElement('style');
  style.textContent = `
    @keyframes emojiBounce {
      0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
      60% { transform: scale(1.15) rotate(5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // --- Video modal ---
  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  if (videoModal && modalVideo) {
    document.querySelectorAll('.video-play-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.dataset.video;
        if (!src) return;
        modalVideo.src = src;
        modalVideo.load();
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalVideo.play();
      });
    });

    const closeModal = () => {
      videoModal.classList.remove('active');
      try { modalVideo.pause(); } catch (_) {}
      modalVideo.removeAttribute('src');
      modalVideo.load();
      document.body.style.overflow = '';
    };

    videoModal.querySelector('.video-modal-close').addEventListener('click', closeModal);
    videoModal.querySelector('.video-modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) closeModal();
    });
  }

  // --- Call button color change on scroll ---
  const callBtn = document.getElementById('callBtn');
  if (callBtn) {
    const sectionThemes = {
      'hero': 'dark',
      'about': 'light',
      'founder': 'light',
      'formats': 'blue',
      'teachers': 'dark',
      'pricing': 'light',
      'reviews': 'blue',
      'quiz': 'dark',
      'faq': 'light',
      'form': 'dark',
    };

    const updateCallBtnColor = () => {
      const btnRect = callBtn.getBoundingClientRect();
      const btnCenter = btnRect.top + btnRect.height / 2;

      const sections = document.querySelectorAll('section[id]');
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= btnCenter && rect.bottom >= btnCenter) {
          const theme = sectionThemes[section.id] || 'light';
          callBtn.setAttribute('data-theme', theme);
          break;
        }
      }
    };

    window.addEventListener('scroll', updateCallBtnColor, { passive: true });
    updateCallBtnColor();
  }

  // --- Contact method tabs ---
  document.querySelectorAll('.contact-tabs').forEach(tabGroup => {
    const form = tabGroup.closest('form');
    const igField = form ? form.querySelector('.ig-field') : null;

    const toggleIg = (contact) => {
      if (!igField) return;
      igField.classList.toggle('visible', contact === 'instagram');
    };

    toggleIg('instagram');

    tabGroup.querySelectorAll('.contact-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.contact-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const hidden = tabGroup.querySelector('input[type="hidden"]') || tabGroup.closest('.form-field').querySelector('input[type="hidden"]');
        if (hidden) hidden.value = tab.dataset.contact;
        toggleIg(tab.dataset.contact);
      });
    });
  });

  // --- Quiz ---
  const quizSlides = document.querySelectorAll('.quiz-slide');
  const progressBar = document.getElementById('quizProgressBar');
  const totalSteps = 6;
  let currentStep = 1;
  const visitedSteps = new Set();

  const goToStep = (step) => {
    quizSlides.forEach(s => s.classList.remove('active'));
    const target = step === 6 ? document.querySelector('.quiz-slide[data-step="form"]') : document.querySelector(`.quiz-slide[data-step="${step}"]`);
    if (target) target.classList.add('active');
    if (progressBar) progressBar.style.width = `${(step / totalSteps) * 100}%`;
    currentStep = step;
    updateNavButtons();
  };

  const updateNavButtons = () => {
    quizSlides.forEach(slide => {
      const step = parseInt(slide.dataset.step);
      if (isNaN(step)) return;
      const nextBtn = slide.querySelector('.quiz-next');
      if (nextBtn) {
        const hasSelection = slide.querySelector('.quiz-option.selected');
        nextBtn.disabled = !hasSelection;
      }
    });
  };

  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const slide = opt.closest('.quiz-slide');
      const step = parseInt(slide.dataset.step);
      slide.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      updateNavButtons();

      if (!visitedSteps.has(step)) {
        visitedSteps.add(step);
        setTimeout(() => goToStep(step + 1), 350);
      }
    });
  });

  document.querySelectorAll('.quiz-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const slide = btn.closest('.quiz-slide');
      const step = parseInt(slide.dataset.step);
      if (slide.querySelector('.quiz-option.selected')) {
        goToStep(step + 1);
      }
    });
  });

  document.querySelectorAll('.quiz-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) goToStep(currentStep - 1);
    });
  });

  // --- Form submissions ---
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwh5CA5Zbw_d5ggfPcbynuCtXtdCIWRLquWNF-Nh6rKCVpMiMRY-GMmO1gKW2ZovnL-/exec';

  const getSelectedOption = (step) => {
    const slide = document.querySelector(`.quiz-slide[data-step="${step}"]`);
    const sel = slide ? slide.querySelector('.quiz-option.selected') : null;
    return sel ? sel.dataset.value : '';
  };

  let formSent = false;

  const showSuccess = (form) => {
    const wrap = form.closest('.quiz-wrap') || form.closest('.form-cta-card');
    if (wrap) {
      wrap.innerHTML = `
        <div class="form-success">
          <h3>You did it! 🎉</h3>
          <p>Дякуємо за заявку! Наш менеджер скоро з тобою зв'яжеться — stay tuned, it's gonna be awesome! 🚀</p>
        </div>
      `;
    }
  };

  const submitForm = async (data, btn, form) => {
    if (formSent) return;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data)
      });
      formSent = true;
      showSuccess(form);
    } catch {
      btn.textContent = 'Oops, спробуй ще раз';
      btn.disabled = false;
    }
  };

  const quizForm = document.getElementById('quizForm');
  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formSent) return;
      const data = {
        source: 'quiz',
        name: document.getElementById('quizName').value,
        phone: document.getElementById('quizPhone').value,
        instagram: document.getElementById('quizInstagram').value || '',
        contact_method: document.getElementById('quizContactMethod').value,
        answers: {
          age: getSelectedOption('1'),
          experience: getSelectedOption('2'),
          level: getSelectedOption('3'),
          goal: getSelectedOption('4'),
          format: getSelectedOption('5')
        }
      };
      submitForm(data, quizForm.querySelector('.form-submit'), quizForm);
    });
  }

  const ctaForm = document.getElementById('ctaForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formSent) return;
      const data = {
        source: 'form',
        name: document.getElementById('userName').value,
        phone: document.getElementById('userPhone').value,
        instagram: document.getElementById('userInstagram').value || '',
        contact_method: document.getElementById('contactMethod').value
      };
      submitForm(data, ctaForm.querySelector('.form-submit'), ctaForm);
    });
  }

});
