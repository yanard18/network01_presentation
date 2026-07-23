/* Interactive Visual Network Hardware Devices Simulator (Hub, Bridge, Switch, Router) */

class NetworkDevicesSimulator {
  constructor() {
    this.animating = false;
  }

  // Helper to cleanly snap-reset packet position without teleport animation glitch
  resetPacket(el, startLeft, startTop) {
    if (!el) return;
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.left = startLeft;
    el.style.top = startTop;
    void el.offsetWidth; // Force reflow
    el.style.transition = 'left 0.6s linear, top 0.6s linear, opacity 0.25s ease';
  }

  // Helper to fade out packet when reached
  fadePacket(el, delay = 1200) {
    setTimeout(() => {
      if (el) {
        el.style.opacity = '0';
      }
    }, delay);
  }

  // 1. HUB VISUAL SIMULATION (FLOODING)
  testHub(targetPort) {
    const statusEl = document.getElementById('hub-sim-status');
    const logEl = document.getElementById('hub-sim-log');

    if (statusEl) {
      statusEl.className = 'sim-status blocked';
      statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> HUB FLOODING: Sinyal Comp A'dan geldi, fakat Hub sinyali BÜTÜN portlara (B, C, D) kopyaladı!`;
    }

    if (logEl) {
      logEl.innerHTML = `
        <div style="color: var(--accent-red); font-weight:700;">[!] Comp A ➔ Comp ${targetPort.toUpperCase()} (Elektriksel Yayın/Flooding):</div>
        <div style="color: var(--htb-green);">✔ Comp ${targetPort.toUpperCase()}: Veriyi kabul etti (Target MAC eşleşti).</div>
        <div style="color: var(--text-muted);">✖ Diğer Portlar (B, C, D): Elektriksel sinyali aldı ve L2'de çöpe attı.</div>
        <div style="color: var(--accent-red); margin-top:0.3rem;">⚠️ Tek Çakışma Alanı (Single Collision Domain)! Tüm cihazlar 1 teli paylaşır.</div>
      `;
    }

    const pktMain = document.getElementById('hub-pkt-main');
    const pktB = document.getElementById('hub-pkt-b');
    const pktC = document.getElementById('hub-pkt-c');
    const pktD = document.getElementById('hub-pkt-d');

    // Snap-reset packets to initial state
    this.resetPacket(pktMain, '20%', '25%');
    this.resetPacket(pktB, '50%', '50%');
    this.resetPacket(pktC, '50%', '50%');
    this.resetPacket(pktD, '50%', '50%');

    // Start Main Packet from Comp A to Hub Center
    setTimeout(() => {
      if (pktMain) {
        pktMain.style.opacity = '1';
        pktMain.style.left = '50%';
        pktMain.style.top = '50%';
      }
    }, 50);

    // At Hub Center, flood out to B, C, D
    setTimeout(() => {
      if (pktMain) pktMain.style.opacity = '0';

      [pktB, pktC, pktD].forEach(p => {
        if (p) {
          p.style.transition = 'none';
          p.style.left = '50%';
          p.style.top = '50%';
          p.style.opacity = '1';
          void p.offsetWidth;
          p.style.transition = 'left 0.6s linear, top 0.6s linear, opacity 0.25s ease';
        }
      });

      if (pktB) { pktB.style.left = '80%'; pktB.style.top = '25%'; }
      if (pktC) { pktC.style.left = '80%'; pktC.style.top = '75%'; }
      if (pktD) { pktD.style.left = '20%'; pktD.style.top = '75%'; }

      this.fadePacket(pktB, 1100);
      this.fadePacket(pktC, 1100);
      this.fadePacket(pktD, 1100);
    }, 700);
  }

