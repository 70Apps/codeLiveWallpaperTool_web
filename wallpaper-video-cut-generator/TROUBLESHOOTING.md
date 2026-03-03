# 故障排除指南

## 问题：无法选择新的导出比例格式

### 可能的原因和解决方案

#### 1. 导出区域未显示
**症状**：看不到设备选项和格式选项

**原因**：导出区域只有在选择画面后才会显示

**解决方案**：
1. 上传视频文件
2. 点击"开始截取画面"
3. 等待截取完成
4. 点击任意一个画面
5. 导出区域会自动显示，然后可以选择设备和格式

#### 2. 浏览器缓存问题
**症状**：选项无法点击或不响应

**解决方案**：
1. 按 Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac) 强制刷新页面
2. 清除浏览器缓存
3. 重新加载页面

#### 3. JavaScript 错误
**症状**：页面功能异常

**解决方案**：
1. 按 F12 打开开发者工具
2. 查看 Console 标签是否有错误信息
3. 刷新页面重试

#### 4. localStorage 被禁用
**症状**：设置无法保存，但可以选择

**解决方案**：
1. 检查浏览器设置，确保允许网站存储数据
2. 如果使用隐私模式，localStorage 可能被禁用
3. 切换到正常浏览模式

### 调试步骤

如果问题仍然存在，请按以下步骤调试：

1. **打开开发者工具**
   - Windows/Linux: 按 F12
   - Mac: 按 Cmd+Option+I

2. **查看 Console 标签**
   - 应该看到以下日志：
     ```
     Restoring user preferences...
     Saved device: original
     Device restored to: original
     Saved format: png
     Format restored to: png
     Saved quality: 90
     User preferences restored successfully
     ```

3. **尝试选择设备**
   - 点击任意设备选项
   - 应该看到日志：
     ```
     Device changed to: iphone-15-pro-max
     Saving to cache: wallpaper-video-cut-device = iphone-15-pro-max
     Successfully saved: wallpaper-video-cut-device
     ```

4. **尝试选择格式**
   - 点击任意格式选项
   - 应该看到日志：
     ```
     Format changed to: jpeg
     Saving to cache: wallpaper-video-cut-format = jpeg
     Successfully saved: wallpaper-video-cut-format
     ```

5. **检查 localStorage**
   - 在 Console 中输入：
     ```javascript
     localStorage.getItem('wallpaper-video-cut-device')
     localStorage.getItem('wallpaper-video-cut-format')
     localStorage.getItem('wallpaper-video-cut-quality')
     ```
   - 应该看到保存的值

### 常见问题

#### Q: 为什么我看不到导出选项？
A: 导出选项只有在选择画面后才会显示。请先上传视频、截取画面、然后点击一个画面。

#### Q: 我的选择没有被保存？
A: 检查浏览器是否允许 localStorage。在隐私模式下，localStorage 可能被禁用。

#### Q: 刷新页面后设置丢失？
A: 这是正常的，如果 localStorage 被禁用。请使用正常浏览模式。

#### Q: 点击选项没有反应？
A: 
1. 检查是否有 JavaScript 错误（F12 → Console）
2. 尝试强制刷新页面（Ctrl+Shift+R）
3. 尝试其他浏览器

### 浏览器兼容性

支持的浏览器：
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

如果使用旧版本浏览器，可能会出现兼容性问题。

### 联系支持

如果以上方法都无法解决问题，请提供以下信息：
1. 浏览器名称和版本
2. 操作系统
3. Console 中的错误信息（如果有）
4. 问题的详细描述和重现步骤

---

**更新日期**: 2026-02-12
