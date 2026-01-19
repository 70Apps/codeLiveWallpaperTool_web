// Gradient wallpaper generator script
// 30 个漂亮的渐变色推荐设置，包括颜色A、颜色B和角度
// Recommended swatches data
const SWATCH_RECOMMEND = [
    { a: '#ff7a18', b: '#af002d', deg: 180 },
    { a: '#00c9ff', b: '#92fe9d', deg: 180 },
    { a: '#f79734', b: '#f64f35', deg: 180 },
    { a: '#654ea3', b: '#da98b4', deg: 180 },
    { a: '#ff5858', b: '#f093fb', deg: 180 },
    { a: '#ff7eb3', b: '#ff758c', deg: 180 },
    { a: '#a6c1ee', b: '#f6f7fa', deg: 180 },
    { a: '#d4fc79', b: '#96e6a1', deg: 180 },
    { a: '#a1c4fd', b: '#c2e9fb', deg: 180 },
    { a: '#fbc2eb', b: '#a6c1ee', deg: 315},
    { a: '#43e97b', b: '#38f9d7', deg: 270 },
    { a: '#fa709a', b: '#fee140', deg: 90 },
    { a: '#30cfd0', b: '#330867', deg: 180 },
    { a: '#fddb92', b: '#d1fdff', deg: 180 },
    { a: '#a18cd1', b: '#fbc2eb', deg: 180 },
    { a: '#fad0c4', b: '#ffd1ff', deg: 180 },
    { a: '#ff9a9e', b: '#fad0c4', deg: 180 },
    { a: '#c1dfc4', b: '#deecdd', deg: 180 },
    { a: '#667eea', b: '#764ba2', deg: 180 },
    { a: '#89f7fe', b: '#66a6ff', deg: 180 },
    { a: '#fdfbfb', b: '#ebedee', deg: 180 },
    { a: '#e0c3fc', b: '#8ec5fc', deg: 180 },
    { a: '#f6d365', b: '#fda085', deg: 180 },
    { a: '#96fbc4', b: '#f9f586', deg: 180 },
    { a: '#cfd9df', b: '#e2ebf0', deg: 180 },
    { a: '#a8edea', b: '#fed6e3', deg: 180 },
    { a: '#f5f7fa', b: '#c3cfe2', deg: 180 },
    { a: '#667eea', b: '#89f7fe', deg: 180 },
    { a: '#ffecd2', b: '#fcb69f', deg: 180 },
    { a: '#fcb69f', b: '#ffecd2', deg: 180 },
];

/**
 * Render clickable recommended swatches into the `.recommend` container.
 * Clicking a swatch applies its colors and angle, updates the preview and regenerates canvases.
 */
function renderRecommendations() {
    const container = document.querySelector('.recommend');
    if (!container) return;
    container.innerHTML = '<div class="recommend-list"></div>';
    const list = container.querySelector('.recommend-list');
    const frag = document.createDocumentFragment();

    SWATCH_RECOMMEND.forEach((s, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'recommend-swatch';
        btn.dataset.index = String(idx);
        btn.setAttribute('aria-label', `Recommended gradient ${idx + 1}`);
        const preview = document.createElement('span');
        preview.className = 'swatch-preview';
        preview.style.background = `linear-gradient(${s.deg}deg, ${s.a}, ${s.b})`;
        const meta = document.createElement('span');
        meta.className = 'swatch-meta';
        meta.textContent = `${idx + 1}`;
        btn.appendChild(preview);
        btn.appendChild(meta);
        frag.appendChild(btn);
    });
    list.appendChild(frag);

    // Event delegation: handle clicks on recommended swatches
    list.addEventListener('click', (e) => {
        const btn = e.target.closest('.recommend-swatch');
        if (!btn) return;
        const idx = Number(btn.dataset.index);
        const s = SWATCH_RECOMMEND[idx];
        if (!s) return;
        pushState();
        if (colorA) colorA.value = s.a;
        if (colorB) colorB.value = s.b;
        if (angleInput) angleInput.value = String(s.deg);
        updateSwatch();
    });
}

// History for undo/redo
const undoStack = [];
const redoStack = [];

function getCurrentState() {
    return {
        a: colorA?.value ?? '#ff7a18',
        b: colorB?.value ?? '#af002d',
        deg: angleInput?.value ?? '180'
    };
}

function applyState(state, pushPrev = false) {
    if (!state) return;
    if (pushPrev) pushState();
    if (colorA) colorA.value = state.a;
    if (colorB) colorB.value = state.b;
    if (angleInput) angleInput.value = state.deg;
    updateSwatch();
}

