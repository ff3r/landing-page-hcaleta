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
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody id="lista-citas-vista-completa">
                        <!-- Renderizado por JS -->
                    </tbody>
                </table>
            </div>
        </div>
    `
};
