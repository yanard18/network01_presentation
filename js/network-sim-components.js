/* Web Components for Network Devices Simulators (Hub, Bridge, Switch, Router)
   Option 1: Native Web Components embedded in Standard Markdown
*/

const commonStyles = `
  :host {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
    margin: 1.8rem 0;
  }
  .sim-container {
    background: #0b132b;
    border: 1px solid #1c2a4e;
    border-radius: 10px;
    padding: 1.2rem;
    color: #e2e8f0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .sim-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .sim-title {
    font-size: 0.95rem;
    font-weight: 700;
  }
  .badge {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-right: 0.4rem;
  }
  .badge-red { background: rgba(255,46,99,0.2); color: #ff2e63; border: 1px solid #ff2e63; }
  .badge-cyan { background: rgba(45,226,230,0.2); color: #2de2e6; border: 1px solid #2de2e6; }
  .badge-green { background: rgba(159,239,0,0.2); color: #9fef00; border: 1px solid #9fef00; }
  .badge-purple { background: rgba(168,85,247,0.2); color: #a855f7; border: 1px solid #a855f7; }
  
  .sim-status {
    font-size: 0.82rem;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    background: #162238;
    border: 1px solid #2a3b5c;
  }
  .sim-status.blocked { border-color: #ff2e63; color: #ff6b8b; }
  .sim-status.active { border-color: #2de2e6; color: #2de2e6; }
  .sim-status.normal { border-color: #9fef00; color: #9fef00; }

  .topo-canvas {
    position: relative;
    height: 240px;
    background: #070e1b;
    border: 1px solid #1a2744;
    border-radius: 8px;
    margin-bottom: 0.8rem;
    overflow: hidden;
  }
  .topo-lines-svg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .topo-line {
    stroke: #2a3b5c;
    stroke-width: 2;
    stroke-dasharray: 4;
  }
  .topo-line.active {
    stroke: #3b82f6;
    stroke-dasharray: none;
  }
  .topo-node {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
  }
  .topo-node-icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #0f172a;
    border: 2px solid #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: #3b82f6;
    box-shadow: 0 0 10px rgba(59,130,246,0.3);
    transition: all 0.3s ease;
  }
  .topo-node-label {
    font-size: 0.72rem;
    color: #94a3b8;
    margin-top: 4px;
    white-space: nowrap;
  }
  .topo-packet {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #00f2fe;
    box-shadow: 0 0 12px #00f2fe;
    transform: translate(-50%, -50%);
    opacity: 0;
    z-index: 10;
  }
  .controls {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 0.6rem;
    flex-wrap: wrap;
  }
  .sim-btn {
    background: #1e293b;
    color: #e2e8f0;
    border: 1px solid #334155;
    padding: 0.45rem 0.9rem;
    border-radius: 6px;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .sim-btn:hover {
    background: #334155;
    color: #fff;
    border-color: #3b82f6;
  }
  .sim-btn-red:hover { border-color: #ff2e63; color: #ff2e63; }
  .sim-btn-cyan:hover { border-color: #2de2e6; color: #2de2e6; }
  .sim-btn-green:hover { border-color: #9fef00; color: #9fef00; }
  .sim-btn-purple:hover { border-color: #a855f7; color: #a855f7; }

  .sim-log {
    background: #050a14;
    border: 1px solid #162238;
    border-radius: 6px;
    padding: 0.7rem 0.9rem;
    font-size: 0.8rem;
    min-height: 75px;
    line-height: 1.5;
  }
`;

