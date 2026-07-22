/* Interactive OSI Data Encapsulation Visualizer */

class EncapsulationSimulator {
  constructor() {
    this.currentStep = 0;
    this.autoPlayInterval = null;

    this.steps = [
      {
        layerNum: 7,
        layerName: 'Katman 7: Uygulama (Application)',
        pduName: 'Data (Veri)',
        badge: 'L7 DATA',
        color: '#9FEF00',
        details: 'Kullanıcı verisi oluşturulur (Örn: HTTP GET /index.html isteği, SSH oturum komutu veya e-posta verisi).',
        payloadHtml: '<div class="pdu-block pdu-data"><span>DATA (Uygulama İsteği / Payload)</span></div>'
      },
      {
        layerNum: 6,
        layerName: 'Katman 6: Sunum (Presentation)',
        pduName: 'Data (Veri)',
        badge: 'L6 PRESENTATION',
        color: '#2de2e6',
        details: 'Veri uygun formata dönüştürülür, sıkıştırılır ve gerekiyorsa şifrelenir (TLS/SSL, JSON, ASCII Encoding).',
        payloadHtml: '<div class="pdu-block pdu-pres"><span>[SSL/TLS Şifreleme]</span></div><div class="pdu-block pdu-data"><span>DATA</span></div>'
      },
      {
        layerNum: 5,
        layerName: 'Katman 5: Oturum (Session)',
        pduName: 'Data (Veri)',
        badge: 'L5 SESSION',
        color: '#3b82f6',
        details: 'İstemci ve sunucu arasındaki oturum diyaloğu başlatılır ve yönetilir (Session Token / Port Eşleşmesi).',
        payloadHtml: '<div class="pdu-block pdu-sess"><span>[Session Header / ID]</span></div><div class="pdu-block pdu-data"><span>DATA</span></div>'
      },
      {
        layerNum: 4,
        layerName: 'Katman 4: Taşıma (Transport)',
        pduName: 'Segment (TCP) / Datagram (UDP)',
        badge: 'L4 SEGMENT',
        color: '#a855f7',
        details: 'TCP veya UDP başlığı (Header) eklenir. Kaynak ve Hedef Port numaraları belirlenir (Örn: Src: 51234, Dst: 443).',
        payloadHtml: '<div class="pdu-block pdu-tcp"><span>TCP Header (Port 443 | Seq#)</span></div><div class="pdu-block pdu-data"><span>DATA</span></div>'
      },
      {
        layerNum: 3,
        layerName: 'Katman 3: Ağ (Network)',
        pduName: 'Packet (Paket)',
        badge: 'L3 PACKET',
        color: '#ffb703',
        details: 'IP Başlığı eklenir. Mantıksal adresleme yapılır (Kaynak IP: 192.168.1.50, Hedef IP: 10.0.0.1, TTL, Protokol ID).',
        payloadHtml: '<div class="pdu-block pdu-ip"><span>IP Header (Src/Dst IP)</span></div><div class="pdu-block pdu-tcp"><span>TCP Header</span></div><div class="pdu-block pdu-data"><span>DATA</span></div>'
      },
      {
        layerNum: 2,
        layerName: 'Katman 2: Veri Bağlantısı (Data Link)',
        pduName: 'Frame (Çerçeve)',
        badge: 'L2 FRAME',
        color: '#ff2e63',
        details: 'Ethernet MAC başlığı (Src/Dst MAC) eklenir ve paketin sonuna Hata Kontrol Kodu (FCS - Frame Check Sequence) yapıştırılır.',
        payloadHtml: '<div class="pdu-block pdu-mac"><span>Ethernet Header (MAC)</span></div><div class="pdu-block pdu-ip"><span>IP Header</span></div><div class="pdu-block pdu-tcp"><span>TCP Header</span></div><div class="pdu-block pdu-data"><span>DATA</span></div><div class="pdu-block pdu-fcs"><span>FCS Trailer</span></div>'
      },
      {
        layerNum: 1,
        layerName: 'Katman 1: Fiziksel (Physical)',
        pduName: 'Bits (Bit Akışı)',
        badge: 'L1 BITS',
        color: '#00f5d4',
        details: 'Hazırlanan Çerçeve (Frame) tamamen 0 ve 1 elektrik/ışık/radyo sinyallerine dönüştürülerek fiziksel ortama aktarılır.',
        payloadHtml: '<div class="pdu-block pdu-bits"><span>01001000 01110100 01110100 01110000 01110011 00111010 00101111 00101111</span></div>'
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
      }, 1900);
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

    if (titleEl) titleEl.innerText = step.layerName;
    if (badgeEl) {
      badgeEl.innerText = step.badge;
      badgeEl.style.borderColor = step.color;
      badgeEl.style.color = step.color;
    }
    if (pduTypeEl) pduTypeEl.innerText = `PDU Türü: ${step.pduName}`;
    if (detailsEl) detailsEl.innerText = step.details;
    if (counterEl) counterEl.innerText = `Adım ${this.currentStep + 1} / 7`;
  }
}

// Instantiate globally
window.osiEncSim = new EncapsulationSimulator();
document.addEventListener('DOMContentLoaded', () => {
  window.osiEncSim.init();
});
