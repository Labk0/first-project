document.addEventListener('DOMContentLoaded', function() {
    // Desktop Menü Dropdownları
    const basvurButton = document.getElementById('basvur-button');
    const basvurDropdown = document.getElementById('basvur-dropdown');
    const girisButton = document.getElementById('giris-button');
    const girisDropdown = document.getElementById('giris-dropdown');

    // Mobil Menü Dropdownları
    const mobileBasvurButton = document.getElementById('mobile-basvur-button');
    const mobileBasvurDropdown = document.getElementById('mobile-basvur-dropdown');
    const mobileGirisButton = document.getElementById('mobile-giris-button');
    const mobileGirisDropdown = document.getElementById('mobile-giris-dropdown');

    // Dropdown açma/kapama fonksiyonu
    function toggleDropdown(button, dropdown) {
        dropdown.classList.toggle('hidden');
        // Diğer dropdown'ları kapat
        if (dropdown === basvurDropdown && !girisDropdown.classList.contains('hidden')) {
            girisDropdown.classList.add('hidden');
        } else if (dropdown === girisDropdown && !basvurDropdown.classList.contains('hidden')) {
            basvurDropdown.classList.add('hidden');
        } else if (dropdown === mobileBasvurDropdown && !mobileGirisDropdown.classList.contains('hidden')) {
            mobileGirisDropdown.classList.add('hidden');
        } else if (dropdown === mobileGirisDropdown && !mobileBasvurDropdown.classList.contains('hidden')) {
            mobileBasvurDropdown.classList.add('hidden');
        }
    }

    // Dropdown buton olay dinleyicileri
    basvurButton.addEventListener('click', function() {
        toggleDropdown(this, basvurDropdown);
    });

    girisButton.addEventListener('click', function() {
        toggleDropdown(this, girisDropdown);
    });

    mobileBasvurButton.addEventListener('click', function() {
        toggleDropdown(this, mobileBasvurDropdown);
    });

    mobileGirisButton.addEventListener('click', function() {
        toggleDropdown(this, mobileGirisDropdown);
    });


    // Mobil menü açma/kapama
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
        // Mobil menü açıldığında tüm mobil dropdownları kapat
        mobileBasvurDropdown.classList.add('hidden');
        mobileGirisDropdown.classList.add('hidden');
    });

    // Tıklama dışı kapatma
    document.addEventListener('click', function(event) {
        // Masaüstü dropdownlar için
        if (!basvurButton.contains(event.target) && !basvurDropdown.contains(event.target)) {
            basvurDropdown.classList.add('hidden');
        }
        if (!girisButton.contains(event.target) && !girisDropdown.contains(event.target)) {
            girisDropdown.classList.add('hidden');
        }

        // Mobil dropdownlar için (eğer mobil menü açıksa ve mobil menü butonu dışındaysa)
        if (mobileMenu.classList.contains('hidden')) { // Sadece mobil menü kapalıyken dikkate al
            if (!mobileBasvurButton.contains(event.target) && !mobileBasvurDropdown.contains(event.target)) {
                mobileBasvurDropdown.classList.add('hidden');
            }
            if (!mobileGirisButton.contains(event.target) && !mobileGirisDropdown.contains(event.target)) {
                mobileGirisDropdown.classList.add('hidden');
            }
        } else { // Mobil menü açıkken, menü butonuna tıklanma dışındaki kapanma
            if (!mobileBasvurButton.contains(event.target) && !mobileBasvurDropdown.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                mobileBasvurDropdown.classList.add('hidden');
            }
            if (!mobileGirisButton.contains(event.target) && !mobileGirisDropdown.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                mobileGirisDropdown.classList.add('hidden');
            }
        }


    });
});