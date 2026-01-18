// js for wallpaper mutiple size generator
const DEVICE_SIZES = {
    'macbook': [4512, 2538],
    'ipad': [2064, 1548],
    'iphone': [1980, 4302],
    'applewatch': [1664, 1984]
    // add more sizes here
    };

const MOCKUP_SETTINGS = {
    'macbook': {top: 442, left: 167,  zoom: 676/4512, roundCorners: 6},
    'ipad': {top: 517, left: 710,  zoom: 454/2064, roundCorners: 12},
    'iphone': {top: 595, left: 643, zoom: 126/1980, roundCorners: 16},
    'applewatch': {top: 778, left: 603,  zoom: 60/1664, roundCorners: 16}
    // add more sizes here
};

const MOCKUP_BACKGROUND_SETTINGS = [
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
]
var mockup_background_current = MOCKUP_BACKGROUND_SETTINGS[0];
function initBackgroundSelectors() {
    const container = document.getElementById('mockup-item-background-list');
    MOCKUP_BACKGROUND_SETTINGS.forEach((bg, index) => {
        const btn = document.createElement('button');
        btn.className = 'mockup-bg-btn';
        btn.style.background = `linear-gradient(${bg.deg}deg, ${bg.a}, ${bg.b})`;
        btn.title = `Background ${index + 1}`;
        btn.addEventListener('click', () => {
            mockup_background_current = MOCKUP_BACKGROUND_SETTINGS[index];
            makeMockupPreview()
            return false;
        });
        container.appendChild(btn);
    });
}
initBackgroundSelectors();

document.getElementById('image-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                generateWallpapers(img);
            }
            img.src = e.target.result;
            // set preview image src and manage load/error UI
            const previewImg = document.getElementById('image-preview');
            attachPreviewListeners(previewImg, document.querySelector('.upload-preview'));
            previewImg.src = img.src;
        }
        reader.readAsDataURL(file);
    }
});

// hide preview grid and download-all button on init
const previewGrid = document.getElementById('preview-grid');
if (previewGrid) previewGrid.classList.add('hidden');

function generateWallpapers(img) {
    // 验证传入的图片对象
    if (!img || !img.complete) {
        console.error('Invalid image provided to generateWallpapers');
        return;
    }

    // 获取用户选择的图像格式
    const imageFormat = document.getElementById('image-format').value;
    let mimeType;
    let quality;
    if (imageFormat === 'jpeg') {
        mimeType = 'image/jpeg';
        quality = 0.92;
    } else if (imageFormat === 'webp') {
        mimeType = 'image/webp';
        quality = 0.92;
    } else {
        mimeType = 'image/png';
        quality = undefined;
    }

    // use global DEVICE_SIZES mapping
    for (const device in DEVICE_SIZES) {
        const [width, height] = DEVICE_SIZES[device];
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Compute source rect to center-crop image to target aspect ratio
        const iw = img.width, ih = img.height;
        const targetAspect = width / height;
        let sx = 0, sy = 0, sWidth = iw, sHeight = ih;

        if (iw / ih > targetAspect) {
            // source is wider -> crop width
            sWidth = Math.round(ih * targetAspect);
            sx = Math.round((iw - sWidth) / 2);
        } else {
            // source is taller -> crop height
            sHeight = Math.round(iw / targetAspect);
            sy = Math.round((ih - sHeight) / 2);
        }

        // draw the cropped area scaled to target canvas size
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);
        
        // 根据选择的格式生成数据URL
        const dataURL = canvas.toDataURL(mimeType, quality);
        
        // 获取目标预览元素
        const previewElement = document.getElementById(`${device.toLowerCase().replace(' ', '')}-preview`);
        
        // 验证元素是否存在
        if (previewElement) {
            // attach listeners before assigning src so we capture load/error
            const parentItem = previewElement.closest('.preview-item');
            attachPreviewListeners(previewElement, parentItem);
            previewElement.src = dataURL;
        } else {
            console.warn(`Preview element not found for ${device}`);
        }
        
        // 清理canvas以释放内存
        canvas.width = 0;
        canvas.height = 0;
    }
    // reveal preview area and download-all button after generation
    // if (previewGrid) previewGrid.classList.remove('hidden');
    
    makeMockupPreview()
}

