/* =========================================================================
   LÓGICA DEL ERP DASHBOARD - Hospital La Caleta (@Gerardie)
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

/**
 * MÓDULO DE TABLA DE INVENTARIO
 */
function renderizarInventario() {
    const tableBody = document.querySelector(".admin-table tbody");
    if (!tableBody) return;

    tableBody.innerHTML = ""; // Limpieza previa

    dataERP.inventario.forEach(item => {
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
        tableBody.innerHTML += row;
    });
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
const citasProgramadas = [
    { hora: "08:00", paciente: "Juan Pérez", especialidad: "Cardiología", estado: "Confirmado" },
    { hora: "08:30", paciente: "María López", especialidad: "Pediatría", estado: "En Espera" },
    { hora: "09:15", paciente: "Carlos Ruiz", especialidad: "Med. General", estado: "En Consulta" },
    { hora: "10:00", paciente: "Ana Torres", especialidad: "Odontología", estado: "Pendiente" },
    { hora: "10:45", paciente: "Luis Solís", especialidad: "Ginecología", estado: "Confirmado" }
];

function renderizarCitas() {
    const tbody = document.getElementById("lista-citas-dinamica");
    tbody.innerHTML = "";

    citasProgramadas.forEach(cita => {
        // Asignar color al badge según el estado
        const claseBadge = cita.estado === 'Confirmado' ? 'admin-badge-success' : 
                           cita.estado === 'En Consulta' ? 'admin-badge-warning' : 'admin-badge-muted';

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

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", renderizarCitas);