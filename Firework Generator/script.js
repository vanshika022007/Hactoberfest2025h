// Firework Generator — canvas + particles + simple WebAudio sound
// Save this as script.js and open index.html to run

// Canvas setup
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { alpha: true });

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
window.addEventListener('resize', resize);
resize();

// UI elements
const sizeInput = document.getElementById('size');
const speedInput = document.getElementById('speed');
const densityInput = document.getElementById('density');
const trailInput = document.getElementById('trail');
const clearBtn = document.getElementById('clear');
const soundToggle = document.getElementById('sound');

// Sound using WebAudio
let audioCtx = null;
function ensureAudio(){ if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function playPop(freq = 800, duration = 0.06, volume = 0.06){
  if(!soundToggle.checked) return;
  ensureAudio();
  if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'sine';
  o.frequency.value = freq;
  g.gain.value = volume;
  o.connect(g); g.connect(audioCtx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  o.stop(audioCtx.currentTime + duration + 0.02);
}

// Utilities
function rand(min, max){ return Math.random() * (max - min) + min; }
function randInt(min, max){ return Math.floor(rand(min, max + 1)); }
function hslToString(h, s, l){ return `hsl(${h} ${s}% ${l}%)`; }

// Particle & Firework classes
class Particle {
  constructor(x, y, color, vel, life, size, decay, gravity){
    this.x = x; this.y = y;
    this.color = color;
    this.vx = vel.x; this.vy = vel.y;
    this.life = life; this.maxLife = life;
    this.size = size;
    this.decay = decay; // velocity decay/friction
    this.gravity = gravity;
  }
  update(dt){
    // physics
    this.vx *= this.decay;
    this.vy *= this.decay;
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }
  draw(ctx){
    const t = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, Math.min(1, t));
    ctx.arc(this.x, this.y, Math.max(0.5, this.size * t), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  alive(){ return this.life > 0; }
}

class Firework {
  constructor(x, y, opts){
    this.particles = [];
    this.x = x; this.y = y;
    this.opts = opts;
    this.create();
  }
  create(){
    // choose a base hue and create many particles
    const hue = randInt(0, 360);
    const count = Math.max(6, Math.floor(this.opts.density));
    for(let i=0;i<count;i++){
      const angle = rand(0, Math.PI * 2);
      const speed = rand(0.8, 1.0) * this.opts.speed * (0.2 + Math.random());
      const vel = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
      const color = hslToString(hue + rand(-20,20), 80, 60);
      const life = rand(0.7, 1.6) * (1 + Math.random() * 0.8);
      const size = Math.max(1, this.opts.size * (0.06 + Math.random() * 0.14));
      const decay = 0.995 - Math.random()*0.004;
      const gravity = 300 * (0.6 + Math.random()*0.8) * 0.001 * this.opts.speed;
      this.particles.push(new Particle(this.x, this.y, color, vel, life, size, decay, gravity));
    }
    // play sound
    playPop(500 + Math.random()*1200, 0.04, 0.06 + Math.random()*0.03);
  }
  update(dt){
    for(const p of this.particles) p.update(dt);
    // remove dead
    this.particles = this.particles.filter(p=>p.alive());
  }
  draw(ctx){
    for(const p of this.particles) p.draw(ctx);
  }
  alive(){ return this.particles.length > 0; }
}

// simulation
let fireworks = [];
let last = performance.now();
let acc = 0;

// render loop
function loop(now){
  const dt = Math.min(0.05, (now - last)/1000);
  last = now;

  // trail clearing
  if(trailInput.checked){
    ctx.fillStyle = 'rgba(10,12,20,0.22)'; // small fade for trailing
    ctx.fillRect(0,0,canvas.width,canvas.height);
  } else {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  // update & draw
  for(const fw of fireworks) fw.update(dt);
  fireworks = fireworks.filter(fw => fw.alive());
  for(const fw of fireworks) fw.draw(ctx);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// clicking / touch to spawn
function spawnFirework(x, y){
  const opts = {
    size: Number(sizeInput.value),
    speed: Number(speedInput.value),
    density: Number(densityInput.value)
  };
  fireworks.push(new Firework(x, y, opts));
}
// handle mouse
canvas.addEventListener('pointerdown', (e)=>{
  const rect = canvas.getBoundingClientRect();
  spawnFirework(e.clientX - rect.left, e.clientY - rect.top);
});

// also spawn a gentle automatic fountain every few seconds for ambience
let autoTicker = 0;
setInterval(()=>{
  // spawn occasional background fireworks at random positions if few active
  if(Math.random() < 0.28 && fireworks.length < 12){
    spawnFirework(randInt(100, canvas.width-100), randInt(100, canvas.height-200));
  }
}, 700);

// UI actions
clearBtn.addEventListener('click', ()=>{ fireworks = []; ctx.clearRect(0,0,canvas.width,canvas.height); });

// simple initial background
ctx.fillStyle = 'rgba(10,12,20,1)';
ctx.fillRect(0,0,canvas.width,canvas.height);

// resume audio context on first interaction (browser autoplay rules)
document.addEventListener('click', function resumeAudio(){
  ensureAudio();
  if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  document.removeEventListener('click', resumeAudio);
});
