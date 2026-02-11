// 发光壁纸生成器脚本
// 设备尺寸定义
const DEVICE_SIZES = {
    iphone: [1980, 4302],
    ipad: [2064, 1548], 
    macbook: [4512, 2538],
    applewatch: [1664, 1984]
};

// 推荐的深色背景和浅色前景组合
const GLOW_COLOR_COMBINATIONS = [
    { bg: '#0f0f23', fg: '#3b82f6', name: 'Deep Blue' },
    { bg: '#1a0f1a', fg: '#ec4899', name: 'Pink Glow' },
    { bg: '#0f1a0f', fg: '#10b981', name: 'Green Aurora' },
    { bg: '#1a1a0f', fg: '#f59e0b', name: 'Golden Light' },
    { bg: '#1a0f0f', fg: '#ef4444', name: 'Red Ember' },
    { bg: '#0f1a1a', fg: '#06b6d4', name: 'Cyan Wave' },
    { bg: '#1a0f1a', fg: '#8b5cf6', name: 'Purple Haze' },
    { bg: '#0a0a0a', fg: '#ffffff', name: 'Pure White' },
    { bg: '#1e1b4b', fg: '#60a5fa', name: 'Night Sky' },
    { bg: '#1f2937', fg: '#34d399', name: 'Matrix Green' },
    { bg: '#7c2d12', fg: '#fb923c', name: 'Fire Glow' },
    { bg: '#1e293b', fg: '#0ea5e9', name: 'Ocean Deep' }
];

// DOM 元素
const bgColorInput = document.getElementById('bg-color');
const fgColorInput = document.getElementById('fg-color');
const glowIntensityInput = document.getElementById('glow-intensity');
const previewScreen = document.getElementById('preview-screen');
const bgColorDisplay = document.getElementById('bg-color-display');
const fgColorDisplay = document.getElementById('fg-color-display');
const glowValueSpan = document.getElementById('glow-value');
const glowDisplaySpan = document.getElementById('glow-display');
const directionValueSpan = document.getElementById('direction-value');
const directionDisplaySpan = document.getElementById('direction-display');
const directionButtons = document.querySelectorAll('.direction-btn');
const formatButtons = document.querySelectorAll('.format-btn');
const imageFormatInput = document.getElementById('image-format');
const swapColorsBtn = document.getElementById('swap-colors-btn');
const randomizeBtn = document.getElementById('randomize-btn');
const generateBtn = document.getElementById('generate-btn');
const devicePreviews = document.getElementById('device-previews');
const downloadAllBtn = document.getElementById('download-all-btn');

// 当前状态
let currentDirection = 135;
let lastCanvases = {};

/**
 * 更新预览显示
 */
function updatePreview() {
    const bgColor = bgColorInput.value;
    const fgColor = fgColorInput.value;
    const glowIntensity = parseInt(glowIntensityInput.value);
    
    // 更新颜色显示
    bgColorDisplay.style.backgroundColor = bgColor;
    fgColorDisplay.style.backgroundColor = fgColor;
    
    // 更新数值显示
    glowValueSpan.textContent = glowIntensity;
    glowDisplaySpan.textContent = `${glowIntensity}%`;
    directionValueSpan.textContent = currentDirection;
    directionDisplaySpan.textContent = `${currentDirection}°`;
    
    // 更新预览屏幕
    const glowOpacity = glowIntensity / 100;
    const glowColor = fgColor + Math.round(glowOpacity * 255).toString(16).padStart(2, '0');
    
    previewScreen.style.background = `linear-gradient(${currentDirection}deg, ${bgColor} 0%, ${mixColors(bgColor, fgColor, 0.3)} 50%, ${mixColors(bgColor, fgColor, 0.6)} 100%)`;
    previewScreen.style.boxShadow = `
        inset 0 0 50px ${glowColor},
        0 0 20px ${fgColor}${Math.round(glowOpacity * 128).toString(16).padStart(2, '0')}
    `;
}

/**
 * 混合两个颜色
 */
