(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = [...document.querySelectorAll('[data-reveal]')];
  const map = document.querySelector('.service-map');
  const title = document.querySelector('[data-service-title]');
  const counters = document.querySelectorAll('.service-counter');

  const show = (el) => el?.classList.add('is-visible');
  if (reduceMotion) { reveal.forEach(show); show(map); show(title); }
  else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => { if (entry.isIntersecting) { show(entry.target); obs.unobserve(entry.target); } });
    }, {threshold:.15});
    reveal.forEach(el => observer.observe(el));
    if (map) observer.observe(map);
    if (title) setTimeout(() => show(title), 100);
  }

  const animateCounter = (el) => {
    const target = Number(el.dataset.value || 0);
    if (reduceMotion) { el.textContent = target; return; }
    const start = performance.now(), duration = 1300;
    const tick = now => {
      const p = Math.min((now-start)/duration,1), eased = 1-Math.pow(1-p,3);
      el.textContent = Math.round(target*eased);
      if (p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){animateCounter(e.target); counterObserver.unobserve(e.target);} }), {threshold:.15});
  counters.forEach(c => counterObserver.observe(c));

  const statusTitle = document.querySelector('[data-status-title]');
  const statusCopy = document.querySelector('[data-status-copy]');
  const status = {
    strategy:['Hedonic AVM models establish the instant baseline.','Calibrate parcel attributes against 240,000+ closed deeds with real-time error bounds.'],
    intelligence:['Commercial DCF models stress-test every lease.','Audit 10-year NOI cash flows, tenant credit, and submarket cap-rate compression.'],
    engineering:['Continuous portfolio telemetry protects NAV.','Run quarterly mark-to-market revaluations across multi-state REIT and debt holdings.'],
    advisory:['Certified HBU & tax advisory unlocks hidden value.','Evaluate zoning massing envelopes, residual land value, and tax appeal evidence.']
  };
  document.querySelectorAll('.service-lane').forEach(lane => {
    const activate = () => {
      document.querySelectorAll('.service-lane').forEach(item => item.classList.remove('service-lane--active'));
      lane.classList.add('service-lane--active');
      const copy = status[lane.dataset.service];
      if (copy) { statusTitle.textContent = copy[0]; statusCopy.textContent = copy[1]; }
    };
    lane.addEventListener('mouseenter', activate);
    lane.addEventListener('focus', activate);
    lane.addEventListener('click', activate);
    lane.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' '){e.preventDefault();activate();} });
  });

  const toggle = document.querySelector('.site-menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-menu__close');
  const openMenu = () => { menu?.classList.add('is-open'); menu?.setAttribute('aria-hidden','false'); toggle?.setAttribute('aria-expanded','true'); document.body.classList.add('menu-open'); };
  const closeMenu = () => { menu?.classList.remove('is-open'); menu?.setAttribute('aria-hidden','true'); toggle?.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open'); };
  toggle?.addEventListener('click', openMenu); close?.addEventListener('click', closeMenu); menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu)); document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

  const form = document.querySelector('.newsletter-form');
  form?.addEventListener('submit', e => { e.preventDefault(); const input=form.querySelector('input'); const error=form.querySelector('.newsletter-form__error'); const value=input.value.trim(); if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){error.textContent='Enter a valid work email.';input.setAttribute('aria-invalid','true');return;} error.textContent='';input.removeAttribute('aria-invalid');window.location.href='404.html'; });
})();

// Services Section 2 — interactive offer deck
(() => {
  const cards = [...document.querySelectorAll('[data-offer]')];
  const title = document.querySelector('[data-offer-status]');
  const copy = document.querySelector('[data-offer-copy]');
  if (!cards.length || !title || !copy) return;
  const messages = {
    strategy: ['Instant AVM precision starts with verified deeds.', 'We blend hedonic regression with spatial GIS layers for bank-grade desktop valuations.'],
    intelligence: ['Income appraisals demand lease-by-lease rigor.', 'We model 10-year DCF waterfalls, expense recoveries, and exit cap-rate sensitivities.'],
    engineering: ['Portfolio valuations stay synchronized every quarter.', 'We automate mark-to-market NAV tracking and LTV covenant reporting for funds.'],
    advisory: ['Specialist advisory resolves complex land & tax disputes.', 'We deliver USPAP & RICS expert reports for zoning entitlements and assessment appeals.']
  };
  const activate = card => {
    cards.forEach(item => item.classList.toggle('is-selected', item === card));
    const message = messages[card.dataset.offer];
    if (message) { title.textContent = message[0]; copy.textContent = message[1]; }
  };
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => activate(card));
    card.addEventListener('focus', () => activate(card));
    card.addEventListener('click', () => activate(card));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(card); }
    });
  });
})();


// Services Section 3 — delivery path interaction
(() => {
  const steps = [...document.querySelectorAll('[data-delivery-step]')];
  const title = document.querySelector('[data-delivery-title]');
  const copy = document.querySelector('[data-delivery-copy]');
  if (!steps.length || !title || !copy) return;
  const messages = {
    align: ['Verified parcel data sets a rock-solid baseline.', 'Automated deed ingestion and spatial boundary checks eliminate manual title errors.'],
    build: ['Comparable sales are weighted by real market drivers.', 'Hedonic and spatial adjustments quantify GLA, condition, view, and micro-location premiums.'],
    activate: ['Multi-approach modeling reconciles Income, Sales & Cost.', '10-year DCF cash flows and replacement cost schedules cross-check market comps.'],
    improve: ['MAI & RICS certification makes every report audit-proof.', 'Signed USPAP and Red-Book dossiers export directly into lender underwriting systems.']
  };
  const activate = step => {
    steps.forEach(item => item.classList.toggle('is-active', item === step));
    const message = messages[step.dataset.deliveryStep];
    if (message) { title.textContent = message[0]; copy.textContent = message[1]; }
  };
  const go404 = () => { window.location.href = '404.html'; };
  steps.forEach(step => {
    step.addEventListener('mouseenter', () => activate(step));
    step.addEventListener('focus', () => activate(step));
    step.addEventListener('click', go404);
    step.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go404(); }
    });
  });
})();

// Services Section 4 — outcome console interaction
(() => {
  const bands = [...document.querySelectorAll('[data-impact]')];
  const copy = document.querySelector('[data-impact-copy]');
  const counter = document.querySelector('[data-impact-counter]');
  if (!bands.length || !copy) return;
  const messages = {
    visibility: 'Itemized comparable adjustment grids make every valuation transparent to credit committees.',
    velocity: 'Automated parcel and rent-roll ingestion cuts appraisal turnaround time by 74%.',
    value: 'Continuous mark-to-market telemetry protects portfolio LTV and fund NAV accuracy.'
  };
  bands.forEach(band => {
    const activate = () => {
      bands.forEach(item => item.classList.toggle('is-active', item === band));
      bands.forEach(item => item.setAttribute('aria-pressed', String(item === band)));
      copy.textContent = messages[band.dataset.impact] || messages.visibility;
    };
    band.addEventListener('mouseenter', activate);
    band.addEventListener('focus', activate);
    band.addEventListener('click', () => { window.location.href = '404.html'; });
  });
  if (counter) {
    const target = Number(counter.dataset.impactCounter || 0);
    let done = false;
    const animate = () => {
      if (done) return;
      done = true;
      const start = performance.now();
      const duration = 1100;
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        counter.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { animate(); observer.disconnect(); }
    }, {threshold:.35});
    observer.observe(counter);
  }
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
