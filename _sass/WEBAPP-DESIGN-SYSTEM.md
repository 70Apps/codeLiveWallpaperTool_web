# GPWZW Webapp Design System

## Overview

The `_webapp.scss` file contains a unified design system for all webapp tools in the GPWZW project. It provides reusable components, design tokens, and responsive layouts that ensure consistency across all tools.

## Quick Start

### 1. Import the Design System

In your webapp tool's main SCSS file or at the top of your CSS:

```scss
// For SCSS projects
@import '../_sass/webapp';

// Or include it in your main.scss
```

### 2. Apply the Design System Class

Add the `webapp-design-system` class to your root element or body:

```html
<body class="webapp-design-system">
  <!-- Your content -->
</body>
```

Or use it on a specific container:

```html
<div class="webapp-design-system">
  <div class="tool-page">
    <!-- Tool content -->
  </div>
</div>
```

## Available Components

### Layout Components

#### Tool Page Container
```html
<div class="tool-page">
  <!-- Main content -->
</div>
```

#### Hero Section
```html
<section class="tool-hero">
  <div class="tool-logo">
    <img src="logo.png" alt="Tool Logo">
  </div>
  <h1 class="tool-title">Tool Name</h1>
  <p class="tool-desc">Tool description goes here</p>
</section>
```

#### Tool Section with Steps
```html
<section class="tool-section">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-info">
      <h2 class="step-title">Step Title</h2>
      <p class="step-desc">Step description</p>
    </div>
  </div>
  <!-- Step content -->
</section>
```

### Upload Area Component

```html
<div class="upload-area" id="uploadArea">
  <svg class="upload-icon"><!-- icon --></svg>
  <p class="upload-text">Drop image here or click to upload</p>
  <p class="upload-hint">Supports JPG, PNG, WebP</p>
  <img class="upload-preview-img" id="previewImg" alt="Preview">
</div>
```

**JavaScript usage:**
```javascript
// Add loaded state when image is ready
document.getElementById('previewImg').classList.add('loaded');
document.getElementById('uploadArea').classList.add('img-loaded');

// Add drag-over state during drag
uploadArea.addEventListener('dragover', () => {
  uploadArea.classList.add('drag-over');
});
```

### Device Grid & Cards

```html
<div class="device-grid">
  <div class="device-card">
    <div class="device-card-header">
      <svg class="device-icon"><!-- icon --></svg>
      <h3>iPhone 14 Pro</h3>
      <span class="device-size">1179 × 2556</span>
      <span class="best-match-badge">BEST MATCH</span>
    </div>
    <div class="device-preview">
      <img src="preview.jpg" alt="Preview" class="loaded">
      <div class="preview-placeholder">No preview</div>
    </div>
    <button class="btn-device-download">Download</button>
  </div>
</div>
```

**Grid Column Modifiers:**
- Default: 4 columns
- `.grid-3-cols`: 3 columns
- `.grid-2-cols`: 2 columns  
- `.grid-1-col`: 1 column

### Export Panel

```html
<div class="export-panel">
  <div class="format-selector">
    <label class="format-label">Output Format</label>
    <div class="format-toggle">
      <button class="format-btn active">PNG</button>
      <button class="format-btn">JPG</button>
    </div>
    <span class="format-hint">PNG recommended for quality</span>
  </div>
  <button class="btn-download-all">
    <svg><!-- download icon --></svg>
    Download All
  </button>
</div>
```

**Modifiers:**
- `.export-panel.vertical`: Stack elements vertically
- `.format-toggle.full-width`: Full width toggle
- `.format-btn.flex-equal`: Equal width buttons
- `.btn-download-all.full-width`: Full width button

### Update Panel (for dynamic content tools)

