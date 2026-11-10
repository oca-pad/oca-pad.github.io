// Conversa com o programa "Ponte do controle" (Windows), se ele estiver aberto.
// Com a ponte, o site recebe os botões mesmo quando a janela do jogo está em foco.
// Sem a ponte, nada muda: o site continua lendo o controle pelo navegador.
const ENDERECO = 'ws://localhost:47213/';

export function ligarPonte({ aoEstado, aoStatus }) {
  let ws = null, ligada = false, espera = 2000;
  function tentar() {
    try { ws = new WebSocket(ENDERECO); } catch (e) { agendar(); return; }
    ws.onopen = () => { ligada = true; espera = 2000; aoStatus(true, { controles: 0 }); };
    ws.onmessage = ev => {
      let m;
      try { m = JSON.parse(ev.data); } catch (e) { return; }
      if (m.t === 'c') aoStatus(true, m);
      if (m.t === 'e' && Array.isArray(m.b) && Array.isArray(m.a)) {
        // mesmo formato de um controle do navegador (layout "standard")
        aoEstado({ mapping: 'standard', buttons: m.b.map(v => ({ pressed: v === 1, value: v })), axes: m.a }, performance.now());
      }
    };
    ws.onclose = () => {
      if (ligada) { ligada = false; aoStatus(false, null); }
      agendar();
    };
  }
  // sem a ponte aberta, tenta de novo de vez em quando (até 10 s entre tentativas)
  function agendar() { setTimeout(tentar, espera); espera = Math.min(espera * 1.5, 10000); }
  tentar();
  return { ligada: () => ligada };
}
