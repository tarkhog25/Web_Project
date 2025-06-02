document.addEventListener('DOMContentLoaded', function () {
    const brandSelect = document.getElementById('brand-select');
    const brandName = document.getElementById('brand-name');
    const brandDescription = document.getElementById('brand-description');
    const carsGallery = document.querySelector('.cars-gallery');
    const brandStars = document.querySelectorAll('#brand-stars .fa-star');
    const brandRatingText = document.getElementById('brand-rating-text');
    const brandComment = document.getElementById('brand-comment');
    const submitBrandFeedback = document.getElementById('submit-brand-feedback');
    const brandFeedbackMessage = document.getElementById('brand-feedback-message');

    const modal = document.getElementById('car-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalCarName = document.getElementById('modal-car-name');
    const carStars = document.querySelectorAll('#car-stars .fa-star');
    const carRatingText = document.getElementById('car-rating-text');
    const carComment = document.getElementById('car-comment');
    const submitCarFeedback = document.getElementById('submit-car-feedback');
    const carFeedbackMessage = document.getElementById('car-feedback-message');
    const carFeedbacks = document.getElementById('car-feedbacks');

    let brandsData = {};
    let currentBrand = 'nissan';
    let currentCar = null;
    let brandRating = 0;
    let carRating = 0;

    function setupStars(stars, ratingText, isBrand = true) {
        stars.forEach(star => {
            star.addEventListener('click', function () {
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

            star.addEventListener('mouseover', function () {
                const rating = parseInt(this.getAttribute('data-rating'));
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.add('fas');
                        s.classList.remove('far');
                    }
                });
            });

            star.addEventListener('mouseout', function () {
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

    setupStars(brandStars, brandRatingText);
    setupStars(carStars, carRatingText, false);

    function loadBrand(brandId) {
        currentBrand = brandId;
        const brand = brandsData[brandId] || brandsData['nissan'];

        brandName.textContent = brand.name;
        brandDescription.textContent = brand.description;

        brandRating = 0;
        brandComment.value = '';
        brandFeedbackMessage.textContent = '';
        brandRatingText.textContent = 'Rate this brand';
        brandStars.forEach(star => {
            star.classList.add('far');
            star.classList.remove('fas', 'active');
        });

        const existingFeedback = document.querySelector('.latest-feedback');
        if (existingFeedback) existingFeedback.remove();

        // Charger feedback marque depuis localStorage
        const savedBrandFeedback = JSON.parse(localStorage.getItem(`feedback-brand-${currentBrand}`));
        if (savedBrandFeedback) {
            const latestFeedbackHTML = `
                <h4>Your Feedback</h4>
                <div class="feedback-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(savedBrandFeedback.rating)}
                    ${'<i class="far fa-star"></i>'.repeat(5 - savedBrandFeedback.rating)}
                </div>
                <p class="feedback-text">${savedBrandFeedback.comment || 'No comment provided'}</p>
                <div class="feedback-date">Submitted on ${savedBrandFeedback.date}</div>
            `;
            const latestFeedbackContainer = document.createElement('div');
            latestFeedbackContainer.className = 'latest-feedback';
            latestFeedbackContainer.innerHTML = latestFeedbackHTML;
            brandDescription.insertAdjacentElement('afterend', latestFeedbackContainer);
        }

        carsGallery.innerHTML = '';
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

        document.querySelectorAll('.rate-model-btn').forEach(btn => {
            btn.addEventListener('click', function () {
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

                const savedCarFeedback = JSON.parse(localStorage.getItem(`feedback-car-${currentBrand}-${currentCar}`));
                if (savedCarFeedback) {
                    const feedbackItem = document.createElement('div');
                    feedbackItem.className = 'feedback-item';
                    feedbackItem.innerHTML = `
                        <div class="feedback-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(savedCarFeedback.rating)}
                            ${'<i class="far fa-star"></i>'.repeat(5 - savedCarFeedback.rating)}
                        </div>
                        <p class="feedback-text">${savedCarFeedback.comment}</p>
                        <div class="feedback-date">Submitted on ${savedCarFeedback.date}</div>
                    `;
                    carFeedbacks.appendChild(feedbackItem);
                }

                modal.style.display = 'block';
            });
        });
    }

    closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', event => {
        if (event.target === modal) modal.style.display = 'none';
    });

    submitBrandFeedback.addEventListener('click', function () {
        if (brandRating === 0) {
            brandFeedbackMessage.textContent = 'Please select a rating';
            brandFeedbackMessage.style.color = '#f44336';
            return;
        }

        const feedback = {
            rating: brandRating,
            comment: brandComment.value,
            date: new Date().toLocaleDateString()
        };

        localStorage.setItem(`feedback-brand-${currentBrand}`, JSON.stringify(feedback));

        const latestFeedbackHTML = `
            <h4>Your Feedback</h4>
            <div class="feedback-rating">
                ${'<i class="fas fa-star"></i>'.repeat(feedback.rating)}
                ${'<i class="far fa-star"></i>'.repeat(5 - feedback.rating)}
            </div>
            <p class="feedback-text">${feedback.comment || 'No comment provided'}</p>
            <div class="feedback-date">Submitted on ${feedback.date}</div>
        `;

        const latestFeedbackContainer = document.createElement('div');
        latestFeedbackContainer.className = 'latest-feedback';
        latestFeedbackContainer.innerHTML = latestFeedbackHTML;

        const existingFeedback = document.querySelector('.latest-feedback');
        if (existingFeedback) existingFeedback.remove();

        brandDescription.insertAdjacentElement('afterend', latestFeedbackContainer);

        brandFeedbackMessage.textContent = 'Thank you for your feedback!';
        brandFeedbackMessage.style.color = '#4CAF50';

        setTimeout(() => brandFeedbackMessage.textContent = '', 3000);
    });

    submitCarFeedback.addEventListener('click', function () {
        if (carRating === 0) {
            carFeedbackMessage.textContent = 'Please select a rating';
            carFeedbackMessage.style.color = '#f44336';
            return;
        }

        const feedback = {
            rating: carRating,
            comment: carComment.value || 'No comment provided',
            date: new Date().toLocaleDateString()
        };

        localStorage.setItem(`feedback-car-${currentBrand}-${currentCar}`, JSON.stringify(feedback));

        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <div class="feedback-rating">
                ${'<i class="fas fa-star"></i>'.repeat(feedback.rating)}
                ${'<i class="far fa-star"></i>'.repeat(5 - feedback.rating)}
            </div>
            <p class="feedback-text">${feedback.comment}</p>
            <div class="feedback-date">Submitted on ${feedback.date}</div>
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

        setTimeout(() => carFeedbackMessage.textContent = '', 3000);
    });

    fetch('../JSON/brandsData.json')
        .then(response => response.json())
        .then(data => {
            brandsData = data;
            loadBrand('nissan');

            brandSelect.addEventListener('change', function () {
                loadBrand(this.value);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier JSON :', error);
        });
});