function mixColors(color1, color2, ratio) {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * 在画布上绘制发光渐变壁纸
 */
function drawGlowWallpaper(width, height, bgColor, fgColor, direction, glowIntensity) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // 计算渐变方向
    const angleRad = (direction % 360) * Math.PI / 180;
    const vx = Math.sin(angleRad);
    const vy = -Math.cos(angleRad);
    
    // 计算渐变端点
    const corners = [
        [0, 0], [width, 0], [0, height], [width, height]
    ];
    
    const projections = corners.map(([x, y]) => x * vx + y * vy);
    const minProj = Math.min(...projections);
    const maxProj = Math.max(...projections);
    
    const x0 = vx * minProj;
    const y0 = vy * minProj;
    const x1 = vx * maxProj;
    const y1 = vy * maxProj;
    
    // 创建基础渐变
    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(0.3, mixColors(bgColor, fgColor, 0.2));
    gradient.addColorStop(0.7, mixColors(bgColor, fgColor, 0.4));
    gradient.addColorStop(1, mixColors(bgColor, fgColor, 0.6));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 添加边缘发光效果
    if (glowIntensity > 0) {
        const glowOpacity = glowIntensity / 100;
        const glowSize = Math.min(width, height) * 0.3;
        
        // 创建径向渐变用于边缘发光
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        
        const radialGradient = ctx.createRadialGradient(
            centerX, centerY, maxRadius * 0.3,
            centerX, centerY, maxRadius
        );
        
        radialGradient.addColorStop(0, `${fgColor}00`);
        radialGradient.addColorStop(0.7, `${fgColor}${Math.round(glowOpacity * 64).toString(16).padStart(2, '0')}`);
        radialGradient.addColorStop(1, `${fgColor}${Math.round(glowOpacity * 128).toString(16).padStart(2, '0')}`);
        
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, width, height);
        
        // 添加边缘高光
        ctx.globalCompositeOperation = 'overlay';
        const edgeGradient = ctx.createRadialGradient(
            centerX, centerY, maxRadius * 0.8,
            centerX, centerY, maxRadius
        );
        
        edgeGradient.addColorStop(0, `${fgColor}00`);
        edgeGradient.addColorStop(1, `${fgColor}${Math.round(glowOpacity * 96).toString(16).padStart(2, '0')}`);
        
        ctx.fillStyle = edgeGradient;
        ctx.fillRect(0, 0, width, height);
        
        ctx.globalCompositeOperation = 'source-over';
    }
    
    return canvas;
}

/**
 * 设置渐变方向
 */
function setDirection(angle) {
    currentDirection = angle;
    
    // 更新按钮状态
    directionButtons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.angle) === angle) {
            btn.classList.add('active');
        }
    });
    
    updatePreview();
}

/**
 * 生成所有设备的壁纸预览
 */
function generateWallpapers() {
    const bgColor = bgColorInput.value;
    const fgColor = fgColorInput.value;
    const glowIntensity = parseInt(glowIntensityInput.value);
    const { mimeType, quality } = getImageFormat();
    
    // 清空之前的画布
    lastCanvases = {};
    
    // 为每个设备生成壁纸
    Object.entries(DEVICE_SIZES).forEach(([device, [width, height]]) => {
        const canvas = drawGlowWallpaper(width, height, bgColor, fgColor, currentDirection, glowIntensity);
        lastCanvases[device] = canvas;
        
        // 更新预览图
        const previewImg = document.getElementById(`${device}-preview`);
        if (previewImg) {
            const dataUrl = canvas.toDataURL(mimeType, quality);
            previewImg.src = dataUrl;
            previewImg.onload = () => {
                previewImg.classList.add('loaded');
                previewImg.closest('.device-preview').classList.add('loaded');
            };
        }
    });
    
    // 显示设备预览区域
    devicePreviews.classList.remove('hidden');
}

/**
 * 随机选择颜色组合
 */
function randomizeColors() {
    const combo = GLOW_COLOR_COMBINATIONS[Math.floor(Math.random() * GLOW_COLOR_COMBINATIONS.length)];
    bgColorInput.value = combo.bg;
    fgColorInput.value = combo.fg;
    
    // 随机发光强度
    const randomGlow = Math.floor(Math.random() * 60) + 20; // 20-80%
    glowIntensityInput.value = randomGlow;
    
    // 随机方向
    const directions = [0, 45, 90, 135, 180];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    setDirection(randomDirection);
    
    updatePreview();
}

/**
 * 交换前景色和背景色
 */
function swapColors() {
    const bgColor = bgColorInput.value;
    const fgColor = fgColorInput.value;
    
    bgColorInput.value = fgColor;
    fgColorInput.value = bgColor;
    
    updatePreview();
}

