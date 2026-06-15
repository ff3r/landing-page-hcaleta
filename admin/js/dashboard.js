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
    { hora: "08:00", paciente: "Juan Pérez", especialidad: "Cardiología", estado: "Confirmado", flujoPago: "Pendiente de Pago en Caja" },
    { hora: "08:30", paciente: "María López", especialidad: "Pediatría", estado: "En Espera", flujoPago: "Exento de Pago / SIS" },
    { hora: "09:15", paciente: "Carlos Ruiz", especialidad: "Med. General", estado: "En Consulta", flujoPago: "Pendiente de Pago en Caja" },
    { hora: "10:00", paciente: "Ana Torres", especialidad: "Odontología", estado: "Pendiente", flujoPago: "Exento de Pago / SIS" },
    { hora: "10:45", paciente: "Luis Solís", especialidad: "Ginecología", estado: "Confirmado", flujoPago: "Pendiente de Pago en Caja" }
];
let citasProgramadas = JSON.parse(localStorage.getItem('erp_citas')) || defaultCitas;
if (!localStorage.getItem('erp_citas')) localStorage.setItem('erp_citas', JSON.stringify(citasProgramadas));

const defaultFinanzas = [
    { fecha: new Date().toISOString().split('T')[0], tipo: "Ingreso", concepto: "Consulta Particular", categoria: "Cardiología", monto: 50.00 },
    { fecha: new Date().toISOString().split('T')[0], tipo: "Egreso", concepto: "Compra Insumos", categoria: "Operativo", monto: 120.00 }
];
let finanzasData = JSON.parse(localStorage.getItem('erp_finanzas')) || defaultFinanzas;
if (!localStorage.getItem('erp_finanzas')) localStorage.setItem('erp_finanzas', JSON.stringify(finanzasData));

const defaultPersonal = [
    { nombre: "Juan Pérez", especialidad: "Cardiología" },
    { nombre: "María López", especialidad: "Pediatría" }
];
let personalData = JSON.parse(localStorage.getItem('erp_personal')) || defaultPersonal;
// Migrar registros antiguos: eliminar campos 'comision' y 'asistencia' si existen
personalData = personalData.map(({ nombre, especialidad }) => ({ nombre, especialidad }));
if (!localStorage.getItem('erp_personal')) localStorage.setItem('erp_personal', JSON.stringify(personalData));

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
        // Agregar listener global usando delegación de eventos para contenido dinámico
        mainContent.addEventListener("click", manejarEventosMainContent);
        
        // Agregar listener global para navegación (Sidebar está fuera de main-content)
        document.body.addEventListener("click", manejarNavegacionGlobal);
        
        // Comprobar si se solicitó una vista específica por URL (ej. ?view=finanzas)
        const urlParams = new URLSearchParams(window.location.search);
        const viewToRender = urlParams.get('view') || 'dashboard';
        
        // Inicializar
        renderizarVista(viewToRender);
    }
});

function manejarNavegacionGlobal(event) {
    if (event.target.id === 'sidebarFinanzas' || event.target.closest('#sidebarFinanzas')) {
        event.preventDefault();
        window.history.pushState({}, '', 'dashboard.html?view=finanzas');
        renderizarVista('finanzas');
    }
    else if (event.target.id === 'sidebarRRHH' || event.target.closest('#sidebarRRHH')) {
        event.preventDefault();
        window.history.pushState({}, '', 'dashboard.html?view=rrhh');
        renderizarVista('rrhh');
    }
    else if (event.target.closest('.sidebar-item a[href="dashboard.html"]') || event.target.closest('.submenu-link[href="dashboard.html"]')) {
        event.preventDefault();
        window.history.pushState({}, '', 'dashboard.html');
        renderizarVista('dashboard');
    }
}

function manejarEventosMainContent(event) {
    // 1. NAVEGACIÓN INTERNA
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
    // 3. ACCIONES CITAS
    else if (event.target.closest('.btn-cobrar-cita')) {
        const btn = event.target.closest('.btn-cobrar-cita');
        cobrarCita(btn.dataset.index);
    }
}

