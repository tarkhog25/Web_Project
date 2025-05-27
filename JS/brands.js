document.addEventListener('DOMContentLoaded', function () {
    // Éléments DOM
    const brandSelect = document.getElementById('brand-select');
    const brandName = document.getElementById('brand-name');
    const brandDescription = document.getElementById('brand-description');
    const carsGallery = document.querySelector('.cars-gallery');
    const brandStars = document.querySelectorAll('#brand-stars .fa-star');
    const brandRatingText = document.getElementById('brand-rating-text');
    const brandComment = document.getElementById('brand-comment');
    const submitBrandFeedback = document.getElementById('submit-brand-feedback');
    const brandFeedbackMessage = document.getElementById('brand-feedback-message');
    
    // Éléments du modal
    const modal = document.getElementById('car-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalCarName = document.getElementById('modal-car-name');
    const carStars = document.querySelectorAll('#car-stars .fa-star');
    const carRatingText = document.getElementById('car-rating-text');
    const carComment = document.getElementById('car-comment');
    const submitCarFeedback = document.getElementById('submit-car-feedback');
    const carFeedbackMessage = document.getElementById('car-feedback-message');
    const carFeedbacks = document.getElementById('car-feedbacks');
    
    // Données et état
    let brandsData = {};
    let currentBrand = 'nissan';
    let currentCar = null;
    let brandRating = 0;
    let carRating = 0;
    
    // Initialisation des étoiles
    function setupStars(stars, ratingText, isBrand = true) {
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                if (isBrand) brandRating = rating;
                else carRating = rating;
                
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.add('fas', 'active');
                        s.classList.remove('far');
                    } else {
                        s.classList.add('far');
                        s.classList.remove('fas', 'active');
                    }
                });
                
                ratingText.textContent = `Your rating: ${rating}/5`;
            });
            
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.add('fas');
                        s.classList.remove('far');
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                const currentRating = isBrand ? brandRating : carRating;
                stars.forEach((s, i) => {
                    if (i >= currentRating) {
                        s.classList.add('far');
                        s.classList.remove('fas');
                    }
                });
            });
        });
    }
    
    // Initialiser les étoiles pour la marque
    setupStars(brandStars, brandRatingText);
    
    // Fonction pour charger une marque
    function loadBrand(brandId) {
        currentBrand = brandId;
        const brand = brandsData[brandId] || brandsData['nissan'];
        
        brandName.textContent = brand.name;
        brandDescription.textContent = brand.description;
        
        // Réinitialiser le formulaire et supprimer le feedback précédent
        brandRating = 0;
        brandComment.value = '';
        brandFeedbackMessage.textContent = '';
        brandRatingText.textContent = 'Rate this brand';
        brandStars.forEach(star => {
            star.classList.add('far');
            star.classList.remove('fas', 'active');
        });
        
        // Supprimer l'ancien feedback s'il existe
        const existingFeedback = document.querySelector('.latest-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Vider la galerie
        carsGallery.innerHTML = '';
        
        // Ajouter les voitures
        brand.cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.innerHTML = `
                <img src="${car.image}" alt="${car.name}" class="car-image">
                <div class="car-card-footer">
                    <div class="car-name">${car.name}</div>
                    <button class="rate-model-btn" data-car="${car.name}">Rate this model</button>
                </div>
            `;
            carsGallery.appendChild(carCard);
        });
        
        // Ajouter les écouteurs d'événements pour les boutons de notation
        document.querySelectorAll('.rate-model-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                currentCar = this.getAttribute('data-car');
                modalCarName.textContent = currentCar;
                carRating = 0;
                carComment.value = '';
                carFeedbackMessage.textContent = '';
                carRatingText.textContent = 'Rate this model';
                carStars.forEach(star => {
                    star.classList.add('far');
                    star.classList.remove('fas', 'active');
                });
                carFeedbacks.innerHTML = '<h4>Community Feedback</h4>';
                modal.style.display = 'block';
            });
        });
    }
    
    // Gestion du modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Initialiser les étoiles pour les voitures
    setupStars(carStars, carRatingText, false);
    
    // Soumission des commentaires pour la marque
    submitBrandFeedback.addEventListener('click', function() {
        if (brandRating === 0) {
            brandFeedbackMessage.textContent = 'Please select a rating';
            brandFeedbackMessage.style.color = '#f44336';
            return;
        }
        
        // Créer l'objet feedback
        const feedback = {
            rating: brandRating,
            comment: brandComment.value,
            date: new Date().toLocaleDateString()
        };
        
        // Créer le HTML du feedback
        const latestFeedbackHTML = `
            <h4>Your Feedback</h4>
            <div class="feedback-rating">
                ${'<i class="fas fa-star"></i>'.repeat(feedback.rating)}
                ${'<i class="far fa-star"></i>'.repeat(5 - feedback.rating)}
            </div>
            <p class="feedback-text">${feedback.comment || 'No comment provided'}</p>
            <div class="feedback-date">Submitted on ${feedback.date}</div>
        `;
        
        // Créer le conteneur du feedback
        const latestFeedbackContainer = document.createElement('div');
        latestFeedbackContainer.className = 'latest-feedback';
        latestFeedbackContainer.innerHTML = latestFeedbackHTML;
        
        // Supprimer l'ancien feedback s'il existe
        const existingFeedback = document.querySelector('.latest-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Ajouter le nouveau feedback après la description
        brandDescription.insertAdjacentElement('afterend', latestFeedbackContainer);
        
        brandFeedbackMessage.textContent = 'Thank you for your feedback!';
        brandFeedbackMessage.style.color = '#4CAF50';
        
        // Réinitialiser après 3 secondes
        setTimeout(() => {
            brandFeedbackMessage.textContent = '';
        }, 3000);
    });
    
    // Soumission des commentaires pour les voitures
    submitCarFeedback.addEventListener('click', function() {
        if (carRating === 0) {
            carFeedbackMessage.textContent = 'Please select a rating';
            carFeedbackMessage.style.color = '#f44336';
            return;
        }
        
        // Ajouter le feedback à la liste
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <div class="feedback-rating">
                ${'<i class="fas fa-star"></i>'.repeat(carRating)}
                ${'<i class="far fa-star"></i>'.repeat(5 - carRating)}
            </div>
            <p class="feedback-text">${carComment.value}</p>
        `;
        carFeedbacks.appendChild(feedbackItem);
        
        carFeedbackMessage.textContent = 'Thank you for your feedback!';
        carFeedbackMessage.style.color = '#4CAF50';
        carComment.value = '';
        carRating = 0;
        carStars.forEach(star => {
            star.classList.add('far');
            star.classList.remove('fas', 'active');
        });
        carRatingText.textContent = 'Rate this model';
        
        // Réinitialiser après 3 secondes
        setTimeout(() => {
            carFeedbackMessage.textContent = '';
        }, 3000);
    });
    
    // Charger le JSON externe
    fetch('../JSON/brandsData.json')
        .then(response => response.json())
        .then(data => {
            brandsData = data;
            loadBrand('nissan');
            
            // Écouter les changements de sélection
            brandSelect.addEventListener('change', function() {
                loadBrand(this.value);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier JSON :', error);
        });
});