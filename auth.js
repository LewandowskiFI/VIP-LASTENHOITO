/* Serverless Autentikaatio - Vercel Backend */

function isAuthenticated() {
    return localStorage.getItem('vip_user_token') !== null;
}

function getUserData() {
    const data = localStorage.getItem('vip_user_data');
    return data ? JSON.parse(data) : null;
}

async function registerUser(name, email, password) {
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'register', name, email, password })
        });
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('vip_user_token', data.token);
            localStorage.setItem('vip_user_data', JSON.stringify(data.user));
        }
        return data; // { success, message, ... }
    } catch (err) {
        return { success: false, message: 'Yhteysvirhe palvelimelle.' };
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', email, password })
        });
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('vip_user_token', data.token);
            localStorage.setItem('vip_user_data', JSON.stringify(data.user));
        }
        return data;
    } catch (err) {
        return { success: false, message: 'Yhteysvirhe palvelimelle.' };
    }
}

function logoutUser() {
    localStorage.removeItem('vip_user_token');
    localStorage.removeItem('vip_user_data');
    window.location.href = 'index.html';
}

// Päivitä Navigaatio
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
});

function updateNavigation() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    if (isAuthenticated()) {
        const user = getUserData();
        const userName = user && user.name ? user.name.split(' ')[0] : 'Käyttäjä';
        
        const ctas = navLinks.querySelectorAll('.nav-cta');
        ctas.forEach(btn => btn.style.display = 'none');
        
        if(!document.getElementById('nav-dashboard')) {
            const dashBtn = document.createElement('a');
            dashBtn.href = 'dashboard.html';
            dashBtn.className = 'btn btn-primary nav-cta';
            dashBtn.id = 'nav-dashboard';
            dashBtn.textContent = `Hei, ${userName}`;
            dashBtn.style.padding = '8px 16px';
            
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-outline nav-cta';
            logoutBtn.textContent = 'Kirjaudu ulos';
            logoutBtn.style.padding = '8px 16px';
            logoutBtn.style.marginLeft = '10px';
            logoutBtn.onclick = logoutUser;
            
            navLinks.appendChild(dashBtn);
            navLinks.appendChild(logoutBtn);
        }
    }
}