// 添加单个设备壁纸下载功能
document.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', function() {
        const device = this.getAttribute('data-device');
        downloadSingleWallpaper(device);
    });
});

function downloadSingleWallpaper(device) {
    const imageFormat = document.getElementById('image-format').value;
    let extension, mimeType, quality;
    if (imageFormat === 'jpeg') {
        extension = 'jpg';
        mimeType = 'image/jpeg';
        quality = 0.92;
    } else if (imageFormat === 'webp') {
        extension = 'webp';
        mimeType = 'image/webp';
        quality = 0.92;
    } else {
        extension = 'png';
        mimeType = 'image/png';
        quality = undefined;
    }

    // sizes keyed by lowercase device id used in data-device
    const sizes = {
        'iphone': [1440, 3118],
        'ipad': [2880, 2160],
        'macbook': [4512, 2538],
        'applewatch': [1664, 1984]
    };

    const key = device.toLowerCase();
    const dims = sizes[key];
    if (!dims) {
        console.error(`Unknown device for download: ${device}`);
        return;
    }
    const [width, height] = dims;

    // use the uploaded preview image as source (dataURL kept in #image-preview)
    const source = document.getElementById('image-preview').src;
    if (!source) {
        console.error('No uploaded image available for export');
        return;
    }

    const srcImg = new Image();
    srcImg.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // center-crop source to target aspect then draw scaled
        const iw = srcImg.width, ih = srcImg.height;
        const targetAspect = width / height;
        let sx = 0, sy = 0, sWidth = iw, sHeight = ih;
        if (iw / ih > targetAspect) {
            sWidth = Math.round(ih * targetAspect);
            sx = Math.round((iw - sWidth) / 2);
        } else {
            sHeight = Math.round(iw / targetAspect);
            sy = Math.round((ih - sHeight) / 2);
        }
        ctx.drawImage(srcImg, sx, sy, sWidth, sHeight, 0, 0, width, height);

        const dataURL = canvas.toDataURL(mimeType, quality);
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${device}_wallpaper.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    srcImg.onerror = function() {
        console.error('Failed to load source image for export');
    };
    srcImg.src = source;
}

// Attach load/error listeners to a preview image and toggle placeholder classes
function attachPreviewListeners(imgElement, container) {
    if (!imgElement) return;

    // remove any existing handlers to avoid double-binding
    imgElement.onload = null;
    imgElement.onerror = null;

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

// helper: load image from src -> Promise<Image>
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
    });
}

// helper: rounded rect path
function roundedRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
}

