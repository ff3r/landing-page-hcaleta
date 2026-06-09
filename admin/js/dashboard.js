/* ==========================================
   LÓGICA DEL ERP DASHBOARD (INTRANET HCALETA)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar Gráfico de Admisiones por Especialidad (Chart.js)
    const ctx = document.getElementById("admissionsChart");
    
    if (ctx) {
        // Colores temáticos para el gráfico según el tema
        const isDarkMode = document.body.classList.contains("dark-mode");
        const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
        const textColor = isDarkMode ? "#94a3b8" : "#64748b";

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Emergencia', 'Pediatría', 'Ginecología', 'Cardiología', 'Odontología', 'Med. General'],
                datasets: [{
                    label: 'Admisiones de Pacientes',
                    data: [65, 45, 30, 25, 18, 55],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.85)', // Emergencia (Danger)
                        'rgba(0, 153, 204, 0.85)', // Pediatría (Primary)
                        'rgba(46, 196, 182, 0.85)', // Ginecología (Success)
                        'rgba(255, 159, 28, 0.85)', // Cardiología (Warning)
                        'rgba(148, 163, 184, 0.85)', // Odontología (Muted)
                        'rgba(139, 92, 246, 0.85)'  // Medicina General (Purple)
                    ],
                    borderWidth: 0,
                    borderRadius: 6
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
                        borderColor: isDarkMode ? '#334155' : 'transparent',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                family: "'Segoe UI', sans-serif"
                            }
                        },
                        border: {
                            dash: [4, 4]
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                family: "'Segoe UI', sans-serif",
                                weight: 600
                            }
                        }
                    }
                }
            }
        });
    }
});
