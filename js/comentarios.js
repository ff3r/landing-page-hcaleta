document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.review-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const ratingRows = document.querySelectorAll('.rating-row');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let visibleCount = 5;

    // 1. CALCULAR ESTRELLAS Y PORCENTAJES AUTOMÁTICOS
    const total = cards.length;
    document.querySelector('.rating-score h3').innerText = "4.6";
    document.querySelector('.rating-score p').innerText = `Basado en ${total} opiniones`;

    for (let i = 5; i >= 1; i--) {
        const count = document.querySelectorAll(`.review-card[data-estrellas="${i}"]`).length;
        const porc = total > 0 ? Math.round((count / total) * 100) : 0;
        const barra = document.querySelector(`.rating-row[data-num="${i}"] .fill`);
        const texto = document.querySelector(`.rating-row[data-num="${i}"] .percent`);
        if(barra) barra.style.width = `${porc}%`;
        if(texto) texto.innerText = `${porc}%`;
    }

    // 2. LÓGICA DE FILTRADO (ÁREA Y ESTRELLAS)
    function filtrar(cat = 'Todos', est = null) {
        let mostrar = 0;
        cards.forEach(card => {
            const matchCat = (cat === 'Todos' || card.dataset.categoria === cat);
            const matchEst = (est === null || card.dataset.estrellas === est);

            if (matchCat && matchEst) {
                mostrar++;
                card.style.display = (cat === 'Todos' && est === null && mostrar > visibleCount) ? 'none' : 'block';
            } else {
                card.style.display = 'none';
            }
        });
        if(loadMoreBtn) loadMoreBtn.style.display = (cat === 'Todos' && est === null && mostrar > visibleCount) ? 'block' : 'none';
    }

    // Clicks en botones de área
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtrar(btn.innerText, null);
        });
    });

    // Clicks en barras de estrellas
    ratingRows.forEach(row => {
        row.addEventListener('click', () => {
            filtrar('Todos', row.getAttribute('data-num'));
        });
    });

    // Cargar más
    if(loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 5;
            filtrar();
        });
    }

    filtrar();
});