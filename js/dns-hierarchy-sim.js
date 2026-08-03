/* Interactive Visual DNS Hierarchy Simulator (Linear & Star Topology) */

// 1. Linear DNS Hierarchy Simulator
(function() {
  const dnsSteps = [
    {
      step: 0,
      badge: "RECURSIVE SORGU",
      badgeClass: "badge-cyan",
      highlight: "all",
      focusText: "Odak: İstemci Tarafından İstenen Tam FQDN ➔ Recursive Resolver'a (Çözümleyici) Gönderildi",
      server: "İstemci ➔ Yerel Recursive Resolver (ör. 8.8.8.8)",
      query: "www.example.net NEREDE?",
      response: "Recursive Resolver işi kabul eder & Root'tan (.) başlayarak Sağdan Sola iteratif sorguları başlatır",
      note: "<strong>Recursive Sorgu (Query):</strong> İstemci (client), tüm çözümleme (resolution) görevini yerel resolver'a devreder."
    },
    {
      step: 1,
      badge: "ROOT SUNUCU (.)",
      badgeClass: "badge-red",
      highlight: "root",
      focusText: "Odak: Sondaki Kök Nokta [ . ] ➔ Root İsim Sunucusu Sorgulanıyor",
      server: "Recursive Resolver ➔ Root Sunucu (.)",
      query: "www.example.net Nerede?",
      response: "Yönlendirme (Referral): 'IP'yi bilmiyorum, ancak işte .net TLD sunucusu için IP (192.5.6.30)'",
      note: "<strong>Root Zone (.):</strong> DNS hiyerarşisinin en üstü (küresel çapta 13 root sunucu kümesi). TLD yönlendirmelerini (referrals) döndürür."
    },
    {
      step: 2,
      badge: "TLD SUNUCU (.net)",
      badgeClass: "badge-purple",
      highlight: "tld",
      focusText: "Odak: Top-Level Domain [ .net ] ➔ TLD İsim Sunucusu Sorgulanıyor",
      server: "Recursive Resolver ➔ TLD Sunucu (.net)",
      query: "www.example.net Nerede?",
      response: "Yönlendirme (Referral): 'IP'yi bilmiyorum, ancak işte example.net Authoritative sunucusu (192.0.2.1)'",
      note: "<strong>TLD Sunucu (.net):</strong> Alan adı (domain) uzantılarını (.net, .com, .org) yönetir. Authoritative yönlendirmeleri döndürür."
    },
    {
      step: 3,
      badge: "AUTHORITATIVE SUNUCU",
      badgeClass: "badge-htb",
      highlight: "sld",
      focusText: "Odak: Second-Level Domain [ example ] ➔ Authoritative İsim Sunucusu Sorgulanıyor",
      server: "Recursive Resolver ➔ Authoritative Sunucu (example.net)",
      query: "Host kaydı 'www' için IP adresi nedir?",
      response: "Yanıt (Answer): 'A Kaydı (Record) bulundu: www.example.net = 93.184.216.34'",
      note: "<strong>Authoritative Sunucu:</strong> Domain (alan adı) için resmi DNS bölge (zone) kayıtlarını tutar. Nihai yanıtı sağlar."
    },
    {
      step: 4,
      badge: "HOST ÇÖZÜMLENDİ (93.184.216.34)",
      badgeClass: "badge-cyan",
      highlight: "www",
      focusText: "Odak: Subdomain / Host [ www ] ➔ Nihai IP Döndürüldü ve Önbelleğe (Cached) Alındı",
      server: "Yerel Recursive Resolver ➔ İstemci Tarayıcı",
      query: "Nihai A Kaydı (Record) Yanıtı İstemciye teslim edildi",
      response: "BAŞARILI: www.example.net ➔ 93.184.216.34 (Resolver'da TTL 3600s önbelleğe alındı / cached)",
      note: "<strong>Tamamlama (Completion):</strong> İstemci tarayıcı 93.184.216.34 IP adresini alır ve HTTP/TCP oturumu (session) kurar!"
    }
  ];

  let currentStep = 0;
  let autoTimer = null;

  function updateUI() {
    const data = dnsSteps[currentStep];

    const slider = document.getElementById('dns-slider');
    if (slider) slider.value = currentStep;

    const pills = {
      root: document.getElementById('dns-part-root'),
      tld: document.getElementById('dns-part-tld'),
      sld: document.getElementById('dns-part-sld'),
      www: document.getElementById('dns-part-www')
    };

    Object.keys(pills).forEach(key => {
      const el = pills[key];
      if (!el) return;
      el.style.transform = 'scale(1)';
      el.style.boxShadow = 'none';
      el.style.opacity = '0.45';
      el.style.border = '1px solid transparent';
      el.style.background = 'transparent';
      el.style.color = 'var(--text-main)';
    });

    if (data.highlight === 'all') {
      Object.keys(pills).forEach(key => {
        if (pills[key]) pills[key].style.opacity = '1';
      });
      if (pills.root) pills.root.style.color = 'var(--accent-yellow)';
    } else if (pills[data.highlight]) {
      const activeEl = pills[data.highlight];
      activeEl.style.opacity = '1';
      activeEl.style.transform = 'scale(1.22)';
      
      if (data.highlight === 'root') {
        activeEl.style.background = 'rgba(255, 46, 99, 0.25)';
        activeEl.style.borderColor = 'var(--accent-red)';
        activeEl.style.color = '#fff';
        activeEl.style.boxShadow = '0 0 20px var(--accent-red)';
      } else if (data.highlight === 'tld') {
        activeEl.style.background = 'rgba(189, 0, 255, 0.25)';
        activeEl.style.borderColor = 'var(--accent-purple)';
        activeEl.style.color = '#fff';
        activeEl.style.boxShadow = '0 0 20px var(--accent-purple)';
      } else if (data.highlight === 'sld') {
        activeEl.style.background = 'rgba(159, 239, 0, 0.25)';
        activeEl.style.borderColor = 'var(--htb-green)';
        activeEl.style.color = '#fff';
        activeEl.style.boxShadow = '0 0 20px var(--htb-green-glow)';
      } else if (data.highlight === 'www') {
        activeEl.style.background = 'rgba(45, 226, 230, 0.25)';
        activeEl.style.borderColor = 'var(--accent-cyan)';
        activeEl.style.color = '#fff';
        activeEl.style.boxShadow = '0 0 20px var(--accent-cyan)';
      }
    }

    const focusLabel = document.getElementById('dns-arrow-indicator');
    if (focusLabel) {
      focusLabel.innerHTML = `<i class="fa-solid fa-magnifying-glass highlight-cyan"></i> ${data.focusText}`;
    }

    for (let i = 0; i <= 4; i++) {
      const btn = document.getElementById(`dns-btn-${i}`);
      if (btn) {
        if (i === currentStep) {
          btn.style.borderColor = 'var(--accent-cyan)';
          btn.style.background = 'rgba(45, 226, 230, 0.2)';
          btn.style.color = 'var(--accent-cyan)';
        } else {
          btn.style.borderColor = 'rgba(255,255,255,0.15)';
          btn.style.background = 'transparent';
          btn.style.color = 'var(--text-muted)';
        }
      }
    }

    const cardDetail = document.getElementById('dns-card-detail');
    if (cardDetail) {
      cardDetail.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.4rem;">
          <div style="font-weight: 700; font-family: var(--font-mono); color: var(--text-main); font-size: 0.95rem;">
            <i class="fa-solid fa-server highlight-cyan"></i> ${data.server}
          </div>
          <span class="cyber-badge ${data.badgeClass}">${data.badge}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem; font-family: var(--font-mono);">
          <div style="color: var(--accent-yellow);"><strong style="color: var(--text-muted);">Gönderilen Sorgu:</strong> ${data.query}</div>
          <div style="color: var(--htb-green);"><strong style="color: var(--text-muted);">Yanıt:</strong> ${data.response}</div>
          <div style="margin-top: 0.3rem; padding-top: 0.3rem; border-top: 1px solid rgba(255,255,255,0.05); color: var(--text-main); font-family: var(--font-sans); font-size: 0.88em;">
            <i class="fa-solid fa-circle-info highlight-cyan"></i> ${data.note}
          </div>
        </div>
      `;
    }
  }

  window.dnsSim = {
    setStep: function(stepIndex) {
      currentStep = Math.max(0, Math.min(4, stepIndex));
      updateUI();
    },
    nextStep: function() {
      currentStep = (currentStep + 1) % 5;
      updateUI();
    },
    prevStep: function() {
      currentStep = (currentStep - 1 + 5) % 5;
      updateUI();
    },
    togglePlay: function() {
      const playBtn = document.getElementById('dns-play-btn');
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Auto Play';
      } else {
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        autoTimer = setInterval(() => {
          currentStep = (currentStep + 1) % 5;
          updateUI();
        }, 2600);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(updateUI, 100));
  } else {
    setTimeout(updateUI, 100);
  }
})();

// 2. Star Topology DNS Hierarchy Simulator
(function() {
  const dnsSteps = [
    {
      step: 0,
      badge: "RECURSIVE SORGU",
      badgeClass: "badge-cyan",
      highlight: "all",
      focusText: "Odak: İstemci (Client) ➔ Recursive Resolver'a Çözümleme İsteği Gönderiyor",
      activeNode: "client-res",
      activeLine: "dns2-line-client",
      lineColor: "var(--accent-cyan)",
      server: "İstemci Tarayıcı ➔ Yerel Recursive Resolver (ör. 8.8.8.8)",
      query: "www.example.net NEREDE?",
      response: "Recursive Resolver isteği alır. Sırasıyla Root, TLD ve Auth sunucularına iteratif sorgular başlatır.",
      note: "<strong>Yıldız Topolojisinde:</strong> İstemci doğrudan dış DNS sunucularına gitmez, tüm trafik merkezi Resolver üzerinden akar."
    },
    {
      step: 1,
      badge: "ROOT SUNUCU (.)",
      badgeClass: "badge-red",
      highlight: "root",
      focusText: "Odak: Resolver ➔ Kök Nokta [ . ] Root Sunucusunu Sorguluyor",
      activeNode: "res-root",
      activeLine: "dns2-line-root",
      lineColor: "var(--accent-red)",
      server: "Recursive Resolver ➔ Root İsim Sunucusu (.)",
      query: "www.example.net Nerede?",
      response: "Yönlendirme (Referral): '.net TLD Sunucusunun IP Adresi (192.5.6.30)'",
      note: "<strong>Root Zone (.):</strong> Küresel 13 root sunucu kümesi. .net TLD sunucusuna yönlendirir."
    },
    {
      step: 2,
      badge: "TLD SUNUCU (.net)",
      badgeClass: "badge-purple",
      highlight: "tld",
      focusText: "Odak: Resolver ➔ Top-Level Domain [ .net ] Sunucusunu Sorguluyor",
      activeNode: "res-tld",
      activeLine: "dns2-line-tld",
      lineColor: "var(--accent-purple)",
      server: "Recursive Resolver ➔ TLD İsim Sunucusu (.net)",
      query: "www.example.net Nerede?",
      response: "Yönlendirme (Referral): 'example.net Authoritative Sunucu IP (192.0.2.1)'",
      note: "<strong>TLD Sunucusu (.net):</strong> .net uzantılı alan adlarının yetkili sunucularını bildirir."
    },
    {
      step: 3,
      badge: "AUTHORITATIVE SUNUCU",
      badgeClass: "badge-htb",
      highlight: "sld",
      focusText: "Odak: Resolver ➔ Second-Level Domain [ example.net ] Authoritative Sunucuyu Sorguluyor",
      activeNode: "res-auth",
      activeLine: "dns2-line-auth",
      lineColor: "var(--accent-yellow)",
      server: "Recursive Resolver ➔ Authoritative Sunucu (example.net)",
      query: "Host kaydı 'www' için IP adresi nedir?",
      response: "Yanıt (Answer): 'A Kaydı Bulundu: www.example.net = 93.184.216.34'",
      note: "<strong>Authoritative Sunucu:</strong> Gerçek IP kaydının tutulduğu nihai yetkili sunucudur."
    },
    {
      step: 4,
      badge: "HOST ÇÖZÜMLENDİ (93.184.216.34)",
      badgeClass: "badge-cyan",
      highlight: "www",
      focusText: "Odak: Resolver ➔ İstemciye [ www.example.net = 93.184.216.34 ] Yanıtını İletiyor",
      activeNode: "res-client-reply",
      activeLine: "dns2-line-client",
      lineColor: "var(--accent-cyan)",
      server: "Yerel Recursive Resolver ➔ İstemci Tarayıcı",
      query: "Nihai A Kaydı Yanıtı İstemciye teslim edildi",
      response: "BAŞARILI: www.example.net ➔ 93.184.216.34 (Resolver'da TTL 3600s önbelleğe alındı / cached)",
      note: "<strong>Tamamlama (Completion):</strong> İstemci 93.184.216.34 IP adresini alır ve HTTP/TCP üzerinden bağlanır!"
    }
  ];

  let currentStep = 0;
  let autoTimer = null;

  function updateUI() {
    const data = dnsSteps[currentStep];

    const slider = document.getElementById('dns2-slider');
    if (slider) slider.value = currentStep;

    const pills = {
      root: document.getElementById('dns2-part-root'),
      tld: document.getElementById('dns2-part-tld'),
      sld: document.getElementById('dns2-part-sld'),
      www: document.getElementById('dns2-part-www')
    };

    Object.keys(pills).forEach(key => {
      const el = pills[key];
      if (!el) return;
      el.style.transform = 'scale(1)';
      el.style.boxShadow = 'none';
      el.style.opacity = '0.45';
      el.style.border = '1px solid transparent';
      el.style.background = 'transparent';
      el.style.color = 'var(--text-main)';
    });

    if (data.highlight === 'all') {
      Object.keys(pills).forEach(key => {
        if (pills[key]) pills[key].style.opacity = '1';
      });
      if (pills.root) pills.root.style.color = 'var(--accent-yellow)';
    } else if (pills[data.highlight]) {
      const activeEl = pills[data.highlight];
      activeEl.style.opacity = '1';
      activeEl.style.transform = 'scale(1.22)';
      
      if (data.highlight === 'root') {
        activeEl.style.background = 'rgba(255, 46, 99, 0.25)';
        activeEl.style.borderColor = 'var(--accent-red)';
        activeEl.style.color = '#fff';
        activeEl.style.boxShadow = '0 0 20px var(--accent-red)';
      } else if (data.highlight === 'tld') {
        activeEl.style.background = 'rgba(189, 0, 255, 0.25)';
        activeEl.style.borderColor = 'var(--accent-purple)';
        activeEl.style.color = '#fff';
        activeEl.style.boxShadow = '0 0 20px var(--accent-purple)';
      } else if (data.highlight === 'sld') {
        activeEl.style.background = 'rgba(159, 239, 0, 0.25)';
        activeEl.style.borderColor = 'var(--htb-green)';
        activeEl.style.color = '#fff';
        activeEl.style.boxShadow = '0 0 20px var(--htb-green-glow)';
      } else if (data.highlight === 'www') {
        activeEl.style.background = 'rgba(45, 226, 230, 0.25)';
        activeEl.style.borderColor = 'var(--accent-cyan)';
        activeEl.style.color = '#fff';
        activeEl.style.boxShadow = '0 0 20px var(--accent-cyan)';
      }
    }

    const focusLabel = document.getElementById('dns2-arrow-indicator');
    if (focusLabel) {
      focusLabel.innerHTML = `<i class="fa-solid fa-magnifying-glass highlight-cyan"></i> ${data.focusText}`;
    }

    const nodes = {
      client: document.getElementById('dns2-node-client'),
      resolver: document.getElementById('dns2-node-resolver'),
      root: document.getElementById('dns2-node-root'),
      tld: document.getElementById('dns2-node-tld'),
      auth: document.getElementById('dns2-node-auth')
    };

    const lines = {
      'dns2-line-client': document.getElementById('dns2-line-client'),
      'dns2-line-root': document.getElementById('dns2-line-root'),
      'dns2-line-tld': document.getElementById('dns2-line-tld'),
      'dns2-line-auth': document.getElementById('dns2-line-auth')
    };

    Object.keys(nodes).forEach(k => {
      if (nodes[k]) {
        nodes[k].style.borderColor = 'rgba(255,255,255,0.15)';
        nodes[k].style.background = 'rgba(255,255,255,0.03)';
        nodes[k].style.boxShadow = 'none';
      }
    });
    if (nodes.resolver) {
      nodes.resolver.style.borderColor = 'var(--htb-green)';
      nodes.resolver.style.background = 'rgba(159, 239, 0, 0.08)';
    }

    Object.keys(lines).forEach(k => {
      if (lines[k]) {
        lines[k].setAttribute('stroke', 'rgba(255,255,255,0.12)');
        lines[k].setAttribute('stroke-width', '2');
      }
    });

    if (lines[data.activeLine]) {
      lines[data.activeLine].setAttribute('stroke', data.lineColor);
      lines[data.activeLine].setAttribute('stroke-width', '3.5');
    }

    if (data.activeNode === 'client-res' || data.activeNode === 'res-client-reply') {
      if (nodes.client) { nodes.client.style.borderColor = 'var(--accent-cyan)'; nodes.client.style.boxShadow = '0 0 16px var(--accent-cyan)'; }
      if (nodes.resolver) { nodes.resolver.style.boxShadow = '0 0 16px var(--accent-cyan)'; }
    } else if (data.activeNode === 'res-root') {
      if (nodes.root) { nodes.root.style.borderColor = 'var(--accent-red)'; nodes.root.style.boxShadow = '0 0 18px var(--accent-red)'; }
      if (nodes.resolver) { nodes.resolver.style.boxShadow = '0 0 16px var(--accent-red)'; }
    } else if (data.activeNode === 'res-tld') {
      if (nodes.tld) { nodes.tld.style.borderColor = 'var(--accent-purple)'; nodes.tld.style.boxShadow = '0 0 18px var(--accent-purple)'; }
      if (nodes.resolver) { nodes.resolver.style.boxShadow = '0 0 16px var(--accent-purple)'; }
    } else if (data.activeNode === 'res-auth') {
      if (nodes.auth) { nodes.auth.style.borderColor = 'var(--accent-yellow)'; nodes.auth.style.boxShadow = '0 0 18px var(--accent-yellow)'; }
      if (nodes.resolver) { nodes.resolver.style.boxShadow = '0 0 16px var(--accent-yellow)'; }
    }

    const starBadge = document.getElementById('dns2-star-badge');
    if (starBadge) {
      starBadge.innerHTML = `<span class="cyber-badge ${data.badgeClass}">${data.badge}</span>`;
    }

    for (let i = 0; i <= 4; i++) {
      const btn = document.getElementById(`dns2-btn-${i}`);
      if (btn) {
        if (i === currentStep) {
          btn.style.borderColor = 'var(--accent-cyan)';
          btn.style.background = 'rgba(45, 226, 230, 0.2)';
          btn.style.color = 'var(--accent-cyan)';
        } else {
          btn.style.borderColor = 'rgba(255,255,255,0.15)';
          btn.style.background = 'transparent';
          btn.style.color = 'var(--text-muted)';
        }
      }
    }

    const cardDetail = document.getElementById('dns2-card-detail');
    if (cardDetail) {
      cardDetail.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.35rem;">
          <div style="font-weight: 700; font-family: var(--font-mono); color: var(--text-main); font-size: 0.92rem;">
            <i class="fa-solid fa-network-wired highlight-cyan"></i> ${data.server}
          </div>
          <span class="cyber-badge ${data.badgeClass}">${data.badge}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.3rem; font-family: var(--font-mono);">
          <div style="color: var(--accent-yellow);"><strong style="color: var(--text-muted);">Gönderilen Sorgu:</strong> ${data.query}</div>
          <div style="color: var(--htb-green);"><strong style="color: var(--text-muted);">Yanıt:</strong> ${data.response}</div>
          <div style="margin-top: 0.25rem; padding-top: 0.25rem; border-top: 1px solid rgba(255,255,255,0.05); color: var(--text-main); font-family: var(--font-sans); font-size: 0.86em;">
            <i class="fa-solid fa-circle-info highlight-cyan"></i> ${data.note}
          </div>
        </div>
      `;
    }
  }

  window.dnsSimStar = {
    setStep: function(stepIndex) {
      currentStep = Math.max(0, Math.min(4, stepIndex));
      updateUI();
    },
    nextStep: function() {
      currentStep = (currentStep + 1) % 5;
      updateUI();
    },
    prevStep: function() {
      currentStep = (currentStep - 1 + 5) % 5;
      updateUI();
    },
    togglePlay: function() {
      const playBtn = document.getElementById('dns2-play-btn');
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Auto Play';
      } else {
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        autoTimer = setInterval(() => {
          currentStep = (currentStep + 1) % 5;
          updateUI();
        }, 2600);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(updateUI, 100));
  } else {
    setTimeout(updateUI, 100);
  }
})();
