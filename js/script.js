

// 2. SLIDER DOS PROJETOS
function configurarSlider(idTrack) {
    const track = document.getElementById(idTrack);
    if (!track) return;
    let intervalo;
    let index = 0;

    track.parentElement.addEventListener('mouseenter', () => {
        intervalo = setInterval(() => {
            index = (index + 1) % 3;
            track.style.transform = `translateX(-${index * 33.33}%)`;
        }, 3000);
    });

    track.parentElement.addEventListener('mouseleave', () => {
        clearInterval(intervalo);
        track.style.transform = 'translateX(0)';
        index = 0;
    });
}
configurarSlider('track-musica');
configurarSlider('track-web');


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// CARROSSEL MOD — ROLAGEM INFINITA E SUAVE
// Replica a sequência para evitar saltos.
// Não interfere nos carrosséis antigos.
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function configurarSliderMod() {
    const track = document.getElementById("track-mod");

    if (!track) return;

    const container = track.parentElement;

    // Capturas originais do MOD.
    const imagensOriginais = Array.from(
        track.querySelectorAll("img")
    );

    if (imagensOriginais.length < 2) return;

    // Duplica as imagens apenas uma vez.
    // A segunda sequência permite o loop contínuo.
    if (!track.dataset.duplicado) {
        imagensOriginais.forEach((imagem) => {
            const copia = imagem.cloneNode(true);

            // Evita que leitores de tela anunciem duplicatas.
            copia.setAttribute("aria-hidden", "true");
            copia.alt = "";

            track.appendChild(copia);
        });

        track.dataset.duplicado = "true";
    }

    // Cada imagem ocupa a largura visível do carrossel.
    function ajustarLargura() {
        const largura = container.clientWidth;

        track.querySelectorAll("img").forEach((imagem) => {
            imagem.style.width = `${largura}px`;
            imagem.style.minWidth = `${largura}px`;
            imagem.style.flex = `0 0 ${largura}px`;
        });
    }

    ajustarLargura();

    // Recalcula as larguras se a janela for redimensionada.
    window.addEventListener("resize", ajustarLargura);
}

// Inicializa exclusivamente o carrossel do MOD.
configurarSliderMod();



// 3. BARRA DE PROGRESSO E REVEAL AO ROLAR
window.onscroll = function() {
    updateProgressBar();
    revealOnScroll();
};

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const bar = document.getElementById("myBar");
    if (bar) bar.style.width = scrolled + "%";
}

/**
 * ANIMAÇÃO DE ENTRADA DAS SEÇÕES
 *
 * Verifica a posição de cada seção em relação
 * à área visível do navegador.
 *
 * Quando o início da seção alcança 85% da
 * altura da janela, adiciona a classe "active",
 * permitindo que o CSS execute a animação.
 *
 * A classe permanece ativa após a primeira
 * exibição para evitar animações repetidas.
 */

/* ==================================================
   ANIMAÇÃO SUAVE DAS SEÇÕES

   Observa a posição das seções durante a rolagem
   e ativa a animação quando entram na área visível.

   A classe "active" é responsável por iniciar
   a transição definida no arquivo "style.css"
================================================== */

function revealOnScroll() {

    // Seleciona todas as seções com animação.
    const sections = document.querySelectorAll('.scroll-reveal');

    // Define o ponto de ativação em 85% da altura da janela.
    const trigger = window.innerHeight * 0.85;

    sections.forEach(section => {

        // Obtém a posição da seção na janela.
        const sectionTop = section.getBoundingClientRect().top;

        // Ativa a animação somente quando a seção
        // alcança o ponto definido.
        if (sectionTop < trigger) {
            section.classList.add('active');
        }
    });
}

/* ==================================================
   NAVEGAÇÃO DO MENU — CORREÇÃO DO CABEÇALHO FIXO

   A seção para logo abaixo do cabeçalho,
   sem centralização vertical e com rolagem suave.
================================================== */
document.querySelectorAll('.nav a').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        const targetId = this.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        event.preventDefault();

        const header = document.querySelector('.top-header');
        const alturaHeader = header ? header.getBoundingClientRect().height : 0;
        const folga = 20;
        const topoDaSecao = targetElement.getBoundingClientRect().top + window.scrollY;
        const destino = Math.max(0, topoDaSecao - alturaHeader - folga);

        window.scrollTo({ top: destino, behavior: 'smooth' });
    });
});