function pushState() {
    // push current state to undo stack and clear redo
    // store a shallow copy to avoid mutation
    undoStack.push({ ...getCurrentState() });
    if (undoStack.length > 50) undoStack.shift();
    redoStack.length = 0;
}

function doUndo() {
    if (!undoStack.length) return;
    const prev = undoStack.pop();
    redoStack.push(getCurrentState());
    applyState(prev, false);
}

function doRedo() {
    if (!redoStack.length) return;
    const next = redoStack.pop();
    undoStack.push(getCurrentState());
    applyState(next, false);
}

function randomHexColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
}

function randomizeColors() {
    pushState();
    // pick a random recommendation half the time, else random colors
    if (SWATCH_RECOMMEND.length && Math.random() < 0.6) {
        const pick = SWATCH_RECOMMEND[Math.floor(Math.random() * SWATCH_RECOMMEND.length)];
        applyState({ a: pick.a, b: pick.b, deg: String(pick.deg) }, false);
    } else {
        applyState({ a: randomHexColor(), b: randomHexColor(), deg: String(Math.floor(Math.random() * 360)) }, false);
    }
}
const DEVICE_SIZES = {
    iphone: [1980, 4302],
    ipad: [2064, 1548],
    macbook: [4512, 2538],
    applewatch: [1664, 1984]
};
// controls
const colorA = document.getElementById('color-a');
const colorB = document.getElementById('color-b');
const angleInput = document.getElementById('angle');
const angleValue = document.getElementById('angle-value');
const imagePreview = document.getElementById('image-preview');
const formatHidden = document.getElementById('image-format');
// nodes for preview grid and download-all
const previewGrid = document.getElementById('preview-grid');
const downloadAllBtn = document.getElementById('download-button');

// store last canvases for downloads
const lastCanvases = {};

function updateSwatch() {
    const a = colorA ? colorA.value : '#ff7a18';
    const b = colorB ? colorB.value : '#af002d';
    const deg = angleInput ? angleInput.value : '180';
    if (imagePreview) imagePreview.style.background = `linear-gradient(${deg}deg, ${a}, ${b})`;
    if (angleValue) angleValue.textContent = deg;
}

function drawGradientToCanvas(width, height, color1, color2, angleDeg) {
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    // Map CSS linear-gradient(angle) to canvas coordinates and compute
    // endpoints so the full color range (from color1 to color2) covers
    // the entire canvas. We project all four corners onto the
    // gradient axis and use the min/max projections as endpoints.
    // CSS angles: 0deg => pointing up, 90deg => right, clockwise positive.
    // Canvas coordinates: x right, y down. For CSS angle θ (deg):
    // direction (unit) = (sin θ, -cos θ).
    const theta = (Number(angleDeg) % 360) * Math.PI / 180;
    const vx = Math.sin(theta);
    const vy = -Math.cos(theta);

    // compute projection scalar (dot) for each corner
    const t00 = 0 * vx + 0 * vy;
    const tW0 = width * vx + 0 * vy;
    const t0H = 0 * vx + height * vy;
    const tWH = width * vx + height * vy;
    const minT = Math.min(t00, tW0, t0H, tWH);
    const maxT = Math.max(t00, tW0, t0H, tWH);

    // endpoints in canvas coordinates along the axis
    const x0 = vx * minT, y0 = vy * minT;
    const x1 = vx * maxT, y1 = vy * maxT;
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return canvas;
}

function generatePreviews() {
    const a = colorA ? colorA.value : '#ff7a18';
    const b = colorB ? colorB.value : '#af002d';
    const deg = angleInput ? parseInt(angleInput.value, 10) : 180;
    const fmt = formatHidden ? formatHidden.value : 'png';
    const mime = fmt === 'jpeg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png';
    const quality = fmt === 'jpeg' || fmt === 'webp' ? 0.92 : undefined;

    for (const [key, dims] of Object.entries(DEVICE_SIZES)) {
        const [w, h] = dims;
        const canvas = drawGradientToCanvas(w, h, a, b, deg);
        lastCanvases[key] = canvas;
        const data = canvas.toDataURL(mime, quality);
        const imgEl = document.getElementById(`${key}-preview`);
        if (imgEl) {
            attachPreviewListeners(imgEl, imgEl.closest('.preview-item'));
            imgEl.src = data;
        }
    }
    // reveal preview area and download-all button after generation
    if (previewGrid) previewGrid.classList.remove('hidden');
    if (downloadAllBtn) downloadAllBtn.classList.remove('hidden');
}

// wire events (no automatic preview generation; use toolbar button)
if (colorA && colorB && angleInput) {
    [colorA, colorB, angleInput].forEach(el => el.addEventListener('input', () => { updateSwatch(); }));
}

