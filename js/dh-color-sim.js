/* Interactive Diffie-Hellman Key Exchange Paint Color Analogy Simulator */

class DHColorSimulator {
  constructor() {
    this.currentStep = 0;

    this.steps = [
      {
        id: 'step_0',
        title: 'Step 1: Public Anlaşma (Ortak Renk)',
        badge: 'PUBLIC COLOR',
        color: '#ffb703',
        aliceBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Alice (Client)</div>
          <div style="background: #ffb703; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; box-shadow: 0 0 10px #ffb70388;">
            Public Sarı
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">Herkese açık anlaşılan başlangıç rengi (ör. g ve p prime).</div>
        `,
        eveBox: `
          <div style="font-weight: 700; color: var(--accent-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-eye"></i> Dinleyici (Eavesdropper - Eve)</div>
          <div style="font-size: 0.78rem; color: var(--text-main);">Eve şunları görür: <span style="color: #ffb703; font-weight: 700;">Public Sarı</span></div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">Public veriler ağdaki (network) herkes tarafından görülebilir.</div>
        `,
        bobBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Bob (Server)</div>
          <div style="background: #ffb703; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; box-shadow: 0 0 10px #ffb70388;">
            Public Sarı
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">Herkese açık anlaşılan başlangıç rengi (ör. g ve p prime).</div>
        `,
        details: 'Alice ve Bob herkese açık (public) olarak ortak bir başlangıç rengi (Sarı) üzerinde anlaşırlar. Bu sayı tamamen public\'tir.'
      },
      {
        id: 'step_1',
        title: 'Step 2: Private (Gizli) Renk Seçimi',
        badge: 'PRIVATE SECRETS',
        color: '#ff2e63',
        aliceBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Alice (Client)</div>
          <div style="background: #ff2e63; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; box-shadow: 0 0 10px #ff2e6388;">
            Secret Kırmızı
          </div>
          <div style="font-size: 0.75rem; color: var(--accent-red); margin-top: 0.4rem;">Alice, gizli (secret) bir private renk seçer (ör. gizli 'x').</div>
        `,
        eveBox: `
          <div style="font-weight: 700; color: var(--accent-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-eye-slash"></i> Dinleyici (Eavesdropper - Eve)</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Eve'in bildiği: <strong>BİLİNMİYOR (?)</strong></div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">Private renkler yerel CPU'dan asla dışarı çıkmaz!</div>
        `,
        bobBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Bob (Server)</div>
          <div style="background: #2de2e6; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; box-shadow: 0 0 10px #2de2e688;">
            Secret Cyan
          </div>
          <div style="font-size: 0.75rem; color: var(--accent-cyan); margin-top: 0.4rem;">Bob, gizli (secret) bir private renk seçer (ör. gizli 'y').</div>
        `,
        details: 'Alice ve Bob\'un her biri gizli (secret) bir private renk seçer (Alice Kırmızı, Bob Cyan seçer). Hiçbiri kendi private sırrını açıklamaz!'
      },
      {
        id: 'step_2',
        title: 'Step 3: Public + Private Renkleri Karıştırma',
        badge: 'PAINT MIXTURE',
        color: '#9d4edd',
        aliceBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Alice'in Karışımı</div>
          <div style="background: #ff7b00; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; box-shadow: 0 0 10px #ff7b0088;">
            Turuncu (Sarı + Kırmızı)
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">Public parametreyi hesaplar: <code>e = g^x mod p</code></div>
        `,
        eveBox: `
          <div style="font-weight: 700; color: var(--accent-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-flask"></i> Karıştırma Matematiği</div>
          <div style="font-size: 0.78rem; color: var(--text-main);">Tek yönlü matematik fonksiyonu (Discrete Logarithm Problem).</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">Karıştırması kolay, ayrıştırması pratik olarak imkansızdır!</div>
        `,
        bobBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Bob'un Karışımı</div>
          <div style="background: #00b4d8; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; box-shadow: 0 0 10px #00b4d888;">
            Yeşil-Mavi (Sarı + Cyan)
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">Public parametreyi hesaplar: <code>f = g^y mod p</code></div>
        `,
        details: 'Her iki taraf da yeni bir karışım rengi üretmek için kendi Secret (gizli) private rengini Public Sarı başlangıç rengi ile karıştırır.'
      },
      {
        id: 'step_3',
        title: 'Step 4: Ağ (Network) Üzerinden Public Takas',
        badge: 'NETWORK EXCHANGE',
        color: '#2de2e6',
        aliceBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Alice Turuncu Gönderir</div>
          <div style="font-size: 0.8rem; color: var(--accent-cyan);">Alice ━━━ Turuncu ━━━► Bob</div>
          <div style="background: #ff7b00; height: 35px; border-radius: 4px; margin-top: 0.4rem; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff;">
            Turuncu İletiliyor (Transmitting)
          </div>
        `,
        eveBox: `
          <div style="font-weight: 700; color: var(--accent-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-user-secret"></i> Eve Araya Giriyor (Intercepts)</div>
          <div style="font-size: 0.78rem; color: var(--text-main);">Eve şunları görür: <span style="color: #ff7b00; font-weight: 700;">Turuncu</span> &amp; <span style="color: #00b4d8; font-weight: 700;">Yeşil-Mavi</span></div>
          <div style="font-size: 0.72rem; color: var(--accent-red); margin-top: 0.3rem;">Eve, Alice'in Secret Kırmızı rengini bulmak için Turuncu rengini ayrıştıramaz!</div>
        `,
        bobBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Bob Yeşil-Mavi Gönderir</div>
          <div style="font-size: 0.8rem; color: var(--htb-green);">Alice ◄━━━ Yeşil-Mavi ━━━ Bob</div>
          <div style="background: #00b4d8; height: 35px; border-radius: 4px; margin-top: 0.4rem; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff;">
            Yeşil-Mavi İletiliyor (Transmitting)
          </div>
        `,
        details: 'Alice, Turuncu rengini Bob\'a gönderir. Bob, Yeşil-Mavi rengini Alice\'e gönderir. Eve her iki karışımı da ele geçirir (captures), ancak orijinal private renkleri ayıramaz!'
      },
      {
        id: 'step_4',
        title: 'Step 5: Ortak Gizli Anahtarı (Shared Secret Key) Hesaplama!',
        badge: 'SHARED SECRET KEY',
        color: '#9FEF00',
        aliceBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Alice Secret Kırmızı Ekler</div>
          <div style="background: #8b5a2b; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; box-shadow: 0 0 14px #9FEF00;">
            🟤 Secret Kahverengi (Key K)
          </div>
          <div style="font-size: 0.75rem; color: var(--htb-green); margin-top: 0.4rem;">(Bob'un Yeşil-Mavisi + Secret Kırmızı)</div>
        `,
        eveBox: `
          <div style="font-weight: 700; color: var(--accent-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-lock"></i> Eve Engellendi!</div>
          <div style="font-size: 0.78rem; color: var(--accent-red); font-weight: 700;">Eve, Secret Kahverengi rengini OLUŞTURAMAZ!</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">Eve'de Secret Kırmızı ve Secret Cyan renkleri eksiktir.</div>
        `,
        bobBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Bob Secret Cyan Ekler</div>
          <div style="background: #8b5a2b; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; box-shadow: 0 0 14px #9FEF00;">
            🟤 Secret Kahverengi (Key K)
          </div>
          <div style="font-size: 0.75rem; color: var(--htb-green); margin-top: 0.4rem;">(Alice'in Turuncusu + Secret Cyan)</div>
        `,
        details: 'Alice kendi Secret Kırmızı rengini Bob\'un karışımına ekler. Bob da kendi Secret Cyan rengini Alice\'in karışımına ekler. Her ikisi de tam olarak aynı Secret Kahverengi rengini (Symmetric Key K) elde eder!'
      }
    ];
  }

  setStep(index) {
    if (index < 0) index = 0;
    if (index >= this.steps.length) index = this.steps.length - 1;
    this.currentStep = index;
    this.updateUI();
  }

  updateUI() {
    const step = this.steps[this.currentStep];
    if (!step) return;

    for (let i = 0; i < this.steps.length; i++) {
      const btn = document.getElementById(`dh-step-btn-${i}`);
      if (btn) {
        if (i === this.currentStep) {
          btn.style.background = step.color;
          btn.style.color = '#000000';
          btn.style.boxShadow = `0 0 14px ${step.color}`;
          btn.style.borderColor = step.color;
        } else {
          btn.style.background = 'var(--htb-bg-card)';
          btn.style.color = 'var(--text-main)';
          btn.style.boxShadow = 'none';
          btn.style.borderColor = 'var(--htb-border)';
        }
      }
    }

    const titleEl = document.getElementById('dh-os-step-title');
    const badgeEl = document.getElementById('dh-os-step-badge');
    const aliceBoxEl = document.getElementById('dh-alice-box');
    const eveBoxEl = document.getElementById('dh-eve-box');
    const bobBoxEl = document.getElementById('dh-bob-box');
    const detailsEl = document.getElementById('dh-step-details');

    if (titleEl) titleEl.innerText = step.title;
    if (badgeEl) {
      badgeEl.innerText = step.badge;
      badgeEl.style.borderColor = step.color;
      badgeEl.style.color = step.color;
    }
    if (aliceBoxEl) aliceBoxEl.innerHTML = step.aliceBox;
    if (eveBoxEl) eveBoxEl.innerHTML = step.eveBox;
    if (bobBoxEl) bobBoxEl.innerHTML = step.bobBox;
    if (detailsEl) detailsEl.innerText = step.details;
  }
}

// Instantiate globally
window.dhColorSim = new DHColorSimulator();
setTimeout(() => {
  if (window.dhColorSim) window.dhColorSim.setStep(0);
}, 100);
