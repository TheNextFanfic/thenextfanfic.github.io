const loginForm = document.getElementById('loginForm');
const showPassword = document.getElementById('showPassword');
const passwordInput = document.getElementById('password');
const backBtn = document.querySelector('.back-btn');
const formFeedback = document.getElementById('form-feedback');

async function realLogin(email, password, remember) {
  const loginBtn = loginForm.querySelector('.login-btn');
  const originalText = loginBtn.innerHTML;
  
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
  loginBtn.disabled = true;
  
  const formElements = loginForm.elements;
  for (let i = 0; i < formElements.length; i++) formElements[i].disabled = true;

  try {
    const response = await fetch(
      'https://thenextfanfic.pythonanywhere.com/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Erro ao entrar');
    }

    showGlobalMessage('success', data.message || 'Login realizado com sucesso!', 3000);

    if (remember) localStorage.setItem('rememberedEmail', email);

    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);

    setTimeout(() => { window.location.href = '../'; }, 1200);

  } catch (err) {
    showGlobalMessage('error', err.message || 'Erro de conexão');

    loginBtn.innerHTML = originalText;
    loginBtn.disabled = false;
    
    for (let i = 0; i < formElements.length; i++) formElements[i].disabled = false;

    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
  }
}

function _createFieldPopup() {
  let popup = document.getElementById('field-popup');
  if (popup) return popup;

  popup = document.createElement('div');
  popup.id = 'field-popup';
  popup.className = 'field-popup';
  popup.setAttribute('role', 'alert');
  popup.setAttribute('aria-live', 'polite');
  popup.style.opacity = '0';
  popup.style.pointerEvents = 'none';
  document.body.appendChild(popup);
  return popup;
}

