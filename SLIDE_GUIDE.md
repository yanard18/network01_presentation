# 🟩 Hack The Box (HTB) Modular Slide Deck & Design System Guide

This presentation repository is built with **Reveal.js** and customized with an official **Hack The Box (HTB) Cyber Dark Theme**. It provides a 100% modular architecture designed for scalability, zero code duplication, and strict design consistency.

---

## 📁 Repository Architecture

```
network01_slide/
├── index.html                   # 🚀 Main compiled Reveal.js slide deck
├── media/                       # 🖼️ Centralized Media Assets (Images, GIFs, SVGs)
├── slides/                      # 🧩 Modular HTML Slide Files (92+ slides)
│   ├── title.html
│   ├── agenda.html
│   ├── osi_layers.html
│   ├── ...
│   ├── slides.json              # 📋 Master Slide Sequence Manifest
│   └── summary.html
├── templates/                   # 📋 7 Copy-Paste Modular Slide Templates
│   ├── 01_standard_card_slide.html
│   ├── 02_terminal_code_slide.html
│   ├── 03_image_diagram_slide.html
│   ├── 04_warning_threat_slide.html
│   ├── 05_vertical_nested_slides.html
│   ├── 06_comparison_table_slide.html
│   └── 07_interactive_simulator_slide.html
├── css/
│   └── cyber-theme.css          # 🎨 HTB Visual Tokens, Component Engine & Utilities
├── js/                          # ⚙️ Interactive JS Simulator Modules
│   ├── cyber-bg.js              # HTB Matrix Background Grid
│   ├── http-simulator.js        # Packet Loss & QUIC Simulator
│   ├── osi-encapsulation.js     # OSI 7-Layer Encapsulation Interactive Engine
│   ├── network-devices-sim.js   # Hub, Bridge, Switch, Router & ARP Simulator
│   ├── dh-color-sim.js          # Diffie-Hellman Color Paint Simulator
│   ├── smb-lifecycle-sim.js     # SMB Connection Lifecycle Visualizer
│   ├── ssh-handshake-sim.js     # SSH Key Exchange Handshake Simulator
│   └── dns-hierarchy-sim.js     # DNS Linear & Star Topology Simulator
├── scripts/
│   └── build.js                 # ⚡ Compiles slides/*.html into index.html
├── package.json                 # npm build & start scripts
└── README.md
```

---

## 🎨 HTB Design System Tokens & Typography

All visual tokens are defined in [`css/cyber-theme.css`](file:///home/mek/Documents/network01_slide/css/cyber-theme.css):

### Color Tokens
- **HTB Primary Green**: `--htb-green: #9FEF00;` (`.highlight-htb`, `.badge-htb`)
- **Cyan Accent**: `--accent-cyan: #2de2e6;` (`.highlight-cyan`, `.badge-cyan`)
- **Red Threat Accent**: `--accent-red: #ff2e63;` (`.highlight-red`, `.badge-red`)
- **Purple Accent**: `--accent-purple: #9d4edd;` (`.highlight-purple`, `.badge-purple`)
- **Yellow Accent**: `--accent-yellow: #ffb703;` (`.highlight-yellow`)
- **Background Dark**: `--htb-bg-dark: #0a1224;`
- **Card Dark**: `--htb-bg-card: #132238;` (Hover: `--htb-bg-card-hover: #1b3252;`)
- **Terminal Dark**: `--htb-bg-terminal: #070e1b;`

### Typography Stack
- **Headings**: `'Space Grotesk', sans-serif`
- **Body Text**: `'Inter', sans-serif`
- **Code / Monospace**: `'Fira Code', monospace`

---

## 🛠️ Reusable CSS Utility Dictionary

To maintain 100% visual consistency when creating new slides, use these CSS utility classes:

### 1. Card Layout Grids
- `.grid-2`: 2 equal columns
- `.grid-3`: 3 equal columns
- `.grid-2-asym`: Asymmetric 60/40 column split (ideal for diagram + text)
- `.cyber-card`: Standard HTB card container with green left border & hover glow
- `.cyber-card.threat`: Red threat card for security vulnerabilities
- `.cyber-card.secure`: Green/Cyan hardened security card

### 2. Header Badges
```html
<span class="cyber-badge badge-htb">HTB GREEN</span>
<span class="cyber-badge badge-cyan">CYAN ACCENT</span>
<span class="cyber-badge badge-red">THREAT RED</span>
<span class="cyber-badge badge-purple">PURPLE ACCENT</span>
```

### 3. List Bullet Prompts
- Standard Prompt `[+]`: `<ul><li>Item</li></ul>`
- Secure Checkmark `[✓]`: `<ul class="secure-list"><li>Secure feature</li></ul>`
- Threat Alert `[!]`: `<ul class="threat-list"><li>Vulnerability</li></ul>`

### 4. Diagrams & Image Showcases
Wrap image figures using the diagram utility class:
```html
<div class="diagram-box">
  <img src="media/your_diagram.png" class="diagram-img" alt="Diagram">
  <div class="diagram-caption">
    <i class="fa-solid fa-diagram-project highlight-htb"></i> Figure 1: Architecture Overview
  </div>
</div>
```

### 5. Row-by-Row Protocol Comparisons
```html
<div class="comparison-list">
  <div class="comparison-row">
    <strong>• Feature:</strong> <span class="highlight-htb">New Spec</span> vs. <span class="highlight-red">Old Spec</span>
  </div>
</div>
```

### 6. Terminal Code Blocks
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

## ⚡ Step-by-Step Guide to Adding New Slides

1. **Pick a Template**: Copy one of the 7 pre-made templates in `templates/`.
2. **Create Slide File**: Create your HTML file inside `slides/` (e.g. `slides/my_new_topic.html`).
3. **Register Slide**: Add your filename to the master list in `slides/slides.json`:
   ```json
   [
     "title.html",
     "my_new_topic.html",
     "summary.html"
   ]
   ```
4. **Compile & Build**: Run the build script:
   ```bash
   npm run build
   ```
   *(Or run `npm start` to auto-build and serve locally at `http://localhost:3000`)*

---

## ⚙️ Interactive JS Simulators Rule

- **Do NOT write inline `<script>` or `<script src="...">` inside HTML slide files**.
- Keep slide HTML files 100% clean markup.
- All interactive JavaScript logic must be placed inside modular scripts in `js/` (e.g. `js/my-new-sim.js`) and imported cleanly at the bottom of `index.html`.
