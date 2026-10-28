function parseHexColor(hex) {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function startTwinklingGrid(element, settings) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  element.appendChild(canvas);

  const dotSize = Math.max(1, Number(settings.dot_size) || 1);
  const gridGap = Math.max(2, Number(settings.grid_gap) || 4);
  const minOpacity = Math.max(0, Number(settings.min_opacity) ?? 0.02);
  const maxOpacity = Math.max(minOpacity, Number(settings.max_opacity) ?? 0.18);
  const speed = Math.max(0.01, Number(settings.twinkle_speed) || 0.8);
  const density = Math.min(1, Math.max(0.01, Number(settings.twinkle_density) || 0.20));
  const rgb = parseHexColor(settings.dot_color || '#000000');

  let destroyed = false;
  let animId = null;
  let dots = [];
  let width = 0;
  let height = 0;
  let lastTime = performance.now();

  function initGrid() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = element.clientWidth || window.innerWidth;
    height = element.clientHeight || window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.ceil(width / gridGap) + 1;
    const rows = Math.ceil(height / gridGap) + 1;
    const total = cols * rows;

    dots = new Array(total);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const twinks = Math.random() < density;
        dots[idx] = {
          x: c * gridGap,
          y: r * gridGap,
          phase: Math.random() * Math.PI * 2,
          freq: (0.5 + Math.random() * 1.0) * speed,
          twinks,
          staticAlpha: minOpacity + Math.random() * (maxOpacity - minOpacity) * 0.1,
        };
      }
    }
  }

  function render(now) {
    if (destroyed) return;

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      let alpha;

      if (d.twinks) {
        d.phase += d.freq * dt;
        const wave = 0.5 + 0.5 * Math.sin(d.phase);
        alpha = minOpacity + (maxOpacity - minOpacity) * (wave * wave);
      } else {
        alpha = d.staticAlpha;
      }

      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha.toFixed(3)})`;
      ctx.fillRect(d.x, d.y, dotSize, dotSize);
    }

    animId = requestAnimationFrame(render);
  }

  function sync() {
    if (destroyed) return;
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    } else if (!animId) {
      lastTime = performance.now();
      animId = requestAnimationFrame(render);
    }
  }

  const observer = new ResizeObserver(() => {
    initGrid();
  });
  observer.observe(element);

  initGrid();
  lastTime = performance.now();
  animId = requestAnimationFrame(render);

  document.addEventListener('visibilitychange', sync);

  return function cleanup() {
    if (destroyed) return;
    destroyed = true;
    if (animId) cancelAnimationFrame(animId);
    observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
    canvas.remove();
  };
}
