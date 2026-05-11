(function () {
  const initCarousel = (root) => {
    if (root._carouselTimer) {
      window.clearInterval(root._carouselTimer);
      root._carouselTimer = null;
    }

    const slides = Array.from(root.querySelectorAll(':scope > .slide'));
    if (!slides.length) return;

    root.querySelector(':scope > .carousel-bullets')?.remove();

    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    if (index < 0) index = 0;

    const bullets = slides.map((slide, slideIndex) => {
      const button = document.createElement('button');
      button.className = 'carousel-bullet';
      button.type = 'button';
      button.setAttribute('aria-label', `Bild ${slideIndex + 1} anzeigen`);
      button.dataset.slide = String(slideIndex);
      return button;
    });

    const bulletNav = document.createElement('div');
    bulletNav.className = 'carousel-bullets';
    bulletNav.setAttribute('aria-label', 'Slider Navigation');
    bulletNav.append(...bullets);
    root.appendChild(bulletNav);

    const show = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === index;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      bullets.forEach((bullet, bulletIndex) => {
        const isActive = bulletIndex === index;
        bullet.classList.toggle('is-active', isActive);
        bullet.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    const restartAutoplay = () => {
      if (root.dataset.autoplay === 'false') return;
      if (root._carouselTimer) window.clearInterval(root._carouselTimer);
      root._carouselTimer = window.setInterval(() => show(index + 1), 6500);
    };

    const goTo = (nextIndex) => {
      show(nextIndex);
      restartAutoplay();
    };

    const prevButton = root.querySelector('[data-prev]');
    const nextButton = root.querySelector('[data-next]');
    if (prevButton) prevButton.onclick = () => goTo(index - 1);
    if (nextButton) nextButton.onclick = () => goTo(index + 1);
    bullets.forEach((bullet, bulletIndex) => {
      bullet.addEventListener('click', () => goTo(bulletIndex));
    });

    show(index);

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
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const navItems = navAnchors
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute('href'))
    }))
    .filter((item) => item.section);
  const getNavOffset = () => {
    const cssOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-scroll-offset'));
    return Number.isFinite(cssOffset) ? cssOffset : 92;
  };
  const updateActiveNav = () => {
    const activationLine = getNavOffset() + 1;
    let activeItem = navItems[0];

    navItems.forEach((item) => {
      if (item.section.getBoundingClientRect().top <= activationLine) activeItem = item;
    });

    const hashItem = navItems.find((item) => item.link.hash === window.location.hash);
    if (hashItem) {
      const rect = hashItem.section.getBoundingClientRect();
      if (rect.top <= activationLine && rect.bottom > activationLine) activeItem = hashItem;
    }

    navItems.forEach((item) => {
      const isActive = item === activeItem;
      item.link.classList.toggle('is-active', isActive);
      if (isActive) item.link.setAttribute('aria-current', 'page');
      else item.link.removeAttribute('aria-current');
    });
  };
  updateActiveNav();
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('hashchange', updateActiveNav);
  window.addEventListener('resize', updateActiveNav);

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
      const offset = (rect.top + rect.height / 2 - viewportHeight / 2) * -0.24;
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

  const datepicker = document.getElementById('datepicker');
  if (datepicker) {
    const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const weekdayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let startDate = null;
    let endDate = null;

    const picker = document.createElement('div');
    picker.className = 'range-picker';
    picker.hidden = true;
    datepicker.closest('.date-range-field').appendChild(picker);

    const normalize = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const sameDay = (a, b) => a && b && a.getTime() === b.getTime();
    const toIso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const fromIso = (value) => {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    };
    const formatDate = (date) => `${date.getDate()}. ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    const updateField = () => {
      datepicker.value = startDate && endDate ? `${formatDate(startDate)} bis ${formatDate(endDate)}` : '';
    };

    const renderPicker = () => {
      const year = visibleMonth.getFullYear();
      const month = visibleMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const blanks = (firstDay.getDay() + 6) % 7;

      const days = [];
      for (let i = 0; i < blanks; i += 1) days.push('<span></span>');
      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        const inRange = startDate && endDate && date > startDate && date < endDate;
        const classes = [
          'range-picker-day',
          sameDay(date, today) ? 'is-today' : '',
          sameDay(date, startDate) || sameDay(date, endDate) ? 'is-selected' : '',
          inRange ? 'is-in-range' : ''
        ].filter(Boolean).join(' ');
        days.push(`<button class="${classes}" type="button" data-date="${toIso(date)}">${day}</button>`);
      }

      picker.innerHTML = `
        <div class="range-picker-header">
          <button class="range-picker-nav" type="button" data-month="-1" aria-label="Vorheriger Monat">&lsaquo;</button>
          <div class="range-picker-title">${monthNames[month]} ${year}</div>
          <button class="range-picker-nav" type="button" data-month="1" aria-label="Nächster Monat">&rsaquo;</button>
        </div>
        <div class="range-picker-grid">
          ${weekdayNames.map((day) => `<span class="range-picker-weekday">${day}</span>`).join('')}
          ${days.join('')}
        </div>
        <div class="range-picker-actions">
          <button class="range-picker-clear" type="button" data-clear>Auswahl löschen</button>
        </div>
      `;
    };

    const openPicker = () => {
      picker.hidden = false;
      renderPicker();
    };

    datepicker.addEventListener('focus', openPicker);
    datepicker.addEventListener('click', openPicker);

    picker.addEventListener('click', (event) => {
      event.stopPropagation();
      const monthButton = event.target.closest('[data-month]');
      if (monthButton) {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + Number(monthButton.dataset.month), 1);
        renderPicker();
        return;
      }

      if (event.target.closest('[data-clear]')) {
        startDate = null;
        endDate = null;
        updateField();
        renderPicker();
        return;
      }

      const dayButton = event.target.closest('[data-date]');
      if (!dayButton) return;
      const selected = normalize(fromIso(dayButton.dataset.date));
      if (!startDate || endDate) {
        startDate = selected;
        endDate = null;
      } else if (selected < startDate) {
        endDate = startDate;
        startDate = selected;
      } else {
        endDate = selected;
      }
      updateField();
      renderPicker();
      if (startDate && endDate) picker.hidden = true;
    });

    document.addEventListener('click', (event) => {
      if (!picker.contains(event.target) && event.target !== datepicker) picker.hidden = true;
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') picker.hidden = true;
    });

    datepicker.form?.addEventListener('reset', () => {
      startDate = null;
      endDate = null;
      picker.hidden = true;
      renderPicker();
    });
  }

  const form = document.querySelector('.booking-form');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

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

