// ==========================================
// 1. Interactive Envelope Opening Animation
// ==========================================
let isOpening = false;

function openInvitation() {
  if (isOpening) return;
  isOpening = true;

  const envelope = document.getElementById("envelope");
  const card = document.getElementById("card");
  const waxSeal = document.getElementById("waxSeal");

  // Get EXACT wax seal center position for celebration burst
  let burstX = window.innerWidth / 2;
  let burstY = window.innerHeight / 2;
  if (waxSeal) {
    const rect = waxSeal.getBoundingClientRect();
    burstX = rect.left + rect.width / 2;
    burstY = rect.top + rect.height / 2;
  }

  // Trigger golden confetti burst directly at the seal
  createCelebrationBurst(burstX, burstY);

  // Play opening flap animation & seal pop
  envelope.classList.add("opening");

  // Smoothly reveal the invitation card
  setTimeout(() => {
    envelope.style.display = "none";
    card.classList.add("show");
  }, 500);

  // Start gentle ambient chimes
  if (!isMusicPlaying) {
    toggleMusic(true);
  }
}

function replayInvitation() {
  const envelope = document.getElementById("envelope");
  const card = document.getElementById("card");

  card.classList.remove("show");
  envelope.style.display = "flex";

  // Re-enable opening after reset
  requestAnimationFrame(() => {
    envelope.classList.remove("opening");
    isOpening = false;
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// Romantic Ambient Music & Chimes Synthesizer
// ==========================================
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;
let bgAudio = null;

function initAudio() {
  if (!bgAudio) {
    bgAudio = new Audio("music.mp3");
    bgAudio.loop = true;
    bgAudio.volume = 0.5;
  }
}

function playRomanticChime() {
  if (!isMusicPlaying) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    // Pentatonic romantic notes (D major pentatonic / warm chimes)
    const notes = [293.66, 369.99, 440.0, 493.88, 554.37, 587.33, 659.25, 739.99, 880.0];
    const freq = notes[Math.floor(Math.random() * notes.length)];

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, audioCtx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 2.3);
  } catch (err) {
    // Fail silently if audio is restricted
  }
}

function toggleMusic(forcePlay = false) {
  const musicBtn = document.getElementById("musicBtn");
  if (forcePlay) {
    isMusicPlaying = true;
  } else {
    isMusicPlaying = !isMusicPlaying;
  }

  initAudio();

  if (isMusicPlaying) {
    if (musicBtn) musicBtn.classList.add("playing");

    // Try playing local music.mp3 first, or fall back to ambient chime synthesizer
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        playRomanticChime();
        clearInterval(musicInterval);
        musicInterval = setInterval(() => {
          if (Math.random() > 0.25) {
            playRomanticChime();
          }
        }, 1300);
      });
    }
  } else {
    if (musicBtn) musicBtn.classList.remove("playing");
    if (bgAudio) bgAudio.pause();
    clearInterval(musicInterval);
  }
}

// ==========================================
// 2. Countdown Timer with Seconds Pulse
// ==========================================
const weddingDate = new Date("November 13, 2026 19:00:00").getTime();
let previousSecond = null;

