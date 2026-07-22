/* Interactive OSI Data Encapsulation Visualizer with Live HTTP Data Transformation */

class EncapsulationSimulator {
  constructor() {
    this.currentStep = 0;
    this.autoPlayInterval = null;

    this.steps = [
      {
        layerNum: 7,
        layerName: 'Katman 7: Uygulama (Application)',
        pduName: 'Data',
        badge: 'L7 DATA',
        color: '#9FEF00',
        details: 'Ham HTTP isteği (Application Payload) oluşturulur. Kullanıcı verisi açık metin (plaintext) formatındadır.',
        payloadHtml: '<div class="pdu-block pdu-data"><span>HTTP GET Request Payload</span></div>',
        rawPayloadCode: `GET /api/v1/user HTTP/1.1
Host: target.htb
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...`
      },
      {
        layerNum: 6,
        layerName: 'Katman 6: Sunum (Presentation)',
        pduName: 'Data',
        badge: 'L6 PRESENTATION',
        color: '#2de2e6',
        details: 'Açık metin HTTP isteği TLS 1.3 ile şifrelenir ve binary veriye (Ciphertext) dönüştürülür.',
        payloadHtml: '<div class="pdu-block pdu-pres"><span>🔒 TLS 1.3 Encrypted</span></div><div class="pdu-block pdu-data"><span>HTTP Payload</span></div>',
        rawPayloadCode: `🔒 [TLS 1.3 Encrypted Record Payload]
0x17 0x03 0x03 0x00 0x48 0x9A 0xF2 0x81 0x04 0x11 0xBE 0x90
0x4C 0xD8 0x51 0xA9 0xE4 0x7F 0x30 0xB2 0xC1 0x8D 0x55 0xFA
Ciphertext: a8f912b0394e1d... (AES-256-GCM Encrypted Data)`
      },
      {
        layerNum: 5,
        layerName: 'Katman 5: Oturum (Session)',
        pduName: 'Data',
        badge: 'L5 SESSION',
        color: '#3b82f6',
        details: 'İstemci ve sunucu arasındaki TLS/TCP oturum kimliği (Session ID & Socket Context) bağlanır.',
        payloadHtml: '<div class="pdu-block pdu-sess"><span>Session ID: 0x9F82</span></div><div class="pdu-block pdu-pres"><span>TLS Encrypted</span></div><div class="pdu-block pdu-data"><span>HTTP</span></div>',
        rawPayloadCode: `[Session Context Established]
Session ID: 0x9F82A4B1
State: ESTABLISHED (Keep-Alive)
Socket Pair: 192.168.1.50:51234 <---> 10.0.0.1:443 (HTTPS)
Payload: 🔒 [TLS 1.3 Encrypted Ciphertext]`
      },
      {
        layerNum: 4,
        layerName: 'Katman 4: Taşıma (Transport)',
        pduName: 'Segment (TCP) / Datagram (UDP)',
        badge: 'L4 SEGMENT',
        color: '#a855f7',
        details: 'TCP Başlığı yapıştırılır. Kaynak/Hedef Portlar, Sıra Numarası (Seq) ve Onay (Ack) bilgileri eklenir.',
        payloadHtml: '<div class="pdu-block pdu-tcp"><span>TCP Header (Port 51234 ➔ 443)</span></div><div class="pdu-block pdu-data"><span>TLS Payload</span></div>',
        rawPayloadCode: `[TCP Segment Structure]
Source Port: 51234  --->  Destination Port: 443 (HTTPS)
Sequence Number: 10549201 | Ack Number: 489201
Header Length: 20 bytes | Flags: [ACK, PSH] | Window: 64240
Payload Data: 🔒 [TLS Encrypted HTTP Payload (128 bytes)]`
      },
      {
        layerNum: 3,
        layerName: 'Katman 3: Ağ (Network)',
        pduName: 'Packet (IP Datagram)',
        badge: 'L3 PACKET',
        color: '#ffb703',
        details: 'IP Başlığı eklenir. Mantıksal Kaynak IP ve Hedef IP adresleri ile TTL (Time-To-Live) bilgisi girilir.',
        payloadHtml: '<div class="pdu-block pdu-ip"><span>IP Header (Src: 192.168.1.50 ➔ Dst: 10.0.0.1)</span></div><div class="pdu-block pdu-tcp"><span>TCP Segment</span></div>',
        rawPayloadCode: `[IPv4 Packet Structure]
Version: 4 | Header Length: 20 bytes | TTL: 64 | Protocol: 6 (TCP)
Source IP: 192.168.1.50
Destination IP: 10.0.0.1
Encapsulated Payload: [TCP Segment (Port 51234 -> 443)]`
      },
      {
        layerNum: 2,
        layerName: 'Katman 2: Veri Bağlantısı (Data Link)',
        pduName: 'Frame',
        badge: 'L2 FRAME',
        color: '#ff2e63',
        details: 'Fiziksel MAC adresleri başlığa eklenir. Paketin sonuna 4-byte FCS (Frame Check Sequence) hatasızlık kodu eklenir.',
        payloadHtml: '<div class="pdu-block pdu-mac"><span>ETH Header (MAC)</span></div><div class="pdu-block pdu-ip"><span>IP Header</span></div><div class="pdu-block pdu-tcp"><span>TCP Segment</span></div><div class="pdu-block pdu-fcs"><span>FCS Trailer</span></div>',
        rawPayloadCode: `[Ethernet II Frame Structure]
Destination MAC: 00:11:22:33:44:55 (Gateway Router)
Source MAC:      00:1A:2B:3C:4D:5E (Client NIC)
EtherType:       0x0800 (IPv4)
[Frame Payload]: [IPv4 Packet: 192.168.1.50 -> 10.0.0.1]
Frame Trailer:   FCS 0x8F92A110 (CRC-32 Checksum)`
      },
      {
        layerNum: 1,
        layerName: 'Katman 1: Fiziksel (Physical)',
        pduName: 'Bits',
        badge: 'L1 BITS',
        color: '#00f5d4',
        details: 'Tüm Ethernet Çerçevesi (MAC + IP + TCP + TLS + HTTP) 0 ve 1 fiziksel sinyallerine dönüştürülür.',
        payloadHtml: '<div class="pdu-block pdu-bits"><span>01000111 01000101 01010100 00100000 00101111...</span></div>',
        rawPayloadCode: `⚡ [Physical Bit Stream Output - 1000BASE-T Ethernet]
01000111 01000101 01010100 00100000 00101111 01100001 01110000
01101001 00101111 01110110 00110001 00101111 01110101 01110011
01100101 01110012 00100000 01001000 01010100 01010100 01010000
[Signal Transmission over Copper / Fiber Optic Pulses]`
      }
    ];
  }

