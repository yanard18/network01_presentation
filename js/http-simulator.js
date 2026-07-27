/* HTTP/2 vs HTTP/3 Interactive Simulation Logic */

class ProtocolSimulator {
  constructor() {
    this.h2Blocked = false;
    this.h3BlockedLane = null; // 0, 1, or 2
    this.h2Packets = [];
    this.h3Packets = [[], [], []]; // 3 lanes
    this.animFrame = null;
    this.isRunning = true;
    this.speed = 1.8;

    this.streamColors = ['#9FEF00', '#2de2e6', '#a855f7']; // Green, Cyan, Purple
    this.streamNames = ['Stream 1 (HTML)', 'Stream 2 (CSS)', 'Stream 3 (JS)'];
  }

  init() {
    this.h2Container = document.getElementById('h2-pipe');
    this.h3Lanes = [
      document.getElementById('h3-lane-0'),
      document.getElementById('h3-lane-1'),
      document.getElementById('h3-lane-2')
    ];

    if (!this.h2Container || !this.h3Lanes[0]) return;

    this.spawnInterval = setInterval(() => {
      if (this.isRunning) {
        this.spawnH2Packet();
        this.spawnH3Packets();
      }
    }, 900);

    this.loop();
  }

  spawnH2Packet() {
    if (this.h2Blocked) return;
    const typeIdx = Math.floor(Math.random() * 3);
    const packet = {
      id: Date.now() + Math.random(),
      typeIdx,
      pos: 0, // 0% to 100%
      color: this.streamColors[typeIdx],
      name: this.streamNames[typeIdx],
      element: null,
      isLost: false
    };
    this.h2Packets.push(packet);
    this.renderH2Packet(packet);
  }

  spawnH3Packets() {
    for (let lane = 0; lane < 3; lane++) {
      // Don't over-crowd lane if it's stalled and already has queued packets
      if (this.h3BlockedLane === lane && this.h3Packets[lane].length >= 5) {
        continue;
      }
      const packet = {
        id: Date.now() + Math.random() + lane,
        lane,
        pos: 0,
        color: this.streamColors[lane],
        name: this.streamNames[lane],
        element: null,
        isLost: false
      };
      this.h3Packets[lane].push(packet);
      this.renderH3Packet(packet);
    }
  }

  renderH2Packet(packet) {
    const el = document.createElement('div');
    el.className = 'sim-packet';
    el.style.backgroundColor = packet.color;
    el.style.left = '0%';
    el.innerHTML = `<span>S${packet.typeIdx + 1}</span>`;
    this.h2Container.appendChild(el);
    packet.element = el;
  }

  renderH3Packet(packet) {
    const el = document.createElement('div');
    el.className = 'sim-packet';
    el.style.backgroundColor = packet.color;
    el.style.left = '0%';
    el.innerHTML = `<span>S${packet.lane + 1}</span>`;
    this.h3Lanes[packet.lane].appendChild(el);
    packet.element = el;
  }

  triggerH2PacketLoss() {
    this.h2Blocked = true;
    const statusEl = document.getElementById('h2-status');
    if (statusEl) {
      statusEl.className = 'sim-status blocked';
      statusEl.innerHTML = '<i class="fa-solid fa-lock"></i> TCP HOL BLOCKING: 3. Paket Düştü (Dropped)! Tüm TCP Bağlantısı Dondu (Frozen)!';
    }

    // Mark front-most packet as lost (Red)
    if (this.h2Packets.length > 0) {
      const midPacket = this.h2Packets[Math.floor(this.h2Packets.length / 2)] || this.h2Packets[0];
      midPacket.isLost = true;
      if (midPacket.element) {
        midPacket.element.classList.add('lost-packet');
        midPacket.element.innerHTML = '<span>❌ DROP</span>';
      }
    }
  }

