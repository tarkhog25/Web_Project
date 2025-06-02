document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des valeurs du formulaire
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Feedback visuel
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent';
            submitBtn.style.backgroundColor = '#4CAF50';
            
            // Réinitialisation après 3 secondes
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = 'Send <i class="fas fa-paper-plane"></i>';
                submitBtn.style.backgroundColor = '#26e0e6';
            }, 3000);
        });
    }
});