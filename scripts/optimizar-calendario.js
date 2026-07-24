#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const [, , rawBase, ...flags] = process.argv;
const dryRun = flags.includes('--dry-run');

if (!rawBase) {
  console.error('Uso: node scripts/optimizar-calendario.js <nombre-base> [--dry-run]');
  process.exit(1);
}

const base = path.basename(rawBase).replace(/\.html$/i, '');
const htmlPath = path.join(ROOT, 'calendarios_finales', base + '.html');
if (!fs.existsSync(htmlPath)) fail('No existe: ' + htmlPath);

let html = fs.readFileSync(htmlPath, 'utf8');
const refs = [...html.matchAll(/(?:src|poster)="(assets\/[^"?]+\.(?:png|jpe?g|webp|gif|mp4|webm|mov))"/gi)]
  .map(match => match[1]);
const uniqueRefs = [...new Set(refs)];
const folderCounts = new Map();
for (const ref of uniqueRefs) {
  const folder = ref.match(/^assets\/([^/]+)\//)?.[1];
  if (folder) folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
}
const primaryFolder = [...folderCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
const alreadyOptimized = Boolean(primaryFolder?.endsWith('_optimized'));
const optimizedFolder = alreadyOptimized ? primaryFolder : primaryFolder + '_optimized';
const replacements = new Map();
let optimized = 0;
let skipped = 0;
let beforeBytes = 0;
let afterBytes = 0;

for (const ref of uniqueRefs) {
  if (!primaryFolder || !ref.startsWith('assets/' + primaryFolder + '/')) { skipped++; continue; }
  const source = path.join(path.dirname(htmlPath), ref);
  if (!fs.existsSync(source)) { skipped++; continue; }
  const ext = path.extname(source).toLowerCase();
  const targetRef = ref.replace('assets/' + primaryFolder + '/', 'assets/' + optimizedFolder + '/')
    .replace(/\.(png|jpe?g|webp|gif)$/i, '.jpg')
    .replace(/\.(mp4|webm|mov)$/i, '.mp4');
  const target = path.join(path.dirname(htmlPath), targetRef);
  const targetDir = path.dirname(target);
  const sourceSize = fs.statSync(source).size;
  beforeBytes += sourceSize;
  if (!dryRun) fs.mkdirSync(targetDir, { recursive: true });

  if (dryRun || alreadyOptimized) {
    console.log(`${ref} -> ${targetRef}`);
    continue;
  }

  const isVideo = /\.(mp4|webm|mov)$/i.test(ext);
  const ok = isVideo ? optimizeVideo(source, target) : optimizeImage(source, target);
  if (!ok || !fs.existsSync(target)) { skipped++; continue; }
  const targetSize = fs.statSync(target).size;
  if (targetSize >= sourceSize) {
    fs.rmSync(target, { force: true });
    skipped++;
    continue;
  }
  afterBytes += targetSize;
  replacements.set(ref, targetRef);
  optimized++;
}

if (!dryRun) {
  for (const [from, to] of replacements) html = html.split(from).join(to);
  html = html.replace(/preload="metadata"/gi, 'preload="none"');
  html = html.replace(/<img\b[^>]*>/gi, tag => /\bloading\s*=/.test(tag) ? tag : tag.replace('<img', '<img loading="lazy"'));
  fs.writeFileSync(htmlPath, html);
}

console.log(JSON.stringify({ base, optimized, skipped, beforeBytes, afterBytes, dryRun }, null, 2));

function optimizeImage(source, target) {
  const result = spawnSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '--resampleWidth', '1200', source, '--out', target], { stdio: 'ignore' });
  return result.status === 0;
}

function optimizeVideo(source, target) {
  const common = ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-vf', 'scale=720:-2:force_original_aspect_ratio=decrease', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', target];
  let result = spawnSync('ffmpeg', [...common.slice(0, -1), '-c:v', 'h264_videotoolbox', '-b:v', '1200k', common.at(-1)], { stdio: 'ignore' });
  if (result.status !== 0) result = spawnSync('ffmpeg', [...common.slice(0, -1), '-c:v', 'libx264', '-preset', 'medium', '-crf', '29', common.at(-1)], { stdio: 'ignore' });
  return result.status === 0;
}

function fail(message) {
  console.error('Error: ' + message);
  process.exit(1);
}
