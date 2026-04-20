# Webapp Design System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GPWZW Webapp Platform                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Tool 1     │    │   Tool 2     │    │   Tool 3     │
│  Multiple    │    │   Image      │    │   Bing       │
│   Size       │    │  Convertor   │    │   Today      │
│              │    │              │    │              │
│ style.scss   │    │ style.scss   │    │ style.scss   │
│ @import      │    │ @import      │    │ @import      │
│ 'webapp'     │    │ 'webapp'     │    │ 'webapp'     │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           │ All tools share
                           │
                           ▼
            ┌──────────────────────────────┐
            │   _sass/_webapp.scss         │
            │   (Unified Design System)    │
            │                              │
            │  • Design Tokens             │
            │  • Layout Components         │
            │  • UI Components             │
            │  • Utilities                 │
            │  • Responsive Breakpoints    │
            └──────────────────────────────┘
```

## Component Hierarchy

```
_webapp.scss
│
├── 🎨 Design Tokens (CSS Custom Properties)
│   ├── Colors (pure-white, surface-*, gallery-purple, etc.)
│   ├── Borders (border-whisper, border-subtle)
│   ├── Shadows (shadow-card, shadow-hover)
│   └── Typography (font-sans, font-mono)
│
├── 📐 Layout Components
│   ├── .tool-page          → Main container (max-width: 1440px)
│   ├── .tool-hero          → Header section with logo/title
│   ├── .tool-section       → Content sections with padding
│   ├── .section-divider    → Horizontal rule separator
│   └── .step-header        → Numbered step indicator
│       ├── .step-number    → Circular number badge
│       └── .step-info      → Title and description
│           ├── .step-title
│           └── .step-desc
│
├── 📤 Upload Components
│   └── .upload-area        → Drag & drop zone
│       ├── States: :hover, .drag-over, .img-loaded
│       ├── .upload-icon    → SVG icon
│       ├── .upload-text    → Primary text
│       ├── .upload-hint    → Secondary hint
│       └── .upload-preview-img → Image preview
│
├── 📱 Device Display Components
│   ├── .device-grid        → Grid container
│   │   ├── Default: 4 columns
│   │   ├── .grid-3-cols    → 3 columns modifier
│   │   ├── .grid-2-cols    → 2 columns modifier
│   │   └── .grid-1-col     → 1 column modifier
│   │
│   └── .device-card        → Individual device card
│       ├── States: :hover, .best-match
│       ├── .device-card-header
│       │   ├── .device-icon
│       │   ├── h3 (device name)
│       │   ├── .device-size
│       │   └── .best-match-badge
│       ├── .device-preview
│       │   ├── img.loaded
│       │   └── .preview-placeholder
│       └── .btn-device-download
│
├── 📦 Export Components
│   └── .export-panel       → Format selection + download
│       ├── Default: horizontal layout
│       ├── .vertical       → Vertical layout modifier
│       │
│       ├── .format-selector
│       │   ├── Default: left-aligned
│       │   ├── .centered   → Center alignment modifier
│       │   ├── .format-label
│       │   ├── .format-toggle
│       │   │   ├── Default: auto width
│       │   │   └── .full-width → Full width modifier
│       │   │       └── .format-btn
│       │   │           ├── States: :hover, .active, .disabled
│       │   │           └── .flex-equal → Equal width modifier
│       │   └── .format-hint
│       │
│       └── .btn-download-all / .btn-download-main
│           ├── Default: auto width
│           └── .full-width → Full width modifier
│
├── 🔄 Update Panel Components (Bing Today)
│   └── .update-panel       → Dynamic content panel
│       ├── States: .loading
│       ├── .update-left    → Preview area
│       │   └── .upload-preview
│       │       ├── aspect-ratio: 16/9
│       │       ├── img.loaded
│       │       └── .preview-placeholder-text
│       │
│       └── .update-right   → Controls area
│           ├── .toolbar    → Navigation buttons
│           ├── .region-bar → Region selector (3 buttons)
│           ├── .format-selector
│           └── .btn-primary
│
├── 🔧 Utility Classes
│   ├── .visually-hidden    → Accessible hiding
│   ├── .hidden             → display: none
│   ├── .section-label      → Uppercase label
│   ├── .btn-primary        → Primary action button
│   └── .btn-pill           → Small pill badge
│
└── 📱 Responsive Breakpoints
    ├── Desktop: >1024px    → Full layouts
    ├── Tablet: 641-1024px  → 2-column grids
    └── Mobile: ≤640px      → Single column, stacked
