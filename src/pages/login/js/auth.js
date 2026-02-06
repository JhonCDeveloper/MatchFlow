import { API } from './api.js';

const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const messageBox = document.getElementById('auth-message');

/**
 * Muestra notificaciones en la interfaz.
 * @param {string} msg - Texto del mensaje.
 * @param {string} type - Clase de Bootstrap (danger/success).
 */
const notify = (msg, type = 'danger') => {
  messageBox.textContent = msg;
  messageBox.className = `alert alert-${type} py-2 small text-center`;
  messageBox.classList.remove('d-none');
  setTimeout(() => messageBox.classList.add('d-none'), 4000);
};

const switchView = (showLogin) => {
  loginSection.classList.toggle('d-none', !showLogin);
  registerSection.classList.toggle('d-none', showLogin);
};

document.getElementById('show-register').onclick = (e) => {
  e.preventDefault();
  switchView(false);
};
document.getElementById('show-login').onclick = (e) => {
  e.preventDefault();
  switchView(true);
};

/**
 * Maneja el inicio de sesión.
 */
document.getElementById('login-form').onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const users = await API.findUserByEmail(email);
    if (users.length === 0) return notify('User not found');

    const user = users[0];
    if (user.password === password) {
      localStorage.setItem('user', JSON.stringify(user));
      notify('Welcome back!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      notify('Incorrect password');
    }
  } catch (err) {
    notify('Server error. Check json-server.');
  }
};

/**
 * Maneja el registro con validación de contraseña doble.
 */
document.getElementById('register-form').onsubmit = async (e) => {
  e.preventDefault();

  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;

  // Validación de coincidencia de contraseñas
  if (password !== confirmPassword) {
    return notify('Passwords do not match!');
  }

  const email = document.getElementById('reg-email').value;

  try {
    const exists = await API.findUserByEmail(email);
    if (exists.length > 0) return notify('Email already registered');

    const newUser = {
      name: document.getElementById('reg-name').value,
      email: email,
      password: password,
      role: document.getElementById('reg-role').value,
      createdAt: new Date().toISOString(),
    };

    await API.createUser(newUser);
    notify('Account created! Please sign in.', 'success');
    setTimeout(() => switchView(true), 2000);
  } catch (err) {
    notify('Could not connect to server');
  }
};
