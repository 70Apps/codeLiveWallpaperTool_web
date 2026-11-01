/* iPhone Duo Wallpaper Collage — grid collage + 4 exports (single download & ZIP) */
(function () {
  "use strict";

  // Standard output sizes for each screen (point 1: max-crop user image into these).
  var SIZE = {
    outer:           { w: 1398, h: 2034 },
    innerPortrait:  { w: 1878, h: 2670 },
    innerLandscape: { w: 2670, h: 1878 }
  };

  // Collage grid (point 2): top-left outer, top-right innerPortrait, bottom innerLandscape (full width).
  // Each region is enlarged so it is >= the standard size, guaranteeing a clean crop-out.
  var COLLAGE_W = SIZE.outer.w + SIZE.innerPortrait.w;          // 1398 + 1878 = 3276
  var TOP_H    = Math.max(SIZE.outer.h, SIZE.innerPortrait.h);  // max(2034,2670) = 2670
  var COLLAGE_H = TOP_H + SIZE.innerLandscape.h;                // 2670 + 1878 = 4548

  var REGIONS = {
    outer:           { x: 0,                y: 0,     w: SIZE.outer.w,          h: TOP_H },
    innerPortrait:  { x: SIZE.outer.w,      y: 0,     w: SIZE.innerPortrait.w, h: TOP_H },
    innerLandscape: { x: 0,                y: TOP_H, w: COLLAGE_W,             h: SIZE.innerLandscape.h }
  };

  var SLOTS = ["outer", "innerPortrait", "innerLandscape"];

  // Output descriptors (point 3): the three cropped screens + the collage = 4 images.
  var OUTPUTS = [
    { key: "outer",          label: "外屏",   file: "iphone-duo-outer",           w: SIZE.outer.w,           h: SIZE.outer.h },
    { key: "innerPortrait",  label: "内屏竖", file: "iphone-duo-inner-portrait",  w: SIZE.innerPortrait.w,   h: SIZE.innerPortrait.h },
    { key: "innerLandscape", label: "内屏横", file: "iphone-duo-inner-landscape", w: SIZE.innerLandscape.w,  h: SIZE.innerLandscape.h },
    { key: "collage",        label: "拼贴图", file: "iphone-duo-collage",         w: COLLAGE_W,              h: COLLAGE_H }
  ];

  // Runtime state
  var images = {};   // slot -> HTMLImageElement
  var dataUrls = {}; // slot -> data URL string
  var canvases = {}; // key -> full-resolution canvas

  // DOM refs
  var progressEl = document.getElementById("duo-progress");
  var composeBtn = document.getElementById("btn-compose");
  var composeWrap = document.getElementById("compose-wrap");
  var composePreview = document.getElementById("compose-preview");
  var composeSize = document.getElementById("compose-size");
  var exportFormat = document.getElementById("export-format");
  var zipBtn = document.getElementById("btn-zip");
  var exportGrid = document.getElementById("export-grid");

  function init() {
    SLOTS.forEach(function (slot) {
      var area = document.querySelector('.upload-area[data-input="' + slot + '"]');
      var input = document.querySelector('.duo-file[data-input="' + slot + '"]');
      var clearBtn = document.querySelector('.duo-clear[data-clear="' + slot + '"]');

      input.addEventListener("change", function (e) {
        if (e.target.files && e.target.files[0]) handleFile(slot, e.target.files[0]);
      });
      area.addEventListener("click", function (e) {
        if (e.target === clearBtn) return;
        input.click();
      });
      ["dragenter", "dragover"].forEach(function (evt) {
        area.addEventListener(evt, function (e) {
          e.preventDefault(); e.stopPropagation();
          area.classList.add("drag-over");
        });
      });
      ["dragleave", "drop"].forEach(function (evt) {
        area.addEventListener(evt, function (e) {
          e.preventDefault(); e.stopPropagation();
          area.classList.remove("drag-over");
        });
      });
      area.addEventListener("drop", function (e) {
        var dt = e.dataTransfer;
        if (dt && dt.files && dt.files[0]) {
          input.files = dt.files;
          handleFile(slot, dt.files[0]);
        }
      });
      clearBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        clearSlot(slot);
      });
    });

    composeBtn.addEventListener("click", compose);
    zipBtn.addEventListener("click", downloadZip);

    document.querySelectorAll(".format-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".format-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        exportFormat.value = btn.getAttribute("data-format");
      });
    });

    updateProgress();
  }

  function handleFile(slot, file) {
    if (!file.type || file.type.indexOf("image/") !== 0) {
      alert("请选择图片文件（PNG / JPG / WebP）。");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (ev) {
      var url = ev.target.result;
      var img = new Image();
      img.onload = function () {
        images[slot] = img;
        dataUrls[slot] = url;
        var area = document.querySelector('.upload-area[data-input="' + slot + '"]');
        var preview = document.querySelector('.upload-preview-img[data-preview="' + slot + '"]');
        area.classList.add("img-loaded");
        preview.src = url;
        var clearBtn = document.querySelector('.duo-clear[data-clear="' + slot + '"]');
        if (clearBtn) clearBtn.hidden = false;
        updateProgress();
        updateComposeEnabled();
        updateScreenPreview();
      };
      img.onerror = function () { alert("图片加载失败，请换一张试试。"); };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }

  function clearSlot(slot) {
    delete images[slot];
    delete dataUrls[slot];
    var area = document.querySelector('.upload-area[data-input="' + slot + '"]');
    var preview = document.querySelector('.upload-preview-img[data-preview="' + slot + '"]');
    var input = document.querySelector('.duo-file[data-input="' + slot + '"]');
    var clearBtn = document.querySelector('.duo-clear[data-clear="' + slot + '"]');
    area.classList.remove("img-loaded");
    preview.src = "";
    input.value = "";
    if (clearBtn) clearBtn.hidden = true;
    var screenEl = document.querySelector('.phone-screen[data-screen="' + slot + '"]');
    if (screenEl) {
      screenEl.style.backgroundImage = "";
      screenEl.classList.remove("loaded");
    }
    updateProgress();
    updateComposeEnabled();
  }

  function updateProgress() {
    var n = SLOTS.filter(function (s) { return !!images[s]; }).length;
    progressEl.textContent = "已上传 " + n + " / 3 张" + (n === 3 ? " · 可以合成" : "");
  }

  function updateComposeEnabled() {
    var ready = SLOTS.every(function (s) { return !!images[s]; });
    composeBtn.disabled = !ready;
  }

  function updateScreenPreview() {
    SLOTS.forEach(function (slot) {
      var el = document.querySelector('.phone-screen[data-screen="' + slot + '"]');
      if (!el) return;
      if (dataUrls[slot]) {
        el.style.backgroundImage = 'url("' + dataUrls[slot] + '")';
        el.classList.add("loaded");
      } else {
        el.style.backgroundImage = "";
        el.classList.remove("loaded");
      }
    });
  }

  // Draw image into box (x,y,w,h) using cover-fit: fill the box, crop overflow, center.
  function drawCover(ctx, img, x, y, w, h) {
    var ir = img.width / img.height;
    var br = w / h;
    var dw, dh;
    if (ir > br) { dh = h; dw = h * ir; }
    else { dw = w; dh = w / ir; }
    var dx = x + (w - dw) / 2;
    var dy = y + (h - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function compose() {
    if (!SLOTS.every(function (s) { return !!images[s]; })) return;

    // Three standard-size screens (max-crop to standard size).
    SLOTS.forEach(function (slot) {
      var cv = document.createElement("canvas");
      cv.width = SIZE[slot].w;
      cv.height = SIZE[slot].h;
      drawCover(cv.getContext("2d"), images[slot], 0, 0, cv.width, cv.height);
      canvases[slot] = cv;
    });

    // Collage (enlarged grid, each region >= standard size).
    var collage = document.createElement("canvas");
    collage.width = COLLAGE_W;
    collage.height = COLLAGE_H;
    var cx = collage.getContext("2d");
    cx.fillStyle = "#000000";
    cx.fillRect(0, 0, COLLAGE_W, COLLAGE_H);
    SLOTS.forEach(function (slot) {
      var r = REGIONS[slot];
      drawCover(cx, images[slot], r.x, r.y, r.w, r.h);
    });
    canvases.collage = collage;

    var previewUrl;
    try { previewUrl = collage.toDataURL("image/webp", 0.9); }
    catch (e) { previewUrl = collage.toDataURL("image/png"); }
    composePreview.src = previewUrl;
    composeSize.textContent = COLLAGE_W + " × " + COLLAGE_H;

    buildExportGrid();
    composeWrap.classList.remove("hidden");
  }

  function buildExportGrid() {
    exportGrid.innerHTML = "";
    OUTPUTS.forEach(function (o) {
      var cv = canvases[o.key];
      var card = document.createElement("div");
      card.className = "duo-export-card";

      var thumb = document.createElement("img");
      thumb.className = "duo-export-thumb";
      thumb.alt = o.label;
      thumb.src = makeThumb(cv, 320);

      var info = document.createElement("div");
      info.className = "duo-export-info";
      var name = document.createElement("span");
      name.className = "duo-export-name";
      name.textContent = o.label;
      var dim = document.createElement("span");
      dim.className = "duo-export-dim";
      dim.textContent = o.w + "×" + o.h;
      info.appendChild(name);
      info.appendChild(dim);

      var btn = document.createElement("button");
      btn.className = "duo-export-dl";
      btn.type = "button";
      btn.textContent = "下载";
      btn.addEventListener("click", function () { downloadOne(o); });

      card.appendChild(thumb);
      card.appendChild(info);
      card.appendChild(btn);
      exportGrid.appendChild(card);
    });
  }

  function makeThumb(cv, maxW) {
    var scale = Math.min(1, maxW / cv.width);
    var t = document.createElement("canvas");
    t.width = Math.max(1, Math.round(cv.width * scale));
    t.height = Math.max(1, Math.round(cv.height * scale));
    t.getContext("2d").drawImage(cv, 0, 0, t.width, t.height);
    return t.toDataURL("image/webp", 0.85);
  }

  function mimeFor(fmt) {
    if (fmt === "webp") return "image/webp";
    if (fmt === "jpeg") return "image/jpeg";
    return "image/png";
  }
  function extFor(fmt) {
    if (fmt === "webp") return "webp";
    if (fmt === "jpeg") return "jpg";
    return "png";
  }

  function canvasToBlob(cv, mime, quality) {
    return new Promise(function (resolve, reject) {
      if (cv.toBlob) {
        cv.toBlob(function (b) {
          if (b) { resolve(b); return; }
          resolve(dataUrlToBlob(cv.toDataURL(mime, quality), mime)); // codec unsupported -> fallback
        }, mime, quality);
      } else {
        resolve(dataUrlToBlob(cv.toDataURL(mime, quality), mime));
      }
    });
  }

  function dataUrlToBlob(url, mime) {
    var parts = url.split(",");
    var bin = atob(parts[1]);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  function blobToUint8(blob) {
    if (blob.arrayBuffer) {
      return blob.arrayBuffer().then(function (b) { return new Uint8Array(b); });
    }
    return new Promise(function (resolve) {
      var fr = new FileReader();
      fr.onload = function () { resolve(new Uint8Array(fr.result)); };
      fr.readAsArrayBuffer(blob);
    });
  }

  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  // Single-image export (point 3).
  function downloadOne(o) {
    var cv = canvases[o.key];
    if (!cv) return;
    var fmt = exportFormat.value;
    var quality = (fmt === "png") ? undefined : 0.95;
    canvasToBlob(cv, mimeFor(fmt), quality).then(function (blob) {
      triggerDownload(blob, o.file + "." + extFor(fmt));
    });
  }

  // ZIP of all four (point 3): three cropped screens + collage.
  function downloadZip() {
    var fmt = exportFormat.value;
    var mime = mimeFor(fmt);
    var quality = (fmt === "png") ? undefined : 0.95;
    var ext = extFor(fmt);

    Promise.all(OUTPUTS.map(function (o) {
      return canvasToBlob(canvases[o.key], mime, quality)
        .then(blobToUint8)
        .then(function (bytes) { return { name: o.file + "." + ext, data: bytes }; });
    })).then(function (files) {
      var zipBlob = buildZip(files);
      triggerDownload(zipBlob, "iphone-duo-wallpapers.zip");
    });
  }

  /* ---------- Pure-JS ZIP writer (store / no compression) ---------- */
  var crcTable = (function () {
    var t = [];
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(buf) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function buildZip(files) {
    var chunks = [];
    var central = [];
    var offset = 0;
    var enc = new TextEncoder();

    files.forEach(function (f) {
      var nameBytes = enc.encode(f.name);
      var crc = crc32(f.data);
      var size = f.data.length;

      var lh = new Uint8Array(30 + nameBytes.length);
      var dv = new DataView(lh.buffer);
      dv.setUint32(0, 0x04034b50, true);
      dv.setUint16(4, 20, true);
      dv.setUint16(6, 0x0800, true); // UTF-8 filename flag
      dv.setUint16(8, 0, true);      // method = store
      dv.setUint16(10, 0, true);     // mod time
      dv.setUint16(12, 0, true);     // mod date
      dv.setUint32(14, crc, true);
      dv.setUint32(18, size, true);
      dv.setUint32(22, size, true);
      dv.setUint16(26, nameBytes.length, true);
      dv.setUint16(28, 0, true);     // extra
      lh.set(nameBytes, 30);

      chunks.push(lh);
      chunks.push(f.data);

      var ch = new Uint8Array(46 + nameBytes.length);
      var cv = new DataView(ch.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);     // version made by
      cv.setUint16(6, 20, true);     // version needed
      cv.setUint16(8, 0x0800, true); // UTF-8 flag
      cv.setUint16(10, 0, true);     // method
      cv.setUint16(12, 0, true);     // time
      cv.setUint16(14, 0, true);     // date
      cv.setUint32(16, crc, true);
      cv.setUint32(20, size, true);
      cv.setUint32(24, size, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);     // extra
      cv.setUint16(32, 0, true);     // comment
      cv.setUint16(34, 0, true);     // disk start
      cv.setUint16(36, 0, true);     // internal attrs
      cv.setUint32(38, 0, true);     // external attrs
      cv.setUint32(42, offset, true);
      ch.set(nameBytes, 46);
      central.push(ch);

      offset += lh.length + f.data.length;
    });

    var cdSize = central.reduce(function (a, c) { return a + c.length; }, 0);
    var cdOffset = offset;

    var eo = new Uint8Array(22);
    var ev = new DataView(eo.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, cdOffset, true);
    ev.setUint16(20, 0, true);

    return new Blob(chunks.concat(central, [eo]), { type: "application/zip" });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
