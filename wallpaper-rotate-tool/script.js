// Wallpaper Rotate Tool
// 壁纸旋转工具 - 直接生成五个变换

// DOM Elements
const uploadArea = document.getElementById('upload-preview-area');
const imageUploadInput = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const resultsSection = document.getElementById('results-section');
const exportSection = document.getElementById('export-section');
const downloadAllBtn = document.getElementById('download-button');
const imageFormatInput = document.getElementById('image-format');

// Transformation variants
const VARIATIONS = {
  'rotate-90': { type: 'rotate', angle: -90 },      // Rotate -90° (clockwise)
  'rotate-270': { type: 'rotate', angle: 90 },      // Rotate 90° (clockwise)
  'rotate-180': { type: 'rotate', angle: 180 },     // Rotate 180°
  'flip-x': { type: 'flip', axis: 'x' },            // Horizontal flip (mirror X)
  'flip-y': { type: 'flip', axis: 'y' }             // Vertical flip (mirror Y)
};

// State
let sourceImage = null;

// Initialize: Hide results and export sections
resultsSection.classList.add('hidden');
exportSection.classList.add('hidden');

// ============================================
// Drag & Drop Functionality
// ============================================

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false);
  uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  uploadArea.addEventListener(eventName, () => {
    uploadArea.classList.add('drag-over');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  uploadArea.addEventListener(eventName, () => {
    uploadArea.classList.remove('drag-over');
  }, false);
});

uploadArea.addEventListener('drop', handleDrop, false);
uploadArea.addEventListener('click', () => {
  imageUploadInput.click();
});

function handleDrop(e) {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      handleImageFile(file);
    } else {
      alert('Please drop an image file (PNG, JPEG, WebP, AVIF)');
    }
  }
}

imageUploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleImageFile(file);
  }
});

// ============================================
// Image Processing
// ============================================

function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      sourceImage = img;
      
      // Show preview
      imagePreview.src = img.src;
      imagePreview.onload = () => {
        imagePreview.classList.add('loaded');
        uploadArea.classList.add('img-loaded');
      };
      
      // Generate all variations
      generateAllVariations();
      
      // Show results and export sections
      resultsSection.classList.remove('hidden');
      exportSection.classList.remove('hidden');
      
      // Smooth scroll to results
      setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function generateAllVariations() {
  if (!sourceImage || !sourceImage.complete) {
    console.error('Invalid image provided');
    return;
  }

  const format = imageFormatInput.value;
  const { mimeType, quality } = getFormatSettings(format);

  // Process each variation
  Object.keys(VARIATIONS).forEach(variationKey => {
    const variation = VARIATIONS[variationKey];
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate canvas dimensions based on transformation
    let canvasWidth, canvasHeight;
    
    if (variation.type === 'rotate' && (variation.angle === 90 || variation.angle === -90)) {
      // For 90° rotations, swap width and height
      canvasWidth = sourceImage.height;
      canvasHeight = sourceImage.width;
    } else {
      // For 180° rotation and flips, dimensions stay the same
      canvasWidth = sourceImage.width;
      canvasHeight = sourceImage.height;
    }
    
    // Set canvas dimensions BEFORE applying transformations
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Apply transformation
    if (variation.type === 'rotate') {
      applyRotation(ctx, canvasWidth, canvasHeight, variation.angle);
    } else if (variation.type === 'flip') {
      applyFlip(ctx, canvasWidth, canvasHeight, variation.axis);
    }
    
    // Draw image to transformed canvas
    ctx.drawImage(sourceImage, 0, 0);
    
    // Update preview
    const previewImg = document.getElementById(`${variationKey}-preview`);
    if (previewImg) {
      previewImg.src = canvas.toDataURL(mimeType, quality);
      previewImg.onload = () => {
        previewImg.classList.add('loaded');
      };
    }
  });
}

function applyRotation(ctx, width, height, angle) {
  const rad = (angle * Math.PI) / 180;
  
  // Translate to center, rotate, then translate back
  ctx.translate(width / 2, height / 2);
  ctx.rotate(rad);
  
  // For 90° rotations, we need to adjust the drawing position
  if (angle === 90 || angle === -90) {
    ctx.translate(-height / 2, -width / 2);
  } else {
    ctx.translate(-width / 2, -height / 2);
  }
}

