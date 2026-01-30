// 1. BLOQUEIO DE CÓPIA
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = e => { if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 85)) return false; };

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

function revealOnScroll() {
    const sections = document.querySelectorAll('.scroll-reveal');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const trigger = window.innerHeight * 3;
        if (sectionTop < trigger) {
            section.classList.add('active');
        }
    });
}

// 4. CENTRALIZAR SEÇÃO AO CLICAR NO MENU
document.querySelectorAll('.nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetPosition = (targetElement.offsetTop + (targetElement.offsetHeight / 2)) - (window.innerHeight / 2);
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

// 5. FORMULÁRIO DE CONTATO
const form = document.getElementById('form-contato');
if (form) {
    const btnEnviar = document.getElementById('btn-enviar');
    const campoEmail = document.getElementById('campo-email');
    const camposObrigatorios = [document.getElementById('campo-nome'), document.getElementById('campo-msg')];

    form.addEventListener('input', () => {
        const emailValido = campoEmail.value.includes('@') && campoEmail.value.includes('.');
        const textosPreenchidos = camposObrigatorios.every(c => c.value.trim() !== "");
        btnEnviar.disabled = !(emailValido && textosPreenchidos);
        btnEnviar.classList.toggle('disabled', btnEnviar.disabled);
    });

    form.onsubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
        if (response.ok) form.innerHTML = `<p style="color:#8a2be2; font-weight:bold; text-align:center;">Mensagem enviada com sucesso!</p>`;
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

// INICIALIZAÇÃO
const btnBackToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    // Mostra o botão quando passar de 400px de altura
    if (window.scrollY > 400) {
        btnBackToTop.classList.add('show');
    } else {
        btnBackToTop.classList.remove('show');
    }
});

// Clique para voltar ao topo
btnBackToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});