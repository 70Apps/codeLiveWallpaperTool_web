// 格子壁纸生成器脚本

// 设备尺寸定义
const DEVICE_SIZES = {
    iphone: [1980, 4302],
    ipad: [2064, 1548], 
    macbook: [4512, 2538],
    applewatch: [1664, 1984]
};

// 推荐的颜色组合
const GRID_COLOR_COMBINATIONS = [
    { bg: '#f8fafc', grid: '#3b82f6', name: 'Classic Blue' },
    { bg: '#ffffff', grid: '#1f2937', name: 'Dark Grid' },
    { bg: '#f0f9ff', grid: '#0ea5e9', name: 'Sky Blue' },
    { bg: '#fef3c7', grid: '#f59e0b', name: 'Golden Grid' },
    { bg: '#f0fdf4', grid: '#10b981', name: 'Green Lines' },
    { bg: '#fdf2f8', grid: '#ec4899', name: 'Pink Pattern' },
    { bg: '#f5f3ff', grid: '#8b5cf6', name: 'Purple Grid' },
    { bg: '#fff7ed', grid: '#ea580c', name: 'Orange Lines' },
    { bg: '#1f2937', grid: '#60a5fa', name: 'Dark Blue' },
    { bg: '#0f172a', grid: '#34d399', name: 'Dark Green' },
    { bg: '#1a1a1a', grid: '#fbbf24', name: 'Dark Gold' },
    { bg: '#18181b', grid: '#f472b6', name: 'Dark Pink' }
];

// DOM 元素
const bgColorInput = document.getElementById('bg-color');
const gridColorInput = document.getElementById('grid-color');
const gridSizeInput = document.getElementById('grid-size');
const lineWidthInput = document.getElementById('line-width');
const gridOpacityInput = document.getElementById('grid-opacity');
const previewScreen = document.getElementById('preview-screen');
const bgColorDisplay = document.getElementById('bg-color-display');
const gridColorDisplay = document.getElementById('grid-color-display');
const sizeValueSpan = document.getElementById('size-value');
const widthValueSpan = document.getElementById('width-value');
const opacityValueSpan = document.getElementById('opacity-value');
const sizeDisplaySpan = document.getElementById('size-display');
const widthDisplaySpan = document.getElementById('width-display');
const opacityDisplaySpan = document.getElementById('opacity-display');
const styleButtons = document.querySelectorAll('.style-btn');
const formatButtons = document.querySelectorAll('.format-btn');
const imageFormatInput = document.getElementById('image-format');
const swapColorsBtn = document.getElementById('swap-colors-btn');
const randomizeBtn = document.getElementById('randomize-btn');
const generateBtn = document.getElementById('generate-btn');
const devicePreviews = document.getElementById('device-previews');
const downloadAllBtn = document.getElementById('download-all-btn');

// 当前状态
let currentStyle = 'square';
let lastCanvases = {};

/**
 * 更新预览显示
 */
function updatePreview() {
    const bgColor = bgColorInput.value;
    const gridColor = gridColorInput.value;
    const gridSize = parseInt(gridSizeInput.value);
    const lineWidth = parseInt(lineWidthInput.value);
    const opacity = parseInt(gridOpacityInput.value);
    
    // 更新颜色显示
    bgColorDisplay.style.backgroundColor = bgColor;
    gridColorDisplay.style.backgroundColor = gridColor;
    
    // 更新数值显示
    sizeValueSpan.textContent = gridSize;
    widthValueSpan.textContent = lineWidth;
    opacityValueSpan.textContent = opacity;
    sizeDisplaySpan.textContent = `${gridSize}px`;
    widthDisplaySpan.textContent = `${lineWidth}px`;
    opacityDisplaySpan.textContent = `${opacity}%`;
    
    // 更新预览屏幕
    updatePreviewPattern(bgColor, gridColor, gridSize, lineWidth, opacity);
}

/**
 * 更新预览图案
 */
