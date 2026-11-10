# OcaPad: como ver e publicar

## Ver no seu PC
Dê dois cliques em **`abrir-site.bat`**. Uma janela preta abre e o site aparece no navegador.
Para parar, feche a janela preta. (Precisa do Node.js, que já está instalado neste PC.)

## Publicar na internet (uma vez só, uns 10 minutos)

1. **Conta:** crie uma conta grátis em https://github.com (o nome de usuário vai aparecer no endereço do site).
2. **Programa:** instale o **GitHub Desktop** (https://desktop.github.com) e entre com essa conta (a sua: **JotaaVe**).
3. **Criar o repositório:** no GitHub Desktop, menu **File → Add local repository**, escolha a pasta do site.
   Ele vai dizer que a pasta ainda não é um repositório: clique em **create a repository**, depois em **Create repository**.
4. **Enviar:** clique em **Publish repository**. No campo **Name**, escreva `ocapad` (é o que aparece no endereço). **Desmarque** "Keep this code private" (o GitHub Pages grátis precisa de repositório público) e confirme.
5. **Ligar o site:** em github.com, abra o repositório → **Settings** → **Pages** → em **Source**, escolha **GitHub Actions**.
6. **Primeira publicação:** vá na aba **Actions** do repositório, clique em **Publicar site** → **Run workflow**.
   Em 1 ou 2 minutos aparece um ✅. O endereço fica assim: `https://jotaave.github.io/ocapad/`

Daqui pra frente, toda vez que você enviar uma mudança pelo GitHub Desktop (**Commit** e depois **Push origin**), o site se atualiza sozinho.
Se uma música estiver escrita errado, a publicação para e mostra o erro na aba **Actions** (o site antigo continua no ar).

## Adicionar uma música
Copie um arquivo da pasta `musicas`, renomeie (só letras minúsculas sem acento, números e `-`, ex.: `pokemon-abertura.json`) e edite:

```json
{
  "titulo": "Nome da música",
  "origem": "De onde ela é (anime, filme, jogo...)",
  "categoria": "anime",
  "enviado_por": "Seu nome",
  "tags": ["palavras", "para", "busca"],
  "observacoes": "Dicas (opcional)",
  "frases": [
    "down:A down:A up:L R",
    "L R A"
  ]
}
```

- **categoria:** `zelda` (série The Legend of Zelda), `anime`, `jogo` (outros jogos), `filme`, `serie`, `musica` ou `outro`.
- **Notas** no padrão do Switch, separadas por espaço: `L`, `R`, `A`, `X`, `Y`. O site converte sozinho para Xbox (A→B, X→Y, Y→X, L→LB, R→RB) e PlayStation (A→Bolinha, X→Triângulo, Y→Quadrado, L→L1, R→R1).
- **O que segurar** vem antes, com dois-pontos: `up:` (analógico ↑), `down:` (analógico ↓), `dpad:` (direcional ↓), `down+dpad:` (os dois).
- **Pausa** (nota que a ocarina não alcança, ou espera): `-`. Aparece como "pausa" e a página pula sozinha. A ocarina vai do Si grave (`down+dpad:L`) até o Ré agudo (`X`) e o que os modificadores alcançarem acima; abaixo disso, use pausa.
- Nota que aceita dois jeitos: `dpad/down+dpad:A`. Nota ainda não confirmada: termina com `?` (aparece pontilhada).
- **Redes sociais de quem enviou** (opcional, até 5): `"redes": [{ "tipo": "instagram", "valor": "fulano" }]`. Tipos: `instagram`, `x`, `youtube`, `twitch`, `tiktok`. Só o usuário é guardado; o site monta o link.
- **Proteger de edição** (opcional): `"editavel": false` esconde "Editar uma cópia" e "Copiar ritmo". Cópias editadas guardam o crédito em `"baseada_em"` (ex.: `"Mi Corazón Encantado — Fulano"`).
- A dificuldade é calculada sozinha. Para forçar, adicione `"dificuldade": "facil"` (ou `medio`, `dificil`).

## Ritmo (opcional)
Na página da música:
1. Clique em **Gravar ritmo** e toque a música inteira no tempo certo, junto com o vídeo. Só as notas certas contam.
2. No fim, o **Modo ritmo** liga sozinho. Uma barra enche até a marca branca na hora de cada nota, e a página diz **No tempo**, **Adiantado** ou **Atrasado** (tolerância de 0,15 s).
3. O ritmo gravado fica salvo no seu navegador e vai junto no **link com a música dentro**.
4. Para deixar o ritmo fixo no site para todo mundo, clique em **Copiar ritmo** e cole a linha no arquivo da música, depois de `"frases": [...]` (com uma vírgula antes).

O ritmo é uma lista com o momento de cada nota (sem contar as pausas), em milissegundos: `"ritmo": [0, 400, 800]`.

## Criar música pelo site (para qualquer pessoa)
Na página **+ Criar música**:
1. Preencha título e de onde é.
2. **Gravar do zero** e toque no controle junto com o vídeo. A página escreve as notas e o ritmo. Ficar parado mais que 1,5 s começa uma frase nova (dá para mudar).
3. Clique numa nota para trocar botão, segurar, espera antes dela, frase nova, inserir nota ou pausa, apagar, ou **Regravar a partir daqui**.
4. **Testar** abre a música como os outros vão ver. Tudo fica salvo em "Minhas músicas", no navegador da pessoa.
5. **Pedir publicação no site** abre um pedido (issue) no GitHub já preenchido. A pessoa precisa de uma conta grátis no GitHub.

Em qualquer música do site há **Editar uma cópia**, que abre a música nessa página.

## Aprovar pedidos de música (você)
Uma vez só: no repositório, aba **Issues** → **Labels** → **New label**, nome `aprovada`.

Para cada pedido: abra a issue, clique no link **Testar** para conferir e, se estiver boa, coloque a etiqueta **aprovada** (à direita, em *Labels*).
A automação grava a música, publica o site e fecha o pedido com um agradecimento. Se der erro, ela comenta no pedido e o erro aparece na aba **Actions**.
Para recusar, é só fechar a issue.

## Idiomas
O site escolhe o idioma do navegador (português, inglês, espanhol, chinês ou japonês) e a pessoa pode trocar no topo.
Os textos ficam em `js/idioma.js`. As músicas (título e observações) aparecem como foram escritas.

## Ponte do controle (jogar com o site do lado, sem foco)
O navegador só lê o controle com a página em foco. A **ponte** é um programinha (`ponte-controle/ponte-controle.exe`, 19 KB) que lê o controle direto do Windows e repassa ao site.

**Testar no seu PC:**
1. Dê dois cliques em `ponte-controle/ponte-controle.exe`. Aparece um aviso e um ícone verde/cinza perto do relógio.
2. Abra o site (`abrir-site.bat`). Na barra de treino aparece **"Ponte conectada: funciona com o jogo em foco"**.
3. Clique no emulador e toque. As notas são conferidas no site sem você clicar nele.
4. Para fechar a ponte: botão direito no ícone perto do relógio → **Sair**.

Lê controles que o Windows vê como Xbox (Xbox, e PlayStation/Switch via DS4Windows ou Steam). Só aceita o site publicado (github.io) e o do seu PC.

**Disponibilizar para o pessoal:** no GitHub, aba **Actions** → **Gerar ponte do controle** → **Run workflow**. O `.exe` aparece na página **Releases** do repositório para download.
O Windows pode avisar "O Windows protegeu o computador" porque o programa não é assinado: **Mais informações** → **Executar assim mesmo**. O Chrome pode pedir permissão para o site acessar "dispositivos na rede local": permita.

Para mudar o programa: edite `ponte-controle/Ponte.cs` e rode `ponte-controle/compilar.bat`.

## Links de compartilhar
Na página da música há dois botões:
- **Copiar link:** curto, aponta para a música do site.
- **Copiar link com a música dentro:** funciona mesmo que a música não esteja no site (vai ser usado pelo editor da Fase 2).

## O que tem em cada pasta
- `index.html`, `tocar.html`: as duas páginas.
- `musicas/`: um arquivo por música.
- `js/`, `css/`: o funcionamento e a aparência.
- `scripts/`: gera a lista de músicas (`indice.json`) e o servidor do seu PC.
- `.github/workflows/publicar.yml`: a automação que publica o site.
