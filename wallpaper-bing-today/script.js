// js for bing.com today wallpaper generator
var INDEX_REGION = 0;
var INDEX_DATE = 0; // 0 for today, 1 for yesterday, etc.
var STRING_DATE = DateToString(new Date().getDate() - INDEX_DATE);
//en-US, ja-JP, en-AU, en-GB, de-DE, en-NZ, en-CA, en-IN, fr-FR, fr-CA, it-IT, es-ES, pt-BR, en-ROW
// update BING_REGIONS item to object with title and code
class BING_REGION {
    constructor(title, code) {
        this.title = title;
        this.code = code;
    }
}
const BING_REGIONS = [
new BING_REGION("United States", "en-US"),
new BING_REGION("Japan", "ja-JP"),
new BING_REGION("Australia", "en-AU"),
new BING_REGION("United Kingdom", "en-GB"),
new BING_REGION("Germany", "de-DE"),
new BING_REGION("New Zealand", "en-NZ"),
new BING_REGION("Canada", "en-CA"),
new BING_REGION("India", "en-IN"),
new BING_REGION("France", "fr-FR"),
new BING_REGION("France (Canada)", "fr-CA"),
new BING_REGION("Italy", "it-IT"),
new BING_REGION("Spain", "es-ES"),
new BING_REGION("Brazil", "pt-BR"),
new BING_REGION("Chinese", "zh-CN"),
new BING_REGION("Rest of World", "en-ROW")
];

function DateToString(date) {
    // check date is a Date object
    if (!(date instanceof Date)) return
    
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return year.toString() + month + day;
}
function updateDateSelected(offset) {
    INDEX_DATE += offset;
    if (INDEX_DATE < 0) INDEX_DATE = 0;
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - INDEX_DATE);
    STRING_DATE = DateToString(targetDate);
    const dateSelected = document.getElementById('date-selected');
    dateSelected.innerText = STRING_DATE;
}
document.getElementById('prev-button').addEventListener('click', function(event) {
    updateDateSelected(1);
});
document.getElementById('next-button').addEventListener('click', function(event) {
    updateDateSelected(-1);
});
function updateRegionsButtons() { 
    const regionsButtons = document.querySelectorAll('.region-bar');
    //loop BING_REGIONS to make buttons with event
    BING_REGIONS.forEach(function(region, index) { 
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn-primary region-btn';
        button.innerText = region.title;
        if (index === INDEX_REGION) {
            button.classList.add('active');
        }
        button.addEventListener('click', function() {
            INDEX_REGION = index;
            //update active class
            regionsButtons.forEach(function(bar) {
                const btns = bar.querySelectorAll('.region-btn');
                btns.forEach(function(btn, btnIndex) {
                    if (btnIndex === INDEX_REGION) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            });
        });
        regionsButtons[0].appendChild(button);  
    });
    
}

document.getElementById('update-button').addEventListener('click', function(event) {
    const api_url = "https://bing.biturl.top/?resolution=UHD&format=json&index="+INDEX_DATE+"&mkt="+BING_REGIONS[INDEX_REGION].code+"";
    /* Example response:
{
start_date: "20260118",
end_date: "20260119",
url: "https://www.bing.com/th?id=OHR.BubblesAbraham_ZH-CN7203734882_1920x1080.jpg",
copyright: "亚伯拉罕湖冰封景象，艾伯塔省，加拿大 (© Luis F Arevalo/Getty Images)",
copyright_link: "https://www.bing.com/search?q=%E4%BA%9A%E4%BC%AF%E6%8B%89%E7%BD%95%E6%B9%96&form=hpcapt&mkt=zh-cn"
}
    */
    fetch(api_url)
    .then(response => response.json())
    .then(data => {
        const imageUrl = data.url;
        const img = new Image();
        img.crossOrigin = "Anonymous"; // to avoid CORS issues
        img.onload = function() {
            generateWallpapers(img);
        }
        img.src = imageUrl;
        // set preview image src and manage load/error UI
        const previewImg = document.getElementById('image-preview');
        attachPreviewListeners(previewImg, document.querySelector('.upload-preview'));
        previewImg.src = img.src;
    })
    .catch(error => {
        console.error('Error fetching Bing wallpaper:', error);
    });
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
    /*
    change export sizes here if needed  
        'iPhone': [1980, 4302],
        'iPad': [2064, 1548],
        'MacBook': [4512, 2538],
        'Apple Watch': [1664, 1984]
         */ 
        const sizes = {
        'iphone': [1440, 3118],
        'ipad': [2880, 2160],
        'macbook': [4512, 2538],
        'applewatch': [1664, 1984]
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
updateRegionsButtons()
updateDateSelected(0)
