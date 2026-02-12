# Video Joiner - Wallpaper Video Merger

视频合成器 - 将两个视频的上下部分合并成一个分屏视频

## 功能特点

### 核心功能
- **双视频上传**：支持点击选择或拖放视频文件
- **智能合成**：第一个视频取上半部分，第二个视频取下半部分
- **MP4 输出**：使用 FFmpeg.wasm 输出高质量 MP4 格式
- **保持比例**：自动保持原视频宽高比，按 container 逻辑适配

### 分辨率选择
- **原尺寸**：保持最大视频的高度和比例
- **720p**：自动计算宽度以保持比例
- **1080p**：自动计算宽度以保持比例
- **2K**：自动计算宽度以保持比例

### 智能适配
- 支持不同尺寸的视频
- 自动按比例缩放和居中
- 黑边填充保持画面完整
- 实时预览合成效果

## 技术实现

### FFmpeg 处理
```bash
# 使用 FFmpeg 滤镜链
scale → crop → vstack
```

- 每个视频先缩放到目标宽度和半高
- 使用 `force_original_aspect_ratio=increase` 保持比例
- crop 裁剪到精确尺寸
- vstack 垂直堆叠

### 备用方案
- 如果 FFmpeg 加载失败，自动使用 Canvas + MediaRecorder
- 输出 WebM 格式
- 30 FPS 实时渲染

## 使用方法

1. **上传视频**
   - 点击或拖放上传第一个视频（上半部分）
   - 点击或拖放上传第二个视频（下半部分）

2. **选择设置**
   - 选择输出分辨率（会显示实际输出尺寸）
   - 查看视频时长信息

3. **预览效果**
   - 点击"更新预览"查看合成效果
   - 使用时间轴滑块查看不同时间点

4. **开始合成**
   - 点击"开始合成"按钮
   - 等待处理完成（显示进度）

5. **下载视频**
   - 处理完成后点击"下载视频"
   - 自动下载 MP4 格式文件

## 文件结构

```
wallpaper-video-joiner/
├── index.html          # Jekyll 模板页面
├── style.css           # 样式文件
├── script.js           # 主要逻辑
└── README.md          # 说明文档
```

## 浏览器要求

- 现代浏览器（Chrome, Firefox, Safari, Edge）
- 支持 WebAssembly
- 支持 Canvas API
- 支持 MediaRecorder API（备用方案）

## 注意事项

- 处理时间取决于视频长度和分辨率
- 建议使用相同帧率的视频以获得最佳效果
- FFmpeg.wasm 首次加载需要下载约 30MB 文件
- 输出时长为两个视频中较短的时长

## 相关工具

- [Video Cut Wallpaper Generator](/wallpaper-video-cut-generator/) - 视频截取壁纸生成器
- [Wallpaper Multiple Size Generator](/wallpaper-mutiple-size-generator/) - 多尺寸壁纸生成器
