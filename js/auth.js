const TOKEN_KEY = 'boyan_auth_token';
const USER_KEY = 'boyan_auth_user';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
    return localStorage.getItem(USER_KEY);
}

export function isLoggedIn() {
    return !!getToken();
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

function saveAuth(token, username) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, username);
}

export async function login(username, password) {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    saveAuth(data.token, data.username);
    return data;
}

export async function register(username, password) {
    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    saveAuth(data.token, data.username);
    return data;
}

export async function submitScore(songId, difficulty, score, maxCombo) {
    const token = getToken();
    if (!token) return null;
    try {
        const res = await fetch('/api/submit-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ songId, difficulty, score, maxCombo }),
        });
        const data = await res.json();
        if (!res.ok) {
            if (res.status === 401) logout();
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

export async function fetchLeaderboard(songId, difficulty) {
    try {
        const res = await fetch(`/api/leaderboard?songId=${songId}&difficulty=${difficulty}`);
        const data = await res.json();
        if (!res.ok) return [];
        return data.entries || [];
    } catch {
        return [];
    }
}

// --- Auth Modal ---

let onAuthChange = null;

export function setAuthChangeCallback(cb) {
    onAuthChange = cb;
}

export function initAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    const title = document.getElementById('auth-title');
    const usernameInput = document.getElementById('auth-username');
    const passwordInput = document.getElementById('auth-password');
    const submitBtn = document.getElementById('auth-submit');
    const toggleBtn = document.getElementById('auth-toggle');
    const closeBtn = document.getElementById('auth-close');
    const errorEl = document.getElementById('auth-error');

    let isLoginMode = true;

    function setMode(loginMode) {
        isLoginMode = loginMode;
        title.textContent = isLoginMode ? 'LOGIN' : 'REGISTER';
        submitBtn.textContent = isLoginMode ? 'LOGIN' : 'REGISTER';
        toggleBtn.textContent = isLoginMode
            ? 'Need an account? Register'
            : 'Have an account? Login';
        errorEl.textContent = '';
    }

    toggleBtn.onclick = () => setMode(!isLoginMode);
    closeBtn.onclick = () => { modal.style.display = 'none'; };

    submitBtn.onclick = async () => {
        const u = usernameInput.value.trim();
        const p = passwordInput.value;
        if (!u || !p) { errorEl.textContent = 'Fill in both fields'; return; }
        submitBtn.disabled = true;
        errorEl.textContent = '';
        try {
            if (isLoginMode) {
                await login(u, p);
            } else {
                await register(u, p);
            }
            modal.style.display = 'none';
            usernameInput.value = '';
            passwordInput.value = '';
            if (onAuthChange) onAuthChange();
        } catch (e) {
            errorEl.textContent = e.message;
        } finally {
            submitBtn.disabled = false;
        }
    };

    passwordInput.onkeydown = (e) => { if (e.key === 'Enter') submitBtn.click(); };
    usernameInput.onkeydown = (e) => { if (e.key === 'Enter') passwordInput.focus(); };
}

export function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    // Reset to login mode
    document.getElementById('auth-title').textContent = 'LOGIN';
    document.getElementById('auth-submit').textContent = 'LOGIN';
    document.getElementById('auth-toggle').textContent = 'Need an account? Register';
    document.getElementById('auth-error').textContent = '';
    document.getElementById('auth-username').value = '';
    document.getElementById('auth-password').value = '';
    setTimeout(() => document.getElementById('auth-username').focus(), 100);
}
