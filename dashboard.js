(() => {
  'use strict';

  const page = document.body;
  const path = window.location.pathname.toLowerCase();
  const isAdmin = path.includes('admin-dashboard');
  const isClient = path.includes('client-dashboard');

  if (!isAdmin && !isClient) {
    window.location.replace('login.html');
    return;
  }

  /* Email is read only from the current URL. Nothing is stored. */
  const params = new URLSearchParams(window.location.search);
  const email = (params.get('email') || '').trim() || (isAdmin ? 'admin@stackly.com' : 'client@stackly.com');
  const initial = (email.charAt(0) || (isAdmin ? 'A' : 'C')).toUpperCase();

  document.querySelectorAll('[data-profile-email]').forEach((el) => { el.textContent = email; });
  document.querySelectorAll('[data-profile-initial]').forEach((el) => { el.textContent = initial; });

  const sidebar = document.getElementById('dashboard-sidebar');
  const overlay = document.querySelector('.dashboard-overlay');
  const menuToggle = document.querySelector('.dashboard-menu-toggle');
  const menuClose = document.querySelector('.dashboard-menu-close');

  const setMenu = (open) => {
    sidebar?.classList.toggle('is-open', open);
    overlay?.classList.toggle('is-visible', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    page.classList.toggle('dashboard-menu-open', open);
  };

  menuToggle?.addEventListener('click', () => {
    setMenu(!sidebar?.classList.contains('is-open'));
  });
  menuClose?.addEventListener('click', () => setMenu(false));
  overlay?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const tabs = [...document.querySelectorAll('.dashboard-tab')];
  const panels = [...document.querySelectorAll('.dashboard-panel')];

  const activateTab = (name, writeHash = true) => {
    const requested = String(name || '').replace('#', '').toLowerCase();
    const valid = tabs.some((tab) => tab.dataset.tab === requested);
    const target = valid ? requested : 'overview';

    tabs.forEach((tab) => {
      const active = tab.dataset.tab === target;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    panels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.panel === target);
    });

    if (writeHash) {
      history.replaceState(null, '', `#${target}`);
    }

    setMenu(false);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  activateTab(window.location.hash, false);

  document.querySelectorAll('.dashboard-logout').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  });
})();
