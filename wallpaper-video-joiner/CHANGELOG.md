# Changelog

## [2.0.0] - 2026-02-12

### 🔄 重大变更
- **裁剪逻辑重构**：改变了视频裁剪的核心逻辑
  - 旧逻辑：视频1固定取上半部分(50%)，视频2固定取下半部分(50%)，滑块只调整输出高度分配
  - 新逻辑：滑块直接控制裁剪比例
    - 视频1：从顶部开始取 X% 的高度
    - 视频2：从底部开始取 (100-X)% 的高度
  - 输出高度分配与裁剪比例保持一致

### ✨ 改进
- 更灵活的视频内容选择
- 可以根据实际内容位置调整裁剪区域
- 保持原视频比例，只改变裁剪高度百分比

### 📝 文档更新
- 更新 SPLIT-LINE-GUIDE.md 说明新的裁剪逻辑
- 更新界面提示文字，更准确描述功能

### Technical Details

#### Canvas 绘制逻辑更新
```javascript
// 视频1：从顶部取 ratio% 的高度
const v1SourceHeight = v1Height * ratio;
ctx.drawImage(
    video1Element,
    0, 0, v1Width, v1SourceHeight,              // 源：从顶部取 ratio%
    v1OffsetX, 0, v1DrawWidth, topHeight        // 目标：上部分
);

// 视频2：从底部取 (1-ratio)% 的高度
const v2SourceHeight = v2Height * (1 - ratio);
const v2SourceY = v2Height - v2SourceHeight;
ctx.drawImage(
    video2Element,
    0, v2SourceY, v2Width, v2SourceHeight,      // 源：从底部取 (1-ratio)%
    v2OffsetX, topHeight, v2DrawWidth, bottomHeight  // 目标：下部分
);
```

#### FFmpeg 滤镜更新
```bash
# 视频1：从顶部裁剪 ratio% 的高度
[0:v]crop=iw:ih*ratio:0:0,scale=W:topHeight:...[top]

# 视频2：从底部裁剪 (1-ratio)% 的高度
[1:v]crop=iw:ih*(1-ratio):0:ih*ratio,scale=W:bottomHeight:...[bottom]

# 垂直堆叠
[top][bottom]vstack=inputs=2
```

---

## [1.4.0] - 2026-02-12

### Added
- **拼合线可视化指示器**：在预览画面上显示拼合线位置
  - 蓝色渐变线条标注拼合线
  - 显示"拼合线"文字标签
  - 实时跟随滑块位置移动
  - 平滑的过渡动画

### Changed
- **优化拼合线说明**：更清晰地说明拼合线的作用
  - 标签从"分屏比例"改为"拼合线位置"
  - 提示文字更准确："调整拼合线的垂直位置（视频源仍为上下半部分）"
  - 强调视频源始终是上下半部分，只是输出高度比例可调

### Documentation
- **新增 SPLIT-LINE-GUIDE.md**：详细的拼合线使用指南
  - 工作原理图解
  - 多个示例说明
  - 技术实现细节
  - 使用场景建议
  - 最佳实践

### Technical Details

#### 拼合线指示器实现
```html
<div class="canvas-wrapper">
    <canvas id="previewCanvas"></canvas>
    <div class="split-line" id="splitLine"></div>
</div>
```

```css
.split-line {
    position: absolute;
    height: 2px;
    background: linear-gradient(90deg, 
        transparent 0%, 
        var(--primary-color) 10%, 
        var(--primary-color) 90%, 
        transparent 100%);
    transition: top 0.3s ease;
}
```

```javascript
function updateSplitLine() {
    const ratio = parseInt(splitRatio.value) / 100;
    const canvasHeight = previewCanvas.offsetHeight;
    const linePosition = canvasHeight * ratio;
    splitLine.style.top = linePosition + 'px';
}
```

#### 逻辑说明
- **视频源**：始终取上半部分和下半部分（固定）
- **输出布局**：根据拼合线位置调整各自占用的高度（可调）
- **拼合线**：标注两个视频在输出中的分界位置

