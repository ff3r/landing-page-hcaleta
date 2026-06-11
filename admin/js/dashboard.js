/* =========================================================================
   LÓGICA DEL ERP DASHBOARD - Hospital La Caleta
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicialización de componentes principales
    inicializarGrafico();
    renderizarInventario(); 
    
    // Aquí puedes llamar futuras funciones como:
    // configurarAlertasCamas();
    // actualizarRelojTiempoReal();
});

/**
 * DATOS DINÁMICOS
 * Modifica esta sección para conectar con tu futura base de datos o API.
 */
const dataERP = {
    inventario: [
        { nombre: "Oxígeno Médico (Balón)", categoria: "Gases", stock: 120, estado: "Stock Alto" },
        { nombre: "Mascarillas N95", categoria: "Protección", stock: 450, estado: "Stock Alto" },
        { nombre: "Paracetamol 500mg", categoria: "Fármacos", stock: 12, estado: "Crítico" },
        { nombre: "Jeringas 5ml", categoria: "Insumos", stock: 85, estado: "Por agotar" }
    ]
};

// Cargar de LocalStorage si existe
const savedInventario = localStorage.getItem('erp_inventario');
if (savedInventario) {
    dataERP.inventario = JSON.parse(savedInventario);
} else {
    localStorage.setItem('erp_inventario', JSON.stringify(dataERP.inventario));
}

/**
 * MÓDULO DE TABLA DE INVENTARIO
 */
function renderizarInventario() {
    const tables = document.querySelectorAll(".admin-table tbody");
    const mainTableBody = tables[0];
    const modalTableBody = document.getElementById("lista-inventario-completa");

    if (mainTableBody) mainTableBody.innerHTML = "";
    if (modalTableBody) modalTableBody.innerHTML = "";

    dataERP.inventario.forEach((item, index) => {
        const badgeClass = item.estado === 'Crítico' ? 'admin-badge-danger' : 
                          (item.estado === 'Por agotar' ? 'admin-badge-warning' : 'admin-badge-success');
        
        const row = `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.categoria}</td>
                <td>${item.stock} Unidades</td>
                <td><span class="admin-badge ${badgeClass}">${item.estado}</span></td>
            </tr>
        `;
        if (mainTableBody) mainTableBody.innerHTML += row;
        
        const rowModal = `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.stock}</td>
                <td><button onclick="eliminarRecurso(${index})" class="admin-btn admin-badge-danger" style="border:none; border-radius:4px; padding: 4px 8px; font-size: 0.8rem; cursor:pointer;">X</button></td>
            </tr>
        `;
        if (modalTableBody) modalTableBody.innerHTML += rowModal;
    });
}

function agregarRecurso() {
    const nombre = document.getElementById("nombreRecurso").value;
    const stock = parseInt(document.getElementById("cantidadStock").value);
    
    if (!nombre || isNaN(stock)) {
        alert("Por favor ingrese un nombre y una cantidad válida.");
        return;
    }
    
    let estado = "Stock Alto";
    if (stock <= 20) estado = "Crítico";
    else if (stock <= 85) estado = "Por agotar";

    dataERP.inventario.push({
        nombre: nombre,
        categoria: "Añadido", // Categoría genérica para nuevos
        stock: stock,
        estado: estado
    });

    localStorage.setItem('erp_inventario', JSON.stringify(dataERP.inventario));
    renderizarInventario();
    
    // Limpiar formulario
    document.getElementById("nombreRecurso").value = "";
    document.getElementById("cantidadStock").value = "";
}

function eliminarRecurso(index) {
    dataERP.inventario.splice(index, 1);
    localStorage.setItem('erp_inventario', JSON.stringify(dataERP.inventario));
    renderizarInventario();
}

/**
 * MÓDULO DE GRÁFICOS (Chart.js)
 */
