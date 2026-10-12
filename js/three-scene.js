/**
 * Heemanshu Hemant Sute - AI Portfolio 3D Experience
 * Interactive Three.js Neural Network & AI Core Scene
 */

(function () {
  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  // Set up Three.js Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const width = container.clientWidth || 500;
  const height = container.clientHeight || 500;

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 180;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group to rotate together
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Theme-aware colors
  function getThemeColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      primary: isLight ? 0x0284c7 : 0x00f2fe,
      secondary: isLight ? 0x7c3aed : 0xa855f7,
      core: isLight ? 0x4f46e5 : 0x38bdf8,
      lineColor: isLight ? 0x0284c7 : 0x00f2fe,
      lineAlpha: isLight ? 0.22 : 0.28
    };
  }

  let themeColors = getThemeColors();

  // 1. Central AI Crystal Core (Icosahedron)
  const coreGeometry = new THREE.IcosahedronGeometry(36, 1);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: themeColors.core,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  mainGroup.add(coreMesh);

  // Inner solid core with glow
  const innerGeometry = new THREE.OctahedronGeometry(18, 0);
  const innerMaterial = new THREE.MeshBasicMaterial({
    color: themeColors.secondary,
    wireframe: true,
    transparent: true,
    opacity: 0.85
  });
  const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
  mainGroup.add(innerMesh);

  // 2. Outer Neural Network Particles & Dynamic Synaptic Lines
  const particleCount = 65;
  const maxDistance = 55;
  const particlesData = [];
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = [];

  const bounds = 80;

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * bounds * 2;
    const y = (Math.random() - 0.5) * bounds * 2;
    const z = (Math.random() - 0.5) * bounds * 2;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    particleVelocities.push({
      x: (Math.random() - 0.5) * 0.4,
      y: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.4
    });

    particlesData.push({
      velocity: particleVelocities[i]
    });
  }

  // Particle Points
  const pGeometry = new THREE.BufferGeometry();
  pGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  // Circular glowing particle texture
  function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(0,242,254,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  const pMaterial = new THREE.PointsMaterial({
    color: themeColors.primary,
    size: 5.5,
    map: createParticleTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(pGeometry, pMaterial);
  mainGroup.add(particleSystem);

  // Dynamic Synaptic Connection Lines
  const linePositions = new Float32Array(particleCount * particleCount * 6);
  const lineColors = new Float32Array(particleCount * particleCount * 6);

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMaterial = new THREE.LineSegmentsMaterial
    ? new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: themeColors.lineAlpha,
        blending: THREE.AdditiveBlending
      })
    : new THREE.LineBasicMaterial({
        color: themeColors.lineColor,
        transparent: true,
        opacity: themeColors.lineAlpha
      });

  const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  mainGroup.add(linesMesh);

  // 3. Floating Orbiting Tech Ring
  const ringGeometry = new THREE.TorusGeometry(62, 0.6, 8, 80);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: themeColors.secondary,
    transparent: true,
    opacity: 0.45
  });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  ringMesh.rotation.x = Math.PI / 3;
  mainGroup.add(ringMesh);

  // Mouse Interaction with Parallax Damping & Front Page Cursor Sensitivity
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  function onMouseMove(event) {
    // Global normalized cursor coordinates
    const nx = (event.clientX / window.innerWidth - 0.5) * 2;
    const ny = -(event.clientY / window.innerHeight - 0.5) * 2;

    const rect = container.getBoundingClientRect();
    const isNearHero = event.clientY >= rect.top - 250 && event.clientY <= rect.bottom + 250;

    if (isNearHero) {
      mouseX = nx * 1.6;
      mouseY = ny * 1.6;
    } else {
      mouseX = nx * 0.5;
      mouseY = ny * 0.5;
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Update theme colors when user toggles dark/light mode
  window.updateThreeTheme = function () {
    themeColors = getThemeColors();
    coreMaterial.color.setHex(themeColors.core);
    innerMaterial.color.setHex(themeColors.secondary);
    pMaterial.color.setHex(themeColors.primary);
    ringMaterial.color.setHex(themeColors.secondary);
    lineMaterial.opacity = themeColors.lineAlpha;
  };

  // Resize handler
  function onResize() {
    if (!container) return;
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }
  window.addEventListener('resize', onResize);

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Constant rotation of core elements
    coreMesh.rotation.x += 0.005;
    coreMesh.rotation.y += 0.008;

    innerMesh.rotation.x -= 0.01;
    innerMesh.rotation.y -= 0.012;

    ringMesh.rotation.z += 0.004;
    ringMesh.rotation.y += 0.002;

    // Interactive mouse damping
    targetRotationY += (mouseX * 0.8 - targetRotationY) * 0.05;
    targetRotationX += (mouseY * 0.8 - targetRotationX) * 0.05;

    mainGroup.rotation.y = targetRotationY + clock.getElapsedTime() * 0.15;
    mainGroup.rotation.x = targetRotationX;

    // Update particle positions and synaptic connections
    const pos = pGeometry.attributes.position.array;
    let lineIndex = 0;
    let colorIndex = 0;

    for (let i = 0; i < particleCount; i++) {
      // Move particle
      pos[i * 3] += particleVelocities[i].x;
      pos[i * 3 + 1] += particleVelocities[i].y;
      pos[i * 3 + 2] += particleVelocities[i].z;

      // Bounce within bounds
      if (Math.abs(pos[i * 3]) > bounds) particleVelocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > bounds) particleVelocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > bounds) particleVelocities[i].z *= -1;

      // Check distance with other particles for synaptic connection
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          const alpha = 1.0 - dist / maxDistance;

          linePositions[lineIndex++] = pos[i * 3];
          linePositions[lineIndex++] = pos[i * 3 + 1];
          linePositions[lineIndex++] = pos[i * 3 + 2];

          linePositions[lineIndex++] = pos[j * 3];
          linePositions[lineIndex++] = pos[j * 3 + 1];
          linePositions[lineIndex++] = pos[j * 3 + 2];

          // Colors
          lineColors[colorIndex++] = 0.0;
          lineColors[colorIndex++] = 0.95 * alpha;
          lineColors[colorIndex++] = 1.0 * alpha;

          lineColors[colorIndex++] = 0.65 * alpha;
          lineColors[colorIndex++] = 0.35 * alpha;
          lineColors[colorIndex++] = 1.0 * alpha;
        }
      }
    }

    pGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineIndex / 3);

    renderer.render(scene, camera);
  }

  animate();
})();
