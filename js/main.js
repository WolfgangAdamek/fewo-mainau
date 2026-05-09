(function () {
  const initCarousel = (root) => {
    if (root._carouselTimer) {
      window.clearInterval(root._carouselTimer);
      root._carouselTimer = null;
    }

    const slides = Array.from(root.querySelectorAll(':scope > .slide'));
    if (!slides.length) return;

    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    if (index < 0) index = 0;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === index));

    const show = (nextIndex) => {
      slides[index].classList.remove('is-active');
      index = (nextIndex + slides.length) % slides.length;
      slides[index].classList.add('is-active');
    };

    root.querySelector('[data-prev]')?.addEventListener('click', () => show(index - 1));
    root.querySelector('[data-next]')?.addEventListener('click', () => show(index + 1));

    if (root.dataset.autoplay !== 'false') {
      root._carouselTimer = window.setInterval(() => show(index + 1), 6500);
    }
  };

  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  const header = document.querySelector('.site-header');
  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 80);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    header?.classList.toggle('is-menu-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      navLinks.classList.remove('is-open');
      header?.classList.remove('is-menu-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  const parallaxSections = Array.from(document.querySelectorAll('.banner'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const updateParallax = () => {
    if (reduceMotion) return;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    parallaxSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewportHeight) return;
      const offset = (rect.top + rect.height / 2 - viewportHeight / 2) * -0.14;
      section.style.setProperty('--parallax-y', `calc(50% + ${offset.toFixed(1)}px)`);
    });
  };
  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax);

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  };

  const closeModal = (modal) => {
    if (!modal) return;
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-modal]');
    if (trigger) {
      openModal(trigger.dataset.openModal);
      return;
    }

    const close = event.target.closest('[data-close-modal]');
    if (close) {
      closeModal(close.closest('dialog'));
    }
  });

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeModal(dialog);
    });
  });

  document.querySelectorAll('[data-open-gallery]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('[data-carousel]');
      const modal = document.getElementById('gallery-modal');
      const target = modal?.querySelector('.modal-gallery');
      if (!panel || !modal || !target) return;

      const slides = Array.from(panel.querySelectorAll(':scope > .slide')).map((slide, index) => {
        const clone = slide.cloneNode(true);
        clone.classList.toggle('is-active', index === 0);
        return clone;
      });

      target.replaceChildren(...slides);
      target.insertAdjacentHTML('beforeend', '<button class="carousel-btn prev" type="button" aria-label="Vorheriges Bild" data-prev>&lsaquo;</button><button class="carousel-btn next" type="button" aria-label="Nächstes Bild" data-next>&rsaquo;</button>');
      initCarousel(target);
      openModal('gallery-modal');
    });
  });

  ['fahr-gallery', 'volkach-gallery', 'expect-gallery'].forEach((templateId) => {
    document.querySelectorAll(`[data-open-template="${templateId}"]`).forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const template = document.getElementById(templateId);
        const modal = document.getElementById('gallery-modal');
        const target = modal?.querySelector('.modal-gallery');
        if (!template || !modal || !target) return;

        target.replaceChildren(template.content.cloneNode(true));
        target.insertAdjacentHTML('beforeend', '<button class="carousel-btn prev" type="button" aria-label="Vorheriges Bild" data-prev>&lsaquo;</button><button class="carousel-btn next" type="button" aria-label="Nächstes Bild" data-next>&rsaquo;</button>');
        initCarousel(target);
        openModal('gallery-modal');
      });
    });
  });

  const rangeField = document.getElementById('booking-range');
  const arrival = document.getElementById('arrival');
  const departure = document.getElementById('departure');
  const updateBookingRange = () => {
    if (!rangeField) return;
    const parts = [];
    if (arrival?.value) parts.push(`Anreise ${arrival.value}`);
    if (departure?.value) parts.push(`Abreise ${departure.value}`);
    rangeField.value = parts.join(' - ');
  };
  arrival?.addEventListener('change', updateBookingRange);
  departure?.addEventListener('change', updateBookingRange);

  const form = document.querySelector('.booking-form');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    updateBookingRange();

    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'X-Requested-With': 'fetch' }
      });
      const text = await response.text();
      if (text.includes('success')) {
        openModal('success-modal');
        form.reset();
      } else {
        alert('Die Nachricht konnte nicht versendet werden. Bitte senden Sie uns direkt eine Email an kontakt@fewo-mainau.de.');
      }
    } catch (error) {
      alert('Die Nachricht konnte nicht versendet werden. Bitte senden Sie uns direkt eine Email an kontakt@fewo-mainau.de.');
    }
  });

  const cookiePolicy = document.querySelector('[data-cookie-policy]');
  if (document.cookie.includes('hidecookiepolicy=1')) {
    cookiePolicy?.remove();
  }

  document.querySelector('[data-close-cookie]')?.addEventListener('click', () => {
    document.cookie = 'hidecookiepolicy=1;path=/;max-age=31536000';
    cookiePolicy?.remove();
  });

  const toTop = document.querySelector('.to-top');
  const toggleToTop = () => toTop?.classList.toggle('is-visible', window.scrollY > 600);
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toggleToTop();
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

