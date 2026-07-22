// Hack The Box (HTB) Dark Blue Mesh Canvas Animation
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'cyber-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((width * height) / 19000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        radius: Math.random() * 1.7 + 0.5,
        color: Math.random() > 0.25 ? 'rgba(159, 239, 0, ' : 'rgba(45, 226, 230, ',
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Deep HTB Dark Blueish Radial Background Gradient
    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, Math.max(width, height));
    bgGradient.addColorStop(0, '#102342');
    bgGradient.addColorStop(1, '#081224');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // HTB Dot Grid Background
    ctx.fillStyle = 'rgba(159, 239, 0, 0.05)';
    const dotSpacing = 42;
    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = 0; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Update & Draw HTB Node Particles
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Connect HTB Nodes
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 118) {
          ctx.strokeStyle = `rgba(159, 239, 0, ${0.16 * (1 - dist / 118)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
});