// Format toggle buttons: sync hidden input and active class
function initFormatToggles() {
    const hidden = document.getElementById('image-format');
    const buttons = Array.from(document.querySelectorAll('.format-btn'));
    if (!buttons.length || !hidden) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('disabled') || btn.disabled) return;
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const fmt = btn.getAttribute('data-format');
            hidden.value = fmt;
            hidden.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });

    // detect webp support and disable if unsupported
    try {
        const cvs = document.createElement('canvas');
        const supported = cvs.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        const webpBtn = buttons.find(b => b.getAttribute('data-format') === 'webp');
        if (!supported && webpBtn) {
            webpBtn.classList.add('disabled');
            webpBtn.disabled = true;
            webpBtn.setAttribute('aria-disabled', 'true');
            // if webp was active, fallback to png
            if (webpBtn.classList.contains('active')) {
                const pngBtn = buttons.find(b => b.getAttribute('data-format') === 'png');
                if (pngBtn) {
                    webpBtn.classList.remove('active');
                    pngBtn.classList.add('active');
                    hidden.value = 'png';
                }
            }
        }
    } catch (e) {}
}

// single-device download
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const device = btn.getAttribute('data-device');
        if (!device) return;
        const key = device.toLowerCase();
        let canvas = lastCanvases[key];
        if (!canvas) {
            const dims = DEVICE_SIZES[key];
            if (!dims) return;
            canvas = drawGradientToCanvas(dims[0], dims[1], colorA.value, colorB.value, parseInt(angleInput.value, 10));
        }
        const fmt = formatHidden ? formatHidden.value : 'png';
        const mime = fmt === 'jpeg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png';
        const quality = fmt === 'jpeg' || fmt === 'webp' ? 0.92 : undefined;
        const data = canvas.toDataURL(mime, quality);
        const a = document.createElement('a'); a.href = data; a.download = `${key}_gradient.${fmt === 'jpeg' ? 'jpg' : fmt}`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
});

// Attach load/error listeners to a preview image and toggle placeholder classes
function attachPreviewListeners(imgElement, container) {
    if (!imgElement) return;
    imgElement.onload = null; imgElement.onerror = null;
    imgElement.onload = function() {
        imgElement.classList.add('loaded'); if (container) container.classList.add('img-loaded');
    };
    imgElement.onerror = function() {
        imgElement.classList.remove('loaded'); try { imgElement.src = ''; } catch(e) {} if (container) container.classList.remove('img-loaded');
    };
}

// init
updateSwatch();
renderRecommendations();

// initialize history with starting state
pushState();

// toolbar buttons: generate, randomize, undo, redo
const randomBtn = document.getElementById('randomize-button');
const generateBtn = document.getElementById('generate-button');
const undoBtn = document.getElementById('undo-button');
const redoBtn = document.getElementById('redo-button');

if (randomBtn) randomBtn.addEventListener('click', () => randomizeColors());
if (generateBtn) generateBtn.addEventListener('click', () => generatePreviews());
if (undoBtn) undoBtn.addEventListener('click', () => doUndo());
if (redoBtn) redoBtn.addEventListener('click', () => doRedo());

// init format toggles after DOM ready
initFormatToggles();

// hide previews and download-all on init
if (previewGrid) previewGrid.classList.add('hidden');
if (downloadAllBtn) downloadAllBtn.classList.add('hidden');

// Download All (zip) - build canvases for each device and package
if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', async () => {
        try {
            if (typeof JSZip === 'undefined') {
                console.error('JSZip not found');
                return;
            }
            downloadAllBtn.disabled = true;
            const zip = new JSZip();
            const fmt = formatHidden ? formatHidden.value : 'png';
            const ext = fmt === 'jpeg' ? 'jpg' : fmt;
            const quality = fmt === 'jpeg' || fmt === 'webp' ? 0.92 : undefined;

            for (const [key, dims] of Object.entries(DEVICE_SIZES)) {
                const [w, h] = dims;
                let canvas = lastCanvases[key];
                if (!canvas) canvas = drawGradientToCanvas(w, h, colorA.value, colorB.value, parseInt(angleInput.value, 10));
                const data = canvas.toDataURL(fmt === 'jpeg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png', quality);
                const base64 = data.split(',')[1];
                zip.file(`${key}_wallpaper.${ext}`, base64, { base64: true });
            }

            const blob = await zip.generateAsync({ type: 'blob' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `wallpapers.${ext}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        } catch (e) {
            console.error('Failed to generate zip', e);
        } finally {
            downloadAllBtn.disabled = false;
        }
    });
}