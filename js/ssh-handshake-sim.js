/* Interactive SSH Handshake & Cryptographic State Simulator */

class SSHHandshakeSimulator {
  constructor() {
    this.currentStep = 0;

    this.steps = [
      // PHASE 1: ESTABLISHING SECURE COMMUNICATION
      {
        id: 'tcp_setup',
        phase: 1,
        title: 'Step 1: TCP Connection Setup',
        badge: 'PHASE 1: TCP HANDSHAKE',
        color: '#2de2e6',
        clientMsg: 'TCP SYN (Port 22)',
        serverMsg: 'TCP SYN-ACK',
        osComponent: 'Transport Layer (TCP / Port 22)',
        visualGraphicHtml: `
          <div style="background: rgba(45, 226, 230, 0.08); border: 1px solid var(--accent-cyan); border-radius: 8px; padding: 0.8rem; text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 0.3rem; color: var(--accent-cyan);"><i class="fa-solid fa-plug"></i> <i class="fa-solid fa-arrow-right-arrow-left"></i> <i class="fa-solid fa-server"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">TCP 3-Way Handshake Established</div>
            <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-cyan); margin-top: 0.2rem;">Raw Socket Connected to <code>192.168.1.50:22</code></div>
          </div>
        `,
        osDetails: 'SSH utilizes TCP at the Transport Layer. Before any SSH protocol messaging begins, standard TCP SYN ➔ SYN-ACK ➔ ACK completes.',
        kernelLog: `[TCP] SYN sent to 192.168.1.50:22 (Seq=0)
[TCP] SYN-ACK received from 192.168.1.50:22
[TCP] ACK sent (Connection ESTABLISHED)`
      },
      {
        id: 'version_exchange',
        phase: 1,
        title: 'Step 2: SSH Version Verification',
        badge: 'PHASE 1: VERSION EXCHANGE',
        color: '#2de2e6',
        clientMsg: 'SSH-2.0-OpenSSH_9.0',
        serverMsg: 'SSH-2.0-OpenSSH_8.9p1 Ubuntu',
        osComponent: 'OpenSSH Banner Negotiator',
        visualGraphicHtml: `
          <div style="background: rgba(45, 226, 230, 0.08); border: 1px solid var(--accent-cyan); border-radius: 8px; padding: 0.8rem; text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 0.3rem; color: var(--accent-cyan);"><i class="fa-solid fa-code-compare"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">Agreed Protocol Version: SSH-2.0</div>
            <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-cyan); margin-top: 0.2rem;">Client & Server exchange software identification strings.</div>
          </div>
        `,
        osDetails: 'Client and server exchange plain text identification strings to agree on protocol version 2.0 (SSH-1.x rejected for insecurity).',
        kernelLog: `[SSH] Sent Client Identification: SSH-2.0-OpenSSH_9.0
[SSH] Received Server Identification: SSH-2.0-OpenSSH_8.9p1
[SSH] Selected Protocol Version: SSH-2.0`
      },
      {
        id: 'kex_init',
        phase: 1,
        title: 'Step 3: Algorithm Negotiation (KEXINIT)',
        badge: 'PHASE 1: KEXINIT',
        color: '#2de2e6',
        clientMsg: 'SSH_MSG_KEXINIT (Offered Ciphers & MACs)',
        serverMsg: 'SSH_MSG_KEXINIT (Selected Cipher Suite)',
        osComponent: 'Crypto Engine (Cipher & Key Exchange Selection)',
        visualGraphicHtml: `
          <div style="background: rgba(45, 226, 230, 0.08); border: 1px solid var(--accent-cyan); border-radius: 8px; padding: 0.8rem; text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 0.3rem; color: var(--accent-cyan);"><i class="fa-solid fa-sliders"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">Cipher Suite Agreed</div>
            <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-cyan); margin-top: 0.2rem;">KEX: <code>curve25519-sha256</code> | Cipher: <code>chacha20-poly1305</code></div>
          </div>
        `,
        osDetails: 'Both sides exchange supported algorithms lists for Key Exchange, Server Host Keys, Symmetric Ciphers, and MAC integrity.',
        kernelLog: `[KEX] Client sent SSH_MSG_KEXINIT (List of 12 algorithms)
[KEX] Server selected KEX: curve25519-sha256
[KEX] Server selected Cipher: chacha20-poly1305@openssh.com`
      },
      {
        id: 'diffie_hellman',
        phase: 1,
        title: 'Step 4: Diffie-Hellman Key Exchange',
        badge: 'PHASE 1: KEX (DH MATH)',
        color: '#9d4edd',
        clientMsg: 'SSH_MSG_KEXDH_INIT (Client Public Parameter e)',
        serverMsg: 'SSH_MSG_KEXDH_REPLY (Server Parameter f)',
        osComponent: 'Diffie-Hellman Math Engine',
        visualGraphicHtml: `
          <div style="background: rgba(157, 78, 221, 0.08); border: 1px solid var(--accent-purple); border-radius: 8px; padding: 0.8rem; text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 0.3rem; color: var(--accent-purple);"><i class="fa-solid fa-calculator"></i> <i class="fa-solid fa-key"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">Shared Secret Derived (K)</div>
            <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-purple); margin-top: 0.2rem;">Symmetric Key calculated locally without crossing the wire!</div>
          </div>
        `,
        osDetails: 'Using Diffie-Hellman math, both sides independently calculate the identical shared secret key (K) without ever sending it over the network.',
        kernelLog: `[KEX] Client generated DH Private Key 'x' and Public 'e'
[KEX] Sent SSH_MSG_KEXDH_INIT (e = g^x mod p)
[KEX] Received Server Public 'f' -> Computed Shared Secret K = f^x mod p`
      },
      {
        id: 'server_auth',
        phase: 1,
        title: 'Step 5: Server Host Key Authentication',
        badge: 'PHASE 1: MITM DEFENSE',
        color: '#ffb703',
        clientMsg: 'Verifies Host Signature against ~/.ssh/known_hosts',
        serverMsg: 'Sends Host Public Key + Digital Signature over DH Hash',
        osComponent: 'Host Key Verification (ssh_host_rsa_key)',
        visualGraphicHtml: `
          <div style="background: rgba(255, 183, 3, 0.08); border: 1px solid var(--accent-yellow); border-radius: 8px; padding: 0.8rem; text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 0.3rem; color: var(--accent-yellow);"><i class="fa-solid fa-building-shield"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">Server Identity Verified (known_hosts)</div>
            <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-yellow); margin-top: 0.2rem;">Host Key Signature verified! MitM attack prevented.</div>
          </div>
        `,
        osDetails: 'Server signs the DH hash using its Host Private Key (/etc/ssh/ssh_host_rsa_key). Client verifies signature against its ~/.ssh/known_hosts file.',
        kernelLog: `[HostAuth] Server sent Host Public Key (SHA256:4a9f...)
[HostAuth] Server sent Digital Signature over Exchange Hash H
[HostAuth] Client matched fingerprint in ~/.ssh/known_hosts -> VERIFIED`
      },
      {
        id: 'tunnel_established',
        phase: 1,
        title: 'Step 6: Encrypted Tunnel Established',
        badge: 'PHASE 1: ENCRYPTED TUNNEL',
        color: '#9FEF00',
        clientMsg: 'SSH_MSG_NEWKEYS (Enable Symmetric Encryption)',
        serverMsg: 'SSH_MSG_NEWKEYS (Symmetric Encryption Active)',
        osComponent: 'Symmetric Encryption Engine (AES-256-GCM)',
        visualGraphicHtml: `
          <div style="background: rgba(159, 239, 0, 0.08); border: 1px solid var(--htb-green); border-radius: 8px; padding: 0.8rem; text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 0.3rem; color: var(--htb-green);"><i class="fa-solid fa-lock"></i> <i class="fa-solid fa-shield-halved"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">Encrypted Tunnel Active</div>
            <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--htb-green); margin-top: 0.2rem;">All subsequent packets are 100% encrypted over TCP 22.</div>
          </div>
        `,
        osDetails: 'Both sides switch to the derived Symmetric Session Key. From this exact moment, all network traffic is encrypted and tamper-proof.',
        kernelLog: `[Security] Sent SSH_MSG_NEWKEYS (Key Activation)
[Security] Received SSH_MSG_NEWKEYS from Server
[State] ENCRYPTED TUNNEL ACTIVE (Symmetric Cipher: ChaCha20-Poly1305)`
      },

      // PHASE 2: USER AUTHENTICATION
      {
        id: 'userauth_req',
        phase: 2,
        title: 'Step 7: User Auth Request (Public Key)',
        badge: 'PHASE 2: USER AUTH REQ',
        color: '#ff2e63',
        clientMsg: 'SSH_MSG_USERAUTH_REQUEST (User: alice, PubKey: id_rsa.pub)',
        serverMsg: 'Server checks if User Public Key exists in authorized_keys',
        osComponent: 'User Authentication Manager',
        visualGraphicHtml: `
          <div style="background: rgba(255, 46, 99, 0.08); border: 1px solid var(--accent-red); border-radius: 8px; padding: 0.8rem; text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 0.3rem; color: var(--accent-red);"><i class="fa-solid fa-user-key"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">User Auth Request: alice</div>
            <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-red); margin-top: 0.2rem;">Offers User Public Key (<code>~/.ssh/id_rsa.pub</code>)</div>
          </div>
        `,
        osDetails: 'Client requests authentication for user "alice" inside the encrypted tunnel, presenting the client User Public Key (~/.ssh/id_rsa.pub).',
        kernelLog: `[UserAuth] Sent SSH_MSG_USERAUTH_REQUEST (User: alice)
[UserAuth] Service: ssh-connection | Method: publickey
[UserAuth] Offered Public Key Fingerprint: SHA256:b891a...`
      },
      {
        id: 'authorized_keys_check',
        phase: 2,
        title: 'Step 8: Server Check (authorized_keys)',
        badge: 'PHASE 2: AUTHORIZED_KEYS',
        color: '#ff2e63',
        clientMsg: 'Awaits Server Challenge Query',
        serverMsg: 'Matches key against /home/alice/.ssh/authorized_keys',
        osComponent: 'sshd File Verification (/home/user/.ssh/authorized_keys)',
        visualGraphicHtml: `
          <div style="background: rgba(255, 46, 99, 0.08); border: 1px solid var(--accent-red); border-radius: 8px; padding: 0.8rem; text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 0.3rem; color: var(--accent-red);"><i class="fa-solid fa-file-shield"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">Public Key Found in authorized_keys</div>
            <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-red); margin-top: 0.2rem;">Server prepares Challenge to prove client holds Private Key!</div>
          </div>
        `,
        osDetails: 'Server opens /home/alice/.ssh/authorized_keys. Finds matching public key and prepares a random challenge string.',
        kernelLog: `[sshd] Reading /home/alice/.ssh/authorized_keys
[sshd] Found matching public key entry for 'alice@laptop'
[sshd] Key authorized! Initiating Challenge-Response verification.`
      },
      {
        id: 'challenge_response',
        phase: 2,
        title: 'Step 9: Challenge-Response Signature',
        badge: 'PHASE 2: CHALLENGE-RESPONSE',
        color: '#ff2e63',
        clientMsg: 'Signs Challenge with User Private Key (~/.ssh/id_rsa)',
        serverMsg: 'Verifies Signature using User Public Key',
        osComponent: 'Digital Signature Engine (id_rsa)',
        visualGraphicHtml: `
          <div style="background: rgba(255, 46, 99, 0.08); border: 1px solid var(--accent-red); border-radius: 8px; padding: 0.8rem; text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 0.3rem; color: var(--accent-red);"><i class="fa-solid fa-signature"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">Challenge Signed &amp; Verified</div>
            <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-red); margin-top: 0.2rem;">Client proved ownership of matching <code>~/.ssh/id_rsa</code>!</div>
          </div>
        `,
        osDetails: 'Server sends a random challenge string. Client signs it with its User Private Key (id_rsa). Server verifies signature using user public key.',
        kernelLog: `[Auth] Server sent Auth Challenge String (32 Random Bytes)
[Auth] Client signed challenge with Private Key (~/.ssh/id_rsa)
[Auth] Server verified signature with Public Key -> MATCH CONFIRMED`
      },
      {
        id: 'access_granted',
        phase: 2,
        title: 'Step 10: Server Grants Access',
        badge: 'PHASE 2: ACCESS GRANTED',
        color: '#00f5d4',
        clientMsg: 'SSH_MSG_USERAUTH_SUCCESS -> Request Interactive Shell',
        serverMsg: 'SSH_MSG_USERAUTH_SUCCESS -> PTY Allocated (alice@server)',
        osComponent: 'Session PTY Allocator & Shell Launcher',
        visualGraphicHtml: `
          <div style="background: rgba(0, 245, 212, 0.08); border: 1px solid #00f5d4; border-radius: 8px; padding: 0.8rem; text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 0.3rem; color: #00f5d4;"><i class="fa-solid fa-circle-check"></i> <i class="fa-solid fa-terminal"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">Authentication Successful!</div>
            <div style="font-family: var(--font-mono); font-size: 0.74rem; color: #00f5d4; margin-top: 0.2rem;">Interactive PTY Shell Allocated: <code>alice@192.168.1.50:~$</code></div>
          </div>
        `,
        osDetails: 'Server sends SSH_MSG_USERAUTH_SUCCESS, opens an interactive PTY channel, and spawns the login shell.',
        kernelLog: `[sshd] Received SSH_MSG_USERAUTH_SUCCESS
[sshd] User 'alice' authenticated successfully!
[Shell] Spawning PTY bash session for alice...
[State] INTERACTIVE SHELL READY`
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

    // Highlight Sequence Diagram SVG lines & step buttons
    for (let i = 0; i < this.steps.length; i++) {
      const btn = document.getElementById(`ssh-step-btn-${i}`);
      const lineGroup = document.getElementById(`ssh-svg-step-${i}`);
      
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

      if (lineGroup) {
        if (i === this.currentStep) {
          lineGroup.style.opacity = '1';
          lineGroup.style.filter = `drop-shadow(0 0 6px ${step.color})`;
        } else {
          lineGroup.style.opacity = '0.35';
          lineGroup.style.filter = 'none';
        }
      }
    }

    // Update Right Panel (Visual Windows OS Graphics)
    const titleEl = document.getElementById('ssh-os-step-title');
    const badgeEl = document.getElementById('ssh-os-step-badge');
    const componentEl = document.getElementById('ssh-os-component');
    const graphicContainer = document.getElementById('ssh-os-graphic-box');
    const detailsEl = document.getElementById('ssh-os-details');
    const logEl = document.getElementById('ssh-os-kernel-log');
    const clientMsgEl = document.getElementById('ssh-seq-client-msg');
    const serverMsgEl = document.getElementById('ssh-seq-server-msg');

    if (titleEl) titleEl.innerText = step.title;
    if (badgeEl) {
      badgeEl.innerText = step.badge;
      badgeEl.style.borderColor = step.color;
      badgeEl.style.color = step.color;
    }
    if (componentEl) componentEl.innerText = step.osComponent;
    if (graphicContainer) graphicContainer.innerHTML = step.visualGraphicHtml;
    if (detailsEl) detailsEl.innerText = step.osDetails;
    if (logEl) {
      logEl.innerText = step.kernelLog;
      logEl.style.color = step.color;
    }
    if (clientMsgEl) clientMsgEl.innerText = step.clientMsg;
    if (serverMsgEl) serverMsgEl.innerText = step.serverMsg;
  }
}

// Instantiate globally
window.sshHandshakeSim = new SSHHandshakeSimulator();
document.addEventListener('DOMContentLoaded', () => {
  if (window.sshHandshakeSim) window.sshHandshakeSim.setStep(0);
});
