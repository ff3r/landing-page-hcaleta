/* ==========================================
   LÓGICA ESPECÍFICA: PÁGINA DE COMENTARIOS
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Quitar clase active de todos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Poner clase active al clicado
            button.classList.add('active');
        });
    });
});