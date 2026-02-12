# Changelog

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
