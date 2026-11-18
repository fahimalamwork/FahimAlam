// The Lab — a contact sheet of every project.
// Add or edit projects in PROJECTS. A project with `shot: true` shows assets/shots/<id>.jpg;
// one without a `url` shows its `status` instead of a live link. Optional: `role`, `stack` (array)
// and `note` (a short heads-up such as a slow first load) appear in the loupe.
const PROJECTS = [
  { id: 'bandartrade', name: 'BandarTrade', kind: 'product', url: 'https://bandartrade.com', shot: true,
    role: 'Founder', stack: ['.NET 8', 'EF Core', 'SQL Server', 'React', 'TypeScript', 'OpenAI API', 'Playwright', 'Reqnroll'],
    tagline: 'AI-assisted freight quoting for Bangladesh',
    description: 'A live freight quoting and port trading platform built for Bangladesh. Its quoting engine turns unstructured rate requests like "2x 40ft containers, Shanghai to Chittagong" into priced quotes: an LLM extracts the route and container details, then carrier rates, trucking costs and client markups are applied. Built on .NET 8, SQL Server and React.' },
  { id: 'uplift', name: 'Uplift Digital Partners', kind: 'client', url: 'https://upliftdigitalpartners.com', shot: true,
    role: 'Co-founder & Technical Lead', stack: ['HTML', 'CSS', 'JavaScript', 'EmailJS', 'GitHub Pages'],
    tagline: 'A web agency for local small businesses',
    description: 'A web agency I co-founded that builds and modernizes websites and apps for local small businesses. The company site runs on GitHub Pages with a custom domain, and includes a conversational booking assistant that sends confirmation emails and one-click Google Calendar invites.' },
  { id: 'okdoc', name: 'OkDoc', kind: 'dev', url: null, status: 'In development',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'FHIR (Plan-Net)', 'NPPES NPI Registry', 'next-intl'],
    tagline: 'Which doctors near me take my insurance?',
    description: 'An in-network doctor finder, starting with Medicare Advantage plans in NYC. It syncs public CMS-mandated provider directory FHIR APIs and the NPI Registry into Postgres through payer adapters, labels every result with its source and freshness, and is built for 12 languages to WCAG 2.2 AA.' },
  { id: 'night-walker', name: 'Night Walker NYC', kind: 'play', url: 'https://three-js-brainstorm.vercel.app', shot: true,
    stack: ['Three.js', 'Vite', 'Vercel'], note: 'Plays on desktop and phone.',
    tagline: 'A cel-shaded browser game set in New York',
    description: 'A comic-style game set in New York neighborhoods, playable on desktop and phone, with walking, biking and driving. Every street, building, crowd, traffic pattern and sound is generated in code, with a day-to-night cycle and subway travel between neighborhoods. Built with Three.js.' },
  { id: 'anima-fy', name: 'Anima-Fy', kind: 'product', url: 'https://animafy-ai.vercel.app', shot: true,
    stack: ['React', 'Vite', 'Express', 'SEC EDGAR', 'XBRL', 'Groq', 'ExcelJS'],
    tagline: 'Audit planning from free SEC EDGAR data',
    description: "An audit-planning workspace for any U.S. public company. It surfaces auditor's reports, critical audit matters, material weaknesses, restatements and late filings, benchmarks against industry XBRL percentiles, and generates Excel workpapers and an AI planning-memo draft." },
  { id: 'livegrid', name: 'LiveGrid', kind: 'product', url: 'https://livegrid.onrender.com', shot: true,
    note: 'Free hosting: the first load can take up to a minute.',
    tagline: 'Real-time football stats and match analytics',
    description: 'A sports analytics web app that tracks professional football statistics, historical scoring records, international player metrics and match analytics, including the data pipelines and interactive front end behind the stats views.' },
  { id: 'tether', name: 'Tether', kind: 'product', url: 'https://tether-us.vercel.app', shot: true,
    tagline: 'A web app for couples',
    description: 'A web app for couples that I designed, built and launched, owning product, UI/UX, brand identity and front-end state management end to end. Responsive, and in production on Vercel.' },
  { id: 'near-coffee', name: 'NearCoffee', kind: 'play', url: 'https://www.nearcoffee.space', shot: true,
    stack: ['Vite', 'Vercel'],
    tagline: 'A barn cafe below the Tetons, in a browser tab',
    description: "A cafe concept you can walk into from a browser: a converted barn below the Tetons, with lighting that matches the visitor's local time. Built with Vite and deployed on Vercel." },
  { id: 'livescanner', name: 'LiveScanner', kind: 'product', url: null, status: 'Android app, not on the web',
    stack: ['Kotlin', 'Jetpack Compose', 'Media3', 'Android Auto'],
    tagline: 'Live ATC and scanner feeds for Android Auto',
    description: 'A native Android app that streams 50+ live air-traffic control feeds and police, fire and EMS scanner feeds, sorted by distance. It supports background playback, lock-screen controls, favorites and Android Auto in the car. Built with Kotlin, Jetpack Compose and Media3.' },
  { id: 'hololand', name: 'Hololand', kind: 'client', url: 'https://hololandbd.com', shot: true,
    role: 'Uplift Digital Partners client', stack: ['GSAP', 'Three.js', 'Groq', 'Cloudflare Workers'],
    tagline: 'A clothing brand with a 3D lookbook and AI stylist',
    description: 'The site for a clothing brand in Bangladesh: a GSAP hero, a Three.js 3D lookbook, a shop with WhatsApp checkout, and a bilingual English/Bangla AI stylist, size advisor and gift finder running on Groq through a Cloudflare Worker, with offline fallbacks.' },
  { id: 'sharif-adornment', name: 'Sharif Adornment', kind: 'client', url: 'https://sharifadornment.com', shot: true,
    role: 'Uplift Digital Partners client', stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    tagline: 'A jewelry boutique in Queens, NY',
    description: 'The site for a jewelry boutique in Queens: searchable collections with filters, a page per piece for SEO and link previews, full-screen zoom, rental details and WhatsApp/Messenger enquiries. Dependency-free HTML, CSS and JavaScript on GitHub Pages.' },
  { id: 'maria-closet', name: "Maria's Closet", kind: 'client', url: 'https://maria-closet.vercel.app', shot: true,
    role: 'Uplift Digital Partners client', stack: ['Next.js', 'React Three Fiber', 'Tailwind', 'Supabase'],
    tagline: 'Rental storefront for South Asian outfits',
    description: 'A rental storefront with a 3D garment carousel, availability checks, rental requests and an owner admin. Built with Next.js, React Three Fiber, Tailwind and Supabase.' },
  { id: 'seams-of-safa', name: 'Seams of Safa', kind: 'client', url: 'https://seamsofsafa.vercel.app', shot: true,
    role: 'Uplift Digital Partners client', stack: ['Next.js', 'Sanity CMS', 'next-intl', 'React Three Fiber', 'Groq', 'Resend'],
    tagline: 'Storefront for a clothing label',
    description: 'A storefront for a clothing label, built on Next.js with Sanity CMS, next-intl translations, React Three Fiber, Groq AI and Resend email.' },
  { id: 'mozumder', name: 'Mozumder', kind: 'client', url: 'https://mozumderbd.net', shot: true,
    role: 'Uplift Digital Partners client',
    tagline: 'Logistics company site with a 3D network map',
    description: 'A multi-page site for a logistics and transportation company in Chattogram, with a scroll-driven homepage film and a 3D network map.' },
  { id: 'prime-cookie', name: 'Primé Cookie', kind: 'client', url: 'https://fahimalamwork.github.io/primecookie/', shot: true,
    role: 'Uplift Digital Partners client', stack: ['Vite', 'Three.js'],
    tagline: 'A bakery site you can take a bite out of',
    description: 'A bakery site built with Vite and Three.js, featuring an interactive "take a bite" hero with crumb particles and a waitlist.' },
];