function renderizarVista(vista) {
    console.log('Cargando vista:', vista);
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // Actualizar clase activa en sidebar
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(item => item.classList.remove('active'));
    // Como estamos en un SPA parcial, mantenemos ERP Dashboard encendido siempre que estemos en sus vistas
    const dashboardLink = document.querySelector('.sidebar-menu .sidebar-item a[href="dashboard.html"]');
    if (dashboardLink && (vista === 'dashboard' || vista === 'inventario' || vista === 'citas')) {
        dashboardLink.parentElement.classList.add('active');
    } else if (vista === 'finanzas') {
        const finanzasLink = document.getElementById('sidebarFinanzas');
        if (finanzasLink) finanzasLink.parentElement.classList.add('active');
    } else if (vista === 'rrhh') {
        const rrhhLink = document.getElementById('sidebarRRHH');
        if (rrhhLink) rrhhLink.parentElement.classList.add('active');
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
    } else if (vista === 'finanzas') {
        renderizarFinanzas();
    } else if (vista === 'rrhh') {
        renderizarRRHH();
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
        
        let clasePago = cita.flujoPago === 'Exento de Pago / SIS' ? 'admin-badge-success' : 'admin-badge-info';

        tbody.innerHTML += `
            <tr>
                <td><strong>${cita.hora}</strong></td>
                <td>${cita.paciente}</td>
                <td>${cita.especialidad}</td>
                <td><span class="admin-badge ${claseBadge}">${cita.estado}</span></td>
                <td><span class="admin-badge ${clasePago}">${cita.flujoPago || 'Pendiente'}</span></td>
            </tr>
        `;
    });
    
    // Actualizar Métrica Financiera en el Dashboard
    const metricElement = document.getElementById("metricPendientesPago");
    if (metricElement) {
        const pendientes = citasProgramadas.filter(c => c.flujoPago === 'Pendiente de Pago en Caja').length;
        metricElement.innerText = pendientes;
    }
}

function registrarAdmision(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombrePaciente").value.trim();
    const dni = document.getElementById("dniPaciente").value.trim();
    const motivo = document.getElementById("motivoConsulta").value.trim();
    const seguro = document.getElementById("tipoSeguro").value;
    const prioridad = document.getElementById("prioridadPaciente").value;
    
    // Validación para no guardar filas en blanco
    if (!nombre || !dni || !motivo || !seguro || !prioridad) {
        return;
    }
    
    // Lógica del flujo de pago
    let flujoPago = "Pendiente de Pago en Caja";
    if (seguro === "SIS (Seguro Integral de Salud)") {
        flujoPago = "Exento de Pago / SIS";
    }
    
    const ahora = new Date();
    const hora = ahora.getHours().toString().padStart(2, '0') + ":" + ahora.getMinutes().toString().padStart(2, '0');
    
    // Agregar al inicio del array
    citasProgramadas.unshift({
        hora: hora,
        paciente: nombre,
        especialidad: motivo,
        estado: prioridad,
        seguro: seguro,
        flujoPago: flujoPago
    });
    
    localStorage.setItem('erp_citas', JSON.stringify(citasProgramadas));
    renderizarCitasDashboard();
    
    Toast.fire({
        icon: 'success',
        title: 'Paciente registrado exitosamente'
    });
    
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

    citasProgramadas.forEach((cita, index) => {
        let claseBadge = 'admin-badge-muted';
        if (cita.estado === 'Confirmado' || cita.estado === 'Bajo') claseBadge = 'admin-badge-success';
        else if (cita.estado === 'En Consulta' || cita.estado === 'Medio') claseBadge = 'admin-badge-warning';
        else if (cita.estado === 'Crítico') claseBadge = 'admin-badge-danger';
        
        let clasePago = cita.flujoPago === 'Exento de Pago / SIS' || cita.flujoPago === 'Pagado' ? 'admin-badge-success' : 'admin-badge-info';
        
        let btnAccion = '';
        if (cita.flujoPago === 'Pendiente de Pago en Caja') {
            btnAccion = `<button class="admin-btn admin-btn-primary btn-cobrar-cita" data-index="${index}" style="padding: 4px 8px; font-size: 0.8rem;">Cobrar (S/ 50)</button>`;
        } else {
            btnAccion = `<span class="text-muted" style="font-size:0.8rem;">-</span>`;
        }

        tbody.innerHTML += `
            <tr>
                <td><strong>${cita.hora}</strong></td>
                <td>${cita.paciente}</td>
                <td>${cita.especialidad}</td>
                <td><span class="admin-badge ${claseBadge}">${cita.estado}</span></td>
                <td><span class="admin-badge ${clasePago}">${cita.flujoPago || 'Pendiente'}</span></td>
                <td style="text-align: right;">${btnAccion}</td>
            </tr>
        `;
    });
}

