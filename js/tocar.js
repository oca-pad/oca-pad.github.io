// Página de tocar: mostra a partitura e confere cada nota lida do controle.
// A música vem de ?id=nome (arquivo em musicas/) ou de #m=... (música inteira dentro do link).
import { lerMusica, lerRitmo, decodificarMusica, codificarMusica, CATEGORIAS, DIFICULDADES, REDES } from './musica.js';
import { htmlNota, htmlLegenda, descrever, descreverNota, lerModificador, INDICE_GAMEPAD, CONTROLES } from './controles.js';
import { ligarPonte } from './ponte.js';
import { ligarLinksPonte } from './comum.js';
import { ligarEscolhaControle, montarRodape, ligarRecolhe, movimentoReduzido, el } from './comum.js';
import { t, tn, decimal, nomeCategoria, nomeDificuldade } from './idioma.js';

montarRodape();
let controle = ligarEscolhaControle(c => { controle = c; desenhar(); });

const params = new URLSearchParams(location.search);
const id = params.get('id');
const codigo = new URLSearchParams(location.hash.slice(1)).get('m');

let musica = null;
const notas = [];   // { el, nota, frase }
let now = 0, hits = 0, misses = 0;

async function carregar() {
  try {
    if (codigo) {
      musica = decodificarMusica(codigo);
    } else if (id && /^[a-z0-9-]+$/.test(id)) {
      const r = await fetch('musicas/' + id + '.json', { cache: 'no-cache' });
      if (!r.ok) throw new Error('não encontrada');
      musica = lerMusica(await r.json());
    } else {
      throw new Error('nenhuma música escolhida');
    }
  } catch (e) {
    el('titulo').textContent = t('naoEncontrada');
    el('info').textContent = t('naoEncontradaInfo');
    document.title = t('naoEncontrada') + ' · OcaPad';
    return;
  }
  document.title = musica.titulo + ' · OcaPad';
  el('titulo').textContent = musica.titulo;
  const etqs = [
    [musica.origem, ''], [nomeCategoria(musica.categoria), ''], [nomeDificuldade(musica.dificuldade), musica.dificuldade],
    [tn('notas', musica.totalNotas), ''], [musica.ritmo ? t('comRitmo') : '', 'ritmo'],
    [musica.enviado_por && t('enviadaPor', { n: musica.enviado_por }), '']
  ].filter(([x]) => x);
  el('info').replaceChildren(...etqs.map(([x, c]) => { const s = document.createElement('span'); s.className = 'etq ' + c; s.textContent = x; return s; }));
  // redes sociais de quem enviou (links montados pelo site, abrem em outra aba)
  for (const r of musica.redes) {
    const a = document.createElement('a');
    a.className = 'etq rede';
    a.href = REDES[r.tipo].url(r.valor);
    a.target = '_blank';
    a.rel = 'noopener noreferrer nofollow ugc';
    a.textContent = REDES[r.tipo].nome + ' @' + r.valor;
    el('info').append(a);
  }
  if (musica.observacoes) { el('obs').textContent = musica.observacoes; el('obs').hidden = false; }
  el('linkCurto').hidden = !id || !!codigo;
  try {
    const salvo = JSON.parse(localStorage.getItem(chaveRitmo()) || 'null');
    if (salvo) { musica.ritmo = lerRitmo(salvo, musica.totalNotas); ritmoDoUsuario = true; }
  } catch (e) {}
  atualizarRitmoUI();
  el('editarCopia').href = 'criar.html#m=' + codificarMusica(musica);
  el('editarCopia').hidden = !musica.editavel;
  if (musica.baseada) {
    const s = document.createElement('span');
    s.className = 'etq';
    s.textContent = t('baseadaEm', { x: musica.baseada });
    el('info').append(s);
  }
  el('conteudo').hidden = false;
  desenhar();
  setNow(0);
  updateScore();
  say(primeiraMsg(), '');
}

