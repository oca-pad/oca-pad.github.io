// Lê todas as músicas da pasta "musicas" e gera o arquivo indice.json usado pela busca.
// Roda sozinho no GitHub a cada mudança. Se uma música tiver erro, avisa qual e para.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerMusica } from '../js/musica.js';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const pasta = join(raiz, 'musicas');
const arquivos = readdirSync(pasta).filter(f => f.endsWith('.json')).sort();
const lista = [];
const erros = [];

for (const arq of arquivos) {
  const id = arq.replace(/\.json$/, '');
  if (!/^[a-z0-9-]+$/.test(id)) { erros.push(arq + ': o nome do arquivo deve ter só letras minúsculas sem acento, números e "-"'); continue; }
  try {
    const m = lerMusica(JSON.parse(readFileSync(join(pasta, arq), 'utf8')));
    lista.push({
      id, titulo: m.titulo, origem: m.origem, categoria: m.categoria,
      enviado_por: m.enviado_por, tags: m.tags, dificuldade: m.dificuldade, notas: m.totalNotas, ritmo: !!m.ritmo
    });
  } catch (e) {
    erros.push(arq + ': ' + e.message);
  }
}

if (erros.length) {
  console.error('Músicas com problema:\n- ' + erros.join('\n- '));
  process.exit(1);
}
lista.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt'));
writeFileSync(join(raiz, 'indice.json'), JSON.stringify({ gerado_em: new Date().toISOString(), musicas: lista }, null, 1));
console.log('indice.json gerado com ' + lista.length + ' músicas.');
