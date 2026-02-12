// 分辨率配置（目标高度）
const RESOLUTIONS = {
    '720': 720,
    '1080': 1080,
    '2k': 1440
};

// 全局变量
let video1File = null;
let video2File = null;
let video1Element = null;
let video2Element = null;
let outputBlob = null;
let ffmpeg = null;
let ffmpegLoaded = false;

// DOM 元素
const uploadArea1 = document.getElementById('uploadArea1');
const uploadArea2 = document.getElementById('uploadArea2');
const videoInput1 = document.getElementById('videoInput1');
const videoInput2 = document.getElementById('videoInput2');
const uploadBtn1 = document.getElementById('uploadBtn1');
const uploadBtn2 = document.getElementById('uploadBtn2');
const preview1 = document.getElementById('preview1');
const preview2 = document.getElementById('preview2');
const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');
const info1 = document.getElementById('info1');
const info2 = document.getElementById('info2');
const remove1 = document.getElementById('remove1');
const remove2 = document.getElementById('remove2');
const settingsSection = document.getElementById('settingsSection');
const previewSection = document.getElementById('previewSection');
const progressSection = document.getElementById('progressSection');
const completeSection = document.getElementById('completeSection');
const processBtn = document.getElementById('processBtn');
const updatePreviewBtn = document.getElementById('updatePreviewBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const previewCanvas = document.getElementById('previewCanvas');
const previewTime = document.getElementById('previewTime');
const previewTimeText = document.getElementById('previewTimeText');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const duration1Elem = document.getElementById('duration1');
const duration2Elem = document.getElementById('duration2');
const outputDurationElem = document.getElementById('outputDuration');
const originalSizeElem = document.getElementById('originalSize');
const size720Elem = document.getElementById('size720');
const size1080Elem = document.getElementById('size1080');
const size2kElem = document.getElementById('size2k');
const outputInfo = document.getElementById('outputInfo');
const splitRatio = document.getElementById('splitRatio');
const topRatio = document.getElementById('topRatio');
const bottomRatio = document.getElementById('bottomRatio');

// 初始化
async function init() {
    // 文件选择
    videoInput1.addEventListener('change', (e) => handleFileSelect(e, 1));
    videoInput2.addEventListener('change', (e) => handleFileSelect(e, 2));
    
    // 上传按钮点击（阻止冒泡）
    uploadBtn1.addEventListener('click', (e) => {
        e.stopPropagation();
        videoInput1.click();
    });
    uploadBtn2.addEventListener('click', (e) => {
        e.stopPropagation();
        videoInput2.click();
    });
    
    // 拖放功能
    setupDragDrop(uploadArea1, 1);
    setupDragDrop(uploadArea2, 2);
    
    // 移除按钮
    remove1.addEventListener('click', () => removeVideo(1));
    remove2.addEventListener('click', () => removeVideo(2));
    
    // 处理按钮
    processBtn.addEventListener('click', processVideos);
    updatePreviewBtn.addEventListener('click', updatePreview);
    downloadBtn.addEventListener('click', downloadVideo);
    resetBtn.addEventListener('click', resetApp);
    
    // 预览时间轴
    previewTime.addEventListener('input', updatePreview);
    
    // 比例调整
    splitRatio.addEventListener('input', (e) => {
        const ratio = parseInt(e.target.value);
        topRatio.textContent = ratio;
        bottomRatio.textContent = 100 - ratio;
        
        // 如果预览已显示，更新预览
        if (previewSection.style.display === 'block') {
            drawPreview();
        }
    });
    
    // 加载 FFmpeg
    await loadFFmpeg();
}

// 加载 FFmpeg
async function loadFFmpeg() {
    try {
        const { FFmpeg } = FFmpegWASM;
        ffmpeg = new FFmpeg();
        
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        
        ffmpeg.on('progress', ({ progress }) => {
            if (progressSection.style.display === 'block') {
                const percent = Math.round(progress * 100);
                progressFill.style.width = percent + '%';
                progressPercent.textContent = percent + '%';
            }
        });
        
        progressText.textContent = '正在加载 FFmpeg...';
        await ffmpeg.load();
        ffmpegLoaded = true;
        console.log('FFmpeg loaded successfully');
    } catch (error) {
        console.error('Failed to load FFmpeg:', error);
        alert('FFmpeg 加载失败，将使用备用方案（WebM 格式）');
    }
}

// 计算输出尺寸（保持比例）
function calculateOutputSize(video1Width, video1Height, video2Width, video2Height, targetHeight) {
    // 计算两个视频的宽高比
    const ratio1 = video1Width / video1Height;
    const ratio2 = video2Width / video2Height;
    
    // 使用较大的宽高比（更宽的视频）
    const targetRatio = Math.max(ratio1, ratio2);
    
    // 根据目标高度计算宽度
    const outputWidth = Math.round(targetHeight * targetRatio);
    const outputHeight = targetHeight;
    
    // 确保是偶数（视频编码要求）
    return {
        width: outputWidth % 2 === 0 ? outputWidth : outputWidth + 1,
        height: outputHeight % 2 === 0 ? outputHeight : outputHeight + 1
    };
}

// 设置拖放
function setupDragDrop(area, videoNum) {
    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('drag-over');
    });
    
    area.addEventListener('dragleave', (e) => {
        e.preventDefault();
        area.classList.remove('drag-over');
    });
    
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            loadVideo(file, videoNum);
        } else {
            alert('请拖放有效的视频文件');
        }
    });
    
    // 移除点击事件，避免与按钮冲突
    // 用户可以点击按钮或拖放文件
}

