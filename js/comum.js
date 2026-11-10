// Coisas usadas pelas duas páginas: controle escolhido e rodapé.
import { CONTROLES } from './controles.js';
import { t, traduzirPagina } from './idioma.js';

export function controleSalvo() {
  try { const c = localStorage.getItem('controle'); if (CONTROLES[c]) return c; } catch (e) {}
  return 'xbox';
}
export function salvarControle(c) {
  try { localStorage.setItem('controle', c); } catch (e) {}
}

// Ícones genéricos de cada controle (desenhos próprios, não são os logotipos das marcas):
// Xbox = 4 botões coloridos em losango; PlayStation = △ ○ ✕ □; Switch = dois controles laterais.
const ICONES = {
  xbox: '<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="6.5" r="4" fill="#f2c230"/><circle cx="6.5" cy="14" r="4" fill="#2f7fe0"/><circle cx="21.5" cy="14" r="4" fill="#e5483b"/><circle cx="14" cy="21.5" r="4" fill="#3fbf5f"/></svg>',
  playstation: '<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M14 2.8 18 9.6H10z" stroke="#3fd6a4"/><circle cx="22" cy="14" r="3.6" stroke="#ff6470"/><path d="m11.4 19.4 5.2 5.2m0-5.2-5.2 5.2" stroke="#7cb4ff"/><rect x="2.6" y="10.6" width="6.8" height="6.8" stroke="#f38ad1"/></svg>',
  switch: '<svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="3" width="10" height="22" rx="5" fill="#1fb8d6"/><rect x="15" y="3" width="10" height="22" rx="5" fill="#ff5a5f"/><circle cx="8" cy="10" r="2.4" fill="#0b2a33"/><circle cx="20" cy="18" r="2.4" fill="#3a0c0e"/></svg>'
};

// Liga a escolha de controle (#controle): três botões de ícone, um só marcado (como botões de rádio).
// Funciona com mouse, toque e teclado (setas trocam, como em qualquer grupo de opções).
export function ligarEscolhaControle(aoMudar) {
  const caixa = document.getElementById('controle');
  let atual = controleSalvo();
  caixa.setAttribute('role', 'radiogroup');
  caixa.setAttribute('aria-label', t('meuControle'));
  caixa.replaceChildren(...Object.entries(CONTROLES).map(([k, c]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'icone-controle';
    b.setAttribute('role', 'radio');
    b.dataset.controle = k;
    b.title = c.nome;
    b.setAttribute('aria-label', c.nome);
    b.innerHTML = ICONES[k];
    b.addEventListener('click', () => { if (!arrastou) escolher(k, true); });
    return b;
  }));
  const botoes = [...caixa.children];
  // destaque que desliza até o controle escolhido (e pode ser arrastado, como um interruptor)
  const trilho = document.createElement('span');
  trilho.className = 'seletor-trilho';
  trilho.setAttribute('aria-hidden', 'true');
  caixa.prepend(trilho);
  function posicionar(x) {
    const b = botoes.find(b => b.dataset.controle === atual);
    if (!b) return;
    trilho.style.width = b.offsetWidth + 'px';
    trilho.style.transform = 'translateX(' + (x == null ? b.offsetLeft : x) + 'px)';
  }
  function marcar() {
    botoes.forEach(b => {
      const sim = b.dataset.controle === atual;
      b.setAttribute('aria-checked', String(sim));
      b.tabIndex = sim ? 0 : -1;
    });
    posicionar();
  }
  new ResizeObserver(() => posicionar()).observe(caixa);

  // arrastar: o destaque segue o dedo/mouse e, ao soltar, encaixa no ícone mais próximo
  let arrastando = null, arrastou = false;
  caixa.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    arrastando = { x0: e.clientX, id: e.pointerId };
    arrastou = false;
  });
  caixa.addEventListener('pointermove', e => {
    if (!arrastando || e.pointerId !== arrastando.id) return;
    if (!arrastou && Math.abs(e.clientX - arrastando.x0) < 6) return;
    if (!arrastou) { arrastou = true; caixa.setPointerCapture(e.pointerId); caixa.classList.add('arrastando'); }
    const r = caixa.getBoundingClientRect();
    const larg = trilho.offsetWidth;
    const min = botoes[0].offsetLeft, max = botoes[botoes.length - 1].offsetLeft;
    const x = Math.max(min, Math.min(max, e.clientX - r.left - larg / 2));
    posicionar(x);
  });
  function soltar(e) {
    if (!arrastando) return;
    const foi = arrastou;
    arrastando = null;
    caixa.classList.remove('arrastando');
    if (foi) {
      const r = caixa.getBoundingClientRect();
      const x = e.clientX - r.left;
      let perto = botoes[0], dist = Infinity;
      for (const b of botoes) {
        const d = Math.abs(b.offsetLeft + b.offsetWidth / 2 - x);
        if (d < dist) { dist = d; perto = b; }
      }
      if (perto.dataset.controle === atual) posicionar(); else escolher(perto.dataset.controle, true);
      setTimeout(() => { arrastou = false; }, 0);   // não deixa o "clique" do fim do arraste trocar de novo
    }
  }
  caixa.addEventListener('pointerup', soltar);
  caixa.addEventListener('pointercancel', soltar);
  function escolher(k, avisar) {
    if (k === atual) return;
    atual = k; salvarControle(k); marcar();
    if (avisar) aoMudar(k);
  }
  caixa.addEventListener('keydown', e => {
    const i = botoes.findIndex(b => b.dataset.controle === atual);
    const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!passo) return;
    e.preventDefault();
    const prox = botoes[(i + passo + botoes.length) % botoes.length];
    escolher(prox.dataset.controle, true);
    prox.focus();
  });
  marcar();
  return atual;
}

