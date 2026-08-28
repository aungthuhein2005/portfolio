class ThreeBackground {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.animationFrame = null;
    this.isVisible = true;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
    this.createParticles();
    this.render();

    if (!this.prefersReducedMotion) {
      this.observeVisibility();
      this.start();
    }
  }

  init() {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    this.container.appendChild(this.renderer.domElement);
    this.camera.position.z = 5;
    this.onResize();

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.container);
  }

  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 2000; i += 1) {
      vertices.push(
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000
      );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      size: 2,
      color: 0x2563eb,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  observeVisibility() {
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.isVisible = entry.isIntersecting;
      if (this.isVisible) this.start();
      else this.stop();
    }, { rootMargin: '100px' });

    this.intersectionObserver.observe(this.container);
  }

  start() {
    if (this.animationFrame || !this.isVisible) return;
    this.animate();
  }

  stop() {
    if (!this.animationFrame) return;
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
  }

  animate() {
    if (!this.isVisible) {
      this.animationFrame = null;
      return;
    }

    this.particles.rotation.x += 0.0001;
    this.particles.rotation.y += 0.0001;
    this.render();
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.render();
  }
}
