// API configuration - Pointing to your local JSON Server
const API_URL = "http://localhost:3000/users";

// DOM Elements selection for Login and Register sections
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

// Login Form Submission Handler
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}?email=${email}`);
        const users = await res.json();
        
        if (!users.length) return alert("User not found.");
        
        const user = users[0];
        
        if (user.password === pass) {
            localStorage.setItem('user', JSON.stringify(user));
            alert(`Welcome ${user.name}!`);
            window.location.href = user.role === 'company' ? 'company-dashboard.html' : '../candidate.html';
        } else {
            alert("Incorrect password.");
        }
    } catch (err) { 
        console.error(err); 
        alert("Error connecting to server."); 
    }
};

// Register Form Submission Handler
document.getElementById('register-form').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    
    try {
        // Check for duplicate email
        const check = await fetch(`${API_URL}?email=${email}`);
        if ((await check.json()).length) return alert("Email already registered.");

        // Create new user object
        const newUser = {
            name: document.getElementById('reg-name').value,
            email: email,
            password: document.getElementById('reg-password').value,
            role: document.getElementById('reg-role').value,
            openToWork: document.getElementById('reg-role').value === 'candidate' ? false : undefined
        };

        // Post new user to database
        await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        });
        
        alert("Account created!");
        loginSec.classList.remove('d-none');
        regSec.classList.add('d-none');
        e.target.reset();
        
    } catch (err) { 
        console.error(err); 
        alert("Registration failed."); 
    }
};