// monta (ou remonta, ao trocar de controle) a partitura
function desenhar() {
  if (!musica) return;
  el('legenda').innerHTML = htmlLegenda(controle);
  const sheet = el('sheet');
  sheet.replaceChildren();
  notas.length = 0;
  musica.frases.forEach((frase, i) => {
    const sec = document.createElement('section');
    sec.className = 'phrase';
    const h = document.createElement('h2');
    h.textContent = musica.frases.length > 1 ? t('frase', { n: i + 1 }) : t('notasTit');
    sec.append(h);
    for (let k = 0; k < frase.length; k += 5) {
      const row = document.createElement('div');
      row.className = 'half';
      frase.slice(k, k + 5).forEach(nota => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'note' + (nota.pausa ? ' e-pausa' : '');
        b.setAttribute('aria-label', descreverNota(controle, nota));
        b.innerHTML = htmlNota(controle, nota);
        const idx = notas.length;
        b.addEventListener('click', () => { pulouManual(); setNow(idx); say(t('pulou', { i: now + 1, n: atual() }), ''); });
        notas.push({ el: b, nota, frase: i, sec, k: nota.pausa ? -1 : notas.filter(n => !n.nota.pausa).length });
        row.append(b);
      });
      sec.append(row);
    }
    sheet.append(sec);
  });
  if (now < notas.length) setNow(now, false); else notas.forEach(n => n.el.classList.add('done'));
}

const coach = el('coach'), msg = el('msg'), scoreEl = el('score'), restartPhrase = el('restartPhrase');
const restartSong = el('restartSong'), loopSong = el('loopSong');
// as opções ficam salvas; "voltar pra frase" e "voltar pra música" não ficam ligadas juntas
const opcoes = [restartPhrase, restartSong, loopSong];
try { const o = JSON.parse(localStorage.getItem('opcoes') || '{}'); opcoes.forEach(x => { x.checked = !!o[x.id]; }); } catch (e) {}
function salvarOpcoes() { try { localStorage.setItem('opcoes', JSON.stringify(Object.fromEntries(opcoes.map(x => [x.id, x.checked])))); } catch (e) {} }
restartPhrase.addEventListener('change', () => { if (restartPhrase.checked) restartSong.checked = false; salvarOpcoes(); });
restartSong.addEventListener('change', () => { if (restartSong.checked) restartPhrase.checked = false; salvarOpcoes(); });
loopSong.addEventListener('change', salvarOpcoes);

// pausas são puladas: procura a nota tocável mais próxima na direção indicada
const tocavel = k => k >= 0 && k < notas.length && !notas[k].nota.pausa;
function proxima(i, dir = 1) {
  let k = Math.max(0, Math.min(notas.length - 1, i));
  while (k >= 0 && k < notas.length && !tocavel(k)) k += dir;
  if (!tocavel(k)) { k = Math.max(0, Math.min(notas.length - 1, i)); while (!tocavel(k) && k >= 0) k -= dir; }
  return tocavel(k) ? k : 0;
}
const totalTocaveis = () => notas.filter(n => !n.nota.pausa).length;
function setNow(i, rolar = true, dir = 1) {
  now = proxima(i, dir);
  notas.forEach((n, k) => {
    n.el.classList.toggle('now', k === now);
    n.el.classList.remove('miss');
    n.el.classList.toggle('done', k < now);
  });
  const atualN = notas[now];
  notas.forEach(n => n.sec.classList.toggle('atual', n.sec === atualN.sec));
  if (rolar) rolarPara(atualN);
}
// Ao mudar de frase, a página desce até ela e a deixa logo abaixo da barra do treino.
// Dentro da frase, só rola se a nota atual sair da tela.
let ultimaFrase = 0;
function rolarPara(n) {
  const topoLivre = coach.getBoundingClientRect().bottom + 12;
  const r = n.el.getBoundingClientRect();
  const fora = r.top < topoLivre || r.bottom > window.innerHeight - 8;
  if (n.frase !== ultimaFrase || fora) {
    const alvo = n.frase !== ultimaFrase ? n.sec : n.el;
    const y = window.scrollY + alvo.getBoundingClientRect().top - coach.offsetHeight - document.querySelector('.topo').offsetHeight - 14;
    window.scrollTo({ top: Math.max(0, y), behavior: movimentoReduzido() ? 'auto' : 'smooth' });
  }
  ultimaFrase = n.frase;
}
function say(text, kind) {
  msg.textContent = text;
  msg.className = 'msg' + (kind ? ' ' + kind : '');
  coach.classList.remove('ok', 'err');
  if (kind) { void coach.offsetWidth; coach.classList.add(kind); }
}
const atual = () => descreverNota(controle, notas[now].nota);
const primeiraMsg = () => t('primeira', { n: atual() });
function updateScore() {
  scoreEl.textContent = hits + ' / ' + totalTocaveis() + ' · ' + tn('erros', misses) +
    (ritmoLigado() && avaliadas ? t('placarTempo', { a: noTempo, b: avaliadas }) : '');
}
function zerar() { hits = 0; misses = 0; noTempo = 0; avaliadas = 0; ancora = null; updateScore(); setNow(0); }
function reset() { if (gravando) pararGravacao(); zerar(); say(t('doComeco') + primeiraMsg(), ''); }
el('reset').addEventListener('click', reset);

