// js for wallpaper mutiple size generator


document.getElementById('image-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                generateWallpapers(img);
            }
            img.src = e.target.result;
            // set preview image src and manage load/error UI
            const previewImg = document.getElementById('image-preview');
            attachPreviewListeners(previewImg, document.querySelector('.upload-preview'));
            previewImg.src = img.src;
        }
        reader.readAsDataURL(file);
    }
});

// hide preview grid and download-all button on init
const previewGrid = document.getElementById('preview-grid');
const downloadAllBtn = document.getElementById('download-button');
if (previewGrid) previewGrid.classList.add('hidden');
if (downloadAllBtn) downloadAllBtn.classList.add('hidden');

function generateWallpapers(img) {
    // 验证传入的图片对象
    if (!img || !img.complete) {
        console.error('Invalid image provided to generateWallpapers');
        return;
    }

    // 获取用户选择的图像格式
    const imageFormat = document.getElementById('image-format').value;
    let mimeType;
    let quality;
    if (imageFormat === 'jpeg') {
        mimeType = 'image/jpeg';
        quality = 0.92;
    } else if (imageFormat === 'webp') {
        mimeType = 'image/webp';
        quality = 0.92;
    } else {
        mimeType = 'image/png';
        quality = undefined;
    }

    const sizes = {
        'iPhone': [1980, 4302],
        'iPad': [2064, 1548],
        'MacBook': [4512, 2538],
        'Apple Watch': [1664, 1984]
        // add more sizes here
        };
    
    for (const device in sizes) {
        const [width, height] = sizes[device];
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Compute source rect to center-crop image to target aspect ratio
        const iw = img.width, ih = img.height;
        const targetAspect = width / height;
        let sx = 0, sy = 0, sWidth = iw, sHeight = ih;

        if (iw / ih > targetAspect) {
            // source is wider -> crop width
            sWidth = Math.round(ih * targetAspect);
            sx = Math.round((iw - sWidth) / 2);
        } else {
            // source is taller -> crop height
            sHeight = Math.round(iw / targetAspect);
            sy = Math.round((ih - sHeight) / 2);
        }

        // draw the cropped area scaled to target canvas size
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);
        
        // 根据选择的格式生成数据URL
        const dataURL = canvas.toDataURL(mimeType, quality);
        
        // 获取目标预览元素
        const previewElement = document.getElementById(`${device.toLowerCase().replace(' ', '')}-preview`);
        
        // 验证元素是否存在
        if (previewElement) {
            // attach listeners before assigning src so we capture load/error
            const parentItem = previewElement.closest('.preview-item');
            attachPreviewListeners(previewElement, parentItem);
            previewElement.src = dataURL;
        } else {
            console.warn(`Preview element not found for ${device}`);
        }
        
        // 清理canvas以释放内存
        canvas.width = 0;
        canvas.height = 0;
    }
    // reveal preview area and download-all button after generation
    if (previewGrid) previewGrid.classList.remove('hidden');
    if (downloadAllBtn) downloadAllBtn.classList.remove('hidden');
}

// 添加单个设备壁纸下载功能
document.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', function() {
        const device = this.getAttribute('data-device');
        downloadSingleWallpaper(device);
    });
});

function downloadSingleWallpaper(device) {
    const imageFormat = document.getElementById('image-format').value;
    let extension, mimeType, quality;
    if (imageFormat === 'jpeg') {
        extension = 'jpg';
        mimeType = 'image/jpeg';
        quality = 0.92;
    } else if (imageFormat === 'webp') {
        extension = 'webp';
        mimeType = 'image/webp';
        quality = 0.92;
    } else {
        extension = 'png';
        mimeType = 'image/png';
        quality = undefined;
    }

    // sizes keyed by lowercase device id used in data-device
    const sizes = {
        'iphone': [1440, 3118],
        'ipad': [2880, 2160],
        'macbook': [3840, 2160],
        'applewatch': [2160, 2160]
    };

    const key = device.toLowerCase();
    const dims = sizes[key];
    if (!dims) {
        console.error(`Unknown device for download: ${device}`);
        return;
    }
    const [width, height] = dims;

    // use the uploaded preview image as source (dataURL kept in #image-preview)
    const source = document.getElementById('image-preview').src;
    if (!source) {
        console.error('No uploaded image available for export');
        return;
    }

    const srcImg = new Image();
    srcImg.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // center-crop source to target aspect then draw scaled
        const iw = srcImg.width, ih = srcImg.height;
        const targetAspect = width / height;
        let sx = 0, sy = 0, sWidth = iw, sHeight = ih;
        if (iw / ih > targetAspect) {
            sWidth = Math.round(ih * targetAspect);
            sx = Math.round((iw - sWidth) / 2);
        } else {
            sHeight = Math.round(iw / targetAspect);
            sy = Math.round((ih - sHeight) / 2);
        }
        ctx.drawImage(srcImg, sx, sy, sWidth, sHeight, 0, 0, width, height);

        const dataURL = canvas.toDataURL(mimeType, quality);
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${device}_wallpaper.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    srcImg.onerror = function() {
        console.error('Failed to load source image for export');
    };
    srcImg.src = source;
}

