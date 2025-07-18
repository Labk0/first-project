const giris_form = document.querySelector("#partner_giris");
const API_URL = "http://localhost:8000";

// Tarayıcıdaki cookie'lerden belirli birini okumak için yardımcı fonksiyon
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

giris_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const loginButton = event.submitter;

    loginButton.disabled = true;
    loginButton.textContent = 'Giriş Yapılıyor...';

    try {
        // --- 1. ADIM: CSRF Cookie'sini Al ---
        await fetch(`${API_URL}/sanctum/csrf-cookie`, {
            credentials: 'include',
        });

        // --- 2. ADIM: Cookie'yi Oku ve İsteğe Manuel Ekle ---

        // XSRF-TOKEN cookie'sinin değerini oku
        const xsrfToken = getCookie('XSRF-TOKEN');

        const response = await fetch(`${API_URL}/api/partners/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // TOKEN'I MANUEL OLARAK HEADERS'A EKLE
                'X-XSRF-TOKEN': decodeURIComponent(xsrfToken)
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Giriş başarılı! Hoş geldin ${data.name}.`);
            localStorage.setItem('loggedInUser', JSON.stringify(data));
            window.location.href = '/';
        } else {
            alert(data.message || 'E-posta veya şifre hatalı!');
        }

    } catch (error) {
        console.error('Giriş yapılırken bir hata oluştu:', error);
        alert('Sunucuya bağlanırken bir sorun oluştu.');
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Giriş Yap';
    }
});