// Assemble a 1280x1280 mockup composite and return a dataURL
async function assembleMockupComposite(imageFormat, mimeType, quality) {
    const canvas = document.createElement('canvas');
    const size = 1280;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // white background
    // ctx.fillStyle = '#ffffff';
    // ctx.fillRect(0,0,size,size);
    const bg = mockup_background_current;
    const gradient = ctx.createLinearGradient(0,0,size,size);
    gradient.addColorStop(0, bg.a);
    gradient.addColorStop(1, bg.b);
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,size,size);

    const sizes = DEVICE_SIZES;
    const mockupDevicePresets = (typeof MOCKUP_SETTINGS !== 'undefined') ? MOCKUP_SETTINGS : {
        'iphone': {top: 100, left: 50, zoom: 0.25, roundCorners: 16},
        'ipad': {top: 100, left: 50,  zoom: 0.25, roundCorners: 16},
        'macbook': {top: 100, left: 50,  zoom: 0.25, roundCorners: 16},
        'applewatch': {top: 100, left: 50,  zoom: 0.25, roundCorners: 16}
    };

    const devices = Object.keys(sizes);
    const drawPromises = devices.map(async (device) => {
        try {
            const previewEl = document.getElementById(`${device.toLowerCase().replace(/\s+/g,'')}-preview`);
            if (!previewEl || !previewEl.src) return;
            const img = await loadImage(previewEl.src);
            const preset = (MOCKUP_SETTINGS && MOCKUP_SETTINGS[device]) || mockupDevicePresets[device] || {top:0,left:0,zoom:0.25,roundCorners:0};

            const destW = Math.round(img.width * preset.zoom);
            const destH = Math.round(img.height * preset.zoom);
            const x = Math.round(preset.left);
            const y = Math.round(preset.top);

            // clip to rounded rect if requested
            if (preset.roundCorners && preset.roundCorners > 0) {
                ctx.save();
                roundedRect(ctx, x, y, destW, destH, preset.roundCorners);
                ctx.clip();
                ctx.drawImage(img, 0,0, img.width, img.height, x, y, destW, destH);
                ctx.restore();
            } else {
                ctx.drawImage(img, 0,0, img.width, img.height, x, y, destW, destH);
            }
        } catch (e) {
            console.warn('Failed to draw device in mockup:', device, e);
        }
    });

    await Promise.all(drawPromises);

    // overlay mockup template if available (look in same folder)
    try {
        const overlayPath = 'appledevicesmockup.png';
        const overlayImg = await loadImage(overlayPath);
        ctx.drawImage(overlayImg, 0, 0, size, size);
    } catch (e) {
        console.warn('appledevicesmockup.png not found or failed to load');
    }

    const compositeDataURL = canvas.toDataURL(mimeType, quality);
    return compositeDataURL;
}

// 监听格式选择变化，重新生成壁纸
document.getElementById('image-format').addEventListener('change', function() {
    const previewImg = document.getElementById('image-preview');
    if(previewImg.src) {
        const img = new Image();
        img.onload = function() {
            generateWallpapers(img);
        };
        img.src = previewImg.src;
    }
});

// format toggle buttons: sync hidden input and trigger change
document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.disabled) return;
        const fmt = this.getAttribute('data-format');
        const hidden = document.getElementById('image-format');
        if (!hidden) return;
        // toggle active class
        document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // set hidden value and dispatch change so existing listener runs
        hidden.value = fmt;
        hidden.dispatchEvent(new Event('change', { bubbles: true }));
    });
});

