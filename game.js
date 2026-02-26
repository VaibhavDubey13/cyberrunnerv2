// CYBER MARIO RUNNER — v3
(function() {
'use strict';

// ═══════════════════════════════════════════
//  WEB AUDIO ENGINE — procedural sounds
// ═══════════════════════════════════════════
let AC = null;
let bgGain = null;
let sfxGain = null;
let bgStarted = false;

function getAC() {
  if (!AC) {
    try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  if (AC && AC.state === 'suspended') AC.resume();
  return AC;
}

function startBgMusic() {
  if (bgStarted) return;
  const ac = getAC();
  if (!ac) return;
  bgStarted = true;

  bgGain = ac.createGain();
  bgGain.gain.value = 0.18;
  bgGain.connect(ac.destination);
  window._bgGainNode = bgGain;

  sfxGain = ac.createGain();
  sfxGain.gain.value = 0.55;
  sfxGain.connect(ac.destination);
  window._sfxGainNode = sfxGain;

  // Procedural cyberpunk ambient loop
  function playBgLoop() {
    const ac2 = getAC();
    if (!ac2 || !bgGain) return;

    // Bass pulse
    const bassPattern = [55, 55, 82, 110, 55, 55, 73, 82];
    bassPattern.forEach((freq, i) => {
      const osc = ac2.createOscillator();
      const g   = ac2.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, ac2.currentTime + i * 0.25);
      g.gain.linearRampToValueAtTime(0.4, ac2.currentTime + i * 0.25 + 0.02);
      g.gain.linearRampToValueAtTime(0.3, ac2.currentTime + i * 0.25 + 0.22);
      g.gain.linearRampToValueAtTime(0, ac2.currentTime + i * 0.25 + 0.24);
      osc.connect(g); g.connect(bgGain);
      osc.start(ac2.currentTime + i * 0.25);
      osc.stop(ac2.currentTime + i * 0.25 + 0.3);
    });

    // Arp melody
    const melodyNotes = [330,392,440,523,440,392,349,330,294,330,392,440];
    melodyNotes.forEach((freq, i) => {
      if (Math.random() < 0.25) return; // glitchy feel
      const osc = ac2.createOscillator();
      const g   = ac2.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, ac2.currentTime + i * 0.166);
      g.gain.linearRampToValueAtTime(0.12, ac2.currentTime + i * 0.166 + 0.01);
      g.gain.linearRampToValueAtTime(0, ac2.currentTime + i * 0.166 + 0.14);
      osc.connect(g); g.connect(bgGain);
      osc.start(ac2.currentTime + i * 0.166);
      osc.stop(ac2.currentTime + i * 0.166 + 0.15);
    });

    // Pad chord
    [220, 277, 330].forEach(freq => {
      const osc = ac2.createOscillator();
      const g   = ac2.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.08, ac2.currentTime);
      g.gain.linearRampToValueAtTime(0.05, ac2.currentTime + 2);
      osc.connect(g); g.connect(bgGain);
      osc.start(ac2.currentTime);
      osc.stop(ac2.currentTime + 2);
    });

    setTimeout(playBgLoop, 2000);
  }
  playBgLoop();
}

function sndJump() {
  const ac = getAC();
  if (!ac || !sfxGain) return;
  const osc = ac.createOscillator();
  const g   = ac.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(300, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.12);
  g.gain.setValueAtTime(0.4, ac.currentTime);
  g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.15);
  osc.connect(g); g.connect(sfxGain);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.16);
}

function sndDoubleJump() {
  const ac = getAC();
  if (!ac || !sfxGain) return;
  [400, 600, 900].forEach((f, i) => {
    const osc = ac.createOscillator();
    const g   = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, ac.currentTime + i*0.05);
    g.gain.linearRampToValueAtTime(0.35, ac.currentTime + i*0.05 + 0.02);
    g.gain.linearRampToValueAtTime(0, ac.currentTime + i*0.05 + 0.09);
    osc.connect(g); g.connect(sfxGain);
    osc.start(ac.currentTime + i*0.05);
    osc.stop(ac.currentTime + i*0.05 + 0.1);
  });
}

