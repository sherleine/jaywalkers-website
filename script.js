/* The Jaywalkers opening transition — always starts at the landing page */
(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
  document.body.classList.add('intro-active');
  const heroTitle = document.querySelector('.hero-title');
  const header = document.querySelector('.site-header');
  const heroPhoto = document.querySelector('.hero-photo-wrap');
  const intro = document.createElement('div');
  intro.className = 'intro-screen';
  intro.setAttribute('aria-label', 'The Jaywalkers introduction');
  intro.innerHTML = `<div class="intro-title" aria-hidden="true"><span class="intro-the">The</span><span class="intro-name">Jaywalkers</span></div>`;
  const style = document.createElement('style');
  style.textContent = `
    html { scroll-behavior: auto !important; }
    body.intro-active { overflow: hidden; }
    body.intro-active .site-header, body.intro-active .hero-photo-wrap, body.intro-active .hero-title { opacity: 0; }
    .site-header, .hero-photo-wrap, .hero-title { transition: opacity 850ms ease; }
    .intro-screen { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; background: #D19214; color: #3F240F; overflow: hidden; pointer-events: none; }
    .intro-title { position: fixed; left: 50%; top: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; line-height: .76; transform: translate(-50%, -50%); transform-origin: center center; will-change: transform, opacity; opacity: 0; transition: transform 1550ms cubic-bezier(.2,.78,.18,1), opacity 700ms ease; }
    .intro-the, .intro-name { display: block; font-family: "Cooper Black", "Cooper Std Black", Georgia, serif; font-weight: 900; letter-spacing: -.065em; }
    .intro-the { color: #F2C980; font-size: clamp(4rem, 10vw, 9rem); }
    .intro-name { color: #3F240F; font-size: clamp(5rem, 14vw, 14rem); }
    .intro-title.is-visible { opacity: 1; }
    .intro-screen.is-moving { animation: revealHome 1550ms cubic-bezier(.2,.78,.18,1) forwards; }
    @keyframes revealHome { 0% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 0 100% 0); visibility: hidden; } }
    @media (max-width: 650px) {
      .intro-title { width: 100%; max-width: 100vw; }
      .intro-the { font-size: clamp(2.8rem, 11vw, 4rem); }
      .intro-name { font-size: clamp(4.4rem, 20.5vw, 7rem); letter-spacing: -.085em; white-space: nowrap; }
    }
    @media (prefers-reduced-motion: reduce) {
      .intro-screen { display: none; }
      body.intro-active { overflow: auto; }
      body.intro-active .site-header, body.intro-active .hero-photo-wrap, body.intro-active .hero-title { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.prepend(intro);
  const title = intro.querySelector('.intro-title');
  window.requestAnimationFrame(() => { window.scrollTo(0, 0); title.classList.add('is-visible'); });
  window.setTimeout(() => {
    if (!heroTitle) return;
    const target = heroTitle.getBoundingClientRect();
    const introRect = title.getBoundingClientRect();
    const targetCenterX = target.left + target.width / 2;
    const targetCenterY = target.top + target.height / 2;
    const introCenterX = introRect.left + introRect.width / 2;
    const introCenterY = introRect.top + introRect.height / 2;
    const scale = Math.min(target.width / introRect.width, target.height / introRect.height);
    const x = targetCenterX - introCenterX;
    const y = targetCenterY - introCenterY;
    title.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
    intro.classList.add('is-moving');
    if (header) header.style.opacity = '1';
    if (heroPhoto) heroPhoto.style.opacity = '1';
    heroTitle.style.opacity = '1';
  }, 1250);
  window.setTimeout(() => { intro.remove(); document.body.classList.remove('intro-active'); window.scrollTo(0, 0); }, 3000);
})();

const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }); }, { threshold: 0.12 });
document.querySelectorAll('section').forEach((section) => observer.observe(section));

/* =========================================
   THE JAYWALKERS — MAZE EASTER EGG
   ========================================= */
(() => {
  const game = document.getElementById('maze-game');
  const openButton = document.querySelector('.jaywalkers-float');
  const homeButton = document.getElementById('maze-home');
  const startButton = document.getElementById('maze-start');
  const completeHomeButton = document.getElementById('maze-complete-home');
  const startScreen = document.getElementById('maze-start-screen');
  const playScreen = document.getElementById('maze-play-screen');
  const completeScreen = document.getElementById('maze-complete-screen');
  const board = document.getElementById('maze-board');
  const status = document.getElementById('maze-status');
  if (!game || !openButton || !board) return;
  const maze = ['111111111111111','100000100000001','101110101111101','101000100000101','101011111110101','101000100000101','101111111010101','100000001010001','111111101011101','100000001000001','101111111111101'];
  const player = { row: 1, col: 1 };
  const goal = { row: 9, col: 13 };
  let started = false;
  const moves = { up: [-1,0], down: [1,0], left: [0,-1], right: [0,1] };
  function openGame() { game.classList.add('is-open'); game.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; resetGame(); }
  function closeGame() { game.classList.remove('is-open'); game.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  function resetGame() { started=false; player.row=1; player.col=1; startScreen.hidden=false; playScreen.hidden=true; completeScreen.hidden=true; status.textContent='FIND THE GUITAR'; renderBoard(); }
  function startGame() { started=true; player.row=1; player.col=1; startScreen.hidden=true; playScreen.hidden=false; completeScreen.hidden=true; status.textContent='FIND THE GUITAR'; renderBoard(); }
  function renderBoard() {
    board.innerHTML='';
    maze.forEach((row,rowIndex) => [...row].forEach((cell,colIndex) => {
      const tile=document.createElement('div'); tile.className=`maze-cell ${cell==='1'?'wall':'floor'}`;
      if(rowIndex===goal.row && colIndex===goal.col){ tile.classList.add('goal'); tile.setAttribute('aria-label','Red guitar goal'); const guitar=document.createElement('img'); guitar.className='maze-guitar-sprite'; guitar.src='assets/guitar-goal.svg'; guitar.alt='Red guitar'; guitar.setAttribute('aria-hidden','true'); tile.appendChild(guitar); }
      if(rowIndex===player.row && colIndex===player.col && started){
        const sprite=document.createElement('img');
        sprite.className='maze-player-sprite';
        sprite.src='assets/nigel-frame1.png';
        sprite.alt='Nigel';
        sprite.setAttribute('aria-hidden','true');
        tile.appendChild(sprite);
      }
      board.appendChild(tile);
    }));
  }
  function move(direction) {
    if(!started || !moves[direction]) return;
    const [rowDelta,colDelta]=moves[direction]; const nextRow=player.row+rowDelta; const nextCol=player.col+colDelta;
    if(!maze[nextRow] || maze[nextRow][nextCol]!=='0') return;
    player.row=nextRow; player.col=nextCol; renderBoard();
    if(player.row===goal.row && player.col===goal.col){ started=false; window.setTimeout(()=>{ playScreen.hidden=true; completeScreen.hidden=false; },220); }
  }
  openButton.addEventListener('click',openGame); homeButton.addEventListener('click',closeGame); completeHomeButton.addEventListener('click',closeGame); startButton.addEventListener('click',startGame);
  game.querySelectorAll('[data-move]').forEach((button)=>button.addEventListener('click',()=>move(button.dataset.move)));
  window.addEventListener('keydown',(event)=>{
    if(!game.classList.contains('is-open')) return;
    if(event.key==='Escape'){ closeGame(); return; }
    const keyMoves={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
    const direction=keyMoves[event.key]; if(direction){ event.preventDefault(); move(direction); }
  });
})();
