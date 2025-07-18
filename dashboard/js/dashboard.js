document.addEventListener('DOMContentLoaded', function () {
    // --- GEREKLİ ELEMENTLER ---
    const mainContent = document.getElementById('main-content');
    const navItems = document.querySelectorAll('.nav-item');
    const contentLinks = document.querySelectorAll('.load-content-btn');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // --- AKTİF VE PASİF STİL CLASS'LARI ---
    const activeClasses = ['bg-gradient-to-r', 'from-violet-500', 'to-purple-600', 'text-white', 'shadow-lg'];
    const inactiveClasses = ['text-slate-700', 'hover:bg-slate-100/80', 'hover:text-slate-900'];

    // --- FONKSİYONLAR ---

    function handleNavClick(event) {
        navItems.forEach(item => {
            item.classList.remove(...activeClasses);
            if (!item.id || item.id !== 'create-menu-button') { // Oluştur butonu özel durum
                item.classList.add(...inactiveClasses);
            }
        });
        const clickedItem = event.currentTarget;
        clickedItem.classList.remove(...inactiveClasses);
        clickedItem.classList.add(...activeClasses);
    }

    async function loadContent(path) {
        if (!mainContent) { console.error('Hata: "main-content" ID\'li alan bulunamadı.'); return; }
        mainContent.innerHTML = `<div class="text-center p-10 text-slate-500">Yükleniyor...</div>`;
        try {
            const response = await fetch(path);
            if (!response.ok) { throw new Error(`Dosya bulunamadı: ${response.statusText}`); }
            const htmlContent = await response.text();
            mainContent.innerHTML = htmlContent;

            const citySelect = document.getElementById('city');
            if (citySelect && window.TomSelect) {
                new TomSelect(citySelect, { create: false, sortField: { field: "text", direction: "asc" } });
            }
            const phoneInput = document.getElementById('phone');
            if (phoneInput) {
                const phoneMask = IMask(phoneInput, {
                    mask: '(000) 000 00 00' // 10 haneli numara için maske
                });
            }
        } catch (error) {
            console.error('İçerik yüklenirken hata oluştu:', error);
            mainContent.innerHTML = `<div class="text-center p-10 text-red-500">İçerik yüklenirken bir sorun oluştu. Lütfen dosya yolunu kontrol edin.</div>`;
        }
    }

    // --- OLAY DİNLEYİCİLERİ ---

    // Ana Menü Elemanları
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // "Oluştur" butonuna tıklandığında menü aç/kapa, diğerlerine tıklandığında aktif stili yönet
            if(e.currentTarget.id === 'create-menu-button') {
                const createSubmenu = document.getElementById('create-submenu');
                const chevronIcon = document.getElementById('chevron-icon');
                const isHidden = createSubmenu.style.maxHeight === '0px' || !createSubmenu.style.maxHeight;
                if (isHidden) {
                    createSubmenu.style.maxHeight = createSubmenu.scrollHeight + "px";
                    createSubmenu.classList.remove('opacity-0');
                    chevronIcon.classList.add('rotate-180');
                } else {
                    createSubmenu.style.maxHeight = '0px';
                    createSubmenu.classList.add('opacity-0');
                    chevronIcon.classList.remove('rotate-180');
                }
            }
            handleNavClick(e);
        });
    });

    // İçerik Yükleme Linkleri
    contentLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const pagePath = "/dashboard" + this.dataset.page;
            if (pagePath) loadContent(pagePath);
        });
    });

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
            await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
                credentials: 'include'
            });

            const xsrfToken = getCookie('XSRF-TOKEN');
            if (!xsrfToken) {
                throw new Error('CSRF token cookie bulunamadı. Lütfen tekrar giriş yapmayı deneyin.');
            }

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            if (data.country_code && data.phone) {
                // 1. Ülke kodunu al (Örn: "+90")
                const countryCode = data.country_code;

                // 2. Telefondaki tüm harf dışı karakterleri (boşluk, parantez vb.) temizle
                // Sadece rakamlar kalır (Örn: "5321234567")
                const purePhoneNumber = data.phone.replace(/\D/g, '');

                // 3. Senin istediğin özel "xxx-xx-xxxx" formatına göre numarayı dilimle
                const part1 = purePhoneNumber.slice(0, 3); // ilk 3 hane (Örn: "532")
                const part2 = purePhoneNumber.slice(3, 5); // sonraki 2 hane (Örn: "12")
                const part3 = purePhoneNumber.slice(5, 9); // son 4 hane (Örn: "4567")

                // 4. Tüm parçaları istenen formatta birleştir
                const formattedPhone = `${countryCode}-${part1}-${part2}-${part3}`; // Örn: "+90-532-12-4567"

                // 5. Orijinal data objesini, sadece bu yeni formatlanmış telefon numarasını içerecek şekilde güncelle
                data.phone = formattedPhone;
                delete data.country_code; // Artık buna ihtiyacımız yok
            }

            let apiUrl = '';

            if (form.id === 'create-partner-form') {
                apiUrl = API_BASE_URL + '/api/partners';
            } else if (form.id === 'create-ortak-form') {
                apiUrl = API_BASE_URL + '/api/ortaks';
            }

            if (!apiUrl) return;

            const response = await fetch(apiUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // CSRF token'ını da göndermek gerekebilir, Sanctum'da session ile bu otomatik olabilir.
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken)
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Kayıt başarıyla oluşturuldu!');
                form.reset();
            } else if (response.status === 422) {
                // Laravel'den gelen Validation (Doğrulama) hatası
                const errorData = await response.json();
                let errorMessages = errorData.message + "\n\n";
                for (const field in errorData.errors) {
                    errorMessages += `- ${errorData.errors[field].join("\n- ")}\n`;
                }
                alert(errorMessages);
            } else {
                throw new Error('Sunucu hatası: ' + response.statusText);
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