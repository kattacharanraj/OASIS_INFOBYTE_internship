const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const dashboard = document.getElementById('dashboard');
const authForms = document.getElementById('authForms');

const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

const regUsername = document.getElementById('regUsername');
const regPassword = document.getElementById('regPassword');
const regConfirmPassword = document.getElementById('regConfirmPassword');
const registerBtn = document.getElementById('registerBtn');
const regError = document.getElementById('regError');

const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const displayUsername = document.getElementById('displayUsername');
const loginTime = document.getElementById('loginTime');
const usersList = document.getElementById('usersList');

let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;

function initializeApp() {
    if (currentUser) {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    authForms.classList.remove('hidden');
    dashboard.classList.add('hidden');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

function showRegister() {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
}

function showDashboard() {
    authForms.classList.add('hidden');
    dashboard.classList.remove('hidden');
    userName.textContent = currentUser;
    displayUsername.textContent = currentUser;
    loginTime.textContent = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    displayUsers();
}

function displayUsers() {
    usersList.innerHTML = '';
    Object.keys(users).forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        usersList.appendChild(li);
    });
}

function register() {
    const username = regUsername.value.trim();
    const password = regPassword.value;
    const confirmPassword = regConfirmPassword.value;

    regError.classList.remove('show');

    if (username === '' || password === '') {
        showError(regError, 'All fields are required!');
        return;
    }

    if (password !== confirmPassword) {
        showError(regError, 'Passwords do not match!');
        return;
    }

    if (password.length < 4) {
        showError(regError, 'Password must be at least 4 characters!');
        return;
    }

    if (users[username]) {
        showError(regError, 'Username already exists!');
        return;
    }

    // Note: this is a simple demo project, so the password is just stored as text.
    // In a real app you should never save passwords like this.
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));

    regUsername.value = '';
    regPassword.value = '';
    regConfirmPassword.value = '';

    showError(regError, 'Registration successful! Please login.', true);
    setTimeout(() => {
        showLogin();
    }, 1500);
}

function login() {
    const username = loginUsername.value.trim();
    const password = loginPassword.value;

    loginError.classList.remove('show');

    if (username === '' || password === '') {
        showError(loginError, 'All fields are required!');
        return;
    }

    if (!users[username]) {
        showError(loginError, 'User does not exist!');
        return;
    }

    if (users[username] !== password) {
        showError(loginError, 'Incorrect password!');
        return;
    }

    currentUser = username;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    loginUsername.value = '';
    loginPassword.value = '';

    showDashboard();
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    showLogin();
    loginError.classList.remove('show');
    regError.classList.remove('show');
}

function showError(element, message, isSuccess = false) {
    element.textContent = message;
    element.classList.add('show');
    if (!isSuccess) {
        element.style.backgroundColor = 'lightcoral';
    } else {
        element.style.backgroundColor = 'lightgreen';
    }
}

loginBtn.addEventListener('click', login);
registerBtn.addEventListener('click', register);
logoutBtn.addEventListener('click', logout);

toRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showRegister();
    loginError.classList.remove('show');
});

toLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
    regError.classList.remove('show');
});

loginUsername.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});

loginPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});

regUsername.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') register();
});

regPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') register();
});

regConfirmPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') register();
});

initializeApp();