function applyFlip(ctx, width, height, axis) {
  if (axis === 'x') {
    // Horizontal flip (mirror X)
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  } else if (axis === 'y') {
    // Vertical flip (mirror Y)
    ctx.translate(0, height);
    ctx.scale(1, -1);
  }
}

function getFormatSettings(format) {
  switch (format) {
    case 'jpeg':
      return { mimeType: 'image/jpeg', quality: 0.92, extension: 'jpg' };
    case 'webp':
      return { mimeType: 'image/webp', quality: 0.92, extension: 'webp' };
    default:
      return { mimeType: 'image/png', quality: undefined, extension: 'png' };
  }
}

// ============================================
// Format Selection
// ============================================

document.querySelectorAll('.format-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    if (this.disabled) return;
    
    const format = this.getAttribute('data-format');
    
    // Update active state
    document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    // Update hidden input
    imageFormatInput.value = format;
    
    // Regenerate all wallpapers
    if (sourceImage) {
      generateAllVariations();
    }
  });
});

// Check WebP support
(function checkWebPSupport() {
  let supported = false;
  try {
    const canvas = document.createElement('canvas');
    supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch (e) {
    supported = false;
  }
  
  const webpBtn = document.querySelector('.format-btn[data-format="webp"]');
  if (!supported && webpBtn) {
    webpBtn.classList.add('disabled');
    webpBtn.disabled = true;
    webpBtn.setAttribute('aria-disabled', 'true');
    
    // Fallback to PNG if WebP was active
    if (webpBtn.classList.contains('active')) {
      const pngBtn = document.querySelector('.format-btn[data-format="png"]');
      if (pngBtn) {
        webpBtn.classList.remove('active');
        pngBtn.classList.add('active');
        imageFormatInput.value = 'png';
      }
    }
  }
})();

// ============================================
// Download Functionality
// ============================================

// Download all as ZIP
downloadAllBtn.addEventListener('click', () => {
  const format = imageFormatInput.value;
  const { extension } = getFormatSettings(format);
  
  const zip = new JSZip();
  
  Object.keys(VARIATIONS).forEach(variationKey => {
    const variation = VARIATIONS[variationKey];
    const previewImg = document.getElementById(`${variationKey}-preview`);
    
    if (previewImg && previewImg.src) {
      // Extract base64 data
      const base64Data = previewImg.src.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      let variationName;
      
      if (variationKey === 'rotate-90') variationName = 'rotate_-90';
      else if (variationKey === 'rotate-270') variationName = 'rotate_90';
      else if (variationKey === 'rotate-180') variationName = 'rotate_180';
      else if (variationKey === 'flip-x') variationName = 'flip_horizontal';
      else if (variationKey === 'flip-y') variationName = 'flip_vertical';
      
      const filename = `${variationName}_wallpaper.${extension}`;
      zip.file(filename, base64Data, { base64: true });
    }
  });
  
  zip.generateAsync({ type: 'blob' })
    .then(content => {
      saveAs(content, `wallpapers_${format}.zip`);
    })
    .catch(err => {
      console.error('Failed to generate ZIP:', err);
      alert('Failed to create ZIP file. Please try downloading individually.');
    });
});

function saveAs(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ============================================
// Individual Download Functionality
// ============================================

// Add click handlers for individual download buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.variation-card').forEach(card => {
    const downloadBtn = card.querySelector('.download-single-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const variationKey = card.getAttribute('data-variation');
        downloadSingleVariation(variationKey);
      });
    }
  });
});

function downloadSingleVariation(variationKey) {
  const previewImg = document.getElementById(`${variationKey}-preview`);
  if (!previewImg || !previewImg.src) {
    alert('Please upload an image first');
    return;
  }
  
  const format = imageFormatInput.value;
  const { extension } = getFormatSettings(format);
  
  let variationName;
  if (variationKey === 'rotate-90') variationName = 'rotate_-90';
  else if (variationKey === 'rotate-270') variationName = 'rotate_90';
  else if (variationKey === 'rotate-180') variationName = 'rotate_180';
  else if (variationKey === 'flip-x') variationName = 'flip_horizontal';
  else if (variationKey === 'flip-y') variationName = 'flip_vertical';
  
  const filename = `${variationName}_wallpaper.${extension}`;
  
  // Convert data URL to blob
  fetch(previewImg.src)
    .then(res => res.blob())
    .then(blob => {
      saveAs(blob, filename);
    })
    .catch(err => {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    });
}
