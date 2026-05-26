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


let selectedStars = 0;

const stars = document.querySelectorAll(".star-input");
const reviewForm = document.getElementById("reviewForm");
const reviewsContainer = document.querySelector(".reviews-container");


/* =========================
   SELECCIONAR ESTRELLAS
========================= */

stars.forEach(star => {

    star.addEventListener("click", () => {

        selectedStars = parseInt(star.dataset.value);

        stars.forEach(s => {

            s.classList.remove("active");
            s.classList.replace("fas", "far");

        });

        for(let i = 0; i < selectedStars; i++){

            stars[i].classList.add("active");
            stars[i].classList.replace("far", "fas");

        }

    });

});


/* =========================
   ENVIAR COMENTARIO
========================= */

reviewForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const nombre =
        document.getElementById("reviewName").value;

    const categoria =
        document.getElementById("reviewCategory").value;

    const comentario =
        document.getElementById("reviewText").value;


    if(selectedStars === 0){

        alert("Selecciona una puntuación");
        return;

    }


    /* =========================
       CREAR ESTRELLAS HTML
    ========================= */

    let estrellasHTML = "";

    for(let i = 0; i < 5; i++){

        if(i < selectedStars){

            estrellasHTML +=
                `<i class="fas fa-star"></i>`;

        }else{

            estrellasHTML +=
                `<i class="far fa-star"></i>`;

        }

    }


    /* =========================
       FECHA ACTUAL
    ========================= */

    const fecha = new Date();

    const fechaTexto =
        fecha.toLocaleDateString("es-PE");


    /* =========================
       NUEVO COMENTARIO
    ========================= */

    const nuevoComentario = document.createElement("div");

    nuevoComentario.classList.add("review-card");

    nuevoComentario.setAttribute(
        "data-categoria",
        categoria
    );

    nuevoComentario.setAttribute(
        "data-estrellas",
        selectedStars
    );

    nuevoComentario.innerHTML = `

        <div class="review-stars">
            ${estrellasHTML}
        </div>

        <p>"${comentario}"</p>

        <div class="review-footer">
            <strong>
                <i class="fas fa-user-circle"></i>
                ${nombre}
            </strong>

            <span>
                ${categoria} • ${fechaTexto}
            </span>
        </div>

    `;


    /* =========================
       AGREGAR ARRIBA
    ========================= */

    reviewsContainer.prepend(nuevoComentario);


    /* =========================
       GUARDAR EN LOCALSTORAGE
    ========================= */

    const comentarioGuardado = {
        nombre,
        categoria,
        categoriaKey: categoria
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
        comentario,
        estrellas: selectedStars,
        fecha: fechaTexto
    };
        let comentarios = JSON.parse(
        localStorage.getItem("comentariosHospital")
    ) || [];

    comentarios.unshift(comentarioGuardado);

    localStorage.setItem(
        "comentariosHospital",
        JSON.stringify(comentarios)
    );


    /* =========================
    ACTUALIZAR CONTADOR
    ========================= */

    const totalOpiniones =
        document.querySelectorAll(".review-card").length;

    document.querySelector(
        ".rating-score p"
    ).textContent =
        `Basado en ${totalOpiniones} opiniones`;



    /* =========================
       RESETEAR FORMULARIO
    ========================= */

    reviewForm.reset();

    selectedStars = 0;

    stars.forEach(s => {

        s.classList.remove("active");
        s.classList.replace("fas", "far");

    });


    /* =========================
       ACTUALIZAR ESTADISTICAS
    ========================= */

    actualizarResumen();


    /* =========================
    RECARGAR GRAFICAS
    ========================= */

    location.reload();

});