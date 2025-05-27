document.addEventListener('DOMContentLoaded', function () {
    const brandSelect = document.getElementById('brand-select');
    const brandName = document.getElementById('brand-name');
    const brandDescription = document.getElementById('brand-description');
    const carsGallery = document.querySelector('.cars-gallery');

    let brandsData = {};

    // Fonction pour charger une marque
    function loadBrand(brandId) {
        const brand = brandsData[brandId] || brandsData['nissan']; // Fallback sur Nissan

        brandName.textContent = brand.name;
        brandDescription.textContent = brand.description;

        // Vider la galerie
        carsGallery.innerHTML = '';

        // Ajouter les voitures
        brand.cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.innerHTML = `
                <img src="${car.image}" alt="${car.name}" class="car-image">
                <div class="car-name">${car.name}</div>
            `;
            carsGallery.appendChild(carCard);
        });
    }

    // Charger le JSON externe
    fetch('../JSON/brandsData.json')
        .then(response => response.json())
        .then(data => {
            brandsData = data;

            // Charger la marque par défaut
            loadBrand('nissan');

            // Écouter les changements de sélection
            brandSelect.addEventListener('change', function () {
                loadBrand(this.value);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier JSON :', error);
        });
});
