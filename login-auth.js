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
        // Fetch user data from JSON Server by email
        const res = await fetch(`${API_URL}?email=${email}`);
        const users = await res.json();
        
        if (!users.length) return alert("User not found.");
        
        const user = users[0];
        
        // Simple password validation
        if (user.password === pass) {
            // Save user session to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            alert(`Welcome ${user.name}!`);
            
            // Redirect based on user role
            window.location.href = user.role === 'company' ? 'company-dashboard.html' : 'candidate-profile.html';
        } else {
            alert("Incorrect password.");
        }
    } catch (err) { 
        console.error(err); 
        alert("Error connecting to server."); 
    }
};