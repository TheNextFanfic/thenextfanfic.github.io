// DOM Elements
const loginForm = document.getElementById('loginForm');
const showPassword = document.getElementById('showPassword');
const passwordInput = document.getElementById('password');
const backBtn = document.querySelector('.back-btn');

// Alternar visibilidade da senha
showPassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Alternar ícone
    const icon = this.querySelector('i');
    if (type === 'text') {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Voltar para a página principal
backBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.history.back();
});

// Validação do formulário de login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value.trim();
    const remember = document.getElementById('remember').checked;
    
    // Validações básicas
    if (!email) {
        showError('Por favor, insira seu e-mail ou usuário');
        return;
    }
    
    if (!password) {
        showError('Por favor, insira sua senha');
        return;
    }
    
    if (password.length < 6) {
        showError('A senha deve ter pelo menos 6 caracteres');
        return;
    }
    
    // Validação de email simples
    if (!email.includes('@') && !/^[a-zA-Z0-9_]{3,}$/.test(email)) {
        showError('Por favor, insira um e-mail válido ou nome de usuário (mínimo 3 caracteres)');
        return;
    }
    
    // Simulação de login
    simulateLogin(email, password, remember);
});

// Função de simulação de login
function simulateLogin(email, password, remember) {
    // Mostrar loading
    const loginBtn = loginForm.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    loginBtn.disabled = true;
    
    // Desabilitar outros elementos do formulário
    const formElements = loginForm.elements;
    for (let i = 0; i < formElements.length; i++) {
        formElements[i].disabled = true;
    }
    
    // Simular requisição à API
    setTimeout(() => {
        // Aqui você faria a requisição real
        // fetch('/api/login', { method: 'POST', body: JSON.stringify({email, password}) })
        
        // Simulando sucesso (você deve remover isso em produção)
        if (email === 'admin' && password === 'admin123') {
            showSuccess('Login realizado com sucesso!');
            
            // Salvar no localStorage se "Lembrar-me" estiver marcado
            if (remember) {
                localStorage.setItem('rememberedEmail', email);
            }
            
            // Redirecionar para a página principal após login
            setTimeout(() => {
                window.location.href = '../';
            }, 1500);
        } else {
            // Simulação de falha
            showError('E-mail/senha incorretos. Tente novamente.');
            
            // Restaurar botão e elementos
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = false;
            }
        }
    }, 2000);
}

// Função para exibir erros
function showError(message) {
    // Remover mensagens anteriores
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Criar nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    // Estilos para a mensagem de erro
    errorDiv.style.cssText = `
        background: rgba(219, 68, 55, 0.1);
        border: 1px solid rgba(219, 68, 55, 0.3);
        color: #ff6b6b;
        padding: 12px 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.95rem;
        animation: slideDown 0.3s ease;
    `;
    
    // Inserir antes do formulário
    loginForm.parentNode.insertBefore(errorDiv, loginForm);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.opacity = '0';
            errorDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Função para exibir sucesso
function showSuccess(message) {
    // Remover mensagens anteriores
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Criar nova mensagem de sucesso
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Estilos para a mensagem de sucesso
    successDiv.style.cssText = `
        background: rgba(46, 204, 113, 0.1);
        border: 1px solid rgba(46, 204, 113, 0.3);
        color: #2ecc71;
        padding: 12px 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.95rem;
        animation: slideDown 0.3s ease;
    `;
    
    // Inserir antes do formulário
    loginForm.parentNode.insertBefore(successDiv, loginForm);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Preencher campo de email se estiver salvo no localStorage
window.addEventListener('DOMContentLoaded', function() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
    
    // Adicionar animação de entrada
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'fadeIn 0.5s ease-out';
});

// Adicionar animação CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Foco automático no campo de email
setTimeout(() => {
    document.getElementById('email').focus();
}, 300);

// Melhorias para teclado virtual em mobile
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        // Rolar para o input em foco em dispositivos móveis
        if (window.innerHeight < 700) {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});