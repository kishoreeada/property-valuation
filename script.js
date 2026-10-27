(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 760,
      easing: "ease-out-cubic",
      offset: 45,
      disable: reduceMotion
    });
  }

  // Real counters: requestAnimationFrame interpolation, independent of any CDN/library.
  const counters = document.querySelectorAll(".counter");

  const countUp = (el) => {
    const target = Number(el.dataset.value || 0);
    const decimals = Number(el.dataset.decimals || 0);
    const duration = 1450;
    const start = performance.now();

    if (reduceMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    };

    requestAnimationFrame(tick);
  };

  counters.forEach((el, index) => {
    setTimeout(() => countUp(el), 500 + index * 140);
  });

  if (reduceMotion) return;

  // Hero title: controlled text entrance.
  document.querySelectorAll(".word-line").forEach((line, index) => {
    line.style.opacity = "0";
    line.style.transform = "translateY(38px)";
    setTimeout(() => {
      line.style.transition = "opacity .8s cubic-bezier(.2,.75,.2,1), transform .8s cubic-bezier(.2,.75,.2,1)";
      line.style.opacity = "1";
      line.style.transform = "translateY(0)";
    }, 100 + index * 130);
  });

  const dashboard = document.querySelector(".dashboard-shell");
  const visual = document.querySelector(".hero__visual");
  const notes = document.querySelectorAll("[data-float]");

  if (dashboard && visual) {
    dashboard.style.opacity = "0";
    dashboard.style.transform = "translateY(28px) rotateY(-2deg) rotateX(1deg)";
    setTimeout(() => {
      dashboard.style.transition = "opacity 1s ease, transform 1s cubic-bezier(.2,.75,.2,1)";
      dashboard.style.opacity = "1";
      dashboard.style.transform = "translateY(0) rotateY(-2deg) rotateX(1deg)";
    }, 240);
  }

  notes.forEach((note, index) => {
    note.style.opacity = "0";
    note.style.transform = "translateY(16px)";
    setTimeout(() => {
      note.style.transition = "opacity .65s ease, transform .65s cubic-bezier(.2,.75,.2,1)";
      note.style.opacity = "1";
      note.style.transform = "translateY(0)";
    }, 700 + index * 130);
  });

  // Ambient floating motion for data callouts.
  notes.forEach((note, index) => {
    let direction = 1;
    const base = 0;
    const float = () => {
      if (document.hidden) return;
      note.animate(
        [{ transform: `translateY(${base}px)` }, { transform: `translateY(${base - 5 * direction}px)` }],
        { duration: 2200 + index * 250, easing: "ease-in-out", direction: "alternate", iterations: 1 }
      ).finished.then(() => { direction *= -1; float(); }).catch(() => {});
    };
    setTimeout(float, 1300 + index * 250);
  });

  // Studio pointer parallax, only for fine pointers.
  if (visual && dashboard && window.matchMedia("(pointer:fine)").matches) {
    visual.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      dashboard.style.transition = "transform .45s ease";
      dashboard.style.transform = `rotateY(${-2 - x * 3}deg) rotateX(${1 + y * 2}deg) translateY(0)`;
    });

    visual.addEventListener("pointerleave", () => {
      dashboard.style.transform = "rotateY(-2deg) rotateX(1deg) translateY(0)";
    });
  }

  // Button micro-interaction.
  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".magnetic-button").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const r = button.getBoundingClientRect();
        const x = (event.clientX - r.left - r.width / 2) * 0.045;
        const y = (event.clientY - r.top - r.height / 2) * 0.045;
        button.style.transform = `translate(${x}px, ${y - 2}px)`;
      });
      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }
})();


/* SECTION 2 — Interactive Skill Track Workspace */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".insight-counter").forEach((el, index) => {
    const target = Number(el.dataset.target || 0);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = target % 1 ? (String(target).split(".")[1] || "").length : 0;

    if (reduceMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }

    const start = performance.now();
    const duration = 1250 + index * 100;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };

    setTimeout(() => requestAnimationFrame(tick), 300 + index * 100);
  });

  const tabs = document.querySelectorAll(".signal-nav__item");
  const title = document.querySelector("[data-panel-title]");
  const chartValue = document.querySelector("[data-chart-value]");

  const states = {
    growth: { title: "Residential & Luxury AVM", value: "142.6" },
    customers: { title: "Commercial & Income DCF", value: "136.4" },
    operations: { title: "Land, Industrial & HBU", value: "129.8" }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });

      const state = states[tab.dataset.signal];
      if (!state || !title || !chartValue) return;

      title.textContent = state.title;

      if (reduceMotion) {
        chartValue.textContent = state.value;
        return;
      }

      chartValue.animate(
        [{ opacity: 0, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 300, easing: "ease-out" }
      );
      chartValue.textContent = state.value;
    });
  });
})();


