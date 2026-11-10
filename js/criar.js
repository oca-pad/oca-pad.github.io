// Página de criar música: grava tocando no controle (notas + ritmo), edita e pede publicação.
// As músicas ficam salvas só neste navegador (localStorage), em "Minhas músicas".
import { lerMusica, decodificarMusica, codificarMusica, CATEGORIAS, BOTOES, REDES, MAX_REDES, limparUsuario, usuarioValido } from './musica.js';
import { htmlNota, htmlLegenda, descreverNota, lerModificador, nomeModificador, INDICE_GAMEPAD, CONTROLES } from './controles.js';
import { t, tn, decimal, nomeCategoria } from './idioma.js';
import { ligarPonte } from './ponte.js';
import { ligarEscolhaControle, montarRodape, linkRepositorio, ligarRecolhe, ligarLinksPonte, el } from './comum.js';

montarRodape();
document.title = t('criarTitulo') + ' · OcaPad';
let controle = ligarEscolhaControle(c => { controle = c; desenhar(); preencherSelects(); });

// ---------- modelo ----------
// item: { p: pausa?, b: botão, m: modificador, e: espera em ms desde a nota anterior, f: começa frase }
const ESPERA_PADRAO = 500;
const MODS = ['', 'up', 'down', 'dpad', 'down+dpad'];
let atual = novaMusica();
let sel = null;          // índice do item escolhido

function novaMusica() {
  return { uid: 'm' + Date.now().toString(36), dados: { titulo: '', origem: '', categoria: 'anime', enviado_por: '', tags: '', observacoes: '', redes: [] }, itens: [], temRitmo: false, editavel: false };
}

// ---------- salvar no navegador ----------
function lerTodas() { try { return JSON.parse(localStorage.getItem('minhas-musicas') || '{}'); } catch (e) { return {}; } }
function salvar() {
  const todas = lerTodas();
  atual.atualizado = Date.now();
  todas[atual.uid] = atual;
  try {
    localStorage.setItem('minhas-musicas', JSON.stringify(todas));
    localStorage.setItem('musica-aberta', atual.uid);
    el('salvo').textContent = t('salvoNav');
  } catch (e) { el('salvo').textContent = t('naoSalvou'); }
  listarMinhas();
}
function listarMinhas() {
  const s = el('minhas');
  const todas = Object.values(lerTodas()).sort((a, b) => (b.atualizado || 0) - (a.atualizado || 0));
  s.replaceChildren(...todas.map(m => new Option((m.dados.titulo || t('semTitulo')) + ' (' + tn('notas', m.itens.filter(i => !i.p).length) + ')', m.uid)));
  if (!todas.some(m => m.uid === atual.uid)) s.prepend(new Option((atual.dados.titulo || t('semTitulo')) + ' ' + t('novaTag'), atual.uid));
  s.value = atual.uid;
}
el('minhas').addEventListener('change', e => {
  const m = lerTodas()[e.target.value];
  if (m) abrir(m);
});
el('nova').addEventListener('click', () => { pararGravacao(); abrir(novaMusica()); say(t('musicaNova'), ''); });
el('apagarMusica').addEventListener('click', () => {
  if (!confirm(t('confirmApagar', { t: atual.dados.titulo || t('semTitulo') }))) return;
  const todas = lerTodas(); delete todas[atual.uid];
  try { localStorage.setItem('minhas-musicas', JSON.stringify(todas)); } catch (e) {}
  const resto = Object.values(todas).sort((a, b) => (b.atualizado || 0) - (a.atualizado || 0));
  abrir(resto[0] || novaMusica());
  say(t('apagada'), '');
});

