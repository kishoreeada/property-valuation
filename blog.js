(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('[data-counter]');

  const animateCounter = (el) => {
    const end = Number(el.dataset.counter || 0);
    if (reduce) { el.textContent = end; return; }
    const start = performance.now();
    const duration = 1150;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(end * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  counters.forEach(counter => counterObserver.observe(counter));

  const revealItems = document.querySelectorAll('[data-reveal]');
  if (!reduce) {
    revealItems.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = `opacity .72s cubic-bezier(.2,.75,.2,1) ${index * .06}s, transform .72s cubic-bezier(.2,.75,.2,1) ${index * .06}s`;
    });
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => revealObserver.observe(el));

    const title = document.querySelector('[data-title]');
    if (title) {
      title.querySelectorAll('span, em').forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(24px)';
        setTimeout(() => {
          line.style.transition = 'opacity .82s cubic-bezier(.2,.75,.2,1), transform .82s cubic-bezier(.2,.75,.2,1)';
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        }, 120 + index * 120);
      });
    }
  }

  const form = document.querySelector('[data-blog-search]');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    window.location.href = '404.html';
  });
})();


(() => {
  const tabs = document.querySelectorAll('[data-field-tab]');
  const panels = document.querySelectorAll('[data-field-panel-content]');
  const caption = document.querySelector('[data-field-caption]');
  const captions = ['Comparable sales calibration','DCF & income capitalization','USPAP & RICS certification'];
  if (!tabs.length) return;
  const activate = (index) => {
    tabs.forEach((tab,i)=>{
      const active=i===index;
      tab.classList.toggle('is-active',active);
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
    });
    panels.forEach((panel,i)=>{ panel.hidden=i!==index; panel.classList.toggle('is-active',i===index); });
    if(caption) caption.textContent=captions[index];
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(index));
    tab.addEventListener('keydown',(event)=>{
      if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      const dir=(event.key==='ArrowDown'||event.key==='ArrowRight')?1:-1;
      const next=(index+dir+tabs.length)%tabs.length;
      activate(next); tabs[next].focus();
    });
  });
  activate(0);
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items=document.querySelectorAll('[data-field-reveal], .field-quote, .field-tab, .field-panel');
  if(!reduce && 'IntersectionObserver' in window){
    items.forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(16px)';el.style.transition=`opacity .7s ease ${Math.min(i*0.04,.4)}s, transform .7s cubic-bezier(.2,.75,.2,1) ${Math.min(i*0.04,.4)}s`;});
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.style.opacity='1';e.target.style.transform='translateY(0)';obs.unobserve(e.target)}),{threshold:.12});
    items.forEach(el=>obs.observe(el));
  }
})();

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('[data-takeaway-reveal], [data-takeaway-item]');
  if (reduce || !('IntersectionObserver' in window)) return;
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity .72s cubic-bezier(.2,.75,.2,1) ${Math.min(i * .055,.42)}s, transform .72s cubic-bezier(.2,.75,.2,1) ${Math.min(i * .055,.42)}s`;
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, {threshold:.12});
  items.forEach(el => observer.observe(el));
})();

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('[data-close-reveal]');
  if (reduce || !('IntersectionObserver' in window)) return;
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity .75s cubic-bezier(.2,.75,.2,1) ${Math.min(i * .08,.24)}s, transform .75s cubic-bezier(.2,.75,.2,1) ${Math.min(i * .08,.24)}s`;
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  items.forEach(el => observer.observe(el));
})();
