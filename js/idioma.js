// Idiomas do site. Cada texto tem 5 versões, nesta ordem: português, inglês, espanhol, chinês, japonês.
// {n}, {a}, {b}... são trocados pelos valores na hora. O conteúdo das músicas (título, observações)
// não é traduzido: aparece como quem enviou escreveu.
export const IDIOMAS = { pt: 'Português', en: 'English', es: 'Español', zh: '中文', ja: '日本語' };
const ORDEM = ['pt', 'en', 'es', 'zh', 'ja'];
const HTML_LANG = { pt: 'pt-BR', en: 'en', es: 'es', zh: 'zh-CN', ja: 'ja' };

function detectar() {
  try { const s = localStorage.getItem('idioma'); if (IDIOMAS[s]) return s; } catch (e) {}
  const nav = (navigator.languages || [navigator.language || 'pt']).map(l => String(l).toLowerCase().slice(0, 2));
  return nav.find(l => IDIOMAS[l]) || 'en';
}
export const LANG = typeof navigator === 'undefined' ? 'pt' : detectar();
const I = ORDEM.indexOf(LANG);

const D = {
  // ---- comum ----
  criarLink: ['+ Criar música', '+ Create song', '+ Crear canción', '+ 创建乐曲', '+ 曲を作る'],
  meuControle: ['Meu controle', 'My controller', 'Mi mando', '我的手柄', 'コントローラー'],
  idioma: ['Idioma', 'Language', 'Idioma', '语言', '言語'],
  todas: ['← Todas as músicas', '← All songs', '← Todas las canciones', '← 全部乐曲', '← 曲の一覧'],
  rodape: [
    'Site de fãs, gratuito e sem ligação com nenhuma empresa de jogos. Aqui só tem a ordem dos botões, sem áudio das músicas. Os nomes das obras pertencem aos seus donos. Para pedir a remoção de alguma música, {contato}.',
    'Free fan site, not affiliated with any game company. Only the button order is shown here, with no song audio. Names of works belong to their owners. To request the removal of a song, {contato}.',
    'Sitio de fans, gratuito y sin relación con ninguna empresa de videojuegos. Aquí solo está el orden de los botones, sin audio de las canciones. Los nombres de las obras pertenecen a sus dueños. Para pedir que se retire una canción, {contato}.',
    '免费的粉丝网站，与任何游戏公司无关。这里只有按键顺序，不含歌曲音频。作品名称归其所有者所有。如需删除某首乐曲，{contato}。',
    '無料のファンサイトで、ゲーム会社とは関係ありません。ボタンの順番だけを載せており、曲の音声はありません。作品名は各権利者に帰属します。曲の削除依頼は{contato}。'
  ],
  contatoLink: ['abra um pedido aqui', 'open a request here', 'abre una solicitud aquí', '请在此提交请求', 'こちらからどうぞ'],
  contatoSem: ['abra um pedido (issue) no repositório do site no GitHub', "open an issue in the site's GitHub repository", 'abre un issue en el repositorio del sitio en GitHub', '请在本站的 GitHub 仓库中提交 issue', 'サイトの GitHub リポジトリの issue からどうぞ'],
  legenda: ['Legenda', 'Legend', 'Leyenda', '图例', '凡例'],
  copie: ['Copie:', 'Copy:', 'Copia:', '复制：', 'コピー：'],
  linkCopiado: ['Link copiado!', 'Link copied!', '¡Enlace copiado!', '链接已复制！', 'リンクをコピーしました！'],

  // categorias e dificuldade
  cat_anime: ['Anime', 'Anime', 'Anime', '动漫', 'アニメ'],
  cat_zelda: ['The Legend of Zelda', 'The Legend of Zelda', 'The Legend of Zelda', '塞尔达传说', 'ゼルダの伝説'],
  cat_jogo: ['Outros jogos', 'Other games', 'Otros videojuegos', '其他游戏', 'その他のゲーム'],
  cat_filme: ['Filme', 'Movie', 'Película', '电影', '映画'],
  cat_serie: ['Série', 'TV series', 'Serie', '剧集', 'ドラマ'],
  cat_musica: ['Música', 'Music', 'Música', '音乐', '音楽'],
  cat_outro: ['Outro', 'Other', 'Otro', '其他', 'その他'],
  dif_facil: ['Fácil', 'Easy', 'Fácil', '简单', 'かんたん'],
  dif_medio: ['Médio', 'Medium', 'Media', '中等', 'ふつう'],
  dif_dificil: ['Difícil', 'Hard', 'Difícil', '困难', 'むずかしい'],

  // controles
  ps_o: ['Bolinha', 'Circle', 'Círculo', '圆圈', 'マル'],
  ps_x: ['Xis', 'Cross', 'Equis', '叉', 'バツ'],
  ps_tri: ['Triângulo', 'Triangle', 'Triángulo', '三角', 'サンカク'],
  ps_q: ['Quadrado', 'Square', 'Cuadrado', '方块', 'シカク'],
  m_nada: ['nada', 'nothing', 'nada', '无', 'なし'],
  m_up: ['↑ analógico', '↑ stick', '↑ palanca', '↑ 摇杆', '↑ スティック'],
  m_down: ['↓ analógico', '↓ stick', '↓ palanca', '↓ 摇杆', '↓ スティック'],
  m_dpad: ['↓ direcional', '↓ D-pad', '↓ cruceta', '↓ 十字键', '↓ 十字キー'],
  m_dpadup: ['↑ direcional', '↑ D-pad', '↑ cruceta', '↑ 十字键', '↑ 十字キー'],
  analogicoEsq: ['analógico esquerdo', 'left stick', 'palanca izquierda', '左摇杆', '左スティック'],
  direcional: ['direcional', 'D-pad', 'cruceta', '十字键', '十字キー'],
  graveAgudo: ['do grave ao agudo', 'low to high', 'de grave a agudo', '从低到高', '低い音から高い音へ'],
  igualSwitch: ['= {b} do Switch ({pos})', '= Switch {b} ({pos})', '= {b} de Switch ({pos})', '= Switch 的 {b}（{pos}）', '= Switch の {b}（{pos}）'],
  pos_L: ['ombro esquerdo', 'left shoulder', 'hombro izquierdo', '左肩键', '左肩'],
  pos_R: ['ombro direito', 'right shoulder', 'hombro derecho', '右肩键', '右肩'],
  pos_A: ['direita', 'right', 'derecha', '右', '右'],
  pos_Y: ['esquerda', 'left', 'izquierda', '左', '左'],
  pos_X: ['cima', 'top', 'arriba', '上', '上'],
  pausa: ['pausa', 'rest', 'pausa', '休止', '休符'],
  pausaDesc: ['pausa (só esperar)', 'rest (just wait)', 'pausa (solo espera)', '休止（等待即可）', '休符（待つだけ）'],
  naoConfirmada: ['(não confirmada)', '(not confirmed)', '(sin confirmar)', '（未确认）', '（未確認）'],

  // ---- lista ----
  listaTitulo: ['Músicas para tocar na ocarina', 'Songs to play on the ocarina', 'Canciones para tocar en la ocarina', '用陶笛演奏的乐曲', 'オカリナで吹ける曲'],
  listaSub: [
    'Escolha uma música, conecte o controle e a página confere cada nota que você toca.',
    'Pick a song, connect your controller and the page checks every note you play.',
    'Elige una canción, conecta el mando y la página revisa cada nota que tocas.',
    '选择一首乐曲，连接手柄，页面会检查你弹的每个音。',
    '曲を選んでコントローラーをつなぐと、吹いた音をひとつずつチェックします。'
  ],
  buscarPh: ['Buscar por música, anime, filme, jogo…', 'Search by song, anime, movie, game…', 'Buscar por canción, anime, película, juego…', '搜索乐曲、动漫、电影、游戏…', '曲名・アニメ・映画・ゲームで検索…'],
  buscarAria: ['Buscar música', 'Search songs', 'Buscar canción', '搜索乐曲', '曲を検索'],
  todasCat: ['Todas as categorias', 'All categories', 'Todas las categorías', '全部分类', 'すべてのカテゴリ'],
  qualquerDif: ['Qualquer dificuldade', 'Any difficulty', 'Cualquier dificultad', '任意难度', 'すべての難易度'],
  carregandoMusicas: ['Carregando músicas…', 'Loading songs…', 'Cargando canciones…', '正在加载乐曲…', '曲を読み込み中…'],
  musicas1: ['{n} música', '{n} song', '{n} canción', '{n} 首乐曲', '{n} 曲'],
  musicasN: ['{n} músicas', '{n} songs', '{n} canciones', '{n} 首乐曲', '{n} 曲'],
  deMusicas: ['{a} de {b} músicas', '{a} of {b} songs', '{a} de {b} canciones', '{a} / {b} 首乐曲', '{b} 曲中 {a} 曲'],
  nenhuma: ['Nenhuma música encontrada. Tente outra palavra ou tire os filtros.', 'No songs found. Try another word or clear the filters.', 'No se encontraron canciones. Prueba otra palabra o quita los filtros.', '没有找到乐曲。换个关键词或清除筛选。', '曲が見つかりません。別の言葉で探すか、絞り込みを外してください。'],
  notas1: ['{n} nota', '{n} note', '{n} nota', '{n} 个音', '{n} 音'],
  notasN: ['{n} notas', '{n} notes', '{n} notas', '{n} 个音', '{n} 音'],
  comRitmo: ['com ritmo', 'with rhythm', 'con ritmo', '有节奏', 'リズム付き'],
  erroLista: ['Não consegui carregar a lista de músicas. Atualize a página.', "Couldn't load the song list. Reload the page.", 'No se pudo cargar la lista de canciones. Recarga la página.', '无法加载乐曲列表。请刷新页面。', '曲の一覧を読み込めませんでした。ページを再読み込みしてください。'],

  // ---- tocar ----
  carregando: ['Carregando…', 'Loading…', 'Cargando…', '加载中…', '読み込み中…'],
  padNao: ['Controle não detectado: aperte qualquer botão do controle', 'Controller not detected: press any button on it', 'Mando no detectado: pulsa cualquier botón del mando', '未检测到手柄：请按手柄上的任意键', 'コントローラー未検出：どれかボタンを押してください'],
  padOk: ['Controle conectado', 'Controller connected', 'Mando conectado', '手柄已连接', 'コントローラー接続中'],
  padOff: ['Controle desconectado: aperte qualquer botão', 'Controller disconnected: press any button', 'Mando desconectado: pulsa cualquier botón', '手柄已断开：请按任意键', 'コントローラーが切断されました：どれかボタンを押してください'],
  semSuporte: ['Este navegador não deixa a página ler o controle. Use o toque ou as setas.', "This browser doesn't let the page read the controller. Use tap or the arrow keys.", 'Este navegador no deja que la página lea el mando. Usa el toque o las flechas.', '此浏览器不允许页面读取手柄。请点按或使用方向键。', 'このブラウザではコントローラーを読み取れません。タップか矢印キーを使ってください。'],
  optFrase: ['Errou: voltar pro começo da frase', 'Miss: back to start of phrase', 'Fallo: volver al inicio de la frase', '出错：回到本句开头', 'ミス：フレーズの最初に戻る'],
  optMusica: ['Errou: voltar pro começo da música', 'Miss: back to start of song', 'Fallo: volver al inicio de la canción', '出错：回到乐曲开头', 'ミス：曲の最初に戻る'],
  optLoop: ['Acabou: começar de novo', 'Finished: start over', 'Al terminar: empezar de nuevo', '结束后：重新开始', '終わったら：最初から'],
  optRitmo: ['Modo ritmo', 'Rhythm mode', 'Modo ritmo', '节奏模式', 'リズムモード'],
  gravarRitmo: ['Gravar ritmo', 'Record rhythm', 'Grabar ritmo', '录制节奏', 'リズムを録音'],
  cancelarGravacao: ['Cancelar gravação', 'Cancel recording', 'Cancelar grabación', '取消录制', '録音をやめる'],
  recomecar: ['Recomeçar', 'Restart', 'Reiniciar', '重新开始', 'やり直す'],
  ordem: ['Primeiro o que segura, depois o botão.', 'First what you hold, then the button.', 'Primero lo que mantienes, después el botón.', '先按住的，再按按键。', '先に押さえるもの、次にボタン。'],
  copiarLink: ['Copiar link', 'Copy link', 'Copiar enlace', '复制链接', 'リンクをコピー'],
  copiarLinkCompleto: ['Copiar link com a música dentro', 'Copy link with the song inside', 'Copiar enlace con la canción dentro', '复制包含乐曲的链接', '曲入りリンクをコピー'],
  editarCopia: ['Editar uma cópia', 'Edit a copy', 'Editar una copia', '编辑副本', 'コピーを編集'],
  copiarRitmo: ['Copiar ritmo (para o arquivo da música)', 'Copy rhythm (for the song file)', 'Copiar ritmo (para el archivo de la canción)', '复制节奏（用于乐曲文件）', 'リズムをコピー（曲ファイル用）'],
  ritmoCopiado: ['Ritmo copiado!', 'Rhythm copied!', '¡Ritmo copiado!', '节奏已复制！', 'リズムをコピーしました！'],
  dica1: [
    '<b>Para jogar e treinar junto:</b> deixe o emulador em <b>janela sem bordas</b> (em tela cheia exclusiva esta página some), coloque esta janela do lado e não minimize. A página lê o mesmo controle que o emulador, mas só enquanto ela estiver em foco.',
    "<b>To practice while playing:</b> run the emulator in a <b>borderless window</b> (in exclusive fullscreen this page disappears), put this window beside it and don't minimize it. The page reads the same controller as the emulator, but only while it has focus.",
    '<b>Para jugar y practicar a la vez:</b> pon el emulador en <b>ventana sin bordes</b> (en pantalla completa exclusiva esta página desaparece), coloca esta ventana al lado y no la minimices. La página lee el mismo mando que el emulador, pero solo mientras está en primer plano.',
    '<b>边玩边练：</b>把模拟器设为<b>无边框窗口</b>（独占全屏时本页面会被挡住），把本窗口放在旁边，不要最小化。页面和模拟器读取同一个手柄，但只有在本页面处于焦点时才有效。',
    '<b>ゲームしながら練習するには：</b>エミュレーターを<b>ボーダーレスウィンドウ</b>にして（排他フルスクリーンだとこのページが隠れます）、このウィンドウを横に置き、最小化しないでください。エミュレーターと同じコントローラーを読み取りますが、このページが選択されている間だけです。'
  ],
  dica2: ['Sem o controle, toque numa nota ou use as setas → e ← do teclado para marcar onde você está.', 'Without a controller, tap a note or use the → and ← keys to mark where you are.', 'Sin mando, toca una nota o usa las flechas → y ← del teclado para marcar dónde estás.', '没有手柄时，点按音符或用键盘 → 和 ← 标记当前位置。', 'コントローラーがないときは、音符をタップするか → ← キーで位置を合わせてください。'],
  naoEncontrada: ['Música não encontrada', 'Song not found', 'Canción no encontrada', '未找到乐曲', '曲が見つかりません'],
  naoEncontradaInfo: ['O link pode estar incompleto ou a música foi removida. Volte para a lista e escolha outra.', 'The link may be incomplete or the song was removed. Go back to the list and pick another.', 'El enlace puede estar incompleto o la canción fue retirada. Vuelve a la lista y elige otra.', '链接可能不完整，或乐曲已被删除。请返回列表选择其他乐曲。', 'リンクが不完全か、曲が削除された可能性があります。一覧に戻って別の曲を選んでください。'],
  enviadaPor: ['enviada por {n}', 'sent by {n}', 'enviada por {n}', '由 {n} 提交', '投稿：{n}'],
  frase: ['Frase {n}', 'Phrase {n}', 'Frase {n}', '第 {n} 句', 'フレーズ {n}'],
  frases1: ['{n} frase', '{n} phrase', '{n} frase', '{n} 句', '{n} フレーズ'],
  frasesN: ['{n} frases', '{n} phrases', '{n} frases', '{n} 句', '{n} フレーズ'],
  notasTit: ['Notas', 'Notes', 'Notas', '音符', '音符'],
  primeira: ['Primeira nota: {n}', 'First note: {n}', 'Primera nota: {n}', '第一个音：{n}', '最初の音：{n}'],
  notaAtual: ['Nota atual: {n}', 'Current note: {n}', 'Nota actual: {n}', '当前音：{n}', '今の音：{n}'],
  pronto: ['Pronto. ', 'Ready. ', 'Listo. ', '准备好了。', '準備OK。'],
  pulou: ['Pulou pra nota {i}: {n}.', 'Jumped to note {i}: {n}.', 'Saltaste a la nota {i}: {n}.', '跳到第 {i} 个音：{n}。', '{i} 番目の音へ：{n}。'],
  erros1: ['{n} erro', '{n} miss', '{n} fallo', '{n} 个错误', 'ミス {n}'],
  errosN: ['{n} erros', '{n} misses', '{n} fallos', '{n} 个错误', 'ミス {n}'],
  placarTempo: [' · no tempo {a}/{b}', ' · on time {a}/{b}', ' · a tiempo {a}/{b}', ' · 准时 {a}/{b}', ' · タイミング {a}/{b}'],
  doComeco: ['Do começo. ', 'From the top. ', 'Desde el principio. ', '从头开始。', '最初から。'],
  completa: ['Música completa! {e}.', 'Song complete! {e}.', '¡Canción completa! {e}.', '乐曲完成！{e}。', '曲が終わりました！{e}。'],
  completaTempo: [' No tempo: {a} de {b}.', ' On time: {a} of {b}.', ' A tiempo: {a} de {b}.', ' 准时：{a}/{b}。', ' タイミング：{b} 中 {a}。'],
  comecandoNovo: [' Começando de novo…', ' Starting over…', ' Empezando de nuevo…', ' 重新开始…', ' もう一度…'],
  deNovo: ['De novo! ', 'Again! ', '¡Otra vez! ', '再来一次！', 'もう一回！'],
  apertaRecomecar: [' Aperte Recomeçar para tocar de novo.', ' Press Restart to play again.', ' Pulsa Reiniciar para tocar otra vez.', ' 按“重新开始”再弹一次。', ' 「やり直す」でもう一度。'],
  acertou: ['Acertou.', 'Correct.', '¡Bien!', '正确。', '正解。'],
  pausas1: [' Agora uma pausa: espere o tempo dela.', ' Now a rest: wait for it.', ' Ahora una pausa: espera su tiempo.', ' 接下来是休止：请等待。', ' 次は休符：少し待って。'],
  pausasN: [' Agora {n} pausas: espere o tempo delas.', ' Now {n} rests: wait for them.', ' Ahora {n} pausas: espera su tiempo.', ' 接下来有 {n} 个休止：请等待。', ' 次は休符 {n} つ：少し待って。'],
  proxima: [' Próxima: {n}', ' Next: {n}', ' Siguiente: {n}', ' 下一个：{n}', ' 次：{n}'],
  gravContinua: [' A gravação continua: toque a nota certa.', ' Recording continues: play the right note.', ' La grabación sigue: toca la nota correcta.', ' 录制继续：请弹正确的音。', ' 録音は続きます：正しい音を吹いてください。'],
  voltouFrase: [' Voltou pro começo da frase.', ' Back to the start of the phrase.', ' Volviste al inicio de la frase.', ' 回到本句开头。', ' フレーズの最初に戻りました。'],
  voltouMusica: [' Voltou pro começo da música.', ' Back to the start of the song.', ' Volviste al inicio de la canción.', ' 回到乐曲开头。', ' 曲の最初に戻りました。'],
  errou: ['Errou: você tocou {a}, era {b}.', 'Miss: you played {a}, it was {b}.', 'Fallo: tocaste {a}, era {b}.', '错了：你弹的是 {a}，应该是 {b}。', 'ミス：{a} を押しました。正しくは {b}。'],
  gravCanceladaPulou: ['Gravação cancelada (você pulou de nota).', 'Recording canceled (you jumped notes).', 'Grabación cancelada (saltaste de nota).', '录制已取消（你跳过了音符）。', '録音を中止しました（音を飛ばしたため）。'],
  comecou: ['Começou!', 'Go!', '¡Empezó!', '开始！', 'スタート！'],
  noTempo: ['No tempo!', 'On time!', '¡A tiempo!', '准时！', 'ぴったり！'],
  adiantado: ['Adiantado {s} s.', 'Early {s} s.', 'Adelantado {s} s.', '提前 {s} 秒。', '{s} 秒早い。'],
  atrasado: ['Atrasado {s} s.', 'Late {s} s.', 'Atrasado {s} s.', '延后 {s} 秒。', '{s} 秒遅い。'],
  notaCertaMas: ['Acertou a nota. {x}', 'Right note. {x}', 'Nota correcta. {x}', '音对了。{x}', '音は正解。{x}'],
  espere: ['espere…', 'wait…', 'espera…', '等待…', '待って…'],
  agora: ['agora!', 'now!', '¡ahora!', '现在！', '今！'],
  tarde: ['atrasado', 'late', 'tarde', '晚了', '遅い'],
  toqueComecar: ['toque para começar', 'play to start', 'toca para empezar', '弹奏即开始', '吹いてスタート'],
  ritmoUsuario: ['Usando o ritmo que você gravou', 'Using the rhythm you recorded', 'Usando el ritmo que grabaste', '使用你录制的节奏', '録音したリズムを使用中'],
  ritmoMusica: ['Usando o ritmo da música', "Using the song's rhythm", 'Usando el ritmo de la canción', '使用乐曲自带的节奏', '曲のリズムを使用中'],
  semRitmo: ['Esta música ainda não tem ritmo: use "Gravar ritmo"', 'This song has no rhythm yet: use "Record rhythm"', 'Esta canción aún no tiene ritmo: usa "Grabar ritmo"', '这首乐曲还没有节奏：请使用“录制节奏”', 'この曲にはまだリズムがありません：「リズムを録音」を使ってください'],
  gravCancelada: ['Gravação cancelada.', 'Recording canceled.', 'Grabación cancelada.', '录制已取消。', '録音を中止しました。'],
  gravandoRitmo: ['Gravando o ritmo: toque a música inteira no tempo certo, junto com o vídeo. ', 'Recording rhythm: play the whole song in time, along with the video. ', 'Grabando el ritmo: toca toda la canción a tiempo, junto con el video. ', '正在录制节奏：跟着视频按正确节奏弹完整首乐曲。', 'リズムを録音中：動画に合わせて曲を最後まで吹いてください。'],
  ritmoGravado: ['Ritmo gravado! O modo ritmo está ligado: toque de novo e a barra mostra a hora de cada nota.', 'Rhythm recorded! Rhythm mode is on: play again and the bar shows when to play each note.', '¡Ritmo grabado! El modo ritmo está activo: toca de nuevo y la barra muestra cuándo tocar cada nota.', '节奏已录制！节奏模式已开启：再弹一次，进度条会提示每个音的时机。', 'リズムを録音しました！リズムモードがオンです。もう一度吹くと、バーが各音のタイミングを示します。'],

  // ---- criar ----
  criarTitulo: ['Criar música', 'Create song', 'Crear canción', '创建乐曲', '曲を作る'],
  criarSub: [
    'Toque no controle junto com o vídeo: a página escreve as notas e o ritmo. Depois é só ajustar. Tudo fica salvo neste navegador.',
    'Play on your controller along with the video: the page writes down the notes and the rhythm. Then just fine-tune. Everything is saved in this browser.',
    'Toca con el mando junto con el video: la página escribe las notas y el ritmo. Después solo ajusta. Todo se guarda en este navegador.',
    '跟着视频用手柄弹奏：页面会记下音符和节奏，之后再微调即可。所有内容都保存在此浏览器中。',
    '動画に合わせてコントローラーで吹くと、音符とリズムを書き取ります。あとは調整するだけ。すべてこのブラウザに保存されます。'
  ],
  minhas: ['Minhas músicas', 'My songs', 'Mis canciones', '我的乐曲', 'マイ曲'],
  nova: ['+ Nova', '+ New', '+ Nueva', '+ 新建', '+ 新規'],
  apagarEsta: ['Apagar esta', 'Delete this one', 'Borrar esta', '删除这首', 'この曲を削除'],
  semTitulo: ['Sem título', 'Untitled', 'Sin título', '无标题', '無題'],
  novaTag: ['(nova)', '(new)', '(nueva)', '（新）', '（新規）'],
  salvoNav: ['Salvo neste navegador', 'Saved in this browser', 'Guardado en este navegador', '已保存到此浏览器', 'このブラウザに保存しました'],
  naoSalvou: ['Não consegui salvar neste navegador', "Couldn't save in this browser", 'No se pudo guardar en este navegador', '无法保存到此浏览器', 'このブラウザに保存できませんでした'],
  dadosAria: ['Dados da música', 'Song details', 'Datos de la canción', '乐曲信息', '曲の情報'],
  f_titulo: ['Título', 'Title', 'Título', '标题', 'タイトル'],
  f_tituloPh: ['Ex.: Abertura de Pokémon', 'E.g.: Pokémon opening', 'Ej.: Opening de Pokémon', '例：宝可梦片头曲', '例：ポケモンのオープニング'],
  f_origem: ['De onde é', "Where it's from", 'De dónde es', '出处', '作品名'],
  f_origemPh: ['Anime, filme, jogo…', 'Anime, movie, game…', 'Anime, película, juego…', '动漫、电影、游戏…', 'アニメ・映画・ゲーム…'],
  f_categoria: ['Categoria', 'Category', 'Categoría', '分类', 'カテゴリ'],
  f_nome: ['Seu nome no site', 'Your name on the site', 'Tu nombre en el sitio', '你在网站上的名字', 'サイトでの表示名'],
  f_nomePh: ['Como quer aparecer', 'How you want to appear', 'Cómo quieres aparecer', '希望显示的名字', '表示したい名前'],
  f_tags: ['Palavras para a busca', 'Search keywords', 'Palabras para la búsqueda', '搜索关键词', '検索キーワード'],
  f_tagsPh: ['separadas por vírgula', 'comma-separated', 'separadas por comas', '用逗号分隔', 'カンマ区切り'],
  f_obs: ['Observações', 'Notes', 'Observaciones', '备注', 'メモ'],
  f_obsPh: ['Dicas para quem for tocar (opcional)', 'Tips for players (optional)', 'Consejos para quien vaya a tocar (opcional)', '给演奏者的提示（可选）', '演奏する人へのヒント（任意）'],
  msgInicial: ['Aperte "Gravar do zero" e toque a música no controle.', 'Press "Record from scratch" and play the song on your controller.', 'Pulsa "Grabar desde cero" y toca la canción con el mando.', '按“从头录制”，然后用手柄弹奏乐曲。', '「最初から録音」を押して、コントローラーで曲を吹いてください。'],
  gravarZero: ['● Gravar do zero', '● Record from scratch', '● Grabar desde cero', '● 从头录制', '● 最初から録音'],
  gravarFim: ['● Continuar gravando no fim', '● Keep recording at the end', '● Seguir grabando al final', '● 在末尾继续录制', '● 最後に続けて録音'],
  parar: ['■ Parar', '■ Stop', '■ Parar', '■ 停止', '■ 停止'],
  corteA: ['Frase nova depois de', 'New phrase after', 'Frase nueva después de', '停顿超过', ''],
  corteB: ['s parado', 's of silence', 's sin tocar', '秒则开始新的一句', '秒止まったら新フレーズ'],
  painelAria: ['Nota escolhida', 'Selected note', 'Nota elegida', '选中的音符', '選んだ音'],
  notaN: ['Nota {n}', 'Note {n}', 'Nota {n}', '第 {n} 个音', '{n} 番目の音'],
  pausaN: ['Pausa {n}', 'Rest {n}', 'Pausa {n}', '第 {n} 个（休止）', '{n} 番目（休符）'],
  p_botao: ['Botão', 'Button', 'Botón', '按键', 'ボタン'],
  p_seg: ['Segurando', 'Holding', 'Manteniendo', '按住', '押さえる'],
  p_espera: ['Espera antes dela', 'Wait before it', 'Espera antes', '之前等待', '前の待ち時間'],
  p_frase: ['Começa uma frase nova aqui', 'A new phrase starts here', 'Aquí empieza una frase nueva', '从这里开始新的一句', 'ここから新しいフレーズ'],
  p_notaAntes: ['+ Nota antes', '+ Note before', '+ Nota antes', '+ 前面加音', '+ 前に音を追加'],
  p_pausaAntes: ['+ Pausa antes', '+ Rest before', '+ Pausa antes', '+ 前面加休止', '+ 前に休符を追加'],
  p_regravar: ['● Regravar a partir daqui', '● Re-record from here', '● Regrabar desde aquí', '● 从这里重新录制', '● ここから録り直す'],
  p_apagar: ['Apagar nota', 'Delete note', 'Borrar nota', '删除音符', '音を削除'],
  p_fechar: ['Fechar', 'Close', 'Cerrar', '关闭', '閉じる'],
  p_dica: ['Dica: com uma nota escolhida, apertar um botão no controle troca a nota.', 'Tip: with a note selected, pressing a controller button replaces it.', 'Consejo: con una nota elegida, pulsar un botón del mando la cambia.', '提示：选中音符后，按手柄上的键即可替换。', 'ヒント：音を選んだ状態でボタンを押すと、その音を置き換えます。'],
  addNota: ['+ Nota no fim', '+ Note at the end', '+ Nota al final', '+ 末尾加音', '+ 最後に音を追加'],
  addPausa: ['+ Pausa no fim', '+ Rest at the end', '+ Pausa al final', '+ 末尾加休止', '+ 最後に休符を追加'],
  temRitmo: ['Esta música tem ritmo', 'This song has rhythm', 'Esta canción tiene ritmo', '这首乐曲有节奏', 'この曲にはリズムがある'],
  pronta: ['<b>Pronta?</b> Teste do jeito que os outros vão ver e, se estiver boa, peça a publicação.', "<b>Done?</b> Test it the way others will see it and, if it's good, request publishing.", '<b>¿Lista?</b> Pruébala como la verán los demás y, si está bien, pide la publicación.', '<b>完成了？</b>以其他人看到的方式测试一下，满意的话就申请发布。', '<b>できた？</b>ほかの人と同じ画面で試して、よければ公開を依頼しましょう。'],
  testar: ['▶ Testar', '▶ Test', '▶ Probar', '▶ 测试', '▶ 試す'],
  pedirPub: ['Pedir publicação no site', 'Request publishing', 'Pedir publicación', '申请发布到网站', 'サイトへの公開を依頼'],
  pubInfo: ['O pedido abre no GitHub (precisa de uma conta grátis). A música aparece no site depois de aprovada.', "The request opens on GitHub (needs a free account). The song shows up after it's approved.", 'La solicitud se abre en GitHub (necesitas una cuenta gratis). La canción aparece en el sitio tras ser aprobada.', '申请会在 GitHub 打开（需要免费账号）。审核通过后乐曲会出现在网站上。', '依頼は GitHub で開きます（無料アカウントが必要）。承認されるとサイトに表示されます。'],
  pubLocal: ['O pedido de publicação funciona quando o site estiver no ar (endereço github.io). No seu PC, use "Testar" para conferir.', 'Publishing requests work once the site is online (github.io address). On your PC, use "Test" to check.', 'La solicitud funciona cuando el sitio esté en línea (dirección github.io). En tu PC, usa "Probar" para revisar.', '网站上线后（github.io 地址）才能申请发布。在本机请用“测试”检查。', '公開依頼はサイト公開後（github.io）に使えます。PC では「試す」で確認してください。'],
  pubSoOnline: ['O pedido de publicação só funciona no site publicado (github.io).', 'Publishing requests only work on the published site (github.io).', 'La solicitud solo funciona en el sitio publicado (github.io).', '只能在已发布的网站（github.io）上申请发布。', '公開依頼は公開済みのサイト（github.io）でのみ使えます。'],
  pubGrande: ['A música é grande demais para o pedido automático. Divida em duas partes.', 'The song is too long for an automatic request. Split it in two.', 'La canción es demasiado larga para la solicitud automática. Divídela en dos.', '乐曲太长，无法自动申请。请拆成两部分。', '曲が長すぎて自動依頼できません。2つに分けてください。'],
  pubAberto: ['Abri o pedido no GitHub. Confira e clique em "Create" (ou "Submit new issue") para enviar.', 'I opened the request on GitHub. Check it and click "Create" (or "Submit new issue") to send it.', 'Abrí la solicitud en GitHub. Revísala y pulsa "Create" (o "Submit new issue") para enviarla.', '已在 GitHub 打开申请。确认后点击“Create”（或“Submit new issue”）提交。', 'GitHub で依頼を開きました。確認して「Create」（または「Submit new issue」）を押してください。'],
  erroTitulo: ['Falta o título da música.', 'The song needs a title.', 'Falta el título de la canción.', '缺少乐曲标题。', '曲のタイトルがありません。'],
  erroSemNotas: ['A música ainda não tem notas.', 'The song has no notes yet.', 'La canción aún no tiene notas.', '乐曲还没有音符。', 'まだ音がありません。'],
  erroMusica: ['A música tem um problema: {e}', 'The song has a problem: {e}', 'La canción tiene un problema: {e}', '乐曲有问题：{e}', '曲に問題があります：{e}'],
  musicaNova: ['Música nova. Aperte "Gravar do zero" e toque no controle.', 'New song. Press "Record from scratch" and play on your controller.', 'Canción nueva. Pulsa "Grabar desde cero" y toca con el mando.', '新乐曲。按“从头录制”，然后用手柄弹奏。', '新しい曲です。「最初から録音」を押して吹いてください。'],
  confirmApagar: ['Apagar "{t}" deste navegador? Não dá para desfazer.', 'Delete "{t}" from this browser? This can\'t be undone.', '¿Borrar "{t}" de este navegador? No se puede deshacer.', '要从此浏览器删除“{t}”吗？此操作无法撤销。', '「{t}」をこのブラウザから削除しますか？元に戻せません。'],
  apagada: ['Música apagada.', 'Song deleted.', 'Canción borrada.', '乐曲已删除。', '曲を削除しました。'],
  copiaTit: ['{t} (cópia)', '{t} (copy)', '{t} (copia)', '{t}（副本）', '{t}（コピー）'],
  vazio: ['Nenhuma nota ainda. Grave tocando no controle ou use "+ Nota no fim".', 'No notes yet. Record by playing on your controller or use "+ Note at the end".', 'Aún no hay notas. Graba tocando con el mando o usa "+ Nota al final".', '还没有音符。用手柄弹奏录制，或使用“+ 末尾加音”。', 'まだ音がありません。コントローラーで吹いて録音するか、「+ 最後に音を追加」を使ってください。'],
  inicio: ['início', 'start', 'inicio', '开始', '開始'],
  doSwitch: [' ({b} do Switch)', ' (Switch {b})', ' ({b} de Switch)', '（Switch 的 {b}）', '（Switch の {b}）'],
  regravando: ['Regravando a partir da nota {n}: toque o resto da música no controle.', 'Re-recording from note {n}: play the rest of the song on your controller.', 'Regrabando desde la nota {n}: toca el resto de la canción con el mando.', '从第 {n} 个音重新录制：用手柄弹奏剩下的部分。', '{n} 番目の音から録り直し中：残りをコントローラーで吹いてください。'],
  confirmZero: ['Gravar do zero apaga as notas desta música. Continuar?', "Recording from scratch deletes this song's notes. Continue?", 'Grabar desde cero borra las notas de esta canción. ¿Seguir?', '从头录制会删除这首乐曲的音符。继续吗？', '最初から録音すると、この曲の音が消えます。続けますか？'],
  gravandoZero: ['Gravando: toque a música no controle, no ritmo do vídeo. Aperte "Parar" no fim.', 'Recording: play the song on your controller, in time with the video. Press "Stop" at the end.', 'Grabando: toca la canción con el mando, al ritmo del video. Pulsa "Parar" al final.', '录制中：跟着视频的节奏用手柄弹奏。结束时按“停止”。', '録音中：動画のリズムに合わせて吹いてください。最後に「停止」を押します。'],
  gravandoFim: ['Gravando no fim da música. Aperte "Parar" quando terminar.', 'Recording at the end of the song. Press "Stop" when done.', 'Grabando al final de la canción. Pulsa "Parar" al terminar.', '在乐曲末尾录制。完成后按“停止”。', '曲の最後に録音中。終わったら「停止」を押してください。'],
  gravParada: ['Gravação parada. Clique numa nota para ajustar.', 'Recording stopped. Click a note to adjust it.', 'Grabación detenida. Haz clic en una nota para ajustarla.', '录制已停止。点击音符进行调整。', '録音を止めました。音をクリックして調整できます。'],
  gravou: ['Gravou: {n}', 'Recorded: {n}', 'Grabado: {n}', '已录：{n}', '録音：{n}'],
  fraseNovaTag: [' (frase nova)', ' (new phrase)', ' (frase nueva)', '（新的一句）', '（新フレーズ）'],
  trocada: ['Nota {i} trocada para {n}.', 'Note {i} changed to {n}.', 'Nota {i} cambiada a {n}.', '第 {i} 个音已改为 {n}。', '{i} 番目の音を {n} に変更しました。'],
  semSuporteCriar: ['Este navegador não deixa a página ler o controle. Use "+ Nota no fim".', 'This browser doesn\'t let the page read the controller. Use "+ Note at the end".', 'Este navegador no deja que la página lea el mando. Usa "+ Nota al final".', '此浏览器不允许页面读取手柄。请使用“+ 末尾加音”。', 'このブラウザではコントローラーを読み取れません。「+ 最後に音を追加」を使ってください。'],
  copiaCriada: ['Cópia criada. Edite à vontade: o original não muda.', 'Copy created. Edit freely: the original stays the same.', 'Copia creada. Edita a gusto: el original no cambia.', '副本已创建。随意编辑，原曲不会改变。', 'コピーを作りました。自由に編集できます（元の曲は変わりません）。'],
  f_dificuldade: ['Dificuldade', 'Difficulty', 'Dificultad', '难度', '難易度'],
  limparFiltros: ['Limpar busca e filtros', 'Clear search and filters', 'Limpiar búsqueda y filtros', '清除搜索和筛选', '検索と絞り込みをクリア'],
  nenhumaTit: ['Nenhuma música encontrada', 'No songs found', 'No se encontraron canciones', '没有找到乐曲', '曲が見つかりません'],
  nenhumaDica: ['Tente outra palavra, confira a ortografia ou tire os filtros.', 'Try another word, check the spelling or clear the filters.', 'Prueba otra palabra, revisa la ortografía o quita los filtros.', '换个关键词、检查拼写或清除筛选。', '別の言葉で探すか、つづりを確認するか、絞り込みを外してください。'],
  erroListaTit: ['Não deu para carregar as músicas', "Couldn't load the songs", 'No se pudieron cargar las canciones', '无法加载乐曲', '曲を読み込めませんでした'],
  tentarNovo: ['Tentar de novo', 'Try again', 'Intentar de nuevo', '重试', 'もう一度試す'],
  opcoesTreino: ['Opções de treino', 'Practice options', 'Opciones de práctica', '练习选项', '練習オプション'],
  opcoesGravacao: ['Opções de gravação', 'Recording options', 'Opciones de grabación', '录制选项', '録音オプション'],
  treino: ['Treino', 'Practice', 'Práctica', '练习', '練習'],
  compartilharTit: ['Compartilhar e editar', 'Share and edit', 'Compartir y editar', '分享与编辑', '共有と編集'],
  movReduzir: ['Reduzir animações', 'Reduce motion', 'Reducir animaciones', '减少动画', 'アニメーションを減らす'],
  obrigatorioAjuda: ['campo obrigatório', 'required field', 'campo obligatorio', '必填项', '必須項目'],
  passo1: ['1 · Dados da música', '1 · Song details', '1 · Datos de la canción', '1 · 乐曲信息', '1 · 曲の情報'],
  passo2: ['2 · Gravar e ajustar as notas', '2 · Record and adjust the notes', '2 · Grabar y ajustar las notas', '2 · 录制并调整音符', '2 · 録音して音を調整'],
  passo3: ['3 · Testar e publicar', '3 · Test and publish', '3 · Probar y publicar', '3 · 测试并发布', '3 · 試して公開'],
  menos005: ['Diminuir 0,05 s', 'Decrease 0.05 s', 'Disminuir 0,05 s', '减少 0.05 秒', '0.05 秒減らす'],
  mais005: ['Aumentar 0,05 s', 'Increase 0.05 s', 'Aumentar 0,05 s', '增加 0.05 秒', '0.05 秒増やす'],
  voltarLista: ['← Músicas', '← Songs', '← Canciones', '← 乐曲', '← 曲一覧'],
  redesTit: ['Suas redes sociais (opcional)', 'Your social media (optional)', 'Tus redes sociales (opcional)', '你的社交账号（可选）', 'あなたの SNS（任意）'],
  redesAjuda: ['Aparecem na página da música. Escreva só o @usuário (ou cole o link do perfil). Até 5.', 'Shown on the song page. Type just the @username (or paste the profile link). Up to 5.', 'Aparecen en la página de la canción. Escribe solo el @usuario (o pega el enlace del perfil). Hasta 5.', '会显示在乐曲页面。只需填写 @用户名（或粘贴主页链接）。最多 5 个。', '曲のページに表示されます。@ユーザー名だけを入力（またはプロフィールのリンクを貼り付け）。最大 5 つ。'],
  addRede: ['+ Adicionar rede', '+ Add social', '+ Agregar red', '+ 添加账号', '+ SNS を追加'],
  removerRede: ['Remover', 'Remove', 'Quitar', '移除', '削除'],
  redeTipo: ['Rede', 'Network', 'Red', '平台', 'サービス'],
  redeUsuario: ['Usuário', 'Username', 'Usuario', '用户名', 'ユーザー名'],
  redeInvalida: ['Use só letras, números, ponto, _ ou -', 'Use only letters, numbers, dot, _ or -', 'Usa solo letras, números, punto, _ o -', '只能使用字母、数字、点、_ 或 -', '英数字・ピリオド・_・- だけ使えます'],
  ponteOk: ['Ponte conectada: funciona com o jogo em foco', 'Bridge connected: works with the game in focus', 'Puente conectado: funciona con el juego en primer plano', '桥接已连接：游戏在前台时也能用', 'ブリッジ接続中：ゲームを操作中でも動きます'],
  ponteSemControle: ['Ponte conectada, mas nenhum controle ligado', 'Bridge connected, but no controller found', 'Puente conectado, pero no hay mando', '桥接已连接，但没有检测到手柄', 'ブリッジ接続中（コントローラーが見つかりません）'],
  ponteTit: ['Jogando no PC com o site do lado?', 'Playing on PC with the site on the side?', '¿Juegas en PC con el sitio al lado?', '在电脑上玩、网站放在旁边？', 'PC でゲームと並べて使う？'],
  ponteTexto: ['O navegador só lê o controle com o site em foco. Com a <b>Ponte do controle</b> (Windows, 19 KB), as notas são conferidas mesmo com o jogo em foco: abra o programa, depois o site.', 'Browsers only read the controller while the site has focus. With the <b>Controller Bridge</b> (Windows, 19 KB), notes are checked even while the game has focus: open the program, then the site.', 'El navegador solo lee el mando con el sitio en primer plano. Con el <b>Puente del mando</b> (Windows, 19 KB), las notas se revisan aunque el juego esté en primer plano: abre el programa y luego el sitio.', '浏览器只有在网站处于前台时才能读取手柄。使用<b>手柄桥接</b>（Windows，19 KB），即使游戏在前台也能检查音符：先打开程序，再打开网站。', 'ブラウザはサイトが選択されているときしかコントローラーを読めません。<b>コントローラーブリッジ</b>（Windows・19 KB）を使えば、ゲームを操作中でも音をチェックできます。先にプログラム、次にサイトを開いてください。'],
  ponteBaixar: ['Baixar a Ponte do controle (.exe)', 'Download the Controller Bridge (.exe)', 'Descargar el Puente del mando (.exe)', '下载手柄桥接 (.exe)', 'コントローラーブリッジをダウンロード (.exe)'],
  ponteAviso: ['O Windows pode avisar que o programa não é conhecido: clique em "Mais informações" e "Executar assim mesmo". Ele só conversa com o seu próprio computador.', 'Windows may warn that the program is unrecognized: click "More info" and "Run anyway". It only talks to your own computer.', 'Windows puede avisar que el programa no es conocido: haz clic en "Más información" y "Ejecutar de todas formas". Solo se comunica con tu propio equipo.', 'Windows 可能提示该程序无法识别：点击“更多信息”，再点“仍要运行”。它只与你自己的电脑通信。', 'Windows が「認識されないアプリ」と警告することがあります。「詳細情報」→「実行」を押してください。通信はあなたの PC の中だけです。'],
  rodapePonte: ['Baixar a Ponte do controle (Windows)', 'Download the Controller Bridge (Windows)', 'Descargar el Puente del mando (Windows)', '下载手柄桥接（Windows）', 'コントローラーブリッジをダウンロード（Windows）'],
  permitirEdicao: ['Permitir que outras pessoas editem uma cópia', 'Let other people edit a copy', 'Permitir que otras personas editen una copia', '允许他人编辑副本', 'ほかの人がコピーを編集できるようにする'],
  permitirEdicaoAjuda: ['Desmarcado: quem abrir o link ou a página só toca; o botão "Editar uma cópia" não aparece. Marcado: a cópia mostra "baseada em" com o seu nome.', 'Unchecked: anyone opening the link or page can only play; "Edit a copy" is hidden. Checked: copies show "based on" with your name.', 'Desmarcado: quien abra el enlace o la página solo toca; "Editar una copia" no aparece. Marcado: la copia muestra "basada en" con tu nombre.', '不勾选：打开链接或页面的人只能弹奏，不会显示“编辑副本”。勾选：副本会显示“改编自”和你的名字。', 'オフ：リンクやページを開いた人は演奏だけでき、「コピーを編集」は表示されません。オン：コピーには「原曲」としてあなたの名前が表示されます。'],
  copiaBloqueada: ['Quem criou esta música não permitiu cópias para edição.', 'The creator of this song does not allow editable copies.', 'Quien creó esta canción no permite copias para editar.', '这首乐曲的作者不允许编辑副本。', 'この曲の作者はコピーの編集を許可していません。'],
  baseadaEm: ['baseada em {x}', 'based on {x}', 'basada en {x}', '改编自 {x}', '原曲：{x}'],
  ponteCurto: ['Jogar com o jogo em foco? Baixe a ponte (Windows)', 'Play with the game focused? Get the bridge (Windows)', '¿Jugar con el juego en primer plano? Descarga el puente (Windows)', '想在游戏前台时使用？下载桥接（Windows）', 'ゲーム操作中も使う？ブリッジをダウンロード（Windows）'],
  mostrarMais: ['Mostrar mais', 'Show more', 'Mostrar más', '显示更多', 'もっと見る'],
  mostrando: ['Mostrando {a} de {b}', 'Showing {a} of {b}', 'Mostrando {a} de {b}', '显示 {a} / {b}', '{b} 件中 {a} 件を表示'],
  ponteOQue: ['O que é a Ponte do controle?', 'What is the Controller Bridge?', '¿Qué es el Puente del mando?', '什么是手柄桥接？', 'コントローラーブリッジとは？'],
  ponteOQueCurto: ['O que é isso?', 'What is this?', '¿Qué es esto?', '这是什么？', 'これは何？'],
  duvidasTit: ['Dúvidas', 'Questions', 'Dudas', '常见问题', 'よくある質問'],
  pontePorque: ['O navegador só deixa o site ler o controle enquanto a janela do site está selecionada. Quando você clica no jogo para tocar, o site para de ver os botões.', 'Browsers only let the site read the controller while its window is selected. When you click the game to play, the site stops seeing the buttons.', 'El navegador solo deja que el sitio lea el mando mientras su ventana está seleccionada. Cuando haces clic en el juego para tocar, el sitio deja de ver los botones.', '浏览器只有在网站窗口被选中时才允许读取手柄。当你点击游戏开始演奏时，网站就看不到按键了。', 'ブラウザは、サイトのウィンドウが選択されている間しかコントローラーを読めません。ゲームをクリックして吹き始めると、サイトはボタンを見られなくなります。'],
  ponteOQueE: ['A <b>Ponte</b> é um programinha para Windows (19 KB) que lê o controle direto do sistema, como o emulador faz, e repassa os botões para o OcaPad. Assim as notas são conferidas mesmo com o jogo em foco.', 'The <b>Bridge</b> is a tiny Windows program (19 KB) that reads the controller straight from the system, like the emulator does, and passes the buttons to OcaPad. So notes are checked even while the game has focus.', 'El <b>Puente</b> es un programa pequeño para Windows (19 KB) que lee el mando directamente del sistema, como lo hace el emulador, y pasa los botones a OcaPad. Así las notas se revisan aunque el juego esté en primer plano.', '<b>桥接</b>是一个很小的 Windows 程序（19 KB），像模拟器一样直接从系统读取手柄，再把按键传给 OcaPad。这样即使游戏在前台，也能检查音符。', '<b>ブリッジ</b>は小さな Windows 用プログラム（19 KB）です。エミュレーターと同じようにシステムから直接コントローラーを読み、ボタンを OcaPad に伝えます。ゲームを操作中でも音をチェックできます。'],
  ponteEsquema: ['Controle|Ponte (no seu PC)|OcaPad', 'Controller|Bridge (on your PC)|OcaPad', 'Mando|Puente (en tu PC)|OcaPad', '手柄|桥接（你的电脑）|OcaPad', 'コントローラー|ブリッジ（あなたの PC）|OcaPad'],
  ponteComoTit: ['Como usar', 'How to use it', 'Cómo usarlo', '使用方法', '使い方'],
  ponteP1: ['Baixe e abra o <b>ponte-controle.exe</b>. Aparece um ícone ♪ perto do relógio do Windows.', 'Download and open <b>ponte-controle.exe</b>. A ♪ icon appears next to the Windows clock.', 'Descarga y abre <b>ponte-controle.exe</b>. Aparece un ícono ♪ junto al reloj de Windows.', '下载并打开 <b>ponte-controle.exe</b>。Windows 时钟旁会出现 ♪ 图标。', '<b>ponte-controle.exe</b> をダウンロードして開きます。Windows の時計の横に ♪ アイコンが出ます。'],
  ponteP2: ['Abra o OcaPad e escolha a música. Na barra de treino aparece <b>"Ponte conectada"</b>.', 'Open OcaPad and pick a song. The practice bar shows <b>"Bridge connected"</b>.', 'Abre OcaPad y elige la canción. En la barra de práctica aparece <b>"Puente conectado"</b>.', '打开 OcaPad 并选择乐曲。练习栏会显示<b>“桥接已连接”</b>。', 'OcaPad を開いて曲を選びます。練習バーに<b>「ブリッジ接続中」</b>と出ます。'],
  ponteP3: ['Clique no jogo e toque. O site confere cada nota mesmo sem estar em foco.', 'Click the game and play. The site checks every note even without focus.', 'Haz clic en el juego y toca. El sitio revisa cada nota aunque no esté en primer plano.', '点击游戏开始演奏。即使网站不在前台，也会检查每个音。', 'ゲームをクリックして吹きます。サイトが選択されていなくても、音をひとつずつチェックします。'],
  ponteSeguroTit: ['É seguro?', 'Is it safe?', '¿Es seguro?', '安全吗？', '安全？'],
  ponteSeguro: ['Ele não usa a internet: só conversa com o seu próprio computador e só aceita o site OcaPad. Como o programa não tem assinatura digital, o Windows pode avisar "O Windows protegeu o computador": clique em <b>Mais informações</b> e <b>Executar assim mesmo</b>. Para fechar, clique com o botão direito no ícone ♪ e em <b>Sair</b>.', 'It does not use the internet: it only talks to your own computer and only accepts the OcaPad site. Since it is not digitally signed, Windows may say "Windows protected your PC": click <b>More info</b> and <b>Run anyway</b>. To close it, right-click the ♪ icon and choose <b>Exit</b>.', 'No usa internet: solo se comunica con tu propio equipo y solo acepta el sitio OcaPad. Como no tiene firma digital, Windows puede avisar "Windows protegió su PC": haz clic en <b>Más información</b> y <b>Ejecutar de todas formas</b>. Para cerrarlo, clic derecho en el ícono ♪ y <b>Salir</b>.', '它不使用互联网：只与你自己的电脑通信，并且只接受 OcaPad 网站。由于程序没有数字签名，Windows 可能提示“Windows 已保护你的电脑”：点击<b>更多信息</b>，再点<b>仍要运行</b>。关闭时，右键点击 ♪ 图标并选择<b>退出</b>。', 'インターネットは使いません。あなたの PC の中だけで通信し、OcaPad のサイトだけを受け付けます。デジタル署名がないため「Windows によって PC が保護されました」と出ることがあります。<b>詳細情報</b> → <b>実行</b> を押してください。終了するには ♪ アイコンを右クリックして<b>終了</b>。'],
  ponteQuemTit: ['Para quem é?', 'Who is it for?', '¿Para quién es?', '适合谁？', '誰向け？'],
  ponteQuem: ['Para quem joga no PC (emulador ou versão para PC) com o site do lado. Funciona com controles que o Windows vê como Xbox (o de PlayStation e o Pro do Switch via DS4Windows ou Steam). Quem joga no console não precisa: use o site como partitura.', 'For people playing on PC (emulator or PC version) with the site on the side. Works with controllers Windows sees as Xbox (PlayStation and Switch Pro via DS4Windows or Steam). Console players do not need it: use the site as sheet music.', 'Para quien juega en PC (emulador o versión de PC) con el sitio al lado. Funciona con mandos que Windows ve como Xbox (PlayStation y Switch Pro con DS4Windows o Steam). Quien juega en consola no lo necesita: usa el sitio como partitura.', '适合在电脑上玩（模拟器或 PC 版）并把网站放在旁边的人。支持 Windows 识别为 Xbox 的手柄（PlayStation、Switch Pro 可通过 DS4Windows 或 Steam）。在主机上玩的人不需要：把网站当乐谱用即可。', 'PC（エミュレーターや PC 版）でサイトを横に並べて遊ぶ人向けです。Windows が Xbox として認識するコントローラーで動きます（PlayStation・Switch Pro は DS4Windows や Steam 経由）。家庭用ゲーム機で遊ぶ人は不要です。サイトを楽譜として使ってください。'],
  exemploJogo: ['Seu jogo', 'Your game', 'Tu juego', '你的游戏', 'あなたのゲーム'],
  exemploLegenda: ['Exemplo: o jogo de um lado e o OcaPad do outro. Com a ponte, as notas ficam verdes mesmo com o jogo em foco.', 'Example: the game on one side and OcaPad on the other. With the bridge, notes turn green even while the game has focus.', 'Ejemplo: el juego a un lado y OcaPad al otro. Con el puente, las notas se ponen verdes aunque el juego esté en primer plano.', '示例：一边是游戏，一边是 OcaPad。使用桥接后，即使游戏在前台，音符也会变绿。', '例：片側にゲーム、もう片側に OcaPad。ブリッジがあれば、ゲームを操作中でも音が緑になります。'],
  ponteFecharTit: ['Como fechar', 'How to close it', 'Cómo cerrarlo', '如何关闭', '終了のしかた'],
  ponteFechar: ['Clique com o botão direito no ícone ♪ perto do relógio do Windows e escolha <b>Sair</b>.', 'Right-click the ♪ icon next to the Windows clock and choose <b>Sair</b> (Exit).', 'Haz clic derecho en el ícono ♪ junto al reloj de Windows y elige <b>Sair</b> (Salir).', '右键点击 Windows 时钟旁的 ♪ 图标，选择 <b>Sair</b>（退出）。', 'Windows の時計の横の ♪ アイコンを右クリックして <b>Sair</b>（終了）を選びます。'],
  ponteSeguroCurto: ['Ele não usa a internet: só conversa com o seu próprio computador e só aceita o site OcaPad. Como o programa não tem assinatura digital, o Windows pode avisar "O Windows protegeu o computador": clique em <b>Mais informações</b> e <b>Executar assim mesmo</b>.', 'It does not use the internet: it only talks to your own computer and only accepts the OcaPad site. Since it is not digitally signed, Windows may say "Windows protected your PC": click <b>More info</b> and <b>Run anyway</b>.', 'No usa internet: solo se comunica con tu propio equipo y solo acepta el sitio OcaPad. Como no tiene firma digital, Windows puede avisar "Windows protegió su PC": haz clic en <b>Más información</b> y <b>Ejecutar de todas formas</b>.', '它不使用互联网：只与你自己的电脑通信，并且只接受 OcaPad 网站。由于程序没有数字签名，Windows 可能提示“Windows 已保护你的电脑”：点击<b>更多信息</b>，再点<b>仍要运行</b>。', 'インターネットは使いません。あなたの PC の中だけで通信し、OcaPad のサイトだけを受け付けます。デジタル署名がないため「Windows によって PC が保護されました」と出ることがあります。<b>詳細情報</b> → <b>実行</b> を押してください。'],
  fechar: ['Fechar', 'Close', 'Cerrar', '关闭', '閉じる'],
  marcas: ['The Legend of Zelda e Nintendo são marcas da Nintendo. O OcaPad é um site de fãs, sem ligação com a Nintendo.', 'The Legend of Zelda and Nintendo are trademarks of Nintendo. OcaPad is a fan site, not affiliated with Nintendo.', 'The Legend of Zelda y Nintendo son marcas de Nintendo. OcaPad es un sitio de fans, sin relación con Nintendo.', 'The Legend of Zelda 和 Nintendo 是任天堂的商标。OcaPad 是粉丝网站，与任天堂无关。', 'ゼルダの伝説および Nintendo は任天堂の商標です。OcaPad はファンサイトであり、任天堂とは関係ありません。'],
  linkRuim: ['Não consegui abrir a música do link.', "Couldn't open the song from the link.", 'No se pudo abrir la canción del enlace.', '无法打开链接中的乐曲。', 'リンクの曲を開けませんでした。']
};

