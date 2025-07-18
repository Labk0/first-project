const API_URL = "http://localhost:8000";

(async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_URL}/api/dashboard/check`, {
            method: 'GET', // Metod GET olmalı
            credentials: 'include', // Session cookie'sini göndermek için zorunlu
            headers: {
                'Accept': 'application/json',
            }
        });

        if (response.ok) {
            const user = await response.json();
            console.log(`Hoş geldin, ${user.name}!`);
            // Buraya dashboard'ı dolduracak kodlar gelecek.
        } else {
            // Eğer sunucu 401 (Unauthorized) veya başka bir hata dönerse,
            // kullanıcıyı login sayfasına yönlendir.
            console.log('Oturum geçerli değil, yönlendiriliyor...');
            window.location.href = '../login'; // Login sayfanızın adı
        }
    } catch (error) {
        console.error('Kimlik kontrolü sırasında hata:', error);
        window.location.href = '../login'; // Hata durumunda da login'e yönlendir
    }
})();