  // 2. BRIDGE VISUAL SIMULATION (SEGMENT FILTERING)
  testBridge(destSegment) {
    const statusEl = document.getElementById('bridge-sim-status');
    const logEl = document.getElementById('bridge-sim-log');
    const pkt = document.getElementById('bridge-pkt-main');
    const iconEl = document.getElementById('bridge-icon-dev');

    if (!pkt) return;

    this.resetPacket(pkt, '20%', '30%');
    if (iconEl) iconEl.style.borderColor = 'var(--htb-border)';

    if (destSegment === 'same') {
      if (statusEl) {
        statusEl.className = 'sim-status active';
        statusEl.innerHTML = `<i class="fa-solid fa-filter"></i> BRIDGE FİLTRELEME: Hedef (Comp B) Segment 1'de. Çerçeve Segment 2'ye GEÇİRİLMEDİ!`;
      }
      if (logEl) {
        logEl.innerHTML = `
          <div style="color: var(--accent-cyan); font-weight:700;">[+] Comp A ➔ Comp B (Aynı Segment 1 İçinde)</div>
          <div>1. Köprü Hedef MAC adresini inceledi (Software Lookup).</div>
          <div>2. Hedef cihazın Segment 1'de olduğu doğrulandı.</div>
          <div style="color: var(--htb-green); font-weight:700; margin-top:0.3rem;">✔ ÇERÇEVE KESİLDİ: Segment 2 tamamen sessiz ve izole tutuldu!</div>
        `;
      }

      // Animate: Comp A (20%, 30%) -> Bridge (50%, 50%)
      setTimeout(() => {
        pkt.style.opacity = '1';
        pkt.style.left = '50%';
        pkt.style.top = '50%';
      }, 50);

      // Red Shield Flash at Bridge
      setTimeout(() => {
        if (iconEl) iconEl.style.borderColor = 'var(--accent-red)';
        this.fadePacket(pkt, 200);
      }, 700);

    } else {
      if (statusEl) {
        statusEl.className = 'sim-status normal';
        statusEl.innerHTML = `<i class="fa-solid fa-right-left"></i> BRIDGE İLETİMİ: Hedef (Comp C) Segment 2'de. Çerçeve karşı segmente iletildi!`;
      }
      if (logEl) {
        logEl.innerHTML = `
          <div style="color: var(--accent-purple); font-weight:700;">[+] Comp A (Segment 1) ➔ Comp C (Segment 2)</div>
          <div>1. Köprü Hedef MAC adresini inceledi.</div>
          <div>2. Hedef cihazın Segment 2'de olduğu anlaşıldı.</div>
          <div style="color: var(--accent-cyan); font-weight:700; margin-top:0.3rem;">➔ İLETİLDİ: Çerçeve Köprü sınırını geçerek Segment 2'ye aktarıldı.</div>
        `;
      }

      // Animate: Comp A (20%, 30%) -> Bridge (50%, 50%)
      setTimeout(() => {
        pkt.style.opacity = '1';
        pkt.style.left = '50%';
        pkt.style.top = '50%';
      }, 50);

      // Bridge -> Comp C (80%, 30%)
      setTimeout(() => {
        if (iconEl) iconEl.style.borderColor = 'var(--htb-green)';
        pkt.style.left = '80%';
        pkt.style.top = '30%';
        this.fadePacket(pkt, 1000);
      }, 700);
    }
  }

  // 3. SWITCH VISUAL SIMULATION (CAM / MAC TABLE CONFIG DATA)
  testSwitch(targetComp) {
    const statusEl = document.getElementById('switch-sim-status');
    const logEl = document.getElementById('switch-sim-log');
    const pkt = document.getElementById('switch-pkt-main');

    if (!pkt) return;

    this.resetPacket(pkt, '15%', '50%');

    let targetPortName = `Fa0/2`;
    let targetMac = `0011.2233.44bb`;
    let targetPos = { left: '50%', top: '20%' };

    if (targetComp === 'b') { targetPortName = 'Fa0/2'; targetMac = '0011.2233.44bb'; targetPos = { left: '50%', top: '20%' }; }
    if (targetComp === 'c') { targetPortName = 'Fa0/3'; targetMac = '0011.2233.44cc'; targetPos = { left: '85%', top: '50%' }; }
    if (targetComp === 'd') { targetPortName = 'Fa0/4'; targetMac = '0011.2233.44dd'; targetPos = { left: '50%', top: '80%' }; }

    if (statusEl) {
      statusEl.className = 'sim-status normal';
      statusEl.innerHTML = `<i class="fa-solid fa-bolt"></i> SWITCH CAM TABLE MATCH: Frame routed strictly to Port ${targetPortName} (${targetMac})!`;
    }

    if (logEl) {
      logEl.innerHTML = `
        <div style="color: var(--htb-green); font-weight:700;">Switch# show mac address-table dynamic | match ${targetPortName}</div>
        <div style="color: var(--accent-cyan);">[+] Ingress Port Fa0/1: Frame received (Dst MAC: ${targetMac})</div>
        <div>[+] ASIC CAM Table Query: Searching MAC ${targetMac}...</div>
        <div style="color: var(--htb-green); font-weight:700;">✔ MATCH FOUND: Egress Port ${targetPortName} (Comp ${targetComp.toUpperCase()})</div>
        <div style="color: var(--text-muted); font-size:0.8em; margin-top:0.2rem;">Action: Hardware Unicast Forward to ${targetPortName} ONLY. All other ports isolated.</div>
      `;
    }

    // Step 1: Comp A (15%, 50%) -> Switch (50%, 50%)
    setTimeout(() => {
      pkt.style.opacity = '1';
      pkt.style.left = '50%';
      pkt.style.top = '50%';
    }, 50);

    // Step 2: Switch -> Target Node
    setTimeout(() => {
      pkt.style.left = targetPos.left;
      pkt.style.top = targetPos.top;
      this.fadePacket(pkt, 1000);
    }, 700);
  }

