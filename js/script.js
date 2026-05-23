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