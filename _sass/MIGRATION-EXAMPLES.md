# Migration Examples for Existing Tools

This document shows how to migrate the three existing tools to use the unified `_webapp.scss` design system.

## 1. Wallpaper Multiple Size Generator

### Current Structure
```
wallpaper-mutiple-size-generator/
├── index.html
├── script.js
└── style.css (547 lines)
```

### Migration Steps

#### Step 1: Create new SCSS file
Create `wallpaper-mutiple-size-generator/style.scss`:

```scss
@import '../_sass/webapp';

// Tool-specific styles only (if any)
// Most styles are now covered by _webapp.scss
```

#### Step 2: Update HTML class usage
The HTML structure already matches the design system, so minimal changes needed:

```html
<!-- Already compatible - no changes needed -->
<div class="tool-page">
  <section class="tool-hero">
    <div class="tool-logo">
      <img src="..." alt="Logo">
    </div>
    <h1 class="tool-title">Multiple Size Generator</h1>
    <p class="tool-desc">Generate wallpapers in multiple sizes</p>
  </section>
  
  <hr class="section-divider">
  
  <section class="tool-section">
    <div class="step-header">
      <div class="step-number">1</div>
      <div class="step-info">
        <h2 class="step-title">Upload Image</h2>
        <p class="step-desc">Select your wallpaper image</p>
      </div>
    </div>
    
    <div class="upload-area" id="uploadArea">
      <!-- Upload content -->
    </div>
  </section>
  
  <!-- More sections... -->
</div>
```

#### Step 3: Reduce CSS file
Replace `style.css` content with just imports or remove it entirely if using SCSS compilation.

**Reduction**: From 547 lines → ~5 lines (99% reduction!)

---

## 2. Wallpaper Image Type Convertor

### Current Structure
```
wallpaper-image-type-convertor/
├── index.html
├── script.js
└── style.css (577 lines)
```

### Migration Steps

#### Step 1: Create SCSS file
```scss
@import '../_sass/webapp';

// The image convertor uses the standard grid with 3 columns
.device-grid {
  @extend .grid-3-cols; // Or add class in HTML
}

// Any tool-specific customizations
.preview-export-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.device-card-single {
  width: 100%;
}
```

#### Step 2: Update device grid in HTML
```html
<!-- Add modifier class for 3-column layout -->
<div class="device-grid grid-3-cols">
  <div class="device-card best-match">
    <!-- Card content -->
  </div>
</div>
```

#### Step 3: Use vertical export panel
```html
<div class="export-panel vertical">
  <div class="format-selector centered">
    <label class="format-label">Output Format</label>
    <div class="format-toggle full-width">
      <button class="format-btn flex-equal active">PNG</button>
      <button class="format-btn flex-equal">JPG</button>
    </div>
  </div>
  <button class="btn-download-main full-width">
    Download Converted Image
  </button>
</div>
```

**Reduction**: From 577 lines → ~20 lines (96% reduction!)

---

## 3. Wallpaper Bing Today

### Current Structure
```
wallpaper-bing-today/
├── index.html
├── script.js
└── style.css (653 lines)
```

### Migration Steps

#### Step 1: Create SCSS file
```scss
@import '../_sass/webapp';

// Bing Today specific styles (minimal)
.update-panel .btn-primary {
  // Already included in design system
}

// Hide sections when needed
.hidden-grid {
  display: none;
}

.hidden-export {
  display: none;
}
```

#### Step 2: Use update panel component
```html
<div class="update-panel" id="updatePanel">
  <div class="update-left">
    <div class="upload-preview" id="uploadPreview">
      <img id="previewImg" alt="Bing Wallpaper Preview">
      <span class="preview-placeholder-text">Click "Update" to load today's wallpaper</span>
    </div>
  </div>
  
  <div class="update-right">
    <div class="toolbar">
      <button id="prevBtn">← Previous</button>
      <span id="dateDisplay">Today</span>
      <button id="nextBtn">Next →</button>
    </div>
    
    <div class="region-bar">
      <button class="active" data-region="en-US">US</button>
      <button data-region="zh-CN">CN</button>
      <button data-region="ja-JP">JP</button>
    </div>
    
    <div class="format-selector">
      <label class="format-label">Format</label>
      <div class="format-toggle">
        <button class="format-btn active" data-format="jpg">JPG</button>
        <button class="format-btn" data-format="png">PNG</button>
      </div>
    </div>
    
    <button class="btn-primary" id="updateBtn">Update Wallpaper</button>
  </div>
</div>
```

#### Step 3: Loading state management
```javascript
// JavaScript usage
const panel = document.getElementById('updatePanel');

// Show loading
panel.classList.add('loading');

// Hide loading after fetch completes
fetchWallpaper().then(() => {
  panel.classList.remove('loading');
});
```

**Reduction**: From 653 lines → ~15 lines (98% reduction!)

---

## Benefits of Migration

### Code Reduction
- **Total lines removed**: ~1,777 lines of duplicated CSS
- **Average reduction per tool**: 97%
- **Maintenance burden**: Significantly reduced

### Consistency
- All tools use the same design language
- Unified color scheme and spacing
- Consistent responsive behavior

### Maintainability
- Fix a bug once, fix it everywhere
- Easy to update design system globally
- New tools can be built faster

### Performance
- Shared styles can be cached across tools
- Smaller individual CSS files
- Better browser caching strategy

---

## Implementation Checklist

For each tool:

- [ ] Create `style.scss` file with `@import '../_sass/webapp';`
- [ ] Review HTML structure matches design system classes
- [ ] Test all components render correctly
- [ ] Verify responsive behavior on mobile/tablet
- [ ] Remove or minimize old `style.css`
- [ ] Update build process to compile SCSS (if needed)
- [ ] Test all interactive features still work
- [ ] Cross-browser testing

---

## Build Configuration (Optional)

If you want to compile SCSS to CSS, add to your project:

### Using Sass CLI
```bash
# Install Sass
npm install -g sass

# Compile single file
sass wallpaper-mutiple-size-generator/style.scss wallpaper-mutiple-size-generator/style.css

# Watch mode
sass --watch wallpaper-mutiple-size-generator/style.scss:wallpaper-mutiple-size-generator/style.css
```

### Using Jekyll (already configured)
Since this is a Jekyll project, SCSS files in `_sass/` are automatically compiled. Just ensure your HTML references the compiled CSS from `css/main.scss`.

---

## Next Steps

1. **Start with one tool** - Migrate the simplest tool first
2. **Test thoroughly** - Ensure everything works as expected
3. **Document any issues** - Note any edge cases or special requirements
4. **Migrate remaining tools** - Apply lessons learned
5. **Remove duplicate code** - Clean up old CSS files
6. **Update documentation** - Keep this guide current

---

**Questions?** Refer to `WEBAPP-DESIGN-SYSTEM.md` for detailed component documentation.