function sndGem() {
  const ac = getAC();
  if (!ac || !sfxGain) return;
  [523, 659, 784, 1047].forEach((f, i) => {
    const osc = ac.createOscillator();
    const g   = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, ac.currentTime + i*0.07);
    g.gain.linearRampToValueAtTime(0.4, ac.currentTime + i*0.07 + 0.02);
    g.gain.linearRampToValueAtTime(0, ac.currentTime + i*0.07 + 0.12);
    osc.connect(g); g.connect(sfxGain);
    osc.start(ac.currentTime + i*0.07);
    osc.stop(ac.currentTime + i*0.07 + 0.13);
  });
}

function sndDie() {
  const ac = getAC();
  if (!ac || !sfxGain) return;
  const osc = ac.createOscillator();
  const g   = ac.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(440, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(55, ac.currentTime + 0.6);
  g.gain.setValueAtTime(0.5, ac.currentTime);
  g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.65);
  osc.connect(g); g.connect(sfxGain);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.7);

  // Noise burst
  const buf = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate);
  const d   = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * (1 - i/d.length);
  const src = ac.createBufferSource();
  const ng  = ac.createGain();
  src.buffer = buf;
  ng.gain.value = 0.3;
  src.connect(ng); ng.connect(sfxGain);
  src.start(ac.currentTime);
}

function sndExtraLife() {
  const ac = getAC();
  if (!ac || !sfxGain) return;
  [523,659,784,1047,1319].forEach((f,i) => {
    const osc = ac.createOscillator();
    const g   = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, ac.currentTime + i*0.1);
    g.gain.linearRampToValueAtTime(0.45, ac.currentTime + i*0.1 + 0.03);
    g.gain.linearRampToValueAtTime(0, ac.currentTime + i*0.1 + 0.15);
    osc.connect(g); g.connect(sfxGain);
    osc.start(ac.currentTime + i*0.1);
    osc.stop(ac.currentTime + i*0.1 + 0.16);
  });
}

