const API_URL = 'http://app.local:3000';

const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showLoading(show) {
    loadingDiv.style.display = show ? 'block' : 'none';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showError('Udfyld venligst alle felter');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_URL}/admin/authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        showLoading(false);

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/dashboard';
        } else {
            let errorMessage = 'Login fejlede';

            if (data.error === 'Couldnt find user') {
                errorMessage = 'Bruger ikke fundet';
            } else if (data.error === 'Invalid password') {
                errorMessage = 'Forkert adgangskode';
            } else if (data.error === 'Insufficient permissions') {
                errorMessage = 'Utilstrækkelige rettigheder';
            } else if (data.error) {
                errorMessage = data.error;
            }

            showError(errorMessage);
        }
    } catch (error) {
        showLoading(false);
        showError('Kunne ikke forbinde til serveren. Tjek din forbindelse.');
        console.error('Login error:', error);
    }
});