// t('chave', { n: 3 }) → texto no idioma atual (cai para o português se faltar)
export function t(chave, vars) {
  const linha = D[chave];
  let s = linha ? (linha[I] != null ? linha[I] : linha[0]) : chave;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split('{' + k + '}').join(String(v));
  return s;
}
// plural simples: tn('notas', 3) usa notas1 ou notasN
export function tn(base, n) { return t(base + (n === 1 ? '1' : 'N'), { n }); }
// número com vírgula ou ponto, conforme o idioma
export function decimal(x, casas = 1) {
  const s = x.toFixed(casas);
  return LANG === 'pt' || LANG === 'es' ? s.replace('.', ',') : s;
}
export const nomeCategoria = k => t('cat_' + k);
export const nomeDificuldade = k => t('dif_' + k);

// Bandeiras desenhadas aqui (emoji de bandeira não aparece no Windows).
// Bandeira escolhida para cada idioma: Brasil, Estados Unidos, Espanha, China, Japão.
const BANDEIRAS = {
  pt: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#009c3b"/><path d="M15 2.2 27.6 10 15 17.8 2.4 10z" fill="#ffdf00"/><circle cx="15" cy="10" r="4.6" fill="#002776"/><path d="M10.6 9.2c3-.9 6.2-.5 8.8 1.2" stroke="#fff" stroke-width=".8" fill="none"/></svg>',
  en: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/>' +
      [0, 2, 4, 6, 8, 10, 12].map(i => '<rect y="' + (i * 20 / 13).toFixed(2) + '" width="30" height="' + (20 / 13).toFixed(2) + '" fill="#b22234"/>').join('') +
      '<rect width="13" height="10.77" fill="#3c3b6e"/>' +
      [[2.2, 2], [5.4, 2], [8.6, 2], [3.8, 4.4], [7, 4.4], [2.2, 6.8], [5.4, 6.8], [8.6, 6.8]].map(([x, y]) => '<circle cx="' + (x + 1) + '" cy="' + (y + .4) + '" r=".7" fill="#fff"/>').join('') + '</svg>',
  es: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/></svg>',
  zh: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#ee1c25"/><path d="m5.5 2.2 1.3 3.9h4.1l-3.3 2.4 1.3 3.9-3.4-2.4-3.3 2.4 1.3-3.9-3.3-2.4h4.1z" fill="#ffde00"/><g fill="#ffde00"><circle cx="11" cy="2.4" r=".9"/><circle cx="13" cy="4.6" r=".9"/><circle cx="13" cy="7.6" r=".9"/><circle cx="11" cy="9.8" r=".9"/></g></svg>',
  ja: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/></svg>'
};