  // 4. ROUTER VISUAL SIMULATION (L3 ROUTING & BROADCAST ISOLATION)
  testRouter(actionType) {
    const statusEl = document.getElementById('router-sim-status');
    const logEl = document.getElementById('router-sim-log');
    const pkt1 = document.getElementById('router-pkt-main');
    const pkt2 = document.getElementById('router-pkt-sub');
    const routerIcon = document.getElementById('router-icon-dev');

    if (!pkt1) return;

    this.resetPacket(pkt1, '15%', '30%');
    if (pkt2) this.resetPacket(pkt2, '35%', '50%');
    if (routerIcon) routerIcon.style.borderColor = 'var(--htb-border)';

    if (actionType === 'route') {
      if (statusEl) {
        statusEl.className = 'sim-status normal';
        statusEl.innerHTML = `<i class="fa-solid fa-network-wired"></i> ROUTER ROUTED: L3 Packet routed from LAN (192.168.1.0/24) to WAN (10.0.0.1)!`;
      }
      if (logEl) {
        logEl.innerHTML = `
          <div style="color: var(--accent-purple); font-weight:700;">[+] LAN Host (192.168.1.50) ➔ WAN Server (10.0.0.1)</div>
          <div>1. Router strips L2 Ethernet Frame & inspects L3 IP Header</div>
          <div>2. Routing Table Lookup ➔ WAN Interface eth1 (10.0.0.1)</div>
          <div style="color: var(--htb-green); font-weight:700; margin-top:0.3rem;">✔ Packet routed across network boundary to Internet!</div>
        `;
      }

      // Step 1: Comp A (15%, 30%) -> Switch A (35%, 50%)
      setTimeout(() => { pkt1.style.opacity = '1'; pkt1.style.left = '35%'; pkt1.style.top = '50%'; }, 50);
      // Step 2: Switch A -> Router (55%, 50%)
      setTimeout(() => { pkt1.style.left = '55%'; pkt1.style.top = '50%'; }, 650);
      // Step 3: Router -> WAN Web Server (85%, 50%)
      setTimeout(() => {
        if (routerIcon) routerIcon.style.borderColor = 'var(--htb-green)';
        pkt1.style.left = '85%'; pkt1.style.top = '50%';
        this.fadePacket(pkt1, 1000);
      }, 1250);

    } else {
      if (statusEl) {
        statusEl.className = 'sim-status blocked';
        statusEl.innerHTML = `<i class="fa-solid fa-shield-halved"></i> BROADCAST ISOLATED: Layer 2 Broadcast (FF:FF:FF:FF:FF:FF) BLOCKED by Router!`;
      }
      if (logEl) {
        logEl.innerHTML = `
          <div style="color: var(--accent-red); font-weight:700;">[!] LAN A Broadcast Request (ARP / DHCP Broadcast):</div>
          <div>1. Switch A floods broadcast to LAN Comp B AND Router</div>
          <div>2. Broadcast arrives at Router Interface (192.168.1.1)</div>
          <div style="color: var(--accent-red); font-weight:700; margin-top:0.3rem;">🛑 BROADCAST ISOLATED: Router blocks broadcast from leaking into WAN!</div>
        `;
      }

      // Step 1: Comp A -> Switch A
      setTimeout(() => { pkt1.style.opacity = '1'; pkt1.style.left = '35%'; pkt1.style.top = '50%'; }, 50);

      // Step 2: Switch A floods to Comp B (15%, 70%) AND Router (55%, 50%)
      setTimeout(() => {
        pkt1.style.left = '55%'; pkt1.style.top = '50%';
        if (pkt2) {
          pkt2.style.opacity = '1';
          pkt2.style.left = '15%'; pkt2.style.top = '70%';
          this.fadePacket(pkt2, 1000);
        }
      }, 650);

      // Step 3: Router blocks broadcast
      setTimeout(() => {
        if (routerIcon) routerIcon.style.borderColor = 'var(--accent-red)';
        this.fadePacket(pkt1, 200);
      }, 1250);
    }
  }

