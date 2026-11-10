// Servidor simples para ver o site no seu PC (http://localhost:8080). Feche a janela para parar.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
let porta = Number(process.env.PORT) || 8080;

const servidor = createServer(async (req, res) => {
  let caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (caminho.endsWith('/')) caminho += 'index.html';
  const arquivo = normalize(join(raiz, caminho));
  if (!arquivo.startsWith(raiz)) { res.writeHead(403).end(); return; }
  try {
    const dados = await readFile(arquivo);
    res.writeHead(200, { 'Content-Type': tipos[extname(arquivo)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(dados);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
  }
});
// se a porta estiver ocupada, tenta a próxima
servidor.on('error', e => {
  if (e.code === 'EADDRINUSE' && porta < 8100) { porta++; servidor.listen(porta, '127.0.0.1'); }
  else { console.error('Não consegui abrir o servidor:', e.message); process.exit(1); }
});
servidor.on('listening', () => {
  const url = 'http://localhost:' + porta;
  console.log('Site rodando em ' + url + '  (feche esta janela para parar)');
  if (process.env.ABRIR_NAVEGADOR) exec(process.platform === 'win32' ? 'start "" ' + url : 'open ' + url);
});
servidor.listen(porta, '127.0.0.1');
