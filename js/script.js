document.addEventListener('DOMContentLoaded', () => {
    // ---- LÓGICA DEL SLIDER AUTOMÁTICO ----
    const wrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-control.prev');
    const nextBtn = document.querySelector('.slider-control.next');
    const dots = document.querySelectorAll('.dot');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let interval;

    const showSlide = (index) => {
        wrapper.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    };

    const startInterval = () => { interval = setInterval(nextSlide, 5000); };
    const resetInterval = () => { clearInterval(interval); startInterval(); };

    nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % totalSlides; showSlide(currentIndex); resetInterval(); });
    prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; showSlide(currentIndex); resetInterval(); });
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { currentIndex = i; showSlide(currentIndex); resetInterval(); });
    });

    startInterval();

    // ---- COMPONENTE INTERACTIVO (SIMULACIÓN DE CLIC EN TRÁMITES) ----
    const items = document.querySelectorAll('.link-item');
    items.forEach(item => {
        item.addEventListener('click', function() {
            const tramite = this.querySelector('h4').innerText;
            alert(`Redireccionando de forma segura al módulo de: ${tramite}`);
        });
    });
});

// ==========================================
// CONTROL DEL CARRUSEL DE ENLACES DE INTERÉS
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const track = document.getElementById("interest-track");
    const prevBtn = document.getElementById("interest-prev");
    const nextBtn = document.getElementById("interest-next");
    
    if (track && prevBtn && nextBtn) {
        let index = 0;
        
        // Calcula cuántas veces se puede mover el carrusel basándose en los elementos totales
        function getMaxIndex() {
            const cardsTotal = track.children.length;
            const itemsInView = window.innerWidth <= 600 ? 1 : (window.innerWidth <= 992 ? 2 : 3);
            return Math.max(0, cardsTotal - itemsInView);
        }

        function updateCarousel() {
            const maxIndex = getMaxIndex();
            if (index > maxIndex) index = maxIndex;
            
            const cardWidth = track.children[0].getBoundingClientRect().width;
            const gap = 25; // Debe coincidir con el gap del CSS
            const amountToMove = index * (cardWidth + gap);
            
            track.style.transform = `translateX(-${amountToMove}px)`;
        }

        nextBtn.addEventListener("click", () => {
            if (index < getMaxIndex()) {
                index++;
            } else {
                index = 0; // Regresa al inicio si llega al final
            }
            updateCarousel();
        });

        prevBtn.addEventListener("click", () => {
            if (index > 0) {
                index--;
            } else {
                index = getMaxIndex(); // Va al final si está al principio
            }
            updateCarousel();
        });

        // Recalcular dimensiones si se rota la pantalla o cambia el tamaño
        window.addEventListener("resize", updateCarousel);
    }
});