function setFieldError(input, title, message) {
  clearFieldError(input);

  input.classList.add('invalid');
  input.setAttribute('aria-invalid', 'true');

  const popup = _createFieldPopup();
  popup.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <div class="err-body">
      <span class="err-title">${escapeHtml(title)}</span>
      <span class="err-text">${escapeHtml(message)}</span>
    </div>
  `;

  if (formFeedback) {
    formFeedback.textContent = `${title}. ${message}`;
  }
  popup.setAttribute('data-target-id', input.id || '');

  const rect = input.getBoundingClientRect();
  document.body.appendChild(popup);
  const popupRect = popup.getBoundingClientRect();

  const margin = 10;
  let top = rect.top - popupRect.height - margin;
  let left = rect.left + (rect.width / 2) - (popupRect.width / 2);

  if (top < 8) top = rect.bottom + margin;
  if (left < 8) left = 8;
  if (left + popupRect.width > window.innerWidth - 8) left = window.innerWidth - popupRect.width - 8;

  popup.style.position = 'absolute';
  popup.style.left = `${Math.round(left)}px`;
  popup.style.top = `${Math.round(top + window.scrollY)}px`;

  requestAnimationFrame(() => {
    popup.style.opacity = '1';
    popup.style.transform = 'translateY(0) scale(1)';
  });

  input.style.transition = 'transform 0.25s ease';
  input.style.transform = 'translateY(-2px)';

  const hideAfter = 2000;
  const timeoutId = setTimeout(() => {
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(-6px) scale(0.98)';
    input.style.transform = '';
    setTimeout(() => {
      if (popup.parentNode) popup.parentNode.removeChild(popup);
      if (formFeedback) formFeedback.textContent = '';
    }, 250);
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
  }, hideAfter);

  popup.addEventListener('click', () => {
    clearTimeout(timeoutId);
    if (popup.parentNode) popup.parentNode.removeChild(popup);
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    if (formFeedback) formFeedback.textContent = '';
  }, { once: true });
}

function clearFieldError(input) {
  input.classList.remove('invalid');
  input.removeAttribute('aria-invalid');
  input.style.transform = '';

  const popup = document.getElementById('field-popup');
  if (popup && popup.getAttribute('data-target-id') === (input.id || '')) {
    if (popup.parentNode) popup.parentNode.removeChild(popup);
  }
  if (formFeedback) formFeedback.textContent = '';
}

function clearAllFieldPopups() {
  const popup = document.getElementById('field-popup');
  if (popup && popup.parentNode) popup.parentNode.removeChild(popup);
  document.querySelectorAll('input.invalid').forEach(i => {
    i.classList.remove('invalid');
    i.removeAttribute('aria-invalid');
    i.style.transform = '';
  });
  if (formFeedback) formFeedback.textContent = '';
}

function _createGlobalMessageContainer() {
  let container = document.getElementById('form-global-message');
  if (container) return container;

  const loginCard = document.querySelector('.login-card');
  container = document.createElement('div');
  container.id = 'form-global-message';
  container.className = 'form-global-message sr-only';
  container.setAttribute('aria-live', 'assertive');
  container.setAttribute('role', 'status');

  if (loginCard) {
    loginCard.insertBefore(container, loginCard.querySelector('form') || null);
  } else {
    const loginForm = document.getElementById('loginForm');
    if (loginForm && loginForm.parentNode) loginForm.parentNode.insertBefore(container, loginForm);
    else document.body.appendChild(container);
  }
  return container;
}

function toggleMessageState(hasMessage) {
  const loginCard = document.querySelector('.login-card');
  if (!loginCard) return;
  
  if (hasMessage) {
    loginCard.classList.add('has-message');
  } else {
    loginCard.classList.remove('has-message');
  }
}

function showGlobalMessage(type, message, duration = 4000) {
  const container = _createGlobalMessageContainer();
  
  if (container._hideTimer) { 
    clearTimeout(container._hideTimer); 
    container._hideTimer = null; 
  }

  toggleMessageState(true);

  container.className = 'form-global-message';
  container.innerHTML = `<div class="${type === 'error' ? 'error-message' : (type === 'success' ? 'success-message' : 'info-message')}">
    <i class="${type === 'error' ? 'fas fa-exclamation-circle' : (type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle')}"></i>
    <span>${escapeHtml(message)}</span>
  </div>`;

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

  document.body.classList.add('no-scroll');

  if (!isTouch) {
    setTimeout(() => {
      const loginCard = document.querySelector('.login-card');
      if (loginCard) loginCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }

  container._hideTimer = setTimeout(() => {
    const child = container.querySelector('.error-message, .success-message, .info-message');
    if (child) {
      child.style.opacity = '0';
      child.style.transform = 'translateY(-10px)';
    }
    setTimeout(() => {
      container.innerHTML = '';
      container.className = 'form-global-message sr-only';
      document.body.classList.remove('no-scroll');
      toggleMessageState(false);
    }, 300);
  }, duration);

  container.addEventListener('click', function onceClose() {
    if (container._hideTimer) { 
      clearTimeout(container._hideTimer); 
      container._hideTimer = null; 
    }
    container.innerHTML = '';
    container.className = 'form-global-message sr-only';
    document.body.classList.remove('no-scroll');
    toggleMessageState(false);
    container.removeEventListener('click', onceClose);
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function(m) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}

document.querySelectorAll('#loginForm input').forEach(input => {
  input.addEventListener('input', () => clearFieldError(input));
});

document.querySelectorAll('#loginForm input[required]').forEach(input => {
  input.addEventListener('input', () => clearFieldError(input));
  input.addEventListener('invalid', (e) => {
    e.preventDefault();
    if (input.id === 'email') {
      setFieldError(input, 'Preencha o e-mail ou usuário', 'Insira um e-mail válido (ex: voce@exemplo.com) ou nome de usuário (mín. 3 caracteres).');
    } else if (input.id === 'password') {
      setFieldError(input, 'Senha necessária', 'Digite sua senha. Mínimo 6 caracteres.');
    } else {
      setFieldError(input, 'Campo obrigatório', 'Este campo não pode ficar vazio.');
    }
  });
});

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

document.addEventListener('DOMContentLoaded', function() {
    const clickableElements = document.querySelectorAll(
        'button, .back-btn, .login-btn, .show-password, .forgot-password, ' +
        '.register-link a, .remember input, input[type="submit"], a[href]'
    );
    clickableElements.forEach(element => addClickAnimation(element));
    addClickAnimation(showPassword);
    addClickAnimation(backBtn);
    const loginBtn = document.querySelector('.login-btn');
    addClickAnimation(loginBtn);
    const rememberCheckbox = document.querySelector('.remember');
    addClickAnimation(rememberCheckbox);
    const forgotPasswordLink = document.querySelector('.forgot-password');
    addClickAnimation(forgotPasswordLink);
    const registerLink = document.querySelector('.register-link a');
    addClickAnimation(registerLink);

    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
    const loginCard = document.querySelector('.login-card');
    if (loginCard) loginCard.style.animation = 'fadeIn 0.5s ease-out';
    if (/android/i.test(navigator.userAgent)) document.body.classList.add('android');

    setTimeout(() => {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.focus();
            if (/android/i.test(navigator.userAgent)) emailInput.click();
        }
    }, 500);
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

  clearAllFieldPopups();

  const emailInput = document.getElementById('email');
  const email = emailInput.value.trim();
  const passwordInput = document.getElementById('password');
  const password = passwordInput.value.trim();
  const remember = document.getElementById('remember').checked;

  document.activeElement.blur();

  if (!email) {
    showGlobalMessage('error', 'Campo obrigatório — por favor, insira seu e-mail ou usuário.');
    shakeElement(emailInput.parentElement || emailInput);
    return;
  }

  if (!password) {
    showGlobalMessage('error', 'Campo obrigatório — por favor, informe sua senha.');
    shakeElement(passwordInput.parentElement || passwordInput);
    return;
  }

  if (password.length < 6) {
    showGlobalMessage('error', 'Senha fraca — a senha deve ter pelo menos 6 caracteres.');
    shakeElement(passwordInput.parentElement || passwordInput);
    return;
  }

  if (!email.includes('@') && !/^[a-zA-Z0-9_]{3,}$/.test(email)) {
    showGlobalMessage('error', 'E-mail ou usuário inválido — insira um e-mail válido ou um nome de usuário (mín. 3 caracteres).');
    shakeElement(emailInput.parentElement || emailInput);
    return;
  }

  realLogin(email, password, remember);
});

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => { element.style.animation = ''; }, 500);
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        setTimeout(() => {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    });
});

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