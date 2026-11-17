// Ejecutar únicamente dentro del alcance y horario acordados para las pruebas.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const cypressPackage = require('cypress/package.json');
const cypressBin = path.resolve(path.dirname(require.resolve('cypress/package.json')), cypressPackage.bin.cypress);
const id = new Date().toISOString().replace(/[:.]/g, '-');
const relative = `evidencias/funcionales/${id}`;
const directory = path.join(root, relative);
const hashes = {};
function fingerprint(folder) {
  for (const entry of fs.readdirSync(path.join(root, folder), { withFileTypes: true })) {
    const file = `${folder}/${entry.name}`;
    if (entry.isDirectory()) fingerprint(file);
    else if (file.endsWith('.js')) {
      hashes[file] = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
    }
  }
}
fingerprint('cypress/e2e');
fingerprint('cypress/support');
hashes['cypress.config.js'] = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'cypress.config.js'))).digest('hex');
const metadata = {
  inicioUTC: new Date().toISOString(), zonaInforme: 'America/Bogota',
  node: process.version, cypress: require('cypress/package.json').version,
  comando: 'npm run test:evidence', hashes,
  estado: 'En ejecución',
};
fs.mkdirSync(directory, { recursive: true });
const metaPath = path.join(directory, 'ejecucion.json');
fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
const output = fs.createWriteStream(path.join(directory, 'consola.txt'));
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;
const child = spawn(process.execPath, [
  cypressBin, 'run',
  '--config', `videosFolder=${relative}/videos,screenshotsFolder=${relative}/screenshots`,
], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
for (const [stream, destination] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
  stream.on('data', (data) => { output.write(data); destination.write(data); });
}
child.on('error', (error) => {
  metadata.error = error.message;
});
child.on('close', (code, signal) => {
  metadata.finUTC = new Date().toISOString();
  metadata.codigoSalida = code;
  metadata.signal = signal;
  metadata.estado = code === 0 ? 'Ejecución completada; consultar casos en consola.txt' : 'Fallida o interrumpida; consultar consola.txt';
  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
  output.end();
  console.log(`\nEvidencia local: ${directory}`);
  process.exitCode = code === 0 ? 0 : 1;
});
