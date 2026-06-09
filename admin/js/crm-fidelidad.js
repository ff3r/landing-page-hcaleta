/* ==========================================
   LÓGICA DE CRM FIDELIZACIÓN (INTRANET HCALETA)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar Gráfico de Satisfacción Trimestral (Chart.js Line Chart)
    const ctx = document.getElementById("satisfactionChart");

    if (ctx) {
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
    }

    // 2. Formulario de Canje de Puntos de Salud
    const redemptionForm = document.getElementById("redemptionForm");
    if (redemptionForm) {
        redemptionForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const dni = document.getElementById("patientDni").value.trim();
            const benefit = document.getElementById("benefitSelect");
            const benefitText = benefit.options[benefit.selectedIndex].text;

            // Validar DNI (8 dígitos en Perú)
            if (!/^\d{8}$/.test(dni)) {
                alert("Por favor, ingrese un número de DNI válido (8 dígitos numéricos).");
                return;
            }

            // Simulación de Canje exitoso
            alert(`¡Canje Procesado con Éxito!\n\nPaciente DNI: ${dni}\nBeneficio: ${benefitText}\nLos puntos han sido debitados de su cuenta.`);
            
            // Limpiar formulario
            redemptionForm.reset();
        });
    }
});
