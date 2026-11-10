// Usado pela automação "Aprovar música": quando o dono do site marca um pedido (issue)
// com a etiqueta "aprovada", este script tira a música do bloco ```json do pedido,
// confere tudo e grava em musicas/<nome>.json. O texto do pedido é tratado só como dados.
import { existsSync, writeFileSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerMusica, normalizar } from '../js/musica.js';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const corpo = process.env.CORPO || '';
const autor = (process.env.AUTOR || '').replace(/[^A-Za-z0-9-]/g, '');
const limite = (s, n) => String(s || '').trim().slice(0, n);

function falhar(msg) { console.error(msg); process.exit(1); }

const bloco = corpo.match(/```json\s*([\s\S]*?)```/);
if (!bloco) falhar('Não achei o bloco ```json com a música no pedido.');
let dados;
try { dados = JSON.parse(bloco[1]); } catch (e) { falhar('O bloco da música não é um JSON válido: ' + e.message); }

let m;
try { m = lerMusica(dados); } catch (e) { falhar('Música com problema: ' + e.message); }
if (m.totalNotas > 400) falhar('Música grande demais (mais de 400 notas).');

const arquivo = {
  titulo: limite(m.titulo, 100),
  origem: limite(m.origem, 100),
  categoria: m.categoria,
  enviado_por: limite(m.enviado_por, 60) || (autor ? '@' + autor : ''),
  tags: m.tags.slice(0, 15).map(t => limite(t, 40)).filter(Boolean),
  observacoes: limite(m.observacoes, 600),
  frases: m.frasesTexto
};
if (m.ritmo) arquivo.ritmo = m.ritmo;
if (m.redes.length) arquivo.redes = m.redes;
if (!m.editavel) arquivo.editavel = false;
if (m.baseada) arquivo.baseada_em = m.baseada;

let base = normalizar(arquivo.titulo).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'musica';
let id = base, n = 2;
while (existsSync(join(raiz, 'musicas', id + '.json'))) id = base + '-' + n++;

writeFileSync(join(raiz, 'musicas', id + '.json'), JSON.stringify(arquivo, null, 2) + '\n');
console.log('Gravado musicas/' + id + '.json');
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, 'id=' + id + '\n' + 'titulo=' + arquivo.titulo.replace(/[\r\n]/g, ' ') + '\n');
}
