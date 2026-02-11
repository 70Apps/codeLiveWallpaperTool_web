// Light wallpaper generator script
// 推荐的颜色组合
const COLOR_RECOMMENDATIONS = [
    { bg: '#f0f9ff', fg: '#0ea5e9', name: 'Sky Blue' },
    { bg: '#fef3c7', fg: '#f59e0b', name: 'Warm Yellow' },
    { bg: '#f0fdf4', fg: '#10b981', name: 'Fresh Green' },
    { bg: '#fdf2f8', fg: '#ec4899', name: 'Pink Blush' },
    { bg: '#f5f3ff', fg: '#8b5cf6', name: 'Purple Dream' },
    { bg: '#fff7ed', fg: '#ea580c', name: 'Orange Sunset' },
    { bg: '#ecfdf5', fg: '#059669', name: 'Mint Fresh' },
    { bg: '#fef7f0', fg: '#dc2626', name: 'Coral Red' },
    { bg: '#f8fafc', fg: '#475569', name: 'Cool Gray' },
    { bg: '#fffbeb', fg: '#d97706', name: 'Golden Hour' },
    { bg: '#f1f5f9', fg: '#0f172a', name: 'Classic Dark' },
    { bg: '#fefce8', fg: '#65a30d', name: 'Lime Light' },
    { bg: '#f0f4ff', fg: '#4338ca', name: 'Deep Blue' },
    { bg: '#fdf4ff', fg: '#a21caf', name: 'Magenta' },
    { bg: '#f7fee7', fg: '#166534', name: 'Forest Green' },
    { bg: '#fff1f2', fg: '#be123c', name: 'Rose Red' },
    { bg: '#f0fdfa', fg: '#0d9488', name: 'Teal Ocean' },
    { bg: '#fffef7', fg: '#a16207', name: 'Amber Glow' },
    { bg: '#fafafa', fg: '#262626', name: 'Monochrome' },
    { bg: '#f5f5f4', fg: '#57534e', name: 'Stone Gray' }
];

// 设备尺寸定义
const DEVICE_SIZES = {
    iphone: [1980, 4302],
    ipad: [2064, 1548],
    macbook: [4512, 2538],
    applewatch: [1664, 1984]
};

// 控件元素
const bgColorInput = document.getElementById('bg-color');
const fgColorInput = document.getElementById('fg-color');
const patternSelect = document.getElementById('pattern');
const opacityInput = document.getElementById('opacity');
const opacityValue = document.getElementById('opacity-value');
const imagePreview = document.getElementById('image-preview');
const formatHidden = document.getElementById('image-format');
const previewGrid = document.getElementById('preview-grid');
const downloadAllBtn = document.getElementById('download-button');

// 存储最后生成的画布
const lastCanvases = {};

// 历史记录用于撤销/重做
const undoStack = [];
const redoStack = [];

/**
 * 渲染推荐颜色组合
 */
function renderRecommendations() {
    const container = document.querySelector('.recommend');
    if (!container) return;
    
    container.innerHTML = '<div class="recommend-list"></div>';
    const list = container.querySelector('.recommend-list');
    const frag = document.createDocumentFragment();

    COLOR_RECOMMENDATIONS.forEach((combo, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'recommend-swatch';
        btn.dataset.index = String(idx);
        btn.setAttribute('aria-label', `${combo.name} color combination`);
        
        const preview = document.createElement('span');
        preview.className = 'swatch-preview';
        preview.style.background = `linear-gradient(135deg, ${combo.bg} 0%, ${combo.fg} 100%)`;
        
        const meta = document.createElement('span');
        meta.className = 'swatch-meta';
        meta.textContent = combo.name;
        
        btn.appendChild(preview);
        btn.appendChild(meta);
        frag.appendChild(btn);
    });
    
    list.appendChild(frag);

    // 点击推荐色彩组合
    list.addEventListener('click', (e) => {
        const btn = e.target.closest('.recommend-swatch');
        if (!btn) return;
        
        const idx = Number(btn.dataset.index);
        const combo = COLOR_RECOMMENDATIONS[idx];
        if (!combo) return;
        
        pushState();
        if (bgColorInput) bgColorInput.value = combo.bg;
        if (fgColorInput) fgColorInput.value = combo.fg;
        updatePreview();
    });
}

/**
 * 历史记录管理
 */
function getCurrentState() {
    return {
        bg: bgColorInput?.value ?? '#f0f9ff',
        fg: fgColorInput?.value ?? '#0ea5e9',
        pattern: patternSelect?.value ?? 'circles',
        opacity: opacityInput?.value ?? '0.3'
    };
}

