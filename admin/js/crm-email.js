/* ==========================================
   LÓGICA DEL CRM CORREO (INTRANET HCALETA)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. BASE DE DATOS DE CORREOS SIMULADOS (ESTADO DE CORREOS)
    let emailsData = [
        {
            id: "1",
            folder: "inbox",
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
                   <p>Atentamente,<br><strong>Carlos Mendoza</strong><br>DNI: 47859612</p>`,
            unread: true
        },
        {
            id: "2",
            folder: "inbox",
            sender: "María Espinoza (Paciente)",
            email: "maria.espinoza94@gmail.com",
            time: "Hoy, 2:30 PM",
            subject: "Reclamación de resultados de análisis clínicos",
            body: `<p>Hola, buenas tardes.</p>
                   <br>
                   <p>El día de ayer por la mañana me realicé unos exámenes de laboratorio clínicos (perfil lipídico y hemograma) en su sede. Al momento de pagar me indicaron que los resultados serían enviados automáticamente a mi correo en un plazo de 24 horas.</p>
                   <p>Ya han pasado más de 30 horas y aún no he recibido ningún documento en mi bandeja de entrada ni en spam. Agradecería que revisen mi caso a la brevedad, ya que tengo cita médica mañana y requiero esos resultados.</p>
                   <br>
                   <p>Datos adicionales:<br>Paciente: María del Carmen Espinoza Saldaña<br>DNI: 48956231</p>`,
            unread: true
        },
        {
            id: "3",
            folder: "inbox",
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
                   <p>Atentamente,<br><strong>Dr. Alejandro Pérez V.</strong><br>Especialista en Pediatría - CNP 45896</p>`,
            unread: false
        },
        {
            id: "4",
            folder: "inbox",
            sender: "Juan Cáceres (Paciente)",
            email: "jcaceres@outlook.com",
            time: "07 Jun",
            subject: "Consulta de dosis de jarabe pediátrico",
            body: `<p>Buenas tardes,</p>
                   <p>Mi hijo de 5 años fue atendido el día de ayer por pediatría. Le recetaron Paracetamol en jarabe de 120mg/5ml, pero en la receta no se lee bien la dosis en ml que debe tomar cada 8 horas. El niño pesa 18 kg. ¿Podrían confirmarme la dosis correcta, por favor?</p>
                   <p>Muchas gracias.</p>`,
            unread: true
        },
        {
            id: "5",
            folder: "inbox",
            sender: "Elena Rojas (Paciente)",
            email: "elena.rojas@gmail.com",
            time: "06 Jun",
            subject: "Error al intentar reservar cita en la web",
            body: `<p>Estimados señores,</p>
                   <p>Intento reservar una cita para odontología por medio del portal web ciudadano, pero al momento de confirmar el DNI me sale un error de "Servicio no disponible". He verificado mi DNI y está activo en el SIS. ¿Podrían ayudarme a registrar la cita manualmente?</p>`,
            unread: false
        },
        {
            id: "6",
            folder: "inbox",
            sender: "Roberto Díaz (Administrativo)",
            email: "rdiaz@hcaleta.gob.pe",
            time: "05 Jun",
            subject: "Revisión de informe de mantenimiento de calderas",
            body: `<p>Hola Luis,</p>
                   <p>Te adjunto el borrador del informe técnico sobre el estado de las calderas de calefacción del hospital. Por favor dale una mirada y confírmame si el presupuesto se alinea con el fondo anual del ERP.</p>`,
            unread: false
        },
        {
            id: "7",
            folder: "inbox",
            sender: "Lucía Paredes (Paciente)",
            email: "luparedes@gmail.com",
            time: "04 Jun",
            subject: "Solicitud de copia de historial médico",
            body: `<p>Señores del Hospital La Caleta,</p>
                   <p>Solicito la copia fedateada de mi historial clínico de atenciones del año pasado en ginecología para presentarlo en mi centro laboral. ¿Cuál es el trámite o tasa que debo pagar en caja?</p>`,
            unread: false
        },
        // Correos en Enviados
        {
            id: "101",
            folder: "sent",
            sender: "Luis (Administrador)",
            email: "luis.admin@hcaleta.gob.pe",
            time: "Ayer, 10:15 AM",
            subject: "Confirmación de reprogramación - Cita Cardiología",
            body: `<p>Estimado Carlos,</p>
                   <p>Le confirmo que su cita con el Dr. Roberto Díaz ha sido reprogramada para el próximo lunes a las 3:30 PM en el Consultorio 104. Los datos actualizados han sido registrados en nuestro ERP.</p>
                   <p>Saludos cordiales.</p>`,
            unread: false
        },
        // Correos en Borradores
        {
            id: "201",
            folder: "drafts",
            sender: "Luis (Administrador)",
            email: "luis.admin@hcaleta.gob.pe",
            time: "Hace 1 hora",
            subject: "[BORRADOR] Respuesta a reclamo de análisis clínicos",
            body: `<p>Estimada María,</p>
                   <p>Lamentamos el retraso en el envío de sus resultados. Hemos verificado en el ERP de Laboratorio y ya se encuentran listos. Adjunto los documentos en formato PDF...</p>`,
            unread: false
        },
        // Correos en Papelera
        {
            id: "301",
            folder: "trash",
            sender: "Publicidad Médica",
            email: "spam@farmacias.com",
            time: "02 Jun",
            subject: "Descuentos en equipos de bioseguridad",
            body: `<p>Aproveche las ofertas exclusivas de este mes en mascarillas, guantes quirúrgicos y alcohol en gel...</p>`,
            unread: false
        }
    ];

    // 2. BASE DE DATOS DE PACIENTES SIMULADA (MOCK DATABASE LOCAL CON 12 REGISTROS)
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
        },
        {
            id: "4",
            name: "Ana María Flores",
            dni: "42158932",
            age: 41,
            phone: "934-567-890",
            address: "Urb. Casuarinas Mz E Lt 4, Nuevo Chimbote",
            history: "Ninguna alergia conocida. Cesárea previa (2018).",
            summary: "Paciente regular del programa de Control Materno.",
            visits: [
                { date: "30/05/2026", desc: "Monitoreo y ecografía obstétrica", doctor: "Dra. Juana Aguilar - Ginecología" },
                { date: "12/04/2026", desc: "Consulta externa de control prenatal", doctor: "Dra. Juana Aguilar - Ginecología" }
            ]
        },
        {
            id: "5",
            name: "Roberto Carlos Soto",
            dni: "43456789",
            age: 47,
            phone: "945-678-901",
            address: "Pueblo Joven Miraflores Alto, Chimbote",
            history: "Diabetes Mellitus Tipo II en tratamiento con Metformina.",
            summary: "Paciente crónico del programa de Endocrinología.",
            visits: [
                { date: "03/06/2026", desc: "Control de Glucosa y ajuste de dosis", doctor: "Dr. Carlos Valdivia - Endocrinología" },
                { date: "10/03/2026", desc: "Examen de perfil renal y glucosa", doctor: "Lic. Clara Flores - Laboratorio" }
            ]
        },
        {
            id: "6",
            name: "Luisa Fernanda Ríos",
            dni: "45678901",
            age: 31,
            phone: "956-789-012",
            address: "Jr. Leoncio Prado 451, Chimbote",
            history: "Rinitis alérgica estacional. Operada de apendicitis en 2021.",
            summary: "Fidelización de paciente: Nivel Plata en servicios clínicos.",
            visits: [
                { date: "01/06/2026", desc: "Consulta por alergia severa", doctor: "Dr. Javier Solís - Inmunología" },
                { date: "24/04/2026", desc: "Examen de descarte alérgico", doctor: "Lic. Clara Flores - Laboratorio" }
            ]
        },
        {
            id: "7",
            name: "Juan Manuel Castro",
            dni: "40789012",
            age: 65,
            phone: "967-890-123",
            address: "Pueblo Joven 2 de Mayo Mz C Lt 12, Chimbote",
            history: "Artrosis de rodilla derecha. Gastropatía erosiva.",
            summary: "Paciente de la tercera edad afiliado al programa de Rehabilitación.",
            visits: [
                { date: "28/05/2026", desc: "Sesión de terapia física de rodilla", doctor: "Lic. Pedro Castillo - Fisioterapia" },
                { date: "15/04/2026", desc: "Consulta por dolor articular crónico", doctor: "Dr. Marcos Reyes - Traumatología" }
            ]
        },
        {
            id: "8",
            name: "Patricia Benavides",
            dni: "48901234",
            age: 29,
            phone: "978-901-234",
            address: "Urb. Los Álamos C-14, Nuevo Chimbote",
            history: "Hipotiroidismo (Levotiroxina 100mcg). Alergia a las sulfas.",
            summary: "Control regular en Consulta Externa de Endocrinología.",
            visits: [
                { date: "27/05/2026", desc: "Examen de TSH y T4 libre", doctor: "Lic. Clara Flores - Laboratorio" },
                { date: "12/03/2026", desc: "Consulta endocrinológica de control", doctor: "Dr. Carlos Valdivia - Endocrinología" }
            ]
        },
        {
            id: "9",
            name: "Miguel Ángel Guerrero",
            dni: "49012345",
            age: 38,
            phone: "989-012-345",
            address: "Jr. Caraz 214, Chimbote",
            history: "Obesidad Grado II. Hígado graso en tratamiento nutricional.",
            summary: "Paciente en el programa de Estilo de Vida Saludable.",
            visits: [
                { date: "02/06/2026", desc: "Evaluación corporal y plan dietético", doctor: "Lic. Sandra Medina - Nutrición" },
                { date: "18/04/2026", desc: "Control general y descarte lipídico", doctor: "Dra. Elena Ramos - Medicina General" }
            ]
        },
        {
            id: "10",
            name: "Sofía Vergara Díaz",
            dni: "46123456",
            age: 44,
            phone: "990-123-456",
            address: "P.J. Florida Alta Jr. Ica 320, Chimbote",
            history: "Migraña crónica. No registra alergias.",
            summary: "Paciente en control por Neurología.",
            visits: [
                { date: "05/06/2026", desc: "Evaluación y ajuste de analgésicos", doctor: "Dr. Hugo Morán - Neurología" },
                { date: "22/02/2026", desc: "Resonancia magnética de cráneo", doctor: "Lic. Roberto Ruiz - Imagenología" }
            ]
        },
        {
            id: "11",
            name: "Daniel Alcides Carrión",
            dni: "40987654",
            age: 60,
            phone: "911-234-567",
            address: "Urb. Las Gardenias Lt 15, Chimbote",
            history: "Hiperplasia prostática benigna. Gastritis crónica.",
            summary: "Control geriátrico preventivo y Urología.",
            visits: [
                { date: "09/06/2026", desc: "Consulta de control prostático", doctor: "Dr. Luis Vargas - Urología" },
                { date: "15/04/2026", desc: "Ecografía pélvica de control", doctor: "Lic. Roberto Ruiz - Imagenología" }
            ]
        },
        {
            id: "12",
            name: "Carmen Rosa Mendoza",
            dni: "42345678",
            age: 50,
            phone: "922-345-678",
            address: "Jr. Elías Aguirre 550, Chimbote",
            history: "Osteoporosis. Sin alergias reportadas.",
            summary: "Tratamiento activo de densitometría ósea.",
            visits: [
                { date: "24/05/2026", desc: "Examen de Densitometría Ósea", doctor: "Lic. Roberto Ruiz - Imagenología" },
                { date: "10/03/2026", desc: "Consulta de reumatología", doctor: "Dra. Silvia Torres - Reumatología" }
            ]
        }
    ];

    // Elementos DOM
    const emailList = document.getElementById("emailList");
    const patientList = document.getElementById("patientList");
    const emailReadingPane = document.getElementById("paneContent");
    const patientDetailsPane = document.getElementById("patientPaneContent");
    
    // Ficha de Lectura de Correo
    const readSender = document.getElementById("readSender");
    const readSenderEmail = document.getElementById("readSenderEmail");
    const readTime = document.getElementById("readTime");
    const readSubject = document.getElementById("readSubject");
    const readBody = document.getElementById("readBody");
    const avatarInitial = document.querySelector(".sender-avatar-initial");

    // Botón de eliminar, responder y búsqueda
    const btnDelete = document.getElementById("btnDelete");
    const btnReply = document.getElementById("btnReply");
    const searchBarInput = document.getElementById("searchBarInput");
    
    let currentFolder = "inbox"; // Carpeta activa por defecto
    let selectedEmailId = null;  // ID del correo cargado actualmente
    let selectedPatientId = null; // ID del paciente cargado actualmente

    // 3. ACTUALIZAR CONTADORES DE BANDEJA
    const updateFolderBadges = () => {
        const inboxUnread = emailsData.filter(e => e.folder === "inbox" && e.unread).length;
        const inboxCountBadge = document.querySelector('.folder-item[data-folder="inbox"] .folder-count');
        if (inboxCountBadge) {
            if (inboxUnread > 0) {
                inboxCountBadge.textContent = inboxUnread;
                inboxCountBadge.style.display = "inline-block";
            } else {
                inboxCountBadge.style.display = "none";
            }
        }
    };

    // 4. RENDERIZADO DE CORREOS
    const renderEmailsList = (filterText = "") => {
        emailList.innerHTML = "";
        const query = filterText.toLowerCase().trim();

        // Filtrar correos por carpeta
        let filtered = emailsData.filter(e => e.folder === currentFolder);

        // Filtrar por texto de búsqueda si hay
        if (query !== "") {
            filtered = filtered.filter(e => 
                e.sender.toLowerCase().includes(query) || 
                e.subject.toLowerCase().includes(query) ||
                e.email.toLowerCase().includes(query)
            );
        }

        if (filtered.length === 0) {
            emailList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">Bandeja vacía</div>`;
            // Cargar panel derecho vacío
            clearEmailReadingPane();
            return;
        }

        // Renderizar items
        filtered.forEach((email, index) => {
            const item = document.createElement("div");
            item.className = `email-item ${email.unread ? 'unread' : ''} ${selectedEmailId === email.id ? 'active' : ''}`;
            item.setAttribute("data-id", email.id);

            // Si es la carga inicial y no hay seleccionado, seleccionamos el primero
            if (!selectedEmailId && index === 0) {
                selectedEmailId = email.id;
                item.classList.add("active");
            }

            item.innerHTML = `
                <div class="email-item-header">
                    <span class="email-sender">${email.sender}</span>
                    <span class="email-time">${email.time}</span>
                </div>
                <h4 class="email-subject">${email.subject}</h4>
                <p class="email-snippet">${email.body.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
            `;

            item.addEventListener("click", () => {
                document.querySelectorAll(".email-item").forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                item.classList.remove("unread");
                
                // Marcar como leído
                const match = emailsData.find(e => e.id === email.id);
                if (match && match.unread) {
                    match.unread = false;
                    updateFolderBadges();
                }

                loadEmailIntoPane(email.id);
            });

            emailList.appendChild(item);
        });

        // Cargar correo en el panel
        if (selectedEmailId) {
            loadEmailIntoPane(selectedEmailId);
        }
    };

    const loadEmailIntoPane = (id) => {
        selectedEmailId = id;
        const email = emailsData.find(e => e.id === id);
        if (!email) {
            clearEmailReadingPane();
            return;
        }

        readSender.textContent = email.sender;
        readSenderEmail.textContent = email.email;
        readTime.textContent = email.time;
        readSubject.textContent = email.subject;
        readBody.innerHTML = email.body;
        avatarInitial.textContent = email.sender.charAt(0).toUpperCase();
        
        // Mostrar panel de acciones
        document.querySelector(".email-pane-actions").classList.remove("hidden");
    };

    const clearEmailReadingPane = () => {
        selectedEmailId = null;
        readSender.textContent = "Seleccione un mensaje";
        readSenderEmail.textContent = "";
        readTime.textContent = "";
        readSubject.textContent = "Bandeja sin correos";
        readBody.innerHTML = `<div style="text-align:center; padding: 50px 0; color:var(--text-muted);"><i class="fa-regular fa-envelope-open" style="font-size:3rem; margin-bottom:15px; opacity:0.5;"></i><p>No hay ningún correo seleccionado para leer.</p></div>`;
        avatarInitial.textContent = "-";
        
        // Ocultar panel de acciones
        document.querySelector(".email-pane-actions").classList.add("hidden");
    };

    // 5. RENDERIZADO DE LA BASE DE DATOS DE PACIENTES (LOCAL DB)
    const renderPatientsList = (filterText = "") => {
        patientList.innerHTML = "";
        const query = filterText.toLowerCase().trim();
        
        let filtered = patientsData;

        if (query !== "") {
            filtered = patientsData.filter(p => 
                p.name.toLowerCase().includes(query) || p.dni.includes(query)
            );
        }

        if (filtered.length === 0) {
            patientList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">Ningún paciente encontrado.</div>`;
            clearPatientDetailsPane();
            return;
        }

        filtered.forEach((patient, index) => {
            const item = document.createElement("div");
            item.className = `patient-item ${selectedPatientId === patient.id ? 'active' : ''}`;
            item.setAttribute("data-id", patient.id);
            
            if (!selectedPatientId && index === 0) {
                selectedPatientId = patient.id;
                item.classList.add("active");
            }

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
                loadPatientDetails(patient.id);
            });

            patientList.appendChild(item);
        });

        if (selectedPatientId) {
            loadPatientDetails(selectedPatientId);
        }
    };

    const loadPatientDetails = (id) => {
        selectedPatientId = id;
        const patient = patientsData.find(p => p.id === id);
        if (!patient) {
            clearPatientDetailsPane();
            return;
        }

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

    const clearPatientDetailsPane = () => {
        selectedPatientId = null;
        document.getElementById("patientDetailName").textContent = "Ningún paciente";
        document.getElementById("patientDetailDni").textContent = "";
        document.getElementById("patientAvatar").textContent = "-";
        document.getElementById("patientAge").textContent = "-";
        document.getElementById("patientPhone").textContent = "-";
        document.getElementById("patientAddress").textContent = "-";
        document.getElementById("patientMedicalHistory").textContent = "-";
        document.getElementById("patientVisitsTimeline").innerHTML = "";
    };

    // 6. CONTROL DEL BOTÓN ELIMINAR (ELIMINACIÓN INTERACTIVA)
    if (btnDelete) {
        btnDelete.addEventListener("click", () => {
            if (!selectedEmailId) return;

            const index = emailsData.findIndex(e => e.id === selectedEmailId);
            if (index === -1) return;

            const email = emailsData[index];

            if (email.folder === "trash") {
                // Si ya está en papelera, borrar permanentemente de la BD local
                if (confirm("¿Está seguro de eliminar permanentemente este correo?")) {
                    emailsData.splice(index, 1);
                    selectedEmailId = null;
                    alert("Correo eliminado de forma permanente.");
                }
            } else {
                // Si está en otra carpeta, mover a papelera
                email.folder = "trash";
                selectedEmailId = null;
                alert("El correo ha sido enviado a la Papelera.");
            }

            // Actualizar contadores, recargar lista y renderizar
            updateFolderBadges();
            renderEmailsList();
        });
    }

    // 7. CONTROL DEL BOTÓN RESPONDER (CONEXIÓN CON REDACTAR)
    if (btnReply) {
        btnReply.addEventListener("click", () => {
            if (!selectedEmailId) return;

            const email = emailsData.find(e => e.id === selectedEmailId);
            if (!email) return;

            // Abrir el modal de redactar
            composeModal.classList.remove("hidden");

            // Rellenar datos para la respuesta
            document.getElementById("toEmail").value = email.email;
            document.getElementById("subjectEmail").value = `Re: ${email.subject}`;
            document.getElementById("bodyEmail").value = `\n\n--- El ${email.time}, ${email.sender} escribió: ---\n> ${email.body.replace(/<[^>]*>/g, '\n> ')}`;
            document.getElementById("bodyEmail").focus();
        });
    }

    // 8. CAMBIO DE CARPETAS
    const folderItems = document.querySelectorAll(".folder-item");
    folderItems.forEach(folder => {
        folder.addEventListener("click", (e) => {
            e.preventDefault();
            folderItems.forEach(f => f.classList.remove("active"));
            folder.classList.add("active");

            const folderName = folder.getAttribute("data-folder");
            currentFolder = folderName;
            
            // Reiniciar filtros de búsquedas e ID seleccionado al cambiar
            searchBarInput.value = "";
            selectedEmailId = null;
            selectedPatientId = null;

            if (folderName === "patients") {
                searchBarInput.placeholder = "Buscar paciente por Nombre o DNI...";
                
                emailList.classList.add("hidden");
                patientList.classList.remove("hidden");
                
                emailReadingPane.classList.add("hidden");
                patientDetailsPane.classList.remove("hidden");
                
                renderPatientsList();
            } else {
                searchBarInput.placeholder = "Buscar en la bandeja...";
                
                emailList.classList.remove("hidden");
                patientList.classList.add("hidden");
                
                emailReadingPane.classList.remove("hidden");
                patientDetailsPane.classList.add("hidden");

                renderEmailsList();
            }
        });
    });

    // 9. FILTRADO CON EL BUSCADOR GLOBAL
    searchBarInput.addEventListener("input", (e) => {
        const text = e.target.value;
        if (currentFolder === "patients") {
            selectedPatientId = null; // Reiniciar selección al filtrar
            renderPatientsList(text);
        } else {
            selectedEmailId = null; // Reiniciar selección al filtrar
            renderEmailsList(text);
        }
    });

    // 10. MODAL REDACTAR NUEVO CORREO (SIMULACIÓN DINÁMICA COMPLETA)
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
            const body = document.getElementById("bodyEmail").value.replace(/\n/g, '<br>');

            // Crear nuevo correo en la carpeta "sent"
            const newEmail = {
                id: (Date.now()).toString(), // ID único basado en timestamp
                folder: "sent",
                sender: "Luis (Administrador)",
                email: "luis.admin@hcaleta.gob.pe",
                time: "Ahora",
                subject: subject,
                body: `<p>${body}</p>`,
                unread: false
            };

            // Insertar al inicio de la lista de correos
            emailsData.unshift(newEmail);

            alert(`¡Mensaje enviado con éxito!\n\nPara: ${to}\nAsunto: ${subject}\n\n(Puedes ver este correo yendo a la carpeta 'Enviados')`);
            
            hideModal();

            // Si está parado en la bandeja de Enviados, recargar la lista de inmediato
            if (currentFolder === "sent") {
                renderEmailsList();
            }
        });
    }

    // Inicializar bandeja
    updateFolderBadges();
    renderEmailsList();
});