function inicializarGrafico() {
    const ctx = document.getElementById("admissionsChart");
    if (!ctx) return;

    // Detectar tema actual para colores consistentes
    const isDarkMode = document.body.classList.contains("dark-mode");
    const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
    const textColor = isDarkMode ? "#94a3b8" : "#64748b";

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Emergencia', 'Pediatría', 'Ginecología', 'Cardiología', 'Odontología', 'Med. General'],
            datasets: [{
                label: 'Admisiones',
                data: [65, 45, 30, 25, 18, 55],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.85)', 'rgba(0, 153, 204, 0.85)', 
                    'rgba(46, 196, 182, 0.85)', 'rgba(255, 159, 28, 0.85)', 
                    'rgba(148, 163, 184, 0.85)', 'rgba(139, 92, 246, 0.85)'
                ],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: gridColor }, ticks: { color: textColor } },
                x: { grid: { display: false }, ticks: { color: textColor } }
            }
        }
    });
}

// TABLA DE CITAS
let citasProgramadas = [
    { hora: "08:00", paciente: "Juan Pérez", especialidad: "Cardiología", estado: "Confirmado" },
    { hora: "08:30", paciente: "María López", especialidad: "Pediatría", estado: "En Espera" },
    { hora: "09:15", paciente: "Carlos Ruiz", especialidad: "Med. General", estado: "En Consulta" },
    { hora: "10:00", paciente: "Ana Torres", especialidad: "Odontología", estado: "Pendiente" },
    { hora: "10:45", paciente: "Luis Solís", especialidad: "Ginecología", estado: "Confirmado" }
];

const savedCitas = localStorage.getItem('erp_citas');
if (savedCitas) {
    citasProgramadas = JSON.parse(savedCitas);
} else {
    localStorage.setItem('erp_citas', JSON.stringify(citasProgramadas));
}

function renderizarCitas() {
    const tbody = document.getElementById("lista-citas-dinamica");
    if (!tbody) return;
    tbody.innerHTML = "";

    citasProgramadas.forEach(cita => {
        // Asignar color al badge según el estado o prioridad
        let claseBadge = 'admin-badge-muted';
        if (cita.estado === 'Confirmado' || cita.estado === 'Bajo') claseBadge = 'admin-badge-success';
        else if (cita.estado === 'En Consulta' || cita.estado === 'Medio') claseBadge = 'admin-badge-warning';
        else if (cita.estado === 'Crítico') claseBadge = 'admin-badge-danger';

        tbody.innerHTML += `
            <tr>
                <td><strong>${cita.hora}</strong></td>
                <td>${cita.paciente}</td>
                <td>${cita.especialidad}</td>
                <td><span class="admin-badge ${claseBadge}">${cita.estado}</span></td>
            </tr>
        `;
    });
}

function registrarAdmision(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombrePaciente").value;
    const motivo = document.getElementById("motivoConsulta").value;
    const prioridad = document.getElementById("prioridadPaciente").value;
    
    const ahora = new Date();
    const hora = ahora.getHours().toString().padStart(2, '0') + ":" + ahora.getMinutes().toString().padStart(2, '0');
    
    // Agregar al inicio del array
    citasProgramadas.unshift({
        hora: hora,
        paciente: nombre,
        especialidad: motivo,
        estado: prioridad
    });
    
    localStorage.setItem('erp_citas', JSON.stringify(citasProgramadas));
    renderizarCitas();
    event.target.reset();
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", renderizarCitas);

// BOTON VER INVENTARIO
document.addEventListener("DOMContentLoaded", function() {
    const btnVer = document.getElementById("btnVerInventario");
    const modal = document.getElementById("modalInventario");
    const spanClose = document.querySelector(".close-btn");

    if (btnVer) {
        btnVer.addEventListener("click", function(event) {
            event.preventDefault(); // Evita que el enlace # recargue la página
            if (modal) {
                modal.style.display = "block";
            } else {
                console.error("El elemento con id 'modalInventario' no existe en tu HTML.");
            }
        });
    }

    if (spanClose) {
        spanClose.addEventListener("click", function() {
            modal.style.display = "none";
        });
    }
});



