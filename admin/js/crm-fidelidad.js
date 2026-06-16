/* ==========================================
   LÓGICA DE CRM FIDELIZACIÓN (INTRANET HCALETA)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. BASE DE DATOS LOCAL DE PACIENTES EN PROGRAMA DE FIDELIDAD
    let loyaltyPatients = [
        { name: "Ana María Flores", dni: "42158932", tier: "Platino", badgeClass: "admin-badge-danger", points: 1240, lastVis: "08/06/2026" },
        { name: "Roberto Carlos Soto", dni: "43456789", tier: "Oro", badgeClass: "admin-badge-warning", points: 850, lastVis: "05/06/2026" },
        { name: "Luisa Fernanda Ríos", dni: "45678901", tier: "Plata", badgeClass: "admin-badge-info", points: 420, lastVis: "01/06/2026" },
        { name: "Juan Manuel Castro", dni: "40789012", tier: "Bronce", badgeClass: "admin-badge-success", points: 150, lastVis: "28/05/2026" }
    ];

    // =========================
// REGISTRAR PACIENTE
// =========================

    const registerPatientForm =
        document.getElementById("registerPatientForm");

    if (registerPatientForm) {

        registerPatientForm.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();

                const name =
                    document.getElementById("newPatientName")
                        .value.trim();

                const dni =
                    document.getElementById("newPatientDni")
                        .value.trim();

                if (!name || !dni) {
                    alert("Complete todos los campos.");
                    return;
                }

                if (!/^\d{8}$/.test(dni)) {
                    alert("El DNI debe contener exactamente 8 dígitos.");
                    return;
                }

                const existe = loyaltyPatients.some(
                    patient => patient.dni === dni
                );

                if (existe) {
                    alert("Ya existe un paciente con ese DNI.");
                    return;
                }

                loyaltyPatients.push({
                    name: name,
                    dni: dni,
                    tier: "Bronce",
                    badgeClass: "admin-badge-success",
                    points: 0,
                    lastVis: new Date().toLocaleDateString("es-PE")
                });

                renderPatientsTable();
                updateMetrics();

                registerPatientForm.reset();

                alert(
                    `Paciente registrado correctamente.\n\nNombre: ${name}\nDNI: ${dni}`
                );
            }
        );
    }


    // beneficios costos

    function getTier(points) {
        if (points >= 1000) {
            return {
                tier: "Platino",
                badgeClass: "admin-badge-danger"
            };
        }

        if (points >= 700) {
            return {
                tier: "Oro",
                badgeClass: "admin-badge-warning"
            };
        }

        if (points >= 300) {
            return {
                tier: "Plata",
                badgeClass: "admin-badge-info"
            };
        }

        return {
            tier: "Bronce",
            badgeClass: "admin-badge-success"
        };
    }


    // 2. HISTORIAL DE CANJES DE BENEFICIOS SIMULADO (MOCK DB CANJES)
    let redemptionsLog = [
        { name: "Ana María Flores", dni: "42158932", benefit: "Chequeo Preventivo Completo", pointsCost: 500, date: "Hoy, 2:10 PM" },
        { name: "Roberto Carlos Soto", dni: "43456789", benefit: "Descuento 20% Farmacia", pointsCost: 200, date: "Ayer, 4:30 PM" }
    ];

    // Elementos DOM
    const loyaltyPatientsTable = document.getElementById("loyaltyPatientsTable");
    const redemptionHistoryBody = document.getElementById("redemptionHistoryBody");
    const totalFidelityPointsEl = document.getElementById("totalFidelityPoints");
    const totalRedeemedBenefitsEl = document.getElementById("totalRedeemedBenefits");
    const redemptionForm = document.getElementById("redemptionForm");
    const pointsAssignmentForm =document.getElementById("pointsAssignmentForm");
    const totalPatientsEl =document.getElementById("totalPatients");

    // Costo de Puntos por Beneficios
    const benefitCosts = {
        "checkup": { name: "Chequeo Preventivo Completo", cost: 500 },
        "discount": { name: "Descuento 20% Farmacia", cost: 200 },
        "nutrition": { name: "Consulta Nutrición Gratis", cost: 300 },
        "vaccine": { name: "Vacuna Influenza Premium", cost: 400 }
    };

    //agregacion de puntos
    const pointRewards = {
        consultation: {
            name: "Consulta General",
            points: 50
        },

        laboratory: {
            name: "Laboratorio",
            points: 30
        },

        vaccine: {
            name: "Vacunación",
            points: 20
        },

        nutrition: {
            name: "Nutrición",
            points: 40
        }
    };



    // 3. ACTUALIZAR LAS MÉTRICAS DE PUNTOS TOTALES
    const updateMetrics = () => {
        const sumPoints = loyaltyPatients.reduce((sum, p) => sum + p.points, 0);
        if (totalFidelityPointsEl) {
            totalFidelityPointsEl.textContent = sumPoints.toLocaleString();
        }
        if (totalRedeemedBenefitsEl) {
            // El total de canjes de este mes será la cantidad de registros en el historial
            totalRedeemedBenefitsEl.textContent = (140 + redemptionsLog.length).toString();
        }
        if (totalPatientsEl) {
            totalPatientsEl.textContent =loyaltyPatients.length;
        }

    };

    // 4. RENDERIZAR LA TABLA DE PACIENTES DE FIDELIDAD
    const renderPatientsTable = () => {
        if (!loyaltyPatientsTable) return;
        // Ordenar de mayor a menor puntaje
        loyaltyPatients.sort((a, b) => b.points - a.points);

        loyaltyPatientsTable.innerHTML = "";

        loyaltyPatients.forEach(patient => {

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <strong>${patient.name}</strong><br>
                    <span style="font-size:0.8rem; color:var(--text-muted);">DNI ${patient.dni}</span>
                </td>
                <td><span class="admin-badge ${patient.badgeClass}">Nivel ${patient.tier}</span></td>
                <td><strong style="color: var(--primary);">${patient.points} pts</strong></td>
                <td>${patient.lastVis}</td>
                <td><button class="admin-btn admin-btn-secondary btn-detail" data-dni="${patient.dni}" style="padding: 4px 8px; font-size: 0.75rem;">Detalle</button></td>
            `;

            // Botón de detalle simula ver la ficha del paciente
            tr.querySelector(".btn-detail").addEventListener("click", () => {
                alert(`Ficha de Fidelidad de Paciente:\n\nNombre: ${patient.name}\nDNI: ${patient.dni}\nNivel: ${patient.tier}\nPuntos Acumulados: ${patient.points} pts\nÚltima Visita: ${patient.lastVis}`);
            });

            loyaltyPatientsTable.appendChild(tr);
        });
    };

    // 5. RENDERIZAR EL HISTORIAL DE CANJES
    const renderRedemptionsLog = () => {
        if (!redemptionHistoryBody) return;
        redemptionHistoryBody.innerHTML = "";

        redemptionsLog.forEach(log => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <strong>${log.name}</strong><br>
                    <span style="font-size:0.8rem; color:var(--text-muted);">DNI ${log.dni}</span>
                </td>
                <td><span class="admin-badge admin-badge-info">${log.benefit}</span></td>
                <td><strong style="color: var(--danger);">- ${log.pointsCost} pts</strong></td>
                <td>${log.date}</td>
            `;
            redemptionHistoryBody.appendChild(tr);
        });
    };

    // 6. PROCESAR CANJE DESDE EL FORMULARIO (INTERACTIVO)

    if (redemptionForm) {
        redemptionForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const dniInput = document.getElementById("patientDni").value.trim();
            const benefitKey = document.getElementById("benefitSelect").value;

            // Validar DNI
            if (!/^\d{8}$/.test(dniInput)) {
                alert("Error: Por favor, ingrese un número de DNI válido (8 dígitos numéricos).");
                return;
            }

            // Buscar si el paciente está afiliado
            const patient = loyaltyPatients.find(p => p.dni === dniInput);
            if (!patient) {
                alert(`Error: El paciente con DNI ${dniInput} no se encuentra registrado en el programa de fidelización.`);
                return;
            }

            // Validar beneficio seleccionado
            const benefit = benefitCosts[benefitKey];
            if (!benefit) {
                alert("Error: Por favor, seleccione un beneficio válido.");
                return;
            }

            // Validar si tiene suficientes puntos
            if (patient.points < benefit.cost) {
                alert(`Error de Canje:\n\nEl paciente ${patient.name} tiene ${patient.points} puntos, pero el beneficio "${benefit.name}" requiere ${benefit.cost} puntos.\n\nFaltan ${benefit.cost - patient.points} puntos.`);
                return;
            }
            // Realizar débito de puntos
            patient.points -= benefit.cost;

            const tierData = getTier(patient.points);

            patient.tier = tierData.tier;
            patient.badgeClass = tierData.badgeClass;




            // Agregar registro al historial de canjes
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const newRedemption = {
                name: patient.name,
                dni: patient.dni,
                benefit: benefit.name,
                pointsCost: benefit.cost,
                date: `Hoy, ${timeStr}`
            };

            redemptionsLog.unshift(newRedemption);

            // Mostrar confirmación
            alert(`¡Canje Procesado con Éxito!\n\nPaciente: ${patient.name}\nBeneficio: ${benefit.name}\nPuntos Debitados: -${benefit.cost} pts\nPuntos Restantes: ${patient.points} pts`);

            // Limpiar formulario
            redemptionForm.reset();

            // Re-renderizar interfaces
            renderPatientsTable();
            renderRedemptionsLog();
            updateMetrics();
        });
    }

    if (pointsAssignmentForm) {
        pointsAssignmentForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const dniInput =
                document.getElementById("assignPatientDni")
                    .value.trim();

            const activityKey =
                document.getElementById("activitySelect")
                    .value;
            // Validar DNI
            if (!/^\d{8}$/.test(dniInput)) {
                alert("Error: Ingrese un DNI válido.");
                return;
            }
            // Buscar paciente
            const patient =
                loyaltyPatients.find(
                    p => p.dni === dniInput
                );

            if (!patient) {
                alert(
                    `El paciente con DNI ${dniInput} no está registrado.`
                );
                return;
            }
            // Validar actividad
            const activity =
                pointRewards[activityKey];
            if (!activity) {
                alert(
                    "Seleccione una actividad válida."
                );
                return;
            }
            // Sumar puntos
            patient.points += activity.points;
            // Actualizar nivel
            const tierData =
                getTier(patient.points);
            patient.tier =
                tierData.tier;
            patient.badgeClass =
                tierData.badgeClass;
            // Mensaje
            alert(`¡Puntos asignados con éxito! Paciente: ${patient.name} Actividad: ${activity.name} Puntos ganados:+${activity.points} Total actual: ${patient.points} pts`
            );
            // Limpiar formulario
            pointsAssignmentForm.reset();
            // Actualizar pantalla
            renderPatientsTable();
            updateMetrics();
        });
    }

    // 7. INICIALIZAR EL GRÁFICO DE SATISFACCIÓN (CHART.JS LINE CHART)
    const initChart = () => {
        const ctx = document.getElementById("satisfactionChart");
        if (!ctx) return;

        const isDarkMode = document.body.classList.contains("dark-mode");
        const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
        const textColor = isDarkMode ? "#94a3b8" : "#64748b";

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [{
                    label: 'Índice de Satisfacción (CSAT %)',
                    data: [91.2, 92.5, 90.8, 93.4, 94.1, 94.8],
                    borderColor: '#0099cc',
                    backgroundColor: 'rgba(0, 153, 204, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#0b2240',
                    pointBorderColor: '#0099cc',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        padding: 10,
                        backgroundColor: isDarkMode ? '#1e293b' : '#0b2240',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        callbacks: {
                            label: function(context) {
                                return ` Satisfacción: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: 85,
                        max: 100,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                weight: 600
                            }
                        }
                    }
                }
            }
        });
    };

    // Inicialización al cargar
    renderPatientsTable();
    renderRedemptionsLog();
    updateMetrics();
    initChart();
});


