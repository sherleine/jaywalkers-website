/* The Jaywalkers opening transition — one continuous title movement */
(() => {
  document.body.classList.add('intro-active');

  const heroTitle = document.querySelector('.hero-title');
  const intro = document.createElement('div');
  intro.className = 'intro-screen';
  intro.setAttribute('aria-label', 'The Jaywalkers introduction');
  intro.innerHTML = `
    <div class="intro-title" aria-hidden="true">
      <span class="intro-the">The</span>
      <span class="intro-name">Jaywalkers</span>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    body.intro-active { overflow: hidden; }

    body.intro-active .site-header,
    body.intro-active .hero-photo-wrap,
    body.intro-active .hero-title {
      opacity: 0;
    }

    .site-header,
    .hero-photo-wrap,
    .hero-title {
      transition: opacity 850ms ease;
    }

    .intro-screen {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      place-items: center;
      background: #D19214;
      color: #3F240F;
      overflow: hidden;
      pointer-events: none;
    }

    .intro-title {
      position: fixed;
      left: 50%;
      top: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      line-height: .76;
      transform: translate(-50%, -50%);
      transform-origin: center center;
      will-change: transform;
      transition: transform 1500ms cubic-bezier(.2,.78,.18,1);
    }

    .intro-the,
    .intro-name {
      display: block;
      font-family: "Cooper Black", "Cooper Std Black", Georgia, serif;
      font-weight: 900;
      letter-spacing: -.065em;
    }

    .intro-the {
      color: #F2C980;
      font-size: clamp(4rem, 10vw, 9rem);
    }

    .intro-name {
      color: #3F240F;
      font-size: clamp(5rem, 14vw, 14rem);
    }

    /* The mustard curtain leaves while the same title travels to its homepage position. */
    .intro-screen.is-moving {
      animation: revealHome 1500ms cubic-bezier(.2,.78,.18,1) forwards;
    }

    @keyframes revealHome {
      0% { clip-path: inset(0 0 0 0); }
      100% { clip-path: inset(0 0 100% 0); visibility: hidden; }
    }

    @media (prefers-reduced-motion: reduce) {
      .intro-screen { display: none; }
      body.intro-active { overflow: auto; }
      body.intro-active .site-header,
      body.intro-active .hero-photo-wrap,
      body.intro-active .hero-title {
        opacity: 1;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.prepend(intro);

  // Start the homepage reveal first, then move the exact same title into place.
  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      if (!heroTitle) return;

      const target = heroTitle.getBoundingClientRect();
      const title = intro.querySelector('.intro-title');
      const introRect = title.getBoundingClientRect();

      const targetCenterX = target.left + target.width / 2;
      const targetCenterY = target.top + target.height / 2;
      const introCenterX = introRect.left + introRect.width / 2;
      const introCenterY = introRect.top + introRect.height / 2;

      const scale = Math.min(
        target.width / introRect.width,
        target.height / introRect.height
      );

      const x = targetCenterX - introCenterX;
      const y = targetCenterY - introCenterY;

      title.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
      intro.classList.add('is-moving');

      // Reveal the real homepage elements underneath at the same moment the
      // moving title arrives, so there is no second title or visual break.
      document.querySelector('.site-header').style.opacity = '1';
      document.querySelector('.hero-photo-wrap').style.opacity = '1';
      heroTitle.style.opacity = '1';
    }, 1500);
  });

  window.setTimeout(() => {
    intro.remove();
    document.body.classList.remove('intro-active');
  }, 3100);
})();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('section').forEach((section) => observer.observe(section));