// ---------- dados ----------
const campos = { titulo: 'titulo', origem: 'origem', categoria: 'categoria', enviado_por: 'enviado', tags: 'tags', observacoes: 'obs' };
for (const k of Object.keys(CATEGORIAS)) el('categoria').add(new Option(nomeCategoria(k), k));
for (const [chave, idCampo] of Object.entries(campos)) {
  el(idCampo).addEventListener('input', () => { atual.dados[chave] = el(idCampo).value; salvar(); });
}
el('titulo').addEventListener('input', () => { if (el('titulo').value.trim()) { el('titulo').removeAttribute('aria-invalid'); el('erroTitulo').textContent = ''; } });
ligarRecolhe(document.querySelector('details.recolhe'), 'recolhe:gravacao', false);
// o painel fixo embaixo não pode esconder a nota com foco (WCAG 2.4.11)
new ResizeObserver(() => { document.documentElement.style.scrollPaddingBottom = (el('painel').offsetHeight + 24) + 'px'; }).observe(el('painel'));
el('permitirEdicao').addEventListener('change', () => { atual.editavel = el('permitirEdicao').checked; salvar(); });
el('temRitmo').addEventListener('change', () => { atual.temRitmo = el('temRitmo').checked; salvar(); });

function abrir(m) {
  atual = m; sel = null;
  for (const [chave, idCampo] of Object.entries(campos)) el(idCampo).value = m.dados[chave] || '';
  if (!Array.isArray(m.dados.redes)) m.dados.redes = [];
  desenharRedes();
  el('temRitmo').checked = !!m.temRitmo;
  el('permitirEdicao').checked = !!m.editavel;
  try { localStorage.setItem('musica-aberta', m.uid); } catch (e) {}
  listarMinhas();
  desenhar();
}

// ---------- redes sociais de quem criou ----------
function desenharRedes() {
  const lista = el('redesLista');
  lista.replaceChildren(...atual.dados.redes.map((r, i) => {
    const linha = document.createElement('div');
    linha.className = 'rede-linha';
    const sel = document.createElement('select');
    sel.setAttribute('aria-label', t('redeTipo') + ' ' + (i + 1));
    for (const [k, v] of Object.entries(REDES)) sel.add(new Option(v.nome, k));
    sel.value = r.tipo;
    sel.addEventListener('change', () => { r.tipo = sel.value; salvar(); });
    const inp = document.createElement('input');
    inp.type = 'text'; inp.maxLength = 120; inp.placeholder = '@usuario'; inp.value = r.valor || '';
    inp.setAttribute('aria-label', t('redeUsuario') + ' ' + (i + 1));
    inp.autocomplete = 'off'; inp.spellcheck = false;
    const erro = document.createElement('span');
    erro.className = 'erro-campo'; erro.id = 'erroRede' + i;
    inp.setAttribute('aria-describedby', erro.id);
    const conferir = () => {
      const u = limparUsuario(inp.value);
      const ruim = inp.value.trim() !== '' && !usuarioValido(u);
      inp.toggleAttribute('aria-invalid', ruim);
      if (ruim) inp.setAttribute('aria-invalid', 'true');
      erro.textContent = ruim ? t('redeInvalida') : '';
    };
    inp.addEventListener('input', () => { r.valor = inp.value; conferir(); salvar(); });
    conferir();
    const rem = document.createElement('button');
    rem.type = 'button'; rem.className = 'botao'; rem.textContent = t('removerRede');
    rem.addEventListener('click', () => { atual.dados.redes.splice(i, 1); salvar(); desenharRedes(); el('addRede').focus(); });
    linha.append(sel, inp, rem, erro);
    return linha;
  }));
  el('addRede').disabled = atual.dados.redes.length >= MAX_REDES;
}
el('addRede').addEventListener('click', () => {
  if (atual.dados.redes.length >= MAX_REDES) return;
  atual.dados.redes.push({ tipo: 'instagram', valor: '' });
  salvar(); desenharRedes();
  el('redesLista').lastElementChild.querySelector('input').focus();
});

