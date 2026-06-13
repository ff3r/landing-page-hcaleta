/* =========================================================================
   PLANTILLAS HTML (Vistas Dinámicas) - Hospital La Caleta
   ========================================================================= */

const vistasPlantillas = {
    dashboard: "", // Se llenará dinámicamente al cargar la página
    
    inventario: `
        <div class="admin-card" style="margin-bottom: 2rem;">
            <div class="admin-card-header">
                <h2 class="admin-card-title">Gestión Completa de Inventario</h2>
                <button class="admin-btn admin-btn-secondary" id="btnVolverDashboard" style="padding: 6px 12px; font-size: 0.9rem;">
                    <i class="fa-solid fa-arrow-left"></i> Volver
                </button>
            </div>
            
            <div class="form-container" style="padding: 1.5rem; border-bottom: 1px solid var(--border-color, #e2e8f0); background-color: var(--card-bg);">
                <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: var(--text-color);">Añadir Nuevo Recurso</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
                    <input type="text" id="nuevoNombreRecurso" placeholder="Nombre del recurso" required style="flex: 2; min-width: 200px; padding: 10px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; background-color: var(--card-bg, #fff); color: var(--text-color, #333);">
                    <input type="number" id="nuevoCantidadStock" placeholder="Cantidad" required style="flex: 1; min-width: 100px; padding: 10px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; background-color: var(--card-bg, #fff); color: var(--text-color, #333);">
                    <button class="admin-btn admin-btn-primary" id="btnAgregarRecursoView" style="padding: 10px 20px; font-weight: bold; cursor: pointer;">Añadir al Inventario</button>
                </div>
            </div>

            <div class="table-responsive" style="max-height: 60vh; overflow-y: auto;">
                <table class="admin-table">
                    <thead style="position: sticky; top: 0; background-color: var(--card-bg); z-index: 10;">
                        <tr>
                            <th>Recurso</th>
                            <th>Categoría</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th style="text-align: right;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="lista-inventario-vista-completa">
                        <!-- Renderizado por JS -->
                    </tbody>
                </table>
            </div>
        </div>
    `,

    citas: `
        <div class="admin-card" style="margin-bottom: 2rem;">
            <div class="admin-card-header">
                <h2 class="admin-card-title">Agenda Completa de Citas</h2>
                <button class="admin-btn admin-btn-secondary" id="btnVolverDashboard" style="padding: 6px 12px; font-size: 0.9rem;">
                    <i class="fa-solid fa-arrow-left"></i> Volver
                </button>
            </div>
            
            <div class="table-responsive" style="max-height: 65vh; overflow-y: auto;">
                <table class="admin-table">
                    <thead style="position: sticky; top: 0; background-color: var(--card-bg); z-index: 10;">
                        <tr>
                            <th>Hora</th>
                            <th>Paciente</th>
                            <th>Especialidad</th>
                            <th>Prioridad</th>
                            <th>Estado de Pago</th>
                            <th style="text-align: right;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="lista-citas-vista-completa">
                        <!-- Renderizado por JS -->
                    </tbody>
                </table>
            </div>
        </div>
    `,

    finanzas: `
        <div class="admin-card" style="margin-bottom: 2rem;">
            <div class="admin-card-header">
                <h2 class="admin-card-title">Dashboard de Finanzas (Tesorería)</h2>
            </div>
            <div style="display: flex; gap: 1rem; margin: 1.5rem; flex-wrap: wrap;">
                <div class="admin-card metric-card" style="flex: 1; min-width: 200px;">
                    <div class="metric-icon success-bg"><i class="fa-solid fa-arrow-trend-up"></i></div>
                    <div class="metric-details">
                        <h3 id="finanzasIngresosTotales">S/ 0.00</h3>
                        <p>Ingresos Totales</p>
                    </div>
                </div>
                <div class="admin-card metric-card" style="flex: 1; min-width: 200px;">
                    <div class="metric-icon danger-bg"><i class="fa-solid fa-arrow-trend-down"></i></div>
                    <div class="metric-details">
                        <h3 id="finanzasEgresosTotales">S/ 0.00</h3>
                        <p>Egresos Totales</p>
                    </div>
                </div>
                <div class="admin-card metric-card" style="flex: 1; min-width: 200px;">
                    <div class="metric-icon primary-bg"><i class="fa-solid fa-scale-balanced"></i></div>
                    <div class="metric-details">
                        <h3 id="finanzasBalanceBruto">S/ 0.00</h3>
                        <p>Balance Bruto</p>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 2rem; margin: 1.5rem; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: var(--text-color);">Ingresos por Especialidad</h3>
                    <div class="chart-wrapper" style="height: 300px;">
                        <canvas id="finanzasChart"></canvas>
                    </div>
                </div>
                
                <div style="flex: 1; min-width: 300px;">
                    <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: var(--text-color);">Registrar Egreso Manual</h3>
                    <form id="formEgreso" onsubmit="registrarEgreso(event)" style="display: flex; flex-direction: column; gap: 1rem;">
                        <input type="text" id="egresoConcepto" placeholder="Concepto (Ej. Pago de Luz)" required style="padding: 10px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; background-color: var(--card-bg, #fff); color: var(--text-color, #333);">
                        <input type="number" step="0.01" id="egresoMonto" placeholder="Monto (S/.)" required style="padding: 10px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; background-color: var(--card-bg, #fff); color: var(--text-color, #333);">
                        <button type="submit" class="admin-btn admin-btn-primary" style="padding: 10px 20px; font-weight: bold; cursor: pointer;">Registrar Egreso</button>
                    </form>
                </div>
            </div>
            
            <div class="table-responsive" style="max-height: 40vh; overflow-y: auto; border-top: 1px solid var(--border-color, #e2e8f0);">
                <table class="admin-table">
                    <thead style="position: sticky; top: 0; background-color: var(--card-bg); z-index: 10;">
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Concepto</th>
                            <th>Categoría</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody id="lista-movimientos-finanzas">
                        <!-- Renderizado por JS -->
                    </tbody>
                </table>
            </div>
        </div>
    `,

    rrhh: `
        <div class="admin-card" style="margin-bottom: 2rem;">
            <div class="admin-card-header">
                <h2 class="admin-card-title">Recursos Humanos y Comisiones</h2>
            </div>
            
            <div style="display: flex; gap: 2rem; margin: 1.5rem; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: var(--text-color);">Añadir Personal</h3>
                    <form id="formPersonal" onsubmit="registrarPersonal(event)" style="display: flex; flex-direction: column; gap: 1rem;">
                        <input type="text" id="personalNombre" placeholder="Nombre completo" required style="padding: 10px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; background-color: var(--card-bg, #fff); color: var(--text-color, #333);">
                        <div style="display: flex; gap: 1rem;">
                            <input type="text" id="personalEspecialidad" placeholder="Especialidad" required style="flex: 2; padding: 10px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; background-color: var(--card-bg, #fff); color: var(--text-color, #333);">
                            <input type="number" id="personalComision" placeholder="% Comisión" required min="0" max="100" style="flex: 1; padding: 10px; border: 1px solid var(--border-color, #ccc); border-radius: 6px; background-color: var(--card-bg, #fff); color: var(--text-color, #333);">
                        </div>
                        <button type="submit" class="admin-btn admin-btn-primary" style="padding: 10px 20px; font-weight: bold; cursor: pointer;">Registrar Personal</button>
                    </form>
                </div>
            </div>

            <div class="table-responsive" style="max-height: 40vh; overflow-y: auto; border-top: 1px solid var(--border-color, #e2e8f0);">
                <table class="admin-table">
                    <thead style="position: sticky; top: 0; background-color: var(--card-bg); z-index: 10;">
                        <tr>
                            <th>Nombre</th>
                            <th>Especialidad</th>
                            <th>% Comisión</th>
                            <th>Asistencia Hoy</th>
                            <th>Comisiones Generadas</th>
                            <th style="text-align: right;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="lista-personal-rrhh">
                        <!-- Renderizado por JS -->
                    </tbody>
                </table>
            </div>
        </div>
    `
};
