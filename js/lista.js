// Página inicial: baixa o índice e busca no próprio navegador enquanto a pessoa digita.
import { CATEGORIAS, DIFICULDADES, normalizar } from './musica.js';
import { t, tn, nomeCategoria, nomeDificuldade } from './idioma.js';
import { ligarEscolhaControle, montarRodape, animar, htmlPonte, ligarLinksPonte, ligarRecolhe, el } from './comum.js';
import { ligarPonte } from './ponte.js';

montarRodape();
ligarEscolhaControle(() => {});

const q = el('q'), cat = el('cat'), dif = el('dif'), cards = el('cards'), contagem = el('contagem');
let musicas = [];

for (const k of Object.keys(CATEGORIAS)) cat.add(new Option(nomeCategoria(k), k));
for (const k of Object.keys(DIFICULDADES)) dif.add(new Option(nomeDificuldade(k), k));

// lembra a busca no endereço (?q=...&cat=...), para dar para compartilhar uma busca também
const params = new URLSearchParams(location.search);
q.value = params.get('q') || '';
cat.value = params.get('cat') || '';
dif.value = params.get('dif') || '';

// cada cartão é criado uma vez; ao filtrar, só os que ENTRAM na lista surgem (os que ficam não se mexem)
const cache = new Map();
let visiveisAntes = new Set();
const limpar = el('limpar');
limpar.addEventListener('click', () => { q.value = ''; cat.value = ''; dif.value = ''; filtrar(); q.focus(); });

function estadoVazio() {
  const li = document.createElement('li');
  li.className = 'estado';
  li.style.gridColumn = '1 / -1';
  const s = document.createElement('strong'); s.textContent = t('nenhumaTit');
  const p = document.createElement('span'); p.textContent = t('nenhumaDica');
  const b = document.createElement('button'); b.type = 'button'; b.className = 'botao'; b.textContent = t('limparFiltros');
  b.addEventListener('click', () => limpar.click());
  li.append(s, p, b);
  return li;
}

// 24 cartões por vez (6 a 8 linhas): o resto aparece com "Mostrar mais", sem trocar de página.
// ?porPagina=N no endereço muda o número (útil para testar).
const POR_VEZ = Math.max(1, parseInt(new URLSearchParams(location.search).get('porPagina'), 10) || 24);
let limite = POR_VEZ;
let ultimaBusca = '';
el('maisBtn').addEventListener('click', () => {
  const antes = limite;
  limite += POR_VEZ;
  filtrar();
  // leva o foco para o primeiro cartão novo (quem usa teclado continua de onde parou)
  const novo = cards.children[antes];
  if (novo) { const a = novo.querySelector('a'); if (a) a.focus({ preventScroll: true }); }
});

function filtrar() {
  const chave = q.value + '|' + cat.value + '|' + dif.value;
  if (chave !== ultimaBusca) { limite = POR_VEZ; ultimaBusca = chave; }   // busca nova começa do início
  const termos = normalizar(q.value).split(/\s+/).filter(Boolean);
  const res = musicas.filter(m =>
    (!cat.value || m.categoria === cat.value) &&
    (!dif.value || m.dificuldade === dif.value) &&
    termos.every(t => m._texto.includes(t))
  );
  const novos = [];
  const mostrar = res.slice(0, limite);
  const itens = mostrar.map(m => {
    let li = cache.get(m.id);
    if (!li) { li = cartao(m); cache.set(m.id, li); }
    if (!visiveisAntes.has(m.id)) novos.push(li);
    return li;
  });
  cards.replaceChildren(...itens);
  visiveisAntes = new Set(mostrar.map(m => m.id));
  el('maisBox').hidden = res.length <= limite;
  el('mostrando').textContent = t('mostrando', { a: mostrar.length, b: res.length });
  el('maisBtn').textContent = t('mostrarMais') + ' (' + Math.min(POR_VEZ, res.length - mostrar.length) + ')';
  novos.slice(0, 12).forEach((li, i) => animar(li, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 180, delay: i * 25 }));
  limpar.hidden = !(q.value || cat.value || dif.value) || !res.length;   // sem resultado, o botão aparece dentro do aviso
  contagem.textContent = res.length === musicas.length
    ? tn('musicas', musicas.length)
    : t('deMusicas', { a: res.length, b: musicas.length });
  if (!res.length) cards.append(estadoVazio());
  const p = new URLSearchParams();
  if (POR_VEZ !== 24) p.set('porPagina', POR_VEZ);
  if (q.value) p.set('q', q.value);
  if (cat.value) p.set('cat', cat.value);
  if (dif.value) p.set('dif', dif.value);
  history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
}

function cartao(m) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.className = 'card';
  a.href = 'tocar.html?id=' + encodeURIComponent(m.id);
  const h = document.createElement('h2'); h.textContent = m.titulo;
  const o = document.createElement('span'); o.className = 'origem'; o.textContent = m.origem || '—';
  const e = document.createElement('div'); e.className = 'etiquetas';
  const etq = (txt, cls) => { const s = document.createElement('span'); s.className = 'etq ' + (cls || ''); s.textContent = txt; e.append(s); };
  etq(nomeCategoria(CATEGORIAS[m.categoria] ? m.categoria : 'outro'));
  etq(nomeDificuldade(m.dificuldade), m.dificuldade);
  etq(tn('notas', m.notas));
  if (m.ritmo) etq(t('comRitmo'), 'ritmo');
  a.append(h, o, e);
  li.append(a);
  return li;
}

for (const x of [q, cat, dif]) x.addEventListener('input', filtrar);

// card "O que é a Ponte do controle?"
el('cardPonteCorpo').innerHTML = htmlPonte();
ligarLinksPonte();
function abrirCardPonte() {
  if (location.hash !== '#ponte') return;
  el('ponte').open = true;
  el('ponte').scrollIntoView({ block: 'start' });
  el('ponte').querySelector('summary').focus({ preventScroll: true });
}
window.addEventListener('hashchange', abrirCardPonte);
setTimeout(abrirCardPonte, 0);
ligarRecolhe(el('ponte'), 'recolhe:ponte', false);
ligarPonte({ aoEstado: () => {}, aoStatus: ligada => { el('baixarPonte').hidden = ligada; } });

function carregarLista() {
  cards.setAttribute('aria-busy', 'true');
  return fetch('indice.json', { cache: 'no-cache' })
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(d => {
    musicas = d.musicas.map(m => ({
      ...m,
      _texto: normalizar([m.titulo, m.origem, m.enviado_por, CATEGORIAS[m.categoria], nomeCategoria(m.categoria), ...(m.tags || [])].join(' '))
    }));
    cards.setAttribute('aria-busy', 'false');
    filtrar();
  })
  .catch(() => {
    cards.setAttribute('aria-busy', 'false');
    contagem.textContent = t('erroLista');
    const li = document.createElement('li');
    li.className = 'estado erro'; li.style.gridColumn = '1 / -1';
    const s = document.createElement('strong'); s.textContent = t('erroListaTit');
    const b = document.createElement('button'); b.type = 'button'; b.className = 'botao'; b.textContent = t('tentarNovo');
    b.addEventListener('click', () => { cards.innerHTML = '<li class="esqueleto" aria-hidden="true"></li>'.repeat(3); carregarLista(); });
    li.append(s, b);
    cards.replaceChildren(li);
  });
}
carregarLista();
