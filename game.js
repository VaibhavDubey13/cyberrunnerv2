// ═══════════════════════════════════════════════════════════
//  ALIEN ESCAPE — Complete Game Engine
//  Human vs Aliens, 10 planet levels, no Nintendo IP
// ═══════════════════════════════════════════════════════════
(function() {
'use strict';

// ══════════════════════════════════
//  WEB AUDIO ENGINE
// ══════════════════════════════════
let AC=null, bgGain=null, sfxGain=null, bgStarted=false;

function getAC(){
  if(!AC){ try{ AC=new(window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if(AC&&AC.state==='suspended') AC.resume();
  return AC;
}

function startBgMusic(){
  if(bgStarted) return;
  const ac=getAC(); if(!ac) return;
  bgStarted=true;
  bgGain=ac.createGain(); bgGain.gain.value=0.15; bgGain.connect(ac.destination);
  sfxGain=ac.createGain(); sfxGain.gain.value=0.5; sfxGain.connect(ac.destination);
  window._bgGainNode=bgGain; window._sfxGainNode=sfxGain;

  function loop(){
    const ac2=getAC(); if(!ac2||!bgGain) return;
    // Driving bass pulse
    [55,55,82,110,55,55,73,82].forEach((f,i)=>{
      const o=ac2.createOscillator(),g=ac2.createGain();
      o.type='sawtooth'; o.frequency.value=f;
      g.gain.setValueAtTime(0,ac2.currentTime+i*.25);
      g.gain.linearRampToValueAtTime(.35,ac2.currentTime+i*.25+.02);
      g.gain.linearRampToValueAtTime(0,ac2.currentTime+i*.25+.23);
      o.connect(g);g.connect(bgGain);o.start(ac2.currentTime+i*.25);o.stop(ac2.currentTime+i*.25+.3);
    });
    // Alien melody arp
    [330,392,440,523,440,392,294,330,392,440,523,659].forEach((f,i)=>{
      if(Math.random()<.28) return;
      const o=ac2.createOscillator(),g=ac2.createGain();
      o.type='square'; o.frequency.value=f;
      g.gain.setValueAtTime(0,ac2.currentTime+i*.166);
      g.gain.linearRampToValueAtTime(.09,ac2.currentTime+i*.166+.01);
      g.gain.linearRampToValueAtTime(0,ac2.currentTime+i*.166+.15);
      o.connect(g);g.connect(bgGain);o.start(ac2.currentTime+i*.166);o.stop(ac2.currentTime+i*.166+.16);
    });
    // Pad
    [220,277,330].forEach(f=>{
      const o=ac2.createOscillator(),g=ac2.createGain();
      o.type='sine'; o.frequency.value=f;
      g.gain.setValueAtTime(.06,ac2.currentTime);
      g.gain.linearRampToValueAtTime(.04,ac2.currentTime+2);
      o.connect(g);g.connect(bgGain);o.start(ac2.currentTime);o.stop(ac2.currentTime+2);
    });
    setTimeout(loop,2000);
  }
  loop();
}

function sndJump(){
  const ac=getAC(); if(!ac||!sfxGain) return;
  const o=ac.createOscillator(),g=ac.createGain();
  o.type='square'; o.frequency.setValueAtTime(280,ac.currentTime);
  o.frequency.exponentialRampToValueAtTime(560,ac.currentTime+.1);
  g.gain.setValueAtTime(.35,ac.currentTime); g.gain.linearRampToValueAtTime(0,ac.currentTime+.14);
  o.connect(g);g.connect(sfxGain);o.start(ac.currentTime);o.stop(ac.currentTime+.15);
}
function sndDoubleJump(){
  const ac=getAC(); if(!ac||!sfxGain) return;
  [400,600,900].forEach((f,i)=>{
    const o=ac.createOscillator(),g=ac.createGain();
    o.type='sine'; o.frequency.value=f;
    g.gain.setValueAtTime(0,ac.currentTime+i*.05);
    g.gain.linearRampToValueAtTime(.3,ac.currentTime+i*.05+.02);
    g.gain.linearRampToValueAtTime(0,ac.currentTime+i*.05+.09);
    o.connect(g);g.connect(sfxGain);o.start(ac.currentTime+i*.05);o.stop(ac.currentTime+i*.05+.1);
  });
}
function sndGem(){
  const ac=getAC(); if(!ac||!sfxGain) return;
  [523,659,784,1047].forEach((f,i)=>{
    const o=ac.createOscillator(),g=ac.createGain();
    o.type='sine'; o.frequency.value=f;
    g.gain.setValueAtTime(0,ac.currentTime+i*.07);
    g.gain.linearRampToValueAtTime(.38,ac.currentTime+i*.07+.02);
    g.gain.linearRampToValueAtTime(0,ac.currentTime+i*.07+.12);
    o.connect(g);g.connect(sfxGain);o.start(ac.currentTime+i*.07);o.stop(ac.currentTime+i*.07+.13);
  });
}
function sndDie(){
  const ac=getAC(); if(!ac||!sfxGain) return;
  const o=ac.createOscillator(),g=ac.createGain();
  o.type='sawtooth'; o.frequency.setValueAtTime(440,ac.currentTime);
  o.frequency.exponentialRampToValueAtTime(55,ac.currentTime+.6);
  g.gain.setValueAtTime(.5,ac.currentTime); g.gain.linearRampToValueAtTime(0,ac.currentTime+.65);
  o.connect(g);g.connect(sfxGain);o.start(ac.currentTime);o.stop(ac.currentTime+.7);
  const buf=ac.createBuffer(1,ac.sampleRate*.3,ac.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length);
  const src=ac.createBufferSource(),ng=ac.createGain();
  src.buffer=buf; ng.gain.value=.25; src.connect(ng);ng.connect(sfxGain);src.start(ac.currentTime);
}
function sndExtraLife(){
  const ac=getAC(); if(!ac||!sfxGain) return;
  [523,659,784,1047,1319].forEach((f,i)=>{
    const o=ac.createOscillator(),g=ac.createGain();
    o.type='sine'; o.frequency.value=f;
    g.gain.setValueAtTime(0,ac.currentTime+i*.1);
    g.gain.linearRampToValueAtTime(.4,ac.currentTime+i*.1+.03);
    g.gain.linearRampToValueAtTime(0,ac.currentTime+i*.1+.15);
    o.connect(g);g.connect(sfxGain);o.start(ac.currentTime+i*.1);o.stop(ac.currentTime+i*.1+.16);
  });
}
function sndLevelUp(){
  const ac=getAC(); if(!ac||!sfxGain) return;
  [262,330,392,523,659,784,1047].forEach((f,i)=>{
    const o=ac.createOscillator(),g=ac.createGain();
    o.type='square'; o.frequency.value=f;
    g.gain.setValueAtTime(0,ac.currentTime+i*.08);
    g.gain.linearRampToValueAtTime(.3,ac.currentTime+i*.08+.02);
    g.gain.linearRampToValueAtTime(0,ac.currentTime+i*.08+.12);
    o.connect(g);g.connect(sfxGain);o.start(ac.currentTime+i*.08);o.stop(ac.currentTime+i*.08+.13);
  });
}

// ══════════════════════════════════
//  LEVEL DEFINITIONS
//  10 unique planet themes
// ══════════════════════════════════
const LEVELS = [
  // score threshold, name, colors
  { threshold:0,     name:'MARS WASTELAND',   sky:['#1a0500','#3d0a00','#6b1500'],   ground:'#8b3a1a', groundTop:'#c4501f', accent:'#ff6b35', starColor:'#ff9966', fogColor:'rgba(139,58,26,0.3)',  dustColor:'rgba(255,107,53,0.15)' },
  { threshold:2000,  name:'ICE PLANET CRYON', sky:['#001428','#002850','#004080'],   ground:'#003366', groundTop:'#00aaff', accent:'#00eeff', starColor:'#aaddff', fogColor:'rgba(0,100,180,0.25)', dustColor:'rgba(0,220,255,0.1)'  },
  { threshold:5000,  name:'LAVA WORLD INFEX', sky:['#1a0000','#3d0000','#6b0000'],   ground:'#1a0000', groundTop:'#ff4400', accent:'#ff8800', starColor:'#ff6600', fogColor:'rgba(200,50,0,0.35)',   dustColor:'rgba(255,100,0,0.2)'  },
  { threshold:10000, name:'NEON CYBER NEXUS', sky:['#020010','#050025','#080040'],   ground:'#001020', groundTop:'#00f5ff', accent:'#ff006e', starColor:'#8338ec', fogColor:'rgba(0,245,255,0.08)', dustColor:'rgba(131,56,236,0.1)' },
  { threshold:20000, name:'JUNGLE MOON VEXA', sky:['#001a00','#003300','#005500'],   ground:'#001a00', groundTop:'#00ff66', accent:'#aaff00', starColor:'#66ff99', fogColor:'rgba(0,150,50,0.3)',   dustColor:'rgba(0,255,100,0.1)'  },
  { threshold:35000, name:'STORM PLANET ZRIX',sky:['#0a0a1a','#141428','#1e1e3c'],   ground:'#0a0a20', groundTop:'#7700ff', accent:'#aa44ff', starColor:'#cc88ff', fogColor:'rgba(80,0,180,0.3)',   dustColor:'rgba(150,50,255,0.12)' },
  { threshold:55000, name:'DESERT TWIN SUNS', sky:['#2a1500','#4a2000','#6a3000'],   ground:'#3d1a00', groundTop:'#ffaa00', accent:'#ffdd00', starColor:'#ffcc44', fogColor:'rgba(180,100,0,0.3)',  dustColor:'rgba(255,200,0,0.12)' },
  { threshold:80000, name:'OCEAN PLANET THAL',sky:['#000d1a','#001a33','#002a50'],   ground:'#001020', groundTop:'#0088cc', accent:'#00ffcc', starColor:'#44ccff', fogColor:'rgba(0,80,150,0.3)',   dustColor:'rgba(0,200,200,0.1)'  },
  { threshold:110000,name:'CRYSTAL WORLD XAL',sky:['#0a0015','#150025','#1e0035'],   ground:'#0a0020', groundTop:'#ff00ff', accent:'#ff88ff', starColor:'#ff44ff', fogColor:'rgba(200,0,200,0.25)', dustColor:'rgba(255,0,255,0.1)'  },
  { threshold:150000,name:'VOID REALM OMEGA', sky:['#000000','#050005','#0a000a'],   ground:'#050005', groundTop:'#ffffff', accent:'#cccccc', starColor:'#ffffff', fogColor:'rgba(255,255,255,0.05)',dustColor:'rgba(200,200,255,0.08)'},
];

// Level score boundaries (for display)
const LEVEL_BOUNDS = [0,2000,5000,10000,20000,35000,55000,80000,110000,150000];

function getLevelIdx(score){
  let idx=0;
  for(let i=LEVELS.length-1;i>=0;i--){ if(score>=LEVELS[i].threshold){idx=i;break;} }
  return idx;
}

// ══════════════════════════════════
//  ALIEN DEFINITIONS
//  Each level has a matching alien set
// ══════════════════════════════════
// alienType: 'squat'|'tall'|'wide'|'crawler'|'titan'|'floater'|'multi'|'blob'
// Each level array has 3-5 alien variants
const ALIEN_SETS = [
  // Level 0: Mars - red dusty aliens
  [
    { type:'squat',  w:52, h:62, color:'#cc3300', accent:'#ff6600', arms:4, eyes:3 },
    { type:'tall',   w:38, h:90, color:'#aa2200', accent:'#ff4400', arms:2, eyes:2 },
    { type:'wide',   w:80, h:48, color:'#dd4400', accent:'#ff8833', arms:6, eyes:4 },
  ],
  // Level 1: Ice - crystalline blue aliens
  [
    { type:'squat',   w:48, h:58, color:'#0044aa', accent:'#00ccff', arms:4, eyes:2 },
    { type:'tall',    w:34, h:96, color:'#002288', accent:'#0088ff', arms:2, eyes:3 },
    { type:'floater', w:70, h:44, color:'#0066cc', accent:'#00eeff', arms:8, eyes:4 },
  ],
  // Level 2: Lava - fire demons
  [
    { type:'wide',    w:76, h:50, color:'#880000', accent:'#ff2200', arms:4, eyes:2 },
    { type:'titan',   w:60, h:110,color:'#660000', accent:'#ff4400', arms:2, eyes:1 },
    { type:'crawler', w:90, h:38, color:'#aa1100', accent:'#ff6600', arms:6, eyes:5 },
  ],
  // Level 3: Cyber - neon robots
  [
    { type:'squat',   w:50, h:64, color:'#003344', accent:'#00f5ff', arms:2, eyes:2 },
    { type:'tall',    w:36, h:100,color:'#200030', accent:'#ff006e', arms:4, eyes:1 },
    { type:'multi',   w:66, h:56, color:'#002030', accent:'#8338ec', arms:6, eyes:6 },
  ],
  // Level 4: Jungle - plant creatures
  [
    { type:'blob',    w:58, h:58, color:'#004400', accent:'#00ff66', arms:4, eyes:3 },
    { type:'tall',    w:30, h:104,color:'#003300', accent:'#aaff00', arms:6, eyes:2 },
    { type:'wide',    w:88, h:42, color:'#005500', accent:'#66ff00', arms:8, eyes:4 },
  ],
  // Level 5: Storm - electric eels
  [
    { type:'crawler', w:84, h:36, color:'#110022', accent:'#aa44ff', arms:6, eyes:4 },
    { type:'tall',    w:32, h:108,color:'#220044', accent:'#7700ff', arms:2, eyes:3 },
    { type:'floater', w:72, h:50, color:'#330066', accent:'#cc88ff', arms:8, eyes:2 },
  ],
  // Level 6: Desert - sand scorpions
  [
    { type:'wide',    w:82, h:44, color:'#5a3000', accent:'#ffaa00', arms:6, eyes:4 },
    { type:'squat',   w:54, h:60, color:'#4a2200', accent:'#ffdd00', arms:4, eyes:2 },
    { type:'crawler', w:94, h:34, color:'#6a3800', accent:'#ff8800', arms:8, eyes:6 },
  ],
  // Level 7: Ocean - deep sea horrors
  [
    { type:'blob',    w:62, h:62, color:'#003344', accent:'#00ffcc', arms:8, eyes:3 },
    { type:'tall',    w:36, h:98, color:'#002233', accent:'#0088cc', arms:4, eyes:2 },
    { type:'floater', w:78, h:52, color:'#001a2a', accent:'#44ccff', arms:10,eyes:5 },
  ],
  // Level 8: Crystal - geometric horrors
  [
    { type:'multi',   w:64, h:64, color:'#1a0028', accent:'#ff00ff', arms:4, eyes:4 },
    { type:'squat',   w:50, h:60, color:'#120020', accent:'#ff88ff', arms:6, eyes:6 },
    { type:'titan',   w:56, h:120,color:'#0f001a', accent:'#cc00cc', arms:2, eyes:2 },
  ],
  // Level 9: Void - cosmic entities
  [
    { type:'floater', w:80, h:80, color:'#050005', accent:'#ffffff', arms:12,eyes:7 },
    { type:'titan',   w:60, h:130,color:'#030003', accent:'#cccccc', arms:4, eyes:3 },
    { type:'multi',   w:70, h:70, color:'#070007', accent:'#aaaaff', arms:8, eyes:9 },
  ],
];

// ══════════════════════════════════
//  GAME ENGINE
// ══════════════════════════════════
function init(){
  const cv=document.getElementById('c');
  if(!cv){console.error('Canvas not found');return;}
  const cx=cv.getContext('2d');
  const W=1400, H=420, GY=H-60;
  const GRAV=0.72, J1=-17, J2=-14;
  const HW=28, HH=52, DH=28; // human width/height/duckHeight

  let ST='idle';
  let score=0,best=0,crystals=0,lives=3,speed=6,tick=0,gx=0;
  let levelIdx=0, levelFlash=0, prevLevelIdx=0;
  let extraLifeUsed=0;
  const MAX_EXTRA=2;
  let adShown=false;

  // Human runner
  const H_={x:100,y:GY-HH,vy:0,onG:true,dbl:false,duck:false,inv:0,af:0,at:0,pts:[],trail:[]};

  let aliens=[],crystalPkgs=[],obTick=0,obNext=90,crTick=0;
  let bgParticles=[], bgLayers=[], groundCracks=[];

  // DOM
  const elScore=document.getElementById('sScore');
  const elBest= document.getElementById('sBest');
  const elCrys= document.getElementById('sGems');
  const elLives=document.getElementById('sLives');
  const elLevel=document.getElementById('sLevel');

  function loadHi(){ try{best=parseInt(localStorage.getItem('ae_hi')||'0')||0;}catch(e){best=0;} updateHUD(); }
  function saveHi(){ try{localStorage.setItem('ae_hi',best);}catch(e){} }
  function updateHUD(){
    if(elScore) elScore.textContent=String(score).padStart(6,'0');
    if(elBest)  elBest.textContent=String(best).padStart(6,'0');
    if(elCrys)  elCrys.textContent=String(crystals).padStart(2,'0');
    if(elLives) elLives.textContent='❤️'.repeat(Math.max(0,lives));
    if(elLevel) elLevel.textContent=`LVL ${levelIdx+1}`;
  }

  // ── Extra Life Ad ──
  function showExtraLifeAd(isGameOver){
    adShown=true;
    const ov=document.getElementById('adOverlay');
    const titleEl=document.getElementById('adTitle');
    const bodyEl=document.getElementById('adBody');
    const skipBtn=document.getElementById('adSkipBtn');
    const cntEl=document.getElementById('adCountdown');
    const extraBtn=document.getElementById('extraLifeBtn');
    const box=document.getElementById('extraLifeBox');
    const cl=document.getElementById('continuesLeft');
    if(!ov)return;
    if(titleEl) titleEl.textContent=isGameOver?'MISSION FAILED':'ELIMINATED!';
    if(bodyEl)  bodyEl.textContent=isGameOver
      ?(extraLifeUsed<MAX_EXTRA?'Watch a short ad to continue your escape!':'No more continues available — start a new run!')
      :'Watch a quick ad to keep running!';
    const canC=extraLifeUsed<MAX_EXTRA;
    if(box)     box.style.display=canC?'block':'none';
    if(extraBtn)extraBtn.style.display=canC?'block':'none';
    if(cl)      cl.textContent=Math.max(0,MAX_EXTRA-extraLifeUsed);
    ov.classList.add('visible');
    let secs=5;
    if(skipBtn){skipBtn.disabled=true;skipBtn.textContent=`SKIP IN ${secs}s`;}
    if(cntEl)  cntEl.textContent=secs;
    const iv=setInterval(()=>{
      secs--;
      if(skipBtn) skipBtn.textContent=secs>0?`SKIP IN ${secs}s`:'SKIP ✕';
      if(cntEl)   cntEl.textContent=secs;
      if(secs<=0){clearInterval(iv);if(skipBtn)skipBtn.disabled=false;}
    },1000);
    window._adIsGameOver=isGameOver;
  }

  window.adWatchAndContinue=function(){
    extraLifeUsed++;
    window._extraLifeUsed=extraLifeUsed;
    const ov=document.getElementById('adOverlay');
    if(ov)ov.classList.remove('visible');
    adShown=false;
    lives=Math.min(lives+1,3);
    H_.inv=150; H_.vy=J1*.4;
    if(ST==='dead')ST='running';
    sndExtraLife(); updateHUD();
    window.open('https://www.effectivegatecpm.com/rx743m2jk?key=8b4bc3b6c51f69ca62183cec03cd5133','_blank');
    const cl=document.getElementById('continuesLeft');
    if(cl) cl.textContent=Math.max(0,MAX_EXTRA-extraLifeUsed);
  };
  window.adSkipAndContinue=function(){
    const ov=document.getElementById('adOverlay');
    if(ov)ov.classList.remove('visible');
    adShown=false;
    const btn=document.getElementById('adSkipBtn');
    if(btn){btn.disabled=true;btn.textContent='SKIP IN 5s';}
  };

  // ── Input ──
  const held=new Set();
  window.addEventListener('keydown',e=>{
    if(adShown)return;
    if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();if(!held.has(e.code)){held.add(e.code);pressJump();}}
    if(e.code==='ArrowDown'){e.preventDefault();held.add(e.code);if(ST==='running')H_.duck=true;}
  },{capture:true});
  window.addEventListener('keyup',e=>{held.delete(e.code);if(e.code==='ArrowDown')H_.duck=false;});
  cv.addEventListener('click',e=>{e.stopPropagation();if(!adShown){startBgMusic();pressJump();}});
  document.addEventListener('click',e=>{startBgMusic();if(adShown)return;const t=e.target.tagName.toLowerCase();if(t==='a'||t==='button'||t==='input')return;pressJump();});

  function pressJump(){
    if(ST==='idle'||ST==='dead'){startGame();return;}
    if(ST!=='running')return;
    if(H_.onG){H_.vy=J1;H_.onG=false;H_.dbl=false;sndJump();}
    else if(!H_.dbl){H_.vy=J2;H_.dbl=true;sndDoubleJump();}
  }

  // ── Particles ──
  function pt(x,y,vx,vy,life,color,sz){H_.pts.push({x,y,vx,vy,life,ml:life,color,sz});}
  function jumpFx(){
    const L=LEVELS[levelIdx];
    for(let i=0;i<10;i++) pt(H_.x+HW/2,H_.y+HH,(Math.random()-.5)*5,Math.random()*-4-1,25,[L.accent,L.groundTop,'#ffffff'][i%3],Math.random()*4+2);
  }
  function jumpFx2(){
    const L=LEVELS[levelIdx];
    for(let i=0;i<16;i++) pt(H_.x+HW/2,H_.y+HH/2,(Math.random()-.5)*4-1,(Math.random()-.5)*4,20,L.accent,Math.random()*5+2);
  }
  function hitFx(x,y){for(let i=0;i<18;i++){const a=i/18*Math.PI*2;pt(x,y,Math.cos(a)*(Math.random()*5+2),Math.sin(a)*(Math.random()*5+2),30,'#ff4444',Math.random()*6+2);}}
  function crystalFx(x,y){const L=LEVELS[levelIdx];for(let i=0;i<10;i++) pt(x,y,(Math.random()-.5)*6,Math.random()*-5-2,25,L.accent,Math.random()*4+2);}

  // ── Game flow ──
  function startGame(){
    ST='running';score=0;crystals=0;lives=3;speed=6;tick=0;gx=0;
    extraLifeUsed=0;levelIdx=0;prevLevelIdx=0;levelFlash=0;
    aliens=[];crystalPkgs=[];obTick=0;obNext=90;crTick=0;
    H_.y=GY-HH;H_.vy=0;H_.onG=true;H_.duck=false;H_.dbl=false;H_.inv=0;H_.pts=[];H_.trail=[];
    initBg(0);updateHUD();startBgMusic();
  }

  function die(){
    hitFx(H_.x+HW/2,H_.y+HH/2); sndDie(); lives--; updateHUD();
    if(lives<=0){
      ST='dead';if(score>best){best=score;}saveHi();updateHUD();
      setTimeout(()=>showExtraLifeAd(true),900);
    } else {
      H_.inv=120;H_.vy=J1*.45;
    }
  }

  // ── Background setup per level ──
  function initBg(idx){
    bgParticles=[];
    for(let i=0;i<80;i++) bgParticles.push({x:Math.random()*W,y:Math.random()*(GY-80),size:Math.random()*2+.5,speed:Math.random()*.4+.1,tw:Math.random()*Math.PI*2});
    initLandscape(idx);
  }

  function initLandscape(idx){
    bgLayers=[];
    groundCracks=[];
    // Generate background terrain features based on level
    for(let i=0;i<30;i++) groundCracks.push({x:Math.random()*W*2,w:Math.random()*30+10,depth:Math.random()*8+4});
    // Rock/terrain formations
    for(let i=0;i<12;i++){
      const x=Math.random()*W*2;
      const h=Math.random()*80+20;
      bgLayers.push({x,h,w:Math.random()*40+20,type:idx%3});
    }
  }

  // ── Alien spawner ──
  function spawnAlien(){
    const set=ALIEN_SETS[levelIdx];
    const template=set[Math.floor(Math.random()*set.length)];
    const variant=Math.floor(Math.random()*3); // visual variation
    const roll=Math.random();
    if(roll<.55){
      // Single alien
      aliens.push(makeAlien(W+20,GY-template.h,template,variant));
    } else if(roll<.78){
      // Two aliens spaced
      aliens.push(makeAlien(W+20,GY-template.h,template,variant));
      const t2=set[Math.floor(Math.random()*set.length)];
      aliens.push(makeAlien(W+130,GY-t2.h,t2,Math.floor(Math.random()*3)));
    } else {
      // Tall/floating alien above ground
      const floatH=template.h;
      aliens.push(makeAlien(W+20,GY-floatH-55,template,variant,true));
    }
  }

  function makeAlien(x,y,template,variant,floating){
    return{
      x,y,
      w:template.w, h:template.h,
      type:template.type,
      color:template.color, accent:template.accent,
      arms:template.arms, eyes:template.eyes,
      variant, floating:!!floating,
      animPhase:Math.random()*Math.PI*2,
      bobAmt:floating?8:0,
    };
  }

  function spawnCrystal(){
    const L=LEVELS[levelIdx];
    crystalPkgs.push({x:W+20,y:GY-110-Math.random()*70,r:12,anim:0,color:L.accent});
  }

  // ── Collision ──
  function ovlp(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
  function hRect(){
    if(H_.duck&&H_.onG)return{x:H_.x+4,y:H_.y+HH-DH+4,w:HW-8,h:DH-8};
    return{x:H_.x+5,y:H_.y+6,w:HW-10,h:HH-10};
  }

  // ── Update ──
  function update(){
    if(ST!=='running'||adShown)return;
    tick++;score++;
    if(score>best)best=score;

    // Level check
    const newIdx=getLevelIdx(score);
    if(newIdx!==levelIdx){
      levelIdx=newIdx;levelFlash=120;
      initBg(levelIdx);sndLevelUp();
      // Recalculate speed for new level
    }
    if(levelFlash>0)levelFlash--;

    // Speed: base 6 + level bonus + gradual increase within level
    const levelBonus=levelIdx*0.8;
    speed=6+levelBonus+score/600;

    if(tick%10===0)updateHUD();

    // Human trail
    H_.trail.push({x:H_.x+HW/2,y:H_.y+HH/2,l:8});
    H_.trail=H_.trail.filter(t=>t.l-->0);

    // Physics
    if(!H_.onG)H_.vy+=GRAV;
    H_.y+=H_.vy;
    if(H_.y<0){H_.y=0;H_.vy=0;}
    const gl=(H_.duck&&H_.onG)?GY-DH:GY-HH;
    if(H_.y>=gl){H_.y=gl;H_.vy=0;H_.onG=true;H_.dbl=false;}
    else H_.onG=false;

    H_.at++;if(H_.at>5){H_.at=0;H_.af=(H_.af+1)%4;}
    if(H_.inv>0)H_.inv--;

    // Particles
    H_.pts=H_.pts.filter(p=>p.life-->0);
    H_.pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.15;p.vx*=.96;});

    // Ground scroll
    gx=(gx+speed)%60;

    // Bg parallax
    bgParticles.forEach(s=>{s.x-=s.speed;s.tw+=.04;if(s.x<0)s.x=W;});
    bgLayers.forEach(b=>{b.x-=speed*.15;if(b.x+b.w<-50){b.x=W+Math.random()*100;b.h=Math.random()*80+20;}});
    groundCracks.forEach(c=>c.x-=speed);

    // Alien spawning
    obTick++;
    if(obTick>=obNext){
      spawnAlien();obTick=0;
      obNext=Math.max(50,90-score/150+Math.random()*28);
    }
    aliens.forEach(a=>{
      a.x-=speed;
      a.animPhase+=0.08;
      if(a.floating) a.y=GY-a.h-55+Math.sin(a.animPhase)*a.bobAmt;
    });
    aliens=aliens.filter(a=>a.x+a.w>-30);

    // Crystal spawning
    crTick++;
    if(crTick>100&&Math.random()<.016){crTick=0;spawnCrystal();}
    crystalPkgs.forEach(c=>{c.x-=speed;c.anim++;});
    crystalPkgs=crystalPkgs.filter(c=>c.x>-30);

    // Collision - aliens
    if(H_.inv<=0){
      const mr=hRect();
      for(const a of aliens){
        const ar={x:a.x+6,y:a.y+4,w:a.w-12,h:a.h-8};
        if(ovlp(mr,ar)){die();return;}
      }
    }

    // Collision - crystals
    const mr=hRect();
    crystalPkgs=crystalPkgs.filter(c=>{
      const dx=mr.x+mr.w/2-c.x,dy=mr.y+mr.h/2-c.y;
      if(Math.sqrt(dx*dx+dy*dy)<c.r+18){crystals++;score+=150;crystalFx(c.x,c.y);sndGem();return false;}
      return true;
    });
  }

  // ══════════════════════════════════
  //  DRAW ENGINE
  // ══════════════════════════════════
  function draw(){
    const L=LEVELS[levelIdx];
    // Sky gradient
    const sky=cx.createLinearGradient(0,0,0,GY);
    L.sky.forEach((c,i)=>sky.addColorStop(i/(L.sky.length-1),c));
    cx.fillStyle=sky;cx.fillRect(0,0,W,H);

    drawStars(L);
    drawAtmosphere(L);
    drawTerrain(L);
    drawGround(L);

    if(ST==='running'||ST==='dead'){
      crystalPkgs.forEach(c=>drawCrystal(c));
      aliens.forEach(a=>drawAlien(a,L));
      drawTrail(L);
      drawParticles();
      drawHuman();
    }

    if(ST==='idle') drawIdle(L);
    if(ST==='dead') drawDead(L);

    // Level transition flash
    if(levelFlash>0&&levelFlash<100){
      const alpha=(levelFlash>50)?(1-(levelFlash-50)/50)*0.6:levelFlash/50*0.6;
      cx.fillStyle=`rgba(255,255,255,${alpha})`;cx.fillRect(0,0,W,H);
      if(levelFlash>40&&levelFlash<80){
        cx.save();cx.textAlign='center';cx.textBaseline='middle';
        cx.font="bold 36px 'Orbitron',monospace";
        cx.fillStyle=L.accent;cx.shadowColor=L.accent;cx.shadowBlur=25;
        cx.fillText(`⚡ LEVEL ${levelIdx+1}: ${L.name} ⚡`,W/2,H/2);
        cx.restore();
      }
    }

    // Speed lines at high speed
    if(ST==='running'&&speed>10){
      cx.strokeStyle=`rgba(255,255,255,${Math.min(.15,(speed-10)*.015)})`;cx.lineWidth=1;
      for(let i=0;i<6;i++){const ly=40+i*36;cx.beginPath();cx.moveTo(0,ly);cx.lineTo(W*.45,ly);cx.stroke();}
    }

    // Vignette
    const vg=cx.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.85);
    vg.addColorStop(0,'transparent');vg.addColorStop(1,'rgba(0,0,0,.5)');
    cx.fillStyle=vg;cx.fillRect(0,0,W,H);
  }

  function drawStars(L){
    bgParticles.forEach(s=>{
      cx.globalAlpha=.25+Math.sin(s.tw)*.3;
      cx.fillStyle=L.starColor;
      cx.beginPath();cx.arc(s.x,s.y,s.size,0,Math.PI*2);cx.fill();
    });
    cx.globalAlpha=1;
  }

  function drawAtmosphere(L){
    // Distant terrain / horizon glow
    bgLayers.forEach(b=>{
      cx.globalAlpha=0.35;
      cx.fillStyle=L.groundTop;
      if(b.type===0){
        // Mesa / butte
        cx.beginPath();cx.moveTo(b.x,GY-b.h);cx.lineTo(b.x-8,GY-b.h+8);cx.lineTo(b.x-4,GY);cx.lineTo(b.x+b.w+4,GY);cx.lineTo(b.x+b.w+8,GY-b.h+8);cx.lineTo(b.x+b.w,GY-b.h);cx.closePath();cx.fill();
      } else if(b.type===1){
        // Crystal spire
        cx.beginPath();cx.moveTo(b.x+b.w/2,GY-b.h);cx.lineTo(b.x,GY);cx.lineTo(b.x+b.w,GY);cx.closePath();cx.fill();
      } else {
        // Dome
        cx.beginPath();cx.ellipse(b.x+b.w/2,GY,b.w/2,b.h*.7,0,Math.PI,0);cx.fill();
      }
    });
    cx.globalAlpha=1;

    // Ground fog
    const fog=cx.createLinearGradient(0,GY-30,0,GY);
    fog.addColorStop(0,'transparent');fog.addColorStop(1,L.fogColor);
    cx.fillStyle=fog;cx.fillRect(0,GY-30,W,30);
  }

  function drawGround(L){
    // Main ground fill
    const gg=cx.createLinearGradient(0,GY-3,0,H);
    gg.addColorStop(0,L.groundTop);gg.addColorStop(.04,L.ground);gg.addColorStop(1,'#000000');
    cx.fillStyle=gg;cx.fillRect(0,GY-2,W,H-GY+2);

    // Ground texture - cracks / tiles
    cx.strokeStyle=L.dustColor;cx.lineWidth=1;
    for(let x=gx%60-60;x<W+60;x+=60){
      cx.beginPath();cx.moveTo(x,GY);cx.lineTo(x,H);cx.stroke();
    }

    // Surface cracks (level-specific feel)
    groundCracks.forEach(c=>{
      if(c.x>-30&&c.x<W+30){
        cx.strokeStyle=`rgba(0,0,0,.4)`;cx.lineWidth=1;
        cx.beginPath();cx.moveTo(c.x,GY);cx.lineTo(c.x+c.w*.4,GY+c.depth);cx.lineTo(c.x+c.w,GY);cx.stroke();
      }
    });

    // Glow line on surface
    cx.shadowColor=L.groundTop;cx.shadowBlur=12;
    cx.strokeStyle=L.groundTop;cx.lineWidth=3;
    cx.beginPath();cx.moveTo(0,GY);cx.lineTo(W,GY);cx.stroke();
    cx.shadowBlur=0;
  }

  function drawTerrain(L){
    // Atmospheric dust particles drifting
    if(Math.random()<.3){
      bgParticles.slice(0,5).forEach(p=>{
        cx.globalAlpha=.06;cx.fillStyle=L.accent;
        cx.beginPath();cx.arc(p.x,GY-20-Math.random()*40,2,0,Math.PI*2);cx.fill();
      });
      cx.globalAlpha=1;
    }
  }

  // ══════════════════════════════════
  //  ALIEN DRAWING
  // ══════════════════════════════════
  function drawAlien(a,L){
    cx.save();
    const pulse=Math.sin(a.animPhase)*.08+1;
    const x=a.x,y=a.y,w=a.w,h=a.h;
    const col=a.color,acc=a.accent;

    cx.shadowColor=acc;cx.shadowBlur=16;

    // Glow halo under alien
    const halo=cx.createRadialGradient(x+w/2,y+h,0,x+w/2,y+h,w*.7);
    halo.addColorStop(0,acc+'44');halo.addColorStop(1,'transparent');
    cx.fillStyle=halo;cx.beginPath();cx.ellipse(x+w/2,y+h,w*.7,18,0,0,Math.PI*2);cx.fill();

    if(a.type==='squat'){ drawAlienSquat(cx,x,y,w,h,col,acc,a.arms,a.eyes,a.animPhase,pulse); }
    else if(a.type==='tall'){ drawAlienTall(cx,x,y,w,h,col,acc,a.arms,a.eyes,a.animPhase,pulse); }
    else if(a.type==='wide'){ drawAlienWide(cx,x,y,w,h,col,acc,a.arms,a.eyes,a.animPhase,pulse); }
    else if(a.type==='crawler'){ drawAlienCrawler(cx,x,y,w,h,col,acc,a.arms,a.eyes,a.animPhase,pulse); }
    else if(a.type==='titan'){ drawAlienTitan(cx,x,y,w,h,col,acc,a.arms,a.eyes,a.animPhase,pulse); }
    else if(a.type==='floater'){ drawAlienFloater(cx,x,y,w,h,col,acc,a.arms,a.eyes,a.animPhase,pulse); }
    else if(a.type==='multi'){ drawAlienMulti(cx,x,y,w,h,col,acc,a.arms,a.eyes,a.animPhase,pulse); }
    else if(a.type==='blob'){ drawAlienBlob(cx,x,y,w,h,col,acc,a.arms,a.eyes,a.animPhase,pulse); }

    cx.restore();
  }

  // SQUAT — wide, low, aggressive stance, many side arms
  function drawAlienSquat(cx,x,y,w,h,col,acc,arms,eyes,phase,pulse){
    // Body — wide oval
    cx.fillStyle=col;
    cx.beginPath();cx.ellipse(x+w/2,y+h*.55,w*.48*pulse,h*.4,0,0,Math.PI*2);cx.fill();
    // Outer shell ridges
    cx.strokeStyle=acc;cx.lineWidth=2;
    for(let i=0;i<3;i++){
      cx.beginPath();cx.ellipse(x+w/2,y+h*.55,w*(.28+i*.08)*pulse,h*(.2+i*.06),0,0,Math.PI*2);cx.stroke();
    }
    // Arms (spread out sideways)
    for(let i=0;i<arms;i++){
      const side=i%2===0?-1:1, ai=Math.floor(i/2);
      const armX=x+w/2+side*(w*.4+ai*12);
      const armY=y+h*.5+ai*8+Math.sin(phase+i)*6;
      cx.strokeStyle=acc;cx.lineWidth=3;
      cx.beginPath();cx.moveTo(x+w/2+side*w*.3,y+h*.5);
      cx.quadraticCurveTo(armX-side*10,armY-12,armX,armY);cx.stroke();
      cx.fillStyle=acc;cx.beginPath();cx.arc(armX,armY,5,0,Math.PI*2);cx.fill();
    }
    // Eyes in a row
    const eyeSpacing=w*.5/(eyes+1);
    for(let i=0;i<eyes;i++){
      const ex=x+w*.25+(i+1)*eyeSpacing, ey=y+h*.35;
      cx.fillStyle='#000';cx.beginPath();cx.arc(ex,ey,5,0,Math.PI*2);cx.fill();
      cx.fillStyle=acc;cx.beginPath();cx.arc(ex,ey,3,0,Math.PI*2);cx.fill();
      cx.fillStyle='#fff';cx.beginPath();cx.arc(ex-1,ey-1,1.5,0,Math.PI*2);cx.fill();
    }
    // Maw
    cx.fillStyle='#000';
    cx.beginPath();cx.ellipse(x+w/2,y+h*.7,w*.2,h*.08,0,0,Math.PI*2);cx.fill();
    cx.fillStyle=acc;cx.lineWidth=1;
    for(let i=0;i<4;i++){cx.beginPath();cx.moveTo(x+w*.35+i*w*.1,y+h*.7);cx.lineTo(x+w*.38+i*w*.1,y+h*.74);cx.stroke();}
  }

  // TALL — thin, towering, tentacle arms
  function drawAlienTall(cx,x,y,w,h,col,acc,arms,eyes,phase,pulse){
    // Neck/stalk
    cx.fillStyle=col;
    cx.beginPath();cx.roundRect(x+w*.35,y+h*.2,w*.3,h*.7,4);cx.fill();
    // Body segments
    cx.strokeStyle=acc;cx.lineWidth=1.5;
    for(let i=0;i<5;i++){
      cx.beginPath();cx.moveTo(x+w*.35,y+h*(.25+i*.13));cx.lineTo(x+w*.65,y+h*(.25+i*.13));cx.stroke();
    }
    // Head — larger orb on top
    cx.fillStyle=col;cx.strokeStyle=acc;cx.lineWidth=2;
    cx.beginPath();cx.arc(x+w/2,y+h*.15,w*.42*pulse,0,Math.PI*2);
    cx.fill();cx.stroke();
    // Eyes
    for(let i=0;i<eyes;i++){
      const angle=(i/eyes)*Math.PI*2-Math.PI/2;
      const er=w*.22;
      const ex=x+w/2+Math.cos(angle)*er, ey=y+h*.15+Math.sin(angle)*er*.6;
      cx.fillStyle='#000';cx.beginPath();cx.arc(ex,ey,4.5,0,Math.PI*2);cx.fill();
      cx.fillStyle=acc;cx.beginPath();cx.arc(ex,ey,2.5,0,Math.PI*2);cx.fill();
    }
    // Tentacle arms
    for(let i=0;i<arms;i++){
      const side=i%2===0?-1:1,ai=Math.floor(i/2);
      const baseX=x+w/2+side*w*.18,baseY=y+h*(.35+ai*.1);
      const cpX=baseX+side*(20+ai*8),cpY=baseY+Math.sin(phase+i*1.2)*15;
      const endX=baseX+side*(35+ai*10),endY=baseY+Math.sin(phase+i)*20;
      cx.strokeStyle=acc;cx.lineWidth=2.5;
      cx.beginPath();cx.moveTo(baseX,baseY);cx.quadraticCurveTo(cpX,cpY,endX,endY);cx.stroke();
      // Sucker tip
      cx.fillStyle=acc;cx.beginPath();cx.arc(endX,endY,4,0,Math.PI*2);cx.fill();
    }
  }

  // WIDE — fat horizontally, like a crab monster
  function drawAlienWide(cx,x,y,w,h,col,acc,arms,eyes,phase,pulse){
    // Main body carapace
    cx.fillStyle=col;
    cx.beginPath();cx.ellipse(x+w/2,y+h*.6,w*.5*pulse,h*.35,0,0,Math.PI*2);cx.fill();
    // Armored plates
    cx.fillStyle=acc+'33';cx.strokeStyle=acc;cx.lineWidth=1.5;
    for(let i=0;i<4;i++){
      cx.beginPath();cx.ellipse(x+w*.15+i*w*.2,y+h*.55,w*.09,h*.2,0,0,Math.PI*2);
      cx.fill();cx.stroke();
    }
    // Head nub
    cx.fillStyle=col;cx.beginPath();cx.ellipse(x+w/2,y+h*.28,w*.28*pulse,h*.22,0,0,Math.PI*2);cx.fill();
    cx.strokeStyle=acc;cx.lineWidth=2;cx.beginPath();cx.ellipse(x+w/2,y+h*.28,w*.28*pulse,h*.22,0,0,Math.PI*2);cx.stroke();
    // Eyes wide spread
    for(let i=0;i<eyes;i++){
      const ex=x+w*.15+(i/(Math.max(1,eyes-1)))*w*.7, ey=y+h*.25;
      cx.fillStyle='#000';cx.beginPath();cx.arc(ex,ey,5,0,Math.PI*2);cx.fill();
      cx.fillStyle=acc;cx.beginPath();cx.arc(ex,ey,3,0,Math.PI*2);cx.fill();
    }
    // Claw arms
    for(let i=0;i<Math.min(arms,8);i++){
      const side=i%2===0?-1:1,ai=Math.floor(i/2);
      const bx=x+w/2+side*w*.32,by=y+h*.5+ai*7;
      const ex=bx+side*(22+ai*9),ey=by+5+Math.sin(phase+i*.8)*8;
      cx.strokeStyle=acc;cx.lineWidth=3;
      cx.beginPath();cx.moveTo(bx,by);cx.lineTo(ex,ey);cx.stroke();
      // Claw tips
      cx.lineWidth=2;
      cx.beginPath();cx.moveTo(ex,ey);cx.lineTo(ex+side*6,ey-6);cx.stroke();
      cx.beginPath();cx.moveTo(ex,ey);cx.lineTo(ex+side*6,ey+6);cx.stroke();
    }
  }

  // CRAWLER — long horizontal, many legs, low to ground
  function drawAlienCrawler(cx,x,y,w,h,col,acc,arms,eyes,phase,pulse){
    const segW=w/5;
    // Body segments
    for(let i=0;i<5;i++){
      const sx=x+i*segW,sy=y+h*.4,sw=segW+4,sh=h*.45;
      cx.fillStyle=i%2===0?col:acc+'66';
      cx.beginPath();cx.ellipse(sx+sw/2,sy+sh/2,sw*.5,sh*.45,0,0,Math.PI*2);cx.fill();
      cx.strokeStyle=acc;cx.lineWidth=1;
      cx.beginPath();cx.ellipse(sx+sw/2,sy+sh/2,sw*.5,sh*.45,0,0,Math.PI*2);cx.stroke();
    }
    // Head
    cx.fillStyle=col;cx.beginPath();cx.ellipse(x+w*.9,y+h*.4,w*.18*pulse,h*.35,0,0,Math.PI*2);cx.fill();
    cx.strokeStyle=acc;cx.lineWidth=2;cx.beginPath();cx.ellipse(x+w*.9,y+h*.4,w*.18*pulse,h*.35,0,0,Math.PI*2);cx.stroke();
    // Many legs
    for(let i=0;i<Math.min(arms,10);i++){
      const side=i%2===0?-1:1,ai=Math.floor(i/2);
      const bx=x+w*.1+ai*(w*.18),by=y+h*.65;
      const llen=14+Math.random()*6;
      const lx=bx,ly=by+llen+Math.sin(phase+i*.5)*5;
      cx.strokeStyle=acc;cx.lineWidth=2;
      cx.beginPath();cx.moveTo(bx,by);cx.lineTo(lx+side*8,by+llen*.5);cx.lineTo(lx+side*4,ly);cx.stroke();
    }
    // Eyes on head
    for(let i=0;i<Math.min(eyes,4);i++){
      const ex=x+w*.82+i*7,ey=y+h*.34+i%2*8;
      cx.fillStyle='#000';cx.beginPath();cx.arc(ex,ey,4,0,Math.PI*2);cx.fill();
      cx.fillStyle=acc;cx.beginPath();cx.arc(ex,ey,2.5,0,Math.PI*2);cx.fill();
    }
  }

  // TITAN — massive, tall body with huge head
  function drawAlienTitan(cx,x,y,w,h,col,acc,arms,eyes,phase,pulse){
    // Massive body
    cx.fillStyle=col;
    cx.beginPath();cx.roundRect(x+w*.2,y+h*.3,w*.6,h*.65,8);cx.fill();
    cx.strokeStyle=acc;cx.lineWidth=2;
    cx.beginPath();cx.roundRect(x+w*.2,y+h*.3,w*.6,h*.65,8);cx.stroke();
    // Armored chest plates
    cx.fillStyle=acc+'44';
    for(let i=0;i<3;i++){
      cx.fillRect(x+w*.25,y+h*(.35+i*.12),w*.5,h*.08);
      cx.strokeStyle=acc;cx.lineWidth=1;
      cx.strokeRect(x+w*.25,y+h*(.35+i*.12),w*.5,h*.08);
    }
    // Giant head
    cx.fillStyle=col;cx.beginPath();cx.ellipse(x+w/2,y+h*.18,w*.44*pulse,h*.22,0,0,Math.PI*2);cx.fill();
    cx.strokeStyle=acc;cx.lineWidth=3;cx.beginPath();cx.ellipse(x+w/2,y+h*.18,w*.44*pulse,h*.22,0,0,Math.PI*2);cx.stroke();
    // Huge single/double eye
    for(let i=0;i<Math.min(eyes,3);i++){
      const ex=x+w*.3+i*w*.2,ey=y+h*.16;
      const er=8-i*2;
      cx.fillStyle='#000';cx.beginPath();cx.arc(ex,ey,er,0,Math.PI*2);cx.fill();
      cx.fillStyle=acc;cx.beginPath();cx.arc(ex,ey,er*.6,0,Math.PI*2);cx.fill();
      cx.fillStyle='#fff';cx.beginPath();cx.arc(ex-2,ey-2,er*.25,0,Math.PI*2);cx.fill();
    }
    // Massive arms
    for(let i=0;i<Math.min(arms,4);i++){
      const side=i%2===0?-1:1,ai=Math.floor(i/2);
      const bx=x+w/2+side*w*.3,by=y+h*(.38+ai*.15);
      const ex=bx+side*(30+ai*12),ey=by+Math.sin(phase+i)*18+12;
      cx.strokeStyle=acc;cx.lineWidth=5-ai;
      cx.beginPath();cx.moveTo(bx,by);cx.quadraticCurveTo(bx+side*15,by-10,ex,ey);cx.stroke();
      cx.fillStyle=acc;cx.beginPath();cx.arc(ex,ey,6-ai,0,Math.PI*2);cx.fill();
    }
  }

  // FLOATER — jellyfish/medusa style, floats mid-air
  function drawAlienFloater(cx,x,y,w,h,col,acc,arms,eyes,phase,pulse){
    // Bell dome
    cx.fillStyle=col+'bb';cx.strokeStyle=acc;cx.lineWidth=2;
    cx.beginPath();cx.arc(x+w/2,y+h*.25,w*.45*pulse,Math.PI,0);
    cx.quadraticCurveTo(x+w*.95,y+h*.4,x+w*.85,y+h*.45);
    cx.lineTo(x+w*.15,y+h*.45);
    cx.quadraticCurveTo(x+w*.05,y+h*.4,x+w*.05,y+h*.25);
    cx.closePath();cx.fill();cx.stroke();
    // Inner dome glow
    const inner=cx.createRadialGradient(x+w/2,y+h*.2,0,x+w/2,y+h*.2,w*.3);
    inner.addColorStop(0,acc+'66');inner.addColorStop(1,'transparent');
    cx.fillStyle=inner;cx.beginPath();cx.arc(x+w/2,y+h*.25,w*.4,Math.PI,0);cx.fill();
    // Eyes along dome edge
    for(let i=0;i<Math.min(eyes,6);i++){
      const angle=Math.PI+i*(Math.PI/(Math.max(1,eyes-1)));
      const ex=x+w/2+Math.cos(angle)*w*.32, ey=y+h*.25+Math.sin(angle)*h*.15;
      if(ey>y+h*.4) continue;
      cx.fillStyle='#000';cx.beginPath();cx.arc(ex,ey,4.5,0,Math.PI*2);cx.fill();
      cx.fillStyle=acc;cx.beginPath();cx.arc(ex,ey,2.5,0,Math.PI*2);cx.fill();
    }
    // Trailing tentacles
    for(let i=0;i<Math.min(arms,12);i++){
      const baseX=x+w*.2+i*(w*.6/(Math.max(1,arms-1))), baseY=y+h*.44;
      const len=h*.5+Math.random()*h*.2;
      const wave=Math.sin(phase+i*.4)*12;
      cx.strokeStyle=acc+'88';cx.lineWidth=2.5;
      cx.beginPath();cx.moveTo(baseX,baseY);
      cx.quadraticCurveTo(baseX+wave,baseY+len*.5,baseX+wave*.5,baseY+len);cx.stroke();
      cx.fillStyle=acc+'66';cx.beginPath();cx.arc(baseX+wave*.5,baseY+len,3.5,0,Math.PI*2);cx.fill();
    }
  }

  // MULTI — multi-headed cluster creature
  function drawAlienMulti(cx,x,y,w,h,col,acc,arms,eyes,phase,pulse){
    // Central mass
    cx.fillStyle=col;cx.beginPath();cx.ellipse(x+w/2,y+h*.6,w*.4,h*.32,0,0,Math.PI*2);cx.fill();
    cx.strokeStyle=acc;cx.lineWidth=2;cx.beginPath();cx.ellipse(x+w/2,y+h*.6,w*.4,h*.32,0,0,Math.PI*2);cx.stroke();
    // Multiple heads on stalks
    const headCount=Math.min(Math.floor(eyes/2)+1,5);
    for(let i=0;i<headCount;i++){
      const angle=-Math.PI*.8+(i/(Math.max(1,headCount-1)))*Math.PI*.9;
      const stalkLen=h*.28+Math.sin(phase+i*.7)*8;
      const hx=x+w/2+Math.cos(angle)*stalkLen,hy=y+h*.5-Math.sin(angle+.3)*stalkLen;
      // Stalk
      cx.strokeStyle=col;cx.lineWidth=5;
      cx.beginPath();cx.moveTo(x+w/2,y+h*.5);cx.quadraticCurveTo(x+w/2+Math.cos(angle)*stalkLen*.5,y+h*.4,hx,hy);cx.stroke();
      // Head blob
      cx.fillStyle=i%2===0?col:acc+'aa';cx.strokeStyle=acc;cx.lineWidth=1.5;
      cx.beginPath();cx.arc(hx,hy,w*.14*pulse,0,Math.PI*2);cx.fill();cx.stroke();
      // Eye
      cx.fillStyle='#000';cx.beginPath();cx.arc(hx,hy,5,0,Math.PI*2);cx.fill();
      cx.fillStyle=acc;cx.beginPath();cx.arc(hx,hy,3,0,Math.PI*2);cx.fill();
    }
    // Arms from body
    for(let i=0;i<Math.min(arms,8);i++){
      const side=i%2===0?-1:1,ai=Math.floor(i/2);
      const bx=x+w/2+side*w*.22,by=y+h*.62+ai*7;
      const ex=bx+side*(18+ai*8),ey=by+Math.sin(phase+i)*12+8;
      cx.strokeStyle=acc;cx.lineWidth=3;
      cx.beginPath();cx.moveTo(bx,by);cx.quadraticCurveTo(bx+side*8,by-5,ex,ey);cx.stroke();
      cx.fillStyle=acc;cx.beginPath();cx.arc(ex,ey,4,0,Math.PI*2);cx.fill();
    }
  }

  // BLOB — amorphous, pulsing mass with many eyes
  function drawAlienBlob(cx,x,y,w,h,col,acc,arms,eyes,phase,pulse){
    // Wobbly body
    cx.fillStyle=col;cx.strokeStyle=acc;cx.lineWidth=2;
    cx.beginPath();
    const pts=12;
    for(let i=0;i<=pts;i++){
      const angle=(i/pts)*Math.PI*2;
      const wobble=1+Math.sin(phase+angle*3)*.12;
      const r={x:w*.44*wobble*pulse,y:h*.42*wobble*pulse};
      const px=x+w/2+Math.cos(angle)*r.x, py=y+h*.52+Math.sin(angle)*r.y;
      if(i===0) cx.moveTo(px,py); else cx.lineTo(px,py);
    }
    cx.closePath();cx.fill();cx.stroke();
    // Bioluminescent spots
    cx.fillStyle=acc+'55';
    for(let i=0;i<6;i++){
      const bx=x+w*.2+Math.random()*w*.6, by=y+h*.3+Math.random()*h*.4;
      cx.beginPath();cx.arc(bx,by,4+Math.random()*5,0,Math.PI*2);cx.fill();
    }
    // Eyes randomly placed on surface
    for(let i=0;i<Math.min(eyes,8);i++){
      const angle=(i/eyes)*Math.PI*2+phase*.1;
      const r=w*.28+Math.sin(phase+i)*.04*w;
      const ex=x+w/2+Math.cos(angle)*r*.9,ey=y+h*.52+Math.sin(angle)*h*.35;
      cx.fillStyle='#111';cx.beginPath();cx.arc(ex,ey,5,0,Math.PI*2);cx.fill();
      cx.fillStyle=acc;cx.beginPath();cx.arc(ex,ey,3,0,Math.PI*2);cx.fill();
      cx.fillStyle='#fff';cx.beginPath();cx.arc(ex-1,ey-1,1.5,0,Math.PI*2);cx.fill();
    }
    // Short pseudopod arms
    for(let i=0;i<Math.min(arms,6);i++){
      const angle=(i/arms)*Math.PI*2+phase*.05;
      const bx=x+w/2+Math.cos(angle)*w*.3,by=y+h*.52+Math.sin(angle)*h*.3;
      const len=12+Math.sin(phase+i)*6;
      const ex=bx+Math.cos(angle)*len,ey=by+Math.sin(angle)*len;
      cx.strokeStyle=acc+'cc';cx.lineWidth=4;
      cx.beginPath();cx.moveTo(bx,by);cx.lineTo(ex,ey);cx.stroke();
      cx.fillStyle=acc;cx.beginPath();cx.arc(ex,ey,5,0,Math.PI*2);cx.fill();
    }
  }

  // ══════════════════════════════════
  //  HUMAN RUNNER
  // ══════════════════════════════════
  function drawHuman(){
    if(H_.inv>0&&Math.floor(H_.inv/5)%2===0)return;
    const x=Math.round(H_.x),y=Math.round(H_.y);
    const L=LEVELS[levelIdx];
    cx.save();cx.shadowBlur=10;cx.shadowColor='rgba(255,255,255,.5)';
    if(H_.duck&&H_.onG) drawHumanDuck(x,y+HH-DH);
    else drawHumanFull(x,y,H_.af,H_.onG,L);
    cx.restore();
  }

  function drawHumanFull(x,y,af,onG,L){
    const suit=L.accent; // spacesuit tinted by level
    // === HELMET ===
    cx.fillStyle='#1a1a2a';cx.shadowBlur=0;
    cx.beginPath();cx.arc(x+HW/2,y+8,12,0,Math.PI*2);cx.fill();
    // Visor
    const visorGrad=cx.createRadialGradient(x+HW/2,y+7,2,x+HW/2,y+8,10);
    visorGrad.addColorStop(0,'rgba(100,220,255,.7)');visorGrad.addColorStop(1,'rgba(0,100,180,.4)');
    cx.fillStyle=visorGrad;cx.beginPath();cx.ellipse(x+HW/2,y+8,8,6,0,0,Math.PI*2);cx.fill();
    // Helmet rim
    cx.strokeStyle=suit;cx.lineWidth=1.5;cx.shadowColor=suit;cx.shadowBlur=6;
    cx.beginPath();cx.arc(x+HW/2,y+8,12,0,Math.PI*2);cx.stroke();
    cx.shadowBlur=0;

    // === BODY / SPACESUIT ===
    cx.fillStyle='#2a2a3a';cx.fillRect(x+5,y+18,18,16);
    // Chest pack
    cx.fillStyle='#1a3a4a';cx.fillRect(x+7,y+20,14,10);
    cx.strokeStyle=suit;cx.lineWidth=1.5;cx.shadowColor=suit;cx.shadowBlur=4;
    cx.strokeRect(x+7,y+20,14,10);
    // Blinking status light
    const blinkOn=Math.floor(tick/15)%2===0;
    cx.fillStyle=blinkOn?suit:'#1a3a4a';cx.beginPath();cx.arc(x+14,y+25,2.5,0,Math.PI*2);cx.fill();
    cx.shadowBlur=0;

    // === ARMS ===
    cx.fillStyle='#2a2a3a';
    if(onG){
      // Running arm swing
      const af2=af%4;
      const swingL=af2<2?-6:4, swingR=af2<2?4:-6;
      cx.fillRect(x+1,y+18+swingL,5,12);cx.fillRect(x+22,y+18+swingR,5,12);
      cx.fillStyle='#3a4a4a';cx.fillRect(x,y+28+swingL,6,5);cx.fillRect(x+22,y+28+swingR,6,5);
    } else {
      cx.fillRect(x-1,y+18,5,12);cx.fillRect(x+24,y+18,5,12);
      cx.fillStyle='#3a4a4a';cx.fillRect(x-2,y+29,6,5);cx.fillRect(x+24,y+29,6,5);
    }

    // === LEGS ===
    cx.fillStyle='#1e1e2e';
    if(onG){
      const lp=[[0,0],[4,3],[2,0],[-2,3]];
      const[la,lb]=lp[af%4];
      cx.fillRect(x+5,y+34+la,7,14);cx.fillRect(x+16,y+34+lb,7,14);
      // Boots
      cx.fillStyle=suit;cx.shadowColor=suit;cx.shadowBlur=3;
      if(af%4===1){cx.fillRect(x+3,y+46+la,9,5);cx.fillRect(x+14,y+45+lb,10,5);}
      else if(af%4===3){cx.fillRect(x+4,y+46+la,9,5);cx.fillRect(x+15,y+46+lb,9,5);}
      else{cx.fillRect(x+4,y+46+la,9,5);cx.fillRect(x+14,y+46+lb,10,5);}
    } else {
      // Tuck legs
      cx.fillRect(x+5,y+34,7,12);cx.fillRect(x+16,y+34,7,12);
      cx.fillStyle=suit;cx.shadowColor=suit;cx.shadowBlur=3;
      cx.fillRect(x+3,y+44,9,5);cx.fillRect(x+16,y+44,9,5);
    }
    // Boot glow line
    cx.fillStyle=suit;cx.fillRect(x+3,y+46,10,1.5);cx.fillRect(x+14,y+46,10,1.5);
    cx.shadowBlur=0;

    // Jetpack exhaust when jumping
    if(!onG){
      cx.fillStyle=suit+'88';
      for(let i=0;i<3;i++){
        cx.beginPath();
        cx.arc(x+8+i*6,y+34,2+Math.random()*2,0,Math.PI*2);cx.fill();
      }
    }
  }

  function drawHumanDuck(x,y){
    const L=LEVELS[levelIdx],suit=L.accent;
    // Helmet
    cx.fillStyle='#1a1a2a';cx.beginPath();cx.arc(x+HW/2,y+5,10,0,Math.PI*2);cx.fill();
    const vg=cx.createRadialGradient(x+HW/2,y+5,2,x+HW/2,y+5,9);
    vg.addColorStop(0,'rgba(100,220,255,.7)');vg.addColorStop(1,'rgba(0,100,180,.4)');
    cx.fillStyle=vg;cx.beginPath();cx.ellipse(x+HW/2,y+5,6,5,0,0,Math.PI*2);cx.fill();
    cx.strokeStyle=suit;cx.lineWidth=1.5;cx.beginPath();cx.arc(x+HW/2,y+5,10,0,Math.PI*2);cx.stroke();
    // Crouched body
    cx.fillStyle='#2a2a3a';cx.fillRect(x+3,y+14,22,12);
    cx.fillStyle='#1a3a4a';cx.fillRect(x+7,y+16,12,8);
    cx.strokeStyle=suit;cx.lineWidth=1.5;cx.strokeRect(x+7,y+16,12,8);
    // Legs spread
    cx.fillStyle='#1e1e2e';cx.fillRect(x+2,y+22,24,6);
    cx.fillStyle=suit;cx.fillRect(x+2,y+26,24,4);
  }

  // ══════════════════════════════════
  //  CRYSTAL & PARTICLES
  // ══════════════════════════════════
  function drawCrystal(c){
    const pulse=Math.sin(c.anim*.1)*.25+1;
    cx.save();cx.shadowColor=c.color;cx.shadowBlur=18;
    // Crystal shape (hexagon)
    cx.strokeStyle=c.color;cx.fillStyle=c.color+'33';cx.lineWidth=2;
    cx.beginPath();
    for(let i=0;i<6;i++){
      const a=i/6*Math.PI*2-Math.PI/6;
      const r=c.r*pulse;
      if(i===0)cx.moveTo(c.x+Math.cos(a)*r,c.y+Math.sin(a)*r);
      else cx.lineTo(c.x+Math.cos(a)*r,c.y+Math.sin(a)*r);
    }
    cx.closePath();cx.fill();cx.stroke();
    // Inner glow
    cx.fillStyle=c.color;cx.beginPath();cx.arc(c.x,c.y,c.r*.35*pulse,0,Math.PI*2);cx.fill();
    // Sparkle
    if(Math.floor(c.anim/8)%2===0){
      cx.strokeStyle=c.color;cx.lineWidth=1;
      [0,90,45,135].forEach(deg=>{const r=deg*Math.PI/180;const len=c.r*.7;cx.beginPath();cx.moveTo(c.x-Math.cos(r)*len,c.y-Math.sin(r)*len);cx.lineTo(c.x+Math.cos(r)*len,c.y+Math.sin(r)*len);cx.stroke();});
    }
    cx.restore();
  }

  function drawTrail(L){
    H_.trail.forEach(t=>{cx.globalAlpha=(t.l/8)*.2;cx.fillStyle=L.accent;cx.shadowBlur=4;const s=(t.l/8)*8;cx.fillRect(t.x-s/2,t.y-s/2,s,s);});
    cx.globalAlpha=1;cx.shadowBlur=0;
  }
  function drawParticles(){
    H_.pts.forEach(p=>{cx.globalAlpha=p.life/p.ml;cx.fillStyle=p.color;cx.shadowColor=p.color;cx.shadowBlur=5;cx.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz);});
    cx.globalAlpha=1;cx.shadowBlur=0;
  }

  // ══════════════════════════════════
  //  SCREENS
  // ══════════════════════════════════
  function drawIdle(L){
    cx.fillStyle='rgba(0,0,0,.6)';cx.fillRect(0,0,W,H);
    drawHumanFull(100,GY-HH,0,true,L);
    cx.save();cx.textAlign='center';cx.textBaseline='middle';
    cx.font="bold 46px 'Orbitron',monospace";
    cx.fillStyle=L.accent;cx.shadowColor=L.accent;cx.shadowBlur=28;
    cx.fillText('ALIEN ESCAPE',W/2,H/2-62);
    cx.font="15px 'Orbitron',monospace";
    cx.fillStyle='#ffffff';cx.shadowColor='rgba(255,255,255,.5)';cx.shadowBlur=10;
    cx.fillText(`CURRENTLY: ${L.name}`,W/2,H/2-26);
    if(Math.floor(tick/22)%2===0){
      cx.font="bold 18px 'Orbitron',monospace";
      cx.fillStyle=L.accent;cx.shadowColor=L.accent;cx.shadowBlur=15;
      cx.fillText('▶  CLICK  OR  PRESS  SPACE  TO  START  ◀',W/2,H/2+16);
    }
    cx.font="12px 'Share Tech Mono',monospace";
    cx.fillStyle='rgba(255,255,255,.55)';cx.shadowBlur=0;
    cx.fillText('DODGE ALIENS  ·  COLLECT CRYSTALS  ·  SURVIVE 10 WORLDS',W/2,H/2+56);
    cx.restore();
  }

  function drawDead(L){
    cx.fillStyle='rgba(0,0,0,.75)';cx.fillRect(0,0,W,H);
    cx.save();cx.textAlign='center';cx.textBaseline='middle';
    cx.font="bold 52px 'Orbitron',monospace";
    cx.fillStyle='#ff3333';cx.shadowColor='#ff0000';cx.shadowBlur=35;
    cx.fillText('MISSION FAILED',W/2,H/2-60);
    cx.font="15px 'Share Tech Mono',monospace";
    cx.fillStyle=L.accent;cx.shadowColor=L.accent;cx.shadowBlur=12;
    cx.fillText(`SCORE: ${String(score).padStart(6,'0')}   BEST: ${String(best).padStart(6,'0')}`,W/2,H/2-6);
    cx.font="12px 'Share Tech Mono',monospace";
    cx.fillStyle='rgba(255,255,255,.6)';cx.shadowBlur=0;
    cx.fillText(`CRYSTALS: ${crystals}   REACHED: ${L.name}`,W/2,H/2+22);
    if(Math.floor(tick/22)%2===0){
      cx.font="14px 'Orbitron',monospace";cx.fillStyle=L.accent;cx.shadowColor=L.accent;cx.shadowBlur=12;
      cx.fillText('CLICK OR PRESS SPACE TO TRY AGAIN',W/2,H/2+60);
    }
    cx.restore();
  }

  // ── Loop ──
  function loop(){tick++;update();draw();requestAnimationFrame(loop);}
  loadHi();
  requestAnimationFrame(loop);
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}

})();
