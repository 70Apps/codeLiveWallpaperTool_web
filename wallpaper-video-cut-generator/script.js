// 设备尺寸配置
const DEVICE_SIZES = {
    'original': { width: 0, height: 0, name: 'Original Size' }, // 原画大小，实际尺寸在运行时确定
    'iphone-15-pro-max': { width: 1290, height: 2796, name: 'iPhone 15 Pro Max' },
    'iphone-15-pro': { width: 1179, height: 2556, name: 'iPhone 15 Pro' },
    'iphone-15': { width: 1179, height: 2556, name: 'iPhone 15' },
    'iphone-se': { width: 750, height: 1334, name: 'iPhone SE' },
    'ipad-pro-13': { width: 2064, height: 2752, name: 'iPad Pro 13"' },
    'ipad-pro-11': { width: 1668, height: 2388, name: 'iPad Pro 11"' },
    'ipad-air': { width: 1640, height: 2360, name: 'iPad Air' },
    'macbook-pro-16': { width: 3456, height: 2234, name: 'MacBook Pro 16"' },
    'macbook-pro-14': { width: 3024, height: 1964, name: 'MacBook Pro 14"' },
    'macbook-air': { width: 2560, height: 1664, name: 'MacBook Air' },
    'apple-watch-ultra': { width: 410, height: 502, name: 'Apple Watch Ultra' },
    'apple-watch-series-9': { width: 396, height: 484, name: 'Apple Watch Series 9' },
    'pad-2k': { width: 1440, height: 1920, name: '2K Pad' },
    'pad-1080p': { width: 900, height: 1200, name: '1080P Pad' },
    'pad-750p': { width: 750, height: 1000, name: '750P Pad' }
};

// 全局变量
let videoFile = null;
let videoElement = null;
let extractedFrames = [];
let selectedFrameIndex = -1;

// 缓存键名
const CACHE_KEYS = {
    DEVICE: 'wallpaper-video-cut-device',
    FORMAT: 'wallpaper-video-cut-format',
    QUALITY: 'wallpaper-video-cut-quality',
    DEVICE_MODE: 'wallpaper-video-cut-device-mode'
};

// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const videoInput = document.getElementById('videoInput');
const uploadSection = document.getElementById('uploadSection');
const videoSection = document.getElementById('videoSection');
const videoPlayer = document.getElementById('videoPlayer');
const frameCountInput = document.getElementById('frameCount');
const extractBtn = document.getElementById('extractBtn');
const changeVideoBtn = document.getElementById('changeVideoBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const framesSection = document.getElementById('framesSection');
const framesDivider = document.getElementById('framesDivider');
const framesGrid = document.getElementById('framesGrid');
const exportSection = document.getElementById('exportSection');
const exportDivider = document.getElementById('exportDivider');
const selectedCanvas = document.getElementById('selectedCanvas');
const exportBtn = document.getElementById('exportBtn');
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const qualityGroup = document.getElementById('qualityGroup');
const toggleDeviceMode = document.getElementById('toggleDeviceMode');
const modeText = document.getElementById('modeText');

// 初始化
function init() {
    // 文件选择
    videoInput.addEventListener('change', handleFileSelect);
    
    // 拖放功能
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => videoInput.click());
    
    // 按钮事件
    extractBtn.addEventListener('click', extractFrames);
    changeVideoBtn.addEventListener('click', resetApp);
    exportBtn.addEventListener('click', exportWallpaper);
    
    // 质量滑块 - input 事件用于实时显示，change 事件用于保存
    qualityInput.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value;
    });
    
    qualityInput.addEventListener('change', (e) => {
        saveToCache(CACHE_KEYS.QUALITY, e.target.value);
    });
    
    // 设备选择变化 - 保存到缓存并更新样式
    document.querySelectorAll('input[name="device"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            saveToCache(CACHE_KEYS.DEVICE, e.target.value);
            updateOriginalSizeHighlight();
        });
    });
    
    // 格式按钮点击事件
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const format = btn.dataset.format;
            
            // 更新按钮状态
            document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 保存到缓存
            saveToCache(CACHE_KEYS.FORMAT, format);
            
            // 处理质量显示
            if (format === 'jpeg' || format === 'webp') {
                qualityGroup.classList.remove('hidden');
            } else {
                qualityGroup.classList.add('hidden');
            }
        });
    });
    
    // 设备模式切换
    toggleDeviceMode.addEventListener('click', () => {
        const isAdvanced = document.body.classList.toggle('advanced-mode');
        modeText.textContent = isAdvanced ? 'Simple' : 'Advanced';
        saveToCache(CACHE_KEYS.DEVICE_MODE, isAdvanced ? 'advanced' : 'simple');
    });
    
    // 恢复上次的选择
    restoreUserPreferences();
}

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
        loadVideo(file);
    } else {
        alert('请选择有效的视频文件');
    }
}

