# Video Cut Wallpaper Generator

视频截取壁纸生成器 - 从视频中提取精彩画面，生成完美壁纸

## 功能特点

### 核心功能
- **视频上传**：支持点击选择或拖放视频文件（MP4, MOV, AVI, WEBM）
- **智能截取**：自动等分视频时长并截取关键画面
- **画面选择**：网格展示所有截取的画面，点击选择
- **多设备支持**：支持 iPhone、iPad、MacBook、Apple Watch 等设备尺寸

### 截取设置
- 可设置截取份数（默认 10 张，范围 2-50）
- 自动等分视频时长
- 实时显示截取进度

### 设备尺寸支持

#### iPhone 系列
- iPhone 15 Pro Max (1290×2796)
- iPhone 15 Pro (1179×2556)
- iPhone 15 (1179×2556)
- iPhone SE (750×1334)

#### iPad 系列
- iPad Pro 13" (2064×2752)
- iPad Pro 11" (1668×2388)
- iPad Air (1640×2360)

#### MacBook 系列
- MacBook Pro 16" (3456×2234)
- MacBook Pro 14" (3024×1964)
- MacBook Air (2560×1664)

#### Apple Watch 系列
- Apple Watch Ultra (410×502)
- Apple Watch Series 9 (396×484)

### 格式导出
- **PNG**：无损压缩，质量最佳
- **JPEG**：有损压缩，文件较小，可调节质量
- **WEBP**：现代格式，平衡质量与大小，可调节质量

### 智能裁剪
- 自动计算最佳缩放比例
- 居中裁剪适配目标设备尺寸
- 保持画面主体完整

## 使用方法

1. **上传视频**
   - 点击"选择视频文件"或拖放视频到上传区域
   - 支持 MP4, MOV, AVI, WEBM 等格式

2. **设置截取份数**
   - 输入想要截取的画面数量（2-50）
   - 默认为 10 张

3. **开始截取**
   - 点击"开始截取画面"按钮
   - 等待自动截取完成（显示进度）

4. **选择画面**
   - 在网格中浏览所有截取的画面
   - 点击选择想要导出的画面

5. **导出设置**
   - 选择目标设备尺寸
   - 选择图片格式（PNG/JPEG/WEBP）
   - 如果选择 JPEG 或 WEBP，可调节质量

6. **导出壁纸**
   - 点击"导出壁纸"按钮
   - 自动下载生成的壁纸文件

## 技术实现

### 视频处理
- 使用 HTML5 Video API 加载视频
- Canvas API 进行帧截取
- 精确的时间跳转和截图

### 图片处理
- Canvas 2D Context 进行图片缩放和裁剪
- Blob API 生成图片文件
- 支持多种图片格式输出

### 响应式设计
- 支持桌面和移动设备
- 深色模式自动适配
- 流畅的动画和交互效果

## 文件结构

```
wallpaper-video-cut-generator/
├── index.html          # Jekyll 模板页面
├── style.css           # 样式文件
├── script.js           # 主要逻辑
└── README.md          # 说明文档
```

## 浏览器要求

- 现代浏览器（Chrome, Firefox, Safari, Edge）
- 支持 HTML5 Video API
- 支持 Canvas API
- 支持 Blob API

## 注意事项

- 截取时间取决于视频长度和截取份数
- 建议使用高清视频以获得最佳壁纸质量
- 导出的壁纸会自动适配选择的设备尺寸
- PNG 格式文件较大但质量最好
- JPEG 和 WEBP 可以通过调节质量来平衡文件大小和画质

## 相关工具

- [Video Joiner](/wallpaper-video-joiner/) - 视频合成器
- [Wallpaper Multiple Size Generator](/wallpaper-mutiple-size-generator/) - 多尺寸壁纸生成器
