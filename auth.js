(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  const namePattern = /^[A-Za-z][A-Za-z .'-]{1,79}$/;

  document.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.togglePassword);
      if (!input) return;
      const icon = button.querySelector('i');
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      button.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
      button.setAttribute('aria-pressed', String(!showing));
      if (icon) icon.className = showing ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
      input.focus();
    });
  });

  const field = (id, errorId, message) => {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!input || !error) return;
    input.setAttribute('aria-invalid', 'true');
    error.textContent = message;
  };
  const clearField = (id, errorId) => {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (input) input.removeAttribute('aria-invalid');
    if (error) error.textContent = '';
  };
  const clearStatus = (id) => {
    const el = document.getElementById(id);
    if (el) { el.className = 'auth-status'; el.textContent = ''; }
  };
  const status = (id, type, message) => {
    const el = document.getElementById(id);
    if (el) { el.className = `auth-status auth-status--${type} is-visible`; el.textContent = message; }
  };

  const login = document.getElementById('login-form');
  if (login) {
    login.addEventListener('submit', (event) => {
      event.preventDefault();
      clearStatus('login-status');
      ['login-email','login-role','login-password'].forEach((id) => clearField(id, `${id}-error`));
      let valid = true;
      const email = document.getElementById('login-email').value.trim();
      const role = document.getElementById('login-role').value;
      const password = document.getElementById('login-password').value;

      if (!email) { field('login-email','login-email-error','Work email is required.'); valid = false; }
      else if (!emailPattern.test(email)) { field('login-email','login-email-error','Enter a valid work email address.'); valid = false; }
      if (!role) { field('login-role','login-role-error','Select your workspace role.'); valid = false; }
      if (!password) { field('login-password','login-password-error','Password is required.'); valid = false; }
      else if (password.length < 6) { field('login-password','login-password-error','Password must contain at least 6 characters.'); valid = false; }
      if (!valid) return;

      status('login-status','success','Details accepted. Opening your workspace…');
      window.setTimeout(() => {
        const destination = role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
        window.location.href = `${destination}?email=${encodeURIComponent(email)}`;
      }, 300);
    });
  }

  const signup = document.getElementById('signup-form');
  const password = document.getElementById('signup-password');
  if (password) {
    const meter = document.getElementById('password-meter');
    const updateMeter = () => {
      const value = password.value;
      let level = 0;
      if (value.length >= 8) level++;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) level++;
      if (/\d/.test(value)) level++;
      if (/[^A-Za-z\d]/.test(value)) level++;
      if (meter) meter.dataset.level = String(level);
    };
    password.addEventListener('input', updateMeter);
    updateMeter();
  }
  if (signup) {
    signup.addEventListener('submit', (event) => {
      event.preventDefault();
      clearStatus('signup-status');
      ['signup-name','signup-email','signup-password','signup-confirm'].forEach((id) => clearField(id, `${id}-error`));
      const terms = document.getElementById('signup-terms');
      const termsError = document.getElementById('signup-terms-error');
      if (terms) terms.removeAttribute('aria-invalid');
      if (termsError) termsError.textContent = '';
      let valid = true;
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim().toLowerCase();
      const pass = document.getElementById('signup-password').value;
      const confirm = document.getElementById('signup-confirm').value;
      if (!name) { field('signup-name','signup-name-error','Full name is required.'); valid = false; }
      else if (!namePattern.test(name)) { field('signup-name','signup-name-error','Use letters, spaces, apostrophes, periods or hyphens only.'); valid = false; }
      if (!email) { field('signup-email','signup-email-error','Work email is required.'); valid = false; }
      else if (!emailPattern.test(email)) { field('signup-email','signup-email-error','Enter a valid work email address.'); valid = false; }
      if (!pass) { field('signup-password','signup-password-error','Password is required.'); valid = false; }
      else if (!passwordPattern.test(pass)) { field('signup-password','signup-password-error','Use 8+ characters with uppercase, lowercase, a number and a special character.'); valid = false; }
      if (!confirm) { field('signup-confirm','signup-confirm-error','Please confirm your password.'); valid = false; }
      else if (pass !== confirm) { field('signup-confirm','signup-confirm-error','Passwords do not match.'); valid = false; }
      if (!terms.checked) { terms.setAttribute('aria-invalid','true'); if (termsError) termsError.textContent = 'You must accept the Terms and Privacy Policy.'; valid = false; }
      if (!valid) return;

      status('signup-status','success','Account details accepted. Taking you to login…');
      window.setTimeout(() => { window.location.href = 'login.html'; }, 450);
    });
  }

  const forgot = document.getElementById('forgot-form');
  if (forgot) {
    forgot.addEventListener('submit', (event) => {
      event.preventDefault();
      clearStatus('forgot-status');
      clearField('forgot-email','forgot-email-error');
      const email = document.getElementById('forgot-email').value.trim();
      if (!email) { field('forgot-email','forgot-email-error','Work email is required.'); return; }
      if (!emailPattern.test(email)) { field('forgot-email','forgot-email-error','Enter a valid work email address.'); return; }
      window.location.href = '404.html';
    });
  }

  if (!reduceMotion) {
    document.querySelectorAll('.auth-shell').forEach((shell) => {
      shell.animate([{opacity:0, transform:'translateY(14px)'},{opacity:1, transform:'translateY(0)'}], {duration:650,easing:'cubic-bezier(.2,.75,.2,1)',fill:'both'});
    });
  }
})();
