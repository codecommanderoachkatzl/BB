(() => {
  const canvas = document.querySelector('#snow');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const spacing = 8;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const flakes = [];
  const powder = [];
  const layers = new WeakMap();
  let shelves = [], ground, width, height, previous, frame;

  function bank(x, y, length, floor, old) {
    const count = Math.max(2, Math.ceil(length / spacing) + 1);
    const phase = Math.random() * 6;
    const depths = Array.from({ length: count }, (_, i) => {
      if (old) return old.depths[Math.round(i * (old.depths.length - 1) / (count - 1))];
      return (floor ? 8 : 2) + (1 + Math.sin(i * .21 + phase)) * (floor ? 3 : .7);
    });
    return { x, y, length, floor, depths };
  }

  function flake(initial) {
    const size = .8 + Math.random() * 2;
    return { x: Math.random() * width, y: initial ? Math.random() * height : -8,
      size, speed: 15 + size * 14, phase: Math.random() * 7 };
  }

  function layout() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ground = bank(0, height, width, true, ground);
    shelves = Array.from(document.querySelectorAll('.card, .jump, .select-wrap'), node => {
      const rect = node.getBoundingClientRect();
      const shelf = bank(rect.left + 6, rect.top + scrollY + 1, Math.max(1, rect.width - 12), false, layers.get(node));
      layers.set(node, shelf);
      return shelf;
    });
    const target = Math.min(165, Math.ceil(width * height / 5200));
    flakes.length = Math.min(flakes.length, target);
    while (flakes.length < target) flakes.push(flake(true));
    schedule();
  }

  function visible() {
    return [...shelves.filter(s => s.y >= scrollY - 10 && s.y <= scrollY + height), ground];
  }

  function base(s) { return s.floor ? height : s.y - scrollY; }
  function column(s, x) { return Math.round((x - s.x) / s.length * (s.depths.length - 1)); }
  function drawBank(s) {
    const y = base(s);
    const dx = s.length / (s.depths.length - 1);
    const fill = ctx.createLinearGradient(0, y - (s.floor ? 19 : 7), 0, y + 2);
    fill.addColorStop(0, '#ffffff');
    fill.addColorStop(.65, '#f4fbff');
    fill.addColorStop(1, '#bdcfd5');
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(s.x, y + 1);
    for (let i = 0; i < s.depths.length - 1; i++) {
      const x = s.x + i * dx;
      const depth = s.depths[i];
      ctx.quadraticCurveTo(x, y - depth, x + dx / 2, y - (depth + s.depths[i + 1]) / 2);
    }
    ctx.lineTo(s.x + s.length, y - s.depths.at(-1));
    ctx.lineTo(s.x + s.length, y + 1);
    ctx.closePath();
    ctx.fill();
  }

  function settle(p, from, banks) {
    for (const s of banks) {
      if (p.x < s.x || p.x > s.x + s.length) continue;
      const i = column(s, p.x);
      const top = base(s) - s.depths[i];
      if (from > top || p.y < top) continue;
      for (let j = Math.max(0, i - 1); j <= Math.min(s.depths.length - 1, i + 1); j++) {
        s.depths[j] = Math.min(s.floor ? 25 : 9, s.depths[j] + (j === i ? 1 : .45));
      }
      return true;
    }
    return false;
  }

  function dot(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw(now) {
    frame = 0;
    const dt = Math.min((now - (previous || now)) / 1000, .05);
    previous = now;
    const banks = visible();
    ctx.clearRect(0, 0, width, height);
    if (!reduced.matches) {
      ctx.fillStyle = 'rgba(248,252,255,.88)';
      for (const p of flakes) {
        const from = p.y;
        p.y += p.speed * dt;
        p.x = (width + p.x + (5 + 12 * Math.sin(now / 1700 + p.phase)) * dt) % width;
        if (settle(p, from, banks) || p.y > height) Object.assign(p, flake(false));
        dot(p);
      }
    }
    ctx.fillStyle = '#eff9ff';
    for (let i = powder.length - 1; i >= 0; i--) {
      const p = powder[i], from = p.y;
      p.vy += 320 * dt;
      p.y += p.vy * dt;
      p.x += p.vx * dt;
      if (p.y > height + 5 || settle(p, from, banks)) powder.splice(i, 1);
      else dot(p);
    }
    banks.forEach(drawBank);
    if (!reduced.matches || powder.length) schedule();
  }

  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
  }

  function sweep(x, y, dx) {
    for (const s of visible()) {
      if (Math.abs(base(s) - y) > 32 || x < s.x - 24 || x > s.x + s.length + 24) continue;
      const center = column(s, x);
      for (let i = Math.max(0, center - 3); i <= Math.min(s.depths.length - 1, center + 3); i++) {
        const removed = s.depths[i] * (1 - Math.abs(i - center) / 4);
        s.depths[i] -= removed;
        if (removed < .5 || reduced.matches) continue;
        for (let j = 0; j < Math.min(5, Math.ceil(removed)); j++) {
          if (powder.length >= 220) break;
          powder.push({ x: s.x + i * s.length / (s.depths.length - 1), y: base(s) + (s.floor ? -removed : 3),
            vx: Math.max(-120, Math.min(120, dx * 5)) + Math.random() * 40 - 20,
            vy: s.floor ? -55 - Math.random() * 60 : 20 + Math.random() * 45, size: 1 + Math.random() * 1.6 });
        }
      }
    }
    schedule();
  }

  let last;
  function stroke(x, y) {
    if (last) {
      const dx = x - last.x, dy = y - last.y;
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 12));
      for (let i = 1; i <= steps; i++) sweep(last.x + dx * i / steps, last.y + dy * i / steps, dx);
    } else sweep(x, y, 0);
    last = { x, y };
  }
  // Passive touch listeners also receive swipes while the browser scrolls the page.
  for (const type of ['touchstart', 'touchmove']) {
    window.addEventListener(type, e => {
      if (type === 'touchstart') last = null;
      if (e.touches.length === 1) stroke(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
  }
  window.addEventListener('pointerdown', e => { if (e.pointerType !== 'touch') { last = null; stroke(e.clientX, e.clientY); } });
  window.addEventListener('pointermove', e => { if (e.pointerType !== 'touch' && e.buttons === 1) stroke(e.clientX, e.clientY); });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', layout);
  new MutationObserver(layout).observe(document.querySelector('#timeline'), { childList: true });
  reduced.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', () => { previous = 0; schedule(); });
  layout();
})();