```html
<div class="update-panel">
  <div class="update-left">
    <div class="upload-preview">
      <img src="image.jpg" alt="Preview" class="loaded">
      <span class="preview-placeholder-text">Loading...</span>
    </div>
  </div>
  <div class="update-right">
    <div class="toolbar">
      <button>Previous</button>
      <span>1 / 10</span>
      <button>Next</button>
    </div>
    <div class="region-bar">
      <button class="active">US</button>
      <button>CN</button>
      <button>JP</button>
    </div>
    <button class="btn-primary">Update Wallpaper</button>
  </div>
</div>
```

**Loading State:**
```javascript
// Add loading state
panel.classList.add('loading');

// Remove loading state
panel.classList.remove('loading');
```

## Utility Classes

### Visibility
- `.hidden`: Completely hides element (`display: none`)
- `.visually-hidden`: Hides visually but keeps accessible to screen readers

### Labels
```html
<span class="section-label">Section Label</span>
```

### Buttons
- `.btn-primary`: Primary action button
- `.btn-pill`: Small pill-shaped badge/button

## Design Tokens (CSS Custom Properties)

All colors and values are available as CSS custom properties:

### Colors
```css
var(--pure-white)        /* #ffffff */
var(--pure-black)        /* #000000 */
var(--surface-base)      /* #0a0a0a */
var(--surface-card)      /* #141414 */
var(--surface-hover)     /* #1a1a1a */
var(--gallery-purple)    /* #8b5cf6 */
var(--purple-light)      /* #a78bfa */
var(--purple-dark)       /* #7c3aed */
```

### White Opacity Variants
```css
var(--white-80)  /* rgba(255,255,255,0.80) */
var(--white-60)  /* rgba(255,255,255,0.60) */
var(--white-40)  /* rgba(255,255,255,0.40) */
var(--white-20)  /* rgba(255,255,255,0.20) */
var(--white-10)  /* rgba(255,255,255,0.10) */
var(--white-06)  /* rgba(255,255,255,0.06) */
```

### Borders & Shadows
```css
var(--border-whisper)   /* Subtle border */
var(--border-subtle)    /* Light border */
var(--shadow-card)      /* Card shadow */
var(--shadow-hover)     /* Hover shadow with glow */
```

### Typography
```css
var(--font-sans)   /* Inter, system fonts */
var(--font-mono)   /* JetBrains Mono */
```

## Responsive Behavior

The design system automatically adapts to different screen sizes:

- **Desktop (>1024px)**: Full layout with 4-column grids
- **Tablet (641px - 1024px)**: 2-column grids
- **Mobile (≤640px)**: Single column, stacked layouts

No additional media queries needed - just use the component classes!

## Migration Guide

### From Individual style.css Files

If you have an existing tool with its own `style.css`:

1. **Backup** your current `style.css`
2. **Import** `_webapp.scss` at the top
3. **Replace** duplicate styles with the unified classes
4. **Keep** only tool-specific custom styles
5. **Test** thoroughly to ensure everything still works

### Example Migration

**Before:**
```css
/* Old style.css with duplicated code */
:root {
  --pure-white: #ffffff;
  /* ... 50+ lines of variables ... */
}

.tool-page {
  max-width: 1440px;
  /* ... duplicated layout code ... */
}
```

**After:**
```scss
// New style.scss
@import '../_sass/webapp';

// Only tool-specific styles below
.custom-tool-feature {
  /* Your unique styles */
}
```

## Best Practices

1. **Always use the design system classes** instead of writing custom CSS when possible
2. **Extend, don't override**: Add new modifiers rather than changing base styles
3. **Use CSS custom properties** for consistent theming
4. **Test responsive behavior** on all breakpoints
5. **Keep tool-specific styles minimal** - leverage the shared system

## Contributing

When adding new components or modifying existing ones:

1. Ensure changes work across all tools
2. Test on all breakpoints
3. Update this documentation
4. Maintain backward compatibility when possible

## Examples

See these tools for real-world usage:
- `/wallpaper-mutiple-size-generator/`
- `/wallpaper-image-type-convertor/`
- `/wallpaper-bing-today/`

---

**Last Updated**: 2026-04-20
**Version**: 1.0.0
