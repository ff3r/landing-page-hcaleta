document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.review-card');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let visibleCount = 5; // Cantidad de comentarios iniciales

    // Función para mostrar/ocultar según filtro y límite
    function updateDisplay(categoria = 'Todos') {
        let count = 0;
        cards.forEach((card, index) => {
            const matchesCategory = (categoria === 'Todos' || card.dataset.categoria === categoria);

            if (matchesCategory) {
                count++;
                // Si es un filtro, mostrar todos. Si es 'Todos', respetar el límite
                if (categoria !== 'Todos' || count <= visibleCount) {
                    card.classList.remove('hidden');
                    card.style.display = 'block';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            } else {
                card.style.display = 'none';
            }
        });
        // Ocultar botón si no hay más que mostrar
        loadMoreBtn.style.display = (count > visibleCount && categoria === 'Todos') ? 'block' : 'none';
    }

    // Inicializar
    updateDisplay();

    // Evento Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateDisplay(btn.innerText);
        });
    });

    // Evento Cargar más
    loadMoreBtn.addEventListener('click', () => {
        visibleCount += 5;
        updateDisplay('Todos');
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.review-card');
    const totalOpiniones = cards.length;

    // 1. Actualizar el contador total
    document.querySelector('.rating-score p').innerText = `Basado en ${totalOpiniones} opiniones`;

    // 2. Calcular porcentajes y actualizar barras
    for (let i = 5; i >= 1; i--) {
        const count = document.querySelectorAll(`.review-card[data-estrellas="${i}"]`).length;
        const porcentaje = totalOpiniones > 0 ? Math.round((count / totalOpiniones) * 100) : 0;

        // Actualizar barra y texto
        const barra = document.querySelector(`.rating-row[data-num="${i}"] .fill`);
        const texto = document.querySelector(`.rating-row[data-num="${i}"] .percent`);
        if(barra) barra.style.width = `${porcentaje}%`;
        if(texto) texto.innerText = `${porcentaje}%`;
    }

    // 3. Filtrar por estrellas al hacer clic en la fila
    document.querySelectorAll('.rating-row').forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
            const estrellasClick = row.getAttribute('data-num');
            cards.forEach(card => {
                card.style.display = (card.getAttribute('data-estrellas') === estrellasClick) ? 'block' : 'none';
            });
        });
    });
});