## [1.3.0] - 2026-02-12

### Added
- **本地化 FFmpeg.js**：将 FFmpeg 主文件存储到本地，提高加载可靠性
  - 主文件 (3.4KB) 本地存储在 `lib/ffmpeg.js`
  - WASM 文件仍从 CDN 加载（约 30MB）
  - 平衡了可靠性和存储空间

- **FFmpeg 状态指示器**：实时显示加载状态
  - ⏳ 正在加载 FFmpeg...
  - ✅ FFmpeg 已就绪 (MP4 格式)
  - ⚠️ 使用备用方案 (WebM 格式)

- **改进的错误处理**：
  - 自动检测 FFmpeg 加载失败
  - 无缝切换到 Canvas 备用方案
  - 友好的错误提示和状态反馈
  - 不再弹出 alert，改为状态指示器

### Changed
- **优化加载流程**：
  - 移除了阻塞性的 alert 提示
  - 改进了 FFmpeg 初始化逻辑
  - 添加了详细的控制台日志
  - 更好的异步错误处理

- **改进处理逻辑**：
  - 自动选择最佳处理方案（FFmpeg 或 Canvas）
  - FFmpeg 失败时自动重试 Canvas 方案
  - 更清晰的处理状态提示

### Technical Details

#### 文件结构
```
wallpaper-video-joiner/
├── lib/
│   └── ffmpeg.js          # 本地 FFmpeg 主文件 (3.4KB)
├── index.html             # 引用本地 lib/ffmpeg.js
├── script.js              # 改进的加载和错误处理
└── FFMPEG-SETUP.md       # FFmpeg 配置说明文档
```

#### 加载流程
1. 加载本地 `lib/ffmpeg.js`
2. 从 CDN 加载 WASM 文件
3. 更新状态指示器
4. 失败时自动切换备用方案

#### 状态管理
```javascript
function updateFFmpegStatus(status, text, detail) {
    const icons = {
        loading: '⏳',
        success: '✅',
        fallback: '⚠️'
    };
    // 更新 UI 显示
}
```

### Documentation
- 新增 `FFMPEG-SETUP.md` 详细说明文档
- 包含完全本地化的可选步骤
- 浏览器兼容性说明
- 性能对比和调试指南

## [1.2.0] - 2026-02-12

### Added
- **比例调整功能**：新增分屏比例调整滑块
  - 默认 50%:50% 上下均分
  - 可在 5% 到 95% 之间调整
  - 实时显示上下部分的百分比
  - 预览和最终输出都支持自定义比例
  - 滑块拖动时实时更新预览

### Fixed
- **上传视频需要2次选择的 Bug**：修复了点击上传按钮时需要选择两次文件的问题
  - 移除了 HTML 中按钮的 `onclick` 属性
  - 在 JavaScript 中统一处理按钮点击事件
  - 使用 `e.stopPropagation()` 阻止事件冒泡
  - 移除了上传区域的点击事件，避免与按钮冲突

### Technical Details

#### 比例调整实现
```javascript
// HTML 滑块
<input type="range" id="splitRatio" min="5" max="95" value="50" step="1">

// 实时更新比例
splitRatio.addEventListener('input', (e) => {
    const ratio = parseInt(e.target.value) / 100;
    topRatio.textContent = ratio * 100;
    bottomRatio.textContent = (1 - ratio) * 100;
    drawPreview(); // 实时更新预览
});

// 在绘制时使用比例
const topHeight = Math.round(outputSize.height * ratio);
const bottomHeight = outputSize.height - topHeight;
```

#### FFmpeg 滤镜更新
```bash
# 根据比例计算高度
topHeight = outputHeight * ratio
bottomHeight = outputHeight * (1 - ratio)

# 分别缩放到不同高度
[0:v]crop=iw:ih/2:0:0,scale=W:topHeight:...[top]
[1:v]crop=iw:ih/2:0:ih/2,scale=W:bottomHeight:...[bottom]
[top][bottom]vstack=inputs=2
```