function cobrarCita(index) {
    const cita = citasProgramadas[index];
    if (!cita) return;
    
    // Actualizar estado de la cita
    cita.flujoPago = 'Pagado';
    localStorage.setItem('erp_citas', JSON.stringify(citasProgramadas));
    
    // Inyectar a finanzas
    finanzasData.push({
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'Ingreso',
        concepto: 'Consulta Particular (' + cita.paciente + ')',
        categoria: cita.especialidad,
        monto: 50.00
    });
    localStorage.setItem('erp_finanzas', JSON.stringify(finanzasData));
    
    // Renderizar de nuevo
    renderizarCitasCompleto();
    
    Toast.fire({
        icon: 'success',
        title: 'Pago registrado y comisión calculada'
    });
}

/**
 * =======================================================
 * LÓGICA VISTA: FINANZAS
 * =======================================================
 */
let finanzasChartInstance = null;

function renderizarFinanzas() {
    let ingresos = 0;
    let egresos = 0;
    let ingresosPorEspecialidad = {};

    const tbody = document.getElementById("lista-movimientos-finanzas");
    if (tbody) tbody.innerHTML = "";

    // Ordenamos por los más recientes (simulado empujando al inicio visualmente)
    const datosReversos = [...finanzasData].reverse();
    
    datosReversos.forEach(mov => {
        if (mov.tipo === 'Ingreso') {
            ingresos += mov.monto;
            if (!ingresosPorEspecialidad[mov.categoria]) ingresosPorEspecialidad[mov.categoria] = 0;
            ingresosPorEspecialidad[mov.categoria] += mov.monto;
        } else {
            egresos += mov.monto;
        }

        if (tbody) {
            const badgeTipo = mov.tipo === 'Ingreso' ? 'admin-badge-success' : 'admin-badge-danger';
            tbody.innerHTML += `
                <tr>
                    <td>${mov.fecha}</td>
                    <td><span class="admin-badge ${badgeTipo}">${mov.tipo}</span></td>
                    <td>${mov.concepto}</td>
                    <td>${mov.categoria}</td>
                    <td><strong>S/ ${mov.monto.toFixed(2)}</strong></td>
                </tr>
            `;
        }
    });

    const balance = ingresos - egresos;

    document.getElementById("finanzasIngresosTotales").innerText = "S/ " + ingresos.toFixed(2);
    document.getElementById("finanzasEgresosTotales").innerText = "S/ " + egresos.toFixed(2);
    document.getElementById("finanzasBalanceBruto").innerText = "S/ " + balance.toFixed(2);

    // Gráfico Chart.js
    const ctx = document.getElementById('finanzasChart');
    if (ctx) {
        if (finanzasChartInstance) {
            finanzasChartInstance.destroy();
        }
        
        const isDarkMode = document.body.classList.contains("dark-mode");
        const textColor = isDarkMode ? "#94a3b8" : "#64748b";

        finanzasChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(ingresosPorEspecialidad),
                datasets: [{
                    data: Object.values(ingresosPorEspecialidad),
                    backgroundColor: [
                        'rgba(46, 196, 182, 0.85)', 'rgba(0, 153, 204, 0.85)', 
                        'rgba(139, 92, 246, 0.85)', 'rgba(239, 68, 68, 0.85)', 
                        'rgba(255, 159, 28, 0.85)'
                    ],
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#1e293b' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: textColor }
                    }
                }
            }
        });
    }
}