const KINDS = { product: 'Product', client: 'Client site', play: 'Game / experiment', dev: 'In development' };
const FILTERS = [['all', 'All'], ['product', 'Products'], ['client', 'Client sites'], ['play', 'Games & experiments'], ['dev', 'In development']];

const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, '0');
const shotSrc = (p) => `../assets/shots/${p.id}.jpg`;
const phone = window.matchMedia('(max-width: 760px)');
const loupe = document.querySelector('.loupe');
const scrim = $('scrim');

let current = 0;
let filter = 'all';
let lastFrame = null;

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  }
  children.forEach((c) => node.appendChild(c));
  return node;
}

function media(p, alt) {
  return p.shot
    ? el('img', { src: shotSrc(p), alt, width: '1200', height: '750', loading: 'lazy', decoding: 'async' })
    : el('div', { class: 'blank', text: (p.status || 'No public build').toUpperCase() });
}

const matches = (p) => filter === 'all' || p.kind === filter;
// Indexes of the projects the current filter shows, in sheet order.
const shown = () => PROJECTS.map((p, i) => i).filter((i) => matches(PROJECTS[i]));

// Filters
const filterButtons = FILTERS.map(([key, label]) => {
  const count = key === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.kind === key).length;
  const btn = el('button', { type: 'button', 'aria-pressed': String(key === filter) }, [
    document.createTextNode(label), el('span', { text: String(count) }),
  ]);
  btn.addEventListener('click', () => {
    filter = key;
    // Keep the loupe on something the filter actually shows.
    select(matches(PROJECTS[current]) ? current : shown()[0]);
  });
  $('filters').appendChild(btn);
  return { key, btn };
});

// Frames
const arrow = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '12'); svg.setAttribute('height', '12'); svg.setAttribute('viewBox', '0 0 12 12');
  svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M3 9L9 3M4 3h5v5');
  svg.appendChild(path);
  return svg;
};