// 1. HUB SIMULATOR
class NetworkHubSim extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${commonStyles}</style>
      <div class="sim-container">
        <div class="sim-header">
          <div class="sim-title"><span class="badge badge-red">HUB TOPOLOGY</span> Multiport Electrical Flooding (Layer 1)</div>
          <div id="status" class="sim-status normal">Click a button below to transmit from Comp A</div>
        </div>
        <div class="topo-canvas">
          <svg class="topo-lines-svg">
            <line x1="20%" y1="25%" x2="50%" y2="50%" class="topo-line active"></line>
            <line x1="80%" y1="25%" x2="50%" y2="50%" class="topo-line"></line>
            <line x1="80%" y1="75%" x2="50%" y2="50%" class="topo-line"></line>
            <line x1="20%" y1="75%" x2="50%" y2="50%" class="topo-line"></line>
          </svg>

          <div class="topo-node" style="left: 50%; top: 50%;">
            <div class="topo-node-icon" style="border-color:#ff2e63; color:#ff2e63;">⚙️</div>
            <span class="topo-node-label">L1 HUB</span>
          </div>
          <div class="topo-node" style="left: 20%; top: 25%;">
            <div class="topo-node-icon" style="border-color:#9fef00; color:#9fef00;">💻</div>
            <span class="topo-node-label">Comp A</span>
          </div>
          <div class="topo-node" style="left: 80%; top: 25%;">
            <div class="topo-node-icon">💻</div>
            <span class="topo-node-label">Comp B</span>
          </div>
          <div class="topo-node" style="left: 80%; top: 75%;">
            <div class="topo-node-icon">💻</div>
            <span class="topo-node-label">Comp C</span>
          </div>
          <div class="topo-node" style="left: 20%; top: 75%;">
            <div class="topo-node-icon">💻</div>
            <span class="topo-node-label">Comp D</span>
          </div>

          <div id="pkt-main" class="topo-packet"></div>
          <div id="pkt-b" class="topo-packet"></div>
          <div id="pkt-c" class="topo-packet"></div>
          <div id="pkt-d" class="topo-packet"></div>
        </div>

        <div class="controls">
          <button class="sim-btn sim-btn-red" id="btn-b">Send A ➔ B</button>
          <button class="sim-btn sim-btn-red" id="btn-c">Send A ➔ C</button>
          <button class="sim-btn sim-btn-red" id="btn-d">Send A ➔ D</button>
        </div>
        <div id="log" class="sim-log">
          <div style="color:#64748b;">Click a button to trigger live electrical bit duplication across all connected ports...</div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('btn-b').addEventListener('click', () => this.runSim('B'));
    this.shadowRoot.getElementById('btn-c').addEventListener('click', () => this.runSim('C'));
    this.shadowRoot.getElementById('btn-d').addEventListener('click', () => this.runSim('D'));
  }

  resetPkt(el, x, y) {
    if (!el) return;
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.left = x;
    el.style.top = y;
    void el.offsetWidth;
    el.style.transition = 'left 0.6s linear, top 0.6s linear, opacity 0.25s ease';
  }

  runSim(target) {
    const status = this.shadowRoot.getElementById('status');
    const log = this.shadowRoot.getElementById('log');
    const pMain = this.shadowRoot.getElementById('pkt-main');
    const pB = this.shadowRoot.getElementById('pkt-b');
    const pC = this.shadowRoot.getElementById('pkt-c');
    const pD = this.shadowRoot.getElementById('pkt-d');

    status.className = 'sim-status blocked';
    status.innerHTML = `⚠️ HUB FLOODING: Electrical signal copied to ALL ports!`;
    log.innerHTML = `
      <div style="color:#ff2e63; font-weight:bold;">[!] Comp A ➔ Comp ${target} (Electrical Flooding):</div>
      <div style="color:#9fef00;">✔ Comp ${target}: Accepted payload (Destination MAC match).</div>
      <div style="color:#64748b;">✖ Other Ports: Received raw voltage, dropped frame at Layer 2.</div>
      <div style="color:#ff2e63; margin-top:0.2rem;">⚠️ Single Collision Domain! All devices share 1 physical wire medium.</div>
    `;

    this.resetPkt(pMain, '20%', '25%');
    [pB, pC, pD].forEach(p => this.resetPkt(p, '50%', '50%'));

    setTimeout(() => {
      pMain.style.opacity = '1';
      pMain.style.left = '50%'; pMain.style.top = '50%';
    }, 50);

    setTimeout(() => {
      pMain.style.opacity = '0';
      [pB, pC, pD].forEach(p => {
        p.style.transition = 'none';
        p.style.left = '50%'; p.style.top = '50%'; p.style.opacity = '1';
        void p.offsetWidth;
        p.style.transition = 'left 0.6s linear, top 0.6s linear, opacity 0.25s ease';
      });
      pB.style.left = '80%'; pB.style.top = '25%';
      pC.style.left = '80%'; pC.style.top = '75%';
      pD.style.left = '20%'; pD.style.top = '75%';

      setTimeout(() => {
        [pB, pC, pD].forEach(p => p.style.opacity = '0');
      }, 1000);
    }, 700);
  }
}
customElements.define('network-hub-sim', NetworkHubSim);

