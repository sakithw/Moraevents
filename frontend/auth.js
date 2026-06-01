function toggleAuth() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
}

async function handleAuth(event, mode) {
    event.preventDefault();

    const email = document.getElementById(mode === 'register' ? 'reg-email' : 'login-email').value;
    const password = document.getElementById(mode === 'register' ? 'reg-pass' : 'login-pass').value;
    
    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const payload = { email, password };
    
    if (mode === 'register') {
        payload.name = document.getElementById('reg-name').value;
    }

    try {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userRole', data.user.role);
            
            alert(data.message);
            window.location.href = "index.html";
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Could not connect to the server.");
    }
}