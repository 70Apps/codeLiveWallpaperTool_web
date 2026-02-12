# Video Joiner - Wallpaper Video Merger

视频合成器 - 将两个视频的上下部分合并成一个分屏视频

## 🎯 功能特点

### 核心功能
- **双视频上传**：支持点击选择或拖放视频文件
- **智能合成**：第一个视频取上半部分，第二个视频取下半部分
- **MP4 输出**：使用 FFmpeg.wasm 输出高质量 MP4 格式
- **保持比例**：自动保持原视频宽高比，按 container 逻辑适配
- **比例调整**：可调整上下视频的高度比例（5%-95%）

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

### 可靠性保障
- ✅ 本地化 FFmpeg.js 主文件
- ✅ 实时状态指示器
- ✅ 自动备用方案（WebM）
- ✅ 友好的错误处理

## 📦 文件结构

```
wallpaper-video-joiner/
├── index.html              # Jekyll 模板页面
├── style.css               # 样式文件
├── script.js               # 主要逻辑
├── lib/
│   └── ffmpeg.js          # 本地 FFmpeg 主文件
├── README.md              # 本文档
├── CHANGELOG.md           # 版本更新日志
├── FIXES.md               # Bug 修复说明
└── FFMPEG-SETUP.md        # FFmpeg 配置说明
```

## 🚀 使用方法

### 1. 上传视频
- 点击"选择视频"或拖放上传第一个视频（上半部分）
- 点击"选择视频"或拖放上传第二个视频（下半部分）

### 2. 调整设置
- **输出尺寸**：选择目标分辨率
- **分屏比例**：拖动滑块调整上下比例（默认 50:50）
- 查看视频时长信息

### 3. 预览效果
- 点击"更新预览"查看合成效果
- 使用时间轴滑块查看不同时间点
- 调整比例后实时更新预览

### 4. 开始合成
- 点击"开始合成"按钮
- 等待处理完成（显示进度）
- 查看 FFmpeg 状态指示器

### 5. 下载视频
- 处理完成后点击"下载视频"
- 自动下载 MP4 或 WebM 格式文件

## 🎨 状态指示器

应用会实时显示 FFmpeg 加载状态：

| 状态 | 图标 | 说明 | 输出格式 |
|------|------|------|----------|
| 加载中 | ⏳ | 正在加载 FFmpeg... | - |
| 已就绪 | ✅ | FFmpeg 已就绪 | MP4 |
| 备用方案 | ⚠️ | 使用备用方案 | WebM |

## 🔧 技术实现

### FFmpeg 处理（首选）
- 输出格式：MP4 (H.264)
- 质量：高（CRF 23）
- 预设：medium
- 像素格式：yuv420p

### Canvas 备用方案
- 输出格式：WebM (VP9)
- 质量：中等
- 帧率：30 FPS
- 比特率：5 Mbps

### FFmpeg 滤镜链
```bash
# 视频1：裁剪上半部分，缩放到目标高度
[0:v]crop=iw:ih/2:0:0,scale=W:H1:force_original_aspect_ratio=increase,crop=W:H1[top]

# 视频2：裁剪下半部分，缩放到目标高度
[1:v]crop=iw:ih/2:0:ih/2,scale=W:H2:force_original_aspect_ratio=increase,crop=W:H2[bottom]

# 垂直堆叠
[top][bottom]vstack=inputs=2
```

## 🌐 浏览器要求

### FFmpeg.wasm (MP4)
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ 需要 WebAssembly 支持

### Canvas 备用方案 (WebM)
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 14.1+
- ✅ Edge 79+
- ✅ 无需 WebAssembly

## ⚡ 性能对比

| 方案 | 格式 | 质量 | 速度 | 文件大小 | 兼容性 |
|------|------|------|------|----------|--------|
| FFmpeg | MP4 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 现代浏览器 |
| Canvas | WebM | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 所有浏览器 |

## 📝 注意事项

- 处理时间取决于视频长度和分辨率
- 建议使用相同帧率的视频以获得最佳效果
- FFmpeg.wasm 首次加载需要下载约 30MB 文件
- 输出时长为两个视频中较短的时长
- 如果 FFmpeg 加载失败，会自动使用备用方案

## 🐛 已知问题

- ~~上传视频需要选择两次文件~~ ✅ 已修复 (v1.2.0)
- ~~视频截取位置不正确~~ ✅ 已修复 (v1.1.0)
- ~~FFmpeg 加载不稳定~~ ✅ 已改进 (v1.3.0)

## 🔄 版本历史

### v1.3.0 (2026-02-12)
- ✨ 本地化 FFmpeg.js 主文件
- ✨ 添加 FFmpeg 状态指示器
- 🐛 改进错误处理和备用方案
- 📝 添加详细的配置文档

### v1.2.0 (2026-02-12)
- ✨ 新增比例调整功能（5%-95%）
- 🐛 修复上传视频需要2次选择的问题
- 💄 改进 UI 和用户体验

### v1.1.0 (2026-02-12)
- 🐛 修复重复选择文件的 Bug
- 🐛 修复视频截取位置不正确的问题
- 📝 添加详细的变更日志

### v1.0.0 (2026-02-12)
- 🎉 初始版本发布
- ✨ 支持两个视频合成为上下分屏效果
- ✨ 支持 MP4 输出（使用 FFmpeg.wasm）
- ✨ 支持多种分辨率选择

## 📚 相关文档

- [CHANGELOG.md](./CHANGELOG.md) - 详细的版本更新日志
- [FIXES.md](./FIXES.md) - Bug 修复说明
- [FFMPEG-SETUP.md](./FFMPEG-SETUP.md) - FFmpeg 配置说明

## 🔗 相关工具

- [Video Cut Wallpaper Generator](/wallpaper-video-cut-generator/) - 视频截取壁纸生成器
- [Wallpaper Multiple Size Generator](/wallpaper-mutiple-size-generator/) - 多尺寸壁纸生成器

## 📄 许可证

本项目遵循 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请通过 GitHub Issues 联系我们。
