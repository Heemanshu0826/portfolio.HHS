/**
 * Lightweight 3D Card Tilt & Glare Effect
 * Provides realistic 3D perspective depth on cards
 */

(function () {
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach((el) => {
    // Inject glare container if not present
    let glare = el.querySelector('.tilt-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'tilt-glare';
      el.appendChild(glare);
    }

    let isHovered = false;
    const maxTilt = parseFloat(el.getAttribute('data-tilt-max')) || 12;

    function handleMouseMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentX = (x / rect.width) * 2 - 1; // -1 to 1
      const percentY = (y / rect.height) * 2 - 1; // -1 to 1

      const rotateX = -percentY * maxTilt;
      const rotateY = percentX * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Dynamic glare follow
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.18), transparent 70%)`;
      glare.style.opacity = '1';
    }

    function handleMouseEnter() {
      isHovered = true;
      el.style.transition = 'transform 0.1s ease-out';
    }

    function handleMouseLeave() {
      isHovered = false;
      el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      glare.style.opacity = '0';
    }

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
  });
})();
