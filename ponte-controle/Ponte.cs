// Ponte do controle — OcaPad
// Lê o controle direto do Windows (XInput, como os emuladores) e repassa os botões ao site
// por um WebSocket local (ws://localhost:47213). Assim o site confere as notas mesmo com o jogo em foco.
// Só aceita conexões do próprio computador e de páginas do site (github.io ou localhost).
// Feito em C# 5 para compilar com o compilador que já vem no Windows (veja compilar.bat).
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.Net;
using System.Net.WebSockets;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

[assembly: System.Reflection.AssemblyTitle("Ponte do controle - OcaPad")]
[assembly: System.Reflection.AssemblyProduct("OcaPad")]
[assembly: System.Reflection.AssemblyVersion("1.0.0.0")]
[assembly: System.Reflection.AssemblyFileVersion("1.0.0.0")]

namespace PonteControle
{
    static class XInput
    {
        [StructLayout(LayoutKind.Sequential)]
        public struct Gamepad
        {
            public ushort wButtons;
            public byte bLeftTrigger;
            public byte bRightTrigger;
            public short sThumbLX;
            public short sThumbLY;
            public short sThumbRX;
            public short sThumbRY;
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct State
        {
            public uint dwPacketNumber;
            public Gamepad Gamepad;
        }

        [DllImport("xinput1_4.dll", EntryPoint = "XInputGetState")]
        static extern int Get14(int indice, out State estado);

        [DllImport("xinput9_1_0.dll", EntryPoint = "XInputGetState")]
        static extern int Get910(int indice, out State estado);

        static bool usar14 = true;

        public static bool Ler(int indice, out State estado)
        {
            if (usar14)
            {
                try { return Get14(indice, out estado) == 0; }
                catch (DllNotFoundException) { usar14 = false; }
                catch (EntryPointNotFoundException) { usar14 = false; }
            }
            return Get910(indice, out estado) == 0;
        }
    }

    // Uma página do site conectada.
    class Cliente
    {
        readonly WebSocket ws;
        readonly ConcurrentQueue<string> fila = new ConcurrentQueue<string>();
        readonly SemaphoreSlim sinal = new SemaphoreSlim(0);
        public volatile bool Aberto = true;

        public Cliente(WebSocket ws) { this.ws = ws; }

        public void Enviar(string msg)
        {
            if (!Aberto) return;
            fila.Enqueue(msg);
            sinal.Release();
        }