// 处理文件选择
function handleFileSelect(e, videoNum) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
        loadVideo(file, videoNum);
    } else {
        alert('请选择有效的视频文件');
    }
}

// 加载视频
function loadVideo(file, videoNum) {
    const videoElem = videoNum === 1 ? video1 : video2;
    const previewElem = videoNum === 1 ? preview1 : preview2;
    const uploadAreaElem = videoNum === 1 ? uploadArea1 : uploadArea2;
    const infoElem = videoNum === 1 ? info1 : info2;
    
    // 清理旧的 URL
    if (videoElem.src) {
        URL.revokeObjectURL(videoElem.src);
    }
    
    const url = URL.createObjectURL(file);
    
    if (videoNum === 1) {
        video1File = file;
        video1Element = videoElem;
    } else {
        video2File = file;
        video2Element = videoElem;
    }
    
    videoElem.src = url;
    videoElem.load();
    
    // 使用 once: true 确保事件只触发一次
    videoElem.addEventListener('loadedmetadata', () => {
        uploadAreaElem.style.display = 'none';
        previewElem.style.display = 'block';
        
        // 显示视频信息
        const duration = formatTime(videoElem.duration);
        const size = (file.size / (1024 * 1024)).toFixed(2);
        infoElem.innerHTML = `
            <div>📐 尺寸: ${videoElem.videoWidth} × ${videoElem.videoHeight}</div>
            <div>⏱️ 时长: ${duration}</div>
            <div>💾 大小: ${size} MB</div>
        `;
        
        // 更新时长显示
        if (videoNum === 1) {
            duration1Elem.textContent = duration;
        } else {
            duration2Elem.textContent = duration;
        }
        
        // 检查是否两个视频都已加载
        checkBothVideosLoaded();
    }, { once: true });
}