function applyState(state, pushPrev = false) {
    if (!state) return;
    if (pushPrev) pushState();
    
    if (bgColorInput) bgColorInput.value = state.bg;
    if (fgColorInput) fgColorInput.value = state.fg;
    if (patternSelect) patternSelect.value = state.pattern;
    if (opacityInput) opacityInput.value = state.opacity;
    
    updatePreview();
}

function pushState() {
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

/**
 * 随机颜色生成
 */
function randomHexColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
}

function randomizeColors() {
    pushState();
    
    // 60% 概率使用推荐组合，40% 概率使用随机颜色
    if (COLOR_RECOMMENDATIONS.length && Math.random() < 0.6) {
        const combo = COLOR_RECOMMENDATIONS[Math.floor(Math.random() * COLOR_RECOMMENDATIONS.length)];
        applyState({ 
            bg: combo.bg, 
            fg: combo.fg, 
            pattern: patternSelect?.value ?? 'circles',
            opacity: opacityInput?.value ?? '0.3'
        }, false);
    } else {
        applyState({ 
            bg: randomHexColor(), 
            fg: randomHexColor(),
            pattern: patternSelect?.value ?? 'circles',
            opacity: opacityInput?.value ?? '0.3'
        }, false);
    }
}

/**
 * 更新预览
 */
function updatePreview() {
    const bg = bgColorInput ? bgColorInput.value : '#f0f9ff';
    const fg = fgColorInput ? fgColorInput.value : '#0ea5e9';
    const opacity = opacityInput ? opacityInput.value : '0.3';
    
    if (imagePreview) {
        imagePreview.style.background = bg;
        // 添加简单的前景色预览效果
        imagePreview.style.boxShadow = `inset 0 0 100px ${fg}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
    }
    
    if (opacityValue) opacityValue.textContent = opacity;
}

/**
 * 在画布上绘制图案
 */
function drawPatternToCanvas(width, height, bgColor, fgColor, pattern, opacity) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // 绘制背景
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // 设置前景色和透明度
    ctx.globalAlpha = parseFloat(opacity);
    ctx.fillStyle = fgColor;
    ctx.strokeStyle = fgColor;
    
    // 根据图案类型绘制
    switch (pattern) {
        case 'circles':
            drawCircles(ctx, width, height);
            break;
        case 'dots':
            drawDots(ctx, width, height);
            break;
        case 'lines':
            drawLines(ctx, width, height);
            break;
        case 'waves':
            drawWaves(ctx, width, height);
            break;
        case 'geometric':
            drawGeometric(ctx, width, height);
            break;
        case 'minimal':
            drawMinimal(ctx, width, height);
            break;
    }
    
    return canvas;
}

/**
 * 图案绘制函数
 */
function drawCircles(ctx, width, height) {
    const size = Math.min(width, height) / 8;
    for (let x = size; x < width; x += size * 2) {
        for (let y = size; y < height; y += size * 2) {
            ctx.beginPath();
            ctx.arc(x, y, size / 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawDots(ctx, width, height) {
    const size = Math.min(width, height) / 20;
    for (let x = size; x < width; x += size * 3) {
        for (let y = size; y < height; y += size * 3) {
            ctx.beginPath();
            ctx.arc(x, y, size / 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawLines(ctx, width, height) {
    const spacing = Math.min(width, height) / 15;
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
}

function drawWaves(ctx, width, height) {
    const amplitude = height / 10;
    const frequency = 4;
    ctx.lineWidth = 3;
    
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const yOffset = (height / 6) * (i + 1);
        
        for (let x = 0; x <= width; x += 5) {
            const y = yOffset + amplitude * Math.sin((x / width) * frequency * Math.PI * 2);
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
}

function drawGeometric(ctx, width, height) {
    const size = Math.min(width, height) / 12;
    for (let x = size; x < width; x += size * 2) {
        for (let y = size; y < height; y += size * 2) {
            ctx.beginPath();
            ctx.rect(x - size/4, y - size/4, size/2, size/2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x, y - size/2);
            ctx.lineTo(x + size/2, y);
            ctx.lineTo(x, y + size/2);
            ctx.lineTo(x - size/2, y);
            ctx.closePath();
            ctx.stroke();
        }
    }
}

function drawMinimal(ctx, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    // 中心圆
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 同心圆
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) + (i * radius / 8), 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

/**
 * 生成预览图
 */
function generatePreviews() {
    const bg = bgColorInput ? bgColorInput.value : '#f0f9ff';
    const fg = fgColorInput ? fgColorInput.value : '#0ea5e9';
    const pattern = patternSelect ? patternSelect.value : 'circles';
    const opacity = opacityInput ? opacityInput.value : '0.3';
    const fmt = formatHidden ? formatHidden.value : 'png';
    
    const mime = fmt === 'jpeg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png';
    const quality = fmt === 'jpeg' || fmt === 'webp' ? 0.92 : undefined;

    for (const [key, dims] of Object.entries(DEVICE_SIZES)) {
        const [w, h] = dims;
        const canvas = drawPatternToCanvas(w, h, bg, fg, pattern, opacity);
        lastCanvases[key] = canvas;
        
        const data = canvas.toDataURL(mime, quality);
        const imgEl = document.getElementById(`${key}-preview`);
        if (imgEl) {
            attachPreviewListeners(imgEl, imgEl.closest('.preview-item'));
            imgEl.src = data;
        }
    }
    
    // 显示预览区域和下载按钮
    if (previewGrid) previewGrid.classList.remove('hidden');
    if (downloadAllBtn) downloadAllBtn.classList.remove('hidden');
}

/**
 * 为预览图片添加加载监听器
 */
function attachPreviewListeners(imgElement, container) {
    if (!imgElement) return;
    
    imgElement.onload = null;
    imgElement.onerror = null;
    
    imgElement.onload = function() {
        imgElement.classList.add('loaded');
        if (container) container.classList.add('img-loaded');
    };
    
    imgElement.onerror = function() {
        imgElement.classList.remove('loaded');
        try { imgElement.src = ''; } catch(e) {}
        if (container) container.classList.remove('img-loaded');
    };
}

/**
 * 格式切换按钮初始化
 */
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

    // 检测 WebP 支持
    try {
        const cvs = document.createElement('canvas');
        const supported = cvs.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        const webpBtn = buttons.find(b => b.getAttribute('data-format') === 'webp');
        
        if (!supported && webpBtn) {
            webpBtn.classList.add('disabled');
            webpBtn.disabled = true;
            webpBtn.setAttribute('aria-disabled', 'true');
            
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

// 事件监听器
if (bgColorInput && fgColorInput && opacityInput) {
    [bgColorInput, fgColorInput, opacityInput, patternSelect].forEach(el => {
        if (el) el.addEventListener('input', () => { updatePreview(); });
    });
}

// 单个设备下载
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const device = btn.getAttribute('data-device');
        if (!device) return;
        
        const key = device.toLowerCase();
        let canvas = lastCanvases[key];
        
        if (!canvas) {
            const dims = DEVICE_SIZES[key];
            if (!dims) return;
            
            const bg = bgColorInput.value;
            const fg = fgColorInput.value;
            const pattern = patternSelect.value;
            const opacity = opacityInput.value;
            
            canvas = drawPatternToCanvas(dims[0], dims[1], bg, fg, pattern, opacity);
        }
        
        const fmt = formatHidden ? formatHidden.value : 'png';
        const mime = fmt === 'jpeg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png';
        const quality = fmt === 'jpeg' || fmt === 'webp' ? 0.92 : undefined;
        const data = canvas.toDataURL(mime, quality);
        
        const a = document.createElement('a');
        a.href = data;
        a.download = `${key}_wallpaper.${fmt === 'jpeg' ? 'jpg' : fmt}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});

