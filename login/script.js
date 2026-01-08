const loginForm = document.getElementById('loginForm');
const showPassword = document.getElementById('showPassword');
const passwordInput = document.getElementById('password');
const backBtn = document.querySelector('.back-btn');

// --- Função REAL de login (fetch) ---
async function realLogin(email, password, remember) {
  const loginBtn = loginForm.querySelector('.login-btn');
  const originalText = loginBtn.innerHTML;
  
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
  loginBtn.disabled = true;
  
  // Desabilita todos os campos do formulário durante o login
  const formElements = loginForm.elements;
  for (let i = 0; i < formElements.length; i++) {
    formElements[i].disabled = true;
  }

  try {
    const response = await fetch(
      'https://thenextfanfic.pythonanywhere.com/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Erro ao entrar');
    }

    showSuccess(data.message || 'Login realizado com sucesso!');

    if (remember) {
      localStorage.setItem('rememberedEmail', email);
    }

    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    setTimeout(() => {
      window.location.href = '../';
    }, 1200);

  } catch (err) {
    showError(err.message || 'Erro de conexão');

    // Restaura o botão
    loginBtn.innerHTML = originalText;
    loginBtn.disabled = false;
    
    // Reabilita todos os campos do formulário
    for (let i = 0; i < formElements.length; i++) {
      formElements[i].disabled = false;
    }

    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }
}