/* SECTION 3 — Active Learning Methodology counters & hover */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".decision-counter").forEach((el, index) => {
    const target = Number(el.dataset.target || 0);
    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }
    const start = performance.now();
    const duration = 1100 + index * 120;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), 450 + index * 100);
  });

  if (reduceMotion) return;

  document.querySelectorAll(".decision-feature").forEach((card) => {
    const visual = card.querySelector(".alert-visual, .cause-visual, .priority-visual");
    if (!visual) return;
    card.addEventListener("mouseenter", () => {
      visual.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(-3px)" }],
        { duration: 260, fill: "forwards", easing: "ease-out" }
      );
    });
    card.addEventListener("mouseleave", () => {
      visual.animate(
        [{ transform: "translateY(-3px)" }, { transform: "translateY(0)" }],
        { duration: 300, fill: "forwards", easing: "ease-out" }
      );
    });
  });
})();


/* SECTION 4 — Filterable Flagship Course Catalog */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const filters = document.querySelectorAll(".catalog-filter");
  const cards = document.querySelectorAll(".catalog-card");
  const statusEl = document.querySelector("[data-catalog-status]");

  const labels = {
    all: "Showing 4 flagship valuation suites",
    ai: "Showing 1 Residential & Luxury AVM suite",
    engineering: "Showing 2 Commercial & Industrial suites",
    design: "Showing 1 Land & HBU Advisory suite"
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter || "all";
      filters.forEach((f) => {
        const active = f === btn;
        f.classList.toggle("is-active", active);
        f.setAttribute("aria-selected", active ? "true" : "false");
      });

      cards.forEach((card) => {
        const matches = cat === "all" || card.dataset.category === cat;
        card.classList.toggle("is-dimmed", !matches);
        card.classList.toggle("is-highlighted", matches && cat !== "all");
        if (matches && !reduceMotion) {
          card.animate(
            [{ opacity: 0.55, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 280, easing: "ease-out" }
          );
        }
      });

      if (statusEl && labels[cat]) {
        statusEl.textContent = labels[cat];
      }
    });
  });
})();


/* SECTION 5 — Competency Radar & Skill Pulse */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tabs = document.querySelectorAll(".pulse-tab");
  const score = document.querySelector("[data-pulse-score]");
  const meter = document.querySelector("[data-score-meter]");
  const radar = document.querySelector("[data-radar-shape]");
  const states = {
    executive: { score: 91, points: "50% 6%,93% 38%,69% 91%,18% 77%,7% 34%" },
    sales: { score: 94, points: "50% 5%,96% 32%,64% 92%,17% 71%,8% 27%" },
    finance: { score: 88, points: "50% 11%,85% 43%,76% 87%,22% 83%,10% 34%" },
    operations: { score: 95, points: "50% 4%,76% 33%,89% 85%,29% 79%,11% 28%" }
  };
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      const s = states[tab.dataset.pulse];
      if (!s || !score || !meter || !radar) return;
      score.textContent = s.score;
      meter.style.width = s.score + "%";
      radar.style.clipPath = `polygon(${s.points})`;
      if (!reduceMotion) {
        score.animate([{ opacity: 0.2, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 280, easing: "ease-out" });
        meter.animate([{ transform: "scaleX(.72)" }, { transform: "scaleX(1)" }], { duration: 500, easing: "cubic-bezier(.2,.75,.2,1)" });
        radar.animate([{ opacity: 0.45, transform: "translate(-50%,-50%) scale(.9) rotate(-5deg)" }, { opacity: 1, transform: "translate(-50%,-50%) scale(1) rotate(0)" }], { duration: 450, easing: "cubic-bezier(.2,.75,.2,1)" });
      }
    })
  );
})();


/* SECTION 6 — Learner Progression Timeline counters */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = document.querySelectorAll(".journey-count");

  const runCounter = (el, index) => {
    const target = Number(el.dataset.target || 0);
    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }
    const start = performance.now();
    const duration = 900 + index * 120;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counters.forEach((counter, index) => runCounter(counter, index));
        obs.disconnect();
      });
    }, { threshold: 0.2 });
    const stage = document.querySelector(".journey__stage");
    if (stage) observer.observe(stage);
  } else {
    counters.forEach(runCounter);
  }
})();


