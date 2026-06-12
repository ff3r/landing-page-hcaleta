/* =========================================================================
   LÓGICA DEL ERP DASHBOARD - Hospital La Caleta
   ========================================================================= */

// Cargar de LocalStorage si existe o usar por defecto
const defaultInventario = [
    { nombre: "Oxígeno Médico (Balón)", categoria: "Gases", stock: 120, estado: "Stock Alto" },
    { nombre: "Mascarillas N95", categoria: "Protección", stock: 450, estado: "Stock Alto" },
    { nombre: "Paracetamol 500mg", categoria: "Fármacos", stock: 12, estado: "Crítico" },
    { nombre: "Jeringas 5ml", categoria: "Insumos", stock: 85, estado: "Por agotar" }
];
let dataERP = {
    inventario: JSON.parse(localStorage.getItem('erp_inventario')) || defaultInventario
};
if (!localStorage.getItem('erp_inventario')) localStorage.setItem('erp_inventario', JSON.stringify(dataERP.inventario));

const defaultCitas = [
    { hora: "08:00", paciente: "Juan Pérez", especialidad: "Cardiología", estado: "Confirmado" },
    { hora: "08:30", paciente: "María López", especialidad: "Pediatría", estado: "En Espera" },
    { hora: "09:15", paciente: "Carlos Ruiz", especialidad: "Med. General", estado: "En Consulta" },
    { hora: "10:00", paciente: "Ana Torres", especialidad: "Odontología", estado: "Pendiente" },
    { hora: "10:45", paciente: "Luis Solís", especialidad: "Ginecología", estado: "Confirmado" }
];
let citasProgramadas = JSON.parse(localStorage.getItem('erp_citas')) || defaultCitas;
if (!localStorage.getItem('erp_citas')) localStorage.setItem('erp_citas', JSON.stringify(citasProgramadas));

// Configuración Global de Notificaciones (Toast)
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Capturar la vista por defecto (Dashboard inicial)
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
        vistasPlantillas.dashboard = mainContent.innerHTML;
        // Agregar listener global usando delegación de eventos
        mainContent.addEventListener("click", manejarEventosMainContent);
        // Inicializar
        renderizarVista('dashboard');
    }
});

function manejarEventosMainContent(event) {
    // 1. NAVEGACIÓN
    if (event.target.id === 'btnVerInventario' || event.target.closest('#btnVerInventario')) {
        event.preventDefault();
        renderizarVista('inventario');
    }
    else if (event.target.id === 'btnVerCitas' || event.target.closest('#btnVerCitas')) {
        renderizarVista('citas');
    }
    else if (event.target.id === 'btnVolverDashboard' || event.target.closest('#btnVolverDashboard')) {
        renderizarVista('dashboard');
    }
    
    // 2. CRUD INVENTARIO COMPLETO
    else if (event.target.id === 'btnAgregarRecursoView') {
        agregarRecursoVistaCompleta();
    }
    else if (event.target.closest('.btn-eliminar-recurso')) {
        const btn = event.target.closest('.btn-eliminar-recurso');
        eliminarRecurso(btn.dataset.index);
    }
    else if (event.target.closest('.btn-editar-recurso')) {
        const btn = event.target.closest('.btn-editar-recurso');
        habilitarEdicionRecurso(btn.dataset.index);
    }
    else if (event.target.closest('.btn-guardar-recurso')) {
        const btn = event.target.closest('.btn-guardar-recurso');
        guardarEdicionRecurso(btn.dataset.index);
    }
}

function renderizarVista(vista) {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // Actualizar clase activa en sidebar
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(item => item.classList.remove('active'));
    // Como estamos en un SPA parcial, mantenemos ERP Dashboard encendido siempre que estemos en sus vistas
    const dashboardLink = document.querySelector('.sidebar-menu .sidebar-item a[href="dashboard.html"]');
    if (dashboardLink && (vista === 'dashboard' || vista === 'inventario' || vista === 'citas')) {
        dashboardLink.parentElement.classList.add('active');
    }

    // Inyectar HTML
    mainContent.innerHTML = vistasPlantillas[vista];

    // Inicializar lógica según la vista
    if (vista === 'dashboard') {
        inicializarGrafico();
        renderizarInventarioDashboard();
        renderizarCitasDashboard();
        
        // Re-vincular el submit de Admisión
        const formAdmision = document.getElementById('formAdmision');
        if (formAdmision) {
            formAdmision.addEventListener('submit', registrarAdmision);
        }
    } else if (vista === 'inventario') {
        renderizarInventarioCompleto();
    } else if (vista === 'citas') {
        renderizarCitasCompleto();
    }
}

/**
 * =======================================================
 * LÓGICA VISTA: DASHBOARD
 * =======================================================
 */
