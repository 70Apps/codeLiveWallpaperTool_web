// Image Format Converter - GPWZW Design System
// 图片格式转换器 - 智能设备尺寸匹配

// DOM Elements
const uploadArea = document.getElementById('upload-preview-area');
const imageUploadInput = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const previewSection = document.getElementById('preview-section');
const exportSection = document.getElementById('export-section');
const imageFormatInput = document.getElementById('image-format');

// Device configurations with aspect ratios
const DEVICE_CONFIGS = {
  'iphone': { width: 1980, height: 4302, name: 'iPhone' },
  'ipad': { width: 2064, height: 1548, name: 'iPad' },
  'macbook': { width: 4512, height: 2538, name: 'MacBook' },
  'applewatch': { width: 1664, height: 1984, name: 'Apple Watch' },
  'flipphone': { width: 750, height: 1000, name: 'Flip Phone' },
  'oldphone': { width: 1080, height: 1920, name: 'Old Phone' }
};

// Initialize: Hide preview and export sections
previewSection.classList.add('hidden');
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
      // Show preview
      imagePreview.src = img.src;
      imagePreview.onload = () => {
        imagePreview.classList.add('loaded');
        uploadArea.classList.add('img-loaded');
      };
      
      // Find best matching device and generate wallpaper
      generateBestMatchWallpaper(img);
      
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

function generateBestMatchWallpaper(sourceImg) {
  if (!sourceImg || !sourceImg.complete) {
    console.error('Invalid image provided');
    return;
  }

  const format = imageFormatInput.value;
  const { mimeType, quality } = getFormatSettings(format);

  // Calculate source image aspect ratio
  const srcWidth = sourceImg.width;
  const srcHeight = sourceImg.height;
  const srcAspect = srcWidth / srcHeight;

  // Find best matching device by aspect ratio
  let bestDevice = null;
  let smallestDiff = Infinity;

  Object.keys(DEVICE_CONFIGS).forEach(deviceKey => {
    const config = DEVICE_CONFIGS[deviceKey];
    const deviceAspect = config.width / config.height;
    const diff = Math.abs(srcAspect - deviceAspect);
    
    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestDevice = deviceKey;
    }
  });

  // Hide all device cards first
  document.querySelectorAll('.device-card').forEach(card => {
    card.classList.add('hidden');
    card.classList.remove('best-match');
  });

  // Show and generate only the best match
  if (bestDevice) {
    const config = DEVICE_CONFIGS[bestDevice];
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext('2d');

    // Center-crop image to target aspect ratio
    const { sx, sy, sWidth, sHeight } = calculateCropDimensions(
      srcWidth,
      srcHeight,
      config.width,
      config.height
    );

    // Draw cropped and scaled image
    ctx.drawImage(sourceImg, sx, sy, sWidth, sHeight, 0, 0, config.width, config.height);

    // Generate data URL
    const dataURL = canvas.toDataURL(mimeType, quality);

    // Update preview
    const deviceCard = document.querySelector(`.device-card[data-device="${bestDevice}"]`);
    const previewImg = document.getElementById(`${bestDevice}-preview`);
    
    if (deviceCard && previewImg) {
      deviceCard.classList.remove('hidden');
      deviceCard.classList.add('best-match');
      
      previewImg.src = dataURL;
      previewImg.onload = () => {
        previewImg.classList.add('loaded');
      };
    }

    // Cleanup
    canvas.width = 0;
    canvas.height = 0;
  }
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
    
    // Regenerate wallpaper if image is loaded
    if (imagePreview.src && imagePreview.classList.contains('loaded')) {
      const img = new Image();
      img.onload = () => generateBestMatchWallpaper(img);
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

const downloadButton = document.getElementById('download-button');

downloadButton.addEventListener('click', function() {
  // Find the visible (best match) device
  const visibleCard = document.querySelector('.device-card.best-match:not(.hidden)');
  if (visibleCard) {
    const device = visibleCard.getAttribute('data-device');
    downloadWallpaper(device);
  } else {
    alert('Please upload an image first');
  }
});

function downloadWallpaper(deviceKey) {
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
