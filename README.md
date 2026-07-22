# 🟩 HTTP & Protocol Evolution Presentation (Modular Hack The Box Edition)

A modular, scalable presentation on **HTTP Protocol Architecture, 4 Blocks, Characteristics, and Version Evolution (0.9 to 3)** built with [Reveal.js](https://revealjs.com/) and styled in **Hack The Box (HTB)** visual brand identity.

---

## 🚀 Key Features & Best Practices

- **Media Folder (`media/`)**: Centralized directory holding all image, SVG, and GIF media assets (`media/http_overview.svg`).
- **Modular Architecture**: Slides are split into individual `.html` files inside `slides/`.
- **Slide Builder Script**: Run `npm run build` to automatically compile `slides/*.html` into `index.html`.
- **Reusable Templates**: Pre-made templates inside `templates/` for copy-pasting consistent slides.
- **Slide Counter**: Integrated current/total slide counter (`5/11`) in bottom right.
- **Interactive Simulator**: Live packet loss simulation comparing HTTP/2 TCP vs HTTP/3 QUIC.

---

## 🛠️ Quick Start & Slide Workflow

### 1. Run the Presentation
```bash
npm start
# or
npm run build && npx serve . -l 3000
```
Open `http://localhost:3000` in your web browser.

### 2. Add New Slides
1. Place any images, GIFs, or SVGs into the `media/` directory.
2. Choose a template from `templates/` (e.g. `templates/01_standard_card_slide.html`).
3. Create a new file in `slides/` (e.g. `slides/12_my_new_topic.html`).
4. Run `npm run build` to compile!

📖 **For detailed design guidelines & code patterns, view the [SLIDE_GUIDE.md](file:///home/mek/Documents/network01_slide/SLIDE_GUIDE.md)**.

---

## ⌨️ Presentation Keyboard Shortcuts
- **Next / Prev Slide**: `Space`, `Right Arrow` `→`, `Left Arrow` `←`
- **Slide Overview**: Press `ESC` or `O`
- **Fullscreen Mode**: Press `F`
- **Speaker Notes**: Press `S`
