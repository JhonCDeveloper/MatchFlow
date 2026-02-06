import { API } from './api.js';
import { Storage } from './storage.js';

// DATA
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const messageBox = document.getElementById('auth-message');

// HELPERS
const notify = (msg, type = 'danger') => {
  messageBox.textContent = msg;
  messageBox.className = `alert alert-${type} py-2 small text-center`;
  messageBox.classList.remove('d-none');
  setTimeout(() => messageBox.classList.add('d-none'), 4000);
};

// TOGGLES
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

// LOGIN
document.getElementById('login-form').onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const users = await API.findUserByEmail(email);
    if (users.length === 0) return notify('User not found');

    const user = users[0];
    if (user.password === password) {
      Storage.saveSession(user); // SAVE SESSION

      notify(`Welcome back, ${user.name}!`, 'success');

      setTimeout(() => {
        window.location.href =
          user.role === 'company'
            ? 'company-dashboard.html'
            : 'candidate-dashboard.html';
      }, 1000);
    } else {
      notify('Incorrect password');
    }
  } catch (err) {
    notify('Server error');
  }
};

// REGISTER
document.getElementById('register-form').onsubmit = async (e) => {
  e.preventDefault();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;

  if (password !== confirmPassword) return notify('Passwords do not match!');

  try {
    const exists = await API.findUserByEmail(
      document.getElementById('reg-email').value
    );
    if (exists.length > 0) return notify('Email already exists');

    const newUser = {
      name: document.getElementById('reg-name').value,
      email: document.getElementById('reg-email').value,
      password: password,
      role: document.getElementById('reg-role').value,
      createdAt: new Date().toISOString(),
    };

    await API.createUser(newUser);
    notify('Account created!', 'success');
    setTimeout(() => switchView(true), 2000);
  } catch (err) {
    notify('Connection error');
  }
};
