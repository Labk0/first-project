document.addEventListener('DOMContentLoaded', e => {
    // Numara alanları
    const numbInputs = document.querySelectorAll('#tc_no, #ortak_id');
    if (numbInputs) {
        numbInputs.forEach(function(input) {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
            });
        });
    }

    // Ad ve Soyad alanları için
    const nameInputs = document.querySelectorAll('#first_name, #last_name, #name');
    if (nameInputs) {
        nameInputs.forEach(function(input) {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '');
            });
        });
    }
})