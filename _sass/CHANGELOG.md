# GPWZW Webapp Design System - Component Changelog

## Version 1.1.0 (2026-04-20) - Video Cut Generator Components Added

### New Components Added

#### 🎥 Video Player & Controls
- `.video-container` - Container for video player with card styling
- `#videoPlayer` - Video element styling with max-height and rounded corners
- `.video-controls` - Flex container for video control inputs
- `.control-group` - Individual control groups with labels and inputs
  - Includes styled number inputs with focus states

#### 📊 Progress Bar
- `.progress-bar` - Container with relative positioning
- `.progress-fill` - Animated gradient progress indicator
- `.progress-text` - Centered percentage text overlay

#### 🖼️ Frames Grid (Video Frame Selection)
- `.frames-hint` - Helper text for frame selection
- `.frames-grid` - Auto-fill grid layout for frame thumbnails
- `.frame-item` - Individual frame cards with hover/selected states
  - `.selected` modifier for selected frames
- `.frame-number` - Badge showing frame number with backdrop blur

#### 🎨 Selected Preview
- `.selected-preview` - Container for selected frame preview
- `#selectedCanvas` - Canvas element for frame preview display

#### 📱 Advanced Device Selection
- `.device-selection` - Main container for device options
- `.device-selection-header` - Header with toggle button
- `.btn-toggle-mode` - Button to toggle advanced mode
- `.device-options` - Grid layout for device radio buttons
  - Supports hiding/showing advanced devices via `[data-mode="advanced"]`
- `.device-option` - Radio button wrapper
  - `.original-size` modifier for original size option
- `.device-option-content` - Visual card content
- `.device-option-icon` - Device icon (28x28px)
- `.device-option-name` - Device name label
- `.device-option-size` - Device dimensions in monospace

#### 🎛️ Export Panel Extensions
- `.quality-group` - Quality slider control group
  - Custom range input styling with purple thumb
  - WebKit and Mozilla pseudo-element support
- `.btn-export` - Export button variant (larger padding than btn-download-all)

### Enhanced Components

#### Buttons
- `.btn-primary` - Now includes disabled state styling
- `.btn-secondary` - New secondary button variant
  - Elevated surface background
  - Subtle border
  - Hover state with border color change

### Responsive Updates

Added mobile responsive styles for new components:
- `.video-controls` → stacks vertically on mobile
- `.control-group` → full width on mobile
- `.frames-grid` → smaller minmax (140px) on mobile
- `.device-options` → single column on mobile, 2 columns on tablet
- `.btn-export` → full width on mobile

---

## Version 1.0.0 (2026-04-20) - Initial Release

### Original Components
- Design Tokens (colors, shadows, borders, typography)
- Layout Components (tool-page, tool-hero, tool-section, step headers)
- Upload Area Component
- Device Grid & Cards
- Export Panel
- Update Panel (Bing Today)
- Utility Classes
- Base Responsive Breakpoints

---

## Migration Impact

### wallpaper-video-cut-generator
**Before**: 653 lines of CSS  
**After**: ~10 lines of custom SCSS + import  
**Reduction**: 98%

The tool can now use:
```scss
@import '../_sass/webapp';

// Only tool-specific canvas sizing if needed
#selectedCanvas {
  // Custom adjustments if necessary
}
```

---

## Usage Examples

### Video Player Setup
```html
<div class="video-container">
  <video id="videoPlayer" controls>
    <source src="video.mp4" type="video/mp4">
  </video>
  
  <div class="video-controls">
    <div class="control-group">
      <label for="startTime">Start Time (seconds)</label>
      <input type="number" id="startTime" min="0" step="0.1" value="0">
    </div>
    
    <div class="control-group">
      <label for="endTime">End Time (seconds)</label>
      <input type="number" id="endTime" min="0" step="0.1" value="10">
    </div>
    
    <button class="btn-primary" id="extractBtn">Extract Frames</button>
  </div>
</div>
```

