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

// ==========================================
// CHATBOT INTERACTIVO (TRIAJE VIRTUAL)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.getElementById('chat-body');
    const optionButtons = document.querySelectorAll('.option-btn');

    // Nuevas variables para la barra de texto
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-msg-btn');

    // Base de datos de respuestas
    const respuestasBot = {
        horarios: {
            texto: "🕒 <strong>Horarios de Atención:</strong><br>• <strong>Mesa de Partes:</strong> Lun a Vie de 08:00 AM a 15:30 PM.",
            link: null
        },
        sis: {
            texto: "📋 <strong>Requisitos SIS:</strong> Debes presentar tu DNI y no contar con otro seguro.",
            link: null
        },
        citas: {
            texto: "¡Claro! Te estoy redirigiendo a la sección de Consulta de Citas...",
            link: "consulta-cita.html" // Aquí pones el nombre de tu archivo
        },
        emergencia: {
            texto: "🚨 <strong>Emergencias:</strong> Central: (043) 327589.",
            link: null
        },
        cupos: {
            texto: "✅ Disponibilidad de Cupos: Estoy redirigiéndote al sistema donde podrás ver qué especialistas tienen cupos libres hoy.",
            link: "consulta-cupos.html" // Asegúrate de que este sea el nombre de tu archivo
        }

    };

    // 1. Abrir ventana de chat
    if (chatBubble) {
        chatBubble.addEventListener('click', () => {
            chatWindow.classList.remove('id-hidden');

            // CORRECCIÓN: Ocultamos el ícono del chat al abrir la ventana
            chatBubble.style.display = 'none';

            const notification = chatBubble.querySelector('.bubble-notification');
            if (notification) notification.style.display = 'none';
        });
    }

    // 2. Cerrar ventana de chat
    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatWindow.classList.add('id-hidden');

            // CORRECCIÓN: Volvemos a mostrar el ícono del chat al cerrar la ventana
            chatBubble.style.display = 'flex';
        });
    }

    // 3. Manejo del click en los botones de opciones fijas
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            if (!action) return; // Por si es el botón de reinicio

            inyectarMensajeUsuario(this.innerText);
            responderBot(action);
        });
    });

    // 4. Función para procesar y evaluar la PREGUNTA LIBRE por teclado
    function procesarPreguntaLibre() {
        const textoUsuario = chatInput.value.trim().toLowerCase();
        if (textoUsuario === "") return;

        // Mostramos el mensaje original escrito por el usuario
        inyectarMensajeUsuario(chatInput.value);
        chatInput.value = ""; // Limpiar la barra de texto

        // Evaluamos mediante palabras clave qué responder
        let accionDetectada = "desconocido";

        // Palabras clave para Horarios
        if (textoUsuario.includes('hora') || textoUsuario.includes('horario') || 
            textoUsuario.includes('atienden') || textoUsuario.includes('atencion') || 
            textoUsuario.includes('abierto') || textoUsuario.includes('cuando')) {
            accionDetectada = "horarios";

        // Palabras clave para SIS
        } else if (textoUsuario.includes('sis') || textoUsuario.includes('seguro') || 
                textoUsuario.includes('afiliarme') || textoUsuario.includes('gratuito') || 
                textoUsuario.includes('requisitos')) {
            accionDetectada = "sis";

        // Palabras clave para Emergencia
        } else if (textoUsuario.includes('emergencia') || textoUsuario.includes('urgencia') || 
                textoUsuario.includes('telefono') || textoUsuario.includes('numero') || 
                textoUsuario.includes('llamar') || textoUsuario.includes('contacto') || 
                textoUsuario.includes('ayuda')) {
            accionDetectada = "emergencia";

        // Palabras clave para Citas
        } else if (textoUsuario.includes('cita') || textoUsuario.includes('consultar') || 
                textoUsuario.includes('separar') || textoUsuario.includes('programar') || 
                textoUsuario.includes('medico') || textoUsuario.includes('especialidad')) {
            accionDetectada = "citas";
            
        // Palabras clave para Cupos
        } else if (textoUsuario.includes('cupo') || textoUsuario.includes('disponibilidad') || 
                textoUsuario.includes('hay campo') || textoUsuario.includes('ver vacantes')) {
            accionDetectada = "cupos";
        }

        responderBot(accionDetectada);
    }

    // Funciones auxiliares para no duplicar código
    function inyectarMensajeUsuario(texto) {
        const userDiv = document.createElement('div');
        userDiv.className = 'message user-msg';
        userDiv.innerHTML = `<p>${texto}</p>`;
        chatBody.appendChild(userDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Desactivamos el menú de botones iniciales para mantener el flujo limpio
        const initialOptions = document.getElementById('initial-options');
        if (initialOptions) {
            initialOptions.style.pointerEvents = 'none';
            initialOptions.style.opacity = '0.5';
        }
    }

    function responderBot(accion) {
        setTimeout(() => {
            const botDiv = document.createElement('div');
            botDiv.className = 'message bot-msg';

            if (accion !== "desconocido") {
                const data = respuestasBot[accion];
                botDiv.innerHTML = `<p>${data.texto}</p>`;
                chatBody.appendChild(botDiv);

                // SI HAY UN LINK, REDIRIGIMOS
                if (data.link) {
                    setTimeout(() => {
                        window.location.href = data.link; // Redirección automática
                    }, 2000); // Espera 2 segundos para que el usuario lea el mensaje
                }
            } else {
                botDiv.innerHTML = `<p>No entiendo esa consulta. Prueba con "citas", "horarios" o "SIS".</p>`;
                chatBody.appendChild(botDiv);
            }

            // CORREGIDO: Crea el botón "Hacer otra consulta" de forma independiente
            const resetDiv = document.createElement('div');
            resetDiv.className = 'chat-options';
            resetDiv.innerHTML = `<button class="option-btn reset-flow-btn">🔄 Hacer otra consulta</button>`;
            chatBody.appendChild(resetDiv);

            // Asignar el evento para continuar la conversación sin borrar nada
            resetDiv.querySelector('.reset-flow-btn').addEventListener('click', mostrarOpcionesNuevamente);

            chatBody.scrollTop = chatBody.scrollHeight;
        }, 600);
    }

    // Continúa la conversación agregando nuevas opciones abajo
    function mostrarOpcionesNuevamente(e) {
        // 1. Ocultamos el botón de reinicio al que le acabamos de dar clic para que no estorbe
        e.target.parentElement.remove();

        // 2. Creamos un nuevo bloque de opciones interactivas frescas
        const nuevasOpcionesDiv = document.createElement('div');
        nuevasOpcionesDiv.className = 'chat-options';
        nuevasOpcionesDiv.innerHTML = `
            <button class="option-btn" data-action="horarios">🕒 1. Ver Horarios de Atención</button>
            <button class="option-btn" data-action="sis">📋 2. Requisitos para SIS</button>
            <button class="option-btn" data-action="emergencia">🚨 3. Números de Emergencia</button>
            <button class="option-btn" data-action="citas">📅 4. Consultar Cita</button>
            <button class="option-btn" data-action="cupos">🏥 5. Ver Cupos Disponibles
        `;

        // 3. Lo agregamos al final del cuerpo del chat
        chatBody.appendChild(nuevasOpcionesDiv);

        // 4. Le enlazamos la lógica de clics a este nuevo grupo de botones
        const nuevosBotones = nuevasOpcionesDiv.querySelectorAll('.option-btn');
        nuevosBotones.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                if (!action) return;

                inyectarMensajeUsuario(this.innerText);
                responderBot(action);
            });
        });

        // 5. Scroll automático para enfocar los nuevos botones abajo
        chatBody.scrollTop = chatBody.scrollHeight;
        if (chatInput) chatInput.value = ""; // Limpiar el teclado por si acaso
    }

    // 5. Oyentes de eventos para la barra de texto (Click y Tecla Enter)
    if (sendBtn) {
        sendBtn.addEventListener('click', procesarPreguntaLibre);
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') procesarPreguntaLibre();
        });
    }
});