  init() {
    this.updateUI();
  }

  setStep(stepIndex) {
    if (stepIndex < 0) stepIndex = 0;
    if (stepIndex >= this.steps.length) stepIndex = this.steps.length - 1;
    this.currentStep = stepIndex;
    this.updateUI();
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      this.currentStep = 0; // Loop back
    }
    this.updateUI();
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateUI();
    }
  }

  toggleAutoPlay() {
    const btn = document.getElementById('enc-autoplay-btn');
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
      if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> Otomatik Adımla';
    } else {
      if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i> Duraklat';
      this.autoPlayInterval = setInterval(() => {
        this.nextStep();
      }, 2200);
    }
  }

  updateUI() {
    const step = this.steps[this.currentStep];
    if (!step) return;

    // Update layer list highlights
    for (let l = 1; l <= 7; l++) {
      const layerEl = document.getElementById(`enc-layer-${l}`);
      if (layerEl) {
        if (l === step.layerNum) {
          layerEl.className = 'enc-layer-row active';
          layerEl.style.borderColor = step.color;
          layerEl.style.boxShadow = `0 0 12px ${step.color}66`;
        } else {
          layerEl.className = 'enc-layer-row';
          layerEl.style.borderColor = '';
          layerEl.style.boxShadow = '';
        }
      }
    }

    // Update PDU Visualizer
    const pduBox = document.getElementById('enc-pdu-visualizer');
    if (pduBox) {
      pduBox.innerHTML = step.payloadHtml;
    }

    // Update Details
    const titleEl = document.getElementById('enc-step-title');
    const badgeEl = document.getElementById('enc-step-badge');
    const pduTypeEl = document.getElementById('enc-pdu-type');
    const detailsEl = document.getElementById('enc-step-details');
    const counterEl = document.getElementById('enc-step-counter');
    const rawCodeEl = document.getElementById('enc-raw-payload-code');

    if (titleEl) titleEl.innerText = step.layerName;
    if (badgeEl) {
      badgeEl.innerText = step.badge;
      badgeEl.style.borderColor = step.color;
      badgeEl.style.color = step.color;
    }
    if (pduTypeEl) pduTypeEl.innerText = `PDU: ${step.pduName}`;
    if (detailsEl) detailsEl.innerText = step.details;
    if (counterEl) counterEl.innerText = `Adım ${this.currentStep + 1} / 7`;
    if (rawCodeEl) {
      rawCodeEl.innerText = step.rawPayloadCode;
      rawCodeEl.style.color = step.color;
    }
  }
}

// Instantiate globally
window.osiEncSim = new EncapsulationSimulator();
document.addEventListener('DOMContentLoaded', () => {
  window.osiEncSim.init();
});
