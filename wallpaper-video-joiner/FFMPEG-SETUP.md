# FFmpeg.wasm 本地化配置说明

## 问题背景

FFmpeg.wasm 从 CDN 加载可能会遇到以下问题：
1. 网络连接不稳定
2. CDN 访问受限
3. 加载速度慢
4. 跨域问题

## 解决方案

### 1. 本地化 FFmpeg.js 主文件

已将 FFmpeg.js 主文件下载到本地：
```
wallpaper-video-joiner/
└── lib/
    └── ffmpeg.js  (3.4 KB)
```

### 2. WASM 文件仍使用 CDN

由于 WASM 文件较大（约 30MB），仍从 CDN 加载：
- `ffmpeg-core.js` (~1MB)
- `ffmpeg-core.wasm` (~30MB)

这样既保证了主文件的可靠性，又避免了大文件的存储问题。

## 文件结构

```
wallpaper-video-joiner/
├── index.html          # 引用本地 lib/ffmpeg.js
├── script.js           # FFmpeg 加载逻辑
├── lib/
│   └── ffmpeg.js      # 本地 FFmpeg 主文件
└── FFMPEG-SETUP.md    # 本文档
```

## 加载流程

1. **加载主文件**（本地）
   ```html
   <script src="lib/ffmpeg.js"></script>
   ```

2. **加载 WASM 文件**（CDN）
   ```javascript
   const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
   await ffmpeg.load({
       coreURL: `${baseURL}/ffmpeg-core.js`,
       wasmURL: `${baseURL}/ffmpeg-core.wasm`,
   });
   ```

3. **状态反馈**
   - ⏳ 正在加载 FFmpeg...
   - ✅ FFmpeg 已就绪 (MP4 格式)
   - ⚠️ 使用备用方案 (WebM 格式)

## 备用方案

如果 FFmpeg 加载失败，自动切换到 Canvas + MediaRecorder 方案：
- 输出格式：WebM (VP9)
- 质量：略低于 MP4
- 兼容性：现代浏览器都支持
- 优点：无需外部依赖

## 完全本地化（可选）

如果需要完全本地化（包括 WASM 文件），可以执行以下步骤：

### 1. 下载所有文件

```bash
# 进入 lib 目录
cd wallpaper-video-joiner/lib

# 下载 core.js
curl -L -o ffmpeg-core.js https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js

# 下载 core.wasm
curl -L -o ffmpeg-core.wasm https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm
```

### 2. 修改加载路径

在 `script.js` 中修改：

```javascript
// 修改前（使用 CDN）
const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

// 修改后（使用本地）
const baseURL = './lib';
```

### 3. 文件大小

- `ffmpeg.js`: ~3.4 KB
- `ffmpeg-core.js`: ~1 MB
- `ffmpeg-core.wasm`: ~30 MB

总计约 31 MB，建议添加到 `.gitignore`：

```gitignore
# FFmpeg WASM 文件（可选）
wallpaper-video-joiner/lib/ffmpeg-core.js
wallpaper-video-joiner/lib/ffmpeg-core.wasm
```

## 状态指示器

页面上会显示 FFmpeg 加载状态：

### 加载中
```
⏳ 正在加载 FFmpeg...
```

### 加载成功
```
✅ FFmpeg 已就绪    MP4 格式
```

### 使用备用方案
```
⚠️ 使用备用方案    WebM 格式
```

## 错误处理

### 1. FFmpeg 库未加载
```
错误：FFmpeg library not loaded
原因：lib/ffmpeg.js 文件缺失或加载失败
解决：检查文件路径，重新下载
```

### 2. WASM 加载失败
```
错误：Failed to load FFmpeg
原因：网络问题或 CDN 访问受限
解决：自动切换到备用方案（WebM）
```

### 3. 浏览器不支持
```
错误：WebAssembly not supported
原因：浏览器版本过旧
解决：升级浏览器或使用备用方案
```

## 浏览器兼容性

### FFmpeg.wasm (MP4)
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Canvas 备用方案 (WebM)
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 14.1+
- ✅ Edge 79+

## 性能对比

| 方案 | 格式 | 质量 | 速度 | 文件大小 |
|------|------|------|------|----------|
| FFmpeg | MP4 | 高 | 中 | 小 |
| Canvas | WebM | 中 | 快 | 中 |

## 调试

### 查看加载状态
打开浏览器控制台，查看日志：

```javascript
// 成功
FFmpeg loaded successfully

// 失败
Failed to load FFmpeg: Error: ...
使用备用方案处理（WebM 格式）...
```

### 测试 FFmpeg
在控制台执行：

```javascript
// 检查 FFmpeg 是否可用
console.log('FFmpeg loaded:', ffmpegLoaded);

// 检查 FFmpegWASM 对象
console.log('FFmpegWASM:', typeof FFmpegWASM);
```

## 更新 FFmpeg

如需更新到新版本：

1. 修改版本号：
   ```javascript
   const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.7/dist/umd';
   ```

2. 重新下载本地文件：
   ```bash
   curl -L -o wallpaper-video-joiner/lib/ffmpeg.js \
     https://unpkg.com/@ffmpeg/ffmpeg@0.12.7/dist/umd/ffmpeg.js
   ```

## 常见问题

### Q: 为什么不完全本地化？
A: WASM 文件约 30MB，会显著增加仓库大小。当前方案平衡了可靠性和存储空间。

### Q: 备用方案的质量如何？
A: WebM (VP9) 质量接近 MP4 (H.264)，对于大多数用途足够。

### Q: 可以强制使用备用方案吗？
A: 可以，在 `processVideos()` 函数中直接调用 `processWithCanvas()`。

### Q: 如何提高加载速度？
A: 可以使用国内 CDN 镜像，或完全本地化所有文件。

## 相关链接

- [FFmpeg.wasm 官方文档](https://ffmpegwasm.netlify.app/)
- [FFmpeg.wasm GitHub](https://github.com/ffmpegwasm/ffmpeg.wasm)
- [unpkg CDN](https://unpkg.com/)
