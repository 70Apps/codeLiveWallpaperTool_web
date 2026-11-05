/* 3D Device Mockup Generator — three.js, 7 devices, 1024×1024 PNG export */
(function () {
  'use strict';

  // ----------------------------------------------------------------------------
  // Data
  // ----------------------------------------------------------------------------
  const DEVICES = [
    {
      id: 'iphone-duo-inner',
      label: 'iPhone Duo Inner',
      kind: 'phone',
      screen: [1878, 2670],
      worldHeight: 2.55,
      bezelRatio: 0.032,
      cornerRatio: 0.11,
      screenCornerRatio: 0.10,
      thicknessRatio: 0.042,
      finish: 'titanium',
      colors: [
        ['Space Black', '#2b2b30'],
        ['Natural Titanium', '#a39e96'],
        ['Starlight', '#e7dfd3']
      ],
      note: 'Duo inner portrait preset (1878 × 2670), reused from wallpaper-iphone-duo-collage.'
    },
    {
      id: 'iphone-duo-outer',
      label: 'iPhone Duo Outer',
      kind: 'phone',
      screen: [1398, 2034],
      worldHeight: 2.55,
      bezelRatio: 0.034,
      cornerRatio: 0.11,
      screenCornerRatio: 0.10,
      thicknessRatio: 0.042,
      finish: 'titanium',
      colors: [
        ['Space Black', '#2b2b30'],
        ['Natural Titanium', '#a39e96'],
        ['Starlight', '#e7dfd3']
      ],
      asymmetricCorners: true,
      island: 'punch',
      note: 'Duo outer preset (1398 × 2034): straight hinge-side (left) edge with 0.2R left corners, full R on the right, and a top-right front-camera punch hole.'
    },
    {
      id: 'iphone-18-pro-max',
      label: 'iPhone (Latest)',
      kind: 'phone',
      screen: [1320, 2868],
      worldHeight: 2.6,
      bezelRatio: 0.028,
      cornerRatio: 0.12,
      screenCornerRatio: 0.105,
      thicknessRatio: 0.040,
      finish: 'titanium',
      colors: [
        ['Space Black', '#2b2b30'],
        ['Natural Titanium', '#b3ada3'],
        ['Desert Titanium', '#c2a181'],
        ['Cosmic Orange', '#e46b32'],
        ['Silver', '#d6d7d9']
      ],
      island: 'center',
      note: 'Latest iPhone (assumed 6.9-inch panel at 1320 × 2868); centered Dynamic Island; finish names follow the current Pro palette.'
    },
    {
      id: 'ipad-pro-latest',
      label: 'iPad Pro (Latest)',
      kind: 'tablet',
      screen: [2064, 2752],
      worldHeight: 2.7,
      bezelRatio: 0.020,
      cornerRatio: 0.10,
      screenCornerRatio: 0.085,
      thicknessRatio: 0.025,
      finish: 'aluminum',
      colors: [
        ['Space Black', '#2c2c2e'],
        ['Silver', '#d8d8da']
      ],
      note: 'Assumed latest iPad Pro 13-inch, 2064 × 2752 portrait.'
    },
    {
      id: 'mac',
      label: 'Mac',
      kind: 'desktop',
      screen: [4480, 2520],
      worldHeight: 1.9,
      finish: 'aluminum',
      colors: [
        ['Blue', '#7fb5e3'],
        ['Purple', '#a48fce'],
        ['Pink', '#e6a3b5'],
        ['Orange', '#e9a06b'],
        ['Yellow', '#e8cf6f'],
        ['Green', '#9fc99b'],
        ['Silver', '#d5d6d8']
      ],
      note: 'Assumed iMac 24-inch 4.5K display, 4480 × 2520.'
    },
    {
      id: 'macbook-pro',
      label: 'MacBook Pro',
      kind: 'laptop',
      screen: [3456, 2234],
      worldHeight: 2.05,
      finish: 'aluminum',
      colors: [
        ['Space Black', '#2e2e30'],
        ['Silver', '#d6d7d9']
      ],
      note: 'Assumed 16-inch MacBook Pro panel, 3456 × 2234.'
    },
    {
      id: 'apple-watch',
      label: 'Apple Watch',
      kind: 'watch',
      screen: [416, 496],
      worldHeight: 1.7,
      finish: 'ceramic',
      colors: [
        ['Midnight', '#1f1f24'],
        ['Starlight', '#e3d9cc'],
        ['Silver', '#d6d7d9'],
        ['Rose Gold', '#d8a79c']
      ],
      note: 'Assumed Apple Watch Series 11 46mm display, 416 × 496.'
    }
  ];

  const BACKGROUNDS = [
    { name: 'Transparent', type: 'transparent' },
    { name: 'Black', type: 'solid', value: '#000000' },
    { name: 'Graphite', type: 'solid', value: '#1c1c1e' },
    { name: 'Charcoal', type: 'solid', value: '#2b2b2f' },
    { name: 'Slate', type: 'solid', value: '#4a4a50' },
    { name: 'Mid Gray', type: 'solid', value: '#7c7c82' },
    { name: 'Silver', type: 'solid', value: '#b9b9be' },
    { name: 'White', type: 'solid', value: '#f4f4f6' },
    { name: 'Aurora', type: 'gradient', from: '#667eea', to: '#764ba2', deg: 135 },
    { name: 'Sunset', type: 'gradient', from: '#ff7e5f', to: '#feb47b', deg: 165 },
    { name: 'Mint', type: 'gradient', from: '#43e97b', to: '#38f9d7', deg: 135 },
    { name: 'Coral', type: 'gradient', from: '#fa709a', to: '#fee140', deg: 120 },
    { name: 'Midnight', type: 'gradient', from: '#141e30', to: '#243b55', deg: 180 },
    { name: 'Mesh', type: 'gradient', from: '#8ec5fc', to: '#e0c3fc', deg: 135 },
    { name: 'Noir', type: 'gradient', from: '#232526', to: '#414345', deg: 160 },
    { name: 'Sand', type: 'gradient', from: '#e6c9a8', to: '#b08968', deg: 120 },
    { name: 'Ocean', type: 'gradient', from: '#2193b0', to: '#6dd5ed', deg: 135 },
    { name: 'Forest', type: 'gradient', from: '#134e5e', to: '#71b280', deg: 145 },
    { name: 'Lilac', type: 'gradient', from: '#b6a6e8', to: '#efe3ff', deg: 130 },
    { name: 'Ember', type: 'gradient', from: '#f12711', to: '#f5af19', deg: 120 },
    { name: 'Ice', type: 'gradient', from: '#83a4d4', to: '#b6fbff', deg: 160 },
    { name: 'Rose', type: 'gradient', from: '#ee9ca7', to: '#ffdde1', deg: 140 },
    { name: 'Dusk', type: 'gradient', from: '#355c7d', to: '#c06c84', deg: 135 },
    { name: 'Moss', type: 'gradient', from: '#606c38', to: '#dda15e', deg: 150 }
  ];

  const FINISHES = {
    titanium: { metalness: 0.72, roughness: 0.30, clearcoat: 0.35, clearcoatRoughness: 0.30 },
    aluminum: { metalness: 0.88, roughness: 0.34, clearcoat: 0.16, clearcoatRoughness: 0.25 },
    ceramic: { metalness: 0.40, roughness: 0.30, clearcoat: 0.65, clearcoatRoughness: 0.22 }
  };

  const YAW_LIMIT = 0.68;   // ≈ 39°
  const PITCH_LIMIT = 0.38; // ≈ 22°
  const ZOOM_MIN = 0.72;
  const ZOOM_MAX = 1.60;
  const EXPORT_SIZE = 1024;

  const EXPORT_FORMATS = {
    png: { label: 'PNG', mime: 'image/png', ext: 'png' },
    jpeg: { label: 'JPEG', mime: 'image/jpeg', ext: 'jpg' },
    webp: { label: 'WebP', mime: 'image/webp', ext: 'webp' }
  };
  const QUALITY_MIN = 0.10;
  const QUALITY_MAX = 1.00;
  const QUALITY_DEFAULT = 0.92;
  const PREFS_KEY = 'mockup-studio:v2';
  const LEGACY_PREFS_KEY = 'mockup-studio:v1';

  // ----------------------------------------------------------------------------
  // State
  // ----------------------------------------------------------------------------
  const STATE = {
    deviceIndex: 0,
    yaw: 0,
    pitch: 0,
    zoom: 1,
    colors: DEVICES.map(function () { return 0; }),
    background: 0,
    format: 'png',
    quality: QUALITY_DEFAULT,
    hasImage: false
  };

  let stage, renderer, scene, camera, pivot, deviceRoot, shadowMesh;
  let baseDist = 6;
  let bodyRadius = 1.5;
  let bodyMats = [];
  let busy = false;

  const screenTextures = {};
  const bgTextures = {};
  let glareTexture = null;
  let envTexture = null;
  let shadowTexture = null;
  let deckTexture = null;

  // ----------------------------------------------------------------------------
  // Small helpers
  // ----------------------------------------------------------------------------
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function tick() { return new Promise(function (r) { setTimeout(r, 0); }); }

  // ----------------------------------------------------------------------------
  // Preferences (localStorage)
  // ----------------------------------------------------------------------------
  function savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({
        v: 2,
        deviceIndex: STATE.deviceIndex,
        colors: STATE.colors,
        background: STATE.background,
        format: STATE.format,
        quality: STATE.quality
      }));
    } catch (err) {
      // Storage may be unavailable (private mode / quota); the tool still works.
    }
  }

  function readPrefs(key) {
    let raw = null;
    try {
      raw = localStorage.getItem(key);
    } catch (err) {
      return null;
    }
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (data && typeof data === 'object' && !Array.isArray(data)) return data;
    } catch (err) {
      // fall through to cleanup
    }
    try { localStorage.removeItem(key); } catch (err) {}
    return null;
  }

  function restorePrefs() {
    let data = readPrefs(PREFS_KEY);
    let legacy = false;
    if (!data) {
      data = readPrefs(LEGACY_PREFS_KEY);
      legacy = !!data;
    }
    if (!data) return;

    if (Number.isInteger(data.deviceIndex) && data.deviceIndex >= 0 && data.deviceIndex < DEVICES.length) {
      STATE.deviceIndex = data.deviceIndex;
    }
    // v1 stored backgrounds without the leading Transparent entry.
    const bgIndex = legacy && Number.isInteger(data.background) ? data.background + 1 : data.background;
    if (Number.isInteger(bgIndex) && bgIndex >= 0 && bgIndex < BACKGROUNDS.length) {
      STATE.background = bgIndex;
    }
    if (Array.isArray(data.colors)) {
      DEVICES.forEach(function (device, index) {
        const value = data.colors[index];
        if (Number.isInteger(value) && value >= 0 && value < device.colors.length) {
          STATE.colors[index] = value;
        }
      });
    }
    if (typeof data.format === 'string' && Object.prototype.hasOwnProperty.call(EXPORT_FORMATS, data.format)) {
      STATE.format = data.format;
    }
    if (typeof data.quality === 'number' && isFinite(data.quality)) {
      STATE.quality = clamp(Math.round(data.quality * 100) / 100, QUALITY_MIN, QUALITY_MAX);
    }

    if (legacy) {
      try { localStorage.removeItem(LEGACY_PREFS_KEY); } catch (err) {}
      savePrefs();
    }
  }

  function roundedRectShape(w, h, r) {
    const x = -w / 2;
    const y = -h / 2;
    const radius = Math.min(r, w / 2, h / 2);
    const s = new THREE.Shape();
    s.moveTo(x + radius, y);
    s.lineTo(x + w - radius, y);
    s.absarc(x + w - radius, y + radius, radius, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - radius);
    s.absarc(x + w - radius, y + h - radius, radius, 0, Math.PI / 2, false);
    s.lineTo(x + radius, y + h);
    s.absarc(x + radius, y + h - radius, radius, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + radius);
    s.absarc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);
    s.closePath();
    return s;
  }

  // Asymmetric rounded rectangle: per-corner radii { tl, tr, br, bl }.
  function roundedRectShapeCorners(w, h, radii) {
    const x = -w / 2;
    const y = -h / 2;
    const limit = Math.min(w / 2, h / 2);
    const tl = clamp(radii.tl, 0, limit);
    const tr = clamp(radii.tr, 0, limit);
    const br = clamp(radii.br, 0, limit);
    const bl = clamp(radii.bl, 0, limit);

    const s = new THREE.Shape();
    s.moveTo(x + bl, y);
    s.lineTo(x + w - br, y);
    if (br > 0.0005) s.absarc(x + w - br, y + br, br, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - tr);
    if (tr > 0.0005) s.absarc(x + w - tr, y + h - tr, tr, 0, Math.PI / 2, false);
    s.lineTo(x + tl, y + h);
    if (tl > 0.0005) s.absarc(x + tl, y + h - tl, tl, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + bl);
    if (bl > 0.0005) s.absarc(x + bl, y + bl, bl, Math.PI, Math.PI * 1.5, false);
    s.closePath();
    return s;
  }

  function shapeGeometry(w, h, r) {
    const geo = new THREE.ShapeGeometry(roundedRectShape(w, h, r), 24);
    const pos = geo.attributes.position;
    let uv = geo.attributes.uv;
    if (!uv) {
      uv = new THREE.Float32BufferAttribute(new Float32Array(pos.count * 2), 2);
      geo.setAttribute('uv', uv);
    }
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
    }
    uv.needsUpdate = true;
    return geo;
  }

  function shapeGeometryCorners(w, h, radii) {
    const geo = new THREE.ShapeGeometry(roundedRectShapeCorners(w, h, radii), 24);
    const pos = geo.attributes.position;
    let uv = geo.attributes.uv;
    if (!uv) {
      uv = new THREE.Float32BufferAttribute(new Float32Array(pos.count * 2), 2);
      geo.setAttribute('uv', uv);
    }
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
    }
    uv.needsUpdate = true;
    return geo;
  }

  function addShapePlane(parent, w, h, r, z, material) {
    const mesh = new THREE.Mesh(shapeGeometry(w, h, r), material);
    mesh.position.z = z;
    parent.add(mesh);
    return mesh;
  }

  function addShapePlaneCorners(parent, w, h, radii, z, material) {
    const mesh = new THREE.Mesh(shapeGeometryCorners(w, h, radii), material);
    mesh.position.z = z;
    parent.add(mesh);
    return mesh;
  }

  function addSlab(parent, w, h, depth, radius, material) {
    const bevel = Math.min(depth * 0.42, radius * 0.45, 0.055);
    const shape = roundedRectShape(
      Math.max(w - bevel * 2, 0.01),
      Math.max(h - bevel * 2, 0.01),
      Math.max(radius - bevel, 0.01)
    );
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(depth - bevel * 2, 0.01),
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: 20
    });
    geo.center();
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // Extruded slab with per-corner radii. bevelMax keeps a nearly-square corner
  // from being rounded out by the bevel (used by the Duo outer hinge side).
  function addSlabCorners(parent, w, h, depth, radii, material, bevelMax) {
    const maxRadius = Math.max(radii.tl, radii.tr, radii.br, radii.bl);
    const bevel = Math.min(depth * 0.42, maxRadius * 0.45, bevelMax || 0.055);
    const shape = roundedRectShapeCorners(
      Math.max(w - bevel * 2, 0.01),
      Math.max(h - bevel * 2, 0.01),
      {
        tl: Math.max(radii.tl - bevel, 0.0005),
        tr: Math.max(radii.tr - bevel, 0.0005),
        br: Math.max(radii.br - bevel, 0.0005),
        bl: Math.max(radii.bl - bevel, 0.0005)
      }
    );
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(depth - bevel * 2, 0.01),
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: 20
    });
    geo.center();
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function bodyMaterial(hex, finish) {
    const f = FINISHES[finish] || FINISHES.titanium;
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(hex),
      metalness: f.metalness,
      roughness: f.roughness,
      clearcoat: f.clearcoat,
      clearcoatRoughness: f.clearcoatRoughness,
      envMapIntensity: 1.15
    });
    bodyMats.push(mat);
    return mat;
  }

  function darkMaterial(hex) {
    return new THREE.MeshStandardMaterial({
      color: hex,
      metalness: 0.35,
      roughness: 0.45
    });
  }

  // ----------------------------------------------------------------------------
  // Generated textures
  // ----------------------------------------------------------------------------
  function makeScreenTexture(device, img, seed) {
    const aspect = device.screen[0] / device.screen[1];
    const W = 1024;
    const H = Math.round(W / aspect);
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    if (img && img.width && img.height) {
      const ir = img.width / img.height;
      const tr = W / H;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (ir > tr) {
        sh = img.height;
        sw = Math.round(sh * tr);
        sx = Math.round((img.width - sw) / 2);
      } else {
        sw = img.width;
        sh = Math.round(sw / tr);
        sy = Math.round((img.height - sh) / 2);
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    } else {
      const palettes = [
        ['#5b21b6', '#06b6d4', '#1e1b4b'],
        ['#0f172a', '#7c3aed', '#312e81'],
        ['#831843', '#f59e0b', '#4c1d95'],
        ['#064e3b', '#22d3ee', '#0f172a'],
        ['#7f1d1d', '#f472b6', '#1e1b4b'],
        ['#1e3a8a', '#34d399', '#0f172a'],
        ['#3f3f46', '#a78bfa', '#111827']
      ];
      const p = palettes[seed % palettes.length];
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, p[0]);
      g.addColorStop(0.55, p[1]);
      g.addColorStop(1, p[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(W * 0.28, H * 0.22, 0, W * 0.28, H * 0.22, Math.max(W, H) * 0.7);
      glow.addColorStop(0, 'rgba(255,255,255,0.34)');
      glow.addColorStop(0.5, 'rgba(255,255,255,0.05)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(W * 0.8, H * 0.35, Math.min(W, H) * (0.12 + i * 0.09), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return tex;
  }

  function makeGlareTexture() {
    const W = 512;
    const H = 512;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    const stripe = ctx.createLinearGradient(0, 0, W * 0.85, H);
    stripe.addColorStop(0.18, 'rgba(255,255,255,0)');
    stripe.addColorStop(0.38, 'rgba(255,255,255,0.34)');
    stripe.addColorStop(0.50, 'rgba(255,255,255,0.06)');
    stripe.addColorStop(0.62, 'rgba(255,255,255,0)');
    ctx.fillStyle = stripe;
    ctx.fillRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(W * 0.22, H * 0.16, 0, W * 0.22, H * 0.16, W * 0.48);
    glow.addColorStop(0, 'rgba(255,255,255,0.28)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeEnvTexture() {
    const W = 1024;
    const H = 512;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    const base = ctx.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, '#8f949d');
    base.addColorStop(0.45, '#3a3d44');
    base.addColorStop(1, '#101114');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);

    function softbox(x, y, rx, ry) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
      g.addColorStop(0, 'rgba(255,255,255,0.85)');
      g.addColorStop(0.45, 'rgba(255,255,255,0.25)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
      ctx.translate(-x, -y);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(rx, ry), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    softbox(230, 110, 190, 90);
    softbox(780, 90, 150, 70);
    softbox(510, 300, 260, 120);

    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeBackgroundTexture(bg) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const rad = (bg.deg || 180) * Math.PI / 180;
    const dx = Math.sin(rad);
    const dy = -Math.cos(rad);
    const len = size * 1.45;
    const cx = size / 2;
    const cy = size / 2;
    const x0 = cx - dx * len / 2;
    const y0 = cy - dy * len / 2;
    const x1 = cx + dx * len / 2;
    const y1 = cy + dy * len / 2;

    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, bg.from);
    g.addColorStop(1, bg.to);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeShadowTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(0,0,0,0.55)');
    g.addColorStop(0.55, 'rgba(0,0,0,0.22)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeDeckTexture() {
    const W = 1024;
    const H = 560;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1b1b1f';
    ctx.fillRect(0, 0, W, H);

    const cols = 14;
    const rows = 5;
    const padX = 48;
    const keyGap = 8;
    const keyW = (W - padX * 2 - keyGap * (cols - 1)) / cols;
    const keyH = 52;
    ctx.fillStyle = '#313136';
    for (let r = 0; r < rows; r++) {
      const y = 34 + r * (keyH + keyGap);
      for (let c = 0; c < cols; c++) {
        const x = padX + c * (keyW + keyGap);
        ctx.beginPath();
        ctx.roundRect(x, y, keyW, keyH, 5);
        ctx.fill();
      }
    }

    // Space bar row hint
    ctx.fillStyle = '#2a2a2f';
    ctx.beginPath();
    ctx.roundRect(W * 0.28, 34 + rows * (keyH + keyGap), W * 0.44, keyH, 5);
    ctx.fill();

    // Trackpad
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(W * 0.33, H * 0.74, W * 0.34, H * 0.20, 10);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return tex;
  }

  // ----------------------------------------------------------------------------
  // Device builders
  // ----------------------------------------------------------------------------
  function addScreen(parent, w, h, r, z, texture, radii) {
    const screenMat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
    const screenGeo = radii ? shapeGeometryCorners(w, h, radii) : shapeGeometry(w, h, r);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = z;
    parent.add(screen);

    const glareMat = new THREE.MeshBasicMaterial({
      map: glareTexture,
      transparent: true,
      opacity: 0.52,
      depthWrite: false
    });
    const glareGeo = radii
      ? shapeGeometryCorners(w * 0.995, h * 0.995, radii)
      : shapeGeometry(w * 0.995, h * 0.995, r);
    const glare = new THREE.Mesh(glareGeo, glareMat);
    glare.position.z = z + 0.004;
    parent.add(glare);
    return screen;
  }

  // 3D Dynamic Island: a thin, pure-black extruded capsule lying on the glass.
  // align 'center' places it top-center. align 'punch' is the Duo outer's
  // single front camera: a small circular punch hole tucked into the top-right.
  function addDynamicIsland(parent, w, h, screenZ, align) {
    if (align === 'punch') {
      const diameter = w * 0.075;
      const punchR = diameter / 2;
      const marginTop = h * 0.045;
      const marginRight = w * 0.055;
      const cx = w / 2 - marginRight - punchR;
      const cy = h / 2 - marginTop - punchR;
      const punchDepth = Math.min(h * 0.0045, 0.016);
      const punch = new THREE.Mesh(
        new THREE.CylinderGeometry(punchR, punchR, punchDepth, 48),
        new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false })
      );
      punch.rotation.x = Math.PI / 2;
      punch.position.set(cx, cy, screenZ + 0.004 + punchDepth / 2);
      parent.add(punch);
      return;
    }

    const islandW = w * 0.30;
    const islandH = islandW / 3.4;
    const islandR = islandH / 2;
    const marginTop = h * 0.028;
    const cx = 0;
    const cy = h / 2 - marginTop - islandH / 2;
    const depth = Math.min(h * 0.0075, 0.026);

    const islandMat = new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false });
    const island = addSlabCorners(
      parent,
      islandW,
      islandH,
      depth,
      { tl: islandR, tr: islandR, br: islandR, bl: islandR },
      islandMat,
      Math.min(islandR * 0.4, 0.006)
    );
    island.position.set(cx, cy, screenZ + 0.005 + depth / 2);

    const dotR = islandH * 0.20;
    const dot = new THREE.Mesh(
      new THREE.CylinderGeometry(dotR, dotR, 0.006, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0x0b0b12,
        metalness: 0.45,
        roughness: 0.20,
        clearcoat: 0.9,
        clearcoatRoughness: 0.12
      })
    );
    dot.rotation.x = Math.PI / 2;
    dot.position.set(
      cx + islandW / 2 - islandH * 0.55,
      cy,
      screenZ + 0.005 + depth + 0.002
    );
    parent.add(dot);
  }

  function buildPhone(spec, colorHex) {
    const g = new THREE.Group();
    const H = spec.worldHeight;
    const W = H * (spec.screen[0] / spec.screen[1]);
    const bezel = H * spec.bezelRatio;
    const bodyW = W + bezel * 2;
    const bodyH = H + bezel * 2;
    const radius = Math.min(W, H) * spec.cornerRatio;
    const depth = H * spec.thicknessRatio;
    const sharp = H * 0.0025;
    const screenR = W * spec.screenCornerRatio;

    // Duo outer: hinge side (left) keeps its straight edge, but both left
    // corners get a small 0.2R relief; the two right corners keep the full R.
    const leftRatio = 0.2;
    const leftR = radius * leftRatio;
    const glassR = Math.max(radius - bezel * 0.25, 0.02);
    const bodyRadii = spec.asymmetricCorners
      ? { tl: leftR, bl: leftR, tr: radius, br: radius }
      : null;
    const glassRadii = spec.asymmetricCorners
      ? { tl: glassR * leftRatio, bl: glassR * leftRatio, tr: glassR, br: glassR }
      : null;
    const screenRadii = spec.asymmetricCorners
      ? { tl: screenR * leftRatio, bl: screenR * leftRatio, tr: screenR, br: screenR }
      : null;

    const mat = bodyMaterial(colorHex, spec.finish);
    if (bodyRadii) {
      addSlabCorners(g, bodyW, bodyH, depth, bodyRadii, mat, sharp * 0.6);
    } else {
      addSlab(g, bodyW, bodyH, depth, radius, mat);
    }

    const glassMat = darkMaterial(0x050507);
    if (glassRadii) {
      addShapePlaneCorners(g, bodyW - bezel * 0.55, bodyH - bezel * 0.55, glassRadii, depth / 2 + 0.002, glassMat);
    } else {
      addShapePlane(g, bodyW - bezel * 0.55, bodyH - bezel * 0.55, Math.max(radius - bezel * 0.25, 0.02), depth / 2 + 0.002, glassMat);
    }
    addScreen(g, W, H, screenR, depth / 2 + 0.007, screenTextures[spec.id], screenRadii);

    if (spec.island) {
      addDynamicIsland(g, W, H, depth / 2 + 0.007, spec.island);
    }

    // Side buttons
    const buttonMat = bodyMaterial(colorHex, spec.finish);
    const buttonH = H * 0.085;
    [
      { y: H * 0.22, len: buttonH },
      { y: H * 0.04, len: buttonH * 0.62 }
    ].forEach(function (b) {
      const geo = new THREE.BoxGeometry(0.018, b.len, depth * 0.42);
      const mesh = new THREE.Mesh(geo, buttonMat);
      mesh.position.set(bodyW / 2 + 0.004, b.y, 0);
      g.add(mesh);
    });

    // Camera bump on the back
    const bump = addSlab(g, 0.34, 0.34, 0.055, 0.09, mat);
    bump.position.set(-bodyW * 0.27, bodyH * 0.33, -depth / 2 - 0.022);
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.03, 24),
      darkMaterial(0x0a0a0c)
    );
    lens.rotation.x = Math.PI / 2;
    lens.position.set(-bodyW * 0.27 - 0.06, bodyH * 0.33 - 0.06, -depth / 2 - 0.058);
    g.add(lens);

    return g;
  }

  function buildTablet(spec, colorHex) {
    const g = new THREE.Group();
    const H = spec.worldHeight;
    const W = H * (spec.screen[0] / spec.screen[1]);
    const bezel = H * spec.bezelRatio;
    const bodyW = W + bezel * 2;
    const bodyH = H + bezel * 2;
    const radius = Math.min(W, H) * spec.cornerRatio;
    const depth = H * spec.thicknessRatio;

    const mat = bodyMaterial(colorHex, spec.finish);
    addSlab(g, bodyW, bodyH, depth, radius, mat);
    const glassMat = darkMaterial(0x050507);
    addShapePlane(g, bodyW - bezel * 0.5, bodyH - bezel * 0.5, Math.max(radius - bezel * 0.2, 0.02), depth / 2 + 0.002, glassMat);
    addScreen(g, W, H, W * spec.screenCornerRatio, depth / 2 + 0.007, screenTextures[spec.id]);

    return g;
  }

  function buildLaptop(spec, colorHex) {
    const g = new THREE.Group();
    const H = spec.worldHeight;
    const W = H * (spec.screen[0] / spec.screen[1]);
    const bezel = 0.048;
    const lidW = W + bezel * 2;
    const lidH = H + bezel * 2;
    const lidD = 0.072;

    const mat = bodyMaterial(colorHex, spec.finish);
    addSlab(g, lidW, lidH, lidD, 0.075, mat);

    const glassMat = darkMaterial(0x030304);
    addShapePlane(g, lidW - 0.012, lidH - 0.012, 0.062, lidD / 2 + 0.002, glassMat);
    addScreen(g, W, H, 0.022, lidD / 2 + 0.007, screenTextures[spec.id]);

    // Base / keyboard deck
    const baseW = lidW * 1.03;
    const baseD = 1.5;
    const baseT = 0.072;
    const base = addSlab(g, baseW, baseD, baseT, 0.055, mat);
    base.rotation.x = -Math.PI / 2;
    base.position.set(0, -lidH / 2 - baseT / 2, 0.26);

    const deck = new THREE.Mesh(
      new THREE.PlaneGeometry(baseW * 0.95, baseD * 0.88),
      new THREE.MeshBasicMaterial({ map: deckTexture, toneMapped: false })
    );
    deck.rotation.x = -Math.PI / 2;
    deck.position.set(0, -lidH / 2 + 0.003, 0.26);
    g.add(deck);

    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, lidW * 0.92, 20),
      darkMaterial(0x17171a)
    );
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(0, -lidH / 2 - baseT * 0.25, -0.26);
    g.add(hinge);

    return g;
  }

  function buildDesktop(spec, colorHex) {
    const g = new THREE.Group();
    const H = spec.worldHeight;
    const W = H * (spec.screen[0] / spec.screen[1]);
    const topBezel = 0.085;
    const chin = 0.22;
    const sideBezel = 0.055;
    const bodyW = W + sideBezel * 2;
    const bodyH = H + topBezel + chin;
    const depth = 0.085;

    const mat = bodyMaterial(colorHex, spec.finish);
    addSlab(g, bodyW, bodyH, depth, 0.075, mat);

    const yOffset = (chin - topBezel) / 2;
    const glassMat = darkMaterial(0x050507);
    addShapePlane(g, W + 0.13, H + 0.13, 0.025, depth / 2 + 0.002, glassMat).position.y = yOffset;
    addScreen(g, W, H, 0.018, depth / 2 + 0.007, screenTextures[spec.id]).position.y = yOffset;

    // Neck
    const neck = addSlab(g, 0.44, 0.7, 0.055, 0.045, mat);
    neck.position.set(0, -bodyH / 2 - 0.33, -0.12);

    // Oval foot
    const foot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.64, 0.038, 40),
      mat
    );
    foot.scale.set(1, 1, 0.62);
    foot.position.set(0, -bodyH / 2 - 0.69, -0.12);
    g.add(foot);

    return g;
  }

  function buildWatch(spec, colorHex) {
    const g = new THREE.Group();
    const H = spec.worldHeight;
    const W = H * (spec.screen[0] / spec.screen[1]);
    const bezel = 0.085;
    const bodyW = W + bezel * 2;
    const bodyH = H + bezel * 2;
    const depth = 0.20;
    const radius = Math.min(bodyW, bodyH) * 0.24;

    const mat = bodyMaterial(colorHex, spec.finish);
    addSlab(g, bodyW, bodyH, depth, radius, mat);

    // Straps
    const strapMat = bodyMaterial(colorHex, spec.finish);
    strapMat.roughness = 0.72;
    strapMat.metalness = 0.18;
    strapMat.clearcoat = 0.15;

    addSlab(g, bodyW * 0.62, 1.0, 0.075, 0.06, strapMat).position.set(0, bodyH / 2 + 0.42, -0.02);
    addSlab(g, bodyW * 0.62, 1.0, 0.075, 0.06, strapMat).position.set(0, -bodyH / 2 - 0.42, -0.02);

    const glassMat = darkMaterial(0x050507);
    addShapePlane(g, bodyW - 0.03, bodyH - 0.03, Math.max(radius - 0.01, 0.02), depth / 2 + 0.002, glassMat);
    addScreen(g, W, H, W * 0.22, depth / 2 + 0.007, screenTextures[spec.id]);

    // Digital crown + side button
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.09, 20),
      darkMaterial(0x3a3a3e)
    );
    crown.rotation.z = Math.PI / 2;
    crown.position.set(bodyW / 2 + 0.03, H * 0.18, 0.02);
    g.add(crown);

    const sideBtn = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, H * 0.18, depth * 0.32),
      darkMaterial(0x2c2c30)
    );
    sideBtn.position.set(bodyW / 2 + 0.004, -H * 0.08, 0);
    g.add(sideBtn);

    return g;
  }

  function buildDevice(spec, colorHex) {
    switch (spec.kind) {
      case 'tablet': return buildTablet(spec, colorHex);
      case 'laptop': return buildLaptop(spec, colorHex);
      case 'desktop': return buildDesktop(spec, colorHex);
      case 'watch': return buildWatch(spec, colorHex);
      default: return buildPhone(spec, colorHex);
    }
  }

  // ----------------------------------------------------------------------------
  // Scene lifecycle
  // ----------------------------------------------------------------------------
  function disposeDevice(root) {
    root.traverse(function (obj) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(function (m) { m.dispose(); });
      }
    });
  }

  function buildCurrentDevice() {
    if (deviceRoot) {
      pivot.remove(deviceRoot);
      disposeDevice(deviceRoot);
    }
    bodyMats = [];

    const spec = DEVICES[STATE.deviceIndex];
    const colorHex = spec.colors[STATE.colors[STATE.deviceIndex]][1];
    deviceRoot = buildDevice(spec, colorHex);
    pivot.add(deviceRoot);

    const box = new THREE.Box3().setFromObject(deviceRoot);
    const center = box.getCenter(new THREE.Vector3());
    deviceRoot.position.sub(center);

    const sphere = box.getBoundingSphere(new THREE.Sphere());
    bodyRadius = Math.max(sphere.radius, 0.6);

    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    baseDist = (bodyRadius / Math.sin(fovRad / 2)) * 1.12;

    if (shadowMesh) {
      shadowMesh.scale.set(bodyRadius * 1.65, bodyRadius * 0.52, 1);
      shadowMesh.position.set(0, (box.min.y - center.y) - 0.02, -bodyRadius * 0.9);
      shadowMesh.visible = true;
    }

    applyView();
  }

  function applyView() {
    if (!camera) return;
    const minDist = bodyRadius * 1.06 + 0.12;
    const dist = Math.max(baseDist / STATE.zoom, minDist);
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    camera.aspect = 1;
    camera.updateProjectionMatrix();

    if (pivot) {
      pivot.rotation.set(STATE.pitch, STATE.yaw, 0);
    }
    updateZoomReadout();
  }

  function updateZoomReadout() {
    const el = document.getElementById('zoom-readout');
    if (el) el.textContent = Math.round(STATE.zoom * 100) + '% zoom';
  }

  function configureBackground(index) {
    STATE.background = index;
    const bg = BACKGROUNDS[index];
    if (bg.type === 'transparent') {
      scene.background = null;
      renderer.setClearColor(0x000000, 0);
    } else if (bg.type === 'solid') {
      scene.background = new THREE.Color(bg.value);
      renderer.setClearColor(0x000000, 1);
    } else {
      if (!bgTextures[index]) bgTextures[index] = makeBackgroundTexture(bg);
      scene.background = bgTextures[index];
      renderer.setClearColor(0x000000, 1);
    }
  }

  function resizeStage() {
    if (!renderer || !stage) return;
    const size = Math.max(1, Math.floor(stage.clientWidth));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  function encodeExport(fmt, quality) {
    // JPEG has no alpha, so a transparent stage is flattened onto pure black.
    if (STATE.format === 'jpeg' && BACKGROUNDS[STATE.background].type === 'transparent') {
      const flat = document.createElement('canvas');
      flat.width = EXPORT_SIZE;
      flat.height = EXPORT_SIZE;
      const ctx = flat.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
      ctx.drawImage(renderer.domElement, 0, 0);
      return flat.toDataURL(fmt.mime);
    }
    return renderer.domElement.toDataURL(fmt.mime, quality);
  }

  function captureSquare() {
    renderer.setPixelRatio(1);
    renderer.setSize(EXPORT_SIZE, EXPORT_SIZE, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    const fmt = EXPORT_FORMATS[STATE.format] || EXPORT_FORMATS.png;
    const quality = STATE.format === 'webp' ? STATE.quality : undefined;
    const url = encodeExport(fmt, quality);
    resizeStage();
    renderer.render(scene, camera);
    return url;
  }

  // ----------------------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------------------
  function renderTabs() {
    const wrap = document.getElementById('device-tabs');
    wrap.innerHTML = '';
    DEVICES.forEach(function (device, index) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mockup-tab' + (index === STATE.deviceIndex ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', index === STATE.deviceIndex ? 'true' : 'false');
      btn.setAttribute('data-device', device.id);
      btn.textContent = device.label;
      btn.addEventListener('click', function () {
        if (busy || index === STATE.deviceIndex) return;
        selectDevice(index);
      });
      wrap.appendChild(btn);
    });
  }

  function updateTabs() {
    document.querySelectorAll('.mockup-tab').forEach(function (btn, index) {
      const active = index === STATE.deviceIndex;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    const badge = document.getElementById('stage-device-name');
    if (badge) badge.textContent = DEVICES[STATE.deviceIndex].label;
  }

  function renderColors() {
    const wrap = document.getElementById('color-list');
    const device = DEVICES[STATE.deviceIndex];
    wrap.innerHTML = '';
    device.colors.forEach(function (color, index) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-swatch' + (STATE.colors[STATE.deviceIndex] === index ? ' active' : '');
      btn.setAttribute('data-color-index', String(index));
      const dot = document.createElement('span');
      dot.className = 'color-dot';
      dot.style.background = color[1];
      const name = document.createElement('span');
      name.textContent = color[0];
      btn.appendChild(dot);
      btn.appendChild(name);
      btn.addEventListener('click', function () {
        if (busy) return;
        STATE.colors[STATE.deviceIndex] = index;
        bodyMats.forEach(function (mat) { mat.color.set(color[1]); });
        renderColors();
        savePrefs();
      });
      wrap.appendChild(btn);
    });
  }

  function renderBackgrounds() {
    const wrap = document.getElementById('bg-grid');
    wrap.innerHTML = '';
    BACKGROUNDS.forEach(function (bg, index) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bg-swatch' + (STATE.background === index ? ' active' : '');
      btn.setAttribute('data-bg-index', String(index));
      btn.title = bg.name;

      const chip = document.createElement('span');
      chip.className = 'bg-chip';
      if (bg.type === 'solid') {
        chip.style.background = bg.value;
      } else if (bg.type === 'transparent') {
        chip.classList.add('is-transparent');
      } else {
        chip.style.background = 'linear-gradient(' + bg.deg + 'deg, ' + bg.from + ', ' + bg.to + ')';
      }

      const name = document.createElement('span');
      name.className = 'bg-name';
      name.textContent = bg.name;

      btn.appendChild(chip);
      btn.appendChild(name);
      btn.addEventListener('click', function () {
        if (busy) return;
        configureBackground(index);
        document.querySelectorAll('.bg-swatch').forEach(function (el, i) {
          el.classList.toggle('active', i === index);
        });
        savePrefs();
      });
      wrap.appendChild(btn);
    });
  }

  function renderSpecs() {
    const wrap = document.getElementById('specs-list');
    wrap.innerHTML = '';
    DEVICES.forEach(function (device) {
      const item = document.createElement('div');
      item.innerHTML = '<b>' + device.label + '</b> — ' + device.screen[0] + ' × ' + device.screen[1] + '. ' + device.note;
      wrap.appendChild(item);
    });
  }

  function renderExportFormat() {
    document.querySelectorAll('.mockup-format-btn').forEach(function (btn) {
      const active = btn.getAttribute('data-format') === STATE.format;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const qualityGroup = document.getElementById('quality-group');
    if (qualityGroup) qualityGroup.hidden = STATE.format !== 'webp';
    const range = document.getElementById('quality-range');
    if (range) range.value = STATE.quality.toFixed(2);
    const value = document.getElementById('quality-value');
    if (value) value.textContent = STATE.quality.toFixed(2);
    const summary = document.getElementById('export-format-summary');
    if (summary) summary.textContent = EXPORT_FORMATS[STATE.format].label + ' · 1024 × 1024';
  }

  function setupExportOptions() {
    document.querySelectorAll('.mockup-format-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (busy) return;
        const format = btn.getAttribute('data-format');
        if (!EXPORT_FORMATS[format] || format === STATE.format) return;
        STATE.format = format;
        renderExportFormat();
        savePrefs();
      });
    });

    const range = document.getElementById('quality-range');
    range.addEventListener('input', function () {
      if (busy) {
        range.value = STATE.quality.toFixed(2);
        return;
      }
      STATE.quality = clamp(parseFloat(range.value) || QUALITY_DEFAULT, QUALITY_MIN, QUALITY_MAX);
      document.getElementById('quality-value').textContent = STATE.quality.toFixed(2);
      savePrefs();
    });
  }

  function selectDevice(index) {
    STATE.deviceIndex = index;
    STATE.yaw = 0;
    STATE.pitch = 0;
    STATE.zoom = 1;
    buildCurrentDevice();
    updateTabs();
    renderColors();
    savePrefs();
  }

  function setStatus(text, isBusy) {
    const el = document.getElementById('export-status');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('busy', !!isBusy);
  }

  function setBusy(value) {
    busy = value;
    document.getElementById('btn-export-current').disabled = value;
    document.getElementById('btn-export-zip').disabled = value;
  }

  // ----------------------------------------------------------------------------
  // Downloads / ZIP
  // ----------------------------------------------------------------------------
  function downloadURL(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  function dataURLToBytes(url) {
    return fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buffer) { return new Uint8Array(buffer); });
  }

  var crcTable = (function () {
    var t = [];
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(buf) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function buildZip(files) {
    var chunks = [];
    var central = [];
    var offset = 0;
    var enc = new TextEncoder();

    files.forEach(function (f) {
      var nameBytes = enc.encode(f.name);
      var crc = crc32(f.data);
      var size = f.data.length;

      var lh = new Uint8Array(30 + nameBytes.length);
      var dv = new DataView(lh.buffer);
      dv.setUint32(0, 0x04034b50, true);
      dv.setUint16(4, 20, true);
      dv.setUint16(6, 0x0800, true);
      dv.setUint16(8, 0, true);
      dv.setUint16(10, 0, true);
      dv.setUint16(12, 0, true);
      dv.setUint32(14, crc, true);
      dv.setUint32(18, size, true);
      dv.setUint32(22, size, true);
      dv.setUint16(26, nameBytes.length, true);
      dv.setUint16(28, 0, true);
      lh.set(nameBytes, 30);

      chunks.push(lh);
      chunks.push(f.data);

      var ch = new Uint8Array(46 + nameBytes.length);
      var cv = new DataView(ch.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, 0, true);
      cv.setUint16(14, 0, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, size, true);
      cv.setUint32(24, size, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      ch.set(nameBytes, 46);
      central.push(ch);

      offset += lh.length + f.data.length;
    });

    var cdSize = central.reduce(function (a, c) { return a + c.length; }, 0);
    var cdOffset = offset;

    var eo = new Uint8Array(22);
    var ev = new DataView(eo.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, cdOffset, true);
    ev.setUint16(20, 0, true);

    return new Blob(chunks.concat(central, [eo]), { type: 'application/zip' });
  }

  async function exportCurrent() {
    if (busy) return;
    setBusy(true);
    const fmt = EXPORT_FORMATS[STATE.format];
    setStatus('Rendering current view…', true);
    try {
      const url = captureSquare();
      downloadURL(url, DEVICES[STATE.deviceIndex].id + '-mockup.' + fmt.ext);
      const qualityNote = STATE.format === 'webp' ? ' · quality ' + STATE.quality.toFixed(2) : '';
      setStatus('Exported ' + DEVICES[STATE.deviceIndex].label + ' at 1024 × 1024 ' + fmt.label + qualityNote + '.', false);
    } catch (err) {
      console.error(err);
      setStatus('Export failed: ' + err.message, false);
    } finally {
      setBusy(false);
    }
  }

  async function exportZip() {
    if (busy) return;
    setBusy(true);
    const fmt = EXPORT_FORMATS[STATE.format];
    const quality = STATE.format === 'webp' ? STATE.quality : undefined;
    const original = {
      deviceIndex: STATE.deviceIndex,
      yaw: STATE.yaw,
      pitch: STATE.pitch,
      zoom: STATE.zoom
    };

    try {
      renderer.setPixelRatio(1);
      renderer.setSize(EXPORT_SIZE, EXPORT_SIZE, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();

      const files = [];
      for (let i = 0; i < DEVICES.length; i++) {
        STATE.deviceIndex = i;
        STATE.yaw = 0;
        STATE.pitch = 0;
        STATE.zoom = 1;
        buildCurrentDevice();
        pivot.rotation.set(0, 0, 0);
        camera.position.set(0, 0, baseDist);
        camera.lookAt(0, 0, 0);

        setStatus('Rendering ' + (i + 1) + ' / ' + DEVICES.length + ' · ' + DEVICES[i].label + '…', true);
        await tick();

        renderer.render(scene, camera);
        const url = encodeExport(fmt, quality);
        const bytes = await dataURLToBytes(url);
        files.push({ name: DEVICES[i].id + '.' + fmt.ext, data: bytes });
      }

      const blob = buildZip(files);
      downloadBlob(blob, 'apple-device-mockups-1024.zip');
      const qualityNote = STATE.format === 'webp' ? ' · quality ' + STATE.quality.toFixed(2) : '';
      setStatus('Exported 7 front-view mockups (1024 × 1024 each) as ' + fmt.label + qualityNote + ' in a ZIP.', false);
    } catch (err) {
      console.error(err);
      setStatus('ZIP export failed: ' + err.message, false);
    } finally {
      STATE.deviceIndex = original.deviceIndex;
      STATE.yaw = original.yaw;
      STATE.pitch = original.pitch;
      STATE.zoom = original.zoom;
      buildCurrentDevice();
      applyView();
      resizeStage();
      updateTabs();
      renderColors();
      setBusy(false);
    }
  }

  // ----------------------------------------------------------------------------
  // Upload
  // ----------------------------------------------------------------------------
  function applyImage(img, statusText) {
    STATE.hasImage = true;

    Object.keys(screenTextures).forEach(function (key) {
      screenTextures[key].dispose();
      delete screenTextures[key];
    });

    DEVICES.forEach(function (device, index) {
      screenTextures[device.id] = makeScreenTexture(device, img, index);
    });

    buildCurrentDevice();
    setStatus(statusText || 'Wallpaper applied to all seven devices.', false);
  }

  function handleFile(file) {
    if (!file || !file.type || file.type.indexOf('image/') !== 0) {
      alert('Please choose an image file (PNG, JPG, WebP, AVIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        applyImage(img, 'Loaded ' + file.name + ' — applied to all seven devices.');

        const thumb = document.getElementById('upload-thumb');
        const wrap = document.getElementById('upload-thumb-wrap');
        thumb.src = event.target.result;
        wrap.classList.add('loaded');

        document.getElementById('upload-status').textContent =
          file.name + ' · ' + img.naturalWidth + ' × ' + img.naturalHeight + ' px';
      };
      img.onerror = function () {
        alert('This image could not be loaded. Please try another file.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function setupUpload() {
    const area = document.getElementById('upload-area');
    const input = document.getElementById('mockup-file');

    area.addEventListener('click', function () { input.click(); });

    ['dragenter', 'dragover'].forEach(function (evt) {
      area.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        area.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(function (evt) {
      area.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        area.classList.remove('drag-over');
      });
    });

    area.addEventListener('drop', function (e) {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) handleFile(files[0]);
    });

    input.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
    });
  }

  // ----------------------------------------------------------------------------
  // Pointer controls
  // ----------------------------------------------------------------------------
  function setupControls() {
    const canvas = renderer.domElement;
    const pointers = new Map();
    let dragStart = null;
    let pinchStart = null;

    function pointerDistance() {
      const pts = Array.from(pointers.values());
      if (pts.length < 2) return 0;
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    canvas.addEventListener('pointerdown', function (e) {
      if (busy) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }

      if (pointers.size === 1) {
        dragStart = { x: e.clientX, y: e.clientY, yaw: STATE.yaw, pitch: STATE.pitch };
      } else if (pointers.size === 2) {
        dragStart = null;
        pinchStart = { dist: pointerDistance(), zoom: STATE.zoom };
      }
      e.preventDefault();
    });

    canvas.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2 && pinchStart) {
        const dist = pointerDistance();
        if (pinchStart.dist > 0 && dist > 0) {
          STATE.zoom = clamp(pinchStart.zoom * (dist / pinchStart.dist), ZOOM_MIN, ZOOM_MAX);
          applyView();
        }
      } else if (pointers.size === 1 && dragStart) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        STATE.yaw = clamp(dragStart.yaw + dx * 0.0085, -YAW_LIMIT, YAW_LIMIT);
        STATE.pitch = clamp(dragStart.pitch + dy * 0.008, -PITCH_LIMIT, PITCH_LIMIT);
        applyView();
      }
      e.preventDefault();
    });

    function endPointer(e) {
      pointers.delete(e.pointerId);
      if (pointers.size === 1) {
        const remaining = pointers.values().next().value;
        dragStart = { x: remaining.x, y: remaining.y, yaw: STATE.yaw, pitch: STATE.pitch };
        pinchStart = null;
      } else if (pointers.size === 0) {
        dragStart = null;
        pinchStart = null;
      }
    }

    canvas.addEventListener('pointerup', endPointer);
    canvas.addEventListener('pointercancel', endPointer);
    window.addEventListener('pointerup', endPointer);
    window.addEventListener('pointercancel', endPointer);

    canvas.addEventListener('wheel', function (e) {
      if (busy) return;
      e.preventDefault();
      STATE.zoom = clamp(STATE.zoom * Math.exp(-e.deltaY * 0.0012), ZOOM_MIN, ZOOM_MAX);
      applyView();
    }, { passive: false });

    document.getElementById('btn-reset-view').addEventListener('click', function () {
      if (busy) return;
      STATE.yaw = 0;
      STATE.pitch = 0;
      STATE.zoom = 1;
      applyView();
    });
  }

  // ----------------------------------------------------------------------------
  // Init
  // ----------------------------------------------------------------------------
  function init() {
    stage = document.getElementById('mockup-stage');
    restorePrefs();

    if (typeof THREE === 'undefined') {
      setStatus('three.min.js failed to load — the 3D preview is unavailable.', false);
      return;
    }

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-label', '3D device mockup preview');
    stage.insertBefore(renderer.domElement, stage.firstChild);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

    envTexture = makeEnvTexture();
    scene.environment = envTexture;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x1b1b20, 1.25);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(4.5, 7, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xbfc9ff, 1.1);
    fill.position.set(-6, 2.5, 4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xd9c2ff, 1.6);
    rim.position.set(0, 3.5, -7);
    scene.add(rim);

    glareTexture = makeGlareTexture();
    shadowTexture = makeShadowTexture();
    deckTexture = makeDeckTexture();

    shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      })
    );
    scene.add(shadowMesh);

    pivot = new THREE.Group();
    scene.add(pivot);

    // Demo textures so the stage is alive before an upload.
    DEVICES.forEach(function (device, index) {
      screenTextures[device.id] = makeScreenTexture(device, null, index);
    });

    configureBackground(STATE.background);
    resizeStage();
    buildCurrentDevice();
    renderTabs();
    renderColors();
    renderBackgrounds();
    renderSpecs();
    renderExportFormat();
    updateTabs();
    applyView();
    setupUpload();
    setupControls();
    setupExportOptions();

    document.getElementById('btn-export-current').addEventListener('click', exportCurrent);
    document.getElementById('btn-export-zip').addEventListener('click', exportZip);

    window.addEventListener('resize', function () {
      resizeStage();
      renderer.render(scene, camera);
    });

    if (window.ResizeObserver) {
      new ResizeObserver(function () { resizeStage(); }).observe(stage);
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
