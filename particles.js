/**
 * Particles Background Animation Engine
 * Encapsulated & Optimized for High Performance
 * Spotless memory cleanup & throttled interaction
 */
(() => {
  'use strict';

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set initial dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  const colors = ["#ffd700", "#ff6b35", "#4ecdc4", "#ffffff"];
  const SPAWN_THROTTLE_MS = 20; // limit updates to ~50fps
  let lastSpawnTime = 0;
  let resizeTimeout = null;

  /**
   * Particle Constructor
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {string} color
   * @param {{x: number, y: number}} velocity
   */
  function Particle(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  };

  Particle.prototype.update = function () {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.012; // Slightly faster fade for smoother visual trail
    this.draw();
  };

  /**
   * Animation loop running on RequestAnimationFrame
   */
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Iterate backwards to avoid splice skip index bug
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      if (particle.alpha > 0) {
        particle.update();
      } else {
        particles.splice(i, 1);
      }
    }
  }

  /**
   * Spawns a cluster of particles at coordinates
   * @param {number} x
   * @param {number} y
   */
  function spawnParticles(x, y) {
    const clusterSize = 8; // Optimized from 20 to prevent performance degradation
    for (let i = 0; i < clusterSize; i++) {
      const radius = Math.random() * 2.5 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const velocity = {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3,
      };
      particles.push(new Particle(x, y, radius, color, velocity));
    }
  }

  // Throttled mousemove listener
  window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastSpawnTime >= SPAWN_THROTTLE_MS) {
      spawnParticles(e.clientX, e.clientY);
      lastSpawnTime = now;
    }
  }, { passive: true });

  // Debounced window resize listener
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = []; // clear to reset context bounds cleanly
    }, 150);
  }, { passive: true });

  // Initialize Loop
  animate();
})();