/* SECTION 7 — Connected Learning Ecosystem interaction */
(() => {
  const sources = document.querySelectorAll(".connect-source");
  const output = document.querySelector(".connect-output");
  if (!sources.length || !output) return;

  sources.forEach((source) => {
    source.addEventListener("mouseenter", () => {
      sources.forEach((item) => item.classList.remove("is-linked"));
      source.classList.add("is-linked");
      output.animate(
        [
          { transform: "translateX(0)", boxShadow: "0 15px 35px rgba(30,27,75,.06)" },
          { transform: "translateX(3px)", boxShadow: "0 18px 40px rgba(79,70,229,.14)" },
          { transform: "translateX(0)", boxShadow: "0 15px 35px rgba(30,27,75,.06)" }
        ],
        { duration: 420, easing: "ease-out" }
      );
    });
    source.addEventListener("mouseleave", () => source.classList.remove("is-linked"));
  });
})();


/* SECTION 8 — Live Mentor Coaching Room interaction */
(() => {
  const items = document.querySelectorAll(".decision-item");
  const title = document.querySelector("[data-decision-title]"),
    copy = document.querySelector("[data-decision-copy]");
  const priority = document.querySelector("[data-decision-priority]"),
    confidence = document.querySelector("[data-decision-confidence]");
  const time = document.querySelector("[data-decision-time]"),
    owner = document.querySelector("[data-decision-owner]");
  const detail = document.querySelector(".decision-detail");
  const data = {
    expansion: {
      title: "Class-A Commercial Tower DCF & Cap-Rate Review.",
      copy: "Walk through the 10-year discounted cash flow model, terminal cap-rate matrix, and WALT lease rollover assumptions with Chief Appraiser Vikram Mehta, MAI.",
      priority: "USPAP VERIFIED",
      confidence: "98.4%",
      time: "24 hrs",
      owner: "MAI Desk"
    },
    conversion: {
      title: "Luxury Residential Portfolio Hedonic AVM Calibration.",
      copy: "Review micro-neighborhood comparable sales adjustments, view-corridor premiums, and renovation depreciation schedules with Ananya Rao, MRICS.",
      priority: "LIVE AUDIT",
      confidence: "99.1%",
      time: "12 hrs",
      owner: "AVM Desk"
    },
    capacity: {
      title: "Industrial Logistics Hub Replacement Cost & Zoning Audit.",
      copy: "Inspect Marshall & Swift replacement cost schedules, clear-height functional utility, and highway interchange liquidity with Marcus Thorne, ASA.",
      priority: "REIT READY",
      confidence: "97.8%",
      time: "36 hrs",
      owner: "Industrial"
    }
  };
  items.forEach((item) =>
    item.addEventListener("click", () => {
      items.forEach((entry) => entry.classList.remove("is-active"));
      item.classList.add("is-active");
      const state = data[item.dataset.decision];
      if (!state || !title || !copy || !priority || !confidence || !time || !owner || !detail) return;
      title.textContent = state.title;
      copy.textContent = state.copy;
      priority.textContent = state.priority;
      confidence.textContent = state.confidence;
      time.textContent = state.time;
      owner.textContent = state.owner;
      detail.animate([{ opacity: 0.45, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, easing: "ease-out" });
    })
  );
})();


/* =========================================================
   SHARED HEADER / FOOTER ACTIVE NAV & VALIDATION
   ========================================================= */
(() => {
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector(".mobile-menu");
  const menuToggle = document.querySelector(".site-menu-toggle");
  const menuClose = document.querySelector(".mobile-menu__close");
  const body = document.body;

  const setHeaderState = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove("is-open");
    body.classList.remove("menu-open");
    menu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };
  const openMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.add("is-open");
    body.classList.add("menu-open");
    menu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
  };

  menuToggle?.addEventListener("click", () => {
    menu?.classList.contains("is-open") ? closeMenu() : openMenu();
  });
  menuClose?.addEventListener("click", closeMenu);
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

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

  const newsletter = document.querySelector(".newsletter-form");
  const email = document.querySelector("#newsletter-email");
  const error = document.querySelector(".newsletter-form__error");

  newsletter?.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletter.classList.remove("is-error", "is-valid");
    const value = email.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);

    if (!value) {
      error.textContent = "Please enter your email address.";
      newsletter.classList.add("is-error");
      email.focus();
      return;
    }
    if (!valid) {
      error.textContent = "Please enter a valid email address.";
      newsletter.classList.add("is-error");
      email.focus();
      return;
    }
    newsletter.classList.add("is-valid");
    email.value = "";

    window.location.href = "404.html";
  });
})();
