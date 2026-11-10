// Como cada controle mostra os botões. As músicas são guardadas no padrão do Switch
// e convertidas pela POSIÇÃO do botão (A do Switch fica onde fica o B do Xbox, etc.).
// Para adicionar outro controle, basta criar uma entrada nova aqui.
// rotulo = nome usado nas mensagens; icone (opcional) = desenho mostrado no botão.

import { t } from './idioma.js';

const PS_SIMBOLO = {
  A: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>',
  X: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5 20 18.5H4z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>',
  Y: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>'
};

export const CONTROLES = {
  xbox: {
    nome: 'Xbox',
    rotulo: { A: 'B', B: 'A', X: 'Y', Y: 'X', L: 'LB', R: 'RB' },
    classe: { A: 'xb-b', X: 'xb-y', Y: 'xb-x', L: 'ombro-e xb-lb', R: 'ombro-d xb-rb' }
  },
  playstation: {
    nome: 'PlayStation (PS4/PS5)',
    rotulo: { A: t('ps_o'), B: t('ps_x'), X: t('ps_tri'), Y: t('ps_q'), L: 'L1', R: 'R1' },
    icone: PS_SIMBOLO,
    classe: { A: 'ps ps-o', X: 'ps ps-tri', Y: 'ps ps-q', L: 'ombro-e ps-l', R: 'ombro-d ps-r' }
  },
  switch: {
    nome: 'Switch',
    rotulo: { A: 'A', B: 'B', X: 'X', Y: 'Y', L: 'L', R: 'R' },
    classe: { A: 'sw', X: 'sw', Y: 'sw', L: 'ombro-e sw-l', R: 'ombro-d sw-r' }
  }
};

// Posição de cada botão (padrão do Switch) no "standard gamepad" do navegador.
// 0 = de baixo, 1 = da direita, 2 = da esquerda, 3 = de cima, 4 = ombro esq., 5 = ombro dir.
export const INDICE_GAMEPAD = { A: 1, X: 3, Y: 2, L: 4, R: 5 };
export const DPAD_BAIXO = 13;
export const DPAD_CIMA = 12;

const ANALOGICO = '<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="13" cy="13" r="5" fill="currentColor"/></svg>';
const DIRECIONAL = '<svg viewBox="0 0 26 26" aria-hidden="true"><path d="M9 2h8v7h7v8h-7v7H9v-7H2V9h7z" fill="currentColor"/></svg>';

export function htmlModificador(m) {
  if (m === 'down') return '<span class="mod"><span class="seta">↓</span>' + ANALOGICO + '</span>';
  if (m === 'up') return '<span class="mod"><span class="seta">↑</span>' + ANALOGICO + '</span>';
  if (m === 'dpad') return '<span class="mod"><span class="seta">↓</span>' + DIRECIONAL + '</span>';
  if (m === 'dpadup') return '<span class="mod"><span class="seta">↑</span>' + DIRECIONAL + '</span>';
  if (m === 'down+dpad') return '<span class="mod"><span class="seta">↓</span>' + ANALOGICO + '<span class="mais">+</span>' + DIRECIONAL + '</span>';
  return '';
}

export function htmlBotao(controle, botao, extra = '') {
  const c = CONTROLES[controle];
  return '<span class="btn ' + c.classe[botao] + ' ' + extra + '" title="' + c.rotulo[botao] + '">' + ((c.icone && c.icone[botao]) || c.rotulo[botao]) + '</span>';
}

export function htmlNota(controle, nota) {
  if (nota.pausa) return '<span class="pausa">' + t('pausa') + '</span>';
  return htmlModificador(nota.mods[0]) + htmlBotao(controle, nota.botao, nota.incerta ? 'incerta' : '');
}

const PALAVRAS = { '': '', up: t('m_up') + ' + ', down: t('m_down') + ' + ', dpad: t('m_dpad') + ' + ', dpadup: t('m_dpadup') + ' + ', 'down+dpad': t('m_down') + ' + ' + t('m_dpad') + ' + ' };
// nome do modificador sozinho (para listas de escolha)
export function nomeModificador(m) {
  return m === '' ? t('m_nada') : m === 'down+dpad' ? t('m_down') + ' + ' + t('m_dpad') : t('m_' + m);
}
export function descrever(controle, mod, botao) {
  return PALAVRAS[mod] + CONTROLES[controle].rotulo[botao];
}
export function descreverNota(controle, nota) {
  if (nota.pausa) return t('pausaDesc');
  const txt = descrever(controle, nota.mods[0], nota.botao);
  return nota.incerta ? txt + ' ' + t('naoConfirmada') : txt;
}

// Lê o que está sendo segurado no momento em que o botão é apertado.
export function lerModificador(gp) {
  const y = gp.axes[1] || 0;
  const b = gp.buttons[DPAD_BAIXO];
  const dpad = !!(b && b.pressed);
  if (dpad && y > 0.5) return 'down+dpad';
  if (dpad) return 'dpad';
  const c = gp.buttons[DPAD_CIMA];
  if (c && c.pressed) return 'dpadup';
  if (y > 0.5) return 'down';
  if (y < -0.5) return 'up';
  return '';
}


export function htmlLegenda(controle) {
  const mini = b => htmlBotao(controle, b, 'mini');
  const significado = ['L', 'R', 'A', 'Y', 'X'].map(b =>
    '<span class="item">' + mini(b) + (controle !== 'switch' ? t('igualSwitch', { b, pos: t('pos_' + b) }) : t('pos_' + b)) + '</span>'
  ).join('');
  return '<span class="item">' + ANALOGICO + ' ' + t('analogicoEsq') + '</span>' +
    '<span class="item">' + DIRECIONAL + ' ' + t('direcional') + '</span>' +
    '<span class="item">' + ['L', 'R', 'A', 'Y', 'X'].map(mini).join('') + ' ' + t('graveAgudo') + '</span>' +
    '<span class="legenda-quebra"></span>' + significado;
}
