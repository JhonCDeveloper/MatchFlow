// API configuration
const API_URL = "http://localhost:3000/users";

// DOM Elements selection
const loginSec = document.getElementById('login-section');
const regSec = document.getElementById('register-section');

// View Toggle: Switch from Login to Register
document.getElementById('show-register').onclick = (e) => {
    e.preventDefault();
    loginSec.classList.add('d-none');
    regSec.classList.remove('d-none');
};

// View Toggle: Switch from Register back to Login
document.getElementById('show-login').onclick = (e) => {
    e.preventDefault();
    loginSec.classList.remove('d-none');
    regSec.classList.add('d-none');
};