# 🚀 Quick Start Guide - Webapp Design System

Get started with the unified design system in under 5 minutes!

---

## Option 1: Use in Existing Tool (Recommended)

### Step 1: Import the Design System

In your tool's directory, create or update `style.scss`:

```scss
// wallpaper-your-tool/style.scss
@import '../_sass/webapp';
```

### Step 2: Update HTML Structure

Use the design system classes in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body class="webapp-design-system">
  <div class="tool-page">
    <!-- Hero Section -->
    <section class="tool-hero">
      <div class="tool-logo">
        <img src="your-logo.png" alt="Tool Logo">
      </div>
      <h1 class="tool-title">Your Tool Name</h1>
      <p class="tool-desc">Brief description of what this tool does</p>
    </section>
    
    <hr class="section-divider">
    
    <!-- Content Section -->
    <section class="tool-section">
      <div class="step-header">
        <div class="step-number">1</div>
        <div class="step-info">
          <h2 class="step-title">Step Title</h2>
          <p class="step-desc">Step description text</p>
        </div>
      </div>
      
      <!-- Upload Area -->
      <div class="upload-area" id="uploadArea">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p class="upload-text">Drop image here or click to upload</p>
        <p class="upload-hint">Supports JPG, PNG, WebP</p>
        <img class="upload-preview-img" id="previewImg" alt="Preview">
      </div>
    </section>
    
    <hr class="section-divider">
    
    <!-- Preview Section -->
    <section class="tool-section" id="preview-section">
      <div class="step-header">
        <div class="step-number">2</div>
        <div class="step-info">
          <h2 class="step-title">Preview & Download</h2>
          <p class="step-desc">Download your generated wallpapers</p>
        </div>
      </div>
      
      <!-- Device Grid -->
      <div class="device-grid">
        <div class="device-card">
          <div class="device-card-header">
            <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            <h3>iPhone 14 Pro</h3>
            <span class="device-size">1179 × 2556</span>
          </div>
          <div class="device-preview">
            <img src="preview.jpg" alt="Preview" class="loaded">
            <div class="preview-placeholder">No preview</div>
          </div>
          <button class="btn-device-download">Download</button>
        </div>
        
        <!-- Add more device cards as needed -->
      </div>
    </section>
    
    <hr class="section-divider">
    
    <!-- Export Section -->
    <section class="tool-section" id="export-section">
      <div class="export-panel">
        <div class="format-selector">
          <label class="format-label">Output Format</label>
          <div class="format-toggle">
            <button class="format-btn active">PNG</button>
            <button class="format-btn">JPG</button>
          </div>
          <span class="format-hint">PNG recommended for best quality</span>
        </div>
        <button class="btn-download-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download All
        </button>
      </div>
    </section>
  </div>
  
  <script src="script.js"></script>
</body>
</html>
```

### Step 3: Add Minimal JavaScript

```javascript
// wallpaper-your-tool/script.js

// Upload area functionality
const uploadArea = document.getElementById('uploadArea');
const previewImg = document.getElementById('previewImg');

// Handle file selection
uploadArea.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = handleFileSelect;
  input.click();
});

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.classList.add('loaded');
      uploadArea.classList.add('img-loaded');
    };
    reader.readAsDataURL(file);
  }
}

