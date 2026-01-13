// js for wallpaper multiple size generator

// Centralized device size map (keys match preview/download data-device ids)
const DEVICE_SIZES = {
    iphone: [1980, 4302],
    ipad: [2064, 1548],
    macbook: [4512, 2538],
    applewatch: [1664, 1984],
    flipphone: [750, 1000],
    oldphone: [1080, 1920]
};

const fileInput = document.getElementById('image-upload');
const previewImgRoot = document.getElementById('image-preview');

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            generateWallpapers(img);
        };
        img.src = e.target.result;

        // set upload-preview image and attach listeners
        attachPreviewListeners(previewImgRoot, document.querySelector('.upload-preview'));
        previewImgRoot.src = img.src;
    };
    reader.readAsDataURL(file);
});

function generateWallpapers(img) {
    if (!img || !img.complete) return;

    // determine mime/quality from selector
    const imageFormat = document.getElementById('image-format').value;
    let mimeType = 'image/png', quality;
    if (imageFormat === 'jpeg') { mimeType = 'image/jpeg'; quality = 0.92; }
    else if (imageFormat === 'webp') { mimeType = 'image/webp'; quality = 0.92; }

    // source dimensions
    const iw = img.width, ih = img.height;
    const srcAspect = iw / ih;

    // pick best-match device by aspect difference
    let bestKey = null, bestDiff = Infinity;
    for (const [k, dims] of Object.entries(DEVICE_SIZES)) {
        const [w, h] = dims;
        const diff = Math.abs(srcAspect - (w / h));
        if (diff < bestDiff) { bestDiff = diff; bestKey = k; }
    }

    // hide all preview items and clear src
    Object.keys(DEVICE_SIZES).forEach(k => {
        const imgEl = document.getElementById(`${k}-preview`);
        const parent = imgEl ? imgEl.closest('.preview-item') : null;
        if (parent) parent.classList.add('hidden');
        if (imgEl) imgEl.src = '';
    });

    // generate preview only for bestKey
    if (!bestKey) return;
    const [tw, th] = DEVICE_SIZES[bestKey];
    const canvas = document.createElement('canvas');
    canvas.width = tw; canvas.height = th;
    const ctx = canvas.getContext('2d');

    // center-crop source to target aspect
    const targetAspect = tw / th;
    let sx = 0, sy = 0, sWidth = iw, sHeight = ih;
    if (iw / ih > targetAspect) {
        sWidth = Math.round(ih * targetAspect);
        sx = Math.round((iw - sWidth) / 2);
    } else {
        sHeight = Math.round(iw / targetAspect);
        sy = Math.round((ih - sHeight) / 2);
    }
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, tw, th);

    const dataURL = canvas.toDataURL(mimeType, quality);

    const previewEl = document.getElementById(`${bestKey}-preview`);
    if (previewEl) {
        const parent = previewEl.closest('.preview-item');
        attachPreviewListeners(previewEl, parent);
        previewEl.src = dataURL;
        if (parent) {
            parent.classList.remove('hidden');
            parent.classList.add('best-match');
        }
    }

    // cleanup
    canvas.width = 0; canvas.height = 0;
}

// single-device download (rebuilds canvas at device size)
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const device = btn.getAttribute('data-device');
        if (!device) return;
        downloadSingleWallpaper(device);
    });
});

function downloadSingleWallpaper(device) {
    const fmt = document.getElementById('image-format').value;
    let mime = 'image/png', ext = 'png', quality;
    if (fmt === 'jpeg') { mime = 'image/jpeg'; ext = 'jpg'; quality = 0.92; }
    else if (fmt === 'webp') { mime = 'image/webp'; ext = 'webp'; quality = 0.92; }

    const key = device.toLowerCase();
    const dims = DEVICE_SIZES[key];
    if (!dims) { console.error('Unknown device:', device); return; }
    const [w, h] = dims;

    const src = document.getElementById('image-preview').src;
    if (!src) { console.error('No uploaded image to export'); return; }

    const srcImg = new Image();
    srcImg.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');

        const iw = srcImg.width, ih = srcImg.height;
        const targ = w / h;
        let sx = 0, sy = 0, sW = iw, sH = ih;
        if (iw / ih > targ) {
            sW = Math.round(ih * targ);
            sx = Math.round((iw - sW) / 2);
        } else {
            sH = Math.round(iw / targ);
            sy = Math.round((ih - sH) / 2);
        }
        ctx.drawImage(srcImg, sx, sy, sW, sH, 0, 0, w, h);
        const data = canvas.toDataURL(mime, quality);
        const a = document.createElement('a');
        a.href = data; a.download = `${key}_wallpaper.${ext}`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        canvas.width = 0; canvas.height = 0;
    };
    srcImg.onerror = function() { console.error('Failed to load source image for export'); };
    srcImg.src = src;
}

// Attach load/error listeners to a preview image and toggle placeholder classes
function attachPreviewListeners(imgElement, container) {
    if (!imgElement) return;
    imgElement.onload = null; imgElement.onerror = null;
    imgElement.onload = function() {
        imgElement.classList.add('loaded');
        if (container) container.classList.add('img-loaded');
    };
    imgElement.onerror = function() {
        imgElement.classList.remove('loaded');
        try { imgElement.src = ''; } catch (e) {}
        if (container) container.classList.remove('img-loaded');
    };
}

// format toggle buttons: sync hidden input and trigger change
document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.disabled) return;
        const fmt = this.getAttribute('data-format');
        const hidden = document.getElementById('image-format');
        if (!hidden) return;
        document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        hidden.value = fmt; hidden.dispatchEvent(new Event('change', { bubbles: true }));
    });
});

// Detect WebP support; if unsupported, disable the WEBP toggle
(function checkWebPSupport(){
    let supported = false;
    try {
        const cvs = document.createElement('canvas');
        supported = cvs.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch(e) { supported = false; }
    const webpBtn = document.querySelector('.format-btn[data-format="webp"]');
    if (!supported && webpBtn) {
        webpBtn.classList.add('disabled'); webpBtn.disabled = true; webpBtn.setAttribute('aria-disabled','true');
        if (webpBtn.classList.contains('active')) {
            const pngBtn = document.querySelector('.format-btn[data-format="png"]');
            if (pngBtn) { webpBtn.classList.remove('active'); pngBtn.classList.add('active'); const hidden = document.getElementById('image-format'); if (hidden) { hidden.value = 'png'; hidden.dispatchEvent(new Event('change', { bubbles: true })); } }
        }
    }
})();

// regenerate previews when format changes (re-uses uploaded preview source)
document.getElementById('image-format').addEventListener('change', function() {
    const src = document.getElementById('image-preview').src;
    if (!src) return;
    const img = new Image(); img.onload = () => generateWallpapers(img); img.src = src;
});