// 检查两个视频是否都已加载
function checkBothVideosLoaded() {
    if (video1File && video2File && video1Element && video2Element) {
        // 显示设置区域
        settingsSection.style.display = 'block';
        
        const v1Width = video1Element.videoWidth;
        const v1Height = video1Element.videoHeight;
        const v2Width = video2Element.videoWidth;
        const v2Height = video2Element.videoHeight;
        
        // 计算各个分辨率的输出尺寸
        const originalSize = calculateOutputSize(v1Width, v1Height, v2Width, v2Height, 
                                                 Math.max(v1Height, v2Height));
        const size720 = calculateOutputSize(v1Width, v1Height, v2Width, v2Height, 720);
        const size1080 = calculateOutputSize(v1Width, v1Height, v2Width, v2Height, 1080);
        const size2k = calculateOutputSize(v1Width, v1Height, v2Width, v2Height, 1440);
        
        // 更新尺寸显示
        originalSizeElem.textContent = `${originalSize.width}×${originalSize.height}`;
        size720Elem.textContent = `${size720.width}×${size720.height}`;
        size1080Elem.textContent = `${size1080.width}×${size1080.height}`;
        size2kElem.textContent = `${size2k.width}×${size2k.height}`;
        
        // 计算输出时长（取较短的）
        const minDuration = Math.min(video1Element.duration, video2Element.duration);
        outputDurationElem.textContent = formatTime(minDuration);
        
        // 滚动到设置区域
        settingsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 移除视频
function removeVideo(videoNum) {
    if (videoNum === 1) {
        if (video1.src) URL.revokeObjectURL(video1.src);
        video1File = null;
        video1Element = null;
        video1.src = '';
        preview1.style.display = 'none';
        uploadArea1.style.display = 'block';
        videoInput1.value = '';
        duration1Elem.textContent = '-';
    } else {
        if (video2.src) URL.revokeObjectURL(video2.src);
        video2File = null;
        video2Element = null;
        video2.src = '';
        preview2.style.display = 'none';
        uploadArea2.style.display = 'block';
        videoInput2.value = '';
        duration2Elem.textContent = '-';
    }
    
    // 隐藏设置区域
    if (!video1File || !video2File) {
        settingsSection.style.display = 'none';
        previewSection.style.display = 'none';
    }
}

// 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 更新预览
async function updatePreview() {
    if (!video1Element || !video2Element) return;
    
    const minDuration = Math.min(video1Element.duration, video2Element.duration);
    const time = (previewTime.value / 100) * minDuration;
    
    previewTimeText.textContent = formatTime(time);
    
    // 跳转到指定时间
    video1Element.currentTime = time;
    video2Element.currentTime = time;
    
    // 等待视频跳转完成
    await Promise.all([
        new Promise(resolve => {
            video1Element.addEventListener('seeked', resolve, { once: true });
        }),
        new Promise(resolve => {
            video2Element.addEventListener('seeked', resolve, { once: true });
        })
    ]);
    
    // 绘制预览
    drawPreview();
}

// 绘制预览
function drawPreview() {
    const resolution = document.querySelector('input[name="resolution"]:checked').value;
    let outputSize;
    
    const v1Width = video1Element.videoWidth;
    const v1Height = video1Element.videoHeight;
    const v2Width = video2Element.videoWidth;
    const v2Height = video2Element.videoHeight;
    
    if (resolution === 'original') {
        outputSize = calculateOutputSize(v1Width, v1Height, v2Width, v2Height, 
                                        Math.max(v1Height, v2Height));
    } else {
        const targetHeight = RESOLUTIONS[resolution];
        outputSize = calculateOutputSize(v1Width, v1Height, v2Width, v2Height, targetHeight);
    }
    
    previewCanvas.width = outputSize.width;
    previewCanvas.height = outputSize.height;
    
    const ctx = previewCanvas.getContext('2d');
    
    // 获取分屏比例
    const ratio = parseInt(splitRatio.value) / 100;
    const topHeight = Math.round(outputSize.height * ratio);
    const bottomHeight = outputSize.height - topHeight;
    
    // 清空画布
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, outputSize.width, outputSize.height);
    
    // 计算视频1的缩放和位置（只取上半部分）
    const v1Ratio = v1Width / (v1Height / 2);
    const topTargetRatio = outputSize.width / topHeight;
    
    let v1DrawWidth, v1DrawHeight, v1OffsetX, v1OffsetY;
    let v1SourceY = 0;
    let v1SourceHeight = v1Height / 2;
    
    if (v1Ratio > topTargetRatio) {
        v1DrawHeight = topHeight;
        v1DrawWidth = v1DrawHeight * v1Ratio;
        v1OffsetX = (outputSize.width - v1DrawWidth) / 2;
        v1OffsetY = 0;
    } else {
        v1DrawWidth = outputSize.width;
        v1DrawHeight = v1DrawWidth / v1Ratio;
        v1OffsetX = 0;
        v1OffsetY = (topHeight - v1DrawHeight) / 2;
    }
    
    // 绘制视频1的上半部分到画布上半部分
    ctx.drawImage(
        video1Element,
        0, v1SourceY, v1Width, v1SourceHeight,
        v1OffsetX, v1OffsetY, v1DrawWidth, v1DrawHeight
    );
    
    // 计算视频2的缩放和位置（只取下半部分）
    const v2Ratio = v2Width / (v2Height / 2);
    const bottomTargetRatio = outputSize.width / bottomHeight;
    
    let v2DrawWidth, v2DrawHeight, v2OffsetX, v2OffsetY;
    let v2SourceY = v2Height / 2;
    let v2SourceHeight = v2Height / 2;
    
    if (v2Ratio > bottomTargetRatio) {
        v2DrawHeight = bottomHeight;
        v2DrawWidth = v2DrawHeight * v2Ratio;
        v2OffsetX = (outputSize.width - v2DrawWidth) / 2;
        v2OffsetY = topHeight;
    } else {
        v2DrawWidth = outputSize.width;
        v2DrawHeight = v2DrawWidth / v2Ratio;
        v2OffsetX = 0;
        v2OffsetY = topHeight + (bottomHeight - v2DrawHeight) / 2;
    }
    
    // 绘制视频2的下半部分到画布下半部分
    ctx.drawImage(
        video2Element,
        0, v2SourceY, v2Width, v2SourceHeight,
        v2OffsetX, v2OffsetY, v2DrawWidth, v2DrawHeight
    );
    
    // 显示预览区域
    if (previewSection.style.display === 'none') {
        previewSection.style.display = 'block';
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 处理视频
async function processVideos() {
    if (!video1Element || !video2Element) {
        alert('请先上传两个视频');
        return;
    }
    
    if (!ffmpegLoaded) {
        alert('FFmpeg 未加载完成，请稍后再试或使用备用方案');
        return processWithCanvas();
    }
    
    processBtn.disabled = true;
    progressSection.style.display = 'block';
    progressSection.scrollIntoView({ behavior: 'smooth' });
    
    try {
        await processWithFFmpeg();
    } catch (error) {
        console.error('处理失败:', error);
        alert('视频处理失败: ' + error.message + '\n\n将尝试使用备用方案');
        await processWithCanvas();
    }
}

// 使用 FFmpeg 处理
async function processWithFFmpeg() {
    progressText.textContent = '正在准备视频文件...';
    
    // 获取设置
    const resolution = document.querySelector('input[name="resolution"]:checked').value;
    const ratio = parseInt(splitRatio.value) / 100;
    const v1Width = video1Element.videoWidth;
    const v1Height = video1Element.videoHeight;
    const v2Width = video2Element.videoWidth;
    const v2Height = video2Element.videoHeight;
    
    let outputSize;
    if (resolution === 'original') {
        outputSize = calculateOutputSize(v1Width, v1Height, v2Width, v2Height, 
                                        Math.max(v1Height, v2Height));
    } else {
        const targetHeight = RESOLUTIONS[resolution];
        outputSize = calculateOutputSize(v1Width, v1Height, v2Width, v2Height, targetHeight);
    }
    
    const minDuration = Math.min(video1Element.duration, video2Element.duration);
    
    // 计算上下部分的高度
    const topHeight = Math.round(outputSize.height * ratio);
    const bottomHeight = outputSize.height - topHeight;
    
    // 写入输入文件
    progressText.textContent = '正在加载视频文件...';
    const video1Data = await fetchFile(video1File);
    const video2Data = await fetchFile(video2File);
    
    await ffmpeg.writeFile('input1.mp4', video1Data);
    await ffmpeg.writeFile('input2.mp4', video2Data);
    
    // 构建 FFmpeg 命令
    progressText.textContent = '正在合成视频...';
    
    // 使用 FFmpeg 滤镜：先裁剪上下半部分，再缩放和合并
    // [0:v] 视频1取上半部分，[1:v] 视频2取下半部分
    await ffmpeg.exec([
        '-i', 'input1.mp4',
        '-i', 'input2.mp4',
        '-filter_complex',
        // 视频1：裁剪上半部分，然后缩放到目标尺寸
        `[0:v]crop=iw:ih/2:0:0,scale=${outputSize.width}:${topHeight}:force_original_aspect_ratio=increase,crop=${outputSize.width}:${topHeight}[top];` +
        // 视频2：裁剪下半部分，然后缩放到目标尺寸
        `[1:v]crop=iw:ih/2:0:ih/2,scale=${outputSize.width}:${bottomHeight}:force_original_aspect_ratio=increase,crop=${outputSize.width}:${bottomHeight}[bottom];` +
        // 垂直堆叠
        `[top][bottom]vstack=inputs=2`,
        '-t', minDuration.toString(),
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        'output.mp4'
    ]);
    
    // 读取输出文件
    progressText.textContent = '正在生成文件...';
    const data = await ffmpeg.readFile('output.mp4');
    outputBlob = new Blob([data.buffer], { type: 'video/mp4' });
    
    // 清理
    await ffmpeg.deleteFile('input1.mp4');
    await ffmpeg.deleteFile('input2.mp4');
    await ffmpeg.deleteFile('output.mp4');
    
    showComplete(outputSize.width, outputSize.height, minDuration, 'MP4');
}

// 使用 Canvas 处理（备用方案）
async function processWithCanvas() {
    progressText.textContent = '正在使用备用方案处理...';
    
    const resolution = document.querySelector('input[name="resolution"]:checked').value;
    const v1Width = video1Element.videoWidth;
    const v1Height = video1Element.videoHeight;
    const v2Width = video2Element.videoWidth;
    const v2Height = video2Element.videoHeight;
    
    let outputSize;
    if (resolution === 'original') {
        outputSize = calculateOutputSize(v1Width, v1Height, v2Width, v2Height, 
                                        Math.max(v1Height, v2Height));
    } else {
        const targetHeight = RESOLUTIONS[resolution];
        outputSize = calculateOutputSize(v1Width, v1Height, v2Width, v2Height, targetHeight);
    }
    
    const minDuration = Math.min(video1Element.duration, video2Element.duration);
    
    const canvas = document.createElement('canvas');
    canvas.width = outputSize.width;
    canvas.height = outputSize.height;
    const ctx = canvas.getContext('2d');
    
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerRecorder: 5000000
    });
    
    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
        outputBlob = new Blob(chunks, { type: 'video/webm' });
        showComplete(outputSize.width, outputSize.height, minDuration, 'WebM');
    };
    
    video1Element.currentTime = 0;
    video2Element.currentTime = 0;
    
    await Promise.all([
        new Promise(resolve => video1Element.addEventListener('seeked', resolve, { once: true })),
        new Promise(resolve => video2Element.addEventListener('seeked', resolve, { once: true }))
    ]);
    
    mediaRecorder.start();
    video1Element.play();
    video2Element.play();
    
    const fps = 30;
    const frameInterval = 1000 / fps;
    let frameCount = 0;
    const totalFrames = Math.floor(minDuration * fps);
    
    const renderFrame = () => {
        if (video1Element.currentTime >= minDuration || video2Element.currentTime >= minDuration) {
            video1Element.pause();
            video2Element.pause();
            mediaRecorder.stop();
            return;
        }
        
        drawPreview();
        ctx.drawImage(previewCanvas, 0, 0);
        
        frameCount++;
        const progress = (frameCount / totalFrames) * 100;
        progressFill.style.width = Math.min(progress, 100) + '%';
        progressPercent.textContent = Math.min(Math.round(progress), 100) + '%';
        
        setTimeout(renderFrame, frameInterval);
    };
    
    renderFrame();
}