/**
 * 初始化格式选择按钮
 */
function initFormatButtons() {
    // 检测 WebP 支持
    const canvas = document.createElement('canvas');
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    formatButtons.forEach(btn => {
        const format = btn.dataset.format;
        
        // 禁用不支持的 WebP
        if (format === 'webp' && !supportsWebP) {
            btn.classList.add('disabled');
            btn.disabled = true;
            btn.title = 'WebP not supported in this browser';
        }
        
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            
            // 更新按钮状态
            formatButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新隐藏输入
            imageFormatInput.value = format;
        });
    });
}

/**
 * 获取当前选择的图片格式信息
 */
function getImageFormat() {
    const format = imageFormatInput.value;
    let mimeType, quality, extension;
    
    switch (format) {
        case 'jpeg':
            mimeType = 'image/jpeg';
            quality = 0.92;
            extension = 'jpg';
            break;
        case 'webp':
            mimeType = 'image/webp';
            quality = 0.92;
            extension = 'webp';
            break;
        default:
            mimeType = 'image/png';
            quality = undefined;
            extension = 'png';
    }
    
    return { mimeType, quality, extension };
}
function setDirection(angle) {
    currentDirection = angle;
    
    // 更新按钮状态
    directionButtons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.angle) === angle) {
            btn.classList.add('active');
        }
    });
    
    updatePreview();
}

/**
 * 下载单个设备的壁纸
 */
function downloadWallpaper(device) {
    const { mimeType, quality, extension } = getImageFormat();
    let canvas = lastCanvases[device];
    
    if (!canvas) {
        // 如果没有生成过，现在生成
        const bgColor = bgColorInput.value;
        const fgColor = fgColorInput.value;
        const glowIntensity = parseInt(glowIntensityInput.value);
        const [width, height] = DEVICE_SIZES[device];
        
        canvas = drawGlowWallpaper(width, height, bgColor, fgColor, currentDirection, glowIntensity);
        lastCanvases[device] = canvas;
    }
    
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${device}_glow_wallpaper.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 下载所有壁纸为ZIP文件
 */
async function downloadAllWallpapers() {
    if (typeof JSZip === 'undefined') {
        alert('JSZip library not loaded');
        return;
    }
    
    try {
        downloadAllBtn.disabled = true;
        downloadAllBtn.textContent = 'Generating...';
        
        const zip = new JSZip();
        const bgColor = bgColorInput.value;
        const fgColor = fgColorInput.value;
        const glowIntensity = parseInt(glowIntensityInput.value);
        const { mimeType, quality, extension } = getImageFormat();
        
        // 为每个设备生成壁纸并添加到ZIP
        for (const [device, [width, height]] of Object.entries(DEVICE_SIZES)) {
            let canvas = lastCanvases[device];
            if (!canvas) {
                canvas = drawGlowWallpaper(width, height, bgColor, fgColor, currentDirection, glowIntensity);
                lastCanvases[device] = canvas;
            }
            
            const dataUrl = canvas.toDataURL(mimeType, quality);
            const base64Data = dataUrl.split(',')[1];
            zip.file(`${device}_glow_wallpaper.${extension}`, base64Data, { base64: true });
        }
        
        // 生成并下载ZIP文件
        const blob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `glow_wallpapers_${extension}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
    } catch (error) {
        console.error('Error generating ZIP:', error);
        alert('Error generating wallpapers. Please try again.');
    } finally {
        downloadAllBtn.disabled = false;
        downloadAllBtn.textContent = 'Download All';
    }
}

// 事件监听器
bgColorInput.addEventListener('input', updatePreview);
fgColorInput.addEventListener('input', updatePreview);
glowIntensityInput.addEventListener('input', updatePreview);

directionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const angle = parseInt(btn.dataset.angle);
        setDirection(angle);
    });
});

swapColorsBtn.addEventListener('click', swapColors);
randomizeBtn.addEventListener('click', randomizeColors);
generateBtn.addEventListener('click', generateWallpapers);
downloadAllBtn.addEventListener('click', downloadAllWallpapers);

// 单个设备下载按钮
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const device = btn.dataset.device;
        downloadWallpaper(device);
    });
});

// 初始化
initFormatButtons();
updatePreview();

// 初始隐藏设备预览
devicePreviews.classList.add('hidden');