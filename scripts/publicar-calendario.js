#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const DOWNLOADS = path.join(os.homedir(), 'Downloads');
const PROJECTS_DIR = path.join(ROOT, 'proyectos');
const FINALS_DIR = path.join(ROOT, 'calendarios_finales');
const PROJECT_MANIFEST = path.join(PROJECTS_DIR, 'manifest.json');
const FINAL_MANIFEST = path.join(FINALS_DIR, 'manifest.json');

function usage(){
  console.log('Uso:');
  console.log('  node scripts/publicar-calendario.js');
  console.log('  node scripts/publicar-calendario.js calendario_jasetron_seguridad_mayo_junio_2026');
  console.log('  node scripts/publicar-calendario.js --json ~/Downloads/archivo.json --html ~/Downloads/archivo.html');
  console.log('');
  console.log('Opciones:');
  console.log('  --move      Mueve los archivos desde Descargas en vez de copiarlos');
  console.log('  --dry-run   Valida y muestra lo que haria sin copiar nada');
}

function expandHome(value){
  if(!value) return value;
  return value.replace(/^~(?=$|\/)/, os.homedir());
}

function parseArgs(argv){
  const options = { move: false, dryRun: false, base: null, json: null, html: null };
  for(let i = 0; i < argv.length; i += 1){
    const arg = argv[i];
    if(arg === '--help' || arg === '-h') options.help = true;
    else if(arg === '--move') options.move = true;
    else if(arg === '--dry-run') options.dryRun = true;
    else if(arg === '--json') options.json = expandHome(argv[++i]);
    else if(arg === '--html') options.html = expandHome(argv[++i]);
    else if(!options.base) options.base = arg.replace(/\.(json|html)$/i, '');
    else throw new Error('Argumento no reconocido: ' + arg);
  }
  return options;
}

function assertFile(file, ext){
  if(!file) throw new Error('No se encontro archivo .' + ext);
  if(!fs.existsSync(file)) throw new Error('No existe: ' + file);
  const stat = fs.statSync(file);
  if(!stat.isFile()) throw new Error('No es un archivo: ' + file);
  if(stat.size === 0) throw new Error('Archivo vacio, no se publica: ' + file);
  if(path.extname(file).toLowerCase() !== '.' + ext) throw new Error('Extension incorrecta para ' + file);
  return stat;
}

function listDownloads(ext){
  if(!fs.existsSync(DOWNLOADS)) return [];
  return fs.readdirSync(DOWNLOADS)
    .filter(name => name.toLowerCase().endsWith('.' + ext))
    .map(name => path.join(DOWNLOADS, name))
    .filter(file => fs.statSync(file).isFile())
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
}

function findByBase(base, ext){
  const file = path.join(DOWNLOADS, base + '.' + ext);
  if(fs.existsSync(file)) return file;
  const numbered = listDownloads(ext).find(candidate => {
    const name = path.basename(candidate);
    return name === base + '.' + ext || name.startsWith(base + ' (');
  });
  return numbered || null;
}

function findLatestPair(){
  const jsonFiles = listDownloads('json').filter(f => path.basename(f).startsWith('calendario_'));
  const htmlFiles = listDownloads('html').filter(f => path.basename(f).startsWith('calendario_'));
  for(const jsonFile of jsonFiles){
    const base = path.basename(jsonFile, '.json').replace(/ \(\d+\)$/, '');
    const htmlFile = htmlFiles.find(f => path.basename(f, '.html').replace(/ \(\d+\)$/, '') === base);
    if(htmlFile) return { jsonFile, htmlFile };
  }
  return { jsonFile: jsonFiles[0] || null, htmlFile: htmlFiles[0] || null };
}

function readProjectInfo(jsonFile){
  const raw = fs.readFileSync(jsonFile, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new Error('JSON invalido: ' + jsonFile);
  }
  const clientName = data.clientName || data.cliente || data.meta?.clientName || 'Calendario';
  const calendarTitle = data.calendarTitle || data.titulo || data.meta?.calendarTitle || '';
  const title = [clientName, calendarTitle].filter(Boolean).join(' - ');
  return { title: title || titleFromFile(path.basename(jsonFile)), clientName, calendarTitle };
}

function validateHtml(htmlFile){
  const html = fs.readFileSync(htmlFile, 'utf8');
  if(!/<html[\s>]/i.test(html) || !/<body[\s>]/i.test(html)){
    throw new Error('HTML invalido: ' + htmlFile);
  }
}

function titleFromFile(name){
  return name
    .replace(/\.(json|html)$/i, '')
    .replace(/^calendario[_-]?/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function readManifest(file){
  if(!fs.existsSync(file)) return [];
  try {
    const value = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    throw new Error('Manifest invalido: ' + file);
  }
}

function writeManifest(file, entry){
  const items = readManifest(file).filter(item => item.file !== entry.file);
  items.unshift(entry);
  fs.writeFileSync(file, JSON.stringify(items, null, 2) + '\n');
}

function publishFile(source, targetDir, dryRun, move){
  const target = path.join(targetDir, path.basename(source).replace(/ \(\d+\)(?=\.)/, ''));
  if(dryRun){
    console.log('[dry-run] ' + (move ? 'Moveria' : 'Copiaria') + ': ' + source);
    console.log('[dry-run]       hacia: ' + target);
    return target;
  }
  fs.mkdirSync(targetDir, { recursive: true });
  if(move) fs.renameSync(source, target);
  else fs.copyFileSync(source, target);
  return target;
}

function main(){
  const options = parseArgs(process.argv.slice(2));
  if(options.help){
    usage();
    return;
  }

  let jsonFile = options.json;
  let htmlFile = options.html;
  if(options.base){
    jsonFile = jsonFile || findByBase(options.base, 'json');
    htmlFile = htmlFile || findByBase(options.base, 'html');
  }
  if(!jsonFile || !htmlFile){
    const latest = findLatestPair();
    jsonFile = jsonFile || latest.jsonFile;
    htmlFile = htmlFile || latest.htmlFile;
  }

  assertFile(jsonFile, 'json');
  assertFile(htmlFile, 'html');
  const info = readProjectInfo(jsonFile);
  validateHtml(htmlFile);

  const projectTarget = publishFile(jsonFile, PROJECTS_DIR, options.dryRun, options.move);
  const finalTarget = publishFile(htmlFile, FINALS_DIR, options.dryRun, options.move);

  const projectEntry = {
    title: info.title,
    file: path.basename(projectTarget),
    description: 'Archivo editable para continuar el calendario.'
  };
  const finalEntry = {
    title: info.title,
    file: path.basename(finalTarget),
    description: 'Calendario final publicado para cliente.'
  };

  if(options.dryRun){
    console.log('[dry-run] Actualizaria: proyectos/manifest.json');
    console.log('[dry-run] Actualizaria: calendarios_finales/manifest.json');
  } else {
    writeManifest(PROJECT_MANIFEST, projectEntry);
    writeManifest(FINAL_MANIFEST, finalEntry);
  }

  console.log('Publicado correctamente:');
  console.log('  JSON: ' + path.relative(ROOT, projectTarget));
  console.log('  HTML: ' + path.relative(ROOT, finalTarget));
  console.log('  Titulo: ' + info.title);
  if(!options.dryRun){
    console.log('');
    console.log('Siguiente paso para GitHub Pages:');
    console.log('  git add proyectos calendarios_finales');
    console.log('  git commit -m "publica calendario ' + path.basename(finalTarget, '.html') + '"');
    console.log('  git push');
  }
}

try {
  main();
} catch (error) {
  console.error('Error: ' + error.message);
  console.error('');
  usage();
  process.exit(1);
}