        public async Task LoopEnvio()
        {
            try
            {
                while (Aberto && ws.State == WebSocketState.Open)
                {
                    await sinal.WaitAsync();
                    string msg;
                    while (fila.TryDequeue(out msg))
                    {
                        var bytes = Encoding.UTF8.GetBytes(msg);
                        await ws.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
            }
            catch { }
            Aberto = false;
        }

        public async Task LoopRecebe()
        {
            var buf = new byte[256];
            try
            {
                while (ws.State == WebSocketState.Open)
                {
                    var r = await ws.ReceiveAsync(new ArraySegment<byte>(buf), CancellationToken.None);
                    if (r.MessageType == WebSocketMessageType.Close)
                    {
                        await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                        break;
                    }
                }
            }
            catch { }
            Aberto = false;
            sinal.Release();
        }
    }

    class Ponte
    {
        public const int Porta = 47213;
        readonly HttpListener http = new HttpListener();
        readonly List<Cliente> clientes = new List<Cliente>();
        readonly object trava = new object();
        volatile string ultimoEstado = null;
        volatile string ultimoStatus = null;

        public int ControleAtivo = -1;     // 0 a 3, ou -1 sem controle
        public int Conectados = 0;

        public int Paginas
        {
            get { lock (trava) { clientes.RemoveAll(c => !c.Aberto); return clientes.Count; } }
        }

        public void Iniciar()
        {
            http.Prefixes.Add("http://localhost:" + Porta + "/");
            http.Start();   // pode falhar se a porta estiver em uso
            Task.Run(new Func<Task>(Aceitar));
            var t = new Thread(LerControles);
            t.IsBackground = true;
            t.Priority = ThreadPriority.AboveNormal;
            t.Start();
        }

        // Só páginas do site: github.io (site publicado) ou localhost (teste no PC).
        static bool OrigemPermitida(string origem)
        {
            if (string.IsNullOrEmpty(origem)) return false;
            Uri u;
            if (!Uri.TryCreate(origem, UriKind.Absolute, out u)) return false;
            string h = u.Host.ToLowerInvariant();
            if (h == "localhost" || h == "127.0.0.1" || h == "[::1]") return u.Scheme == "http" || u.Scheme == "https";
            return u.Scheme == "https" && h.EndsWith(".github.io");
        }

        async Task Aceitar()
        {
            while (http.IsListening)
            {
                HttpListenerContext ctx;
                try { ctx = await http.GetContextAsync(); }
                catch { break; }
                var ignorar = Atender(ctx);
            }
        }

        async Task Atender(HttpListenerContext ctx)
        {
            try
            {
                if (!ctx.Request.IsWebSocketRequest)
                {
                    var txt = Encoding.UTF8.GetBytes("Ponte do controle ligada. Abra o site OcaPad.");
                    ctx.Response.ContentType = "text/plain; charset=utf-8";
                    ctx.Response.OutputStream.Write(txt, 0, txt.Length);
                    ctx.Response.Close();
                    return;
                }
                if (!OrigemPermitida(ctx.Request.Headers["Origin"]))
                {
                    ctx.Response.StatusCode = 403;
                    ctx.Response.Close();
                    return;
                }
                var wsctx = await ctx.AcceptWebSocketAsync(null);
                var c = new Cliente(wsctx.WebSocket);
                lock (trava) clientes.Add(c);
                c.Enviar("{\"t\":\"ola\",\"versao\":1}");
                if (ultimoStatus != null) c.Enviar(ultimoStatus);
                if (ultimoEstado != null) c.Enviar(ultimoEstado);
                var envio = c.LoopEnvio();
                await c.LoopRecebe();
                await envio;
            }
            catch { }
        }

        void ParaTodos(string msg)
        {
            lock (trava)
            {
                clientes.RemoveAll(c => !c.Aberto);
                foreach (var c in clientes) c.Enviar(msg);
            }
        }

        // XInput → ordem "standard" do navegador (a mesma que o site já usa):
        // 0 A, 1 B, 2 X, 3 Y, 4 LB, 5 RB, 6 LT, 7 RT, 8 Back, 9 Start, 10 L3, 11 R3, 12-15 direcional ↑↓←→, 16 Guia
        static readonly ushort[] Mapa = {
            0x1000, 0x2000, 0x4000, 0x8000, 0x0100, 0x0200, 0, 0,
            0x0020, 0x0010, 0x0040, 0x0080, 0x0001, 0x0002, 0x0004, 0x0008, 0
        };

        static string Eixo(short v, bool inverter)
        {
            double x = v / 32767.0;
            if (x < -1) x = -1;
            if (inverter) x = -x;           // no navegador, para baixo é positivo
            if (Math.Abs(x) < 0.08) x = 0;  // zona morta pequena
            return Math.Round(x, 2).ToString("0.##", CultureInfo.InvariantCulture);
        }

        static string Montar(int indice, XInput.Gamepad g)
        {
            var sb = new StringBuilder(160);
            sb.Append("{\"t\":\"e\",\"c\":").Append(indice).Append(",\"b\":[");
            for (int i = 0; i < Mapa.Length; i++)
            {
                bool apertado;
                if (i == 6) apertado = g.bLeftTrigger > 30;
                else if (i == 7) apertado = g.bRightTrigger > 30;
                else apertado = Mapa[i] != 0 && (g.wButtons & Mapa[i]) != 0;
                if (i > 0) sb.Append(',');
                sb.Append(apertado ? '1' : '0');
            }
            sb.Append("],\"a\":[")
              .Append(Eixo(g.sThumbLX, false)).Append(',')
              .Append(Eixo(g.sThumbLY, true)).Append(',')
              .Append(Eixo(g.sThumbRX, false)).Append(',')
              .Append(Eixo(g.sThumbRY, true)).Append("]}");
            return sb.ToString();
        }

        [DllImport("winmm.dll")] static extern uint timeBeginPeriod(uint ms);

        void LerControles()
        {
            timeBeginPeriod(1);   // laço de ~2 ms: nenhum toque rápido se perde
            var estados = new XInput.State[4];
            var ligado = new bool[4];
            int contagem = 0;
            while (true)
            {
                int n = 0;
                for (int i = 0; i < 4; i++)
                {
                    // controles desligados são checados com menos frequência (XInput é lento para eles)
                    if (!ligado[i] && (contagem % 250) != 0) continue;
                    XInput.State s;
                    ligado[i] = XInput.Ler(i, out s);
                    if (!ligado[i]) continue;
                    n++;
                    estados[i] = s;
                    // o controle que for mexido vira o ativo
                    if (i != ControleAtivo && (s.Gamepad.wButtons != 0 || s.Gamepad.bLeftTrigger > 30 || s.Gamepad.bRightTrigger > 30))
                        ControleAtivo = i;
                }
                if (ControleAtivo >= 0 && !ligado[ControleAtivo]) ControleAtivo = -1;
                if (ControleAtivo < 0) for (int i = 0; i < 4; i++) if (ligado[i]) { ControleAtivo = i; break; }
                Conectados = n;

                string status = "{\"t\":\"c\",\"controles\":" + n + ",\"ativo\":" + ControleAtivo + "}";
                if (status != ultimoStatus) { ultimoStatus = status; ParaTodos(status); }

                if (ControleAtivo >= 0)
                {
                    string msg = Montar(ControleAtivo, estados[ControleAtivo].Gamepad);
                    if (msg != ultimoEstado) { ultimoEstado = msg; ParaTodos(msg); }
                }
                contagem++;
                Thread.Sleep(2);
            }
        }
    }

    static class Programa
    {
        static NotifyIcon icone;
        static Ponte ponte;

        static Icon DesenharIcone(Color cor)
        {
            var bmp = new Bitmap(32, 32);
            using (var g = Graphics.FromImage(bmp))
            {
                g.SmoothingMode = SmoothingMode.AntiAlias;
                g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAliasGridFit;
                using (var b = new SolidBrush(cor)) g.FillEllipse(b, 1, 1, 30, 30);
                using (var f = new Font("Segoe UI Symbol", 17, FontStyle.Bold, GraphicsUnit.Pixel))
                using (var b = new SolidBrush(Color.FromArgb(11, 26, 16)))
                {
                    var fmt = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
                    g.DrawString("♪", f, b, new RectangleF(0, 1, 32, 32), fmt);
                }
            }
            return Icon.FromHandle(bmp.GetHicon());
        }

        [STAThread]
        static void Main()
        {
            bool novo;
            using (var mutex = new Mutex(true, "OcarinaDeBotao.PonteControle", out novo))
            {
                if (!novo)
                {
                    MessageBox.Show("A ponte do controle já está aberta (ícone perto do relógio).", "Ponte do controle", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    return;
                }
                Application.EnableVisualStyles();
                ponte = new Ponte();
                try { ponte.Iniciar(); }
                catch (Exception e)
                {
                    MessageBox.Show("Não consegui abrir a porta " + Ponte.Porta + ".\nOutro programa pode estar usando.\n\n" + e.Message, "Ponte do controle", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                var verde = DesenharIcone(Color.FromArgb(95, 224, 138));
                var cinza = DesenharIcone(Color.FromArgb(141, 153, 168));
                var menu = new ContextMenuStrip();
                var linhaStatus = new ToolStripMenuItem("Iniciando…") { Enabled = false };
                menu.Items.Add(linhaStatus);
                menu.Items.Add(new ToolStripSeparator());
                menu.Items.Add("Sair", null, (s, e) => { icone.Visible = false; Application.Exit(); });

                icone = new NotifyIcon { Icon = cinza, Visible = true, ContextMenuStrip = menu, Text = "Ponte do controle" };
                icone.ShowBalloonTip(4000, "Ponte do controle ligada",
                    "Agora abra o site OcaPad. Ele vai mostrar \"Ponte conectada\".", ToolTipIcon.Info);

                var timer = new System.Windows.Forms.Timer { Interval = 500 };
                timer.Tick += (s, e) =>
                {
                    int paginas = ponte.Paginas;
                    string ctrl = ponte.Conectados == 0 ? "nenhum controle" : "controle " + (ponte.ControleAtivo + 1);
                    string site = paginas == 0 ? "site fechado" : (paginas == 1 ? "1 página do site" : paginas + " páginas do site");
                    string txt = "Ponte: " + ctrl + ", " + site;
                    icone.Text = txt.Length > 63 ? txt.Substring(0, 63) : txt;
                    linhaStatus.Text = txt;
                    icone.Icon = (ponte.Conectados > 0 && paginas > 0) ? verde : cinza;
                };
                timer.Start();
                Application.Run();
                icone.Visible = false;
            }
        }
    }
}