// Detect WebP support; if unsupported, disable the WEBP toggle
(function checkWebPSupport(){
    let supported = false;
    try {
        const cvs = document.createElement('canvas');
        supported = cvs.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch(e) {
        supported = false;
    }
    const webpBtn = document.querySelector('.format-btn[data-format="webp"]');
    if (!supported && webpBtn) {
        webpBtn.classList.add('disabled');
        webpBtn.disabled = true;
        webpBtn.setAttribute('aria-disabled','true');
        // if it was active, fallback to PNG
        if (webpBtn.classList.contains('active')) {
            const pngBtn = document.querySelector('.format-btn[data-format="png"]');
            if (pngBtn) {
                webpBtn.classList.remove('active');
                pngBtn.classList.add('active');
                const hidden = document.getElementById('image-format');
                if (hidden) { hidden.value = 'png'; hidden.dispatchEvent(new Event('change', { bubbles: true })); }
            }
        }
    }
})();

function saveAs(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function makeMockupPreview() {
    // check device preview images are available
    const previewImg = document.getElementById('iphone-preview');
    if(!previewImg.src) {
        alert('Please upload an image and generate wallpapers before making a mockup.');
        return;
    }
    // new canvas for mockup, add preview image
    const mockupImg = document.getElementById('mockup-image-preview');
    const mockupCanvas = document.createElement('canvas');
    const size = 1280;
    mockupCanvas.width = size;
    mockupCanvas.height = size;
    const ctx = mockupCanvas.getContext('2d');

    // white background
    // ctx.fillStyle = '#FFF';
    // ctx.fillRect(0,0,size,size);

    // update background by mockup_background_current
    // like { a: '#ff7a18', b: '#af002d', deg: 180 }
    const bg = mockup_background_current;
    const gradient = ctx.createLinearGradient(0,0,size,size);
    gradient.addColorStop(0, bg.a);
    gradient.addColorStop(1, bg.b);
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,size,size);

    
    const sizes = DEVICE_SIZES;
    const mockupDevicePresets = MOCKUP_SETTINGS;

    const devices = Object.keys(sizes);
    const drawPromises = devices.map(async (device) => {
        try {
            const previewEl = document.getElementById(`${device.toLowerCase().replace(/\s+/g,'')}-preview`);
            if (!previewEl || !previewEl.src) return;
            const img = await loadImage(previewEl.src);
            const preset = mockupDevicePresets[device] || {top:0,left:0,zoom:0.25,roundCorners:0};

            const destW = Math.round(img.width * preset.zoom);
            const destH = Math.round(img.height * preset.zoom);
            const x = Math.round(preset.left);
            const y = Math.round(preset.top);

            // clip to rounded rect if requested
            if (preset.roundCorners && preset.roundCorners > 0) {
                ctx.save();
                roundedRect(ctx, x, y, destW, destH, preset.roundCorners);
                ctx.clip();
                ctx.drawImage(img, 0,0, img.width, img.height, x, y, destW, destH);
                ctx.restore();
            } else {
                ctx.drawImage(img, 0,0, img.width, img.height, x, y, destW, destH);
            }
        } catch (e) {
            console.warn('Failed to draw device in mockup:', device, e);
        }
    });
    
    Promise.all(drawPromises).then(() => {
        const dataURL = mockupCanvas.toDataURL('image/png');
        mockupImg.src = dataURL;
        // add foreground overlay if available
        loadImage('appledevicesmockup.png').then(overlayImg => {
            ctx.drawImage(overlayImg, 0, 0, size, size);
            const finalDataURL = mockupCanvas.toDataURL('image/png');
            mockupImg.src = finalDataURL;
        }).catch(() => {
            console.warn('appledevicesmockup.png not found or failed to load');
        });
        // show mockup section
        const mockupSection = document.getElementById('mockup-grid');
        if (mockupSection) {
            mockupSection.classList.remove('hidden');
        }
        const downloadBtn = document.getElementById('button-download-mockup');
        if (downloadBtn) {
            downloadBtn.classList.remove('hidden');
        }
    });
}
// Wire Make Mockup button to generate per-device previews if needed, then assemble and show preview
const makeMockupBtn = document.getElementById('button-make-mockup');
if (makeMockupBtn) {
    makeMockupBtn.addEventListener('click', async function() {
        makeMockupPreview();
    });
}

// download mockup composite image in specified format
function downloadMockup() { 

    const mockupImg = document.getElementById('mockup-image-preview');
    if(!mockupImg.src) {
        alert('Please generate a mockup preview first.');
        return;
    }

    const imageFormat = document.getElementById('image-format').value;
    let mimeType, extension, quality;
    if (imageFormat === 'jpeg') {
        mimeType = 'image/jpeg';
        extension = 'jpg';
        quality = 0.92;
    } else if (imageFormat === 'webp') {
        mimeType = 'image/webp';
        extension = 'webp';
        quality = 0.92;
    } else {
        mimeType = 'image/png';
        extension = 'png';
        quality = undefined;
    }

    assembleMockupComposite(imageFormat, mimeType, quality).then(dataURL => {
        // convert dataURL to blob for download
        fetch(dataURL)
            .then(res => res.blob())
            .then(blob => {
                saveAs(blob, `wallpaper_mockup.${extension}`);
            });
    });
    
}

const downloadMockupBtn = document.getElementById('button-download-mockup');
if (downloadMockupBtn) {
    downloadMockupBtn.addEventListener('click', async function() {
        downloadMockup();
    });
}