function updatePreviewPattern(bgColor, gridColor, gridSize, lineWidth, opacity) {
    const gridColorWithOpacity = gridColor + Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');
    
    previewScreen.style.backgroundColor = bgColor;
    
    switch (currentStyle) {
        case 'square':
            previewScreen.style.backgroundImage = `
                repeating-linear-gradient(0deg, transparent 0px, transparent ${gridSize - lineWidth}px, ${gridColorWithOpacity} ${gridSize - lineWidth}px, ${gridColorWithOpacity} ${gridSize}px),
                repeating-linear-gradient(90deg, transparent 0px, transparent ${gridSize - lineWidth}px, ${gridColorWithOpacity} ${gridSize - lineWidth}px, ${gridColorWithOpacity} ${gridSize}px)
            `;
            break;
        case 'dots':
            previewScreen.style.backgroundImage = `radial-gradient(circle at center, ${gridColorWithOpacity} ${lineWidth}px, transparent ${lineWidth + 1}px)`;
            previewScreen.style.backgroundSize = `${gridSize}px ${gridSize}px`;
            break;
        case 'lines-h':
            previewScreen.style.backgroundImage = `repeating-linear-gradient(0deg, transparent 0px, transparent ${gridSize - lineWidth}px, ${gridColorWithOpacity} ${gridSize - lineWidth}px, ${gridColorWithOpacity} ${gridSize}px)`;
            break;
        case 'lines-v':
            previewScreen.style.backgroundImage = `repeating-linear-gradient(90deg, transparent 0px, transparent ${gridSize - lineWidth}px, ${gridColorWithOpacity} ${gridSize - lineWidth}px, ${gridColorWithOpacity} ${gridSize}px)`;
            break;
    }
}

/**
 * 交换前景色和背景色
 */
function swapColors() {
    const bgColor = bgColorInput.value;
    const gridColor = gridColorInput.value;
    
    bgColorInput.value = gridColor;
    gridColorInput.value = bgColor;
    
    updatePreview();
}

/**
 * 随机选择颜色组合和设置
 */
function randomizeColors() {
    const combo = GRID_COLOR_COMBINATIONS[Math.floor(Math.random() * GRID_COLOR_COMBINATIONS.length)];
    bgColorInput.value = combo.bg;
    gridColorInput.value = combo.grid;
    
    // 随机网格大小
    const randomSize = Math.floor(Math.random() * 60) + 15; // 15-75px
    gridSizeInput.value = randomSize;
    
    // 随机线宽
    const randomWidth = Math.floor(Math.random() * 5) + 1; // 1-5px
    lineWidthInput.value = randomWidth;
    
    // 随机透明度
    const randomOpacity = Math.floor(Math.random() * 60) + 40; // 40-100%
    gridOpacityInput.value = randomOpacity;
    
    // 随机样式
    const styles = ['square', 'dots', 'lines-h', 'lines-v'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    setGridStyle(randomStyle);
    
    updatePreview();
}

/**
 * 设置网格样式
 */
function setGridStyle(style) {
    currentStyle = style;
    
    // 更新按钮状态
    styleButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.style === style) {
            btn.classList.add('active');
        }
    });
    
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

/**
 * 在画布上绘制网格图案
 */
function drawGridPattern(width, height, bgColor, gridColor, gridSize, lineWidth, opacity, style) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // 绘制背景
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // 设置网格颜色和透明度
    const gridColorWithOpacity = gridColor + Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');
    ctx.fillStyle = gridColorWithOpacity;
    ctx.strokeStyle = gridColorWithOpacity;
    ctx.lineWidth = lineWidth;
    
    switch (style) {
        case 'square':
            drawSquareGrid(ctx, width, height, gridSize, lineWidth);
            break;
        case 'dots':
            drawDotGrid(ctx, width, height, gridSize, lineWidth);
            break;
        case 'lines-h':
            drawHorizontalLines(ctx, width, height, gridSize, lineWidth);
            break;
        case 'lines-v':
            drawVerticalLines(ctx, width, height, gridSize, lineWidth);
            break;
    }
    
    return canvas;
}