function registrarEgreso(event) {
    event.preventDefault();
    const concepto = document.getElementById("egresoConcepto").value.trim();
    const monto = parseFloat(document.getElementById("egresoMonto").value);

    if (!concepto || isNaN(monto) || monto <= 0) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Datos inválidos' });
        return;
    }

    finanzasData.push({
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'Egreso',
        concepto: concepto,
        categoria: 'Operativo',
        monto: monto
    });

    localStorage.setItem('erp_finanzas', JSON.stringify(finanzasData));
    renderizarFinanzas();
    event.target.reset();
    Toast.fire({ icon: 'success', title: 'Egreso registrado' });
}

/**
 * =======================================================
 * LÓGICA VISTA: RRHH — PLANIFICADOR TIPO GANTT
 * =======================================================
 */

/**
 * Devuelve la clave de localStorage para las asistencias de una fecha dada.
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 */
function claveAsistencia(fecha) {
    return `asistencias_${fecha}`;
}

/**
 * Devuelve la fecha actual en formato YYYY-MM-DD (para clave) y legible.
 */
function obtenerFechaHoy() {
    const hoy = new Date();
    const iso = hoy.toISOString().split('T')[0];           // "2026-06-15"
    const legible = hoy.toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return { iso, legible };
}

/**
 * Guarda el estado actual de los selectores de asistencia en localStorage
 * bajo la clave del día de hoy. Guarda el estado para todas las horas (8-15)
 * para mantener la compatibilidad con el modal de historial Gantt.
 */
function guardarAsistencia() {
    const { iso } = obtenerFechaHoy();
    const registroHoy = {};

    document.querySelectorAll('.asistencia-select').forEach(sel => {
        const nombre = personalData[sel.dataset.index]?.nombre;
        if (nombre) {
            const estado = sel.value;
            // Guardar en formato detallado por horas
            registroHoy[nombre] = {};
            const MODAL_HORAS = [8, 9, 10, 11, 12, 13, 14, 15];
            MODAL_HORAS.forEach(h => {
                registroHoy[nombre][String(h)] = estado === 'Pendiente' ? '' : estado;
            });
        }
    });

    localStorage.setItem(claveAsistencia(iso), JSON.stringify(registroHoy));
    Toast.fire({ icon: 'success', title: `Asistencia del ${iso} guardada` });
}

/**
 * Convierte registros diarios antiguos (ej. {"Pepe":"Presente"})
 * a formato detallado por horas (ej. {"Pepe": {"8":"Presente", ..., "15":"Presente"}})
 * para mantener la compatibilidad con el nuevo cronograma.
 */
function migrarAsistenciasAntiguas() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('asistencias_')) {
            let data = JSON.parse(localStorage.getItem(key)) || {};
            let modificado = false;
            
            Object.keys(data).forEach(emp => {
                // Si el valor es un string (formato antiguo)
                if (typeof data[emp] === 'string') {
                    const estadoAnterior = data[emp];
                    data[emp] = {};
                    // Crear horas de 8 a 15
                    for (let h = 8; h <= 15; h++) {
                        data[emp][String(h)] = estadoAnterior;
                    }
                    modificado = true;
                }
            });

            if (modificado) {
                localStorage.setItem(key, JSON.stringify(data));
            }
        }
    }
}

// Ejecutar migración al cargar
migrarAsistenciasAntiguas();

