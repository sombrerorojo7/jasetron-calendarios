const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '..');
const csvPath = '/Users/rommelrobertomorabaculima/Desktop/JASETRON AGOSTO/Calendario Agosto 2026 - Revision Final Impares/calendario_jasetron_agosto_2026_final.csv';
const posts = parseCSV(fs.readFileSync(csvPath, 'utf8'));
const weeks = [...new Set(posts.map(p => p.semana))];
const assetFolder = 'assets/jasetron_julio_agosto_v2';
const assetDir = path.join(repo, 'calendarios_finales', assetFolder);
const htmlPath = path.join(repo, 'calendarios_finales', 'calendario_jasetron_seguridad_julio_agosto.html');
const jsonPath = path.join(repo, 'proyectos', 'calendario_jasetron_seguridad_julio_agosto.json');
const media = new Map();
let imageNo = 0;
let reelNo = 0;
for (const post of posts) {
  if (post.tipo_recurso.toLowerCase() === 'video') {
    const n = String(++reelNo).padStart(2, '0');
    media.set(post.id, { type: 'video', src: `${assetFolder}/reel-${n}.mp4`, poster: `${assetFolder}/reel-${n}-poster.jpg` });
  } else {
    media.set(post.id, { type: 'image', src: `${assetFolder}/post-${String(++imageNo).padStart(2, '0')}.jpg` });
  }
}

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const grouped = new Map(weeks.map(w => [w, posts.filter(p => p.semana === w)]));
const cards = post => {
  const m = media.get(post.id);
  const body = m.type === 'video'
    ? `<div class="media-wrap"><span class="media-badge">REEL</span><video src="${m.src}" poster="${m.poster}" controls muted playsinline preload="metadata"></video></div>`
    : `<div class="media-wrap"><span class="media-badge">IMAGEN</span><img src="${m.src}" loading="lazy" decoding="async" alt="${esc(post.titulo)}"></div>`;
  const status = post.estado === 'Publicado' ? 'published' : 'scheduled';
  return `<article class="post-card"><div class="post-media">${body}</div><div class="post-info"><div class="post-meta"><span class="post-date">${esc(post.fecha)}</span><span class="status ${status}">${esc(post.estado)}</span></div><h3>${esc(post.titulo)}</h3><div class="caption">${esc(post.copy).replace(/\n/g, '<br>')}</div></div></article>`;
};
const sections = [...grouped.entries()].map(([week, rows]) => `<section class="week-section"><div class="week-heading"><span></span><h2>${esc(week)}</h2><i></i></div><div class="posts-grid">${rows.map(cards).join('')}</div></section>`).join('');
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Jasetron — Calendario julio-agosto</title><style>*{box-sizing:border-box}body{margin:0;background:#0d0d0d;color:#f0f0f0;font-family:"Gill Sans","Segoe UI",Arial,sans-serif}header{padding:28px 40px;background:#111;border-bottom:2px solid #e21b23;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:flex;align-items:center;gap:16px}.brand img{height:58px;width:auto}.brand h1{margin:0;font-size:34px;letter-spacing:1px}.brand p{margin:5px 0 0;color:#999;font-size:13px;letter-spacing:2px;text-transform:uppercase}.badge{background:#e21b23;color:#fff;border-radius:24px;padding:9px 18px;font-size:12px;font-weight:700}.intro{text-align:center;padding:28px 20px 14px}.intro h2{margin:0;font-size:42px;text-transform:uppercase;letter-spacing:1px}.intro h2 span{color:#e21b23}.intro p{color:#999;margin:8px 0 0}.week-section{padding:18px 40px 22px}.week-heading{display:flex;align-items:center;gap:12px;margin-bottom:16px}.week-heading span{width:9px;height:9px;border-radius:50%;background:#e21b23}.week-heading h2{font-size:19px;letter-spacing:3px;text-transform:uppercase;color:#888;margin:0}.week-heading i{height:1px;background:#292929;flex:1}.posts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px;align-items:start}.post-card{height:760px;background:#161616;border:1px solid #292929;border-radius:12px;overflow:hidden;display:flex;flex-direction:column}.post-media{flex:0 0 auto;aspect-ratio:1/1;background:#111;position:relative}.media-wrap{height:100%;position:relative}.media-wrap img,.media-wrap video{width:100%;height:100%;display:block;object-fit:cover}.media-wrap video{background:#050505}.media-badge{position:absolute;z-index:2;top:12px;left:12px;background:rgba(0,0,0,.72);color:#fff;border-radius:14px;padding:5px 9px;font-size:10px;font-weight:700;letter-spacing:1px}.post-info{padding:18px 20px;min-height:0;display:flex;flex-direction:column;flex:1}.post-meta{display:flex;justify-content:space-between;align-items:center;gap:8px}.post-date{color:#e21b23;font-size:12px;font-weight:700}.status{font-size:10px;text-transform:uppercase;letter-spacing:.8px}.published{color:#28c76f}.scheduled{color:#5599ff}.post-info h3{font-size:21px;line-height:1.15;margin:12px 0 10px}.caption{color:#929292;font-size:12.5px;line-height:1.55;overflow:auto;min-height:0;flex:1;padding-right:8px}footer{text-align:center;color:#555;border-top:1px solid #222;padding:28px 20px;font-size:12px;letter-spacing:1px}@media(max-width:720px){header{padding:22px 18px;align-items:flex-start;flex-direction:column}.brand h1{font-size:27px}.intro h2{font-size:34px}.week-section{padding:16px 18px}.post-card{height:680px}.posts-grid{grid-template-columns:1fr}}</style></head><body><header><div class="brand"><img src="../assets/LOGO-HORIZONTAL-SR.png" alt="Sombrero Rojo"><div><h1>Jasetron Seguridad</h1><p>Calendario de publicaciones · julio-agosto</p></div></div><div class="badge">3 imágenes + 1 reel / semana</div></header><main><div class="intro"><h2>Calendario de <span>contenidos</span></h2><p>Versión final basada en 2X impares · Semana 4 incluye pieza extra</p></div>${sections}</main><footer>Jasetron Seguridad · Sombrero Rojo Marketing Digital · WhatsApp 0967793615</footer></body></html>`;

const jsonPosts = posts.map(post => ({ id: Number(post.id), csvNumber: post.id, week: post.semana, date: post.fecha, publishedDate: post.fecha_publicada || null, title: post.titulo, format: post.formato, mediaType: post.tipo_recurso === 'Video' ? 'video' : 'image', imgSrc: media.get(post.id).type === 'image' ? media.get(post.id).src : null, videoSrc: media.get(post.id).type === 'video' ? media.get(post.id).src : null, posterSrc: media.get(post.id).poster || null, caption: post.copy, status: post.estado, nets: ['FB', 'IG'], sourceAsset: post.asset }));
const project = { version: 2.1, editorVersion: '2.1.0', meta: { clientName: 'Jasetron Seguridad', calendarTitle: 'Julio-Agosto 2026', agencyName: 'Sombrero Rojo Marketing', agencyPhone: '0967793615', approvalStatus: 'aprobado' }, weeks, posts: jsonPosts };
fs.mkdirSync(assetDir, { recursive: true });
fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
fs.writeFileSync(htmlPath, html);
fs.writeFileSync(jsonPath, JSON.stringify(project, null, 2) + '\n');
console.log(JSON.stringify({ htmlPath, jsonPath, assetDir, posts: posts.length, images: imageNo, reels: reelNo, htmlBytes: Buffer.byteLength(html) }, null, 2));

function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"' && quoted && next === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) { if (ch === '\r' && next === '\n') i++; row.push(cell); if (row.some(v => v.trim())) rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  row.push(cell); if (row.some(v => v.trim())) rows.push(row);
  const headers = rows.shift().map(v => v.replace(/^\uFEFF/, '').trim());
  return rows.map(values => Object.fromEntries(headers.map((header, i) => [header, (values[i] || '').trim()])));
}
