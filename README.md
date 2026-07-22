# 🟩 HTTP & Cybersecurity Architecture Presentation (Hack The Box Edition)

An interactive, high-impact Cybersecurity slide presentation on **HTTP Protocol Fundamentals, Evolution (HTTP/0.9 to HTTP/3), Attack Vectors, and Protocol Hardening** built with [Reveal.js](https://revealjs.com/) and styled in the **Official Hack The Box (HTB)** visual brand identity.

---

## 🎨 Hack The Box Design System
- **Primary Brand Color**: Neon HTB Lime Green (`#9FEF00`)
- **Background**: Deep Grey-Navy Canvas (`#0b121f`)
- **Cards & Surfaces**: Dark Cobalt Surface (`#111d30`) with `#15243b` hover highlights and sharp 8px corners.
- **Accents**: Cyber Cyan (`#2de2e6`), Critical Target Red (`#ff2e63`), Space Grotesk headings, and Fira Code monospace terminal output.
- **Canvas Overlay**: Matrix Dot-Grid & HTB Green Neural Mesh ([js/cyber-bg.js](file:///home/mek/Documents/network01_slide/js/cyber-bg.js)).

---

## 🛠️ How to Manually Add New Slides

In Reveal.js, every slide is wrapped in a `<section>` tag inside `<div class="slides">` in [index.html](file:///home/mek/Documents/network01_slide/index.html).

### Template 1: Standard HTB 2-Column Card Slide
```html
<section>
  <h2><i class="fa-solid fa-cube highlight-htb"></i> Your HTB Slide Title</h2>
  <div class="grid-2">
    <div class="cyber-card">
      <div class="card-title"><span class="cyber-badge badge-htb">SECTION 01</span> Card Subtitle</div>
      <p>Your description text goes here.</p>
      <ul>
        <li>Point 1 with [+] prompt bullet</li>
        <li>Point 2 with [+] prompt bullet</li>
      </ul>
    </div>

    <div class="cyber-card">
      <div class="card-title"><span class="cyber-badge badge-cyan">SECTION 02</span> Card Subtitle</div>
      <p>Second column text.</p>
    </div>
  </div>
</section>
```

---

### Template 2: Threat & Vulnerability Warning Slide
```html
<section>
  <h2><i class="fa-solid fa-triangle-exclamation highlight-red"></i> Attack & Exploit Vector</h2>
  <div class="grid-2">
    <div class="cyber-card threat">
      <div class="card-title"><span class="cyber-badge badge-red">CVE-2026-XXXX</span> Exploit Payload</div>
      <p>Mechanism of the vulnerability.</p>
      <ul class="threat-list">
        <li>Impact detail 1</li>
      </ul>
    </div>

    <div class="cyber-card secure">
      <div class="card-title"><span class="cyber-badge badge-htb">MITIGATION</span> Protocol Hardening</div>
      <p>Remediation steps.</p>
      <ul class="secure-list">
        <li>Defensive action 1</li>
      </ul>
    </div>
  </div>
</section>
```

---

### Template 3: HTB Terminal & Console Window Slide
```html
<section>
  <h2><i class="fa-solid fa-terminal highlight-htb"></i> Command Line Analysis</h2>
  <div>
    <div class="terminal-header">
      <span class="terminal-dot dot-red"></span>
      <span class="terminal-dot dot-yellow"></span>
      <span class="terminal-dot dot-green"></span>
      <span class="terminal-title">root@htb:~# curl -iv -X POST target.htb</span>
    </div>
    <pre><code class="language-http">POST /api/v1/login HTTP/1.1
Host: target.htb
Authorization: Bearer secret_htb_token</code></pre>
  </div>
</section>
```

---

## 💻 How to View & Present

- **Direct Browser**: Open [index.html](file:///home/mek/Documents/network01_slide/index.html) in Chrome, Firefox, Edge, or Safari.
- **Node Local Server**: Run `npm start` or `npx serve . -l 3000` and visit `http://localhost:3000`.

**Keyboard Navigation**:
- Press `Space` / `→` / `↓` for Next Slide, `←` / `↑` for Previous Slide.
- Press `ESC` or `O` for Grid Slide Overview.
- Press `F` for Fullscreen Mode.
