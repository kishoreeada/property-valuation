# Stackly Property Valuation — Production Frontend & Documentation

Production-ready Multi-Page Application (MPA) and Single-Page Dashboard workspace for **Stackly Property Valuation**, engineered with a warm Architectural Bronze, Terracotta Copper, Luminous Gold, and Deep Obsidian Slate visual design system while preserving the exact reference architecture for the Header, Footer, Sidebar, and 404 views.

## File Architecture & Directory Structure

```text
property-valuation/
├── index.html
├── about.html
├── services.html
├── blog.html
├── contact.html
├── login.html
├── signup.html
├── forgot-password.html
├── admin-dashboard.html
├── client-dashboard.html
├── 404.html
├── script.js
├── about.js
├── services.js
├── blog.js
├── contact.js
├── auth.js
├── dashboard.js
├── 404.js
├── Property_Valuation_Documentation.pdf
├── README.md
├── CSS/
│   ├── shared.css
│   ├── style.css
│   ├── about.css
│   ├── services.css
│   ├── blog.css
│   ├── contact.css
│   ├── auth.css
│   ├── dashboard.css
│   └── 404.css
└── assets/
    ├── stackly-logo-amber.webp
    ├── hero-valuation-studio.webp
    ├── valuation-residential.webp
    ├── valuation-commercial.webp
    ├── valuation-land.webp
    ├── valuation-industrial.webp
    ├── blog-hero-editorial.webp
    ├── fontawesome-all.min.css
    ├── about/
    │   ├── about-team.webp
    │   ├── about-story-clean.webp
    │   └── about-advantage-clean.webp
    ├── avatars/
    │   ├── avatar-mentor.webp
    │   ├── avatar-learner.webp
    │   └── avatar-lead.webp
    └── webfonts/
        └── fa-solid-900.woff2
```

## Key Highlights & Architectural Specifications
1. **Identical Header, Footer, Sidebar & 404 Structure (`CSS/shared.css`, `CSS/404.css`, `CSS/dashboard.css`)**:
   - **Header & Footer**: Fixed glassmorphic header with centered desktop navigation, active link underline directly beneath link text (`bottom: 0; padding: 2px 0; line-height: 1.15`), full-screen mobile navigation drawer, and synchronized active link indicator in the footer Explore column.
   - **Dashboard Sidebar**: Persistent `position: fixed` sidebar on desktop viewports (`272px` / `248px`) and responsive off-canvas slide-out drawer below `900px` across `admin-dashboard.html` and `client-dashboard.html`.
   - **404 Error Page**: Locked to a non-scrolling fixed viewport (`100dvh`, `overflow: hidden`) with zero animations, centered **404 NOT FOUND** typography, and **Go to Home** / **Previous Page** controls directly below.
2. **Complete Layout Design, Palette & Content Transformation**:
   - **Architectural Bronze & Obsidian Slate Palette**: Primary `--accent: #b45309`, Deep Copper `--accent-dark: #8c3b05`, Luminous Gold `--brand-green-bright: #f59e0b`, Obsidian Slate `--navy: #211813`, and Warm Limestone surfaces (`#faf7f2`).
   - **Redesigned Section Compositions**: 100% Flexbox layouts (zero CSS Grid) featuring reversed split-panel workspaces, 2x2 horizontal appraisal dossier cards, architectural top border accents, and interactive AVM, DCF, and USPAP/RICS telemetry across all 11 pages.
3. **Sub-100KB WebP Visual Assets**: All custom-generated architectural, residential, commercial, industrial, land zoning, and editorial assets are optimized in `.webp` format strictly under `100KB`.
