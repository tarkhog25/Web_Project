document.addEventListener('DOMContentLoaded', function () {
    fetch('../JSON/timelineData.json')
        .then(response => response.json())
        .then(timelineData => {
            const timeline = document.querySelector('.timeline');

            timelineData.forEach((item, index) => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';

                timelineItem.innerHTML = `
                    <div class="timeline-content">
                        <div class="timeline-date">${item.year}</div>
                        <h3 class="timeline-title">${item.title}</h3>
                        <img src="${item.image}" alt="${item.title}" class="timeline-img">
                        <p class="timeline-desc">${item.description}</p>
                    </div>
                `;

                timeline.appendChild(timelineItem);
            });

            // Animation au scroll
            const timelineItems = document.querySelectorAll('.timeline-item');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateX(0)';
                    }
                });
            }, { threshold: 0.1 });

            timelineItems.forEach((item, index) => {
                item.style.opacity = 0;
                item.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;

                item.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';

                observer.observe(item);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier JSON :', error);
        });
});