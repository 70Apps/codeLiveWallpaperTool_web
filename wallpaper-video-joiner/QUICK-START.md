# 快速开始指南

## 🚀 5 分钟快速上手

### 1. 检查文件结构

确保以下文件存在：
```
wallpaper-video-joiner/
├── index.html          ✅
├── script.js           ✅
├── style.css           ✅
└── lib/
    └── ffmpeg.js       ✅ (3.4 KB)
```

### 2. 测试 FFmpeg 加载

在浏览器中打开：
```
wallpaper-video-joiner/test-ffmpeg.html
```

点击"开始测试"，应该看到：
```
✅ 所有测试通过！FFmpeg 工作正常
```

### 3. 使用应用

1. 打开 `index.html`
2. 上传两个视频
3. 查看状态指示器：
   - ✅ FFmpeg 已就绪 → 可以生成 MP4
   - ⚠️ 使用备用方案 → 将生成 WebM
4. 调整设置（分辨率、比例）
5. 点击"开始合成"

## 🔧 故障排查

### FFmpeg 未加载？

**检查 1**: 文件是否存在
```bash
ls -lh wallpaper-video-joiner/lib/ffmpeg.js
```

**检查 2**: 浏览器控制台
```javascript
console.log(typeof FFmpegWASM); // 应该是 'object'
```

**检查 3**: 重新下载
```bash
curl -L -o wallpaper-video-joiner/lib/ffmpeg.js \
  https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/umd/ffmpeg.js
```

### WASM 加载失败？

**不用担心！** 应用会自动使用备用方案（WebM 格式）

**手动测试备用方案**：
1. 断开网络
2. 上传视频
3. 应该看到：⚠️ 使用备用方案
4. 仍然可以正常合成视频

## 📊 状态说明

| 图标 | 状态 | 说明 | 输出格式 |
|------|------|------|----------|
| ⏳ | 加载中 | 正在初始化 FFmpeg | - |
| ✅ | 已就绪 | FFmpeg 工作正常 | MP4 (推荐) |
| ⚠️ | 备用方案 | 使用 Canvas 处理 | WebM (兼容) |

## 🎯 常见问题

### Q: 为什么显示"使用备用方案"？

A: 可能的原因：
- 网络连接问题
- CDN 访问受限
- 浏览器不支持 WebAssembly

**解决方案**：备用方案会自动生成 WebM 格式视频，质量接近 MP4。

### Q: 如何强制使用 MP4 格式？

A: 确保：
1. 网络连接正常
2. 浏览器支持 WebAssembly
3. 等待 FFmpeg 加载完成（看到 ✅）

### Q: WebM 和 MP4 有什么区别？

A: 
- **MP4**: 更通用，质量略高，文件略小
- **WebM**: 兼容性好，质量接近，处理更快

两者对于大多数用途都足够好！

## 📱 浏览器兼容性

### 推荐浏览器（支持 MP4）
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 备用方案（支持 WebM）
- ✅ 所有现代浏览器

## 🎨 使用技巧

### 技巧 1: 调整比例
拖动"分屏比例"滑块可以改变上下视频的高度：
- 30:70 → 突出下部视频
- 50:50 → 均分（默认）
- 70:30 → 突出上部视频

### 技巧 2: 实时预览
调整任何设置后，点击"更新预览"立即查看效果。

### 技巧 3: 选择分辨率
- **原尺寸**: 保持最佳质量
- **720p**: 平衡质量和文件大小
- **1080p**: 高清输出
- **2K**: 超高清（文件较大）

## 📚 更多信息

- **完整文档**: [README.md](./README.md)
- **FFmpeg 配置**: [FFMPEG-SETUP.md](./FFMPEG-SETUP.md)
- **版本历史**: [CHANGELOG.md](./CHANGELOG.md)
- **Bug 修复**: [FIXES.md](./FIXES.md)

## 🆘 需要帮助？

1. 查看浏览器控制台日志
2. 运行 `test-ffmpeg.html` 测试
3. 查看相关文档
4. 提交 GitHub Issue

---

**提示**: 第一次使用时，FFmpeg 需要下载约 30MB 的 WASM 文件，请耐心等待。之后会被浏览器缓存，加载会更快！