// ═══════════════════════════════════════════
//  GAME ENGINE
// ═══════════════════════════════════════════
function init() {
  const cv = document.getElementById('c');
  if (!cv) { console.error('Canvas #c not found'); return; }
  const cx = cv.getContext('2d');

  const W=1400, H=420, GY=H-70;
  const CYAN='#00f5ff', PINK='#ff006e', YELLOW='#ffbe0b', GREEN='#39ff14';
  const BG='#020010', CDIM='#004a50', PDIM='#50002a';
  const GRAV=0.7, J1=-17, J2=-15, MW=38, MH=54, DH=32;

  let ST = 'idle';
  let score=0, best=0, gems=0, lives=3, speed=6, tick=0, gx=0;

  const M = { x:90, y:GY-MH, vy:0, onG:true, dbl:false, duck:false, inv:0, af:0, at:0, pts:[], trail:[] };
  let obs=[], coll=[], obTick=0, obNext=90, coTick=0;
  let stars=[], blds=[];
  let adShown = false;

  const elScore = document.getElementById('sScore');
  const elBest  = document.getElementById('sBest');
  const elGems  = document.getElementById('sGems');
  const elLives = document.getElementById('sLives');

  function loadHi() {
    try { best = parseInt(localStorage.getItem('cm_hi')||'0')||0; } catch(e) { best=0; }
    updateHUD();
  }
  function saveHi() {
    try { localStorage.setItem('cm_hi', best); } catch(e) {}
  }
  function updateHUD() {
    if (elScore) elScore.textContent = String(score).padStart(5,'0');
    if (elBest)  elBest.textContent  = String(best).padStart(5,'0');
    if (elGems)  elGems.textContent  = String(gems).padStart(2,'0');
    if (elLives) elLives.textContent = '❤️'.repeat(Math.max(0,lives));
  }

  // ── Extra Life Ad System ──
  // Shows a "Watch ad → get extra life" popup instead of a plain ad.
  // On game over: shows up to 2 extra life offers (one per ad watched).
  // On mid-game death with lives>0: normal invincibility, no popup.

  let extraLifeUsed = 0; // how many times player watched ad for extra life this run
  const MAX_EXTRA_LIVES = 2;

  function showExtraLifeAd(isGameOver) {
    adShown = true;
    const overlay = document.getElementById('adOverlay');
    const titleEl  = document.getElementById('adTitle');
    const bodyEl   = document.getElementById('adBody');
    const skipBtn  = document.getElementById('adSkipBtn');
    const cntEl    = document.getElementById('adCountdown');
    const extraBtn = document.getElementById('extraLifeBtn');
    const noBtn    = document.getElementById('noThanksBtn');

    if (!overlay) return;

    // Set messaging
    if (titleEl) titleEl.textContent = isGameOver ? 'GAME OVER' : 'YOU DIED!';
    if (bodyEl)  bodyEl.textContent  = isGameOver
      ? (extraLifeUsed < MAX_EXTRA_LIVES ? 'Watch a short ad and continue your run!' : 'No more continues available.')
      : 'Watch a quick ad to keep your run going!';

    // Show/hide extra life button
    const canContinue = extraLifeUsed < MAX_EXTRA_LIVES;
    if (extraBtn) extraBtn.style.display = canContinue ? 'block' : 'none';
    const box = document.getElementById('extraLifeBox');
    if (box) box.style.display = canContinue ? 'block' : 'none';
    const cl = document.getElementById('continuesLeft');
    if (cl) cl.textContent = Math.max(0, MAX_EXTRA_LIVES - extraLifeUsed);

    overlay.classList.add('visible');

    // Countdown for skip
    let secs = 5;
    if (skipBtn) { skipBtn.disabled = true; skipBtn.textContent = `SKIP IN ${secs}s`; }
    if (cntEl)   cntEl.textContent = secs;
    const iv = setInterval(() => {
      secs--;
      if (skipBtn) skipBtn.textContent = secs > 0 ? `SKIP IN ${secs}s` : 'SKIP ✕';
      if (cntEl)   cntEl.textContent = secs;
      if (secs <= 0) {
        clearInterval(iv);
        if (skipBtn) { skipBtn.disabled = false; }
      }
    }, 1000);

    // Store context for button handlers
    window._adIsGameOver = isGameOver;
  }

  window.adWatchAndContinue = function() {
    // Player clicked "WATCH AD & GET EXTRA LIFE"
    extraLifeUsed++;
    window._extraLifeUsed = extraLifeUsed;
    const el = document.getElementById('continuesLeft');
    if (el) el.textContent = Math.max(0, MAX_EXTRA_LIVES - extraLifeUsed);
    const overlay = document.getElementById('adOverlay');
    if (overlay) overlay.classList.remove('visible');
    adShown = false;

    // Give extra life + brief invincibility
    lives = Math.min(lives + 1, 3);
    M.inv = 150;
    M.vy = J1 * 0.4;
    if (ST === 'dead') ST = 'running';
    sndExtraLife();
    updateHUD();

    // Open ad in new tab (user "watched" it)
    window.open('https://www.effectivegatecpm.com/rx743m2jk?key=8b4bc3b6c51f69ca62183cec03cd5133', '_blank');
  };

  window.adSkipAndContinue = function() {
    const overlay = document.getElementById('adOverlay');
    if (overlay) overlay.classList.remove('visible');
    adShown = false;
    const btn = document.getElementById('adSkipBtn');
    if (btn) { btn.disabled = true; }
  };

  // ── Input ──
  const held = new Set();
  window.addEventListener('keydown', function(e) {
    if (adShown) return;
    if (e.code==='Space'||e.code==='ArrowUp') {
      e.preventDefault();
      if (!held.has(e.code)) { held.add(e.code); pressJump(); }
    }
    if (e.code==='ArrowDown') {
      e.preventDefault(); held.add(e.code);
      if (ST==='running') M.duck=true;
    }
  }, { capture:true });

  window.addEventListener('keyup', function(e) {
    held.delete(e.code);
    if (e.code==='ArrowDown') M.duck=false;
  });

  cv.addEventListener('click', function(e) {
    e.stopPropagation();
    if (!adShown) { startBgMusic(); pressJump(); }
  });

  document.addEventListener('click', function(e) {
    startBgMusic(); // start bg music on any click
    if (adShown) return;
    const tag = e.target.tagName.toLowerCase();
    if (tag==='a'||tag==='button'||tag==='input') return;
    pressJump();
  });

  function pressJump() {
    if (ST==='idle'||ST==='dead') { startGame(); return; }
    if (ST!=='running') return;
    if (M.onG) {
      M.vy=J1; M.onG=false; M.dbl=false;
      sndJump();
    } else if (!M.dbl) {
      M.vy=J2; M.dbl=true;
      sndDoubleJump();
    }
  }

  // ── Particles ──
  function pt(x,y,vx,vy,life,color,sz) { M.pts.push({x,y,vx,vy,life,ml:life,color,sz}); }
  function jumpFx() {
    for(let i=0;i<10;i++) pt(M.x+MW/2,M.y+MH,(Math.random()-.5)*5,Math.random()*-4-1,25,[CYAN,PINK,YELLOW][i%3],Math.random()*4+2);
  }
  function jumpFx2() {
    for(let i=0;i<16;i++) pt(M.x+MW/2,M.y+MH/2,(Math.random()-.5)*4-1,(Math.random()-.5)*4,20,CYAN,Math.random()*5+2);
  }
  function hitFx(x,y) {
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2; pt(x,y,Math.cos(a)*(Math.random()*5+2),Math.sin(a)*(Math.random()*5+2),30,PINK,Math.random()*6+2);}
  }
  function gemFx(x,y) {
    for(let i=0;i<10;i++) pt(x,y,(Math.random()-.5)*6,Math.random()*-5-2,25,YELLOW,Math.random()*4+2);
  }

  // ── Game flow ──
  function startGame() {
    ST='running'; score=0; gems=0; lives=3; speed=6; tick=0; gx=0;
    extraLifeUsed=0;
    obs=[]; coll=[]; obTick=0; obNext=90; coTick=0;
    M.y=GY-MH; M.vy=0; M.onG=true; M.duck=false; M.dbl=false; M.inv=0; M.pts=[]; M.trail=[];
    initBg(); updateHUD();
    startBgMusic();
  }

  function die() {
    hitFx(M.x+MW/2, M.y+MH/2);
    sndDie();
    lives--;
    updateHUD();

    if (lives <= 0) {
      ST = 'dead';
      if (score > best) best = score;
      saveHi(); updateHUD();
      // Game over → show extra life ad after brief pause
      setTimeout(() => showExtraLifeAd(true), 900);
    } else {
      // Lost a life mid-game → just invincibility, no popup interruption
      M.inv = 120;
      M.vy = J1 * 0.45;
    }
  }

  // ── Background ──
  function initBg() {
    stars=[];
    for(let i=0;i<120;i++) stars.push({x:Math.random()*W,y:Math.random()*(GY-80),r:Math.random()*1.5+.3,tw:Math.random()*Math.PI*2,sp:Math.random()*.3+.1});
    blds=[]; let bx=0;
    while(bx<W+400){
      const bw=Math.floor(Math.random()*80+40), bh=Math.floor(Math.random()*200+60);
      const wins=[];
      for(let wy=8;wy<bh-8;wy+=14) for(let wx=6;wx<bw-6;wx+=14)
        wins.push({ox:wx,oy:wy,on:Math.random()<.6,bl:Math.random()<.1,cl:Math.random()<.5?CYAN:YELLOW});
      blds.push({x:bx,w:bw,h:bh,cl:Math.random()<.5?CDIM:'#2a1060',wins});
      bx+=bw+Math.floor(Math.random()*8);
    }
  }
  initBg();

  // ── Spawners ──
  function spawnObs() {
    const roll=Math.random(), v=Math.floor(Math.random()*4);
    if(roll<.55){ const h=[64,80,100][Math.floor(Math.random()*3)]; obs.push({x:W+20,y:GY-h,w:56,h,v,fly:false}); }
    else if(roll<.80){ obs.push({x:W+20,y:GY-72,w:56,h:72,v:0,fly:false}); obs.push({x:W+130,y:GY-96,w:56,h:96,v:1,fly:false}); }
    else { obs.push({x:W+20,y:GY-64-90,w:56,h:64,v:2,fly:true}); }
  }

  function spawnGem() { coll.push({x:W+20,y:GY-120-Math.random()*80,r:14,a:0}); }

  function ovlp(a,b){ return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y; }
  function mRect(){
    if(M.duck&&M.onG) return{x:M.x+4,y:M.y+MH-DH+4,w:MW-8,h:DH-8};
    return{x:M.x+5,y:M.y+6,w:MW-10,h:MH-10};
  }

  // ── Update ──
  function update() {
    if(ST!=='running'||adShown) return;
    tick++; score++;
    if(score>best) best=score;
    speed=6+score/400;
    if(tick%10===0) updateHUD();

    M.trail.push({x:M.x+MW/2,y:M.y+MH/2,l:8});
    M.trail=M.trail.filter(t=>t.l-->0);

    if(!M.onG) M.vy+=GRAV;
    M.y+=M.vy;
    if(M.y<0){M.y=0;M.vy=0;}
    const gl=(M.duck&&M.onG)?GY-DH:GY-MH;
    if(M.y>=gl){M.y=gl;M.vy=0;M.onG=true;M.dbl=false;}
    else M.onG=false;

    M.at++; if(M.at>5){M.at=0;M.af=(M.af+1)%4;}
    if(M.inv>0) M.inv--;

    M.pts=M.pts.filter(p=>p.life-->0);
    M.pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.15;p.vx*=.96;});

    gx=(gx+speed)%48;
    stars.forEach(s=>{s.x-=s.sp;s.tw+=.05;if(s.x<0)s.x=W;});
    blds.forEach(b=>{ b.x-=speed*.18; if(b.x+b.w<0){b.x=W+Math.random()*50;b.h=Math.floor(Math.random()*200+60);} });

    obTick++; if(obTick>=obNext){ spawnObs(); obTick=0; obNext=Math.max(55,90-score/120+Math.random()*30); }
    obs.forEach(o=>o.x-=speed); obs=obs.filter(o=>o.x+o.w>-30);

    coTick++; if(coTick>100&&Math.random()<.015){coTick=0;spawnGem();}
    coll.forEach(c=>{c.x-=speed;c.a++;}); coll=coll.filter(c=>c.x>-30);

    if(M.inv<=0){
      const mr=mRect();
      for(const o of obs){
        const or={x:o.x+5,y:o.y+2,w:o.w-10,h:o.h-2};
        if(ovlp(mr,or)){die();return;}
      }
    }
    const mr=mRect();
    coll=coll.filter(c=>{
      const dx=mr.x+mr.w/2-c.x, dy=mr.y+mr.h/2-c.y;
      if(Math.sqrt(dx*dx+dy*dy)<c.r+18){gems++;score+=100;gemFx(c.x,c.y);sndGem();return false;}
      return true;
    });
  }

  // ── Draw ──
  function draw(){
    cx.fillStyle=BG; cx.fillRect(0,0,W,H);
    drawStars(); drawBuildings(); drawGround();
    if(ST==='running'||ST==='dead'){
      obs.forEach(drawPipe); coll.forEach(drawGem);
      drawTrail(); drawParticles(); drawMario();
    }
    if(ST==='idle') drawIdle();
    if(ST==='dead') drawDead();
    if(ST==='running'&&speed>9){
      cx.strokeStyle=`rgba(0,245,255,${Math.min(.25,(speed-9)*.025)})`; cx.lineWidth=1;
      for(let i=0;i<8;i++){const ly=40+i*28;cx.beginPath();cx.moveTo(0,ly);cx.lineTo(W*.5,ly);cx.stroke();}
    }
    const vg=cx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);
    vg.addColorStop(0,'transparent'); vg.addColorStop(1,'rgba(0,0,10,.5)');
    cx.fillStyle=vg; cx.fillRect(0,0,W,H);
  }

  function drawStars(){
    stars.forEach(s=>{cx.globalAlpha=.3+Math.sin(s.tw)*.35;cx.fillStyle=CYAN;cx.fillRect(s.x,s.y,s.r*2,s.r*2);});
    cx.globalAlpha=1;
  }
  function drawBuildings(){
    blds.forEach(b=>{
      cx.fillStyle=b.cl; cx.fillRect(b.x,GY-b.h,b.w,b.h);
      cx.strokeStyle='rgba(0,245,255,.12)';cx.lineWidth=1;cx.strokeRect(b.x,GY-b.h,b.w,b.h);
      b.wins.forEach(w=>{if(!w.on)return;const bl=w.bl?(Math.sin(tick*.06+b.x)>0?1:.2):1;cx.globalAlpha=bl*.75;cx.fillStyle=w.cl;cx.fillRect(b.x+w.ox,GY-b.h+w.oy,6,6);});
      cx.globalAlpha=1;
      cx.strokeStyle=PINK;cx.lineWidth=1;cx.globalAlpha=.4;
      cx.beginPath();cx.moveTo(b.x+b.w/2,GY-b.h);cx.lineTo(b.x+b.w/2,GY-b.h-14);cx.stroke();
      if(Math.floor(tick/18)%2===0){cx.fillStyle=PINK;cx.globalAlpha=.8;cx.beginPath();cx.arc(b.x+b.w/2,GY-b.h-14,2.5,0,Math.PI*2);cx.fill();}
      cx.globalAlpha=1;
    });
  }
  function drawGround(){
    const gg=cx.createLinearGradient(0,GY-2,0,GY+20);
    gg.addColorStop(0,CYAN);gg.addColorStop(.3,CDIM);gg.addColorStop(1,BG);
    cx.fillStyle=gg;cx.fillRect(0,GY-2,W,H-GY+2);
    cx.strokeStyle='rgba(0,245,255,.2)';cx.lineWidth=1;
    for(let x=gx;x<W+48;x+=48){cx.beginPath();cx.moveTo(x,GY);cx.lineTo(x,H);cx.stroke();}
    cx.shadowColor=CYAN;cx.shadowBlur=10;cx.strokeStyle=CYAN;cx.lineWidth=2;
    cx.beginPath();cx.moveTo(0,GY);cx.lineTo(W,GY);cx.stroke();cx.shadowBlur=0;
  }
  function drawPipe(o){
    const P=[{m:CYAN,d:CDIM,l:'#80faff',a:PINK},{m:PINK,d:PDIM,l:'#ff80b7',a:CYAN},{m:GREEN,d:'#0a3000',l:'#9fff80',a:YELLOW},{m:'#8338ec',d:'#2a1060',l:'#c080ff',a:CYAN}];
    const c=P[o.v%4]; cx.shadowColor=c.m;cx.shadowBlur=14;
    const bg=cx.createLinearGradient(o.x,0,o.x+o.w,0);
    bg.addColorStop(0,c.d);bg.addColorStop(.2,c.m);bg.addColorStop(.5,c.l);bg.addColorStop(.8,c.m);bg.addColorStop(1,c.d);
    cx.fillStyle=bg;cx.fillRect(o.x+6,o.y+18,o.w-12,o.h-18);
    const cg=cx.createLinearGradient(o.x,0,o.x+o.w,0);
    cg.addColorStop(0,c.d);cg.addColorStop(.3,c.m);cg.addColorStop(1,c.d);
    cx.fillStyle=cg;cx.fillRect(o.x,o.y,o.w,18);
    cx.fillStyle=c.l;cx.fillRect(o.x,o.y,o.w,3);
    cx.fillStyle='rgba(0,0,0,.28)';
    for(let sy=o.y+20;sy<o.y+o.h;sy+=6) cx.fillRect(o.x+6,sy,o.w-12,2);
    cx.fillStyle=c.a;cx.globalAlpha=.35;cx.fillRect(o.x+6,o.y+22,4,o.h-26);cx.globalAlpha=1;
    if(o.fly){cx.setLineDash([4,4]);cx.strokeStyle=c.m;cx.lineWidth=2;cx.beginPath();cx.moveTo(o.x+o.w/2,o.y+o.h);cx.lineTo(o.x+o.w/2,GY);cx.stroke();cx.setLineDash([]);}
    cx.shadowBlur=0;
  }
  function drawGem(g){
    const pulse=Math.sin(g.a*.12)*.3+.9; cx.save();
    cx.shadowColor=YELLOW;cx.shadowBlur=14;cx.strokeStyle=YELLOW;cx.lineWidth=2;
    cx.beginPath();cx.arc(g.x,g.y,g.r*pulse,0,Math.PI*2);cx.stroke();
    cx.fillStyle='rgba(255,190,11,.12)';cx.beginPath();cx.arc(g.x,g.y,g.r*pulse-2,0,Math.PI*2);cx.fill();
    cx.fillStyle=YELLOW;cx.font=`bold ${Math.floor(g.r*1.4)}px monospace`;cx.textAlign='center';cx.textBaseline='middle';
    cx.fillText('✦',g.x,g.y); cx.restore();
  }
  function drawTrail(){
    M.trail.forEach(t=>{cx.globalAlpha=(t.l/8)*.25;cx.fillStyle=CYAN;cx.shadowColor=CYAN;cx.shadowBlur=4;const s=(t.l/8)*10;cx.fillRect(t.x-s/2,t.y-s/2,s,s);});
    cx.globalAlpha=1;cx.shadowBlur=0;
  }
  function drawParticles(){
    M.pts.forEach(p=>{cx.globalAlpha=p.life/p.ml;cx.fillStyle=p.color;cx.shadowColor=p.color;cx.shadowBlur=6;cx.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz);});
    cx.globalAlpha=1;cx.shadowBlur=0;
  }

  // ── Mario ──
  function drawMario(){
    if(M.inv>0&&Math.floor(M.inv/5)%2===0) return;
    const x=Math.round(M.x), y=Math.round(M.y);
    cx.save();cx.shadowBlur=12;cx.shadowColor=CYAN;
    if(M.duck&&M.onG) mDuck(x,y+MH-DH); else mFull(x,y,M.af,M.onG);
    cx.restore();
  }
  function mFull(x,y,af,onG){
    cx.fillStyle=PINK;cx.shadowColor=PINK;cx.shadowBlur=8;cx.fillRect(x+4,y,22,8);cx.fillRect(x+2,y+6,26,5);
    cx.fillStyle=CYAN;cx.shadowColor=CYAN;cx.shadowBlur=6;cx.fillRect(x+2,y+10,26,2);
    cx.fillStyle='#c4a26a';cx.shadowBlur=0;cx.fillRect(x+4,y+11,22,13);
    cx.fillStyle=CYAN;cx.shadowColor=CYAN;cx.shadowBlur=6;cx.fillRect(x+4,y+11,22,2);
    cx.fillStyle=CYAN;cx.fillRect(x+7,y+13,5,4);cx.fillRect(x+18,y+13,4,4);
    cx.fillStyle='#000';cx.shadowBlur=0;cx.fillRect(x+9,y+14,2,2);cx.fillRect(x+19,y+14,2,2);
    cx.fillStyle='#a06030';cx.fillRect(x+6,y+20,18,3);
    cx.fillStyle='#1a1a2e';cx.fillRect(x+3,y+24,24,16);
    const cp=cx.createLinearGradient(x+3,0,x+27,0);
    cp.addColorStop(0,'#001020');cp.addColorStop(.5,CDIM);cp.addColorStop(1,'#001020');
    cx.fillStyle=cp;cx.fillRect(x+5,y+26,20,12);
    cx.fillStyle=CYAN;cx.shadowColor=CYAN;cx.shadowBlur=4;cx.fillRect(x+5,y+26,20,1);cx.fillRect(x+5,y+37,20,1);
    const gemC=Math.floor(tick/12)%2===0?CYAN:PINK;
    cx.fillStyle=gemC;cx.shadowColor=gemC;cx.shadowBlur=8;cx.fillRect(x+13,y+29,4,6);
    cx.fillStyle='#1a1a2e';cx.shadowBlur=0;cx.fillRect(x,y+24,4,12);cx.fillRect(x+26,y+24,4,12);
    cx.fillStyle=PINK;cx.shadowColor=PINK;cx.shadowBlur=6;cx.fillRect(x-1,y+34,5,6);cx.fillRect(x+26,y+34,5,6);
    cx.fillStyle='#0a0a20';cx.shadowBlur=0;
    if(onG){const lp=[[0,0],[1,3],[2,0],[0,-3]];const[la,lb]=lp[af%4];cx.fillRect(x+5,y+40+la,8,12);cx.fillRect(x+17,y+40+lb,8,12);}
    else{cx.fillRect(x+5,y+40,8,10);cx.fillRect(x+17,y+40,8,10);}
    cx.fillStyle=PINK;cx.shadowColor=PINK;cx.shadowBlur=6;
    if(!onG){cx.fillRect(x+3,y+49,12,5);cx.fillRect(x+16,y+49,12,5);}
    else{const f=af%4;if(f===1){cx.fillRect(x+2,y+50,13,5);cx.fillRect(x+15,y+49,12,5);}else if(f===3){cx.fillRect(x+3,y+50,12,5);cx.fillRect(x+16,y+49,12,5);}else{cx.fillRect(x+3,y+49,11,5);cx.fillRect(x+16,y+49,11,5);}}
    cx.fillStyle=CYAN;cx.shadowColor=CYAN;cx.shadowBlur=3;cx.fillRect(x+3,y+49,11,1);cx.fillRect(x+16,y+49,11,1);cx.shadowBlur=0;
  }
  function mDuck(x,y){
    cx.fillStyle=PINK;cx.fillRect(x+4,y,22,6);cx.fillRect(x+2,y+5,26,4);
    cx.fillStyle='#c4a26a';cx.fillRect(x+4,y+8,22,10);
    cx.fillStyle=CYAN;cx.shadowColor=CYAN;cx.shadowBlur=5;cx.fillRect(x+4,y+8,22,2);
    cx.fillStyle='#1a1a2e';cx.shadowBlur=0;cx.fillRect(x+2,y+18,26,10);
    cx.fillStyle=PINK;cx.shadowColor=PINK;cx.shadowBlur=6;cx.fillRect(x+2,y+26,26,4);cx.shadowBlur=0;
  }

  function drawIdle(){
    cx.fillStyle='rgba(0,0,10,.55)';cx.fillRect(0,0,W,H);
    mFull(90,GY-MH,0,true);
    cx.save();cx.textAlign='center';cx.textBaseline='middle';
    cx.font="bold 42px 'Orbitron',monospace";
    cx.fillStyle=CYAN;cx.shadowColor=CYAN;cx.shadowBlur=25;
    cx.fillText('CYBER MARIO RUNNER',W/2,H/2-60);
    cx.font="15px 'Orbitron',monospace";
    cx.fillStyle=PINK;cx.shadowColor=PINK;cx.shadowBlur=14;
    cx.fillText('NEON CITY OFFLINE RUNNER',W/2,H/2-24);
    if(Math.floor(tick/22)%2===0){
      cx.font="bold 17px 'Orbitron',monospace";
      cx.fillStyle=YELLOW;cx.shadowColor=YELLOW;cx.shadowBlur=14;
      cx.fillText('▶  CLICK  OR  PRESS  SPACE  TO  START  ◀',W/2,H/2+16);
    }
    cx.font="12px 'Share Tech Mono',monospace";
    cx.fillStyle='rgba(0,245,255,.7)';cx.shadowBlur=0;
    cx.fillText('JUMP OVER NEON PIPES  ·  COLLECT POWER GEMS  ·  DOUBLE JUMP ENABLED',W/2,H/2+56);
    cx.restore();
  }
  function drawDead(){
    cx.fillStyle='rgba(0,0,10,.7)';cx.fillRect(0,0,W,H);
    cx.save();cx.textAlign='center';cx.textBaseline='middle';
    cx.font="bold 48px 'Orbitron',monospace";
    cx.fillStyle=PINK;cx.shadowColor=PINK;cx.shadowBlur=30;
    cx.fillText('GAME OVER',W/2,H/2-56);
    cx.font="15px 'Share Tech Mono',monospace";
    cx.fillStyle=YELLOW;cx.shadowColor=YELLOW;cx.shadowBlur=12;
    cx.fillText(`SCORE: ${String(score).padStart(5,'0')}     BEST: ${String(best).padStart(5,'0')}`,W/2,H/2-4);
    cx.font="12px 'Share Tech Mono',monospace";
    cx.fillStyle=CYAN;cx.shadowColor=CYAN;cx.shadowBlur=8;
    cx.fillText(`GEMS COLLECTED: ${gems}`,W/2,H/2+24);
    if(Math.floor(tick/22)%2===0){
      cx.font="14px 'Orbitron',monospace";cx.fillStyle=CYAN;cx.shadowColor=CYAN;cx.shadowBlur=12;
      cx.fillText('CLICK OR PRESS SPACE TO RETRY',W/2,H/2+60);
    }
    cx.restore();
  }

  function loop(){ tick++; update(); draw(); requestAnimationFrame(loop); }
  loadHi();
  requestAnimationFrame(loop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