// 2. BRIDGE SIMULATOR
class NetworkBridgeSim extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${commonStyles}</style>
      <div class="sim-container">
        <div class="sim-header">
          <div class="sim-title"><span class="badge badge-cyan">BRIDGE TOPOLOGY</span> Software MAC Segment Filtering (Layer 2)</div>
          <div id="status" class="sim-status normal">Bridge Ready: Test Same vs Cross-Segment transmission</div>
        </div>
        <div class="topo-canvas">
          <div style="position:absolute; left:5%; top:5%; width:38%; height:90%; border:1px dashed #2de2e6; border-radius:4px; pointer-events:none;"></div>
          <div style="position:absolute; right:5%; top:5%; width:38%; height:90%; border:1px dashed #a855f7; border-radius:4px; pointer-events:none;"></div>
          <div style="position:absolute; left:50%; top:0; bottom:0; border-left:2px dashed rgba(255,255,255,0.15); pointer-events:none;"></div>

          <svg class="topo-lines-svg">
            <line x1="20%" y1="30%" x2="50%" y2="50%" class="topo-line active"></line>
            <line x1="20%" y1="70%" x2="50%" y2="50%" class="topo-line"></line>
            <line x1="80%" y1="30%" x2="50%" y2="50%" class="topo-line"></line>
            <line x1="80%" y1="70%" x2="50%" y2="50%" class="topo-line"></line>
          </svg>

          <div style="position:absolute; left:8%; top:8%; font-size:0.65rem; color:#2de2e6;">SEGMENT 1</div>
          <div style="position:absolute; right:8%; top:8%; font-size:0.65rem; color:#a855f7;">SEGMENT 2</div>

          <div class="topo-node" style="left: 50%; top: 50%;">
            <div id="bridge-icon" class="topo-node-icon" style="border-color:#2de2e6; color:#2de2e6;">🛡️</div>
            <span class="topo-node-label">L2 BRIDGE</span>
          </div>

          <div class="topo-node" style="left: 20%; top: 30%;">
            <div class="topo-node-icon" style="border-color:#9fef00; color:#9fef00;">💻</div>
            <span class="topo-node-label">Comp A (Seg 1)</span>
          </div>
          <div class="topo-node" style="left: 20%; top: 70%;">
            <div class="topo-node-icon">💻</div>
            <span class="topo-node-label">Comp B (Seg 1)</span>
          </div>
          <div class="topo-node" style="left: 80%; top: 30%;">
            <div class="topo-node-icon">💻</div>
            <span class="topo-node-label">Comp C (Seg 2)</span>
          </div>
          <div class="topo-node" style="left: 80%; top: 70%;">
            <div class="topo-node-icon">💻</div>
            <span class="topo-node-label">Comp D (Seg 2)</span>
          </div>

          <div id="pkt-main" class="topo-packet"></div>
        </div>

        <div class="controls">
          <button class="sim-btn sim-btn-cyan" id="btn-same">Send A ➔ B (Same Segment)</button>
          <button class="sim-btn sim-btn-purple" id="btn-cross">Send A ➔ C (Cross Segment)</button>
        </div>
        <div id="log" class="sim-log">
          <div style="color:#64748b;">Click a button to test how Bridge filters frames in software...</div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('btn-same').addEventListener('click', () => this.runSim('same'));
    this.shadowRoot.getElementById('btn-cross').addEventListener('click', () => this.runSim('cross'));
  }

  runSim(type) {
    const status = this.shadowRoot.getElementById('status');
    const log = this.shadowRoot.getElementById('log');
    const pkt = this.shadowRoot.getElementById('pkt-main');
    const icon = this.shadowRoot.getElementById('bridge-icon');

    pkt.style.transition = 'none';
    pkt.style.opacity = '0';
    pkt.style.left = '20%'; pkt.style.top = '30%';
    void pkt.offsetWidth;
    pkt.style.transition = 'left 0.6s linear, top 0.6s linear, opacity 0.25s ease';

    if (type === 'same') {
      status.className = 'sim-status active';
      status.innerHTML = `🔍 BRIDGE FILTER: Target on Segment 1. Frame BLOCKED from crossing!`;
      log.innerHTML = `
        <div style="color:#2de2e6; font-weight:bold;">[+] Comp A ➔ Comp B (Same Segment 1)</div>
        <div>1. Bridge inspected destination MAC (Software Lookup).</div>
        <div style="color:#9fef00; font-weight:bold;">✔ FRAME BLOCKED: Segment 2 remains quiet and isolated!</div>
      `;

      setTimeout(() => { pkt.style.opacity = '1'; pkt.style.left = '50%'; pkt.style.top = '50%'; }, 50);
      setTimeout(() => { icon.style.borderColor = '#ff2e63'; pkt.style.opacity = '0'; }, 700);
    } else {
      status.className = 'sim-status normal';
      status.innerHTML = `➔ BRIDGE FORWARD: Target on Segment 2. Frame forwarded across!`;
      log.innerHTML = `
        <div style="color:#a855f7; font-weight:bold;">[+] Comp A (Seg 1) ➔ Comp C (Seg 2)</div>
        <div>1. Bridge inspected destination MAC address.</div>
        <div style="color:#2de2e6; font-weight:bold;">➔ FORWARDED: Frame passed through Bridge to Segment 2.</div>
      `;

      setTimeout(() => { pkt.style.opacity = '1'; pkt.style.left = '50%'; pkt.style.top = '50%'; }, 50);
      setTimeout(() => {
        icon.style.borderColor = '#9fef00';
        pkt.style.left = '80%'; pkt.style.top = '30%';
        setTimeout(() => pkt.style.opacity = '0', 800);
      }, 700);
    }
  }
}
customElements.define('network-bridge-sim', NetworkBridgeSim);

