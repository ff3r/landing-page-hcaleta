/* ==========================================
   CONTROL DE AUTENTICACIÓN (LOGIN INTRANET)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const errorMessage = document.getElementById("errorMessage");

    // 1. Alternar Visibilidad de Contraseña
    togglePasswordBtn.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        
        // Cambiar icono
        const eyeIcon = togglePasswordBtn.querySelector("i");
        if (type === "text") {
            eyeIcon.classList.remove("fa-regular", "fa-eye");
            eyeIcon.classList.add("fa-regular", "fa-eye-slash");
        } else {
            eyeIcon.classList.remove("fa-regular", "fa-eye-slash");
            eyeIcon.classList.add("fa-regular", "fa-eye");
        }
    });

    // 2. Procesar Envío del Formulario
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const email = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Ocultar alerta de error previa
        errorMessage.classList.add("hidden");
        
        // Simulación de credenciales (Acepta cualquier usuario de hcaleta o admin/admin)
        if ((email.endsWith("@hcaleta.gob.pe") || email === "admin@gmail.com") && password.length >= 4) {
            // Guardar sesión simulada en sessionStorage
            sessionStorage.setItem("userLoggedIn", "true");
            sessionStorage.setItem("userEmail", email);
            sessionStorage.setItem("userName", email.split("@")[0].toUpperCase());
            
            // Redirigir al dashboard principal ERP
            window.location.href = "dashboard.html";
        } else {
            // Mostrar error
            errorMessage.classList.remove("hidden");
            
            // Limpiar campo de contraseña
            passwordInput.value = "";
            passwordInput.focus();
        }
    });
});
