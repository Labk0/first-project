document.addEventListener('DOMContentLoaded', function () {
    // --- GEREKLİ ELEMENTLER ---

    const mainContent = document.getElementById('main-content');

    // --- FONKSİYONLAR ---

    try {
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            const phoneMask = IMask(phoneInput, {
                mask: '(000) 000 00 00' // 10 haneli numara için maske
            });
        }
    } catch (error) {
        console.error('Telefon maskesi yüklenirken hata oluştu:', error);
    }

    const API_BASE_URL = 'http://localhost:8000';

    // FORM GÖNDERME YÖNETİMİ (EVENT DELEGATION)
    mainContent.addEventListener('submit', async function(event) {
        event.preventDefault();
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        // Butonu devre dışı bırak ve kullanıcıya geri bildirim ver
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gönderiliyor...
        `;
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            if (data.country_code && data.phone) {
                // 1. Ülke kodunu al (Örn: "+90")
                const countryCode = data.country_code;

                // 2. Telefondaki tüm harf dışı karakterleri (boşluk, parantez vb.) temizle
                // Sadece rakamlar kalır (Örn: "5321234567")
                const purePhoneNumber = data.phone.replace(/\D/g, '');

                // 3. Senin istediğin özel "xxx-xxx-xxxx" formatına göre numarayı dilimle
                const part1 = purePhoneNumber.slice(0, 3); // ilk 3 hane
                const part2 = purePhoneNumber.slice(3, 6); // sonraki 3 hane
                const part3 = purePhoneNumber.slice(6, 10); // son 4 hane

                // 5. Orijinal data objesini, sadece bu yeni formatlanmış telefon numarasını içerecek şekilde güncelle
                data.phone = `${countryCode}-${part1}-${part2}-${part3}`;
                delete data.country_code;
            }

            let apiUrl = '';

            if (form.id === 'partner-application-form') {
                apiUrl = API_BASE_URL + '/api/application/partner';
            } else if (form.id === 'ortak-application-form') {
                apiUrl = API_BASE_URL + '/api/application/ortak';
            }

            if (!apiUrl) return;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                let errorMessages = result.message + "\n\n";
                if (result.errors) {
                    for (const field in result.errors) {
                        errorMessages += `- ${result.errors[field].join("\n- ")}\n`;
                    }
                }
                alert(errorMessages);
            } else {
                alert(result.message);
                form.reset();
            }
        } catch (error) {
            console.error('Form gönderim hatası:', error);
            alert('Sunucuya bağlanırken bir hata oluştu.');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
});