function judge(mod, botao, ts = performance.now()) {
  const want = notas[now];
  const ok = botao === want.nota.botao && want.nota.mods.includes(mod);
  if (ok) {
    hits++;
    let tempo = '';
    if (gravando) {
      tempos[want.k] = ts;
    } else if (ritmoLigado()) {
      tempo = avaliarTempo(want.k, ts);
      ancora = { t: ts, k: want.k };
    }
    let seguinte = now + 1;
    while (seguinte < notas.length && notas[seguinte].nota.pausa) seguinte++;
    if (seguinte >= notas.length) {
      updateScore();
      notas.forEach(n => n.el.classList.add('done'));
      now = notas.length; // trava até recomeçar
      if (gravando) { terminarGravacao(); return; }
      const resumo = t('completa', { e: tn('erros', misses) }) +
        (ritmoLigado() && avaliadas ? t('completaTempo', { a: noTempo, b: avaliadas }) : '');
      if (loopSong.checked) {
        say(resumo + t('comecandoNovo'), 'ok');
        setTimeout(() => { if (now === notas.length) { zerar(); say(t('deNovo') + primeiraMsg(), ''); } }, 1800);
      } else {
        say(resumo + t('apertaRecomecar'), 'ok');
      }
      return;
    }
    const pausas = seguinte - now - 1;
    setNow(seguinte);
    say((tempo || t('acertou')) + (pausas ? tn('pausas', pausas) : '') + t('proxima', { n: atual() }), 'ok');
  } else {
    misses++;
    want.el.classList.add('miss');
    let back = '';
    if (gravando) {
      back = t('gravContinua');
    } else if (restartPhrase.checked) {
      const first = proxima(notas.findIndex(n => n.frase === want.frase));
      if (first !== now) { ancora = null; setNow(first); notas[now].el.classList.add('miss'); back = t('voltouFrase'); }
    } else if (restartSong.checked) {
      const first = proxima(0);
      if (first !== now) { ancora = null; setNow(first); notas[now].el.classList.add('miss'); back = t('voltouMusica'); }
    }
    say(t('errou', { a: descrever(controle, mod, botao), b: atual() }) + back, 'err');
  }
  updateScore();
}

document.addEventListener('keydown', e => {
  if (!notas.length || (e.target.closest && e.target.closest('select, input, [role=radiogroup]'))) return;
  if (e.key === 'ArrowRight') { pulouManual(); setNow(now + 1); e.preventDefault(); }
  if (e.key === 'ArrowLeft') { pulouManual(); setNow(now - 1, true, -1); e.preventDefault(); }
});

// ---------- ritmo ----------
// Gravar: você toca a música uma vez no tempo certo e a página anota quando cada nota foi tocada.
// Modo ritmo: cada nota é comparada com o intervalo gravado desde a nota anterior
// (assim um atraso não estraga as notas seguintes).
const JANELA = 150; // ms de tolerância para "no tempo"
const modoRitmo = el('modoRitmo'), gravarBtn = el('gravar');
let gravando = false, tempos = [], ancora = null, noTempo = 0, avaliadas = 0, ritmoDoUsuario = false;
opcoes.push(modoRitmo);
try { modoRitmo.checked = !!JSON.parse(localStorage.getItem('opcoes') || '{}').modoRitmo; } catch (e) {}
modoRitmo.addEventListener('change', () => { salvarOpcoes(); ancora = null; atualizarRitmoUI(); updateScore(); });

