const timeline = document.querySelector('#timeline');
const region = document.querySelector('#region');
const dayLength = 86400000;
const formatDay = new Intl.DateTimeFormat('de-AT', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const formatMonth = new Intl.DateTimeFormat('de-AT', { month: 'long', timeZone: 'UTC' });
const vienna = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vienna', year: 'numeric', month: '2-digit', day: '2-digit' });
let renderedToday;

function element(tag, className, label) {
  const node = document.createElement(tag);
  node.className = className;
  if (label) node.textContent = label;
  return node;
}

function illustration(market) {
  const castle = /burg|schloss/i.test(market.name);
  const wood = market.region === 'Mühlviertel';
  const sky = castle ? '#405968' : wood ? '#33574d' : '#785a55';
  const building = castle
    ? '<path d="M14 46V30h3v3h3v-4h3v4h3v-5h3v16h5V21l6-7 6 7v18h5v-8h4v3h4v-3h4v22H14Z" fill="#d5c7a7"/><path d="M37 26h4v6h-4zm-17 12h3v5h-3zm31 3h3v5h-3z" fill="#48565a"/>'
    : '<path d="M12 41l17-15 20 15zm27 5l11-12 16 12z" fill="#f3e2ca"/><path d="M16 41h29v15H16zm26 5h21v12H42z" fill="#9e7357"/><path d="M20 44h11v8H20zm16 0h5v8h-5zm10 5h11v6H46z" fill="#f7cf80"/>';
  const art = element('div', 'stamp');
  art.setAttribute('aria-hidden', 'true');
  art.innerHTML = '<svg viewBox="0 0 74 78" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="74" height="78" fill="'+sky+'"/><g fill="#eadcb7"><circle cx="9" cy="12" r=".9"/><circle cx="25" cy="8" r=".8"/><circle cx="50" cy="14" r="1"/><circle cx="64" cy="6" r=".7"/><circle cx="12" cy="24" r=".7"/></g><path d="M0 46Q24 33 44 42T76 35V78H0" fill="#81918b"/>'+building+'<path d="M0 53q16-5 36 0t39-1v26H0Z" fill="#d5dcd2"/><path d="M0 65q21-13 47-6t29-4v23H0Z" fill="#a2b6b0"/><g fill="#274644"><path d="m7 36-6 13h3l-6 10h5l-7 10h20L9 59h4L8 49h4Z"/><path d="m69 31-6 15h3l-8 13h5l-7 10h23l-7-12h5l-7-12h4Z"/></g></svg>';
  return art;
}

function card(market) {
  const node = element('article', 'card');
  const info = element('div', 'info');
  let date = 'Termin noch offen';
  if (market.start) {
    date = formatDay.format(new Date(market.start));
    if (market.end && market.end !== market.start) date += ' – ' + formatDay.format(new Date(market.end));
  }
  info.append(element('p', 'date', date), element('h3', '', market.name), element('p', 'place', market.place + ' · ' + market.region));
  if (market.note) info.append(element('p', 'note', market.note));
  const source = element('a', '', '↗');
  source.href = market.url;
  source.setAttribute('aria-label', 'Terminquelle für ' + market.name);
  source.title = 'Terminquelle öffnen';
  node.append(illustration(market), info, source);
  return node;
}

function render() {
  renderedToday = vienna.format(new Date());
  const entries = markets.filter(m => !region.value || m.region === region.value);
  const dated = entries.filter(m => m.start);
  const last = dated.reduce((end, m) => [end, m.end || m.start].sort()[1], '2026-11-01');
  const fragment = document.createDocumentFragment();
  for (let time = Date.parse('2026-11-01'); dated.length && time <= Date.parse(last); time += dayLength) {
    const date = new Date(time);
    const iso = date.toISOString().slice(0, 10);
    if (date.getUTCDate() === 1) {
      const month = element('h3', 'month', formatMonth.format(date));
      month.append(element('small', '', '2026'));
      fragment.append(month);
    }
    const starts = dated.filter(m => m.start === iso);
    const day = element('div', starts.length ? 'day event' : 'day');
    const light = element('i', iso <= renderedToday ? 'lamp on' : 'lamp');
    light.title = formatDay.format(date) + (iso === renderedToday ? ' · Heute' : '');
    light.setAttribute('role', 'img');
    light.setAttribute('aria-label', light.title);
    day.append(light, ...starts.map(card));
    fragment.append(day);
  }
  const open = entries.filter(m => !m.start);
  if (open.length) fragment.append(element('h3', 'month', 'Termin noch offen'), ...open.map(card));
  timeline.replaceChildren(fragment);
}
region.addEventListener('change', render);
render();
setInterval(() => { if (vienna.format(new Date()) !== renderedToday) render(); }, 30000);