// --- Helpers para erro por campo ---
function setFieldError(input, title, message) {
  clearFieldError(input);

  input.classList.add('invalid');
  input.setAttribute('aria-invalid', 'true');

  const error = document.createElement('div');
  error.className = 'field-error';
  error.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <div class="err-body">
      <span class="err-title">${escapeHtml(title)}</span>
      <span class="err-text">${escapeHtml(message)}</span>
    </div>
  `;

  const parent = input.closest('.input-group') || input.parentElement;
  parent.appendChild(error);

  // ⏱️ aguarda 2s e anima VOLTANDO ao campo
  setTimeout(() => {
    error.style.animation = 'fieldErrorOut 0.25s ease forwards';

    // input acompanha a volta
    input.style.transition = 'transform 0.25s ease';
    input.style.transform = 'translateY(-2px)';

    setTimeout(() => {
      if (error.parentNode) error.remove();
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      input.style.transform = '';
    }, 250);
  }, 2000);
}

function clearFieldError(input) {
  input.classList.remove('invalid');
  input.removeAttribute('aria-invalid');
  input.style.transform = '';
  const parent = input.closest('.input-group') || input.parentElement;
  const existing = parent.querySelector('.field-error');
  if (existing) existing.remove();
}

// proteção básica (evita injeção)
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function(m) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}

// ✅ Limpar erro ao digitar (mantém fluidez)
document.querySelectorAll('#loginForm input').forEach(input => {
  input.addEventListener('input', () => clearFieldError(input));
});

// Configura validação em tempo real para campos obrigatórios
document.querySelectorAll('#loginForm input[required]').forEach(input => {
  // quando usuário digita, limpa o erro (já temos acima, mas mantemos para consistência)
  input.addEventListener('input', () => clearFieldError(input));

  // se algum script disparar invalid, prevenimos tooltip nativo e mostramos o nosso
  input.addEventListener('invalid', (e) => {
    e.preventDefault(); // evita tooltip nativo
    // mensagens personalizadas por campo
    if (input.id === 'email') {
      setFieldError(input, 'Preencha o e-mail ou usuário', 'Insira um e-mail válido (ex: voce@exemplo.com) ou nome de usuário (mín. 3 caracteres).');
    } else if (input.id === 'password') {
      setFieldError(input, 'Senha necessária', 'Digite sua senha. Mínimo 6 caracteres.');
    } else {
      setFieldError(input, 'Campo obrigatório', 'Este campo não pode ficar vazio.');
    }
  });
});

// Função para adicionar animação de clique em qualquer elemento
function addClickAnimation(element) {
    if (!element) return;
    
    element.addEventListener('mousedown', function() {
        this.style.opacity = '0.7';
        this.style.transform = 'scale(0.98)';
        this.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    });
    
    element.addEventListener('mouseup', function() {
        this.style.opacity = '';
        this.style.transform = '';
        this.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.opacity = '';
        this.style.transform = '';
    });
    
    // Para dispositivos touch
    element.addEventListener('touchstart', function() {
        this.style.opacity = '0.7';
        this.style.transform = 'scale(0.98)';
        this.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    });
    
    element.addEventListener('touchend', function() {
        this.style.opacity = '';
        this.style.transform = '';
        this.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    });
    
    element.addEventListener('touchcancel', function() {
        this.style.opacity = '';
        this.style.transform = '';
    });
}

// Adiciona animação de clique a todos os botões e links clicáveis
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os elementos clicáveis
    const clickableElements = document.querySelectorAll(
        'button, .back-btn, .login-btn, .show-password, .forgot-password, ' +
        '.register-link a, .remember input, input[type="submit"], a[href]'
    );
    
    // Adiciona animação a cada elemento
    clickableElements.forEach(element => {
        addClickAnimation(element);
    });
    
    // Adiciona animação específica para o botão de mostrar senha
    addClickAnimation(showPassword);
    
    // Adiciona animação específica para o botão de voltar
    addClickAnimation(backBtn);
    
    // Adiciona animação específica para o botão de login
    const loginBtn = document.querySelector('.login-btn');
    addClickAnimation(loginBtn);
    
    // Adiciona animação para o checkbox "Lembrar-me"
    const rememberCheckbox = document.querySelector('.remember');
    addClickAnimation(rememberCheckbox);
    
    // Adiciona animação para o link "Esqueci a senha"
    const forgotPasswordLink = document.querySelector('.forgot-password');
    addClickAnimation(forgotPasswordLink);
    
    // Adiciona animação para o link "Cadastre-se"
    const registerLink = document.querySelector('.register-link a');
    addClickAnimation(registerLink);
});

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

  // limpa erros anteriores
  document.querySelectorAll('.field-error').forEach(el => el.remove());
  document.querySelectorAll('input.invalid').forEach(i => {
    i.classList.remove('invalid');
    i.removeAttribute('aria-invalid');
    i.style.transform = '';
  });

  const emailInput = document.getElementById('email');
  const email = emailInput.value.trim();
  const passwordInput = document.getElementById('password');
  const password = passwordInput.value.trim();
  const remember = document.getElementById('remember').checked;

  document.activeElement.blur();

  if (!email) {
    setFieldError(emailInput, 'Campo obrigatório', 'Por favor, insira seu e-mail ou usuário.');
    shakeElement(emailInput.parentElement || emailInput);
    return;
  }

  if (!password) {
    setFieldError(passwordInput, 'Campo obrigatório', 'Por favor, informe sua senha.');
    shakeElement(passwordInput.parentElement || passwordInput);
    return;
  }

  if (password.length < 6) {
    setFieldError(passwordInput, 'Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
    shakeElement(passwordInput.parentElement || passwordInput);
    return;
  }

  if (!email.includes('@') && !/^[a-zA-Z0-9_]{3,}$/.test(email)) {
    setFieldError(emailInput, 'E-mail ou usuário inválido', 'Insira um e-mail válido ou um nome de usuário com pelo menos 3 caracteres.');
    shakeElement(emailInput.parentElement || emailInput);
    return;
  }

  // se passou nas validações mostramos status de login
  realLogin(email, password, remember); // ← Alterado de simulateLogin para realLogin
});

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

// Adiciona também animação para os botões de foco
document.querySelectorAll('button, .back-btn, .login-btn, .show-password').forEach(btn => {
    btn.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 0 0 3px rgba(242, 198, 204, 0.3)';
    });
    
    btn.addEventListener('blur', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
});