/* Interactive SMB Connection Lifecycle & Visual Windows OS Graphic Simulator */

class SMBLifecycleSimulator {
  constructor() {
    this.currentStep = 0;

    this.steps = [
      {
        id: 'negotiate',
        title: 'Step 1: SMB2 NEGOTIATE',
        badge: 'NEGOTIATION',
        color: '#2de2e6',
        clientMsg: 'Client Request: SMB2 NEGOTIATE Request (Dialects: 2.02, 2.1, 3.0, 3.1.1)',
        serverMsg: 'Server Response: SMB2 NEGOTIATE Response (Selected Dialect: 0x0311)',
        osComponent: 'mrxsmb.sys / rdbss.sys (Redirector Subsystem)',
        visualGraphicHtml: `
          <div style="background: rgba(45, 226, 230, 0.08); border: 1px solid var(--accent-cyan); border-radius: 8px; padding: 0.9rem; text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 0.4rem; color: var(--accent-cyan);"><i class="fa-solid fa-plug"></i> <i class="fa-solid fa-arrow-right-arrow-left"></i> <i class="fa-solid fa-server"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 700; color: #fff;">TCP/445 Soket Bağlandı (Connected)</div>
            <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-cyan); margin-top: 0.3rem;">Anlaşılan Dialect: <span class="cyber-badge badge-cyan">SMB 3.1.1</span> | Cipher: <span class="cyber-badge badge-cyan">AES-128-GCM</span></div>
          </div>
        `,
        osDetails: 'Windows kernel network redirector sürücüsü TCP soket bağlantısını başlatır ve SMB 3.1.1 özelliklerini ve şifreleme parametrelerini müzakere eder (negotiate).'
      },
      {
        id: 'session_setup',
        title: 'Step 2: SMB2 SESSION_SETUP',
        badge: 'AUTHENTICATION',
        color: '#9FEF00',
        clientMsg: 'Client Request: SMB2 SESSION_SETUP Request (NTLMv2 / Kerberos Auth Token)',
        serverMsg: 'Server Response: SMB2 SESSION_SETUP Response (Returns SessionId: 0x4B92A1)',
        osComponent: 'lsass.exe (Local Security Authority)',
        visualGraphicHtml: `
          <div style="background: rgba(159, 239, 0, 0.08); border: 1px solid var(--htb-green); border-radius: 8px; padding: 0.9rem; text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 0.4rem; color: var(--htb-green);"><i class="fa-solid fa-user-shield"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 700; color: #fff;">User Authenticated: Domain\\Administrator</div>
            <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--htb-green); margin-top: 0.3rem;">Aktif Token: <span class="cyber-badge badge-htb">SessionId: 0x4B92A100</span></div>
          </div>
        `,
        osDetails: 'Server LSASS process kullanıcı güvenlik (security) credentials bilgilerini doğrular (validate), onaylanmış bir security token yayınlar ve Session Key türetir.'
      },
      {
        id: 'tree_connect',
        title: 'Step 3: SMB2 TREE_CONNECT',
        badge: 'MOUNTED SHARE',
        color: '#9d4edd',
        clientMsg: 'Client Request: SMB2 TREE_CONNECT Request (Path: \\\\SERVER\\SharedDocs)',
        serverMsg: 'Server Response: SMB2 TREE_CONNECT Response (Returns TreeId / TID: 0x0001)',
        osComponent: 'LanmanServer / srv2.sys (Server Service)',
        visualGraphicHtml: `
          <div style="background: rgba(157, 78, 221, 0.08); border: 1px solid var(--accent-purple); border-radius: 8px; padding: 0.9rem; text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 0.4rem; color: var(--accent-purple);"><i class="fa-solid fa-folder-tree"></i> <i class="fa-solid fa-hard-drive"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 700; color: #fff;">Mounted Network Share: Z:\\ (\\\\SERVER\\SharedDocs)</div>
            <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-purple); margin-top: 0.3rem;">Mounted Handle: <span class="cyber-badge badge-purple">TreeID (TID): 0x0001</span></div>
          </div>
        `,
        osDetails: 'LanmanServer, UNC path olan \\\\SERVER\\SharedDocs\'u hedef fiziksel hacme (D:\\Shares\\SharedDocs) haritalandırır (map) ve bir Tree ID handle verir.'
      },
      {
        id: 'create',
        title: 'Step 4: SMB2 CREATE',
        badge: 'OPEN FILE',
        color: '#ffb703',
        clientMsg: 'Client Request: SMB2 CREATE Request (Path: \\SharedDocs\\Report.docx)',
        serverMsg: 'Server Response: SMB2 CREATE Response (Returns FileId / FID: 0xA8F102)',
        osComponent: 'I/O Manager & ntfs.sys (File System)',
        visualGraphicHtml: `
          <div style="background: rgba(255, 183, 3, 0.08); border: 1px solid var(--accent-yellow); border-radius: 8px; padding: 0.9rem; text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 0.4rem; color: var(--accent-yellow);"><i class="fa-solid fa-file-word"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 700; color: #fff;">Açılan Dosya: Z:\\SharedDocs\\Report.docx</div>
            <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-yellow); margin-top: 0.3rem;">Kernel File Handle: <span class="cyber-badge badge-red">FileID (FID): 0xA8F102</span></div>
          </div>
        `,
        osDetails: 'Windows I/O Manager, kernel belleğinde bir FILE_OBJECT yapısı oluşturur. NTFS dosya ACL\'lerini doğrular (verify) ve açık bir File ID handle döndürür.'
      },
      {
        id: 'read_write',
        title: 'Step 5: SMB2 READ / WRITE',
        badge: 'DATA STREAM',
        color: '#ff2e63',
        clientMsg: 'Client Request: SMB2 READ Request (FileId: 0xA8F102, Offset: 0, Length: 64KB)',
        serverMsg: 'Server Response: SMB2 READ Response (Data Payload: 65,536 Bytes Stream)',
        osComponent: 'Cache Manager & ntfs.sys',
        visualGraphicHtml: `
          <div style="background: rgba(255, 46, 99, 0.08); border: 1px solid var(--accent-red); border-radius: 8px; padding: 0.9rem; text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 0.4rem; color: var(--accent-red);"><i class="fa-solid fa-cloud-arrow-down"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 700; color: #fff;">Streaming Payload: 65,536 Bytes</div>
            <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 10px; margin: 0.5rem auto; width: 80%; overflow: hidden;">
              <div style="background: var(--accent-red); width: 100%; height: 100%; animation: pulse-red 1s infinite alternate;"></div>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">Dosya içerik akışı (stream) client belleğine okunuyor...</div>
          </div>
        `,
        osDetails: 'Windows Cache Manager, RAM veya disk depolama biriminden (disk storage) dosya veri bloklarını getirir ve payload byte\'larını TCP soketi üzerinden stream eder.'
      },
      {
        id: 'close',
        title: 'Step 6: SMB2 CLOSE',
        badge: 'HANDLE CLOSED',
        color: '#00f5d4',
        clientMsg: 'Client Request: SMB2 CLOSE Request (FileId: 0xA8F102)',
        serverMsg: 'Server Response: SMB2 CLOSE Response (Handle Released)',
        osComponent: 'I/O Manager Cleanup',
        visualGraphicHtml: `
          <div style="background: rgba(0, 245, 212, 0.08); border: 1px solid #00f5d4; border-radius: 8px; padding: 0.9rem; text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 0.4rem; color: #00f5d4;"><i class="fa-solid fa-lock"></i> <i class="fa-solid fa-circle-check"></i></div>
            <div style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 700; color: #fff;">File Handle Serbest Bırakıldı (Released): FID 0xA8F102</div>
            <div style="font-family: var(--font-mono); font-size: 0.76rem; color: #00f5d4; margin-top: 0.3rem;">Durum: <span class="cyber-badge badge-htb">CLOSED &amp; FLUSHED</span></div>
          </div>
        `,
        osDetails: 'Server, kernel FILE_OBJECT kilitlerini (locks) serbest bırakır, değiştirilmiş veri tamponlarını (buffers) depolama diskine (storage disk) yazar (flush) ve File ID belleğini boşaltır.'
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
      const btn = document.getElementById(`smb-step-btn-${i}`);
      const lineGroup = document.getElementById(`smb-svg-step-${i}`);
      
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
    const titleEl = document.getElementById('smb-os-step-title');
    const badgeEl = document.getElementById('smb-os-step-badge');
    const componentEl = document.getElementById('smb-os-component');
    const graphicContainer = document.getElementById('smb-os-graphic-box');
    const detailsEl = document.getElementById('smb-os-details');
    const clientMsgEl = document.getElementById('smb-seq-client-msg');
    const serverMsgEl = document.getElementById('smb-seq-server-msg');

    if (titleEl) titleEl.innerText = step.title;
    if (badgeEl) {
      badgeEl.innerText = step.badge;
      badgeEl.style.borderColor = step.color;
      badgeEl.style.color = step.color;
    }
    if (componentEl) componentEl.innerText = step.osComponent;
    if (graphicContainer) graphicContainer.innerHTML = step.visualGraphicHtml;
    if (detailsEl) detailsEl.innerText = step.osDetails;
    if (clientMsgEl) clientMsgEl.innerText = step.clientMsg;
    if (serverMsgEl) serverMsgEl.innerText = step.serverMsg;
  }
}

// Instantiate globally
window.smblifecycleSim = new SMBLifecycleSimulator();
document.addEventListener('DOMContentLoaded', () => {
  if (window.smblifecycleSim) window.smblifecycleSim.setStep(0);
});
