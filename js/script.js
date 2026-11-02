

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
    const fotos = {
        musica: ["img/projeto-musical.jpg", "img/projeto-musical-1.jpg", "img/projeto-musical-2.jpg", "img/projeto-musical-3.jpg", "img/projeto-musical-5.jpg"],
        web: ["img/java-API-1.jpg", "img/projeto-java-Dashboard-3.jpg", "img/projeto-java-login-4.jpg", "img/banco.jpg", "img/projeto-java-API-2.jpg"]
    };
    fotosAtuais = fotos[projeto];
    fotoIndex = 0;
    mostrarFoto();
    document.getElementById('overlay-galeria').style.display = "flex";
}
function mostrarFoto() { document.getElementById('foto-exibida').src = fotosAtuais[fotoIndex]; }
function mudarFoto(dir) { 
    fotoIndex = (fotoIndex + dir + fotosAtuais.length) % fotosAtuais.length; 
    mostrarFoto(); 
}
function fecharGaleria() { document.getElementById('overlay-galeria').style.display = "none"; }

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