// 拖放处理
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
        loadVideo(file);
    } else {
        alert('请拖放有效的视频文件');
    }
}

// 加载视频
function loadVideo(file) {
    videoFile = file;
    const url = URL.createObjectURL(file);
    
    videoPlayer.src = url;
    videoPlayer.load();
    
    videoPlayer.addEventListener('loadedmetadata', () => {
        uploadSection.classList.add('hidden');
        videoSection.classList.remove('hidden');
    });
}

// 提取帧
async function extractFrames() {
    const frameCount = parseInt(frameCountInput.value);
    
    if (frameCount < 2 || frameCount > 50) {
        alert('截取份数应在 2-50 之间');
        return;
    }
    
    extractBtn.disabled = true;
    progressBar.style.display = 'block';
    extractedFrames = [];
    framesGrid.innerHTML = '';
    
    const duration = videoPlayer.duration;
    const interval = duration / (frameCount + 1);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸为视频尺寸
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;
    
    for (let i = 1; i <= frameCount; i++) {
        const time = interval * i;
        
        // 更新进度
        const progress = (i / frameCount) * 100;
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
        
        // 跳转到指定时间并截图
        await seekAndCapture(videoPlayer, time, canvas, ctx, i);
    }
    
    // 完成
    progressBar.classList.add('hidden');
    extractBtn.disabled = false;
    framesDivider.classList.remove('hidden');
    framesSection.classList.remove('hidden');
    
    // 滚动到截图区域
    framesSection.scrollIntoView({ behavior: 'smooth' });
}

// 跳转并截图
function seekAndCapture(video, time, canvas, ctx, index) {
    return new Promise((resolve) => {
        video.currentTime = time;
        
        video.addEventListener('seeked', function onSeeked() {
            video.removeEventListener('seeked', onSeeked);
            
            // 绘制当前帧
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // 转换为图片
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                extractedFrames.push({ blob, url, canvas: canvas.cloneNode() });
                
                // 创建缩略图
                createFrameThumbnail(url, index);
                
                resolve();
            }, 'image/png');
        });
    });
}

// 创建帧缩略图
function createFrameThumbnail(url, index) {
    const frameItem = document.createElement('div');
    frameItem.className = 'frame-item';
    frameItem.dataset.index = index - 1;
    
    const img = document.createElement('img');
    img.src = url;
    
    const frameNumber = document.createElement('div');
    frameNumber.className = 'frame-number';
    frameNumber.textContent = `#${index}`;
    
    frameItem.appendChild(img);
    frameItem.appendChild(frameNumber);
    
    frameItem.addEventListener('click', () => selectFrame(index - 1));
    
    framesGrid.appendChild(frameItem);
}

// 选择帧
function selectFrame(index) {
    selectedFrameIndex = index;
    
    // 更新选中状态
    document.querySelectorAll('.frame-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // 显示导出区域
    exportDivider.classList.remove('hidden');
    exportSection.classList.remove('hidden');
    
    // 在画布上显示选中的帧
    const frame = extractedFrames[index];
    const img = new Image();
    img.onload = () => {
        selectedCanvas.width = img.width;
        selectedCanvas.height = img.height;
        const ctx = selectedCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // 更新原画大小显示
        const originalSizeText = document.getElementById('originalSizeText');
        if (originalSizeText) {
            originalSizeText.textContent = `${img.width}×${img.height}`;
        }
    };
    img.src = frame.url;
    
    // 滚动到导出区域
    exportSection.scrollIntoView({ behavior: 'smooth' });
}

// 获取当前选中的格式
function getSelectedFormat() {
    const activeBtn = document.querySelector('.format-btn.active');
    return activeBtn ? activeBtn.dataset.format : 'png';
}

// 保存到缓存
function saveToCache(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.warn('无法保存到缓存:', e);
    }
}

// 从缓存读取
function getFromCache(key, defaultValue) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (e) {
        console.warn('无法读取缓存:', e);
        return defaultValue;
    }
}

// 恢复用户偏好设置
function restoreUserPreferences() {
    // 恢复设备模式
    const savedMode = getFromCache(CACHE_KEYS.DEVICE_MODE, 'simple');
    if (savedMode === 'advanced') {
        document.body.classList.add('advanced-mode');
        modeText.textContent = 'Simple';
    } else {
        document.body.classList.remove('advanced-mode');
        modeText.textContent = 'Advanced';
    }
    
    // 恢复设备选择
    const savedDevice = getFromCache(CACHE_KEYS.DEVICE, 'original');
    const deviceRadio = document.querySelector(`input[name="device"][value="${savedDevice}"]`);
    if (deviceRadio) {
        deviceRadio.checked = true;
    }
    
    // 恢复格式选择
    const savedFormat = getFromCache(CACHE_KEYS.FORMAT, 'png');
    const formatBtn = document.querySelector(`.format-btn[data-format="${savedFormat}"]`);
    if (formatBtn) {
        document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
        formatBtn.classList.add('active');
        
        // 处理质量显示
        if (savedFormat === 'jpeg' || savedFormat === 'webp') {
            qualityGroup.classList.remove('hidden');
        } else {
            qualityGroup.classList.add('hidden');
        }
    }
    
    // 恢复质量设置
    const savedQuality = getFromCache(CACHE_KEYS.QUALITY, '90');
    qualityInput.value = savedQuality;
    qualityValue.textContent = savedQuality;
    
    // 更新原画大小选项的高亮状态
    updateOriginalSizeHighlight();
}

