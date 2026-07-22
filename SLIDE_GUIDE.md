# 🟩 Reveal.js Modular Presentation & Workflow Guide

This presentation repository is configured following **Reveal.js Best Practices** for modularity, scalability, and design consistency. As your slide deck grows long, you can easily add, remove, or re-order slides without touching monolithic files.

---

## 📁 Repository Architecture

```
network01_slide/
├── index.html                   # Main compiled Reveal.js slide deck
├── media/                       # 🖼️ MEDIA ASSETS (Images, GIFs, SVGs, Videos)
│   └── http_overview.svg
├── slides/                      # 🧩 MODULAR SLIDES (Add your new slides here!)
│   ├── 01_title.html
│   ├── 02_what_is_http.html
│   ├── 03_four_blocks.html
│   ├── ...
│   └── 11_summary.html
├── templates/                   # 📋 COPY-PASTE SLIDE TEMPLATES
│   ├── 01_standard_card_slide.html
│   ├── 02_terminal_code_slide.html
│   ├── 03_image_diagram_slide.html
│   ├── 04_warning_threat_slide.html
│   └── 05_vertical_nested_slides.html
├── scripts/
│   └── build.js                 # ⚡ Compiles slides/*.html into index.html
├── css/
│   └── cyber-theme.css          # HTB theme tokens, components & print styles
├── js/
│   ├── cyber-bg.js              # HTB matrix background canvas
│   └── http-simulator.js        # Interactive packet loss simulator
├── package.json                 # npm scripts (start, build)
└── README.md
```

---

## 🖼️ Media Folder & Image Usage

Place all images, GIFs, SVGs, and diagram assets inside the `media/` directory.

In your slide HTML files (or templates), reference media using relative paths:
```html
<img src="media/your_image.png" alt="Description">
<img src="media/http_overview.svg" alt="HTTP Overview Diagram">
```

---

## ⚡ How to Add New Slides (Workflow)

### Step 1: Copy a Template
Choose a slide template from the `templates/` folder:
- `templates/01_standard_card_slide.html` (General 2-column cards)
- `templates/02_terminal_code_slide.html` (Code snippets & HTTP headers)
- `templates/03_image_diagram_slide.html` (SVG/Image diagrams & text)
- `templates/04_warning_threat_slide.html` (Security warnings & solutions)
- `templates/05_vertical_nested_slides.html` (Deep-dive vertical slides)

### Step 2: Save in `slides/` Folder
Create a new `.html` file inside the `slides/` directory with a prefix number to set its order:
```
slides/12_my_new_topic.html
```

### Step 3: Run the Build Command
Compile your new slide into `index.html`:
```bash
npm run build
```
*(Or run `npm start` which automatically builds and starts the local web server at `http://localhost:3000`)*

---

## 🎨 Design System & Consistency Rules

To ensure every new slide stays 100% consistent with the **Hack The Box (HTB)** theme, use these CSS utility classes:

### 1. Card Grids
Use `.grid-2` for 2 columns or `.grid-3` for 3 columns:
```html
<div class="grid-2">
  <div class="cyber-card">...</div>
  <div class="cyber-card">...</div>
</div>
```

### 2. Badges
- Standard HTB Green: `<span class="cyber-badge badge-htb">TITLE</span>`
- Cyan Accent: `<span class="cyber-badge badge-cyan">TITLE</span>`
- Threat Red: `<span class="cyber-badge badge-red">TITLE</span>`
- Purple Accent: `<span class="cyber-badge badge-purple">TITLE</span>`

### 3. List Bullet Prompt Icons
- Standard HTB Prompt `[+]`: Default `<ul><li>item</li></ul>`
- Secure Checkmark `[✓]`: `<ul class="secure-list"><li>item</li></ul>`
- Threat Warning `[!]`: `<ul class="threat-list"><li>item</li></ul>`

### 4. Code / Terminal Blocks
Wrap code snippets in a terminal window header for HTB console aesthetic:
```html
<div class="terminal-header">
  <span class="terminal-dot dot-red"></span>
  <span class="terminal-dot dot-yellow"></span>
  <span class="terminal-dot dot-green"></span>
  <span class="terminal-title">root@htb:~# curl -i target.htb</span>
</div>
<pre><code class="language-http">GET /index.html HTTP/1.1
Host: target.htb</code></pre>
```

---

## ⌨️ Reveal.js Navigation & Shortcuts
- **Next / Prev Slide**: `Space`, `Right Arrow` `→`, `Left Arrow` `←`
- **Slide Counter**: Displays current / total slides in bottom right corner (e.g. `5/11`)
- **Slide Overview Grid**: Press `ESC` or `O`
- **Fullscreen Mode**: Press `F`
- **Speaker Notes**: Press `S`