// No GitHub Pages o endereço é usuario.github.io/repositorio: daí sai o link do repositório.
export function linkRepositorio() {
  const m = location.hostname.match(/^([^.]+)\.github\.io$/);
  if (!m) return null;
  const repo = location.pathname.split('/').filter(Boolean)[0];
  return 'https://github.com/' + m[1] + '/' + (repo && !repo.endsWith('.html') ? repo : m[1] + '.github.io');
}

// Onde baixar a Ponte do controle: no site publicado, a versão mais nova da página "Releases" do GitHub;
// no seu PC (teste), o .exe compilado na pasta ponte-controle.
export function linkPonte() {
  const repo = linkRepositorio();
  return repo ? repo + '/releases/latest/download/ponte-controle.exe' : 'ponte-controle/ponte-controle.exe';
}

// topo fixo: guarda a altura dele numa variável do CSS (a barra de treino fica logo abaixo)
// e ganha uma linha embaixo quando a página é rolada
(function topoFixo() {
  const topo = document.querySelector('.topo');
  if (!topo) return;
  const medir = () => document.documentElement.style.setProperty('--altura-topo', topo.offsetHeight + 'px');
  new ResizeObserver(medir).observe(topo);
  const rolou = () => topo.classList.toggle('rolado', window.scrollY > 8);
  window.addEventListener('scroll', rolou, { passive: true });
  medir(); rolou();
})();