// ---------- converter para o formato do site ----------
function token(i) { return i.p ? '-' : (i.m ? i.m + ':' : '') + i.b; }
function dadosArquivo() {
  const frases = [];
  atual.itens.forEach((i, k) => {
    if (k === 0 || i.f) frases.push([]);
    frases[frases.length - 1].push(token(i));
  });
  const d = atual.dados;
  const arq = {
    titulo: d.titulo.trim(),
    origem: d.origem.trim(),
    categoria: d.categoria,
    enviado_por: d.enviado_por.trim(),
    tags: d.tags.split(',').map(s => s.trim()).filter(Boolean),
    observacoes: d.observacoes.trim(),
    frases: frases.map(f => f.join(' '))
  };
  const redes = (d.redes || []).filter(r => String(r.valor || '').trim()).map(r => ({ tipo: r.tipo, valor: limparUsuario(r.valor) }));
  if (redes.length) arq.redes = redes;
  if (!atual.editavel) arq.editavel = false;
  if (atual.dados.baseada) arq.baseada_em = atual.dados.baseada;
  if (atual.temRitmo) {
    let acum = 0, primeira = true;
    arq.ritmo = [];
    for (const i of atual.itens) {
      if (i.p) continue;
      if (!primeira) acum += Math.max(0, Math.round(i.e || 0));
      primeira = false;
      arq.ritmo.push(acum);
    }
  }
  return arq;
}
function musicaValida() {
  const arq = dadosArquivo();
  if (!arq.titulo) {
    el('titulo').setAttribute('aria-invalid', 'true');
    el('erroTitulo').textContent = t('erroTitulo');
    el('titulo').focus();
    throw new Error(t('erroTitulo'));
  }
  if (!atual.itens.some(i => !i.p)) throw new Error(t('erroSemNotas'));
  try { return lerMusica(arq); } catch (e) { throw new Error(t('erroMusica', { e: e.message })); }
}
// importa uma música do site (link #m=) como cópia editável
function importar(m) {
  if (!m.editavel) throw new Error('bloqueada');
  const n = novaMusica();
  n.dados = { titulo: t('copiaTit', { t: m.titulo }), origem: m.origem, categoria: m.categoria, enviado_por: '', tags: m.tags.join(', '), observacoes: m.observacoes, redes: [] };
  let k = 0;
  m.frases.forEach(fr => fr.forEach((nota, j) => {
    const item = nota.pausa ? { p: true } : { b: nota.botao, m: nota.mods[0], e: ESPERA_PADRAO };
    if (!nota.pausa) { if (m.ritmo && k > 0) item.e = m.ritmo[k] - m.ritmo[k - 1]; if (k === 0) item.e = 0; k++; }
    item.f = j === 0;
    n.itens.push(item);
  }));
  n.temRitmo = !!m.ritmo;
  // crédito: a cópia guarda de onde veio (se a original já era cópia, mantém o crédito original)
  n.dados.baseada = m.baseada || (m.titulo + (m.enviado_por ? ' — ' + m.enviado_por : ''));
  return n;
}

// ---------- desenhar a partitura editável ----------
const seg = ms => decimal(ms / 1000, 2).replace(/0$/, '') + ' s';
function desenhar() {
  el('legenda').innerHTML = htmlLegenda(controle);
  const box = el('partitura');
  box.replaceChildren();
  let sec = null, row = null, nFrase = 0, naLinha = 0, primeiraNota = true;
  atual.itens.forEach((item, idx) => {
    if (idx === 0 || item.f) {
      sec = document.createElement('section'); sec.className = 'phrase';
      const h = document.createElement('h2'); h.textContent = t('frase', { n: ++nFrase }); sec.append(h);
      box.append(sec); row = null; naLinha = 0;
    }
    if (!row || naLinha === 5) { row = document.createElement('div'); row.className = 'half'; sec.append(row); naLinha = 0; }
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'note nota-ed' + (idx === sel ? ' now' : '') + (item.p ? ' e-pausa' : '');
    const nota = item.p ? { pausa: true } : { botao: item.b, mods: [item.m], incerta: false };
    b.setAttribute('aria-label', t('notaN', { n: idx + 1 }) + ': ' + descreverNota(controle, nota));
    const espera = item.p ? '' : (primeiraNota ? t('inicio') : '+' + seg(item.e || 0));
    if (!item.p) primeiraNota = false;
    b.innerHTML = '<span class="nota-corpo">' + htmlNota(controle, nota) + '</span>' +
      (atual.temRitmo || item.p ? '<span class="espera">' + (item.p ? '&nbsp;' : espera) + '</span>' : '');
    b.addEventListener('click', () => escolher(idx));
    row.append(b); naLinha++;
  });
  if (!atual.itens.length) {
    const p = document.createElement('p'); p.className = 'vazio';
    p.textContent = t('vazio');
    box.append(p);
  }
  const n = atual.itens.filter(i => !i.p).length;
  el('contagem').textContent = tn('notas', n) + ' · ' + tn('frases', atual.itens.length ? box.querySelectorAll('.phrase').length : 0);
  desenharPainel();
}

