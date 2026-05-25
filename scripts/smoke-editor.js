const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {URL: NodeURL} = require('node:url');

const repoRoot = path.resolve(__dirname, '..');
const editorPath = path.join(repoRoot, 'panel_jasetron_HORIZONTAL.html');
const editorHtml = fs.readFileSync(editorPath, 'utf8');
const scriptMatch = editorHtml.match(/<script>([\s\S]*)<\/script>\s*<\/body>/);

if (!scriptMatch) {
  throw new Error('No se encontro el script principal del editor.');
}

class FakeFileReader {
  readAsText(file) {
    this.onload({target: {result: file.text}});
  }

  readAsDataURL(file) {
    this.onload({target: {result: file.dataUrl}});
  }
}

function buildDocument(downloads) {
  const elements = new Map();
  return {
    body: {
      appendChild() {}
    },
    createElement(tag) {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click() {
            downloads.push({href: this.href, filename: this.download});
          },
          remove() {}
        };
      }
      return {
        className: '',
        textContent: '',
        remove() {}
      };
    },
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, {
          id,
          value: '',
          textContent: '',
          innerHTML: '',
          style: {},
          classList: {
            add(className) {
              this[className] = true;
            },
            remove(className) {
              this[className] = false;
            },
            toggle() {}
          }
        });
      }
      return elements.get(id);
    },
    querySelectorAll() {
      return [];
    }
  };
}

function createContext(protocol = 'https:') {
  const downloads = [];
  const alerts = [];
  const document = buildDocument(downloads);
  const context = {
    console,
    setTimeout(fn) {
      fn();
    },
    URL: Object.assign(NodeURL, {
      createObjectURL(blob) {
        context.lastBlob = blob;
        return 'blob:https://sombrerorojo7.github.io/generated-smoke';
      },
      revokeObjectURL() {}
    }),
    Blob,
    FileReader: FakeFileReader,
    document,
    location: {
      protocol,
      href: protocol === 'file:'
        ? 'file:///Users/rommelrobertomorabaculima/Desktop/jasetron-calendarios/panel_jasetron_HORIZONTAL.html'
        : 'https://sombrerorojo7.github.io/jasetron-calendarios/panel_jasetron_HORIZONTAL.html'
    },
    alert(message) {
      alerts.push(String(message));
    },
    confirm() {
      return true;
    },
    addEventListener(event, callback) {
      if (event === 'DOMContentLoaded') callback();
    },
    alerts,
    downloads,
    lastBlob: null
  };
  context.window = context;
  return context;
}

async function runHappyPath() {
  const context = createContext('https:');
  vm.createContext(context);
  vm.runInContext(scriptMatch[1], context);

  // Set meta for a generic test client before importing
  context.projectMeta = {
    clientName: 'Cliente Prueba',
    calendarTitle: 'Mayo Junio 2026',
    agencyName: 'Sombrero Rojo Marketing',
    agencyPhone: '0967793615'
  };

  const csv = [
    'Post #;Semana;Fecha Estimada;Titulo;Copy;Estado',
    '1;Semana Test;25/05/2026;Prueba CSV;Copy desde CSV;Programado'
  ].join('\n');

  context.importCSV({files: [{text: csv}], value: 'csv'});
  context.importImages({
    files: [{
      name: 'post 1.png',
      type: 'image/png',
      dataUrl: 'data:image/png;base64,SMOKEIMAGE'
    }],
    value: 'images'
  });

  await Promise.resolve();
  await context.saveProject();
  const jsonBlob = context.lastBlob;
  const jsonText = await jsonBlob.text();

  await context.exportCalendar();
  const htmlBlob = context.lastBlob;
  const exportedHtml = await htmlBlob.text();

  const jsonDownload = context.downloads.find(item => item.filename.endsWith('.json'));
  const htmlDownload = context.downloads.find(item => item.filename.endsWith('.html'));

  if (!jsonDownload) throw new Error('Guardar no genero descarga JSON.');
  if (!htmlDownload) throw new Error('Exportar no genero descarga HTML.');
  if (jsonBlob.size === 0) throw new Error('El JSON generado pesa 0 bytes.');
  if (htmlBlob.size === 0) throw new Error('El HTML generado pesa 0 bytes.');
  if (!jsonDownload.filename.startsWith('calendario_')) {
    throw new Error('El nombre del JSON no empieza con calendario_: ' + jsonDownload.filename);
  }
  if (!htmlDownload.filename.startsWith('calendario_')) {
    throw new Error('El nombre del HTML no empieza con calendario_: ' + htmlDownload.filename);
  }
  if (jsonText.includes('file://')) throw new Error('El JSON contiene file://.');
  if (exportedHtml.includes('file://')) throw new Error('El HTML contiene file://.');
  if (!exportedHtml.includes('data:image/png;base64,SMOKEIMAGE')) {
    throw new Error('El HTML exportado no incluyo la imagen cargada.');
  }
  if (!exportedHtml.includes('https://sombrerorojo7.github.io/jasetron-calendarios/LOGO-HORIZONTAL-SR.png')) {
    throw new Error('El logo de la agencia exportado no apunta a GitHub Pages.');
  }
  if (!exportedHtml.includes('WhatsApp 0998068900')) {
    throw new Error('El footer exportado no incluye el WhatsApp correcto.');
  }
  if (!exportedHtml.includes('sombrerorojo.net')) {
    throw new Error('El footer exportado no incluye el sitio web correcto.');
  }

  return {
    json: {filename: jsonDownload.filename, bytes: jsonBlob.size},
    html: {filename: htmlDownload.filename, bytes: htmlBlob.size}
  };
}

async function runFileProtocolGuard() {
  const context = createContext('file:');
  vm.createContext(context);
  vm.runInContext(scriptMatch[1], context);

  await context.saveProject();

  if (context.downloads.length !== 0) {
    throw new Error('file:// no debe iniciar descargas.');
  }
  if (!context.alerts.some(message => message.includes('GitHub Pages o localhost'))) {
    throw new Error('file:// debe mostrar aviso claro.');
  }
}

(async () => {
  const result = await runHappyPath();
  await runFileProtocolGuard();
  console.log(JSON.stringify({
    ok: true,
    result
  }, null, 2));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
