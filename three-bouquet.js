const canvas = document.getElementById('bouquetCanvas');
const overlay = document.getElementById('openingOverlay');

function runCanvasFallback() {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let alive = true;
  const petals = Array.from({ length: 80 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 4 + Math.random() * 8,
    speed: 0.00025 + Math.random() * 0.00055,
    sway: Math.random() * Math.PI * 2,
    color: Math.random() > 0.5 ? 'rgba(235, 200, 220, 0.65)' : 'rgba(206, 226, 248, 0.6)'
  }));

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * Math.min(window.devicePixelRatio || 1, 2)));
    canvas.height = Math.max(1, Math.floor(rect.height * Math.min(window.devicePixelRatio || 1, 2)));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(canvas.width / rect.width, canvas.height / rect.height);
  }

  function drawGlow(rect, t) {
    const cx = rect.width * 0.5;
    const cy = rect.height * 0.64;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const pulse = 0.5 + Math.sin(t * 1.6) * 0.08;
    const r1 = Math.min(rect.width * 0.18, 170) * pulse;
    const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r1);
    g1.addColorStop(0, 'rgba(255, 234, 196, 0.25)');
    g1.addColorStop(1, 'rgba(255, 234, 196, 0)');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.arc(cx, cy, r1, 0, Math.PI * 2);
    ctx.fill();

    const r2 = Math.min(rect.width * 0.12, 120) * (1.04 - pulse * 0.2);
    const g2 = ctx.createRadialGradient(cx + 20, cy - 12, 0, cx + 20, cy - 12, r2);
    g2.addColorStop(0, 'rgba(196, 225, 255, 0.28)');
    g2.addColorStop(1, 'rgba(196, 225, 255, 0)');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(cx + 20, cy - 12, r2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  const started = performance.now();
  function animate(now) {
    if (!alive) return;
    const rect = canvas.getBoundingClientRect();
    const t = (now - started) * 0.001;

    ctx.clearRect(0, 0, rect.width, rect.height);

    petals.forEach((p) => {
      p.y += p.speed * (0.5 + p.size * 0.06);
      if (p.y > 1.1) {
        p.y = -0.05;
        p.x = Math.random();
      }

      const px = p.x * rect.width + Math.sin(t + p.sway) * 20;
      const py = p.y * rect.height;
      const rot = Math.sin(t * 1.4 + p.sway) * 0.8;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    drawGlow(rect, t);
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(animate);

  window.addEventListener('openingOverlayClosed', () => {
    alive = false;
    window.removeEventListener('resize', resize);
  }, { once: true });
}

if (!canvas || !overlay || !window.WebGLRenderingContext || !window.THREE) {
  runCanvasFallback();
} else {
  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.5, 8);

  const ambient = new THREE.AmbientLight(0xfff6ea, 1.4);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xfff1dd, 1.2);
  key.position.set(2.8, 3.5, 4);
  scene.add(key);

  const coolFill = new THREE.PointLight(0xc7e2ff, 1.2, 20);
  coolFill.position.set(-2, 2.2, 2.5);
  scene.add(coolFill);

  const group = new THREE.Group();
  scene.add(group);

  const flowerMatA = new THREE.MeshStandardMaterial({ color: 0xf5d7e6, roughness: 0.6, metalness: 0.08 });
  const flowerMatB = new THREE.MeshStandardMaterial({ color: 0xd8ecff, roughness: 0.58, metalness: 0.06 });
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x87b77b, roughness: 0.78, metalness: 0.02 });

  const flowers = [];
  function addFlower(x, z, scale, colorType) {
    const flower = new THREE.Group();

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025 * scale, 0.04 * scale, 1.8 * scale, 10), stemMat);
    stem.position.y = -0.65 * scale;
    flower.add(stem);

    const petalMat = colorType === 'cool' ? flowerMatB : flowerMatA;
    const petalGeo = new THREE.SphereGeometry(0.19 * scale, 16, 16);
    for (let i = 0; i < 5; i += 1) {
      const p = new THREE.Mesh(petalGeo, petalMat);
      const angle = (i / 5) * Math.PI * 2;
      p.position.set(Math.cos(angle) * 0.2 * scale, 0.35 * scale, Math.sin(angle) * 0.2 * scale);
      flower.add(p);
    }

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.09 * scale, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xf1d5a7, roughness: 0.35, metalness: 0.12 })
    );
    core.position.y = 0.35 * scale;
    flower.add(core);

    flower.position.set(x, 0, z);
    flower.scale.set(0.01, 0.01, 0.01);
    group.add(flower);
    flowers.push(flower);
  }

  addFlower(-1.4, -0.2, 1.05, 'warm');
  addFlower(-0.8, 0.12, 1.0, 'cool');
  addFlower(-0.2, -0.15, 1.08, 'warm');
  addFlower(0.4, 0.07, 0.98, 'cool');
  addFlower(1.0, -0.1, 1.12, 'warm');
  addFlower(1.6, 0.14, 0.92, 'cool');

  const charm = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.1, 0.25),
    new THREE.MeshStandardMaterial({ color: 0xf4ecdf, roughness: 0.62, metalness: 0.06 })
  );
  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.18, 22),
    new THREE.MeshStandardMaterial({ color: 0xbdd9f2, roughness: 0.34, metalness: 0.28 })
  );
  lens.rotation.x = Math.PI / 2;
  lens.position.x = -0.22;

  const button = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.06, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x8c6a51, roughness: 0.5 })
  );
  button.position.set(0.58, 0.44, 0.05);

  charm.add(body);
  charm.add(lens);
  charm.add(button);
  charm.position.set(0, -1.45, 0);
  group.add(charm);

  const petalGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const petalMat = new THREE.MeshStandardMaterial({ color: 0xecc7da, roughness: 0.72 });
  const petalCloud = new THREE.Group();
  const petalNodes = [];

  for (let i = 0; i < 160; i += 1) {
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.position.set((Math.random() - 0.5) * 9, Math.random() * 5 - 1.4, (Math.random() - 0.5) * 5);
    petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    petal.scale.setScalar(0.6 + Math.random() * 0.9);
    petalCloud.add(petal);
    petalNodes.push(petal);
  }
  scene.add(petalCloud);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  resize();
  window.addEventListener('resize', resize);

  let active = true;
  const start = performance.now();

  function animate(now) {
    if (!active) return;
    const t = (now - start) * 0.001;

    flowers.forEach((flower, i) => {
      const appear = Math.min(1, Math.max(0, (t - i * 0.18) / 1.2));
      const ease = 1 - ((1 - appear) ** 3);
      const s = 0.01 + ease * 0.99;
      flower.scale.set(s, s, s);
      flower.rotation.y = Math.sin(t * 0.6 + i * 0.55) * 0.14;
      flower.position.y = Math.sin(t * 1.3 + i * 0.4) * 0.07;
    });

    charm.rotation.y = Math.sin(t * 0.85) * 0.18;
    charm.position.y = -1.45 + Math.sin(t * 1.1) * 0.06;

    petalNodes.forEach((petal, i) => {
      petal.position.y -= 0.012 + (i % 3) * 0.003;
      petal.position.x += Math.sin(t + i) * 0.0024;
      if (petal.position.y < -2.3) {
        petal.position.y = 3.2;
      }
    });

    group.rotation.y = Math.sin(t * 0.28) * 0.16;
    camera.position.x = Math.sin(t * 0.2) * 0.34;
    camera.lookAt(0, -0.1, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  function dispose() {
    active = false;
    window.removeEventListener('resize', resize);

    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => mat.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });

    renderer.dispose();
  }

  window.addEventListener('openingOverlayClosed', () => {
    window.setTimeout(dispose, 720);
  }, { once: true });
}