// 辅助函数：获取文件数据
async function fetchFile(file) {
    return new Uint8Array(await file.arrayBuffer());
}

// 显示完成
function showComplete(width, height, duration, format) {
    progressSection.style.display = 'none';
    completeSection.style.display = 'block';
    completeSection.scrollIntoView({ behavior: 'smooth' });
    
    const size = (outputBlob.size / (1024 * 1024)).toFixed(2);
    
    outputInfo.innerHTML = `
        <p><strong>输出尺寸：</strong> ${width} × ${height}</p>
        <p><strong>视频时长：</strong> ${formatTime(duration)}</p>
        <p><strong>文件大小：</strong> ${size} MB</p>
        <p><strong>格式：</strong> ${format}</p>
    `;
}

// 下载视频
function downloadVideo() {
    if (!outputBlob) return;
    
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement('a');
    a.href = url;
    const ext = outputBlob.type.includes('mp4') ? 'mp4' : 'webm';
    a.download = `merged-video-${Date.now()}.${ext}`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// 重置应用
function resetApp() {
    if (video1.src) URL.revokeObjectURL(video1.src);
    if (video2.src) URL.revokeObjectURL(video2.src);
    if (outputBlob) outputBlob = null;
    
    video1File = null;
    video2File = null;
    video1Element = null;
    video2Element = null;
    
    video1.src = '';
    video2.src = '';
    preview1.style.display = 'none';
    preview2.style.display = 'none';
    uploadArea1.style.display = 'block';
    uploadArea2.style.display = 'block';
    videoInput1.value = '';
    videoInput2.value = '';
    
    settingsSection.style.display = 'none';
    previewSection.style.display = 'none';
    progressSection.style.display = 'none';
    completeSection.style.display = 'none';
    
    processBtn.disabled = false;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 启动应用
init();
