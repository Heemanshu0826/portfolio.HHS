/**
 * Antigravity Interactive Cursor & Front Page Parallax Engine
 * Strictly Scoped to Page 1 (Hero Section)
 * 
 * Features:
 *  1. Smooth Dual-Layer Cursor (Luminous Dot + Elastic Ring) active ONLY on Page 1
 *  2. Antigravity Zero-G Quantum Stardust Particle Trail active ONLY on Page 1
 *  3. Dynamic Front-Page Torch Spotlight Tracking
 *  4. Multi-Plane Floating Parallax for Hero Elements
 *  5. Immediate graceful restoration of default browser cursor on all subsequent pages
 */

(function () {
  'use strict';

  // Do not run on touch devices or screens without fine pointer
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches;

  if (isTouchDevice) return;

  // --------------------------------------------------------------------------
  // 1. SETUP DOM ELEMENTS
  // --------------------------------------------------------------------------
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const trailCanvas = document.getElementById('cursor-trail-canvas');
  const heroSection = document.getElementById('hero');

  if (!dot || !ring || !trailCanvas || !heroSection) return;

  const ctx = trailCanvas.getContext('2d');

  // Mouse coordinate state
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetX = mouseX;
  let targetY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;
  let mouseVelX = 0;
  let mouseVelY = 0;
  let prevMouseX = mouseX;
  let prevMouseY = mouseY;
  let onPage1 = false;

  // Window sizing for canvas
  function resizeCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // --------------------------------------------------------------------------
  // 2. PAGE 1 DETECTION (HERO SECTION BOUNDS)
  // --------------------------------------------------------------------------
  function checkPage1State() {
    const heroRect = heroSection.getBoundingClientRect();
    // Cursor is strictly on Page 1 if inside Hero's visible screen boundary
    const isInside =
      targetY >= heroRect.top &&
      targetY <= heroRect.bottom &&
      targetX >= heroRect.left &&
      targetX <= heroRect.right &&
      heroRect.bottom > 60;

    if (isInside !== onPage1) {
      onPage1 = isInside;
      if (onPage1) {
        document.body.classList.add('cursor-on-hero');
      } else {
        document.body.classList.remove('cursor-on-hero');
        document.body.classList.remove('cursor-hover');
        document.body.classList.remove('cursor-click');
      }
    }

    return onPage1;
  }

  // Check state on scroll
  window.addEventListener('scroll', checkPage1State, { passive: true });

  // --------------------------------------------------------------------------
  // 3. MOUSE EVENT LISTENERS & SPOTLIGHT UPDATER
  // --------------------------------------------------------------------------
  window.addEventListener(
    'mousemove',
    (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Calculate velocity
      mouseVelX = targetX - prevMouseX;
      mouseVelY = targetY - prevMouseY;
      prevMouseX = targetX;
      prevMouseY = targetY;

      const isCurrentPage1 = checkPage1State();

      if (isCurrentPage1) {
        // Update Front Page Spotlight CSS variables
        const heroRect = heroSection.getBoundingClientRect();
        const heroX = targetX - heroRect.left;
        const heroY = targetY - heroRect.top;
        heroSection.style.setProperty('--cursor-x', `${heroX}px`);
        heroSection.style.setProperty('--cursor-y', `${heroY}px`);

        // Emit trail particles only while on Page 1
        const speed = Math.hypot(mouseVelX, mouseVelY);
        if (speed > 1.2) {
          addTrailParticles(targetX, targetY, mouseVelX, mouseVelY, Math.min(Math.floor(speed / 4) + 1, 4));
        }
      }
    },
    { passive: true }
  );

  // Mouse leave / enter window
  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-on-hero');
    onPage1 = false;
  });

  document.addEventListener('mouseenter', () => {
    checkPage1State();
  });

  // Click physics on Page 1
  window.addEventListener('mousedown', () => {
    if (!onPage1) return;
    document.body.classList.add('cursor-click');

    // Burst micro-sparks on click
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
      const speed = 2.5 + Math.random() * 3.5;
      particles.push(new QuantumSpark(targetX, targetY, Math.cos(angle) * speed, Math.sin(angle) * speed, true));
    }
  });

  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // --------------------------------------------------------------------------
  // 4. MAGNETIC HOVER DETECTION FOR PAGE 1 (HERO) ELEMENTS
  // --------------------------------------------------------------------------
  const heroInteractiveSelectors = [
    '#hero a',
    '#hero button',
    '#hero .btn',
    '#hero .floating-card',
    '#hero .profile-circle-wrapper',
    '#hero .tech-tag',
    '#hero .meta-item',
    '#hero .status-badge'
  ];

  function bindHeroHoverListeners() {
    const elements = document.querySelectorAll(heroInteractiveSelectors.join(','));
    elements.forEach((el) => {
      if (el.dataset.hasHeroCursorBound) return;
      el.dataset.hasHeroCursorBound = 'true';

      el.addEventListener('mouseenter', () => {
        if (onPage1) {
          document.body.classList.add('cursor-hover');
        }
      });

      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  bindHeroHoverListeners();

  // --------------------------------------------------------------------------
  // 5. ZERO-G QUANTUM STARDUST PARTICLE SYSTEM (PAGE 1)
  // --------------------------------------------------------------------------
  const particles = [];
  const maxParticles = 60;

  class QuantumSpark {
    constructor(x, y, vx, vy, isClickBurst = false) {
      this.x = x;
      this.y = y;
      this.vx = (vx || 0) * 0.2 + (Math.random() - 0.5) * 1.5;
      this.vy = (vy || 0) * 0.2 + (Math.random() - 0.5) * 1.5;
      this.life = 1.0;
      this.decay = isClickBurst ? 0.035 : 0.02 + Math.random() * 0.025;
      this.size = isClickBurst ? 2.5 + Math.random() * 2 : 1.4 + Math.random() * 2;
      this.isCyan = Math.random() > 0.45;
      this.isGold = Math.random() > 0.85;
      // Antigravity zero-G buoyancy
      this.floatDrift = -0.15 - Math.random() * 0.25;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy + this.floatDrift;
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.life -= this.decay;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);

      if (this.isGold) {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
      } else if (this.isCyan) {
        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
      } else {
        ctx.fillStyle = '#a855f7';
        ctx.shadowColor = '#a855f7';
      }

      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  function addTrailParticles(x, y, vx, vy, count) {
    for (let i = 0; i < count; i++) {
      if (particles.length > maxParticles) {
        particles.shift();
      }
      const jitterX = (Math.random() - 0.5) * 6;
      const jitterY = (Math.random() - 0.5) * 6;
      particles.push(new QuantumSpark(x + jitterX, y + jitterY, vx, vy));
    }
  }

  // --------------------------------------------------------------------------
  // 6. FRONT PAGE ANTIGRAVITY FLOATING PARALLAX
  // --------------------------------------------------------------------------
  const heroVisual = document.querySelector('.hero-visual');
  const heroContent = document.querySelector('.hero-content');
  const profileWrapper = document.querySelector('.profile-circle-wrapper');
  const cardFreelance = document.querySelector('.card-freelance');
  const cardAward = document.querySelector('.card-award');
  const cardAiTech = document.querySelector('.card-ai-tech');

  let parallaxX = 0;
  let parallaxY = 0;
  let targetParallaxX = 0;
  let targetParallaxY = 0;

  function updateFrontPageParallax() {
    if (onPage1) {
      // Normalized from -1 to 1 based on screen center
      targetParallaxX = (targetX / window.innerWidth - 0.5) * 2;
      targetParallaxY = (targetY / window.innerHeight - 0.5) * 2;
    } else {
      targetParallaxX = 0;
      targetParallaxY = 0;
    }

    // Smooth damping (lerp)
    parallaxX += (targetParallaxX - parallaxX) * 0.08;
    parallaxY += (targetParallaxY - parallaxY) * 0.08;

    if (heroVisual) {
      if (profileWrapper) {
        profileWrapper.style.transform = `translate3d(${parallaxX * 14}px, ${parallaxY * 14}px, 0) rotateY(${parallaxX * 8}deg) rotateX(${-parallaxY * 8}deg)`;
      }

      if (cardFreelance) {
        cardFreelance.style.transform = `translate3d(${parallaxX * 22}px, ${parallaxY * 18}px, 0)`;
      }

      if (cardAward) {
        cardAward.style.transform = `translate3d(${-parallaxX * 18}px, ${parallaxY * 20}px, 0)`;
      }

      if (cardAiTech) {
        cardAiTech.style.transform = `translate3d(${parallaxX * 15}px, ${-parallaxY * 16}px, 0)`;
      }

      if (heroContent) {
        heroContent.style.transform = `translate3d(${-parallaxX * 6}px, ${-parallaxY * 6}px, 0)`;
      }
    }
  }

  // --------------------------------------------------------------------------
  // 7. MAIN ANIMATION LOOP (LERP & RENDER)
  // --------------------------------------------------------------------------
  function render() {
    requestAnimationFrame(render);

    if (onPage1) {
      // Immediate tracking for dot
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;

      // Smooth lerp (lagged follow) for elastic ring
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }

    // Update Antigravity parallax on front page
    updateFrontPageParallax();

    // Render Quantum Stardust trail particles
    if (particles.length > 0) {
      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }
    }
  }

  // Start loop
  render();
})();