const frames = PROJECTS.map((p, i) => {
  const btn = el('button', { type: 'button', class: 'frame', 'aria-label': `${p.name} — ${p.tagline}` }, [
    media(p, ''),
    el('span', { class: 'frame-cap' }, [
      el('span', { class: 'no', text: `${pad(i + 1)}A` }),
      el('span', { class: 'name', text: p.name }),
    ]),
    el('span', { class: 'frame-tag', text: p.tagline }),
  ]);
  btn.addEventListener('click', () => { select(i); openSheet(btn); });
  btn.addEventListener('dblclick', () => { if (p.url) window.open(p.url, '_blank', 'noopener'); });
  const li = el('li', {}, [btn]);
  if (p.url) {
    // A direct way out to the live site, shown on hover and on keyboard focus.
    li.appendChild(el('a', {
      class: 'frame-open', href: p.url, target: '_blank', rel: 'noopener',
      'aria-label': `Open ${p.name} live site in a new tab`, title: 'Open live site',
    }, [arrow()]));
  }
  $('frames').appendChild(li);
  return { btn, li };
});

function select(i, { push = true } = {}) {
  current = (i + PROJECTS.length) % PROJECTS.length;
  render();
  if (push) history.replaceState(null, '', `#${PROJECTS[current].id}`);
}

// Step through what the filter shows, wrapping at the ends.
function step(dir) {
  const list = shown();
  const at = list.indexOf(current);
  select(list[(at + dir + list.length) % list.length]);
}

function setLine(id, text) {
  const node = $(id);
  node.hidden = !text;
  node.textContent = text || '';
}

function render() {
  const list = shown();
  filterButtons.forEach(({ key, btn }) => btn.setAttribute('aria-pressed', String(key === filter)));
  frames.forEach(({ btn, li }, i) => {
    li.hidden = !matches(PROJECTS[i]);
    btn.setAttribute('aria-current', String(i === current));
  });
  $('sheet-count').textContent = filter === 'all'
    ? `${PROJECTS.length} FRAMES`
    : `${list.length} OF ${PROJECTS.length} FRAMES`;

  const p = PROJECTS[current];
  $('loupe-count').textContent = `${pad(list.indexOf(current) + 1)} / ${pad(list.length)}`;
  $('loupe-media').replaceChildren(media(p, `${p.name} screenshot`));
  $('loupe-kind').textContent = KINDS[p.kind].toUpperCase();
  $('loupe-name').textContent = p.name;
  $('loupe-tagline').textContent = p.tagline;
  $('loupe-desc').textContent = p.description;
  setLine('loupe-role', p.role);
  setLine('loupe-stack', p.stack ? p.stack.join(' · ') : '');
  setLine('loupe-note', p.note);
  const open = $('loupe-open');
  const status = $('loupe-status');
  if (p.url) {
    open.href = p.url; open.hidden = false; status.hidden = true;
  } else {
    open.hidden = true; open.removeAttribute('href'); status.hidden = false; status.textContent = p.status;
  }
}

// On phones the loupe is a sheet that slides up over the contact sheet.
function openSheet(from) {
  if (!phone.matches) return;
  lastFrame = from || null;
  loupe.classList.add('is-open');
  loupe.scrollTop = 0;
  scrim.hidden = false;
  document.body.classList.add('sheet-open');
  $('loupe-close').focus({ preventScroll: true });
}
function closeSheet() {
  if (!loupe.classList.contains('is-open')) return;
  loupe.classList.remove('is-open');
  scrim.hidden = true;
  document.body.classList.remove('sheet-open');
  if (lastFrame) lastFrame.focus({ preventScroll: true });
}
$('loupe-close').addEventListener('click', closeSheet);
scrim.addEventListener('click', closeSheet);
phone.addEventListener('change', closeSheet);

// Swipe sideways on the sheet to move to the next or previous project.
let touch = null;
loupe.addEventListener('touchstart', (e) => {
  const t = e.changedTouches[0];
  touch = { x: t.clientX, y: t.clientY };
}, { passive: true });
loupe.addEventListener('touchend', (e) => {
  if (!touch || !phone.matches) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touch.x;
  const dy = t.clientY - touch.y;
  touch = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { step(dx < 0 ? 1 : -1); loupe.scrollTop = 0; }
}, { passive: true });

$('prev').addEventListener('click', () => step(-1));
$('next').addEventListener('click', () => step(1));

document.addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  else if (e.key === 'Escape') closeSheet();
  else if (e.key === 'Enter' && e.target === document.body && PROJECTS[current].url) {
    window.open(PROJECTS[current].url, '_blank', 'noopener');
  }
});

const fromHash = PROJECTS.findIndex((p) => `#${p.id}` === location.hash);
select(fromHash >= 0 ? fromHash : 0, { push: false });
// A link straight to a project (lab/#tether) opens its details on phones too.
if (fromHash >= 0) openSheet(null);