// 5. FORMULÁRIO DE CONTATO - VERSÃO FINAL E CORRIGIDA
const form = document.getElementById('form-contato');

if (form) {
    const btnEnviar = document.getElementById('btn-enviar');
    const campoEmail = document.getElementById('campo-email');
    const campoNome = document.getElementById('campo-nome');
    const campoMsg = document.getElementById('campo-msg');

    // ESTA É A FUNÇÃO QUE FAZ O BOTÃO ACENDER
    form.addEventListener('input', () => {
        // Validação básica: email precisa de @ e . / Nome e Msg não podem estar vazios
        const emailValido = campoEmail.value.includes('@') && campoEmail.value.includes('.');
        const nomePreenchido = campoNome.value.trim().length > 0;
        const msgPreenchida = campoMsg.value.trim().length > 0;
        
        const tudoCerto = emailValido && nomePreenchido && msgPreenchida;

        // Se tudo estiver certo, remove o 'disabled'
        btnEnviar.disabled = !tudoCerto;
        btnEnviar.classList.toggle('disabled', !tudoCerto);
    });

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        btnEnviar.innerText = "Enviando...";
        btnEnviar.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // SUCESSO: O e-mail foi para a lista de submissões
                form.innerHTML = `<div style="text-align:center; padding: 20px;">
                                    <p style="color:#8a2be2; font-weight:bold; font-size:1.5rem;"> Mensagem enviada com sucesso!</p>
                                    <p>Em breve entrarei em contato.</p>
                                  </div>`;
            } else {
                const erroData = await response.json();
                throw new Error(erroData.error || "Erro ao processar envio");
            }
        } catch (error) {
            console.error("Erro no envio:", error);
            alert("Ops! Algo deu errado: " + error.message);
            btnEnviar.innerText = "Enviar Mensagem";
            btnEnviar.disabled = false;
        }
    };
}
    
    
// 6. GALERIA
let fotosAtuais = [];
let fotoIndex = 0;

function abrirGaleria(projeto) {

    // Imagens disponíveis para cada projeto.
    // Os caminhos devem corresponder às pastas reais.
    const fotos = {
        musica: [
            "img/projeto-musical.jpg",
            "img/projeto-musical-1.jpg",
            "img/projeto-musical-2.jpg",
            "img/projeto-musical-3.jpg",
            "img/projeto-musical-5.jpg"
        ],

        web: [
            "img/java-API-1.jpg",
            "img/projeto-java-Dashboard-3.jpg",
            "img/projeto-java-login-4.jpg",
            "img/banco.jpg",
            "img/projeto-java-API-2.jpg"
        ],

        // MOD — Gestão Musical
        // Imagens armazenadas em img/Mod/
        mod: [
            "img/Mod/dashboard.png",
            "img/Mod/alteração restrita - PENDENTE.png",
            "img/Mod/API REST do MOD  Swagger-OpenAPI.png",
            "img/Mod/atualizaçãoDER-V1.5.png",
            "img/Mod/estruturas_das_19_tabelas.png",
            "img/Mod/relacionamentos-01.png"
        ],


        /* COFRINHO PRO — Capturas reais */
        cofrinho: [
            "img/cofrinho/login.png",
            "img/cofrinho/dashboard.png",
            "img/cofrinho/gerenciamento-moedas.png",
            "img/cofrinho/historico.png",
            "img/cofrinho/conversao.png"
        ],

        /* BAOZI STORE API — Capturas reais */
        baozi: [
            "img/baozi/árvoreProjeto.png",
            "img/baozi/CadastrarClientes.png",
            "img/baozi/cadastroProdutosID-10.png",
            "img/baozi/criandoPedidos_ID-17.png",
            "img/baozi/listando clientes.png",
            "img/baozi/listando pedidos.png",
            "img/baozi/atualizarPedidos.png",
            "img/baozi/progrecaoBanco.png"
        ]

    };

    // Evita tentar abrir uma galeria inexistente.
    if (!fotos[projeto]) {
        console.warn("Projeto não encontrado:", projeto);
        return;
    }

    // Define as imagens do projeto selecionado.
    fotosAtuais = fotos[projeto];

    // Inicia a galeria pela primeira imagem.
    fotoIndex = 0;

    // Exibe a imagem selecionada.
    mostrarFoto();

    // Abre a galeria.
    document.getElementById("overlay-galeria").style.display = "flex";
}