// ---------- painel da nota escolhida ----------
function preencherSelects() {
  const rot = CONTROLES[controle].rotulo;
  const pb = el('pBotao'), v = pb.value;
  pb.replaceChildren(...['L', 'R', 'A', 'Y', 'X'].map(b => new Option(rot[b] + (controle !== 'switch' ? t('doSwitch', { b }) : ''), b)));
  if (v) pb.value = v;
  if (!el('pMod').options.length) el('pMod').replaceChildren(...MODS.map(k => new Option(nomeModificador(k), k)));
}
preencherSelects();

function escolher(idx) {
  sel = sel === idx ? null : idx;
  desenhar();
  if (sel != null) el('painel').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function desenharPainel() {
  const painel = el('painel');
  if (sel == null || sel >= atual.itens.length) { painel.hidden = true; sel = null; return; }
  const item = atual.itens[sel];
  painel.hidden = false;
  el('painelTitulo').textContent = t(item.p ? 'pausaN' : 'notaN', { n: sel + 1 });
  el('pBotao').disabled = el('pMod').disabled = !!item.p;
  el('pBotao').closest('label').hidden = el('pMod').closest('label').hidden = !!item.p;
  if (!item.p) { el('pBotao').value = item.b; el('pMod').value = item.m || ''; }
  const primeira = atual.itens.findIndex(i => !i.p) === sel;
  el('pEsperaLabel').hidden = !!item.p || primeira || !atual.temRitmo;
  el('pEspera').value = ((item.e || 0) / 1000).toFixed(2);
  el('pFrase').checked = sel === 0 || !!item.f;
  el('pFrase').disabled = sel === 0;
}
function mudar(fn) { if (sel == null) return; fn(atual.itens[sel]); salvar(); desenhar(); }
el('pBotao').addEventListener('change', () => mudar(i => { i.b = el('pBotao').value; }));
el('pMod').addEventListener('change', () => mudar(i => { i.m = el('pMod').value; }));
el('pEspera').addEventListener('change', () => mudar(i => { i.e = Math.max(0, Math.round(parseFloat(String(el('pEspera').value).replace(',', '.')) * 1000) || 0); }));
document.querySelectorAll('[data-delta]').forEach(b => b.addEventListener('click', () =>
  mudar(i => { i.e = Math.max(0, Math.round((i.e || 0) + parseFloat(b.dataset.delta) * 1000)); })));
el('pFrase').addEventListener('change', () => mudar(i => { i.f = el('pFrase').checked; }));
el('pNotaAntes').addEventListener('click', () => { if (sel == null) return; atual.itens.splice(sel, 0, { b: 'L', m: '', e: ESPERA_PADRAO, f: !!atual.itens[sel].f }); atual.itens[sel + 1].f = false; salvar(); desenhar(); });
el('pPausaAntes').addEventListener('click', () => { if (sel == null) return; atual.itens.splice(sel, 0, { p: true, f: !!atual.itens[sel].f }); atual.itens[sel + 1].f = false; sel++; salvar(); desenhar(); });
el('pApagar').addEventListener('click', () => {
  if (sel == null) return;
  const [tirado] = atual.itens.splice(sel, 1);
  if (tirado.f && atual.itens[sel]) atual.itens[sel].f = true;
  if (sel >= atual.itens.length) sel = atual.itens.length ? atual.itens.length - 1 : null;
  salvar(); desenhar();
});
el('pFechar').addEventListener('click', () => { sel = null; desenhar(); });
el('pRegravar').addEventListener('click', () => {
  if (sel == null) return;
  const desde = sel;
  const espera = atual.itens[desde].e || ESPERA_PADRAO;
  const frase = !!atual.itens[desde].f;
  atual.itens = atual.itens.slice(0, desde);
  sel = null;
  comecarGravacao({ esperaPrimeira: desde === 0 ? 0 : espera, fraseNova: frase });
  say(t('regravando', { n: desde + 1 }), '');
});
el('addNota').addEventListener('click', () => { atual.itens.push({ b: 'L', m: '', e: atual.itens.some(i => !i.p) ? ESPERA_PADRAO : 0, f: false }); sel = atual.itens.length - 1; salvar(); desenhar(); });
el('addPausa').addEventListener('click', () => { atual.itens.push({ p: true, f: false }); salvar(); desenhar(); });

// ---------- gravação pelo controle ----------
const coach = el('coach'), msg = el('msg');
let gravando = false, ultimoT = null, primeiraGravada = null;
function say(text, kind) {
  msg.textContent = text;
  msg.className = 'msg' + (kind ? ' ' + kind : '');
  coach.classList.remove('ok', 'err');
  if (kind) { void coach.offsetWidth; coach.classList.add(kind); }
}
function comecarGravacao({ esperaPrimeira, fraseNova }) {
  gravando = true; ultimoT = null;
  primeiraGravada = { e: esperaPrimeira, f: fraseNova };
  atual.temRitmo = true; el('temRitmo').checked = true;
  coach.classList.add('gravando');
  el('parar').hidden = false; el('gravarZero').hidden = el('gravarFim').hidden = true;
  salvar(); desenhar();
}
function pararGravacao() {
  if (!gravando) return;
  gravando = false;
  coach.classList.remove('gravando');
  el('parar').hidden = true; el('gravarZero').hidden = el('gravarFim').hidden = false;
  salvar(); desenhar();
}
el('gravarZero').addEventListener('click', () => {
  if (atual.itens.length && !confirm(t('confirmZero'))) return;
  atual.itens = []; sel = null;
  comecarGravacao({ esperaPrimeira: 0, fraseNova: true });
  say(t('gravandoZero'), '');
});
el('gravarFim').addEventListener('click', () => {
  sel = null;
  comecarGravacao({ esperaPrimeira: atual.itens.some(i => !i.p) ? ESPERA_PADRAO : 0, fraseNova: false });
  say(t('gravandoFim'), '');
});
el('parar').addEventListener('click', () => { pararGravacao(); say(t('gravParada'), 'ok'); });

function notaDoControle(botao, mod, ts) {
  if (gravando) {
    const corte = Math.max(500, (parseFloat(String(el('corte').value).replace(',', '.')) || 1.5) * 1000);
    let item;
    if (ultimoT == null) {
      item = { b: botao, m: mod, e: primeiraGravada.e, f: primeiraGravada.f && atual.itens.length > 0 };
    } else {
      const e = Math.round(ts - ultimoT);
      item = { b: botao, m: mod, e, f: e >= corte };
    }
    ultimoT = ts;
    atual.itens.push(item);
    salvar(); desenhar();
    say(t('gravou', { n: descreverNota(controle, { botao, mods: [mod] }) }) + (item.f && atual.itens.length > 1 ? t('fraseNovaTag') : ''), '');
    rolarFim();
  } else if (sel != null && !atual.itens[sel].p) {
    mudar(i => { i.b = botao; i.m = mod; });
    say(t('trocada', { i: sel + 1, n: descreverNota(controle, { botao, mods: [mod] }) }), 'ok');
  }
}
function rolarFim() {
  const ultimo = el('partitura').querySelector('.phrase:last-of-type .half:last-child .note:last-child');
  if (ultimo) ultimo.scrollIntoView({ block: 'nearest' });
}

const pad = el('pad'), padText = el('padText');
const prev = {};
let seen = false;
function processar(gp, ts) {
  const mod = lerModificador(gp);
  for (const [botao, i] of Object.entries(INDICE_GAMEPAD)) {
    const b = gp.buttons[i];
    const down = !!(b && b.pressed);
    if (down && !prev[botao]) notaDoControle(botao, mod, ts);
    prev[botao] = down;
  }
}
let ponteLigada = false;
function poll() {
  if (ponteLigada) return;   // com a ponte, só ela conta (evita nota dobrada)
  let gps = [];
  try { gps = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : []; } catch (e) { gps = []; }
  const gp = gps.find(g => g.mapping === 'standard') || gps[0];
  if (gp) {
    if (!seen) { seen = true; pad.classList.add('on'); padText.textContent = t('padOk'); }
    processar(gp, performance.now());
  } else if (seen) {
    seen = false; pad.classList.remove('on'); padText.textContent = t('padOff');
  }
}
ligarLinksPonte();
ligarPonte({
  aoEstado: (gp, ts) => processar(gp, ts),
  aoStatus: (ligada, info) => {
    ponteLigada = ligada;
    el('baixarPonte').hidden = ligada;
    pad.classList.toggle('ponte', ligada);
    if (ligada) {
      const tem = info && info.controles > 0;
      pad.classList.toggle('on', tem);
      padText.textContent = tem ? t('ponteOk') : t('ponteSemControle');
    } else {
      pad.classList.toggle('on', seen);
      padText.textContent = seen ? t('padOk') : t('padNao');
    }
  }
});
let supported = true;
try { supported = typeof navigator.getGamepads === 'function'; navigator.getGamepads(); } catch (e) { supported = false; }
if (!supported) padText.textContent = t('semSuporteCriar');
function loop() { poll(); requestAnimationFrame(loop); }
if (supported) { requestAnimationFrame(loop); setInterval(poll, 50); }

// ---------- testar, link e publicar ----------
async function copiar(texto, ok) {
  const aviso = el('avisoCopia');
  try { await navigator.clipboard.writeText(texto); aviso.textContent = ok; }
  catch (e) { window.prompt(t('copie'), texto); aviso.textContent = ''; }
  setTimeout(() => { aviso.textContent = ''; }, 2500);
}
const pasta = () => location.origin + location.pathname.replace(/[^/]*$/, '');
function linkTocar(m) { return pasta() + 'tocar.html#m=' + codificarMusica(m); }
function comMusica(fn) {
  try { fn(musicaValida()); }
  catch (e) { say(e.message, 'err'); }
}
el('testar').addEventListener('click', () => comMusica(m => window.open(linkTocar(m), '_blank')));
el('copiarLink').addEventListener('click', () => comMusica(m => copiar(linkTocar(m), t('linkCopiado'))));

const repo = linkRepositorio();
if (!repo) el('publicarInfo').textContent = t('pubLocal');
el('publicar').addEventListener('click', () => comMusica(m => {
  if (!repo) { say(t('pubSoOnline'), 'err'); return; }
  const arq = dadosArquivo();
  const corpo = 'Quero publicar esta música no site.\n\n' +
    '**Testar:** ' + linkTocar(m) + '\n\n' +
    '<!-- Não mude o bloco abaixo: é dele que o site tira a música. -->\n' +
    '```json\n' + JSON.stringify(arq, null, 1) + '\n```\n';
  const url = repo + '/issues/new?title=' + encodeURIComponent('Nova música: ' + arq.titulo) + '&body=' + encodeURIComponent(corpo);
  if (url.length > 7500) { say(t('pubGrande'), 'err'); return; }
  window.open(url, '_blank');
  say(t('pubAberto'), 'ok');
}));

// ---------- começo ----------
(function iniciar() {
  const codigo = new URLSearchParams(location.hash.slice(1)).get('m');
  if (codigo) {
    try {
      const n = importar(decodificarMusica(codigo));
      history.replaceState(null, '', location.pathname);
      abrir(n); salvar();
      say(t('copiaCriada'), 'ok');
      return;
    } catch (e) {
      history.replaceState(null, '', location.pathname);
      say(e.message === 'bloqueada' ? t('copiaBloqueada') : t('linkRuim'), 'err');
    }
  }
  let aberta = null;
  try { aberta = lerTodas()[localStorage.getItem('musica-aberta')]; } catch (e) {}
  abrir(aberta || novaMusica());
})();
