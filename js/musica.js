// Lógica pura das músicas (sem página): ler notas, dificuldade e link de compartilhar.
// Funciona no navegador e no Node (o gerador de índice usa este mesmo arquivo).
//
// Uma nota é escrita assim:  [modificador:]BOTÃO[?]
//   BOTÃO (padrão do Switch): L, R, A, X, Y
//   modificador: up (analógico ↑), down (analógico ↓), dpad (direcional ↓), dpadup (direcional ↑),
//                down+dpad (analógico ↓ e direcional ↓). Sem modificador = nada.
//   Vários modificadores aceitos: separe com "/" (o primeiro é o que aparece).
//   "?" no fim = nota ainda não confirmada (aparece pontilhada).
//   "-" (ou "pausa") = nota que a ocarina não alcança ou espera: aparece como pausa e é pulada.
// Exemplos: "A", "down:A", "up:L", "down+dpad:L", "dpad/down+dpad:A?", "-"
//
// Extensão da ocarina (para o editor validar): do Si grave (down+dpad:L) até o Ré agudo (X)
// e o que os modificadores alcançarem acima disso. Abaixo do Si grave, use pausa.

export const BOTOES = ['L', 'R', 'A', 'X', 'Y'];
export const MODIFICADORES = ['', 'up', 'down', 'dpad', 'dpadup', 'down+dpad'];
export const CATEGORIAS = {
  zelda: 'The Legend of Zelda', anime: 'Anime', jogo: 'Outros jogos', filme: 'Filme', serie: 'Série', musica: 'Música', outro: 'Outro'
};
// Redes sociais de quem enviou: só o @usuário é guardado; o link é montado aqui
// (assim ninguém consegue colocar um endereço qualquer na página).
export const REDES = {
  instagram: { nome: 'Instagram', url: u => 'https://www.instagram.com/' + u + '/' },
  x: { nome: 'X (Twitter)', url: u => 'https://x.com/' + u },
  youtube: { nome: 'YouTube', url: u => 'https://www.youtube.com/@' + u },
  twitch: { nome: 'Twitch', url: u => 'https://www.twitch.tv/' + u },
  tiktok: { nome: 'TikTok', url: u => 'https://www.tiktok.com/@' + u }
};
export const MAX_REDES = 5;
// Aceita "@fulano", "fulano" ou o link colado (tira o usuário do link).
export function limparUsuario(v) {
  let s = String(v || '').trim();
  const m = s.match(/^(?:https?:\/\/)?(?:www\.)?[^/\s]+\.[a-z]{2,}\/@?([^/?#\s]+)/i);
  if (m) s = m[1];
  return s.replace(/^@/, '');
}
export const usuarioValido = u => /^[A-Za-z0-9._-]{1,40}$/.test(u);
export function lerRedes(redes) {
  if (redes == null) return [];
  if (!Array.isArray(redes)) throw new Error('"redes" precisa ser uma lista');
  if (redes.length > MAX_REDES) throw new Error('no máximo ' + MAX_REDES + ' redes sociais');
  return redes.map(r => {
    const tipo = String((r && r.tipo) || '');
    if (!REDES[tipo]) throw new Error('rede social desconhecida "' + tipo + '"');
    const valor = limparUsuario(r.valor);
    if (!usuarioValido(valor)) throw new Error('usuário de ' + REDES[tipo].nome + ' inválido: "' + String(r.valor || '').slice(0, 40) + '"');
    return { tipo, valor };
  });
}

export const DIFICULDADES = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };

export function lerNota(token) {
  let t = String(token).trim();
  if (t === '-' || t.toLowerCase() === 'pausa') return { pausa: true, botao: null, mods: [], incerta: false };
  let incerta = false;
  if (t.endsWith('?')) { incerta = true; t = t.slice(0, -1); }
  let mods = [''];
  let botao = t;
  const i = t.lastIndexOf(':');
  if (i >= 0) {
    mods = t.slice(0, i).split('/').map(s => s.trim().toLowerCase());
    botao = t.slice(i + 1);
  }
  botao = botao.trim().toUpperCase();
  if (!BOTOES.includes(botao)) throw new Error('botão desconhecido "' + botao + '" em "' + token + '" (use L, R, A, X ou Y)');
  for (const m of mods) {
    if (!MODIFICADORES.includes(m)) throw new Error('modificador desconhecido "' + m + '" em "' + token + '" (use up, down, dpad, dpadup ou down+dpad)');
  }
  return { botao, mods, incerta };
}

export function lerFrase(texto) {
  return String(texto).trim().split(/\s+/).filter(Boolean).map(lerNota);
}

// Confere e normaliza uma música inteira. Lança erro com mensagem clara se algo estiver errado.
export function lerMusica(dados) {
  if (!dados || typeof dados !== 'object') throw new Error('arquivo vazio ou inválido');
  const titulo = String(dados.titulo || '').trim();
  if (!titulo) throw new Error('falta o "titulo"');
  if (!Array.isArray(dados.frases) || dados.frases.length === 0) throw new Error('falta "frases" (lista de frases com as notas)');
  const frases = dados.frases.map((f, k) => {
    try { const notas = lerFrase(f); if (!notas.length) throw new Error('frase vazia'); return notas; }
    catch (e) { throw new Error('frase ' + (k + 1) + ': ' + e.message); }
  });
  if (frases.flat().every(n => n.pausa)) throw new Error('a música só tem pausas');
  const categoria = CATEGORIAS[dados.categoria] ? dados.categoria : 'outro';
  const m = {
    titulo,
    origem: String(dados.origem || '').trim(),
    categoria,
    enviado_por: String(dados.enviado_por || '').trim(),
    tags: Array.isArray(dados.tags) ? dados.tags.map(String) : [],
    observacoes: String(dados.observacoes || '').trim(),
    frasesTexto: dados.frases.map(String),
    frases
  };
  m.dificuldade = DIFICULDADES[dados.dificuldade] ? dados.dificuldade : calcularDificuldade(frases);
  m.totalNotas = frases.flat().filter(n => !n.pausa).length;
  m.ritmo = lerRitmo(dados.ritmo, m.totalNotas);
  m.redes = lerRedes(dados.redes);
  // editavel: false = quem abrir não vê "Editar uma cópia" (protege o trabalho de quem criou)
  m.editavel = dados.editavel !== false;
  // baseada_em: crédito da música original quando esta é uma cópia editada
  m.baseada = String(dados.baseada_em || '').trim().slice(0, 160);
  return m;
}

// Ritmo (opcional): momento de cada nota tocável, em milissegundos desde a primeira nota.
// Ex.: [0, 400, 800, 1600]. Pausas não entram: o tempo delas já está no intervalo entre as notas.
export function lerRitmo(ritmo, totalNotas) {
  if (ritmo == null) return null;
  if (!Array.isArray(ritmo) || ritmo.length !== totalNotas) throw new Error('"ritmo" precisa ter um tempo para cada nota tocável (' + totalNotas + ')');
  for (let i = 0; i < ritmo.length; i++) {
    if (typeof ritmo[i] !== 'number' || !isFinite(ritmo[i]) || (i > 0 && ritmo[i] < ritmo[i - 1])) throw new Error('"ritmo" tem um tempo inválido na nota ' + (i + 1));
  }
  return ritmo.map(Math.round);
}

// Fácil: até 12 notas sem segurar nada. Difícil: mais de 30 notas ou usa o direcional. Resto: médio.
export function calcularDificuldade(frases) {
  const notas = frases.flat().filter(n => !n.pausa);
  const comMod = notas.some(n => n.mods[0] !== '');
  const comDpad = notas.some(n => n.mods[0].includes('dpad'));
  if (notas.length <= 12 && !comMod) return 'facil';
  if (notas.length > 30 || comDpad) return 'dificil';
  return 'medio';
}

// ---------- link com a música dentro ----------
function paraBase64Url(texto) {
  const bytes = new TextEncoder().encode(texto);
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function deBase64Url(s) {
  const b = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b + '==='.slice((b.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}
export function codificarMusica(m) {
  const curto = { t: m.titulo, o: m.origem, c: m.categoria, e: m.enviado_por, n: m.observacoes, f: m.frasesTexto };
  if (m.ritmo) curto.r = m.ritmo;
  if (m.redes.length) curto.s = m.redes;
  if (!m.editavel) curto.x = 1;
  if (m.baseada) curto.b = m.baseada;
  return paraBase64Url(JSON.stringify(curto));
}
export function decodificarMusica(codigo) {
  const c = JSON.parse(deBase64Url(codigo));
  return lerMusica({ titulo: c.t, origem: c.o, categoria: c.c, enviado_por: c.e, observacoes: c.n, frases: c.f, ritmo: c.r, redes: c.s, editavel: !c.x, baseada_em: c.b });
}

// busca sem acento e sem maiúsculas
export function normalizar(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