const SETA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Explicação da Ponte do controle: a mesma no card de dúvidas e na janela que abre antes de baixar.
export function htmlPonte() {
  const [a, b, c] = t('ponteEsquema').split('|');
  const icCtrl = '<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="6.5" r="4" fill="#f2c230"/><circle cx="6.5" cy="14" r="4" fill="#2f7fe0"/><circle cx="21.5" cy="14" r="4" fill="#e5483b"/><circle cx="14" cy="21.5" r="4" fill="#3fbf5f"/></svg>';
  const icPonte = '<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="12" fill="#5fe08a"/><text x="14" y="19.5" text-anchor="middle" font-size="15" font-weight="700" fill="#0b1a10">♪</text></svg>';
  const passo = (ic, txt) => '<span class="esquema-passo">' + ic + '<span>' + txt + '</span></span>';
  const seta = '<span class="esquema-seta" aria-hidden="true">→</span>';
  return '' +
    '<p>' + t('pontePorque') + '</p>' +
    '<p>' + t('ponteOQueE') + '</p>' +
    '<figure class="exemplo-ponte">' +
      '<div class="exemplo-img"><img src="img/exemplo-ponte.webp" width="1200" height="818" loading="lazy" alt="' + t('exemploLegenda').replace(/"/g, '&quot;') + '">' +
      '<span class="exemplo-rotulo" aria-hidden="true">' + t('exemploJogo') + '</span></div>' +
      '<figcaption>' + t('exemploLegenda') + '</figcaption>' +
    '</figure>' +
    '<div class="esquema">' + passo(icCtrl, a) + seta + passo(icPonte, b) + seta + passo('<img src="img/ocarina.svg" alt="">', c) + '</div>' +
    '<h3>' + t('ponteComoTit') + '</h3>' +
    '<ol><li>' + t('ponteP1') + '</li><li>' + t('ponteP2') + '</li><li>' + t('ponteP3') + '</li></ol>' +
    '<h3>' + t('ponteFecharTit') + '</h3>' +
    '<div class="fechar-ponte">' +
      '<p>' + t('ponteFechar') + '</p>' +
      // desenho do menu do ícone perto do relógio (o programa é em português)
      '<div class="mock-bandeja" aria-hidden="true">' +
        '<div class="mock-menu"><div class="mock-item apagado">Ponte: controle 1, 1 página do site</div><div class="mock-sep"></div><div class="mock-item ativo">Sair<span class="mock-cursor">' +
        '<svg viewBox="0 0 16 22"><path d="M1 1v17l4.5-4.2 3 6.6 2.6-1.2-3-6.4H14z" fill="#fff" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/></svg></span></div></div>' +
        '<div class="mock-barra"><span>⌃</span><span class="mock-icone">♪</span><span>🔊</span><span>12:30</span></div>' +
      '</div>' +
    '</div>' +
    '<h3>' + t('ponteSeguroTit') + '</h3>' +
    '<p>' + t('ponteSeguroCurto') + '</p>' +
    '<h3>' + t('ponteQuemTit') + '</h3>' +
    '<p>' + t('ponteQuem') + '</p>' +
    '<p><a class="botao principal baixar-de-verdade" href="' + linkPonte() + '" download>' + SETA + '<span>' + t('ponteBaixar') + '</span></a></p>';
}

// Janela que abre ao clicar em qualquer "baixar a ponte": explica antes; o download é o botão de dentro.
let dialogo = null;
export function abrirDialogoPonte() {
  if (!dialogo) {
    dialogo = document.createElement('dialog');
    dialogo.className = 'dialogo';
    dialogo.setAttribute('aria-labelledby', 'dialogoPonteTit');
    dialogo.innerHTML = '<div class="dialogo-topo"><h2 id="dialogoPonteTit">' + t('ponteOQue') + '</h2>' +
      '<button type="button" class="botao secundario dialogo-fechar" aria-label="' + t('fechar') + '">✕</button></div>' +
      '<div class="dialogo-corpo duvida-corpo">' + htmlPonte() + '</div>';
    document.body.append(dialogo);
    dialogo.querySelector('.dialogo-fechar').addEventListener('click', () => dialogo.close());
    // clicar fora da caixa fecha
    dialogo.addEventListener('click', e => { if (e.target === dialogo) dialogo.close(); });
  }
  dialogo.showModal();
  dialogo.querySelector('.dialogo-corpo').scrollTop = 0;
}
// Todo link de baixar a ponte abre a explicação primeiro (o href continua valendo se o JS falhar).
export function ligarLinksPonte(raizBusca = document) {
  raizBusca.querySelectorAll('[data-ponte]').forEach(a => {
    a.href = linkPonte();
    a.addEventListener('click', e => { e.preventDefault(); abrirDialogoPonte(); });
  });
}

export function montarRodape() {
  traduzirPagina();
  const f = document.querySelector('footer');
  const repo = linkRepositorio();
  const contato = repo
    ? '<a href="' + repo + '/issues/new?title=Pedido%20de%20remo%C3%A7%C3%A3o">' + t('contatoLink') + '</a>'
    : t('contatoSem');
  f.innerHTML = '<p class="rodape-texto">' + t('rodape', { contato }) + ' ' + t('marcas') + '</p>' +
    '<div class="rodape-acoes">' +
    '<a class="botao secundario" data-ponte href="' + linkPonte() + '">' + SETA + t('rodapePonte') + '</a>' +
    '</div>';
  ligarLinksPonte(f);
}

// Movimento reduzido: escolha do site ("Reduzir animações") ou, sem escolha, a do sistema.
export function movimentoReduzido() {
  const m = document.documentElement.dataset.movimento;
  if (m === 'reduzido') return true;
  if (m === 'normal') return false;
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
// Anima com a Web Animations API, só transform/opacity, e nunca quando o movimento está reduzido.
export function animar(alvo, quadros, opcoes) {
  if (!alvo || movimentoReduzido() || !alvo.animate) return null;
  return alvo.animate(quadros, { easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'none', ...opcoes });
}
// Abre <details> com um surgimento curto do conteúdo; fechar é imediato (não segura o clique).
export function ligarRecolhe(det, chave, abertoPadrao) {
  if (!det) return;
  let salvo = null;
  try { salvo = localStorage.getItem(chave); } catch (e) {}
  det.open = salvo == null ? abertoPadrao : salvo === '1';
  let pronto = false;                      // não anima a abertura inicial, só a que a pessoa faz
  setTimeout(() => { pronto = true; }, 0);
  det.addEventListener('toggle', () => {
    if (!pronto) return;
    try { localStorage.setItem(chave, det.open ? '1' : '0'); } catch (e) {}
    if (det.open) animar(det.querySelector('.recolhe-corpo'), [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { duration: 160 });
  });
}

export function el(id) { return document.getElementById(id); }