#### 双击问题修复
```javascript
// 修复前：HTML 和 JavaScript 都有点击处理
<button onclick="document.getElementById('videoInput1').click()">

area.addEventListener('click', () => {
    videoInput1.click(); // 导致双重触发
});

// 修复后：只在 JavaScript 中处理
<button id="uploadBtn1">

uploadBtn1.addEventListener('click', (e) => {
    e.stopPropagation(); // 阻止冒泡
    videoInput1.click();
});

// 移除区域点击事件
```

### UI Improvements
- 新增比例控制面板，显示上下部分的百分比
- 添加滑块刻度标记（5%, 50%, 95%）
- 比例调整提示文字
- 实时更新的比例显示

## [1.1.0] - 2026-02-12

### Fixed
- **重复选择文件的 Bug**：修复了重新选择视频文件时事件监听器重复触发的问题
  - 在 `loadVideo` 函数中添加 `{ once: true }` 选项
  - 在加载新视频前清理旧的 Blob URL
  - 确保每次只触发一次 `loadedmetadata` 事件

- **视频截取位置不正确的问题**：修复了合成视频时没有正确截取上下半部分的问题
  - 更新 `drawPreview` 函数，使用 `ctx.drawImage` 的 9 参数版本
  - 正确指定源视频的裁剪区域（上半部分：y=0, h=height/2；下半部分：y=height/2, h=height/2）
  - 更新 FFmpeg 滤镜链，先使用 `crop` 裁剪上下半部分，再进行缩放
  - FFmpeg 命令：`crop=iw:ih/2:0:0` (上半部分) 和 `crop=iw:ih/2:0:ih/2` (下半部分)

### Technical Details

#### 修复前的问题
1. **重复选择文件**：
   ```javascript
   // 问题：每次加载都添加新的事件监听器
   videoElem.addEventListener('loadedmetadata', () => { ... });
   ```

2. **截取位置错误**：
   ```javascript
   // 问题：绘制整个视频，而不是上下半部分
   ctx.drawImage(video1Element, x, y, width, height);
   ```

#### 修复后的实现
1. **防止重复监听**：
   ```javascript
   // 解决：使用 once 选项，事件只触发一次
   videoElem.addEventListener('loadedmetadata', () => { ... }, { once: true });
   
   // 清理旧的 URL
   if (videoElem.src) {
       URL.revokeObjectURL(videoElem.src);
   }
   ```

2. **正确截取上下半部分**：
   ```javascript
   // 解决：使用 9 参数版本指定源裁剪区域
   ctx.drawImage(
       video1Element,
       0, 0, v1Width, v1Height/2,  // 源：上半部分
       x, y, width, height          // 目标：缩放后的位置
   );
   
   ctx.drawImage(
       video2Element,
       0, v2Height/2, v2Width, v2Height/2,  // 源：下半部分
       x, y, width, height                   // 目标：缩放后的位置
   );
   ```

3. **FFmpeg 滤镜优化**：
   ```bash
   # 视频1：裁剪上半部分
   [0:v]crop=iw:ih/2:0:0,scale=W:H:force_original_aspect_ratio=increase,crop=W:H[top]
   
   # 视频2：裁剪下半部分
   [1:v]crop=iw:ih/2:0:ih/2,scale=W:H:force_original_aspect_ratio=increase,crop=W:H[bottom]
   
   # 垂直堆叠
   [top][bottom]vstack=inputs=2
   ```

### Impact
- 用户现在可以多次更换视频而不会出现重复加载的问题
- 合成的视频正确显示每个视频的上半部分和下半部分
- 预览效果与最终输出一致

## [1.0.0] - 2026-02-12

### Added
- 初始版本发布
- 支持两个视频合成为上下分屏效果
- 支持 MP4 输出（使用 FFmpeg.wasm）
- 支持多种分辨率选择（原尺寸、720p、1080p、2K）
- 保持原视频比例的智能适配
- 实时预览功能
- 支持不同尺寸视频的自动适配