  // 5. ARP INTERACTIVE BROADCAST & UNICAST REPLY SIMULATION (Slower & Detailed Pace)
  testArp(targetHost = 'c') {
    const statusEl = document.getElementById('arp-sim-status');
    const logEl = document.getElementById('arp-sim-log');

    const pktReq = document.getElementById('arp-pkt-req');
    const pktB = document.getElementById('arp-pkt-b');
    const pktC = document.getElementById('arp-pkt-c');
    const pktD = document.getElementById('arp-pkt-d');
    const pktReply = document.getElementById('arp-pkt-reply');

    const ipMap = {
      b: { ip: '192.168.1.20', mac: 'BB:BB:BB:BB:BB:BB', label: 'Comp B (192.168.1.20)', pos: { left: '50%', top: '20%' } },
      c: { ip: '192.168.1.30', mac: 'CC:CC:CC:CC:CC:CC', label: 'Comp C (192.168.1.30)', pos: { left: '85%', top: '50%' } },
      d: { ip: '192.168.1.40', mac: 'DD:DD:DD:DD:DD:DD', label: 'Comp D (192.168.1.40)', pos: { left: '50%', top: '80%' } }
    };

    const targetInfo = ipMap[targetHost] || ipMap.c;
    const transitionSlow = 'left 1.8s cubic-bezier(0.4, 0, 0.2, 1), top 1.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';

    // Step 1: Initial Broadcast Request Setup
    if (statusEl) {
      statusEl.className = 'sim-status active';
      statusEl.innerHTML = `<i class="fa-solid fa-satellite-dish"></i> STEP 1: Comp A broadcasting ARP Request for ${targetInfo.ip}...`;
    }

    if (logEl) {
      logEl.innerHTML = `
        <div style="color: var(--accent-cyan); font-weight:700;">[STEP 1/3] Comp A (192.168.1.10) ➔ Broadcast (FF:FF:FF:FF:FF:FF)</div>
        <div>Sending ARP Request: <em>"Who has ${targetInfo.ip}? Tell 192.168.1.10"</em></div>
      `;
    }

    // Reset packets instantly
    this.resetPacket(pktReq, '15%', '50%');
    this.resetPacket(pktB, '50%', '50%');
    this.resetPacket(pktC, '50%', '50%');
    this.resetPacket(pktD, '50%', '50%');
    this.resetPacket(pktReply, targetInfo.pos.left, targetInfo.pos.top);

    // Step 1 Movement: Comp A -> Switch (50%, 50%)
    setTimeout(() => {
      if (pktReq) {
        pktReq.style.transition = transitionSlow;
        pktReq.style.opacity = '1';
        pktReq.style.left = '50%';
        pktReq.style.top = '50%';
      }
    }, 100);

    // Step 2: Switch Floods ARP Request to all attached ports
    setTimeout(() => {
      if (statusEl) {
        statusEl.className = 'sim-status active';
        statusEl.innerHTML = `<i class="fa-solid fa-bullhorn"></i> STEP 2: Switch flooding ARP Request to Comp B, C, and D...`;
      }

      if (pktReq) pktReq.style.opacity = '0';

      [pktB, pktC, pktD].forEach(p => {
        if (p) {
          p.style.transition = 'none';
          p.style.left = '50%';
          p.style.top = '50%';
          p.style.opacity = '1';
          void p.offsetWidth;
          p.style.transition = transitionSlow;
        }
      });

      if (pktB) { pktB.style.left = '50%'; pktB.style.top = '20%'; }
      if (pktC) { pktC.style.left = '85%'; pktC.style.top = '50%'; }
      if (pktD) { pktD.style.left = '50%'; pktD.style.top = '80%'; }

      if (logEl) {
        logEl.innerHTML = `
          <div style="color: var(--accent-cyan); font-weight:700;">[STEP 2/3] Switch flooding broadcast frame to all active ports...</div>
          <div style="color: var(--text-muted); font-size: 0.85em;">Waiting for hosts to inspect IP payload...</div>
        `;
      }
    }, 2100);

    // Step 2 Evaluation: Non-target hosts drop packet, Target host matches
    setTimeout(() => {
      this.fadePacket(pktB, targetHost === 'b' ? 2500 : 200);
      this.fadePacket(pktC, targetHost === 'c' ? 2500 : 200);
      this.fadePacket(pktD, targetHost === 'd' ? 2500 : 200);

      if (logEl) {
        let logHTML = `<div style="color: var(--accent-cyan); font-weight:700;">[STEP 2/3] Host IP Evaluation Results:</div>`;
        ['b', 'c', 'd'].forEach(h => {
          if (h === targetHost) {
            logHTML += `<div style="color: var(--htb-green); font-weight:700;">✔ ${ipMap[h].label}: IP MATCH! Accepting ARP Request &amp; preparing Unicast Reply...</div>`;
          } else {
            logHTML += `<div style="color: var(--accent-red);">✖ ${ipMap[h].label}: IP mismatch ➔ Packet Discarded.</div>`;
          }
        });
        logEl.innerHTML = logHTML;
      }
    }, 4000);

    // Step 3: Unicast ARP Reply from Target Host -> Switch
    setTimeout(() => {
      if (statusEl) {
        statusEl.className = 'sim-status normal';
        statusEl.innerHTML = `<i class="fa-solid fa-reply"></i> STEP 3: ${targetInfo.label} sending Unicast ARP Reply back to Comp A...`;
      }

      if (pktReply) {
        pktReply.style.transition = 'none';
        pktReply.style.left = targetInfo.pos.left;
        pktReply.style.top = targetInfo.pos.top;
        pktReply.style.opacity = '1';
        void pktReply.offsetWidth;
        pktReply.style.transition = transitionSlow;

        // Move to Switch
        pktReply.style.left = '50%';
        pktReply.style.top = '50%';

        if (logEl) {
          logEl.innerHTML = `
            <div style="color: var(--htb-green); font-weight:700;">[STEP 3/3] Target ${targetInfo.label} ➔ Unicast Reply to Switch</div>
            <div>Sending ARP Reply: <em>"${targetInfo.ip} is at MAC ${targetInfo.mac}"</em></div>
          `;
        }
      }
    }, 4500);

    // Step 3 Continuation: Switch -> Comp A
    setTimeout(() => {
      if (pktReply) {
        pktReply.style.left = '15%';
        pktReply.style.top = '50%';
        this.fadePacket(pktReply, 2000);
      }
    }, 6500);

    // Final Completion: Update Status & Logs
    setTimeout(() => {
      if (statusEl) {
        statusEl.className = 'sim-status normal';
        statusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> RESOLUTION COMPLETE: Comp A cached ${targetInfo.ip} ➔ ${targetInfo.mac}`;
      }

      if (logEl) {
        logEl.innerHTML = `
          <div style="color: var(--htb-green); font-weight:700;">✔ RESOLUTION COMPLETE: ${targetInfo.ip} is at ${targetInfo.mac}</div>
          <div style="color: var(--htb-green); margin-top:0.3rem;">✔ Comp A updated ARP Cache: <strong>${targetInfo.ip} ➔ ${targetInfo.mac}</strong></div>
        `;
      }
    }, 8500);
  }
}

window.netDevSim = new NetworkDevicesSimulator();
