# 🟩 HTTP & Protocol Evolution Presentation (Hack The Box Edition)

A simplified, high-impact presentation on **HTTP Protocol Architecture, 4 Blocks, Characteristics, and Version Evolution (0.9 to 3)** built with [Reveal.js](https://revealjs.com/) and styled in **Hack The Box (HTB)** visual brand identity.

---

## 📋 Simplified Slide Structure

1. **Title Slide**: HTTP Protocol & Evolution (HTB Academy Style)
2. **What is HTTP?**: Core definition, Client-Server model, TCP/TLS transport + **Embedded `http_overview.svg` Diagram**
3. **The 4 Blocks of HTTP**: HTML, HTTP Protocol, Web Browser Client, httpd Server
4. **HTTP Characteristics**: Stateless but NOT Sessionless (Cookies) & Extensible (HTTP Headers)
5. **Origins & HTTP/0.9**: Tim Berners-Lee 1989 CERN proposal & The One-Line Protocol (`GET /my-page.html`)
6. **HTTP/1.0 — Building Extensibility**: Versioning, status codes, headers, `Content-Type` & code snippet example
7. **HTTP/1.1 — Parallel TCP Connections**: 6 TCP connections, fault tolerance & multi-connection bottleneck
8. **HTTP/2 — Greater Performance**: SPDY origin, single TCP, binary framing, multiplexing, HPACK header compression & Head-of-Line blocking problem
9. **HTTP/3 — HTTP over QUIC**: QUIC/UDP transport, lower latency, smart manager in browser code & independent lanes (streams)
10. **Live Packet Loss Simulation**: Interactive HTTP/2 vs HTTP/3 packet loss simulator (Single TCP freeze vs independent QUIC streams flow)
11. **Summary & Conclusion**: Overview recap

---

## 🖼️ Embedded Diagram
- [http_overview.svg](file:///home/mek/Documents/network01_slide/http_overview.svg) is rendered cleanly on **Slide 2** in a card container.

---

## 💻 How to View & Present

- **Direct Browser**: Open [index.html](file:///home/mek/Documents/network01_slide/index.html) in Chrome, Firefox, Edge, or Safari.
- **Node Local Server**: Run `npm start` or `npx serve . -l 3000` and visit `http://localhost:3000`.

**Keyboard Navigation**:
- Press `Space` / `→` / `↓` for Next Slide, `←` / `↑` for Previous Slide.
- Press `ESC` or `O` for Grid Slide Overview.
- Press `F` for Fullscreen Mode.