function updateCountdown() {
  const now = Date.now();
  const distance = weddingDate - now;

  if (distance <= 0) {
    const countdownEl = document.querySelector(".countdown");
    if (countdownEl) {
      countdownEl.innerHTML = "<p style='font-size:24px; color:#b38b68;'>The Celebration Has Begun!</p>";
    }
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");

  if (secondsEl) {
    const newSec = String(seconds).padStart(2, "0");
    if (previousSecond !== newSec) {
      secondsEl.textContent = newSec;
      secondsEl.classList.remove("pulse");
      // Force DOM reflow to re-trigger pulse
      void secondsEl.offsetWidth;
      secondsEl.classList.add("pulse");
      previousSecond = newSec;
    }
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ==========================================
// 3. Floating Petals & Golden Sparkles Canvas
// ==========================================
const canvas = document.getElementById("petalsCanvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Ambient Floating Rose/Champagne Petals
class Petal {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : -30;
    this.size = Math.random() * 12 + 10;
    this.speedY = Math.random() * 1.2 + 0.7;
    this.speedX = Math.random() * 1 - 0.5;
    this.angle = Math.random() * Math.PI * 2;
    this.angularSpeed = (Math.random() - 0.5) * 0.02;
    this.flip = Math.random() * Math.PI;
    this.flipSpeed = Math.random() * 0.03 + 0.01;
    this.opacity = Math.random() * 0.5 + 0.35;

    // Soft palette: champagne rose, blush, warm cream
    const palettes = [
      "rgba(224, 185, 168,",
      "rgba(238, 207, 192,",
      "rgba(244, 222, 209,",
      "rgba(216, 178, 142,"
    ];
    this.colorBase = palettes[Math.floor(Math.random() * palettes.length)];
  }

  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.angle) * 0.8 + this.speedX;
    this.angle += this.angularSpeed;
    this.flip += this.flipSpeed;

    if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.scale(Math.cos(this.flip), 1);

    ctx.beginPath();
    ctx.moveTo(0, -this.size / 2);
    ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 2, 0, this.size / 2);
    ctx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size / 2);

    ctx.fillStyle = `${this.colorBase} ${this.opacity})`;
    ctx.fill();
    ctx.restore();
  }
}

// Ambient Shimmering Gold Dust Sparkles
class Sparkle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : height + 10;
    this.radius = Math.random() * 2 + 0.8;
    this.speedY = -(Math.random() * 0.6 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.7 + 0.2;
    this.pulse = Math.random() * 0.05 + 0.02;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.alpha += Math.sin(Date.now() * 0.003 + this.x) * 0.015;

    if (this.y < -10 || this.x < 0 || this.x > width) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(224, 186, 115, ${Math.max(0.1, Math.min(0.9, this.alpha))})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(224, 186, 115, 0.7)";
    ctx.fill();
    ctx.restore();
  }
}

// Celebration Confetti Burst Particles on Opening
class BurstParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 2.5;
    this.gravity = 0.16;
    this.drag = 0.96;
    this.size = Math.random() * 7 + 4;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    this.alpha = 1;
    this.decay = Math.random() * 0.012 + 0.008;

    const goldColors = ["#f7d794", "#dfba73", "#f8ebd2", "#b38b68", "#ffffff"];
    this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
  }

  update() {
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }

  draw() {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    ctx.restore();
  }
}

const petals = Array.from({ length: 30 }, () => new Petal());
const sparkles = Array.from({ length: 25 }, () => new Sparkle());
let burstParticles = [];

function createCelebrationBurst(x, y) {
  for (let i = 0; i < 60; i++) {
    burstParticles.push(new BurstParticle(x, y));
  }
}

// Interactive Touch & Mouse Sparkle Trail
function addPointerSparkle(x, y) {
  burstParticles.push({
    x: x + (Math.random() - 0.5) * 10,
    y: y + (Math.random() - 0.5) * 10,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5 - 0.5,
    gravity: 0.04,
    drag: 0.95,
    size: Math.random() * 2.5 + 1.5,
    rotation: 0,
    rotationSpeed: 0,
    alpha: 0.75,
    decay: 0.025,
    color: Math.random() > 0.4 ? "#e6c387" : "#ffffff",
    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    },
    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  });
}

let lastPointerTime = 0;
window.addEventListener("pointermove", (e) => {
  const now = performance.now();
  if (now - lastPointerTime > 45) {
    addPointerSparkle(e.clientX, e.clientY);
    lastPointerTime = now;
  }
});

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Draw floating sparkles
  sparkles.forEach((s) => {
    s.update();
    s.draw();
  });

  // Draw falling petals
  petals.forEach((p) => {
    p.update();
    p.draw();
  });

  // Draw celebration burst
  for (let i = burstParticles.length - 1; i >= 0; i--) {
    const bp = burstParticles[i];
    bp.update();
    bp.draw();
    if (bp.alpha <= 0) {
      burstParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