const VIEW_RRHH_HORAS = [8, 9, 10, 11, 12, 13, 14, 15];
const VIEW_RRHH_ESTADOS = ['', 'Presente', 'Ausente', 'Permiso'];
const VIEW_RRHH_COLORES = {
    '':          { bg: 'transparent',               borde: 'var(--border-color, #334155)', emoji: '' },
    'Presente':  { bg: 'rgba(34,197,94,0.18)',      borde: '#22c55e',                      emoji: '✓' },
    'Ausente':   { bg: 'rgba(239,68,68,0.18)',       borde: '#ef4444',                      emoji: '✗' },
    'Permiso':   { bg: 'rgba(245,158,11,0.18)',      borde: '#f59e0b',                      emoji: '◐' }
};

function generarHtmlGridVista(fechaIso) {
    const data = JSON.parse(localStorage.getItem(claveAsistencia(fechaIso))) || {};
    
    let html = `
    <div class="admin-card" style="margin-bottom: 2rem;">
        <div class="admin-card-header">
            <h2 class="admin-card-title"><i class="fa-solid fa-calendar-days" style="margin-right:8px; color:var(--primary);"></i>Historial de Asistencia Detallado</h2>
            <button class="admin-btn admin-btn-secondary" onclick="volverAGestionPersonal()" style="padding: 6px 14px; font-size: 0.9rem; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-arrow-left"></i> Volver a Gestión de Personal
            </button>
        </div>

        <div style="margin: 1.5rem; display:flex; justify-content:space-between; align-items:center;">
            <div class="view-rrhh-header" style="display:flex; align-items:center; gap: 15px;">
                <strong style="color: var(--text-main); font-size:1rem;">Seleccione Fecha:</strong>
                <input type="date" id="viewRrhhDate" value="${fechaIso}" max="${obtenerFechaHoy().iso}" style="background: var(--bg-body, #0f172a); color: var(--text-main, #f1f5f9); border: 1px solid var(--border-color, #334155); padding: 8px 14px; border-radius: 6px; outline: none;">
            </div>
            <button class="admin-btn admin-btn-primary" onclick="guardarHistorialVista()" style="padding: 8px 16px; font-weight: bold; cursor: pointer; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-save"></i> Guardar Cambios
            </button>
        </div>

        <div style="margin: 0 1.5rem 1.5rem 1.5rem;">
            <div class="view-rrhh-grid-container">
                <div class="view-rrhh-time-header">
                    <div class="view-rrhh-hour-label emp-col">Empleado</div>`;
            
    VIEW_RRHH_HORAS.forEach(h => {
        html += `<div class="view-rrhh-hour-label">${h}:00</div>`;
    });
    
    html += `</div><div class="view-rrhh-grid-body" id="viewRrhhGridBody">`;

    if (personalData.length === 0) {
        html += `<div style="padding: 30px; text-align:center; color: var(--text-muted);">No hay personal registrado.</div>`;
    } else {
        const coloresAvatar = ['#0099cc','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6'];
        
        personalData.forEach((p, idx) => {
            const inic = p.nombre.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
            const color = coloresAvatar[idx % coloresAvatar.length];
            
            html += `<div class="view-rrhh-row">
                <div class="view-rrhh-emp-cell" title="${p.nombre}">
                    <div class="view-rrhh-avatar" style="background:${color};">${inic}</div>
                    <span class="view-rrhh-emp-name">${p.nombre}</span>
                </div>`;
                
            VIEW_RRHH_HORAS.forEach(h => {
                const estado = (data[p.nombre] && data[p.nombre][String(h)]) || '';
                const style = VIEW_RRHH_COLORES[estado] || VIEW_RRHH_COLORES[''];
                html += `<div class="view-rrhh-cell" 
                            data-emp="${p.nombre}" 
                            data-hora="${h}" 
                            data-estado="${estado}"
                            style="background:${style.bg}; border-color:${style.borde}; color:${style.borde};">
                            <span class="view-rrhh-cell-label">${style.emoji}</span>
                        </div>`;
            });
            html += `</div>`;
        });
    }
    
    html += `</div></div></div></div>`;
    return html;
}

