// The Lab — a contact sheet of every project.
// Add or edit projects in PROJECTS. A project with `shot: true` shows assets/shots/<id>.jpg;
// one without a `url` shows its `status` instead of a live link.
const PROJECTS = [
  { id: 'bandartrade', name: 'BandarTrade', kind: 'product', url: 'https://bandartrade.com', shot: true,
    tagline: 'AI-assisted freight quoting for Bangladesh',
    description: 'A live freight quoting and port trading platform built for Bangladesh. Its quoting engine turns unstructured rate requests like "2x 40ft containers, Shanghai to Chittagong" into priced quotes: an LLM extracts the route and container details, then carrier rates, trucking costs and client markups are applied. Built on .NET 8, SQL Server and React.' },
  { id: 'uplift', name: 'Uplift Digital Partners', kind: 'client', url: 'https://upliftdigitalpartners.com', shot: true,
    tagline: 'A web agency for local small businesses',
    description: 'A web agency I co-founded that builds and modernizes websites and apps for local small businesses. The company site runs on GitHub Pages with a custom domain, and includes a conversational booking assistant that sends confirmation emails and one-click Google Calendar invites.' },
  { id: 'dishcover', name: 'Dishcover', kind: 'product', url: 'https://dishcover-two.vercel.app', shot: true,
    tagline: 'A restaurant answer engine for travelers',
    description: 'A mobile-first PWA that shows 3 to 5 nearby restaurants by mood and budget, each with its most-praised dishes and prices. An LLM extracts top dishes from review text, stored in Supabase by place to keep API costs near zero, with optional Halal, Kosher, vegetarian and vegan filters.' },
  { id: 'okdoc', name: 'OkDoc', kind: 'dev', url: null, status: 'In development',
    tagline: 'Which doctors near me take my insurance?',
    description: 'An in-network doctor finder, starting with Medicare Advantage plans in NYC. It syncs public CMS-mandated provider directory FHIR APIs and the NPI Registry into Postgres through payer adapters, labels every result with its source and freshness, and is built for 12 languages to WCAG 2.2 AA.' },
  { id: 'night-walker', name: 'Night Walker NYC', kind: 'play', url: 'https://three-js-brainstorm.vercel.app', shot: true,
    tagline: 'A cel-shaded browser game set in New York',
    description: 'A comic-style game set in New York neighborhoods, playable on desktop and phone, with walking, biking and driving. Every street, building, crowd, traffic pattern and sound is generated in code, with a day-to-night cycle and subway travel between neighborhoods. Built with Three.js.' },
  { id: 'anima-fy', name: 'Anima-Fy', kind: 'product', url: 'https://animafy-ai.vercel.app', shot: true,
    tagline: 'Audit planning from free SEC EDGAR data',
    description: "An audit-planning workspace for any U.S. public company. It surfaces auditor's reports, critical audit matters, material weaknesses, restatements and late filings, benchmarks against industry XBRL percentiles, and generates Excel workpapers and an AI planning-memo draft." },
  { id: 'livegrid', name: 'LiveGrid', kind: 'product', url: 'https://livegrid.onrender.com', shot: true,
    tagline: 'Real-time football stats and match analytics',
    description: 'A sports analytics web app that tracks professional football statistics, historical scoring records, international player metrics and match analytics, including the data pipelines and interactive front end behind the stats views.' },
  { id: 'tether', name: 'Tether', kind: 'product', url: 'https://tether-us.vercel.app', shot: true,
    tagline: 'A web app for couples',
    description: 'A web app for couples that I designed, built and launched, owning product, UI/UX, brand identity and front-end state management end to end. Responsive, and in production on Vercel.' },
  { id: 'near-coffee', name: 'NearCoffee', kind: 'play', url: 'https://www.nearcoffee.space', shot: true,
    tagline: 'A barn cafe below the Tetons, in a browser tab',
    description: "A cafe concept you can walk into from a browser: a converted barn below the Tetons, with lighting that matches the visitor's local time. Built with Vite and deployed on Vercel." },
  { id: 'livescanner', name: 'LiveScanner', kind: 'product', url: null, status: 'Android app, not on the web',
    tagline: 'Live ATC and scanner feeds for Android Auto',
    description: 'A native Android app that streams 50+ live air-traffic control feeds and police, fire and EMS scanner feeds, sorted by distance. It supports background playback, lock-screen controls, favorites and Android Auto in the car. Built with Kotlin, Jetpack Compose and Media3.' },
  { id: 'hololand', name: 'Hololand', kind: 'client', url: 'https://hololandbd.com', shot: true,
    tagline: 'A clothing brand with a 3D lookbook and AI stylist',
    description: 'The site for a clothing brand in Bangladesh: a GSAP hero, a Three.js 3D lookbook, a shop with WhatsApp checkout, and a bilingual English/Bangla AI stylist, size advisor and gift finder running on Groq through a Cloudflare Worker, with offline fallbacks.' },
  { id: 'sharif-adornment', name: 'Sharif Adornment', kind: 'client', url: 'https://sharifadornment.com', shot: true,
    tagline: 'A jewelry boutique in Queens, NY',
    description: 'The site for a jewelry boutique in Queens: searchable collections with filters, a page per piece for SEO and link previews, full-screen zoom, rental details and WhatsApp/Messenger enquiries. Dependency-free HTML, CSS and JavaScript on GitHub Pages.' },
  { id: 'maria-closet', name: "Maria's Closet", kind: 'client', url: 'https://maria-closet.vercel.app', shot: true,
    tagline: 'Rental storefront for South Asian outfits',
    description: 'A rental storefront with a 3D garment carousel, availability checks, rental requests and an owner admin. Built with Next.js, React Three Fiber, Tailwind and Supabase.' },
  { id: 'seams-of-safa', name: 'Seams of Safa', kind: 'client', url: 'https://seamsofsafa.vercel.app', shot: true,
    tagline: 'Storefront for a clothing label',
    description: 'A storefront for a clothing label, built on Next.js with Sanity CMS, next-intl translations, React Three Fiber, Groq AI and Resend email.' },
  { id: 'mozumder', name: 'Mozumder', kind: 'client', url: 'https://mozumderbd.net', shot: true,
    tagline: 'Logistics company site with a 3D network map',
    description: 'A multi-page site for a logistics and transportation company in Chattogram, with a scroll-driven homepage film and a 3D network map.' },
  { id: 'prime-cookie', name: 'Primé Cookie', kind: 'client', url: 'https://fahimalamwork.github.io/primecookie/', shot: true,
    tagline: 'A bakery site you can take a bite out of',
    description: 'A bakery site built with Vite and Three.js, featuring an interactive "take a bite" hero with crumb particles and a waitlist.' },
];

