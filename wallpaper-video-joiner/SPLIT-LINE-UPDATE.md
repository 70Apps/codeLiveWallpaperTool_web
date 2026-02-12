# 拼合线功能更新说明

## 🎯 更新目标

澄清和可视化"拼合线位置"的概念，让用户更清楚地理解滑块的作用。

## ✅ 完成的更新

### 1. 术语优化

**修改前**：
- 标签：分屏比例
- 提示：调整上下视频的高度比例

**修改后**：
- 标签：拼合线位置
- 提示：调整拼合线的垂直位置（视频源仍为上下半部分）

### 2. 可视化指示器

添加了拼合线的视觉标注：

```
┌─────────────────────────────┐
│                             │
│      视频1上半部分          │
│                             │
├─────────────────────────────┤ ← 拼合线 (蓝色，带标签)
│                             │
│      视频2下半部分          │
│                             │
└─────────────────────────────┘
```

**特点**：
- 蓝色渐变线条
- 显示"拼合线"文字标签
- 实时跟随滑块移动
- 平滑的过渡动画

### 3. 代码实现

#### HTML 结构
```html
<div class="canvas-wrapper">
    <canvas id="previewCanvas"></canvas>
    <div class="split-line" id="splitLine"></div>
</div>
```

#### CSS 样式
```css
.canvas-wrapper {
    position: relative;
    display: inline-block;
}

.split-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
        transparent 0%, 
        var(--primary-color) 10%, 
        var(--primary-color) 90%, 
        transparent 100%);
    transition: top 0.3s ease;
}

.split-line::before {
    content: '拼合线';
    position: absolute;
    right: 10px;
    top: -20px;
    background: var(--primary-color);
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
}
```

#### JavaScript 逻辑
```javascript
function updateSplitLine() {
    if (!splitLine || !previewCanvas) return;
    
    const ratio = parseInt(splitRatio.value) / 100;
    const canvasHeight = previewCanvas.offsetHeight;
    const linePosition = canvasHeight * ratio;
    
    splitLine.style.top = linePosition + 'px';
}

// 在 drawPreview 函数中调用
function drawPreview() {
    // ... 绘制逻辑 ...
    updateSplitLine();
}

// 在滑块变化时调用
splitRatio.addEventListener('input', (e) => {
    // ... 更新百分比 ...
    if (previewSection.style.display === 'block') {
        drawPreview();
        updateSplitLine();
    }
});
```

### 4. 详细文档

创建了 `SPLIT-LINE-GUIDE.md`，包含：
- 工作原理图解
- 多个示例说明（50%, 30%, 70%）
- Canvas 和 FFmpeg 技术细节
- 使用场景建议
- 最佳实践

## 📊 逻辑说明

### 核心概念

**视频源（固定）**：
- 视频1：始终取源视频的上半部分（0% - 50%）
- 视频2：始终取源视频的下半部分（50% - 100%）

**输出布局（可调）**：
- 拼合线位置：决定两个视频在输出中的分界线
- 上部分高度：拼合线位置的百分比
- 下部分高度：100% - 拼合线位置

### 示例对比

#### 拼合线 50%（默认）
```
视频1源 (上半)  →  输出上部 (50%)
视频2源 (下半)  →  输出下部 (50%)
```

#### 拼合线 30%
```
视频1源 (上半)  →  输出上部 (30%)  ← 压缩
视频2源 (下半)  →  输出下部 (70%)  ← 拉伸
```

#### 拼合线 70%
```
视频1源 (上半)  →  输出上部 (70%)  ← 拉伸
视频2源 (下半)  →  输出下部 (30%)  ← 压缩
```

## 🎨 用户体验改进

### 改进前
- 用户可能误以为滑块会改变视频的裁剪区域
- 不清楚"分屏比例"的具体含义
- 没有视觉反馈显示拼合线位置

### 改进后
- 明确说明视频源始终是上下半部分
- "拼合线位置"更直观地表达功能
- 蓝色线条实时显示拼合线位置
- 文字标签强化视觉提示

## 🧪 测试建议

### 测试步骤
1. 上传两个不同内容的视频
2. 点击"更新预览"
3. 拖动"拼合线位置"滑块
4. 观察：
   - 百分比数字变化
   - 预览画面重绘
   - 蓝色拼合线移动
   - 上下部分高度变化

### 验证要点
- ✅ 拼合线位置准确
- ✅ 视频源始终是上下半部分
- ✅ 输出高度比例正确
- ✅ 动画流畅自然
- ✅ 标签清晰可见

## 📱 响应式支持

拼合线指示器在不同屏幕尺寸下都能正常显示：
- 桌面：完整显示
- 平板：自适应
- 手机：缩放显示

## 🔧 维护建议

### 样式调整
如需修改拼合线样式，编辑 `style.css`：
```css
.split-line {
    height: 2px;              /* 线条粗细 */
    background: ...;          /* 颜色渐变 */
    transition: top 0.3s ease; /* 动画速度 */
}
```

### 标签文字
如需修改标签文字，编辑 CSS：
```css
.split-line::before {
    content: '拼合线';  /* 修改这里 */
}
```

### 位置计算
如需调整位置计算逻辑，编辑 `script.js`：
```javascript
function updateSplitLine() {
    const ratio = parseInt(splitRatio.value) / 100;
    const linePosition = canvasHeight * ratio;
    splitLine.style.top = linePosition + 'px';
}
```

## 📚 相关文档

- **SPLIT-LINE-GUIDE.md** - 详细使用指南
- **README.md** - 项目总览
- **CHANGELOG.md** - 版本历史

## 🎉 成果

1. ✅ 术语更准确（拼合线位置）
2. ✅ 视觉反馈更直观（蓝色线条）
3. ✅ 用户理解更清晰（详细文档）
4. ✅ 交互体验更流畅（实时动画）

---

**版本**: 1.4.0  
**日期**: 2026-02-12  
**状态**: ✅ 已完成