// Menu de idioma com bandeiras: botão + lista. Abre com clique, Enter ou Espaço; setas andam; Esc fecha.
function montarMenuIdioma() {
  const caixa = document.getElementById('idiomaMenu');
  if (!caixa || caixa.dataset.pronto) return;
  caixa.dataset.pronto = '1';
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'idioma-botao';
  botao.setAttribute('aria-haspopup', 'true');
  botao.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-label', t('idioma') + ': ' + IDIOMAS[LANG]);
  botao.title = t('idioma') + ': ' + IDIOMAS[LANG];
  botao.innerHTML = '<span class="bandeira">' + BANDEIRAS[LANG] + '</span><span class="idioma-cod" aria-hidden="true">' + LANG.toUpperCase() + '</span><span class="seta-menu" aria-hidden="true">▾</span>';
  const lista = document.createElement('ul');
  lista.className = 'idioma-lista';
  lista.hidden = true;
  for (const [k, nome] of Object.entries(IDIOMAS)) {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.lang = HTML_LANG[k];
    b.innerHTML = '<span class="bandeira">' + BANDEIRAS[k] + '</span><span>' + nome + '</span>' + (k === LANG ? '<span class="marca-ok" aria-hidden="true">✓</span>' : '');
    if (k === LANG) b.setAttribute('aria-current', 'true');
    b.addEventListener('click', () => {
      if (k === LANG) { fechar(); return; }
      try { localStorage.setItem('idioma', k); } catch (e) {}
      location.reload();
    });
    li.append(b);
    lista.append(li);
  }
  const itens = () => [...lista.querySelectorAll('button')];
  function abrir() {
    lista.hidden = false; botao.setAttribute('aria-expanded', 'true');
    (lista.querySelector('[aria-current]') || itens()[0]).focus();
  }
  function fechar(foco = true) {
    if (lista.hidden) return;
    lista.hidden = true; botao.setAttribute('aria-expanded', 'false');
    if (foco) botao.focus();
  }
  botao.addEventListener('click', () => (lista.hidden ? abrir() : fechar()));
  caixa.addEventListener('keydown', e => {
    if (e.key === 'Escape') { fechar(); e.preventDefault(); return; }
    if (lista.hidden) { if (e.key === 'ArrowDown') { abrir(); e.preventDefault(); } return; }
    const bs = itens(), i = bs.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { bs[(i + 1) % bs.length].focus(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { bs[(i - 1 + bs.length) % bs.length].focus(); e.preventDefault(); }
  });
  document.addEventListener('click', e => { if (!caixa.contains(e.target)) fechar(false); });
  caixa.addEventListener('focusout', e => { if (!caixa.contains(e.relatedTarget)) fechar(false); });
  caixa.append(botao, lista);
}

// Traduz a página: data-t (conteúdo), data-t-ph (placeholder), data-t-aria (aria-label).
export function traduzirPagina() {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = HTML_LANG[LANG];
  document.querySelectorAll('[data-t]').forEach(e => { e.innerHTML = t(e.dataset.t); });
  document.querySelectorAll('[data-t-ph]').forEach(e => { e.placeholder = t(e.dataset.tPh); });
  document.querySelectorAll('[data-t-aria]').forEach(e => { e.setAttribute('aria-label', t(e.dataset.tAria)); });
  montarMenuIdioma();
  const sel = document.getElementById('idioma');
  if (sel) {
    sel.replaceChildren(...Object.entries(IDIOMAS).map(([k, v]) => new Option(v, k)));
    sel.value = LANG;
    sel.addEventListener('change', () => {
      try { localStorage.setItem('idioma', sel.value); } catch (e) {}
      location.reload();
    });
  }
}