function renderizarInventarioDashboard() {
    const inventarioTable = document.querySelector('.table-container-card .admin-table tbody');
    if (!inventarioTable) return;
    inventarioTable.innerHTML = "";

    // Mostrar solo los primeros 4 en el dashboard
    dataERP.inventario.slice(0, 4).forEach((item) => {
        const badgeClass = item.estado === 'Crítico' ? 'admin-badge-danger' : 
                          (item.estado === 'Por agotar' ? 'admin-badge-warning' : 'admin-badge-success');
        
        inventarioTable.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.categoria}</td>
                <td>${item.stock} Unidades</td>
                <td><span class="admin-badge ${badgeClass}">${item.estado}</span></td>
            </tr>
        `;
    });
}

function renderizarCitasDashboard() {
    const tbody = document.getElementById("lista-citas-dinamica");
    if (!tbody) return;
    tbody.innerHTML = "";

    citasProgramadas.slice(0,5).forEach(cita => {
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
    const nombre = document.getElementById("nombrePaciente").value.trim();
    const dni = document.getElementById("dniPaciente").value.trim();
    const motivo = document.getElementById("motivoConsulta").value.trim();
    const prioridad = document.getElementById("prioridadPaciente").value;
    
    // Validación para no guardar filas en blanco
    if (!nombre || !dni || !motivo || !prioridad) {
        return;
    }
    
    const ahora = new Date();
    const hora = ahora.getHours().toString().padStart(2, '0') + ":" + ahora.getMinutes().toString().padStart(2, '0');
    
    citasProgramadas.unshift({
        hora: hora,
        paciente: nombre,
        especialidad: motivo,
        estado: prioridad
    });
    
    localStorage.setItem('erp_citas', JSON.stringify(citasProgramadas));
    renderizarCitasDashboard();
    event.target.reset();
}

function inicializarGrafico() {
    const ctx = document.getElementById("admissionsChart");
    if (!ctx) return;

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

/**
 * =======================================================
 * LÓGICA VISTA: INVENTARIO COMPLETO (CRUD)
 * =======================================================
 */
function calcularEstadoStock(stock) {
    if (stock <= 20) return "Crítico";
    if (stock <= 85) return "Por agotar";
    return "Stock Alto";
}

function renderizarInventarioCompleto() {
    const tbody = document.getElementById("lista-inventario-vista-completa");
    if (!tbody) return;
    tbody.innerHTML = "";

    dataERP.inventario.forEach((item, index) => {
        const badgeClass = item.estado === 'Crítico' ? 'admin-badge-danger' : 
                          (item.estado === 'Por agotar' ? 'admin-badge-warning' : 'admin-badge-success');
        
        tbody.innerHTML += `
            <tr id="fila-inventario-${index}">
                <td>${item.nombre}</td>
                <td>${item.categoria}</td>
                <td class="col-stock">${item.stock} Unidades</td>
                <td><span class="admin-badge ${badgeClass}">${item.estado}</span></td>
                <td style="text-align: right; white-space: nowrap;">
                    <button class="admin-btn admin-btn-secondary btn-editar-recurso" data-index="${index}" style="padding: 4px 8px; margin-right: 5px;" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="admin-btn admin-badge-danger btn-eliminar-recurso" data-index="${index}" style="padding: 4px 8px; border:none; border-radius:4px; cursor:pointer;" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function agregarRecursoVistaCompleta() {
    const nombre = document.getElementById("nuevoNombreRecurso").value.trim();
    const stockStr = document.getElementById("nuevoCantidadStock").value;
    const stock = parseInt(stockStr);
    
    if (!nombre || isNaN(stock) || stockStr === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error de entrada',
            text: 'Por favor ingrese un nombre y una cantidad válida.',
            confirmButtonColor: '#0099cc'
        });
        return;
    }
    
    dataERP.inventario.push({
        nombre: nombre,
        categoria: "Añadido",
        stock: stock,
        estado: calcularEstadoStock(stock)
    });

    localStorage.setItem('erp_inventario', JSON.stringify(dataERP.inventario));
    renderizarInventarioCompleto();
    
    // Notificación de éxito
    Toast.fire({
        icon: 'success',
        title: 'Recurso añadido con éxito'
    });
}

function eliminarRecurso(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            dataERP.inventario.splice(index, 1);
            localStorage.setItem('erp_inventario', JSON.stringify(dataERP.inventario));
            renderizarInventarioCompleto();
            
            Toast.fire({
                icon: 'success',
                title: 'Recurso eliminado correctamente'
            });
        }
    });
}

function habilitarEdicionRecurso(index) {
    const fila = document.getElementById(`fila-inventario-${index}`);
    if (!fila) return;
    
    const item = dataERP.inventario[index];
    
    fila.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.categoria}</td>
        <td>
            <input type="number" id="edit-stock-${index}" value="${item.stock}" style="width: 80px; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--card-bg); color: var(--text-color);">
        </td>
        <td><span class="admin-badge admin-badge-muted">Editando...</span></td>
        <td style="text-align: right;">
            <button class="admin-btn admin-badge-success btn-guardar-recurso" data-index="${index}" style="padding: 4px 8px; border:none; border-radius:4px; cursor:pointer;">Guardar</button>
        </td>
    `;
}

function guardarEdicionRecurso(index) {
    const nuevoStock = parseInt(document.getElementById(`edit-stock-${index}`).value);
    if (isNaN(nuevoStock) || nuevoStock < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad inválida',
            text: 'La cantidad debe ser un número mayor o igual a cero.',
            confirmButtonColor: '#0099cc'
        });
        return;
    }
    
    dataERP.inventario[index].stock = nuevoStock;
    dataERP.inventario[index].estado = calcularEstadoStock(nuevoStock);
    
    localStorage.setItem('erp_inventario', JSON.stringify(dataERP.inventario));
    renderizarInventarioCompleto();
    
    Toast.fire({
        icon: 'success',
        title: 'Stock actualizado'
    });
}

/**
 * =======================================================
 * LÓGICA VISTA: CITAS COMPLETAS
 * =======================================================
 */
function renderizarCitasCompleto() {
    const tbody = document.getElementById("lista-citas-vista-completa");
    if (!tbody) return;
    tbody.innerHTML = "";

    citasProgramadas.forEach(cita => {
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