### Progress Bar
```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 65%"></div>
  <span class="progress-text">65%</span>
</div>
```

### Frames Grid
```html
<div class="frames-grid">
  <div class="frame-item selected" data-frame="1">
    <img src="frame1.jpg" alt="Frame 1">
    <span class="frame-number">#1</span>
  </div>
  <div class="frame-item" data-frame="2">
    <img src="frame2.jpg" alt="Frame 2">
    <span class="frame-number">#2</span>
  </div>
</div>
```

### Device Selection with Advanced Mode
```html
<div class="device-selection">
  <div class="device-selection-header">
    <h3>Select Output Size</h3>
    <button class="btn-toggle-mode" id="toggleMode">
      <svg><!-- icon --></svg>
      Show Advanced
    </button>
  </div>
  
  <div class="device-options">
    <label class="device-option original-size">
      <input type="radio" name="device" value="original" checked>
      <div class="device-option-content">
        <svg class="device-option-icon"><!-- icon --></svg>
        <span class="device-option-name">Original Size</span>
        <span class="device-option-size">1920 × 1080</span>
      </div>
    </label>
    
    <label class="device-option" data-mode="advanced">
      <input type="radio" name="device" value="iphone">
      <div class="device-option-content">
        <svg class="device-option-icon"><!-- icon --></svg>
        <span class="device-option-name">iPhone 14 Pro</span>
        <span class="device-option-size">1179 × 2556</span>
      </div>
    </label>
  </div>
</div>
```

```javascript
// Toggle advanced mode
document.getElementById('toggleMode').addEventListener('click', () => {
  document.body.classList.toggle('advanced-mode');
});
```

### Export with Quality Control
```html
<div class="export-panel">
  <div class="format-selector">
    <label class="format-label">Format</label>
    <div class="format-toggle">
      <button class="format-btn active" data-format="png">PNG</button>
      <button class="format-btn" data-format="jpeg">JPEG</button>
    </div>
    
    <div class="quality-group">
      <label for="quality">Quality: <span id="qualityValue">92</span>%</label>
      <input type="range" id="quality" min="10" max="100" value="92">
    </div>
  </div>
  
  <button class="btn-export" id="exportBtn">
    <svg><!-- download icon --></svg>
    Export Image
  </button>
</div>
```

---

## Design Decisions

### Why These Components?
1. **Video Controls**: Standardized input styling for time-based controls
2. **Progress Bar**: Visual feedback for long-running operations (video processing)
3. **Frames Grid**: Efficient thumbnail grid for frame selection
4. **Advanced Device Selection**: Progressive disclosure pattern - show common options first
5. **Quality Slider**: Fine-grained control for export quality

### Accessibility Considerations
- All interactive elements have proper focus states
- Radio buttons use semantic HTML with visual enhancement
- Progress bar uses text overlay for screen readers
- Color contrast meets WCAG AA standards

### Performance Optimizations
- GPU-accelerated transforms for hover effects
- Backdrop-filter only used where necessary (frame numbers)
- Efficient grid layouts with auto-fill
- Minimal use of expensive properties

---

## Testing Checklist

For tools using these new components:

- [ ] Video player displays correctly on all screen sizes
- [ ] Progress bar animates smoothly
- [ ] Frame grid scrolls properly on mobile
- [ ] Device selection toggles work correctly
- [ ] Quality slider updates value display
- [ ] All buttons have proper disabled states
- [ ] Focus states are visible for keyboard navigation
- [ ] Touch targets are large enough on mobile (44x44px minimum)

---

## Future Enhancements

Potential additions for v1.2.0:
- Timeline scrubber component for video editing
- Multi-select frames grid mode
- Preset quality levels (Low, Medium, High, Lossless)
- Batch export progress tracking
- Video thumbnail generator utility

---

**Last Updated**: 2026-04-20  
**Version**: 1.1.0  
**Components Added**: 25+ new classes  
**Tools Benefiting**: wallpaper-video-cut-generator and future video tools
