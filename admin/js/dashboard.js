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
    { nombre: "Juan Pérez", especialidad: "Cardiología", comision: 30, asistencia: "Presente" },
    { nombre: "María López", especialidad: "Pediatría", comision: 25, asistencia: "Pendiente" }
];
let personalData = JSON.parse(localStorage.getItem('erp_personal')) || defaultPersonal;
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
 * LÓGICA VISTA: RRHH
 * =======================================================
 */
function calcularComisiones() {
    let comisionesTotales = {};
    
    // Filtrar citas que están 'Pagadas'
    const citasPagadas = citasProgramadas.filter(c => c.flujoPago === 'Pagado');
    
    // Contar por especialidad. (En un caso real se ligaría al médico por nombre/ID, aquí simulamos que el doctor cobra todo lo de su especialidad)
    citasPagadas.forEach(cita => {
        if (!comisionesTotales[cita.especialidad]) {
            comisionesTotales[cita.especialidad] = 0;
        }
        comisionesTotales[cita.especialidad] += 50.00; // Ingreso estándar
    });

    return comisionesTotales;
}

function renderizarRRHH() {
    const tbody = document.getElementById("lista-personal-rrhh");
    if (!tbody) return;
    tbody.innerHTML = "";

    const comisionesMontoBase = calcularComisiones();

    personalData.forEach((persona, index) => {
        let badgeAsistencia = persona.asistencia === 'Presente' ? 'admin-badge-success' : 'admin-badge-warning';
        
        // Monto base generado por su especialidad
        let montoGenerado = comisionesMontoBase[persona.especialidad] || 0;
        let comisionCalculada = (montoGenerado * (persona.comision / 100)).toFixed(2);

        tbody.innerHTML += `
            <tr>
                <td><strong>${persona.nombre}</strong></td>
                <td>${persona.especialidad}</td>
                <td>${persona.comision}%</td>
                <td>
                    <select class="asistencia-select" data-index="${index}" style="padding: 4px; border-radius: 4px; background: var(--card-bg); color: var(--text-color); border: 1px solid var(--border-color);">
                        <option value="Pendiente" ${persona.asistencia==='Pendiente'?'selected':''}>Pendiente</option>
                        <option value="Presente" ${persona.asistencia==='Presente'?'selected':''}>Presente</option>
                        <option value="Ausente" ${persona.asistencia==='Ausente'?'selected':''}>Ausente</option>
                    </select>
                </td>
                <td><span class="text-success" style="font-weight:bold;">S/ ${comisionCalculada}</span> (de S/ ${montoGenerado})</td>
                <td style="text-align: right;">
                    <button class="admin-btn admin-badge-danger btn-eliminar-personal" data-index="${index}" style="padding: 4px 8px; border:none; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });

    // Delegar eventos solo para esta tabla
    document.querySelectorAll('.asistencia-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const i = e.target.dataset.index;
            personalData[i].asistencia = e.target.value;
            localStorage.setItem('erp_personal', JSON.stringify(personalData));
            Toast.fire({ icon: 'success', title: 'Asistencia actualizada' });
            renderizarRRHH();
        });
    });

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
    const comision = parseFloat(document.getElementById("personalComision").value);

    if (!nombre || !especialidad || isNaN(comision)) {
        Swal.fire({ icon: 'error', title: 'Datos incompletos' });
        return;
    }

    personalData.push({
        nombre: nombre,
        especialidad: especialidad,
        comision: comision,
        asistencia: "Pendiente"
    });

    localStorage.setItem('erp_personal', JSON.stringify(personalData));
    renderizarRRHH();
    event.target.reset();
    Toast.fire({ icon: 'success', title: 'Personal registrado' });
}