/**
 * 绘制方格网格
 */
function drawSquareGrid(ctx, width, height, gridSize, lineWidth) {
    // 绘制垂直线
    for (let x = 0; x <= width; x += gridSize) {
        ctx.fillRect(x, 0, lineWidth, height);
    }
    
    // 绘制水平线
    for (let y = 0; y <= height; y += gridSize) {
        ctx.fillRect(0, y, width, lineWidth);
    }
}

/**
 * 绘制点阵网格
 */
function drawDotGrid(ctx, width, height, gridSize, lineWidth) {
    const radius = lineWidth;
    
    for (let x = gridSize / 2; x < width; x += gridSize) {
        for (let y = gridSize / 2; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

/**
 * 绘制水平线
 */
function drawHorizontalLines(ctx, width, height, gridSize, lineWidth) {
    for (let y = 0; y <= height; y += gridSize) {
        ctx.fillRect(0, y, width, lineWidth);
    }
}

/**
 * 绘制垂直线
 */
function drawVerticalLines(ctx, width, height, gridSize, lineWidth) {
    for (let x = 0; x <= width; x += gridSize) {
        ctx.fillRect(x, 0, lineWidth, height);
    }
}

/**
 * 生成所有设备的壁纸预览
 */
function generateWallpapers() {
    const bgColor = bgColorInput.value;
    const gridColor = gridColorInput.value;
    const gridSize = parseInt(gridSizeInput.value);
    const lineWidth = parseInt(lineWidthInput.value);
    const opacity = parseInt(gridOpacityInput.value);
    const { mimeType, quality } = getImageFormat();
    
    // 清空之前的画布
    lastCanvases = {};
    
    // 为每个设备生成壁纸
    Object.entries(DEVICE_SIZES).forEach(([device, [width, height]]) => {
        const canvas = drawGridPattern(width, height, bgColor, gridColor, gridSize, lineWidth, opacity, currentStyle);
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
 * 下载单个设备的壁纸
 */
function downloadWallpaper(device) {
    const { mimeType, quality, extension } = getImageFormat();
    let canvas = lastCanvases[device];
    
    if (!canvas) {
        // 如果没有生成过，现在生成
        const bgColor = bgColorInput.value;
        const gridColor = gridColorInput.value;
        const gridSize = parseInt(gridSizeInput.value);
        const lineWidth = parseInt(lineWidthInput.value);
        const opacity = parseInt(gridOpacityInput.value);
        const [width, height] = DEVICE_SIZES[device];
        
        canvas = drawGridPattern(width, height, bgColor, gridColor, gridSize, lineWidth, opacity, currentStyle);
        lastCanvases[device] = canvas;
    }
    
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${device}_grid_wallpaper.${extension}`;
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
        const gridColor = gridColorInput.value;
        const gridSize = parseInt(gridSizeInput.value);
        const lineWidth = parseInt(lineWidthInput.value);
        const opacity = parseInt(gridOpacityInput.value);
        const { mimeType, quality, extension } = getImageFormat();
        
        // 为每个设备生成壁纸并添加到ZIP
        for (const [device, [width, height]] of Object.entries(DEVICE_SIZES)) {
            let canvas = lastCanvases[device];
            if (!canvas) {
                canvas = drawGridPattern(width, height, bgColor, gridColor, gridSize, lineWidth, opacity, currentStyle);
                lastCanvases[device] = canvas;
            }
            
            const dataUrl = canvas.toDataURL(mimeType, quality);
            const base64Data = dataUrl.split(',')[1];
            zip.file(`${device}_grid_wallpaper.${extension}`, base64Data, { base64: true });
        }
        
        // 生成并下载ZIP文件
        const blob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `grid_wallpapers_${extension}.zip`;
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
gridColorInput.addEventListener('input', updatePreview);
gridSizeInput.addEventListener('input', updatePreview);
lineWidthInput.addEventListener('input', updatePreview);
gridOpacityInput.addEventListener('input', updatePreview);

styleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const style = btn.dataset.style;
        setGridStyle(style);
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