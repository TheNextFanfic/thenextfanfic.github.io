// DOM Elements
const profileBtn = document.getElementById('profileBtn');
const lerBtn = document.getElementById('lerBtn');
const tabs = document.querySelectorAll('.tab');

// Função para redirecionar para login
function irParaLogin() {
    // URL amigável para a pasta login (que contém index.html)
    window.location.href = '/login/';
}

// Função para ler fanfic
function lerFanfic() {
    alert("Em breve você poderá ler esta fanfic!");
    // Aqui você pode redirecionar para a página da fanfic
    // window.location.href = '/fanfic/1';
}

// Sistema de abas
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove classe ativa de todas as abas
        tabs.forEach(t => t.classList.remove('active'));
        
        // Adiciona classe ativa na aba clicada
        tab.classList.add('active');
        
        // Pega o tipo da aba
        const tabType = tab.getAttribute('data-tab');
        
        // Aqui você pode adicionar a lógica para cada aba
        switch(tabType) {
            case 'home':
                console.log('Home selecionada');
                // window.location.href = '/';
                break;
            case 'buscar':
                console.log('Buscar selecionada');
                // window.location.href = '/buscar/';
                break;
            case 'escrever':
                console.log('Escrever selecionada');
                // window.location.href = '/escrever/';
                break;
        }
    });
});

// Event Listeners
profileBtn.addEventListener('click', irParaLogin);
lerBtn.addEventListener('click', lerFanfic);

// Efeito de hover nos botões
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', function() {
        this.style.transform = '';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Verificar se está em um dispositivo móvel
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Ajustes para mobile
if (isMobile()) {
    document.body.classList.add('mobile');
}