function ritmoLigado() { return !!(musica && musica.ritmo && modoRitmo.checked && !gravando); }
function chaveRitmo() {
  if (id && !codigo) return 'ritmo:' + id;
  let h = 0;
  for (const ch of musica.frasesTexto.join('|')) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return 'ritmo:link:' + h;
}
function pulouManual() {
  ancora = null;
  if (gravando) { pararGravacao(); say(t('gravCanceladaPulou'), 'err'); }
}

function avaliarTempo(k, ts) {
  if (!ancora || ancora.k !== k - 1) return t('comecou');
  const esperado = ancora.t + (musica.ritmo[k] - musica.ritmo[k - 1]);
  const d = ts - esperado;
  avaliadas++;
  if (Math.abs(d) <= JANELA) { noTempo++; marcarTexto(t('noTempo'), 'no-tempo'); return t('noTempo'); }
  const txt = t(d < 0 ? 'adiantado' : 'atrasado', { s: decimal(Math.abs(d) / 1000) });
  marcarTexto(txt, 'fora');
  return t('notaCertaMas', { x: txt });
}
let textoAte = 0;
function marcarTexto(txt, cls) {
  const r = el('ritmoTexto');
  r.textContent = txt; r.className = 'ritmo-texto ' + cls;
  textoAte = performance.now() + 900;
}

// a barra enche até a marca branca (80%) na hora exata da próxima nota
function desenharBarra() {
  if (!ritmoLigado() || now >= notas.length) return;
  const fill = el('ritmoFill'), r = el('ritmoTexto'), n = notas[now];
  if (!ancora || ancora.k !== n.k - 1) {
    fill.style.width = '0'; fill.className = 'ritmo-fill';
    if (performance.now() > textoAte) { r.textContent = t('toqueComecar'); r.className = 'ritmo-texto'; }
    return;
  }
  const intervalo = Math.max(1, musica.ritmo[n.k] - musica.ritmo[n.k - 1]);
  const passou = performance.now() - ancora.t;
  fill.style.width = Math.min(100, (passou / intervalo) * 80) + '%';
  const d = passou - intervalo;
  fill.className = 'ritmo-fill' + (Math.abs(d) <= JANELA ? ' hora' : d > JANELA ? ' tarde' : '');
  if (performance.now() > textoAte) {
    r.className = 'ritmo-texto';
    r.textContent = d < -JANELA ? t('espere') : d <= JANELA ? t('agora') : t('tarde');
  }
}

function atualizarRitmoUI() {
  const tem = !!(musica && musica.ritmo);
  modoRitmo.disabled = !tem;
  el('modoRitmoLabel').classList.toggle('off', !tem);
  el('modoRitmoLabel').title = tem
    ? (ritmoDoUsuario ? t('ritmoUsuario') : t('ritmoMusica'))
    : t('semRitmo');
  el('ritmoBox').hidden = !ritmoLigado();
  el('copiarRitmo').hidden = !tem || !(musica && musica.editavel);
}

function pararGravacao() {
  gravando = false;
  coach.classList.remove('gravando');
  gravarBtn.textContent = t('gravarRitmo');
  atualizarRitmoUI();
}
gravarBtn.addEventListener('click', () => {
  if (gravando) { pararGravacao(); zerar(); say(t('gravCancelada'), ''); return; }
  gravando = true; tempos = [];
  zerar();
  coach.classList.add('gravando');
  gravarBtn.textContent = t('cancelarGravacao');
  atualizarRitmoUI();
  say(t('gravandoRitmo') + primeiraMsg(), '');
});
function terminarGravacao() {
  const ritmo = tempos.map(x => Math.round(x - tempos[0]));
  pararGravacao();
  musica.ritmo = ritmo; ritmoDoUsuario = true;
  try { localStorage.setItem(chaveRitmo(), JSON.stringify(ritmo)); } catch (e) {}
  modoRitmo.checked = true; salvarOpcoes();
  atualizarRitmoUI();
  zerar();
  say(t('ritmoGravado'), 'ok');
}

