
document.addEventListener("DOMContentLoaded", () => {

    const datos = {
        todos: {
            promedio: 4.6,
            usuarios: 1254,
            satisfaccion: 92,
            estrellas: [12, 25, 75, 230, 912]
        },

        emergencia: {
            promedio: 4.8,
            usuarios: 430,
            satisfaccion: 95,
            estrellas: [2, 5, 20, 80, 323]
        },

        consulta: {
            promedio: 4.5,
            usuarios: 350,
            satisfaccion: 90,
            estrellas: [4, 10, 20, 80, 236]
        },

        laboratorio: {
            promedio: 4.4,
            usuarios: 250,
            satisfaccion: 88,
            estrellas: [3, 8, 18, 70, 151]
        },

        farmacia: {
            promedio: 4.2,
            usuarios: 224,
            satisfaccion: 85,
            estrellas: [3, 12, 17, 60, 132]
        },

        pediatria: {
            promedio: 4.5,
            usuarios: 180,
            satisfaccion: 91,
            estrellas: [2, 5, 20, 60, 93]
        }
    };

    const ctxGeneral =
        document.getElementById("generalChart").getContext("2d");

    const ctxServices =
        document.getElementById("servicesChart").getContext("2d");


    const textColor =
    document.body.classList.contains("dark-mode")
        ? "#ffffff"
        : "#333333";


    let generalChart = new Chart(ctxGeneral, {
    type: "doughnut",
    data: {
        labels: [
            "Satisfechos",
            "No satisfechos"
        ],
        datasets: [{
            data: [92, 8]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        }
    }
});

    let servicesChart = new Chart(ctxServices, {
        type: "bar",
        data: {
            labels: [
                "1★",
                "2★",
                "3★",
                "4★",
                "5★"
            ],
            datasets: [{
                label: "Calificaciones",
                data: datos.todos.estrellas
            }]
        },
        options: {
            responsive: true
        }
    });

    document.querySelectorAll(".stats-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                document
                    .querySelectorAll(".stats-btn")
                    .forEach(b => b.classList.remove("active"));

                btn.classList.add("active");

                const servicio =
                    btn.dataset.service;

                const info =
                    datos[servicio];

                document.getElementById("totalUsers")
                    .textContent = info.usuarios;

                document.getElementById("averageRating")
                    .textContent = info.promedio;

                document.getElementById("satisfactionRate")
                    .textContent =
                    info.satisfaccion + "%";

                generalChart.data.datasets[0].data = [
                    info.satisfaccion,
                    100 - info.satisfaccion
                ];

                generalChart.update();

                servicesChart.data.datasets[0].data =
                    info.estrellas;

                servicesChart.update();
            });

        });



    /* =========================
       LEER ESTADISTICAS GUARDADAS
    ========================= */

    const estadisticasGuardadas = JSON.parse(
        localStorage.getItem("estadisticasHospital")
    );


    if(estadisticasGuardadas){

        document.getElementById("totalUsers")
            .textContent =
            estadisticasGuardadas.total;

        document.getElementById("averageRating")
            .textContent =
            estadisticasGuardadas.promedio;


        const satisfechos =
            (
                (
                    estadisticasGuardadas.conteo[4] +
                    estadisticasGuardadas.conteo[5]
                )
                /
                estadisticasGuardadas.total
            ) * 100;


        document.getElementById("satisfactionRate")
            .textContent =
            satisfechos.toFixed(0) + "%";


        generalChart.data.datasets[0].data = [
            satisfechos,
            100 - satisfechos
        ];

        generalChart.update();


        servicesChart.data.datasets[0].data = [

            estadisticasGuardadas.conteo[1],
            estadisticasGuardadas.conteo[2],
            estadisticasGuardadas.conteo[3],
            estadisticasGuardadas.conteo[4],
            estadisticasGuardadas.conteo[5]

        ];

        servicesChart.update();

    }


});