const KINDS = { product: 'Product', client: 'Client site', play: 'Game / experiment', dev: 'In development' };
const FILTERS = [['all', 'All'], ['product', 'Products'], ['client', 'Client sites'], ['play', 'Games & experiments'], ['dev', 'In development']];

const $ = (id) => document.getElementById(id);
const pad = (n) => String(n + 1).padStart(2, '0');
const shotSrc = (p) => `../assets/shots/${p.id}.jpg`;

let current = 0;
let filter = 'all';

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

// Filters
const filterButtons = FILTERS.map(([key, label]) => {
  const count = key === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.kind === key).length;
  const btn = el('button', { type: 'button', 'aria-pressed': String(key === filter) }, [
    document.createTextNode(label), el('span', { text: String(count) }),
  ]);
  btn.addEventListener('click', () => { filter = key; render(); });
  $('filters').appendChild(btn);
  return { key, btn };
});

// Frames
const frameButtons = PROJECTS.map((p, i) => {
  const btn = el('button', { type: 'button', class: 'frame', 'aria-label': `${p.name} — ${p.tagline}` }, [
    media(p, ''),
    el('span', { class: 'frame-cap' }, [
      el('span', { class: 'no', text: `${pad(i)}A` }),
      el('span', { class: 'name', text: p.name }),
    ]),
  ]);
  btn.addEventListener('click', () => {
    select(i);
    // On phones the loupe sits below the sheet; bring it into view so the tap visibly does something.
    if (window.matchMedia('(max-width: 760px)').matches) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.querySelector('.loupe').scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    }
  });
  btn.addEventListener('dblclick', () => { if (p.url) window.open(p.url, '_blank', 'noopener'); });
  $('frames').appendChild(el('li', {}, [btn]));
  return btn;
});

function select(i, { push = true } = {}) {
  current = (i + PROJECTS.length) % PROJECTS.length;
  render();
  if (push) history.replaceState(null, '', `#${PROJECTS[current].id}`);
}

function render() {
  filterButtons.forEach(({ key, btn }) => btn.setAttribute('aria-pressed', String(key === filter)));
  frameButtons.forEach((btn, i) => {
    const p = PROJECTS[i];
    btn.classList.toggle('is-dim', filter !== 'all' && p.kind !== filter);
    btn.setAttribute('aria-current', String(i === current));
  });

  const p = PROJECTS[current];
  $('loupe-count').textContent = `${pad(current)} / ${PROJECTS.length}`;
  $('loupe-media').replaceChildren(media(p, `${p.name} screenshot`));
  $('loupe-kind').textContent = KINDS[p.kind].toUpperCase();
  $('loupe-name').textContent = p.name;
  $('loupe-tagline').textContent = p.tagline;
  $('loupe-desc').textContent = p.description;
  const open = $('loupe-open');
  const status = $('loupe-status');
  if (p.url) {
    open.href = p.url; open.hidden = false; status.hidden = true;
  } else {
    open.hidden = true; open.removeAttribute('href'); status.hidden = false; status.textContent = p.status;
  }
}

$('prev').addEventListener('click', () => select(current - 1));
$('next').addEventListener('click', () => select(current + 1));

document.addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); select(current + 1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); select(current - 1); }
  else if (e.key === 'Enter' && e.target === document.body && PROJECTS[current].url) {
    window.open(PROJECTS[current].url, '_blank', 'noopener');
  }
});

const fromHash = PROJECTS.findIndex((p) => `#${p.id}` === location.hash);
select(fromHash >= 0 ? fromHash : 0, { push: false });
