const loginForm = document.getElementById('loginForm');
const showPassword = document.getElementById('showPassword');
const passwordInput = document.getElementById('password');
const backBtn = document.querySelector('.back-btn');

showPassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = this.querySelector('i');
    if (type === 'text') {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
    
    passwordInput.focus();
});

backBtn.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.login-card').style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
        window.history.back();
    }, 300);
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value.trim();
    const remember = document.getElementById('remember').checked;
    
    document.activeElement.blur();
    
    if (!email) {
        showError('Por favor, insira seu e-mail ou usuário');
        shakeElement(document.getElementById('email').parentElement);
        return;
    }
    
    if (!password) {
        showError('Por favor, insira sua senha');
        shakeElement(passwordInput.parentElement);
        return;
    }
    
    if (password.length < 6) {
        showError('A senha deve ter pelo menos 6 caracteres');
        shakeElement(passwordInput.parentElement);
        return;
    }
    
    if (!email.includes('@') && !/^[a-zA-Z0-9_]{3,}$/.test(email)) {
        showError('Por favor, insira um e-mail válido ou nome de usuário (mínimo 3 caracteres)');
        shakeElement(document.getElementById('email').parentElement);
        return;
    }
    
    simulateLogin(email, password, remember);
});

function simulateLogin(email, password, remember) {
    const loginBtn = loginForm.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    loginBtn.disabled = true;
    
    const formElements = loginForm.elements;
    for (let i = 0; i < formElements.length; i++) {
        formElements[i].disabled = true;
    }
    
    setTimeout(() => {
        if (email === 'admin' && password === 'admin123') {
            showSuccess('Login realizado com sucesso!');
            
            if (remember) {
                localStorage.setItem('rememberedEmail', email);
            }
            
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
            
            setTimeout(() => {
                window.location.href = '../';
            }, 1500);
        } else {
            showError('E-mail/senha incorretos. Tente novamente.');
            
            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
            }
            
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = false;
            }
        }
    }, 1500);
}

function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    loginForm.parentNode.insertBefore(errorDiv, loginForm);
    
    setTimeout(() => {
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
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

function showSuccess(message) {
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    loginForm.parentNode.insertBefore(successDiv, loginForm);
    
    setTimeout(() => {
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
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

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

window.addEventListener('DOMContentLoaded', function() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
    
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'fadeIn 0.5s ease-out';
    
    if (/android/i.test(navigator.userAgent)) {
        document.body.classList.add('android');
    }
    
    setTimeout(() => {
        const emailInput = document.getElementById('email');
        emailInput.focus();
        
        if (/android/i.test(navigator.userAgent)) {
            emailInput.click();
        }
    }, 500);
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        setTimeout(() => {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    });
});