// Attach load/error listeners to a preview image and toggle placeholder classes
function attachPreviewListeners(imgElement, container) {
    if (!imgElement) return;

    // remove any existing handlers to avoid double-binding
    imgElement.onload = null;
    imgElement.onerror = null;

    imgElement.onload = function() {
        imgElement.classList.add('loaded');
        if (container) container.classList.add('img-loaded');
    };

    imgElement.onerror = function() {
        imgElement.classList.remove('loaded');
        try { imgElement.src = ''; } catch (e) {}
        if (container) container.classList.remove('img-loaded');
    };
}

// 监听格式选择变化，重新生成壁纸
document.getElementById('image-format').addEventListener('change', function() {
    const previewImg = document.getElementById('image-preview');
    if(previewImg.src) {
        const img = new Image();
        img.onload = function() {
            generateWallpapers(img);
        };
        img.src = previewImg.src;
    }
});

// format toggle buttons: sync hidden input and trigger change
document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.disabled) return;
        const fmt = this.getAttribute('data-format');
        const hidden = document.getElementById('image-format');
        if (!hidden) return;
        // toggle active class
        document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // set hidden value and dispatch change so existing listener runs
        hidden.value = fmt;
        hidden.dispatchEvent(new Event('change', { bubbles: true }));
    });
});

// Detect WebP support; if unsupported, disable the WEBP toggle
(function checkWebPSupport(){
    let supported = false;
    try {
        const cvs = document.createElement('canvas');
        supported = cvs.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch(e) {
        supported = false;
    }
    const webpBtn = document.querySelector('.format-btn[data-format="webp"]');
    if (!supported && webpBtn) {
        webpBtn.classList.add('disabled');
        webpBtn.disabled = true;
        webpBtn.setAttribute('aria-disabled','true');
        // if it was active, fallback to PNG
        if (webpBtn.classList.contains('active')) {
            const pngBtn = document.querySelector('.format-btn[data-format="png"]');
            if (pngBtn) {
                webpBtn.classList.remove('active');
                pngBtn.classList.add('active');
                const hidden = document.getElementById('image-format');
                if (hidden) { hidden.value = 'png'; hidden.dispatchEvent(new Event('change', { bubbles: true })); }
            }
        }
    }
})();

document.getElementById('download-button').addEventListener('click', function() {
    const imageFormat = document.getElementById('image-format').value;
    let extension, mimeType, quality;
    if (imageFormat === 'jpeg') {
        extension = 'jpg';
        mimeType = 'image/jpeg';
        quality = 0.92;
    } else if (imageFormat === 'webp') {
        extension = 'webp';
        mimeType = 'image/webp';
        quality = 0.92;
    } else {
        extension = 'png';
        mimeType = 'image/png';
        quality = undefined;
    }
    
    const zip = new JSZip();
    const sizes = {
        'iPhone': [1440, 3118],
        'iPad': [2880, 2160],
        'MacBook': [3840, 2160],
        'Apple Watch': [2160, 2160]
        // add more sizes here
    };
    
    for (const device in sizes) {
        const imgSrc = document.getElementById(`${device.toLowerCase().replace(' ', '')}-preview`).src;
        // 提取base64数据部分，注意根据所选格式调整正则表达式
        const typePattern = imageFormat === 'jpeg' ? 'jpeg|jpg' : imageFormat === 'webp' ? 'webp' : 'png';
        const regex = new RegExp(`^data:image\/(${typePattern});base64,`);
        const base64Data = imgSrc.replace(regex, "");
        zip.file(`${device}_wallpaper.${extension}`, base64Data, {base64: true});
    }
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, `wallpapers.${extension}.zip`);
    });
});

function saveAs(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}