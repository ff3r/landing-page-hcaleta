/* ==========================================
   LÓGICA DEL CRM CORREO (INTRANET HCALETA)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Base de datos de correos simulados
    const emailsData = {
        "1": {
            sender: "Carlos Mendoza (Paciente)",
            email: "carlos.mendoza@gmail.com",
            time: "Hoy, 4:15 PM",
            subject: "Duda sobre reprogramación de cita de Cardiología",
            body: `<p>Estimado equipo de atención del Hospital La Caleta,</p>
                   <br>
                   <p>Le escribo porque tengo una cita agendada para este viernes 12 de junio a las 9:00 AM con el cardiólogo. Lamentablemente, se me ha presentado una urgencia familiar y me será imposible asistir a esa hora.</p>
                   <p>Quisiera solicitarles, por favor, si es posible reprogramar la cita para el próximo lunes por la tarde o algún horario disponible la siguiente semana.</p>
                   <br>
                   <p>Agradezco de antemano su atención.</p>
                   <br>
                   <p>Atentamente,<br><strong>Carlos Mendoza</strong><br>DNI: 47859612</p>`
        },
        "2": {
            sender: "María Espinoza (Paciente)",
            email: "maria.espinoza94@gmail.com",
            time: "Hoy, 2:30 PM",
            subject: "Reclamación de resultados de análisis clínicos",
            body: `<p>Hola, buenas tardes.</p>
                   <br>
                   <p>El día de ayer por la mañana me realicé unos exámenes de laboratorio clínicos (perfil lipídico y hemograma) en su sede. Al momento de pagar me indicaron que los resultados serían enviados automáticamente a mi correo en un plazo de 24 horas.</p>
                   <p>Ya han pasado más de 30 horas y aún no he recibido ningún documento en mi bandeja de entrada ni en spam. Agradecería que revisen mi caso a la brevedad, ya que tengo cita médica mañana y requiero esos resultados.</p>
                   <br>
                   <p>Datos adicionales:<br>Paciente: María del Carmen Espinoza Saldaña<br>DNI: 48956231</p>`
        },
        "3": {
            sender: "Dr. Alejandro Pérez",
            email: "aperez@hcaleta.gob.pe",
            time: "Ayer, 6:00 PM",
            subject: "Solicitud de vacaciones - Área de Pediatría",
            body: `<p>Estimado Director Médico y Recursos Humanos,</p>
                   <br>
                   <p>Por medio del presente correo, presento formalmente mi solicitud de vacaciones correspondientes al periodo 2025-2026. Mi propuesta es tomarlas a partir del próximo lunes 15 de julio hasta el martes 30 de julio, reincorporándome a mis funciones el miércoles 31 de julio.</p>
                   <p>He coordinado previamente con la Dra. Milagros Torres para que cubra mis turnos de guardia externa y las consultas programadas durante mi ausencia, por lo que el área quedará plenamente cubierta.</p>
                   <br>
                   <p>Quedo a la espera de su respuesta para proceder con la firma de la documentación.</p>
                   <br>
                   <p>Atentamente,<br><strong>Dr. Alejandro Pérez V.</strong><br>Especialista en Pediatría - CNP 45896</p>`
        }
    };

    const emailItems = document.querySelectorAll(".email-item");
    const readSender = document.getElementById("readSender");
    const readSenderEmail = document.getElementById("readSenderEmail");
    const readTime = document.getElementById("readTime");
    const readSubject = document.getElementById("readSubject");
    const readBody = document.getElementById("readBody");
    const avatarInitial = document.querySelector(".sender-avatar-initial");

    // 1. Cambiar y Visualizar Correo Seleccionado
    emailItems.forEach(item => {
        item.addEventListener("click", () => {
            // Desactivar previos
            emailItems.forEach(i => i.classList.remove("active"));
            
            // Activar actual
            item.classList.add("active");
            item.classList.remove("unread"); // Marcar como leído

            const emailId = item.getAttribute("data-id");
            const data = emailsData[emailId];

            if (data) {
                // Actualizar panel de lectura
                readSender.textContent = data.sender;
                readSenderEmail.textContent = data.email;
                readTime.textContent = data.time;
                readSubject.textContent = data.subject;
                readBody.innerHTML = data.body;
                
                // Inicial del remitente
                avatarInitial.textContent = data.sender.charAt(0).toUpperCase();
            }
        });
    });

    // 2. Control de Ventana Modal (Compose Email)
    const btnCompose = document.getElementById("btnCompose");
    const composeModal = document.getElementById("composeModal");
    const btnCloseCompose = document.getElementById("btnCloseCompose");
    const btnCancelCompose = document.getElementById("btnCancelCompose");
    const composeForm = document.getElementById("composeForm");

    if (btnCompose && composeModal) {
        btnCompose.addEventListener("click", () => {
            composeModal.classList.remove("hidden");
        });
    }

    const hideModal = () => {
        composeModal.classList.add("hidden");
        composeForm.reset();
    };

    if (btnCloseCompose) btnCloseCompose.addEventListener("click", hideModal);
    if (btnCancelCompose) btnCancelCompose.addEventListener("click", hideModal);

    // Cerrar si hace clic fuera del modal
    window.addEventListener("click", (e) => {
        if (e.target === composeModal) {
            hideModal();
        }
    });

    // 3. Envío de Correo (Simulado)
    if (composeForm) {
        composeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const to = document.getElementById("toEmail").value;
            const subject = document.getElementById("subjectEmail").value;
            const body = document.getElementById("bodyEmail").value;

            // Simulación de envío
            alert(`¡Correo enviado con éxito a: ${to}!\nAsunto: ${subject}`);
            
            // Cerrar modal
            hideModal();
        });
    }

    // 4. Cambiar carpetas (Estético)
    const folderItems = document.querySelectorAll(".folder-item");
    folderItems.forEach(folder => {
        folder.addEventListener("click", (e) => {
            e.preventDefault();
            folderItems.forEach(f => f.classList.remove("active"));
            folder.classList.add("active");
        });
    });
});