// 3. SWITCH SIMULATOR
class NetworkSwitchSim extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${commonStyles}</style>
      <div class="sim-container">
        <div class="sim-header">
          <div class="sim-title"><span class="badge badge-green">SWITCH TOPOLOGY</span> Hardware ASIC Unicast Forwarding (Layer 2)</div>
          <div id="status" class="sim-status normal">Switch Ready: Select target port for dedicated ASIC delivery</div>
        </div>
        <div class="topo-canvas">
          <svg class="topo-lines-svg">
            <line x1="15%" y1="50%" x2="50%" y2="50%" class="topo-line active"></line>
            <line x1="50%" y1="20%" x2="50%" y2="50%" class="topo-line"></line>
            <line x1="85%" y1="50%" x2="50%" y2="50%" class="topo-line"></line>
            <line x1="50%" y1="80%" x2="50%" y2="50%" class="topo-line"></line>
          </svg>

          <div class="topo-node" style="left: 50%; top: 50%;">
            <div class="topo-node-icon" style="border-color:#9fef00; color:#9fef00;">⚡</div>
            <span class="topo-node-label">ASIC SWITCH</span>
          </div>

          <div class="topo-node" style="left: 15%; top: 50%;">
            <div class="topo-node-icon" style="border-color:#9fef00; color:#9fef00;">💻</div>
            <span class="topo-node-label">Comp A (Fa0/1)</span>
          </div>
          <div class="topo-node" style="left: 50%; top: 20%;">
            <div class="topo-node-icon">💻</div>
            <span class="topo-node-label">Comp B (Fa0/2)</span>
          </div>
          <div class="topo-node" style="left: 85%; top: 50%;">
            <div class="topo-node-icon">💻</div>
            <span class="topo-node-label">Comp C (Fa0/3)</span>
          </div>
          <div class="topo-node" style="left: 50%; top: 80%;">
            <div class="topo-node-icon">💻</div>
            <span class="topo-node-label">Comp D (Fa0/4)</span>
          </div>

          <div id="pkt-main" class="topo-packet"></div>
        </div>

        <div class="controls">
          <button class="sim-btn sim-btn-green" id="btn-b">Send A ➔ B (Fa0/2)</button>
          <button class="sim-btn sim-btn-green" id="btn-c">Send A ➔ C (Fa0/3)</button>
          <button class="sim-btn sim-btn-green" id="btn-d">Send A ➔ D (Fa0/4)</button>
        </div>
        <div id="log" class="sim-log">
          <div style="color:#64748b;">Click a button to watch Switch lookup MAC ASIC table & route frame strictly to destination port...</div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('btn-b').addEventListener('click', () => this.runSim('B', 'Fa0/2', {x:'50%', y:'20%'}));
    this.shadowRoot.getElementById('btn-c').addEventListener('click', () => this.runSim('C', 'Fa0/3', {x:'85%', y:'50%'}));
    this.shadowRoot.getElementById('btn-d').addEventListener('click', () => this.runSim('D', 'Fa0/4', {x:'50%', y:'80%'}));
  }

  runSim(target, port, pos) {
    const status = this.shadowRoot.getElementById('status');
    const log = this.shadowRoot.getElementById('log');
    const pkt = this.shadowRoot.getElementById('pkt-main');

    pkt.style.transition = 'none';
    pkt.style.opacity = '0';
    pkt.style.left = '15%'; pkt.style.top = '50%';
    void pkt.offsetWidth;
    pkt.style.transition = 'left 0.6s linear, top 0.6s linear, opacity 0.25s ease';

    status.className = 'sim-status normal';
    status.innerHTML = `⚡ CAM MATCH: Frame routed directly to Port ${port}`;
    log.innerHTML = `
      <div style="color:#9fef00; font-weight:bold;">Switch# show mac address-table dynamic</div>
      <div>[+] Ingress Port Fa0/1 ➔ CAM Table Query for Comp ${target}</div>
      <div style="color:#9fef00; font-weight:bold;">✔ ASIC UNICAST FORWARD: Strictly sent to ${port}. All other ports isolated!</div>
    `;

    setTimeout(() => { pkt.style.opacity = '1'; pkt.style.left = '50%'; pkt.style.top = '50%'; }, 50);
    setTimeout(() => {
      pkt.style.left = pos.x; pkt.style.top = pos.y;
      setTimeout(() => pkt.style.opacity = '0', 800);
    }, 700);
  }
}
customElements.define('network-switch-sim', NetworkSwitchSim);