```

## File Dependencies

```
Project Root
│
├── _sass/
│   ├── _webapp.scss ← MAIN DESIGN SYSTEM FILE
│   ├── WEBAPP-DESIGN-SYSTEM.md    → Component documentation
│   ├── MIGRATION-EXAMPLES.md      → Migration guides
│   ├── QUICK-START.md             → Quick start guide
│   ├── README-WEBAPP-SYSTEM.md    → System overview
│   └── ARCHITECTURE.md            → This file
│
├── wallpaper-mutiple-size-generator/
│   ├── index.html
│   ├── script.js
│   └── style.scss → @import '../_sass/webapp'
│
├── wallpaper-image-type-convertor/
│   ├── index.html
│   ├── script.js
│   └── style.scss → @import '../_sass/webapp'
│
├── wallpaper-bing-today/
│   ├── index.html
│   ├── script.js
│   └── style.scss → @import '../_sass/webapp'
│
└── [future tools]/
    ├── index.html
    ├── script.js
    └── style.scss → @import '../_sass/webapp'
```

## Data Flow

```
User Interaction
      │
      ▼
┌─────────────┐
│   HTML UI   │ ← Uses design system classes
└──────┬──────┘
       │
       │ JavaScript Event Handlers
       │
       ▼
┌──────────────┐
│  script.js   │ ← Tool-specific logic
└──────┬───────┘
       │
       │ DOM Manipulation
       │ (add/remove classes)
       │
       ▼
┌──────────────┐
│ CSS Styles   │ ← From _webapp.scss
│ (transitions,│
│  animations) │
└──────┬───────┘
       │
       │ Visual Feedback
       │
       ▼
    User sees
   updated UI
```

## State Management Pattern

```javascript
// Standard pattern for all tools

// 1. Upload State
uploadArea.classList.add('img-loaded');    // Show preview
uploadArea.classList.remove('img-loaded'); // Hide preview

// 2. Drag State
uploadArea.classList.add('drag-over');     // Drag over
uploadArea.classList.remove('drag-over');  // Drag leave

// 3. Loading State
panel.classList.add('loading');            // Start loading
panel.classList.remove('loading');         // End loading

// 4. Active States
formatBtn.classList.add('active');         // Select option
formatBtn.classList.remove('active');      // Deselect

// 5. Visibility States
section.classList.add('hidden');           // Hide section
section.classList.remove('hidden');        // Show section
```

## Styling Specificity

```
Lowest Priority (easily overridden)
│
├── CSS Custom Properties (--gallery-purple)
│
├── Base Classes (.device-card)
│
├── Modifier Classes (.device-card.best-match)
│
├── State Classes (.upload-area.drag-over)
│
└── Highest Priority (avoid if possible)
    └── Inline styles (style="...")
```

**Best Practice**: Use design system classes first, only add custom CSS when necessary.

## Responsive Strategy

```
Mobile First Approach:

Base Styles (Mobile)
  ↓
@media (min-width: 641px) { Tablet adjustments }
  ↓
@media (min-width: 1025px) { Desktop enhancements }

However, _webapp.scss uses max-width queries for simplicity:

Default Styles (Desktop)
  ↓
@media (max-width: 1024px) { Tablet: 2 columns }
  ↓
@media (max-width: 640px) { Mobile: 1 column, stacked }
```

## Performance Considerations

### CSS Delivery
```
Before (per tool):
  Tool 1: 547 lines CSS
  Tool 2: 577 lines CSS
  Tool 3: 653 lines CSS
  Total: 1,777 lines (duplicated)

After (with design system):
  Shared: ~800 lines (_webapp.scss)
  Tool 1: ~5 lines
  Tool 2: ~20 lines
  Tool 3: ~15 lines
  Total: ~840 lines (cached once, reused)
  
Benefit: Better caching, smaller payloads
```

### Rendering Performance
- ✅ Uses CSS transforms (GPU accelerated)
- ✅ Minimal use of expensive properties
- ✅ Efficient selectors (no deep nesting)
- ✅ Hardware-accelerated animations

### Bundle Size
- SCSS source: ~16KB
- Compiled CSS: ~12KB (minified: ~8KB)
- Gzipped: ~2-3KB per tool (after caching)

---

## Version History

- **v1.0.0** (2026-04-20): Initial release
  - Consolidated styles from 3 tools
  - Created comprehensive documentation
  - Established migration path

---

**Last Updated**: 2026-04-20
**Maintained By**: GPWZW Development Team
