# 缓存功能说明

## 功能概述

视频截取壁纸生成器现在会自动记住用户上次的导出设置，下次使用时自动恢复这些设置。

## 缓存的设置项

1. **设备尺寸选择**
   - 记住用户选择的设备类型（原画大小、iPhone、iPad、MacBook 等）
   - 缓存键：`wallpaper-video-cut-device`
   - 默认值：`original`（原画大小）

2. **图片格式选择**
   - 记住用户选择的导出格式（PNG、JPEG、WEBP）
   - 缓存键：`wallpaper-video-cut-format`
   - 默认值：`png`

3. **图片质量/压缩比例**
   - 记住用户设置的质量百分比（1-100）
   - 缓存键：`wallpaper-video-cut-quality`
   - 默认值：`90`
   - 仅在选择 JPEG 或 WEBP 格式时生效

## 工作原理

### 保存时机
- 用户切换设备选项时，立即保存到 localStorage
- 用户切换图片格式时，立即保存到 localStorage
- 用户调整质量滑块并释放时，保存到 localStorage

### 恢复时机
- 页面加载完成后，自动从 localStorage 读取上次的设置
- 如果没有缓存记录，使用默认值

### 数据存储
- 使用浏览器的 localStorage API
- 数据永久保存在本地，除非用户清除浏览器数据
- 不同浏览器的缓存独立存储

## 用户体验改进

### 使用场景示例

**场景 1：批量导出相同格式**
1. 用户第一次使用，选择 "iPhone 15 Pro Max" + "JPEG" + "85% 质量"
2. 导出第一张壁纸
3. 更换视频或选择其他画面
4. 导出设置自动保持为 "iPhone 15 Pro Max" + "JPEG" + "85%"
5. 无需重复选择，提高效率

**场景 2：跨会话使用**
1. 用户今天使用工具，选择了 "原画大小" + "PNG"
2. 关闭浏览器
3. 明天再次打开工具
4. 导出设置自动恢复为 "原画大小" + "PNG"

**场景 3：个性化偏好**
- 喜欢高质量 PNG 的用户：设置会一直保持 PNG 格式
- 需要小文件的用户：设置会保持 JPEG + 较低质量
- 特定设备用户：设置会保持特定设备尺寸

## 技术实现

### 缓存键定义
```javascript
const CACHE_KEYS = {
    DEVICE: 'wallpaper-video-cut-device',
    FORMAT: 'wallpaper-video-cut-format',
    QUALITY: 'wallpaper-video-cut-quality'
};
```

### 保存函数
```javascript
function saveToCache(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.warn('无法保存到缓存:', e);
    }
}
```

### 读取函数
```javascript
function getFromCache(key, defaultValue) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (e) {
        console.warn('无法读取缓存:', e);
        return defaultValue;
    }
}
```

### 恢复函数
```javascript
function restoreUserPreferences() {
    // 恢复设备选择
    const savedDevice = getFromCache(CACHE_KEYS.DEVICE, 'original');
    const deviceRadio = document.querySelector(`input[name="device"][value="${savedDevice}"]`);
    if (deviceRadio) {
        deviceRadio.checked = true;
    }
    
    // 恢复格式选择
    const savedFormat = getFromCache(CACHE_KEYS.FORMAT, 'png');
    const formatRadio = document.querySelector(`input[name="format"][value="${savedFormat}"]`);
    if (formatRadio) {
        formatRadio.checked = true;
        handleFormatChange({ target: formatRadio });
    }
    
    // 恢复质量设置
    const savedQuality = getFromCache(CACHE_KEYS.QUALITY, '90');
    qualityInput.value = savedQuality;
    qualityValue.textContent = savedQuality;
}
```

## 错误处理

- 使用 try-catch 包裹 localStorage 操作
- 如果浏览器禁用了 localStorage，会在控制台输出警告但不影响功能
- 如果读取失败，使用默认值确保功能正常

## 隐私说明

- 所有数据仅存储在用户本地浏览器中
- 不会上传到服务器
- 用户可以通过清除浏览器数据来删除缓存
- 符合隐私保护要求

## 浏览器兼容性

- 支持所有现代浏览器（Chrome、Firefox、Safari、Edge）
- localStorage API 兼容性：IE 8+
- 在不支持的环境中会优雅降级，使用默认值

---

**更新日期**: 2026-02-12
**版本**: 1.1.0
