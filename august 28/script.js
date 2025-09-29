document.querySelectorAll('.carousel-container').forEach(container => {
    const track = container.querySelector('.carousel-track');
    const prevBtn = container.querySelector('.prev');
    const nextBtn = container.querySelector('.next');
    const slides = Array.from(track.children);
    let index = 0;

    function updateCarousel() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        updateCarousel();
    });
});
// Lightbox for Gallery 2
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');

document.querySelectorAll('#gallery2 img').forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
    }
});
