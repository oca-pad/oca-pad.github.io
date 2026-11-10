// O botão "Reduzir animações" saiu do site: vale só a preferência do sistema (prefers-reduced-motion).
// Apaga a escolha antiga, se alguém tinha salvado.
try { localStorage.removeItem('movimento'); } catch (e) {}