  triggerH3PacketLoss() {
    if (this.h3Timeout) {
      clearTimeout(this.h3Timeout);
      this.h3Timeout = null;
    }

    // Clear any previous lost flags on lane 1
    this.h3Packets[1].forEach(p => {
      if (p.isLost) {
        p.isLost = false;
        if (p.element) {
          p.element.classList.remove('lost-packet');
          p.element.innerHTML = '<span>S2</span>';
        }
      }
    });

    // Simulate loss specifically on Lane 1 (Stream 2 CSS)
    this.h3BlockedLane = 1;
    const statusEl = document.getElementById('h3-status');
    if (statusEl) {
      statusEl.className = 'sim-status active';
      statusEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> QUIC INDEPENDENCE: Stream 2 üzerinde paket düştü! Stream 1 &amp; 3 akışına devam ediyor!';
    }

    // Find packet on lane 1 near middle, or create one if none exists
    let lanePackets = this.h3Packets[1];
    let midPacket = lanePackets.find(p => p.pos >= 25 && p.pos <= 65);
    if (!midPacket && lanePackets.length > 0) {
      midPacket = lanePackets[Math.floor(lanePackets.length / 2)];
    }

    if (!midPacket) {
      midPacket = {
        id: Date.now() + Math.random(),
        lane: 1,
        pos: 40,
        color: this.streamColors[1],
        name: this.streamNames[1],
        element: null,
        isLost: false
      };
      this.h3Packets[1].push(midPacket);
      this.renderH3Packet(midPacket);
    }

    midPacket.isLost = true;
    if (midPacket.element) {
      midPacket.element.classList.add('lost-packet');
      midPacket.element.innerHTML = '<span>❌ DROP</span>';
    }

    // Automatically recover Stream 2 after 2.5 seconds
    this.h3Timeout = setTimeout(() => {
      if (midPacket && midPacket.element) {
        midPacket.isLost = false;
        midPacket.element.classList.remove('lost-packet');
        midPacket.element.innerHTML = '<span>S2</span>';
      }
      this.h3BlockedLane = null;
      this.h3Timeout = null;
      if (statusEl) {
        statusEl.className = 'sim-status normal';
        statusEl.innerHTML = '<i class="fa-solid fa-diagram-project"></i> 3 Bağımsız QUIC UDP Şeridi Normal Çalışıyor';
      }
    }, 2500);
  }

  resetSimulation() {
    this.h2Blocked = false;
    this.h3BlockedLane = null;
    if (this.h3Timeout) {
      clearTimeout(this.h3Timeout);
      this.h3Timeout = null;
    }

    // Clear H2
    this.h2Packets.forEach(p => p.element && p.element.remove());
    this.h2Packets = [];

    // Clear H3
    for (let lane = 0; lane < 3; lane++) {
      this.h3Packets[lane].forEach(p => p.element && p.element.remove());
      this.h3Packets[lane] = [];
    }

    const h2Status = document.getElementById('h2-status');
    if (h2Status) {
      h2Status.className = 'sim-status normal';
      h2Status.innerHTML = '<i class="fa-solid fa-network-wire"></i> Tek TCP Kanalı Normal Çalışıyor';
    }

    const h3Status = document.getElementById('h3-status');
    if (h3Status) {
      h3Status.className = 'sim-status normal';
      h3Status.innerHTML = '<i class="fa-solid fa-diagram-project"></i> 3 Bağımsız QUIC UDP Şeridi Normal Çalışıyor';
    }
  }

  updateH3Lane(lane) {
    const isLaneStalled = (this.h3BlockedLane === lane);
    const lanePackets = this.h3Packets[lane];
    const minGap = 12; // percentage gap between queued packets

    // Sort packets by position descending (front-most to back-most)
    const sortedPackets = [...lanePackets].sort((a, b) => b.pos - a.pos);

    for (let i = 0; i < sortedPackets.length; i++) {
      const p = sortedPackets[i];
      let canMove = true;
      let targetMaxPos = 92;

      if (isLaneStalled) {
        if (p.isLost) {
          canMove = false;
        } else if (i > 0) {
          // Check if any packet ahead of p is stalled or cannot reach 92
          const aheadP = sortedPackets[i - 1];
          if (aheadP.isLost || aheadP.pos < 90) {
            targetMaxPos = aheadP.pos - minGap;
          }
        }
      }

      if (canMove) {
        const nextPos = p.pos + this.speed * 0.4;
        if (isLaneStalled && nextPos > targetMaxPos) {
          p.pos = Math.max(p.pos, targetMaxPos);
        } else {
          p.pos = nextPos;
        }
      }

      if (p.element) {
        p.element.style.left = `${p.pos}%`;
      }
    }

    // Remove packets that reached end (pos >= 92)
    for (let i = lanePackets.length - 1; i >= 0; i--) {
      const p = lanePackets[i];
      if (p.pos >= 92) {
        if (p.element) p.element.remove();
        lanePackets.splice(i, 1);
      }
    }
  }

  loop() {
    // Update HTTP/2
    if (!this.h2Blocked) {
      for (let i = this.h2Packets.length - 1; i >= 0; i--) {
        const p = this.h2Packets[i];
        p.pos += this.speed * 0.4;
        if (p.element) {
          p.element.style.left = `${p.pos}%`;
        }
        if (p.pos >= 92) {
          p.element && p.element.remove();
          this.h2Packets.splice(i, 1);
        }
      }
    }

    // Update HTTP/3
    for (let lane = 0; lane < 3; lane++) {
      this.updateH3Lane(lane);
    }

    this.animFrame = requestAnimationFrame(() => this.loop());
  }
}

// Global instance
window.protoSim = new ProtocolSimulator();
document.addEventListener('DOMContentLoaded', () => {
  window.protoSim.init();
});
