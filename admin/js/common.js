/* ==========================================
   COMPORTAMIENTO COMÚN DE LA INTRANET
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Control de Sesión Simulado para Revisiones
    if (!sessionStorage.getItem("userLoggedIn")) {
        // Si entra directo (para que el docente no se tranque), iniciamos sesión automática
        sessionStorage.setItem("userLoggedIn", "true");
        sessionStorage.setItem("userEmail", "medico.invitado@hcaleta.gob.pe");
        sessionStorage.setItem("userName", "MEDICO INVITADO");
    }

    // Cargar datos en el Sidebar
    const userEmail = sessionStorage.getItem("userEmail");
    const userName = sessionStorage.getItem("userName");
    
    const sidebarName = document.getElementById("sidebarUserName");
    const avatarText = document.getElementById("avatarText");

    if (sidebarName && userName) {
        sidebarName.textContent = userName;
    }
    if (avatarText && userName) {
        avatarText.textContent = userName.charAt(0).toUpperCase();
    }

    // 2. Control de Cierre de Sesión
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = "index.html";
        });
    }

    // 3. Sistema de Modo Oscuro / Claro Persistente
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    
    // Aplicar tema guardado en localStorage
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        updateThemeIcon(true);
    } else {
        document.body.classList.remove("dark-mode");
        updateThemeIcon(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-mode");
            
            // Guardar preferencia
            localStorage.setItem("admin-theme", isDark ? "dark" : "light");
            
            // Actualizar icono
            updateThemeIcon(isDark);
        });
    }

    function updateThemeIcon(isDark) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector("i");
        if (isDark) {
            icon.className = "fa-solid fa-sun";
            themeToggleBtn.setAttribute("title", "Cambiar a Modo Claro");
        } else {
            icon.className = "fa-solid fa-moon";
            themeToggleBtn.setAttribute("title", "Cambiar a Modo Oscuro");
        }
    }

    // 4. Alternancia del menú lateral (Sidebar) en móviles
    const adminSidebarToggle = document.getElementById("adminSidebarToggle");
    const sidebar = document.querySelector(".sidebar");

    if (adminSidebarToggle && sidebar) {
        adminSidebarToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 992 && sidebar.classList.contains("active")) {
                // Si el clic no fue dentro del sidebar ni en el botón de alternancia
                if (!sidebar.contains(e.target) && !adminSidebarToggle.contains(e.target)) {
                    sidebar.classList.remove("active");
                }
            }
        });
    }
});