/**
 * Muestra la vista a pantalla completa del historial interactivo.
 */
function mostrarVistaHistorial() {
    const isoHoy = obtenerFechaHoy().iso;
    
    const mainView = document.getElementById('rrhh-main-view');
    const historyView = document.getElementById('rrhh-history-view');
    if (!mainView || !historyView) return;
    
    mainView.style.display = 'none';
    historyView.style.display = 'block';
    
    renderizarContenidoVistaHistorial(isoHoy);
}

function renderizarContenidoVistaHistorial(fecha) {
    const historyView = document.getElementById('rrhh-history-view');
    if (!historyView) return;
    
    historyView.innerHTML = generarHtmlGridVista(fecha);
    
    const dateInput = document.getElementById('viewRrhhDate');
    const gridBody = document.getElementById('viewRrhhGridBody');
    
    // Refrescar al cambiar la fecha
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            const newDate = e.target.value;
            if (newDate) {
                renderizarContenidoVistaHistorial(newDate);
            }
        });
    }
    
    // Interacción con las celdas
    if (gridBody) {
        gridBody.querySelectorAll('.view-rrhh-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const actual = cell.dataset.estado;
                const idx = VIEW_RRHH_ESTADOS.indexOf(actual);
                const next = VIEW_RRHH_ESTADOS[(idx + 1) % VIEW_RRHH_ESTADOS.length];
                
                cell.dataset.estado = next;
                const style = VIEW_RRHH_COLORES[next];
                cell.style.background = style.bg;
                cell.style.borderColor = style.borde;
                cell.style.color = style.borde;
                cell.innerHTML = `<span class="view-rrhh-cell-label">${style.emoji}</span>`;
            });
        });
    }
}

/**
 * Guarda los datos directamente desde la vista del historial y muestra una notificación
 */
function guardarHistorialVista() {
    const dateInput = document.getElementById('viewRrhhDate');
    if (!dateInput) return;
    const fecha = dateInput.value;
    const newData = {};
    
    document.querySelectorAll('.view-rrhh-cell').forEach(cell => {
        const emp = cell.dataset.emp;
        const hora = cell.dataset.hora;
        const estado = cell.dataset.estado;
        
        if (!newData[emp]) newData[emp] = {};
        newData[emp][hora] = estado;
    });
    
    localStorage.setItem(claveAsistencia(fecha), JSON.stringify(newData));
    Toast.fire({ icon: 'success', title: 'Historial guardado exitosamente' });
    
    // Si la fecha coincide con hoy, re-renderizar la vista principal silenciosamente
    if (fecha === obtenerFechaHoy().iso) {
        // Almacenamos temporalmente el estado actual y luego restauramos
        const isHistoryVisible = document.getElementById('rrhh-history-view').style.display !== 'none';
        renderizarRRHH();
        if (isHistoryVisible) {
            document.getElementById('rrhh-main-view').style.display = 'none';
        }
    }
}

/**
 * Retorna a la vista principal de Gestión de Personal
 */
function volverAGestionPersonal() {
    const mainView = document.getElementById('rrhh-main-view');
    const historyView = document.getElementById('rrhh-history-view');
    if (!mainView || !historyView) return;
    
    historyView.style.display = 'none';
    mainView.style.display = 'block';
    
    // Asegurarse de que la vista principal tenga los datos más frescos
    renderizarRRHH();
}

