/* ==========================================
   LÓGICA DEL CRM CORREO (INTRANET HCALETA)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. BASE DE DATOS DE CORREOS SIMULADOS
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

    // 2. BASE DE DATOS DE PACIENTES SIMULADA (MOCK DATABASE LOCAL)
    const patientsData = [
        {
            id: "1",
            name: "Carlos Mendoza",
            dni: "47859612",
            age: 34,
            phone: "987-654-321",
            address: "Jr. Alfonso Ugarte 120, Chimbote",
            history: "Asma crónica. No reporta alergias a medicamentos.",
            summary: "Paciente en control activo por Especialidad de Cardiología.",
            visits: [
                { date: "12/06/2026", desc: "Cita programada (Reprogramación solicitada)", doctor: "Dr. Roberto Díaz - Cardiología" },
                { date: "05/04/2026", desc: "Chequeo Preventivo Anual", doctor: "Dra. Elena Ramos - Medicina General" },
                { date: "10/01/2026", desc: "Consulta externa por arritmia leve", doctor: "Dr. Roberto Díaz - Cardiología" }
            ]
        },
        {
            id: "2",
            name: "María Espinoza",
            dni: "48956231",
            age: 28,
            phone: "954-123-789",
            address: "Av. Pardo 840, Chimbote",
            history: "Alérgica a la Penicilina. Gastritis leve en tratamiento.",
            summary: "Paciente en espera de resultados clínicos de laboratorio.",
            visits: [
                { date: "08/06/2026", desc: "Toma de muestras - Laboratorio Clínico", doctor: "Lic. Clara Flores - Patología" },
                { date: "15/02/2026", desc: "Chequeo ginecológico y papanicolau", doctor: "Dra. Lucía Castro - Ginecología" }
            ]
        },
        {
            id: "3",
            name: "Jorge Ramírez",
            dni: "41258963",
            age: 52,
            phone: "923-456-789",
            address: "Urb. Buenos Aires H-21, Nuevo Chimbote",
            history: "Hipertensión arterial controlada. Obesidad Grado I.",
            summary: "Paciente regular de programas preventivos de hipertensión.",
            visits: [
                { date: "22/05/2026", desc: "Control Trimestral de Presión Arterial", doctor: "Dr. Alejandro Pérez - Medicina General" },
                { date: "14/12/2025", desc: "Examen de agudeza visual y refracción", doctor: "Dra. Sofía Véliz - Oftalmología" }
            ]
        }
    ];

    // Elementos DOM
    const emailList = document.getElementById("emailList");
    const patientList = document.getElementById("patientList");
    const emailReadingPane = document.getElementById("paneContent");
    const patientDetailsPane = document.getElementById("patientPaneContent");
    
    const readSender = document.getElementById("readSender");
    const readSenderEmail = document.getElementById("readSenderEmail");
    const readTime = document.getElementById("readTime");
    const readSubject = document.getElementById("readSubject");
    const readBody = document.getElementById("readBody");
    const avatarInitial = document.querySelector(".sender-avatar-initial");

    const searchBarInput = document.getElementById("searchBarInput");
    let currentFolder = "inbox"; // Carpeta activa por defecto

    // 3. CAMBIAR Y VISUALIZAR CORREO SELECCIONADO
    const bindEmailEvents = () => {
        const emailItems = document.querySelectorAll(".email-item");
        emailItems.forEach(item => {
            item.addEventListener("click", () => {
                emailItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                item.classList.remove("unread");

                const emailId = item.getAttribute("data-id");
                const data = emailsData[emailId];

                if (data) {
                    readSender.textContent = data.sender;
                    readSenderEmail.textContent = data.email;
                    readTime.textContent = data.time;
                    readSubject.textContent = data.subject;
                    readBody.innerHTML = data.body;
                    avatarInitial.textContent = data.sender.charAt(0).toUpperCase();
                }
            });
        });
    };
    bindEmailEvents(); // Inicial

    // 4. CONTROL DEL MÓDULO DE PACIENTES (DB SIMULADA)
    const renderPatientsList = (filterText = "") => {
        patientList.innerHTML = "";
        const query = filterText.toLowerCase().trim();
        
        const filtered = patientsData.filter(p => 
            p.name.toLowerCase().includes(query) || p.dni.includes(query)
        );

        if (filtered.length === 0) {
            patientList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">Ningún paciente encontrado.</div>`;
            return;
        }

        filtered.forEach((patient, index) => {
            const item = document.createElement("div");
            item.className = `patient-item ${index === 0 ? 'active' : ''}`;
            item.setAttribute("data-id", patient.id);
            
            item.innerHTML = `
                <div class="patient-item-header">
                    <span class="patient-name">${patient.name}</span>
                    <span class="patient-dni-badge">DNI ${patient.dni}</span>
                </div>
                <p class="patient-summary">${patient.summary}</p>
            `;

            item.addEventListener("click", () => {
                document.querySelectorAll(".patient-item").forEach(p => p.classList.remove("active"));
                item.classList.add("active");
                showPatientDetails(patient.id);
            });

            patientList.appendChild(item);
        });

        // Cargar por defecto el primer paciente de la lista si hay
        if (filtered.length > 0) {
            showPatientDetails(filtered[0].id);
        }
    };

    const showPatientDetails = (id) => {
        const patient = patientsData.find(p => p.id === id);
        if (!patient) return;

        document.getElementById("patientDetailName").textContent = patient.name;
        document.getElementById("patientDetailDni").textContent = `DNI: ${patient.dni}`;
        document.getElementById("patientAvatar").textContent = patient.name.charAt(0).toUpperCase();
        document.getElementById("patientAge").textContent = `${patient.age} años`;
        document.getElementById("patientPhone").textContent = patient.phone;
        document.getElementById("patientAddress").textContent = patient.address;
        document.getElementById("patientMedicalHistory").textContent = patient.history;

        // Renderizar línea de tiempo de visitas
        const timeline = document.getElementById("patientVisitsTimeline");
        timeline.innerHTML = "";
        patient.visits.forEach(visit => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="visit-date">${visit.date}</div>
                <div class="visit-desc">${visit.desc}</div>
                <div class="visit-doctor">${visit.doctor}</div>
            `;
            timeline.appendChild(li);
        });
    };

    // 5. CAMBIO DE CARPETAS (INBOX / ENVIADOS / PACIENTES)
    const folderItems = document.querySelectorAll(".folder-item");
    folderItems.forEach(folder => {
        folder.addEventListener("click", (e) => {
            e.preventDefault();
            folderItems.forEach(f => f.classList.remove("active"));
            folder.classList.add("active");

            const folderName = folder.getAttribute("data-folder");
            currentFolder = folderName;
            
            // Limpiar buscador al cambiar
            searchBarInput.value = "";

            if (folderName === "patients") {
                // Cambiar buscador a Pacientes
                searchBarInput.placeholder = "Buscar paciente por Nombre o DNI...";
                
                // Mostrar listas e interfaces de pacientes
                emailList.classList.add("hidden");
                patientList.classList.remove("hidden");
                
                emailReadingPane.classList.add("hidden");
                patientDetailsPane.classList.remove("hidden");
                
                // Renderizar base de datos local
                renderPatientsList();
            } else {
                // Cambiar buscador a Bandeja
                searchBarInput.placeholder = "Buscar correos de pacientes...";
                
                // Mostrar listas e interfaces de correo
                emailList.classList.remove("hidden");
                patientList.classList.add("hidden");
                
                emailReadingPane.classList.remove("hidden");
                patientDetailsPane.classList.add("hidden");

                // Filtro estético para carpetas de correos
                filterEmailsFolder(folderName);
            }
        });
    });

    const filterEmailsFolder = (folder) => {
        const emails = document.querySelectorAll(".email-item");
        emails.forEach(item => {
            // Simulación básica de carpetas ocultando otros
            if (folder === "inbox") {
                item.style.display = "block";
            } else {
                // Para Enviados/Drafts/Trash ocultamos los de la bandeja para simular el filtro
                item.style.display = "none";
            }
        });
        
        // Si no hay correos en la carpeta simulada
        if (folder !== "inbox") {
            // Mostrar vacío en el panel de lectura
            readSender.textContent = "Bandeja vacía";
            readSenderEmail.textContent = "";
            readTime.textContent = "";
            readSubject.textContent = "Sin mensajes";
            readBody.innerHTML = `<p style="color: var(--text-muted);">No hay correos en la carpeta "${folder}".</p>`;
            avatarInitial.textContent = "-";
        } else {
            // Clicar primer email por defecto
            const firstEmail = emailList.querySelector(".email-item");
            if (firstEmail) firstEmail.click();
        }
    };

    // 6. BUSCADOR MULTIPROPÓSITO (FILTRO DE LA BASE DE DATOS LOCAL)
    searchBarInput.addEventListener("input", (e) => {
        const text = e.target.value;
        if (currentFolder === "patients") {
            // Filtrar Base de Datos de Pacientes
            renderPatientsList(text);
        } else {
            // Filtrar correos por remitente o asunto
            const query = text.toLowerCase().trim();
            const emails = document.querySelectorAll(".email-item");
            emails.forEach(item => {
                const sender = item.querySelector(".email-sender").textContent.toLowerCase();
                const subject = item.querySelector(".email-subject").textContent.toLowerCase();
                if (sender.includes(query) || subject.includes(query)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        }
    });

    // 7. CONTROL DEL MODAL (COMPOSE EMAIL)
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

    window.addEventListener("click", (e) => {
        if (e.target === composeModal) {
            hideModal();
        }
    });

    if (composeForm) {
        composeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const to = document.getElementById("toEmail").value;
            const subject = document.getElementById("subjectEmail").value;
            
            alert(`¡Correo enviado con éxito a: ${to}!\nAsunto: ${subject}`);
            hideModal();
        });
    }
});
