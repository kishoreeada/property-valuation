(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const nameInput = form.elements.name;
  const emailInput = form.elements.email;
  const topicInput = form.elements.topic;
  const messageInput = form.elements.message;

  const formError = form.querySelector('.contact-form__error');
  const formSuccess = form.querySelector('.contact-form__success');

  const namePattern = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let submittedOnce = false;

  const getErrorEl = (input) => {
    const id = input?.getAttribute('aria-describedby');
    return id ? document.getElementById(id) : input?.parentElement?.querySelector('.contact-field__error');
  };

  const setFieldState = (input, errorMessage) => {
    if (!input) return true;
    const errorEl = getErrorEl(input);
    const wrapper = input.closest('.contact-field') || input.parentElement;

    if (errorMessage) {
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      wrapper?.classList.add('has-error');
      if (errorEl) errorEl.textContent = errorMessage;
      return false;
    } else {
      input.removeAttribute('aria-invalid');
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      wrapper?.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  };

  const validateName = () => {
    const value = (nameInput?.value || '').trim();
    if (!value) return setFieldState(nameInput, 'Full name is required.');
    if (value.length < 2) return setFieldState(nameInput, 'Full name must be at least 2 characters.');
    if (!namePattern.test(value)) {
      return setFieldState(nameInput, 'Enter a valid name using letters, spaces, hyphens, or periods.');
    }
    return setFieldState(nameInput, '');
  };

  const validateEmail = () => {
    const value = (emailInput?.value || '').trim();
    if (!value) return setFieldState(emailInput, 'Work or institutional email is required.');
    if (!emailPattern.test(value)) {
      return setFieldState(emailInput, 'Enter a valid email address (e.g., you@domain.com).');
    }
    return setFieldState(emailInput, '');
  };

  const validateTopic = () => {
    const value = (topicInput?.value || '').trim();
    if (!value) return setFieldState(topicInput, 'Please select a valuation mandate.');
    return setFieldState(topicInput, '');
  };

  const validateMessage = () => {
    const value = (messageInput?.value || '').trim();
    if (!value) return setFieldState(messageInput, 'Please share your property details or valuation goal.');
    if (value.length < 10) {
      return setFieldState(messageInput, 'Please enter at least 10 characters so we can scope your valuation.');
    }
    return setFieldState(messageInput, '');
  };

  const validators = new Map([
    [nameInput, validateName],
    [emailInput, validateEmail],
    [topicInput, validateTopic],
    [messageInput, validateMessage]
  ]);

  validators.forEach((validateFn, input) => {
    if (!input) return;
    input.addEventListener('blur', () => {
      validateFn();
    });
    const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(eventType, () => {
      if (formSuccess && !formSuccess.hidden) {
        formSuccess.hidden = true;
        formSuccess.textContent = '';
      }
      if (submittedOnce || input.getAttribute('aria-invalid') === 'true' || input.classList.contains('is-valid')) {
        validateFn();
      }
      if (formError && formError.textContent) {
        const anyInvalid = [...validators.keys()].some((el) => el?.getAttribute('aria-invalid') === 'true');
        if (!anyInvalid) formError.textContent = '';
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submittedOnce = true;

    if (formError) formError.textContent = '';
    if (formSuccess) {
      formSuccess.hidden = true;
      formSuccess.textContent = '';
    }

    const validName = validateName();
    const validEmail = validateEmail();
    const validTopic = validateTopic();
    const validMessage = validateMessage();

    if (!validName || !validEmail || !validTopic || !validMessage) {
      if (formError) {
        formError.textContent = 'Please fix the highlighted fields above before submitting.';
      }
      const firstInvalid = [nameInput, emailInput, topicInput, messageInput].find(
        (el) => el && el.getAttribute('aria-invalid') === 'true'
      );
      firstInvalid?.focus();
      return;
    }

    if (formSuccess) {
      formSuccess.textContent = 'Thank you! Your property valuation request has been submitted. Our MAI/RICS appraisal desk will respond within 24 hours.';
      formSuccess.hidden = false;
    }

    form.reset();
    submittedOnce = false;
    [nameInput, emailInput, topicInput, messageInput].forEach((input) => {
      if (!input) return;
      input.removeAttribute('aria-invalid');
      input.classList.remove('is-invalid', 'is-valid');
      input.closest('.contact-field')?.classList.remove('has-error');
    });
  });
})();

(() => {
  const items = document.querySelectorAll('.contact-brief__item');
  if (!items.length) return;
  items.forEach((item) => {
    const trigger = item.querySelector('.contact-brief__trigger');
    const answer = item.querySelector('.contact-brief__answer');
    if (!trigger || !answer) return;
    trigger.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      items.forEach((other) => {
        other.classList.remove('is-open');
        const otherTrigger = other.querySelector('.contact-brief__trigger');
        const otherAnswer = other.querySelector('.contact-brief__answer');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.hidden = true;
      });
      if (!open) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });
})();