function renderizarRRHH() {
    const tbody = document.getElementById("lista-personal-rrhh");
    if (!tbody) return;
    tbody.innerHTML = "";

    // Mostrar fecha de hoy en la UI
    const { iso, legible } = obtenerFechaHoy();
    const labelFecha = document.getElementById('rrhhFechaHoy');
    if (labelFecha) labelFecha.textContent = legible;

    // Cargar asistencias guardadas del día de hoy (si existen)
    const asistenciasHoy = JSON.parse(localStorage.getItem(claveAsistencia(iso))) || {};

    personalData.forEach((persona, index) => {
        // Calcular el estado diario más frecuente basado en el formato de horas
        let estadoHoy = 'Pendiente';
        const horas = asistenciasHoy[persona.nombre];
        
        if (horas) {
            if (typeof horas === 'string') {
                estadoHoy = horas; // Respaldo por si quedó algún dato sin migrar
            } else {
                // Contar ocurrencias de cada estado en las horas
                const conteo = { 'Presente': 0, 'Ausente': 0, 'Permiso': 0, '': 0 };
                Object.values(horas).forEach(v => {
                    if (conteo[v] !== undefined) conteo[v]++;
                });
                
                // Determinar el estado más frecuente
                let max = 0;
                let estadoMax = 'Pendiente';
                for (const [est, num] of Object.entries(conteo)) {
                    if (est !== '' && num > max) {
                        max = num;
                        estadoMax = est;
                    }
                }
                estadoHoy = max > 0 ? estadoMax : 'Pendiente';
            }
        }

        const badgeColor = estadoHoy === 'Presente' ? '#22c55e' : estadoHoy === 'Ausente' ? '#ef4444' : '#f59e0b';

        tbody.innerHTML += `
            <tr>
                <td><strong>${persona.nombre}</strong></td>
                <td>${persona.especialidad}</td>
                <td>
                    <select class="asistencia-select" data-index="${index}" style="padding: 5px 8px; border-radius: 6px; background: var(--card-bg); color: var(--text-color); border: 1px solid var(--border-color); font-size:0.9rem;">
                        <option value="Pendiente" ${estadoHoy==='Pendiente'?'selected':''}>⏳ Pendiente</option>
                        <option value="Presente" ${estadoHoy==='Presente'?'selected':''}>✅ Presente</option>
                        <option value="Ausente" ${estadoHoy==='Ausente'?'selected':''}>❌ Ausente</option>
                    </select>
                </td>
                <td style="text-align: right;">
                    <button class="admin-btn admin-badge-danger btn-eliminar-personal" data-index="${index}" style="padding: 4px 8px; border:none; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });

    // Botón: Guardar asistencia del día
    const btnGuardar = document.getElementById('btnGuardarAsistencia');
    if (btnGuardar) {
        btnGuardar.onclick = guardarAsistencia;
    }

    // Botón: Ver historial
    const btnHistorial = document.getElementById('btnVerHistorialAsistencia');
    if (btnHistorial) {
        btnHistorial.onclick = mostrarVistaHistorial;
    }

    // Eliminar personal
    document.querySelectorAll('.btn-eliminar-personal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const i = e.target.closest('.btn-eliminar-personal').dataset.index;
            Swal.fire({
                title: '¿Eliminar personal?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonText: 'Cancelar'
            }).then((res) => {
                if (res.isConfirmed) {
                    personalData.splice(i, 1);
                    localStorage.setItem('erp_personal', JSON.stringify(personalData));
                    renderizarRRHH();
                    Toast.fire({ icon: 'success', title: 'Eliminado' });
                }
            });
        });
    });
}

function registrarPersonal(event) {
    event.preventDefault();
    const nombre = document.getElementById("personalNombre").value.trim();
    const especialidad = document.getElementById("personalEspecialidad").value.trim();

    if (!nombre || !especialidad) {
        Swal.fire({ icon: 'error', title: 'Datos incompletos', text: 'Por favor completa nombre y especialidad.' });
        return;
    }

    // Evitar nombres duplicados
    if (personalData.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
        Swal.fire({ icon: 'warning', title: 'Ya existe', text: `Ya hay un registro con el nombre "${nombre}".` });
        return;
    }

    // Solo datos de perfil; la asistencia se guarda de forma independiente por día
    personalData.push({ nombre, especialidad });

    localStorage.setItem('erp_personal', JSON.stringify(personalData));
    renderizarRRHH();
    event.target.reset();
    Toast.fire({ icon: 'success', title: 'Personal registrado correctamente' });
}



