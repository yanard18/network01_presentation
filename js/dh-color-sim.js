/* Interactive Diffie-Hellman Key Exchange Paint Color Analogy Simulator */

class DHColorSimulator {
  constructor() {
    this.currentStep = 0;

    this.steps = [
      {
        id: 'step_0',
        title: 'Step 1: Public Agreement (Common Color)',
        badge: 'PUBLIC COLOR',
        color: '#ffb703',
        aliceBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Alice (Client)</div>
          <div style="background: #ffb703; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; box-shadow: 0 0 10px #ffb70388;">
            Public Yellow
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">Publicly agreed starting color (e.g. g and p prime).</div>
        `,
        eveBox: `
          <div style="font-weight: 700; color: var(--accent-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-eye"></i> Eavesdropper (Eve)</div>
          <div style="font-size: 0.78rem; color: var(--text-main);">Eve sees: <span style="color: #ffb703; font-weight: 700;">Public Yellow</span></div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">Public data is visible to anyone on the network.</div>
        `,
        bobBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Bob (Server)</div>
          <div style="background: #ffb703; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; box-shadow: 0 0 10px #ffb70388;">
            Public Yellow
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">Publicly agreed starting color (e.g. g and p prime).</div>
        `,
        details: 'Alice and Bob publicly agree on a starting common color (Yellow). This number is completely public.'
      },
      {
        id: 'step_1',
        title: 'Step 2: Private Secret Selection',
        badge: 'PRIVATE SECRETS',
        color: '#ff2e63',
        aliceBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Alice (Client)</div>
          <div style="background: #ff2e63; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; box-shadow: 0 0 10px #ff2e6388;">
            Secret Red
          </div>
          <div style="font-size: 0.75rem; color: var(--accent-red); margin-top: 0.4rem;">Alice picks a secret private color (e.g. secret 'x').</div>
        `,
        eveBox: `
          <div style="font-weight: 700; color: var(--accent-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-eye-slash"></i> Eavesdropper (Eve)</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Eve knows: <strong>UNKNOWN (?)</strong></div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">Private colors never leave the local CPU!</div>
        `,
        bobBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Bob (Server)</div>
          <div style="background: #2de2e6; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; box-shadow: 0 0 10px #2de2e688;">
            Secret Cyan
          </div>
          <div style="font-size: 0.75rem; color: var(--accent-cyan); margin-top: 0.4rem;">Bob picks a secret private color (e.g. secret 'y').</div>
        `,
        details: 'Alice and Bob each select a secret private color (Alice picks Red, Bob picks Cyan). Neither reveals their private secret!'
      },
      {
        id: 'step_2',
        title: 'Step 3: Mix Public + Private Colors',
        badge: 'PAINT MIXTURE',
        color: '#9d4edd',
        aliceBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Alice's Mixture</div>
          <div style="background: #ff7b00; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; box-shadow: 0 0 10px #ff7b0088;">
            Orange (Yellow + Red)
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">Calculates public parameter: <code>e = g^x mod p</code></div>
        `,
        eveBox: `
          <div style="font-weight: 700; color: var(--accent-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-flask"></i> Mixing Math</div>
          <div style="font-size: 0.78rem; color: var(--text-main);">One-way math function (Discrete Logarithm Problem).</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">Easy to mix, practically impossible to un-mix!</div>
        `,
        bobBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Bob's Mixture</div>
          <div style="background: #00b4d8; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; box-shadow: 0 0 10px #00b4d888;">
            Greenish Blue (Yellow + Cyan)
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">Calculates public parameter: <code>f = g^y mod p</code></div>
        `,
        details: 'Both sides mix their Secret private color with the Public Yellow starting color to produce a new mixed color.'
      },
      {
        id: 'step_3',
        title: 'Step 4: Public Exchange over Network',
        badge: 'NETWORK EXCHANGE',
        color: '#2de2e6',
        aliceBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Alice Sends Orange</div>
          <div style="font-size: 0.8rem; color: var(--accent-cyan);">Alice ━━━ Orange ━━━► Bob</div>
          <div style="background: #ff7b00; height: 35px; border-radius: 4px; margin-top: 0.4rem; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff;">
            Transmitting Orange
          </div>
        `,
        eveBox: `
          <div style="font-weight: 700; color: var(--accent-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-user-secret"></i> Eve Intercepts</div>
          <div style="font-size: 0.78rem; color: var(--text-main);">Eve sees: <span style="color: #ff7b00; font-weight: 700;">Orange</span> &amp; <span style="color: #00b4d8; font-weight: 700;">Green-Blue</span></div>
          <div style="font-size: 0.72rem; color: var(--accent-red); margin-top: 0.3rem;">Eve cannot un-mix Orange to discover Alice's Secret Red!</div>
        `,
        bobBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Bob Sends Green-Blue</div>
          <div style="font-size: 0.8rem; color: var(--htb-green);">Alice ◄━━━ Green-Blue ━━━ Bob</div>
          <div style="background: #00b4d8; height: 35px; border-radius: 4px; margin-top: 0.4rem; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff;">
            Transmitting Green-Blue
          </div>
        `,
        details: 'Alice sends Orange to Bob. Bob sends Green-Blue to Alice. Eve captures both mixtures, but cannot separate the original private colors!'
      },
      {
        id: 'step_4',
        title: 'Step 5: Compute Identical Shared Secret Key!',
        badge: 'SHARED SECRET KEY',
        color: '#9FEF00',
        aliceBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Alice Adds Secret Red</div>
          <div style="background: #8b5a2b; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; box-shadow: 0 0 14px #9FEF00;">
            🟤 Secret Brown (Key K)
          </div>
          <div style="font-size: 0.75rem; color: var(--htb-green); margin-top: 0.4rem;">(Bob's Green-Blue + Secret Red)</div>
        `,
        eveBox: `
          <div style="font-weight: 700; color: var(--accent-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-lock"></i> Eve is Blocked!</div>
          <div style="font-size: 0.78rem; color: var(--accent-red); font-weight: 700;">Eve CANNOT create Secret Brown!</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">Eve lacks Secret Red and Secret Cyan.</div>
        `,
        bobBox: `
          <div style="font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Bob Adds Secret Cyan</div>
          <div style="background: #8b5a2b; height: 50px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; box-shadow: 0 0 14px #9FEF00;">
            🟤 Secret Brown (Key K)
          </div>
          <div style="font-size: 0.75rem; color: var(--htb-green); margin-top: 0.4rem;">(Alice's Orange + Secret Cyan)</div>
        `,
        details: 'Alice adds her Secret Red to Bob\'s mixture. Bob adds his Secret Cyan to Alice\'s mixture. Both obtain the exact same Secret Brown color (Symmetric Key K)!'
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
document.addEventListener('DOMContentLoaded', () => {
  if (window.dhColorSim) window.dhColorSim.setStep(0);
});