// ==========================================
// LÓGICA DEL MODO OSCURO (DARK MODE)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return; // Si no encuentra el botón, no hace nada

    const icon = themeToggle.querySelector('i');

    // 1. Revisamos si el usuario ya había activado el modo oscuro antes (incluso en otra pestaña)
    if (localStorage.getItem('temaCaleta') === 'oscuro') {
        document.body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    // 2. Acción al dar clic al botón
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Si acabamos de activar el modo oscuro...
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('temaCaleta', 'oscuro'); // Guardamos memoria
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun'); // Cambiamos icono a sol
        }
        // Si acabamos de volver al modo claro...
        else {
            localStorage.setItem('temaCaleta', 'claro'); // Guardamos memoria
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon'); // Cambiamos icono a luna
        }
    });

});

document.addEventListener("DOMContentLoaded", function() {
    const slider = document.getElementById('comunicado-slider');
    const images = document.querySelectorAll('.comunicado-img');
    let currentIndex = 0;

    function slideComunicados() {
        currentIndex++;
        
        // Si llega al final, reiniciamos
        if (currentIndex >= images.length) {
            currentIndex = 0;
            slider.style.transition = 'none'; // Sin animación para el salto al inicio
            slider.style.transform = 'translateX(0%)';
        } else {
            slider.style.transition = 'transform 0.8s ease-in-out';
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }

    // Intervalo de 4 segundos
    setInterval(slideComunicados, 4000);
});

window.addEventListener('scroll', function() {
    const socialBar = document.querySelector('.side-social-bar');
    const scrollPos = window.scrollY;

    // Si el usuario baja más de 300px, ocultamos la barra
    if (scrollPos < 300) {
        socialBar.style.opacity = '0';
        socialBar.style.pointerEvents = 'none'; // Evita clics accidentales
    } else {
        socialBar.style.opacity = '1';
        socialBar.style.pointerEvents = 'auto';
    }
});