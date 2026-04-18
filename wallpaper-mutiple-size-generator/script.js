// Multiple Size Generator - GPWZW Design System
// 壁纸多尺寸生成器

// DOM Elements
const uploadArea = document.getElementById('upload-preview-area');
const imageUploadInput = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const previewSection = document.getElementById('preview-section');
const exportSection = document.getElementById('export-section');
const downloadAllBtn = document.getElementById('download-button');
const imageFormatInput = document.getElementById('image-format');

// Device configurations
const DEVICE_CONFIGS = {
  'iphone': { width: 1440, height: 3118, name: 'iPhone' },
  'ipad': { width: 2880, height: 2160, name: 'iPad' },
  'macbook': { width: 3840, height: 2160, name: 'MacBook' },
  'applewatch': { width: 2160, height: 2160, name: 'Apple Watch' }
};

// Initialize: Hide preview and export sections
previewSection.classList.add('hidden');
exportSection.classList.add('hidden');

// ============================================
// Drag & Drop Functionality
// ============================================

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false);
  uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight drop area
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

// Handle dropped files
uploadArea.addEventListener('drop', handleDrop, false);

// Make upload area clickable
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

// Handle file input change
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
      // Show preview
      imagePreview.src = img.src;
      imagePreview.onload = () => {
        imagePreview.classList.add('loaded');
        uploadArea.classList.add('img-loaded');
      };
      
      // Generate wallpapers
      generateWallpapers(img);
      
      // Show preview and export sections
      previewSection.classList.remove('hidden');
      exportSection.classList.remove('hidden');
      
      // Smooth scroll to preview
      setTimeout(() => {
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function generateWallpapers(sourceImg) {
  if (!sourceImg || !sourceImg.complete) {
    console.error('Invalid image provided');
    return;
  }

  const format = imageFormatInput.value;
  const { mimeType, quality } = getFormatSettings(format);

  Object.keys(DEVICE_CONFIGS).forEach(deviceKey => {
    const config = DEVICE_CONFIGS[deviceKey];
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext('2d');

    // Center-crop image to target aspect ratio
    const { sx, sy, sWidth, sHeight } = calculateCropDimensions(
      sourceImg.width,
      sourceImg.height,
      config.width,
      config.height
    );

    // Draw cropped and scaled image
    ctx.drawImage(sourceImg, sx, sy, sWidth, sHeight, 0, 0, config.width, config.height);

    // Generate data URL
    const dataURL = canvas.toDataURL(mimeType, quality);

    // Update preview
    const previewImg = document.getElementById(`${deviceKey}-preview`);
    if (previewImg) {
      previewImg.src = dataURL;
      previewImg.onload = () => {
        previewImg.classList.add('loaded');
      };
    }

    // Cleanup
    canvas.width = 0;
    canvas.height = 0;
  });
}

function calculateCropDimensions(srcWidth, srcHeight, targetWidth, targetHeight) {
  const targetAspect = targetWidth / targetHeight;
  let sx = 0, sy = 0, sWidth = srcWidth, sHeight = srcHeight;

  if (srcWidth / srcHeight > targetAspect) {
    // Source is wider - crop width
    sWidth = Math.round(srcHeight * targetAspect);
    sx = Math.round((srcWidth - sWidth) / 2);
  } else {
    // Source is taller - crop height
    sHeight = Math.round(srcWidth / targetAspect);
    sy = Math.round((srcHeight - sHeight) / 2);
  }

  return { sx, sy, sWidth, sHeight };
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
    
    // Regenerate wallpapers if image is loaded
    if (imagePreview.src && imagePreview.classList.contains('loaded')) {
      const img = new Image();
      img.onload = () => generateWallpapers(img);
      img.src = imagePreview.src;
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

// Individual device download
document.querySelectorAll('.btn-device-download').forEach(btn => {
  btn.addEventListener('click', function() {
    const device = this.getAttribute('data-device');
    downloadSingleWallpaper(device);
  });
});

function downloadSingleWallpaper(deviceKey) {
  const config = DEVICE_CONFIGS[deviceKey];
  if (!config) {
    console.error(`Unknown device: ${deviceKey}`);
    return;
  }

  const format = imageFormatInput.value;
  const { mimeType, quality, extension } = getFormatSettings(format);

  // Get source image
  const sourceSrc = imagePreview.src;
  if (!sourceSrc) {
    console.error('No image uploaded');
    return;
  }

  const srcImg = new Image();
  srcImg.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext('2d');

    // Center-crop and draw
    const { sx, sy, sWidth, sHeight } = calculateCropDimensions(
      srcImg.width,
      srcImg.height,
      config.width,
      config.height
    );
    ctx.drawImage(srcImg, sx, sy, sWidth, sHeight, 0, 0, config.width, config.height);

    // Download
    const dataURL = canvas.toDataURL(mimeType, quality);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${config.name.replace(' ', '_')}_wallpaper.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    canvas.width = 0;
    canvas.height = 0;
  };
  srcImg.onerror = () => {
    console.error('Failed to load source image');
  };
  srcImg.src = sourceSrc;
}

// Download all as ZIP
downloadAllBtn.addEventListener('click', () => {
  const format = imageFormatInput.value;
  const { extension } = getFormatSettings(format);
  
  const zip = new JSZip();
  
  Object.keys(DEVICE_CONFIGS).forEach(deviceKey => {
    const config = DEVICE_CONFIGS[deviceKey];
    const previewImg = document.getElementById(`${deviceKey}-preview`);
    
    if (previewImg && previewImg.src) {
      // Extract base64 data
      const base64Data = previewImg.src.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      const filename = `${config.name.replace(' ', '_')}_wallpaper.${extension}`;
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