/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ABRIR GALERIA EM UMA IMAGEM ESPECÍFICA (Reutiliza a galeria já existente)
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */
function abrirGaleriaNaImagem(projeto, indice) {
    
    //Inicializa a galeriaa do projeto
    abrirGaleria(projeto);

    // verifica se a imagem solicitada existe
    if (indice < 0 || indice >= fotosAtuais.length) {
        return;
    }

    // Seleciona a imagem clicada
    fotoIndex = indice;

    // Atualiza a imagem selecionada.
    mostrarFoto();

}

/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   GALERIA DE IMAGENS — FUNÇÕES AUXILIARES

   Responsabilidades:
   1. Exibir a imagem selecionada.
   2. Navegar entre as imagens.
   3. Fechar a galeria.

   Compatível com os projetos:
   - Projetos Musicais
   - Desenvolvimento Web
   - MOD — Gestão Musical
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */

// Exibe a imagem correspondente ao índice atual.
function mostrarFoto() {

    const imagem = document.getElementById("foto-exibida");

    if (!imagem || fotosAtuais.length === 0) return;

    imagem.src = fotosAtuais[fotoIndex];
    imagem.alt = `Imagem ${fotoIndex + 1} de ${fotosAtuais.length}`;
}

// Avança ou retrocede entre as imagens.
function mudarFoto(direcao) {

    if (fotosAtuais.length === 0) return;

    // Permite voltar da primeira para a última
    // e avançar da última para a primeira.
    fotoIndex = (
        fotoIndex + direcao + fotosAtuais.length
    ) % fotosAtuais.length;

    mostrarFoto();
}

// Fecha a galeria sem alterar os carrosséis.
function fecharGaleria() {

    const overlay = document.getElementById("overlay-galeria");

    if (!overlay) return;

    overlay.style.display = "none";
}


/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   CLIQUE NAS CAPTURAS DOS CARROSSÉIS
   Preserva a rolagem contínua.
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */

function configurarCliqueCarrossel(idTrack, projeto) {

    const track = document.getElementById(idTrack);

    if (!track) return;

    // Captura todas as imagens, incluindo as duplicadas.
    const imagens = Array.from(track.querySelectorAll("img"));

    // Quantidade de imagens originais.
    const totalOriginais = imagens.length / 2;

    imagens.forEach((imagem, indice) => {

        // Indica visualmente que a imagem é clicável.
        imagem.style.cursor = "zoom-in";

        imagem.addEventListener("click", () => {

            // As imagens duplicadas abrem a original correspondente.
            const indiceOriginal = indice % totalOriginais;

            abrirGaleriaNaImagem(projeto, indiceOriginal);
        });
    });
}

// Inicializa os cliques após o carregamento do HTML.
document.addEventListener("DOMContentLoaded", () => {

    configurarCliqueCarrossel("track-cofrinho", "cofrinho");
    configurarCliqueCarrossel("track-baozi", "baozi");
    configurarCliqueCarrossel("track-mod", "mod");

});



// INICIALIZAÇÃO DA SETA
const setaTopo = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    // Mostra a seta após rolar 400px
    if (window.pageYOffset > 400) {
        setaTopo.classList.add('show');
    } else {
        setaTopo.classList.remove('show');
    }
});

setaTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ==================================================
   ANO AUTOMÁTICO DO RODAPÉ

   Atualiza o ano de direitos autorais conforme
   o calendário, sem precisar editar o HTML.
================================================== */

const anoAtual = document.getElementById('ano-atual');

if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
}


/* ==========================================
   ESTUDO DE CASO — MOD GESTÃO MUSICAL
   Expande ou recolhe os detalhes técnicos.
========================================== */

const botaoEstudoMod = document.getElementById("btn-estudo-mod");
const estudoCasoMod = document.getElementById("estudo-caso-mod");

// Verifica se os elementos existem antes de adicionar o evento.
if (botaoEstudoMod && estudoCasoMod) {

    botaoEstudoMod.addEventListener("click", () => {

        // Identifica se o conteúdo está fechado.
        const estavaFechado = estudoCasoMod.hidden;

        // Alterna a visibilidade do estudo de caso.
        estudoCasoMod.hidden = !estavaFechado;

        // Atualiza o estado para tecnologias assistivas.
        botaoEstudoMod.setAttribute(
            "aria-expanded",
            String(estavaFechado)
        );

        // Atualiza o texto do botão.
        botaoEstudoMod.textContent = estavaFechado
            ? "Ocultar Estudo de Caso"
            : "Ver Estudo de Caso";
    });
}
