(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');

  if (header) {
    const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  // Lightweight AOS-compatible reveal used by the existing project.
  if (window.AOS) window.AOS.init({ once: true });
  else document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('aos-animate'));

  // Mobile menu: same behavior as the completed landing page.
  const toggle = document.querySelector('.site-menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const close = document.querySelector('.mobile-menu__close');
  const setMenu = (open) => {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', open);
  };
  toggle?.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  close?.addEventListener('click', () => setMenu(false));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Animated statistics: content-specific count-up, not a generic page-wide animation.
  const counters = document.querySelectorAll('.about-counter');
  const runCounter = el => {
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = `${target}${suffix}`; return; }
    const start = performance.now();
    const duration = 1350;
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          runCounter(entry.target);
        }
      });
    }, { threshold: .15 });
    counters.forEach(el => io.observe(el));
  }

  // Story metrics use a separate count-up so the section reveals with its own rhythm.
  const storyCounters = document.querySelectorAll('.story-counter');
  const runStoryCounter = el => {
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = `${target}${suffix}`; return; }
    const start = performance.now();
    const duration = 1200;
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (storyCounters.length) {
    const storyIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          runStoryCounter(entry.target);
        }
      });
    }, { threshold: .15 });
    storyCounters.forEach(el => storyIO.observe(el));
  }

  // Pointer-aware image movement adds depth without replacing the existing fluid layout.
  const visual = document.querySelector('.about-hero__visual');
  const photo = document.querySelector('.about-photo-wrap');
  if (visual && photo && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    visual.addEventListener('pointermove', e => {
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      photo.style.transform = `rotateY(${x * 4 - 2}deg) rotateX(${y * -2}deg) translateY(-3px)`;
    });
    visual.addEventListener('pointerleave', () => { photo.style.transform = ''; });
  }

  // Newsletter behavior stays consistent with the completed site: valid email routes to 404.
  const form = document.querySelector('.newsletter-form');
  const input = document.querySelector('#newsletter-email');
  const error = document.querySelector('.newsletter-form__error');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const value = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (!valid) {
      error.textContent = 'Enter a valid work email address.';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    error.textContent = '';
    input.removeAttribute('aria-invalid');
    window.location.href = '404.html';
  });
})();

// Section 3: interactive decision loop. Each node changes the center state.
(() => {
  const nodes = document.querySelectorAll('[data-approach]');
  const core = document.querySelector('[data-approach-core]');
  const label = document.querySelector('[data-approach-label]');
  if (!nodes.length || !core || !label) return;
  const states = {
    Context: ['Parcel Intake', 'Sync deed, zoning & GIS bounds'],
    Insight: ['Hedonic Comps', 'Weight verified market sales'],
    Action: ['DCF & Cost', 'Model NOI & replacement cost'],
    Impact: ['USPAP Seal', 'Deliver MAI/RICS signed report']
  };
  nodes.forEach(node => node.addEventListener('mouseenter', () => {
    const key = node.dataset.approach;
    nodes.forEach(n => n.classList.toggle('is-active', n === node));
    core.textContent = states[key][0];
    label.textContent = states[key][1];
  }));
  nodes.forEach(node => node.addEventListener('focus', () => node.dispatchEvent(new Event('mouseenter'))));
})();


// Section 4: interactive advantage list. The status line changes with the selected principle.
(() => {
  const items = document.querySelectorAll('[data-advantage]');
  const status = document.querySelector('[data-advantage-status]');
  if (!items.length || !status) return;
  const labels = {
    clarity: 'Recorded deed evidence is the starting point',
    context: 'Micro-neighborhood polygons capture true location value',
    action: 'MAI & RICS review ensures audit-proof adjustments',
    partnership: 'USPAP & Red-Book dossiers satisfy credit committees'
  };
  const activate = item => {
    items.forEach(el => {
      const active = el === item;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    status.textContent = labels[item.dataset.advantage] || labels.clarity;
  };
  items.forEach(item => {
    item.addEventListener('mouseenter', () => activate(item));
    item.addEventListener('focus', () => activate(item));
    item.addEventListener('click', () => activate(item));
  });
})();

// Section 5: horizontal principles track. The active panel expands to create a distinct editorial interaction.
(() => {
  const cards = document.querySelectorAll('[data-principle]');
  const status = document.querySelector('[data-principle-status]');
  if (!cards.length || !status) return;
  const messages = {
    people: 'Unbiased market evidence anchors every valuation report.',
    clarity: 'Transparent adjustment tables make every figure defensible.',
    curiosity: 'Parcel-level geospatial telemetry beats zip-code averages.',
    impact: 'Every appraisal adheres strictly to USPAP & RICS standards.'
  };
  const activate = card => {
    cards.forEach(item => {
      const active = item === card;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    status.textContent = messages[card.dataset.principle] || messages.people;
  };
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => activate(card));
    card.addEventListener('focus', () => activate(card));
    card.addEventListener('click', () => activate(card));
  });
})();

// Section 6: editorial milestone rail. The current milestone receives a subtle focus state.
(() => {
  const steps = document.querySelectorAll('.close-step');
  if (!steps.length) return;
  steps.forEach(step => {
    step.addEventListener('mouseenter', () => {
      steps.forEach(item => item.classList.remove('is-current'));
      step.classList.add('is-current');
    });
    step.addEventListener('focusin', () => {
      steps.forEach(item => item.classList.remove('is-current'));
      step.classList.add('is-current');
    });
  });
})();

(() => {
  /* Shared active navigation:
     Highlight the active page link consistently in header, mobile menu, and footer. */
  const navLinks = document.querySelectorAll(".site-nav a, .mobile-nav a, .site-footer__col a");
  const rawSegment = (window.location.pathname.replace(/\/+$/, "").split("/").pop() || "index.html").toLowerCase();
  const currentPage = rawSegment.endsWith(".html") ? rawSegment : `${rawSegment}.html`;
  const validNavPages = new Set(["index.html", "about.html", "services.html", "blog.html", "contact.html"]);

  if (validNavPages.has(currentPage)) {
    navLinks.forEach((link) => {
      const href = (link.getAttribute("href") || "").split("#")[0].split("?")[0].toLowerCase();
      if (!validNavPages.has(href)) return;
      const isActive = href === currentPage;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }
})();
