/* The Jaywalkers opening transition */
(() => {
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
    .intro-screen {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      place-items: center;
      background: #D19214;
      color: #3F240F;
      overflow: hidden;
      animation: introExit 900ms cubic-bezier(.77,0,.18,1) 2600ms forwards;
    }
    .intro-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      line-height: .76;
      transform: translateY(4vh);
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
      opacity: 0;
      transform: translateY(40px) scale(.92);
      animation: introThe 900ms cubic-bezier(.2,.75,.2,1) 250ms forwards;
    }
    .intro-name {
      color: #3F240F;
      font-size: clamp(5rem, 14vw, 14rem);
      opacity: 0;
      transform: translateY(65px) scale(.92);
      animation: introName 1100ms cubic-bezier(.2,.75,.2,1) 600ms forwards;
    }
    .intro-screen::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 7px;
      background: #3F240F;
      transform: scaleX(0);
      transform-origin: left;
      animation: introLine 1800ms cubic-bezier(.2,.75,.2,1) 700ms forwards;
    }
    @keyframes introThe {
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes introName {
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes introLine {
      to { transform: scaleX(1); }
    }
    @keyframes introExit {
      0% { clip-path: inset(0 0 0 0); opacity: 1; }
      100% { clip-path: inset(0 0 100% 0); opacity: 1; visibility: hidden; }
    }
    .intro-screen + .grain { opacity: .075; }
    @media (prefers-reduced-motion: reduce) {
      .intro-screen,
      .intro-the,
      .intro-name,
      .intro-screen::after {
        animation: none !important;
      }
      .intro-screen { display: none; }
      body.intro-active { overflow: auto; }
    }
  `;

  document.head.appendChild(style);
  document.body.prepend(intro);

  window.setTimeout(() => {
    intro.remove();
    document.body.classList.remove('intro-active');
  }, 3700);
})();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('section').forEach((section) => observer.observe(section));
