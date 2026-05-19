// Espera a que todo el contenido HTML cargue
document.addEventListener('DOMContentLoaded', () => {
    console.log("La página del hospital ha cargado correctamente.");

    // Ejemplo: Añadir un pequeño efecto a los enlaces del menú al hacer click
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Aquí podrías agregar lógica para menús desplegables o navegación fluida
            console.log("Navegando a: " + this.innerText);
        });
    });
});