// 更新原画大小选项的高亮状态
function updateOriginalSizeHighlight() {
    const originalOption = document.querySelector('.device-option.original-size');
    const originalRadio = document.querySelector('input[name="device"][value="original"]');
    
    if (originalOption && originalRadio) {
        if (originalRadio.checked) {
            originalOption.classList.add('selected');
        } else {
            originalOption.classList.remove('selected');
        }
    }
}

// 导出壁纸
async function exportWallpaper() {
    if (selectedFrameIndex === -1) {
        alert('请先选择一个画面');
        return;
    }
    
    exportBtn.disabled = true;
    exportBtn.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Generating...
    `;
    
    // 获取选中的设备和格式
    const deviceValue = document.querySelector('input[name="device"]:checked').value;
    const format = getSelectedFormat();
    const quality = parseInt(qualityInput.value) / 100;
    
    const device = DEVICE_SIZES[deviceValue];
    const frame = extractedFrames[selectedFrameIndex];
    
    // 加载原始图片
    const img = new Image();
    img.src = frame.url;
    
    await new Promise(resolve => {
        img.onload = resolve;
    });
    
    // 如果选择原画大小，直接导出原图
    if (deviceValue === 'original') {
        // 创建输出画布（原始尺寸）
        const outputCanvas = document.createElement('canvas');
        const ctx = outputCanvas.getContext('2d');
        
        outputCanvas.width = img.width;
        outputCanvas.height = img.height;
        
        // 绘制原图
        ctx.drawImage(img, 0, 0);
        
        // 转换为 Blob 并下载
        const mimeType = format === 'png' ? 'image/png' : 
                         format === 'jpeg' ? 'image/jpeg' : 'image/webp';
        
        outputCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wallpaper-original-${img.width}x${img.height}-${Date.now()}.${format}`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            exportBtn.disabled = false;
            exportBtn.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Export Wallpaper
            `;
        }, mimeType, format === 'png' ? undefined : quality);
        
        return;
    }
    
    // 创建输出画布（设备尺寸）
    const outputCanvas = document.createElement('canvas');
    const ctx = outputCanvas.getContext('2d');
    
    outputCanvas.width = device.width;
    outputCanvas.height = device.height;
    
    // 计算缩放和裁剪
    const imgRatio = img.width / img.height;
    const deviceRatio = device.width / device.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgRatio > deviceRatio) {
        // 图片更宽，按高度缩放
        drawHeight = device.height;
        drawWidth = img.width * (device.height / img.height);
        offsetX = (device.width - drawWidth) / 2;
        offsetY = 0;
    } else {
        // 图片更高，按宽度缩放
        drawWidth = device.width;
        drawHeight = img.height * (device.width / img.width);
        offsetX = 0;
        offsetY = (device.height - drawHeight) / 2;
    }
    
    // 绘制图片（居中裁剪）
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    
    // 转换为 Blob 并下载
    const mimeType = format === 'png' ? 'image/png' : 
                     format === 'jpeg' ? 'image/jpeg' : 'image/webp';
    
    outputCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wallpaper-${device.name.replace(/\s+/g, '-')}-${Date.now()}.${format}`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        exportBtn.disabled = false;
        exportBtn.innerHTML = `
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Export Wallpaper
        `;
    }, mimeType, format === 'png' ? undefined : quality);
}

// 重置应用
function resetApp() {
    // 清理
    if (videoPlayer.src) {
        URL.revokeObjectURL(videoPlayer.src);
    }
    
    extractedFrames.forEach(frame => {
        URL.revokeObjectURL(frame.url);
    });
    
    // 重置状态
    videoFile = null;
    extractedFrames = [];
    selectedFrameIndex = -1;
    videoPlayer.src = '';
    framesGrid.innerHTML = '';
    
    // 重置显示
    uploadSection.classList.remove('hidden');
    videoSection.classList.add('hidden');
    framesDivider.classList.add('hidden');
    framesSection.classList.add('hidden');
    exportDivider.classList.add('hidden');
    exportSection.classList.add('hidden');
    progressBar.classList.add('hidden');
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 启动应用
init();