// ---------- compartilhar ----------
async function copiar(texto, ok = t('linkCopiado')) {
  const aviso = el('avisoCopia');
  try { await navigator.clipboard.writeText(texto); aviso.textContent = ok; }
  catch (e) { window.prompt(t('copie'), texto); aviso.textContent = ''; }
  setTimeout(() => { aviso.textContent = ''; }, 2500);
}
const base = () => location.origin + location.pathname;
el('linkCurto').addEventListener('click', () => copiar(base() + '?id=' + encodeURIComponent(id)));
el('linkCompleto').addEventListener('click', () => copiar(base() + '#m=' + codificarMusica(musica)));
el('copiarRitmo').addEventListener('click', () => copiar('"ritmo": [' + musica.ritmo.join(', ') + ']', t('ritmoCopiado')));

// ---------- leitura do controle (Gamepad API) ----------
const pad = el('pad'), padText = el('padText');
const prev = {};
let seen = false;
// Recebe o estado do controle (do navegador ou da ponte) e confere as notas.
function processar(gp, ts) {
  if (!notas.length) return;
  const mod = lerModificador(gp);
  for (const [botao, i] of Object.entries(INDICE_GAMEPAD)) {
    const b = gp.buttons[i];
    const down = !!(b && b.pressed);
    if (down && !prev[botao] && now < notas.length) judge(mod, botao, ts);
    prev[botao] = down;
  }
}

let ponteLigada = false;
function poll() {
  if (!notas.length || ponteLigada) return;   // com a ponte, só ela conta (evita nota dobrada)
  let gps = [];
  try { gps = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : []; } catch (e) { gps = []; }
  const gp = gps.find(g => g.mapping === 'standard') || gps[0];
  if (gp) {
    if (!seen) { seen = true; pad.classList.add('on'); padText.textContent = t('padOk'); if (now < notas.length) say(t('pronto') + (now === 0 ? primeiraMsg() : t('notaAtual', { n: atual() })), ''); }
    processar(gp, performance.now());
  } else if (seen) {
    seen = false; pad.classList.remove('on'); padText.textContent = t('padOff');
  }
}
ligarPonte({
  aoEstado: (gp, ts) => processar(gp, ts),
  aoStatus: (ligada, info) => {
    const antes = ponteLigada;
    ponteLigada = ligada;
    pad.classList.toggle('ponte', ligada);
    el('baixarPonte').hidden = ligada;   // com a ponte aberta, os links somem
    if (ligada) {
      const tem = info && info.controles > 0;
      pad.classList.toggle('on', tem);
      padText.textContent = tem ? t('ponteOk') : t('ponteSemControle');
      if (!antes && notas.length && now < notas.length) say(t('ponteOk') + '. ' + (now === 0 ? primeiraMsg() : t('notaAtual', { n: atual() })), '');
    } else {
      pad.classList.toggle('on', seen);
      padText.textContent = seen ? t('padOk') : t('padNao');
    }
  }
});
let supported = true;
try { supported = typeof navigator.getGamepads === 'function'; navigator.getGamepads(); } catch (e) { supported = false; }
if (!supported) padText.textContent = t('semSuporte');
function loop() { poll(); desenharBarra(); requestAnimationFrame(loop); }
if (supported) { requestAnimationFrame(loop); setInterval(poll, 50); }
window.addEventListener('gamepadconnected', poll);

ligarRecolhe(el('opcoesTreino'), 'recolhe:treino', matchMedia('(min-width: 900px)').matches);
// a barra fixa não pode esconder a nota com foco (WCAG 2.4.11)
new ResizeObserver(() => { document.documentElement.style.scrollPaddingTop = (document.querySelector('.topo').offsetHeight + el('coach').offsetHeight + 16) + 'px'; }).observe(el('coach'));
ligarLinksPonte();
carregar();