// Drag and drop support
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    // Process file same as handleFileSelect
  }
});
```

**Done!** ✅ Your tool now uses the unified design system.

---

## Option 2: Migrate Existing Tool

If you already have a tool with its own `style.css`:

### Before Migration
```
wallpaper-existing-tool/
├── index.html
├── script.js
└── style.css (500+ lines)
```

### After Migration
```
wallpaper-existing-tool/
├── index.html (updated with design system classes)
├── script.js (unchanged)
├── style.scss (NEW - 5 lines)
└── style.css.old (backup of original)
```

### Migration Steps

1. **Backup** your current CSS:
   ```bash
   mv wallpaper-existing-tool/style.css wallpaper-existing-tool/style.css.old
   ```

2. **Create** new SCSS file:
   ```scss
   // wallpaper-existing-tool/style.scss
   @import '../_sass/webapp';
   
   // Only add tool-specific custom styles below
   .my-custom-feature {
     /* unique styles */
   }
   ```

3. **Update** HTML to use design system classes (see examples above)

4. **Compile** SCSS to CSS:
   ```bash
   # Install Sass if needed
   npm install -g sass
   
   # Compile
   sass wallpaper-existing-tool/style.scss wallpaper-existing-tool/style.css
   ```

5. **Test** thoroughly!

---

## Common Patterns Cheat Sheet

### Upload Area with Preview
```html
<div class="upload-area" id="uploadArea">
  <svg class="upload-icon"><!-- icon --></svg>
  <p class="upload-text">Upload text</p>
  <p class="upload-hint">Hint text</p>
  <img class="upload-preview-img" id="previewImg">
</div>
```

```javascript
// Show preview
previewImg.src = imageUrl;
previewImg.classList.add('loaded');
uploadArea.classList.add('img-loaded');
```

### Device Grid (Responsive)
```html
<!-- 4 columns (default) -->
<div class="device-grid">...</div>

<!-- 3 columns -->
<div class="device-grid grid-3-cols">...</div>

<!-- 2 columns -->
<div class="device-grid grid-2-cols">...</div>

<!-- 1 column -->
<div class="device-grid grid-1-col">...</div>
```

### Best Match Card
```html
<div class="device-card best-match">
  <div class="device-card-header">
    <svg class="device-icon"><!-- icon --></svg>
    <h3>Device Name</h3>
    <span class="device-size">W × H</span>
    <span class="best-match-badge">BEST MATCH</span>
  </div>
  <!-- ... -->
</div>
```

### Vertical Export Panel (Mobile-Friendly)
```html
<div class="export-panel vertical">
  <div class="format-selector centered">
    <label class="format-label">Format</label>
    <div class="format-toggle full-width">
      <button class="format-btn flex-equal active">PNG</button>
      <button class="format-btn flex-equal">JPG</button>
    </div>
  </div>
  <button class="btn-download-main full-width">Download</button>
</div>
```

### Loading State
```html
<div class="update-panel loading">
  <!-- Content -->
</div>
```

```javascript
// Toggle loading
panel.classList.add('loading');
// ... async operation ...
panel.classList.remove('loading');
```

---

## Troubleshooting

### Styles Not Applying?

✅ Check that `webapp-design-system` class is on body or container  
✅ Verify SCSS import path is correct  
✅ Ensure CSS is compiled (if using SCSS)  
✅ Check browser cache (hard refresh: Cmd+Shift+R / Ctrl+Shift+R)  

### Components Look Wrong?

✅ Verify HTML structure matches examples  
✅ Check for typos in class names  
✅ Ensure all required child elements are present  
✅ Review browser console for errors  

### Responsive Layout Broken?

✅ Test on actual devices or use browser dev tools  
✅ Check viewport meta tag in HTML:  
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## Need Help?

📖 **Full Documentation**: See `WEBAPP-DESIGN-SYSTEM.md`  
📝 **Migration Guide**: See `MIGRATION-EXAMPLES.md`  
📋 **Component Reference**: See `_webapp.scss` comments  

---

## Next Steps

1. ✅ Try the quick start example above
2. ✅ Explore existing tools for real-world examples:
   - `/wallpaper-mutiple-size-generator/`
   - `/wallpaper-image-type-convertor/`
   - `/wallpaper-bing-today/`
3. ✅ Build your first tool using the design system
4. ✅ Share feedback for improvements

---

**Happy Coding!** 🎉

Remember: The goal is **consistency** and **efficiency**. Use the design system classes whenever possible, and only add custom CSS when absolutely necessary.