// 4. ROUTER SIMULATOR
class NetworkRouterSim extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${commonStyles}</style>
      <div class="sim-container">
        <div class="sim-header">
          <div class="sim-title"><span class="badge badge-purple">ROUTER TOPOLOGY</span> Inter-Network & Broadcast Isolation (Layer 3)</div>
          <div id="status" class="sim-status normal">Router Ready: Test IP Routing vs L2 Broadcast Isolation</div>
        </div>
        <div class="topo-canvas">
          <svg class="topo-lines-svg">
            <line x1="15%" y1="30%" x2="35%" y2="50%" class="topo-line active"></line>
            <line x1="15%" y1="70%" x2="35%" y2="50%" class="topo-line"></line>
            <line x1="35%" y1="50%" x2="55%" y2="50%" class="topo-line active"></line>
            <line x1="55%" y1="50%" x2="85%" y2="50%" class="topo-line active"></line>
          </svg>

          <div style="position:absolute; left:15%; top:8%; font-size:0.65rem; color:#2de2e6;">LAN A (192.168.1.0/24)</div>
          <div style="position:absolute; right:10%; top:8%; font-size:0.65rem; color:#a855f7;">WAN (10.0.0.0/8)</div>

          <div class="topo-node" style="left: 55%; top: 50%;">
            <div id="router-icon" class="topo-node-icon" style="border-color:#a855f7; color:#a855f7;">🌐</div>
            <span class="topo-node-label">L3 ROUTER</span>
          </div>

          <div class="topo-node" style="left: 15%; top: 30%;">
            <div class="topo-node-icon" style="border-color:#9fef00; color:#9fef00;">💻</div>
            <span class="topo-node-label">Comp A (LAN)</span>
          </div>
          <div class="topo-node" style="left: 15%; top: 70%;">
            <div class="topo-node-icon">💻</div>
            <span class="topo-node-label">Comp B (LAN)</span>
          </div>
          <div class="topo-node" style="left: 35%; top: 50%;">
            <div class="topo-node-icon" style="border-color:#2de2e6; color:#2de2e6;">⚡</div>
            <span class="topo-node-label">Switch A</span>
          </div>
          <div class="topo-node" style="left: 85%; top: 50%;">
            <div class="topo-node-icon" style="border-color:#a855f7; color:#a855f7;">🖧</div>
            <span class="topo-node-label">Web Server (WAN)</span>
          </div>

          <div id="pkt-main" class="topo-packet"></div>
          <div id="pkt-sub" class="topo-packet"></div>
        </div>

        <div class="controls">
          <button class="sim-btn sim-btn-purple" id="btn-route">Route LAN ➔ WAN</button>
          <button class="sim-btn sim-btn-red" id="btn-bcast">Send L2 Broadcast</button>
        </div>
        <div id="log" class="sim-log">
          <div style="color:#64748b;">Click a button to test Layer 3 IP routing across networks vs L2 broadcast isolation...</div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('btn-route').addEventListener('click', () => this.runSim('route'));
    this.shadowRoot.getElementById('btn-bcast').addEventListener('click', () => this.runSim('bcast'));
  }

  runSim(type) {
    const status = this.shadowRoot.getElementById('status');
    const log = this.shadowRoot.getElementById('log');
    const p1 = this.shadowRoot.getElementById('pkt-main');
    const p2 = this.shadowRoot.getElementById('pkt-sub');
    const icon = this.shadowRoot.getElementById('router-icon');

    p1.style.transition = 'none'; p1.style.opacity = '0'; p1.style.left = '15%'; p1.style.top = '30%';
    p2.style.transition = 'none'; p2.style.opacity = '0'; p2.style.left = '35%'; p2.style.top = '50%';
    void p1.offsetWidth; void p2.offsetWidth;
    p1.style.transition = 'left 0.6s linear, top 0.6s linear, opacity 0.25s ease';
    p2.style.transition = 'left 0.6s linear, top 0.6s linear, opacity 0.25s ease';

    if (type === 'route') {
      status.className = 'sim-status normal';
      status.innerHTML = `🌐 ROUTER ROUTED: L3 Packet forwarded LAN ➔ WAN!`;
      log.innerHTML = `
        <div style="color:#a855f7; font-weight:bold;">[+] Host (192.168.1.50) ➔ WAN Server (10.0.0.1)</div>
        <div>1. Router strips L2 frame & inspects L3 IP Header.</div>
        <div style="color:#9fef00; font-weight:bold;">✔ ROUTED: Packet forwarded across interface boundary to Internet!</div>
      `;

      setTimeout(() => { p1.style.opacity = '1'; p1.style.left = '35%'; p1.style.top = '50%'; }, 50);
      setTimeout(() => { p1.style.left = '55%'; p1.style.top = '50%'; }, 650);
      setTimeout(() => {
        icon.style.borderColor = '#9fef00';
        p1.style.left = '85%'; p1.style.top = '50%';
        setTimeout(() => p1.style.opacity = '0', 800);
      }, 1250);
    } else {
      status.className = 'sim-status blocked';
      status.innerHTML = `🛑 BROADCAST BLOCKED: L2 Broadcast stopped at Router interface!`;
      log.innerHTML = `
        <div style="color:#ff2e63; font-weight:bold;">[!] LAN Broadcast Request (ARP/DHCP Broadcast):</div>
        <div>1. Switch A floods broadcast to LAN Host B and Router interface.</div>
        <div style="color:#ff2e63; font-weight:bold;">🛑 BROADCAST ISOLATED: Router blocks broadcast from leaking into WAN!</div>
      `;

      setTimeout(() => { p1.style.opacity = '1'; p1.style.left = '35%'; p1.style.top = '50%'; }, 50);
      setTimeout(() => {
        p1.style.left = '55%'; p1.style.top = '50%';
        p2.style.opacity = '1'; p2.style.left = '15%'; p2.style.top = '70%';
        setTimeout(() => p2.style.opacity = '0', 800);
      }, 650);
      setTimeout(() => {
        icon.style.borderColor = '#ff2e63';
        p1.style.opacity = '0';
      }, 1250);
    }
  }
}
customElements.define('network-router-sim', NetworkRouterSim);