// 工具栏按钮
const randomBtn = document.getElementById('randomize-button');
const generateBtn = document.getElementById('generate-button');
const undoBtn = document.getElementById('undo-button');
const redoBtn = document.getElementById('redo-button');

if (randomBtn) randomBtn.addEventListener('click', () => randomizeColors());
if (generateBtn) generateBtn.addEventListener('click', () => generatePreviews());
if (undoBtn) undoBtn.addEventListener('click', () => doUndo());
if (redoBtn) redoBtn.addEventListener('click', () => doRedo());

// 下载所有壁纸
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

            const bg = bgColorInput.value;
            const fg = fgColorInput.value;
            const pattern = patternSelect.value;
            const opacity = opacityInput.value;

            for (const [key, dims] of Object.entries(DEVICE_SIZES)) {
                const [w, h] = dims;
                let canvas = lastCanvases[key];
                
                if (!canvas) {
                    canvas = drawPatternToCanvas(w, h, bg, fg, pattern, opacity);
                }
                
                const data = canvas.toDataURL(
                    fmt === 'jpeg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png', 
                    quality
                );
                const base64 = data.split(',')[1];
                zip.file(`${key}_wallpaper.${ext}`, base64, { base64: true });
            }

            const blob = await zip.generateAsync({ type: 'blob' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `light_wallpapers.${ext}.zip`;
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

// 初始化
updatePreview();
renderRecommendations();
pushState(); // 初始化历史记录
initFormatToggles();

// 初始隐藏预览区域
if (previewGrid) previewGrid.classList.add('hidden');
if (downloadAllBtn) downloadAllBtn.classList.add('hidden');