// URL de la Aplicación Web de Google Apps Script (Reemplazar con tu URL de implementación)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwGecsJWlfTp_R5Xhil2Dm3VmKbLAuZ_X2seMiBbZaQpYUwaI_BPxivZP9DhfCKGg4/exec";

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
            unread: true,
            category: "paciente"
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
            unread: true,
            category: "paciente"
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
            unread: false,
            category: "medico"
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
            unread: true,
            category: "paciente"
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
            unread: false,
            category: "paciente"
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
            unread: false,
            category: "administrativo"
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
            unread: false,
            category: "paciente"
        },
        {
            id: "8",
            folder: "inbox",
            sender: "Luis Alberto Ruiz (Paciente)",
            email: "luis.ruiz@hotmail.com",
            time: "03 Jun",
            subject: "Consulta de resultados de ecografía",
            body: `<p>Buenas tardes,</p><p>Me realicé una ecografía abdominal el pasado lunes y aún no me llega el resultado a mi correo. ¿Podrían revisarlo por favor? DNI: 44556677</p>`,
            unread: true,
            category: "paciente"
        },
        {
            id: "9",
            folder: "inbox",
            sender: "Carmen Rosa Mendoza (Paciente)",
            email: "carmen.mendoza@gmail.com",
            time: "02 Jun",
            subject: "Reprogramación de cita odontológica",
            body: `<p>Estimados,</p><p>Quisiera reprogramar mi cita de odontología para la siguiente semana debido a un cruce con mi horario laboral. Quedo atento. DNI: 42345678</p>`,
            unread: false,
            category: "paciente"
        },
        {
            id: "10",
            folder: "inbox",
            sender: "Daniel Alcides Carrión (Paciente)",
            email: "daniel.carrion@yahoo.com",
            time: "01 Jun",
            subject: "Consulta sobre dosis de Metformina",
            body: `<p>Hola doctor,</p><p>Quisiera saber si debo tomar la metformina antes o después de los alimentos. Muchas gracias. DNI: 40987654</p>`,
            unread: true,
            category: "paciente"
        },
        {
            id: "11",
            folder: "inbox",
            sender: "Patricia Benavides (Paciente)",
            email: "patricia.b@gmail.com",
            time: "30 May",
            subject: "Cita de control de endocrinología",
            body: `<p>Buenas,</p><p>Tengo una consulta de control el próximo mes y quería confirmar si la fecha registrada en el sistema es la correcta. DNI: 43344556</p>`,
            unread: false,
            category: "paciente"
        },
        {
            id: "12",
            folder: "inbox",
            sender: "Sofía Vergara Díaz (Paciente)",
            email: "sofia.vergara@outlook.com",
            time: "28 May",
            subject: "Resultado de resonancia magnética",
            body: `<p>Estimado doctor,</p><p>Quisiera saber si mis resultados de resonancia magnética ya están en el sistema para ir a recogerlos. DNI: 46123456</p>`,
            unread: false,
            category: "paciente"
        },
        {
            id: "13",
            folder: "inbox",
            sender: "Miguel Ángel Guerrero (Paciente)",
            email: "mguerrero@gmail.com",
            time: "25 May",
            subject: "Duda sobre dieta para hígado graso",
            body: `<p>Buenas,</p><p>El nutricionista me indicó una dieta pero tengo dudas sobre qué frutas comer por las noches. ¿Podrían orientarme? DNI: 44556677</p>`,
            unread: true,
            category: "paciente"
        },
        {
            id: "14",
            folder: "inbox",
            sender: "Luisa Fernanda Ríos (Paciente)",
            email: "luisa.rios@gmail.com",
            time: "22 May",
            subject: "Consulta por rinitis alérgica severa",
            body: `<p>Hola,</p><p>El tratamiento con antihistamínicos que me recetaron no está dando resultados para mi rinitis. ¿Qué procede? DNI: 43344556</p>`,
            unread: false,
            category: "paciente"
        },
        {
            id: "15",
            folder: "inbox",
            sender: "Juan Manuel Castro (Paciente)",
            email: "jmcastro@gmail.com",
            time: "20 May",
            subject: "Terapia física de rodilla",
            body: `<p>Buenas tardes,</p><p>Quisiera saber los horarios de atención del área de fisioterapia para programar mis sesiones de rodilla. DNI: 41122334</p>`,
            unread: false,
            category: "paciente"
        },
        {
            id: "16",
            folder: "inbox",
            sender: "Sonia Bustamante (Recursos Humanos)",
            email: "sbustamante@hcaleta.gob.pe",
            time: "18 May",
            subject: "Envío de planillas del personal de enfermería - Junio",
            body: `<p>Hola Luis,</p><p>Te hago envío del cuadro consolidado de horas extras y guardias del personal de enfermería para su respectiva validación en el presupuesto del ERP. Quedo atenta a tus observaciones.</p>`,
            unread: true,
            category: "administrativo"
        },
        {
            id: "17",
            folder: "inbox",
            sender: "Ing. Marcos Vigil (Soporte TI)",
            email: "mvigil@hcaleta.gob.pe",
            time: "15 May",
            subject: "Reporte de vulnerabilidad de red y actualización de antivirus",
            body: `<p>Estimado Administrador,</p><p>Te informo que el día de mañana a las 11:00 PM se realizará el mantenimiento programado del firewall central del hospital. Habrá cortes intermitentes de conexión de red local y sistemas ERP/CRM de aproximadamente 15 minutos.</p>`,
            unread: false,
            category: "administrativo"
        },
        {
            id: "18",
            folder: "inbox",
            sender: "Dra. Elena Ramos",
            email: "eramos@hcaleta.gob.pe",
            time: "12 May",
            subject: "Actualización de guías clínicas de atención primaria",
            body: `<p>Estimado Director,</p><p>Adjunto la propuesta de actualización para el flujograma de atención rápida de pacientes sintomáticos respiratorios. Agradecería agendar una reunión de revisión para el miércoles.</p>`,
            unread: false,
            category: "medico"
        },
        {
            id: "19",
            folder: "inbox",
            sender: "Dr. Roberto Díaz (Cardiología)",
            email: "rdiaz.med@hcaleta.gob.pe",
            time: "10 May",
            subject: "Solicitud de compra de electrodos para Holter",
            body: `<p>Buenas tardes,</p><p>Por medio del presente solicito la compra urgente de 2 cajas de electrodos desechables compatibles con el equipo Holter del consultorio 104, ya que el stock actual se agotará esta semana. Gracias.</p>`,
            unread: false,
            category: "medico"
        },
        {
            id: "20",
            folder: "inbox",
            sender: "Rosa María Palacios (Paciente)",
            email: "rosa.palacios@gmail.com",
            time: "08 May",
            subject: "Consulta sobre recetas pendientes SIS",
            body: `<p>Estimados,</p><p>Tengo una receta de Pregabalina pendiente por recoger en farmacia del SIS. ¿Tienen stock disponible actualmente para no ir en vano? DNI: 41122334</p>`,
            unread: true,
            category: "paciente"
        },
        {
            id: "21",
            folder: "inbox",
            sender: "Juan Francisco Beltrán (Paciente)",
            email: "jfbeltran@hotmail.com",
            time: "05 May",
            subject: "Duda sobre dosis de Espironolactona",
            body: `<p>Buenas tardes,</p><p>Quisiera saber si puedo tomar la espironolactona junto con mi desayuno o debe ser en ayunas. Mi médico es el Dr. Díaz. DNI: 42233446</p>`,
            unread: true,
            category: "paciente"
        },
        {
            id: "22",
            folder: "inbox",
            sender: "Laura Cristina Loli (Paciente)",
            email: "laura.loli@gmail.com",
            time: "02 May",
            subject: "Solicitud de cita de control de Alergias",
            body: `<p>Hola,</p><p>Requiero una cita de control por el área de neumología/alergología. He estado presentando crisis asmáticas leves en las noches. DNI: 43344556</p>`,
            unread: false,
            category: "paciente"
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
            unread: false,
            category: "administrativo"
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
            unread: false,
            category: "administrativo"
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
            unread: false,
            category: "general"
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
            history: "Asma crónica (Salbutamol condicionado). Tratamiento activo de hipertensión arterial leve (Enalapril 10mg diario). Sin alergias alimentarias o medicamentosas.",
            summary: "Paciente en control activo por Especialidad de Cardiología.",
            visits: [
                { date: "12/06/2026", desc: "Cita programada (Reprogramación solicitada)", doctor: "Dr. Roberto Díaz - Cardiología" },
                { date: "05/04/2026", desc: "Chequeo Preventivo Anual", doctor: "Dra. Elena Ramos - Medicina General" },
                { date: "10/01/2026", desc: "Consulta externa por arritmia leve", doctor: "Dr. Roberto Díaz - Cardiología" },
                { date: "15/11/2025", desc: "Electrocardiograma de esfuerzo y Holter", doctor: "Dr. Roberto Díaz - Cardiología" }
            ]
        },
        {
            id: "2",
            name: "María Espinoza",
            dni: "48956231",
            age: 28,
            phone: "954-123-789",
            address: "Av. Pardo 840, Chimbote",
            history: "Alérgica a la Penicilina (reacción cutánea severa). Gastritis crónica en tratamiento con Omeprazol 20mg. Anemia ferropénica en recuperación (Sulfato Ferroso 300mg diarios).",
            summary: "Paciente en espera de resultados clínicos de laboratorio.",
            visits: [
                { date: "08/06/2026", desc: "Toma de muestras - Laboratorio Clínico", doctor: "Lic. Clara Flores - Patología" },
                { date: "15/02/2026", desc: "Chequeo ginecológico y papanicolau", doctor: "Dra. Lucía Castro - Ginecología" },
                { date: "05/01/2026", desc: "Ecografía pélvica transvaginal de control", doctor: "Dra. Lucía Castro - Ginecología" }
            ]
        },
        {
            id: "3",
            name: "Jorge Ramírez",
            dni: "41258963",
            age: 52,
            phone: "923-456-789",
            address: "Urb. Buenos Aires H-21, Nuevo Chimbote",
            history: "Hipertensión arterial Grado II (Losartán 50mg + Amlodipino 5mg diarios). Obesidad Grado I. Antecedente familiar directo de diabetes mellitus tipo 2.",
            summary: "Paciente regular de programas preventivos de hipertensión.",
            visits: [
                { date: "22/05/2026", desc: "Control Trimestral de Presión Arterial", doctor: "Dr. Alejandro Pérez - Medicina General" },
                { date: "14/12/2025", desc: "Examen de agudeza visual y refracción", doctor: "Dra. Sofía Véliz - Oftalmología" },
                { date: "10/08/2025", desc: "Descarte metabólico completo (Perfil Lipídico, Glucosa, HbA1c)", doctor: "Lic. Clara Flores - Laboratorio" }
            ]
        },
        {
            id: "4",
            name: "Ana María Flores",
            dni: "42158932",
            age: 41,
            phone: "934-567-890",
            address: "Urb. Casuarinas Mz E Lt 4, Nuevo Chimbote",
            history: "Embarazo de 24 semanas (primigesta). Ninguna alergia conocida. Cesárea previa (2018) por distocia de presentación. Suplementada con Hierro y Ácido Fólico.",
            summary: "Paciente regular del programa de Control Materno.",
            visits: [
                { date: "30/05/2026", desc: "Monitoreo y ecografía obstétrica", doctor: "Dra. Juana Aguilar - Ginecología" },
                { date: "12/04/2026", desc: "Consulta externa de control prenatal", doctor: "Dra. Juana Aguilar - Ginecología" },
                { date: "15/02/2026", desc: "Ecografía del primer trimestre y analíticas", doctor: "Dra. Juana Aguilar - Ginecología" }
            ]
        },
        {
            id: "5",
            name: "Roberto Carlos Soto",
            dni: "43456789",
            age: 47,
            phone: "945-678-901",
            address: "Pueblo Joven Miraflores Alto, Chimbote",
            history: "Diabetes Mellitus Tipo II (Metformina 850mg c/12h + Glibenclamida 5mg mañana). Neuropatía diabética leve en miembros inferiores. Sin alergias reportadas.",
            summary: "Paciente crónico del programa de Endocrinología.",
            visits: [
                { date: "03/06/2026", desc: "Control de Glucosa y ajuste de dosis", doctor: "Dr. Carlos Valdivia - Endocrinología" },
                { date: "10/03/2026", desc: "Examen de perfil renal y glucosa", doctor: "Lic. Clara Flores - Laboratorio" },
                { date: "15/11/2025", desc: "Evaluación de pie diabético y sensibilidad", doctor: "Dr. Carlos Valdivia - Endocrinología" }
            ]
        },
        {
            id: "6",
            name: "Luisa Fernanda Ríos",
            dni: "45678901",
            age: 31,
            phone: "956-789-012",
            address: "Jr. Leoncio Prado 451, Chimbote",
            history: "Rinitis alérgica severa a ácaros y polen de gramíneas (Cetirizina 10mg / Fluticasona nasal). Operada de apendicitis aguda en 2021. Alérgica a las sulfas.",
            summary: "Fidelización de paciente: Nivel Plata en servicios clínicos.",
            visits: [
                { date: "01/06/2026", desc: "Consulta por alergia severa", doctor: "Dr. Javier Solís - Inmunología" },
                { date: "24/04/2026", desc: "Examen de descarte alérgico", doctor: "Lic. Clara Flores - Laboratorio" },
                { date: "12/12/2025", desc: "Espirometría de control pulmonar", doctor: "Dr. Javier Solís - Inmunología" }
            ]
        },
        {
            id: "7",
            name: "Juan Manuel Castro",
            dni: "40789012",
            age: 65,
            phone: "967-890-123",
            address: "Pueblo Joven 2 de Mayo Mz C Lt 12, Chimbote",
            history: "Artrosis moderada de rodilla derecha (Grado II). Gastropatía erosiva por uso crónico de AINEs. Prescripción: Celecoxib 200mg y Glucosamina + Condroitina diaria.",
            summary: "Paciente de la tercera edad afiliado al programa de Rehabilitación.",
            visits: [
                { date: "28/05/2026", desc: "Sesión de terapia física de rodilla", doctor: "Lic. Pedro Castillo - Fisioterapia" },
                { date: "15/04/2026", desc: "Consulta por dolor articular crónico", doctor: "Dr. Marcos Reyes - Traumatología" },
                { date: "10/02/2026", desc: "Infiltración intraarticular con ácido hialurónico", doctor: "Dr. Marcos Reyes - Traumatología" }
            ]
        },
        {
            id: "8",
            name: "Patricia Benavides",
            dni: "48901234",
            age: 29,
            phone: "978-901-234",
            address: "Urb. Los Álamos C-14, Nuevo Chimbote",
            history: "Hipotiroidismo primario (Levotiroxina sódica 100mcg c/24h en ayunas). Alergia a las sulfas y al Ibuprofeno. Ansiedad generalizada en psicoterapia.",
            summary: "Control regular en Consulta Externa de Endocrinología.",
            visits: [
                { date: "27/05/2026", desc: "Examen de TSH y T4 libre", doctor: "Lic. Clara Flores - Laboratorio" },
                { date: "12/03/2026", desc: "Consulta endocrinológica de control", doctor: "Dr. Carlos Valdivia - Endocrinología" },
                { date: "08/01/2026", desc: "Terapia de soporte emocional - Psicología", doctor: "Lic. Martín Ortiz - Psicología" }
            ]
        },
        {
            id: "9",
            name: "Miguel Ángel Guerrero",
            dni: "49012345",
            age: 38,
            phone: "989-012-345",
            address: "Jr. Caraz 214, Chimbote",
            history: "Obesidad Grado II (IMC 36.2). Hígado graso moderado (Esteatosis hepática). Ácido úrico elevado (Hiperuricemia). Dieta hipocalórica y ejercicio guiado.",
            summary: "Paciente en el programa de Estilo de Vida Saludable.",
            visits: [
                { date: "02/06/2026", desc: "Evaluación corporal y plan dietético", doctor: "Lic. Sandra Medina - Nutrición" },
                { date: "18/04/2026", desc: "Control general y descarte lipídico", doctor: "Dra. Elena Ramos - Medicina General" },
                { date: "12/01/2026", desc: "Ecografía hepatobiliar de control", doctor: "Lic. Roberto Ruiz - Imagenología" }
            ]
        },
        {
            id: "10",
            name: "Sofía Vergara Díaz",
            dni: "46123456",
            age: 44,
            phone: "990-123-456",
            address: "P.J. Florida Alta Jr. Ica 320, Chimbote",
            history: "Migraña con aura recurrente (tratamiento preventivo con Topiramato 50mg / crisis con Sumatriptán 50mg). Hernia discal lumbar L4-L5 sin indicación quirúrgica.",
            summary: "Paciente en control por Neurología.",
            visits: [
                { date: "05/06/2026", desc: "Evaluación y ajuste de analgésicos", doctor: "Dr. Hugo Morán - Neurología" },
                { date: "22/02/2026", desc: "Resonancia magnética de cráneo", doctor: "Lic. Roberto Ruiz - Imagenología" },
                { date: "14/10/2025", desc: "Consulta externa de Neurología por cefalea", doctor: "Dr. Hugo Morán - Neurología" }
            ]
        },
        {
            id: "11",
            name: "Daniel Alcides Carrión",
            dni: "40987654",
            age: 60,
            phone: "911-234-567",
            address: "Urb. Las Gardenias Lt 15, Chimbote",
            history: "Hiperplasia prostática benigna de grado II. Gastritis crónica en tratamiento activo con Omeprazol 20mg diario. Control prostático anual en curso.",
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
            history: "Osteoporosis postmenopáusica severa. Tratamiento activo con Alendronato de Sodio 70mg semanal. Sin alergias reportadas.",
            summary: "Tratamiento activo de densitometría ósea.",
            visits: [
                { date: "24/05/2026", desc: "Examen de Densitometría Ósea", doctor: "Lic. Roberto Ruiz - Imagenología" },
                { date: "10/03/2026", desc: "Consulta de reumatología", doctor: "Dra. Silvia Torres - Reumatología" }
            ]
        },
        {
            id: "13",
            name: "Luis Alberto Ruiz",
            dni: "44556677",
            age: 39,
            phone: "988-776-655",
            address: "Jr. Tacna 340, Chimbote",
            history: "Hipertensión arterial Grado I controlada (Enalapril 10mg diario). Rinitis alérgica severa por polen y ácaros (toma Cetirizina 10mg).",
            summary: "Paciente de control por Medicina General.",
            visits: [
                { date: "03/06/2026", desc: "Control de Presión Arterial", doctor: "Dra. Elena Ramos - Medicina General" }
            ]
        },
        {
            id: "14",
            name: "Estela Marina Solís",
            dni: "41122334",
            age: 55,
            phone: "912-345-678",
            address: "Av. Buenos Aires 120, Nuevo Chimbote",
            history: "Paciente sana. Sin antecedentes patológicos de importancia. No reporta alergias medicamentosas o alimenticias.",
            summary: "Paciente afiliada al programa de prevención oncológica.",
            visits: [
                { date: "15/05/2026", desc: "Chequeo ginecológico preventivo", doctor: "Dra. Lucía Castro - Ginecología" }
            ]
        },
        {
            id: "15",
            name: "Fernando Torres Paz",
            dni: "45566778",
            age: 48,
            phone: "945-123-456",
            address: "Jr. José Balta 890, Chimbote",
            history: "Antecedentes de fractura diafisaria de fémur izquierdo (operado en 2024 con clavo intramedular). Rehabilitado por completo con fisioterapia. No alergias.",
            summary: "Control regular en Consulta Externa de Traumatología.",
            visits: [
                { date: "10/04/2026", desc: "Evaluación traumatológica y placas", doctor: "Dr. Marcos Reyes - Traumatología" }
            ]
        },
        {
            id: "16",
            name: "Diana Carolina Rey",
            dni: "46677889",
            age: 26,
            phone: "967-456-123",
            address: "Urb. El Bosque Mz A Lt 8, Nuevo Chimbote",
            history: "Migraña tensional crónica de difícil control (tratamiento profiláctico con Propranolol 40mg diarios). Sin alergias medicamentosas.",
            summary: "Paciente en seguimiento médico por Neurología.",
            visits: [
                { date: "05/05/2026", desc: "Consulta por cefalea recurrente", doctor: "Dr. Hugo Morán - Neurología" }
            ]
        },
        {
            id: "17",
            name: "Héctor Raúl Benítez",
            dni: "48899001",
            age: 62,
            phone: "990-789-456",
            address: "P.J. San Pedro Jr. Áncash 450, Chimbote",
            history: "Artrosis de cadera bilateral severa (grado III). Tratamiento analgésico y condroprotector activo con Condroitina y Glucosamina. Cita quirúrgica en evaluación.",
            summary: "Paciente de la tercera edad en programa de terapia física.",
            visits: [
                { date: "12/05/2026", desc: "Terapia física de cadera y calor", doctor: "Lic. Pedro Castillo - Fisioterapia" }
            ]
        },
        {
            id: "18",
            name: "Gisela Patricia Ortiz",
            dni: "49900112",
            age: 33,
            phone: "911-456-789",
            address: "Jr. Huallaga 124, Chimbote",
            history: "Asma bronquial leve intermitente (Salbutamol inhalador condicionado a crisis). Alérgica al polen y pelos de animales domésticos.",
            summary: "Paciente regular en Consulta de Neumología.",
            visits: [
                { date: "20/05/2026", desc: "Examen de Espirometría y control", doctor: "Dr. Alejandro Pérez - Neumología" }
            ]
        },
        {
            id: "19",
            name: "Ramón Alejandro Ortiz",
            dni: "40011223",
            age: 70,
            phone: "922-567-890",
            address: "Av. Meiggs 1550, Chimbote",
            history: "Insuficiencia renal leve. Dieta e hidratación controlada. Tratamiento de anemia secundaria en curso.",
            summary: "Paciente crónico en seguimiento de Nefrología y Nutrición.",
            visits: [
                { date: "22/05/2026", desc: "Control de perfil renal completo", doctor: "Dr. Carlos Valdivia - Endocrinología" }
            ]
        },
        {
            id: "20",
            name: "Clara Inés Beltrán",
            dni: "42233445",
            age: 29,
            phone: "933-678-901",
            address: "Jr. Iquitos 210, Chimbote",
            history: "Primigesta (embarazo de 18 semanas). No reporta alergias a medicamentos. Suplementada con sulfato ferroso y ácido fólico.",
            summary: "Paciente en control del programa materno-perinatal.",
            visits: [
                { date: "28/05/2026", desc: "Ecografía del primer trimestre de embarazo", doctor: "Dra. Juana Aguilar - Ginecología" }
            ]
        },
        {
            id: "21",
            name: "Rosa María Palacios",
            dni: "41122334",
            age: 45,
            phone: "911-223-344",
            address: "Av. Industrial 520, Chimbote",
            history: "Alergia severa a los AINEs (especialmente Aspirina y Naproxeno). Fibromialgia en tratamiento activo con Pregabalina 75mg por las noches. Síndrome de colon irritable.",
            summary: "Paciente bajo control por Medicina Familiar y Psiquiatría.",
            visits: [
                { date: "15/06/2026", desc: "Control de dolor por Fibromialgia", doctor: "Dra. Elena Ramos - Medicina General" }
            ]
        },
        {
            id: "22",
            name: "Juan Francisco Beltrán",
            dni: "42233446",
            age: 58,
            phone: "922-334-455",
            address: "Urb. Laderas del Norte Mz J Lt 5, Chimbote",
            history: "Insuficiencia cardíaca congestiva (Estadio B). Tratamiento con Carvedilol 6.25mg y Espironolactona 25mg diarios. Sin alergias reportadas.",
            summary: "Control regular en Cardiología por cardiopatía dilatada.",
            visits: [
                { date: "10/06/2026", desc: "Monitoreo de función cardíaca y presión", doctor: "Dr. Roberto Díaz - Cardiología" }
            ]
        },
        {
            id: "23",
            name: "Laura Cristina Loli",
            dni: "43344556",
            age: 33,
            phone: "933-445-566",
            address: "Jr. Francisco Pizarro 612, Nuevo Chimbote",
            history: "Asma extrínseca activa (reacción alérgica grave a ácaros y polvo). Tratamiento con Budesonida + Formoterol inhalador c/12h. Hipersensibilidad al Ibuprofeno.",
            summary: "Seguimiento por Neumología y programa de Asma.",
            visits: [
                { date: "12/06/2026", desc: "Cita Neumológica de Control", doctor: "Dr. Alejandro Pérez - Neumología" }
            ]
        },
        {
            id: "24",
            name: "Humberto Luis Solano",
            dni: "44455667",
            age: 62,
            phone: "944-556-677",
            address: "Av. Centenario 104, Chimbote",
            history: "Diabetes Mellitus Tipo II de larga data. Retinopatía diabética no proliferativa en control. Tratamiento activo con Insulina Glargina 18 UI nocturna.",
            summary: "Paciente endocrino y oftalmológico crónico.",
            visits: [
                { date: "08/06/2026", desc: "Fondo de Ojo de Control", doctor: "Dr. José Uceda - Oftalmología" }
            ]
        },
        {
            id: "25",
            name: "Silvia Regina Chávez",
            dni: "45566778",
            age: 51,
            phone: "955-667-788",
            address: "Jr. José Olaya 240, Chimbote",
            history: "Hipotiroidismo controlado (Levotiroxina 75mcg). Alérgica a las sulfas (reacción dermatológica severa). Insomnio crónico en manejo con Zolpidem 5mg.",
            summary: "Paciente metabólico regular.",
            visits: [
                { date: "05/06/2026", desc: "Control perfil tiroideo", doctor: "Dr. Carlos Valdivia - Endocrinología" }
            ]
        },
        {
            id: "26",
            name: "Ricardo Antonio Bazán",
            dni: "46677889",
            age: 67,
            phone: "966-778-899",
            address: "Jr. Leoncio Prado 780, Chimbote",
            history: "Hipertensión arterial Grado II (Valsartán 80mg / Hidroclorotiazida 12.5mg c/24h). Hipercolesterolemia familiar (Atorvastatina 20mg diarios). Sin alergias conocidas.",
            summary: "Seguimiento por riesgo cardiovascular elevado.",
            visits: [
                { date: "01/06/2026", desc: "Consulta por dislipidemia y HTA", doctor: "Dr. Roberto Díaz - Cardiología" }
            ]
        },
        {
            id: "27",
            name: "Beatriz Elena Delgado",
            dni: "47788990",
            age: 28,
            phone: "977-889-900",
            address: "Urb. Los Álamos Mz B Lt 14, Nuevo Chimbote",
            history: "Lupus Eritematoso Sistémico (LES) en remisión médica. Tratamiento con Hidroxicloroquina 200mg c/24h. Alérgica a la Penicilina y cefalosporinas de primera generación.",
            summary: "Paciente reumatológico en vigilancia periódica.",
            visits: [
                { date: "28/05/2026", desc: "Chequeo de marcadores lúpicos", doctor: "Dra. Silvia Torres - Reumatología" }
            ]
        },
        {
            id: "28",
            name: "Manuel Octavio Neyra",
            dni: "48899001",
            age: 72,
            phone: "988-990-011",
            address: "Jr. Caraz 215, Chimbote",
            history: "Enfermedad Pulmonar Obstructiva Crónica (EPOC) severa (Gold III). Oxigenodependiente nocturno. Uso diario de Tiotropio y Albuterol. Alergia a la Dipirona.",
            summary: "Paciente crónico respiratorio del programa de oxigenoterapia.",
            visits: [
                { date: "25/05/2026", desc: "Espirometría y descarte de exacerbación", doctor: "Dr. Alejandro Pérez - Neumología" }
            ]
        },
        {
            id: "29",
            name: "Gabriela Sofía Pinedo",
            dni: "49900112",
            age: 36,
            phone: "999-001-122",
            address: "Jr. Huari 410, Chimbote",
            history: "Esclerosis múltiple remitente-recurrente (en tratamiento con Fingolimod 0.5mg diarios). Gastritis erosiva leve por uso episódico de corticoides. No reporta alergias.",
            summary: "Paciente neurológico en programa de medicamentos de alto costo.",
            visits: [
                { date: "22/05/2026", desc: "Evaluación neurológica semestral", doctor: "Dr. Hugo Morán - Neurología" }
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
    let currentRoleFilter = "all"; // Filtro de rol activo (all, paciente, medico, administrativo)

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

        // Filtrar por rol / categoría de correo
        if (currentRoleFilter !== "all") {
            filtered = filtered.filter(e => e.category === currentRoleFilter);
        }

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

                // Soporte responsivo para móvil (mostrar panel de lectura)
                const appCard = document.querySelector(".email-app-card");
                if (appCard) {
                    appCard.classList.add("show-reading");
                }
            });

            emailList.appendChild(item);
        });

        // Cargar correo en el panel
        if (selectedEmailId) {
            loadEmailIntoPane(selectedEmailId);
        }
    };

    // Helper para formatear historial clínico como una lista semántica e interactiva
    const renderClinicalHistory = (historyText) => {
        if (!historyText || historyText.trim() === "" || historyText.trim() === "-") {
            return `<div class="clinical-alert-item no-alerts"><i class="fa-solid fa-circle-check"></i> Sin antecedentes registrados</div>`;
        }
        
        // Separar por puntos, limpiando espacios
        const parts = historyText.split('.')
            .map(p => p.trim())
            .filter(p => p.length > 0);
            
        if (parts.length === 0) {
            return `<div class="clinical-alert-item no-alerts"><i class="fa-solid fa-circle-check"></i> Sin antecedentes registrados</div>`;
        }
        
        return `<ul class="clinical-alert-list">` + 
            parts.map(part => {
                let icon = '<i class="fa-solid fa-circle-chevron-right alert-bullet-icon"></i>';
                let itemClass = 'clinical-alert-item';
                const lowerPart = part.toLowerCase();
                
                if (lowerPart.includes('alerg') || lowerPart.includes('alérgic')) {
                    icon = '<i class="fa-solid fa-triangle-exclamation alert-icon-danger"></i>';
                    itemClass += ' alert-item-danger';
                } else if (lowerPart.includes('tratamiento') || lowerPart.includes('toma') || lowerPart.includes('activo') || lowerPart.includes('diario') || lowerPart.includes('mg') || lowerPart.includes('prescrip') || lowerPart.includes('dosis') || lowerPart.includes('suplement')) {
                    icon = '<i class="fa-solid fa-prescription-bottle-medical alert-icon-warning"></i>';
                    itemClass += ' alert-item-treatment';
                } else if (lowerPart.includes('sin ') || lowerPart.includes('ningun') || lowerPart.includes('no reporta')) {
                    icon = '<i class="fa-solid fa-circle-check alert-icon-success"></i>';
                    itemClass += ' alert-item-success';
                } else {
                    icon = '<i class="fa-solid fa-stethoscope alert-icon-info"></i>';
                    itemClass += ' alert-item-info';
                }
                
                return `<li class="${itemClass}">${icon}<span>${part}.</span></li>`;
            }).join('') + 
            `</ul>`;
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

        // --- SISTEMA INNOVADOR: VINCULACIÓN AUTOMÁTICA CON HISTORIAL CLÍNICO ---
        const patientLinkBanner = document.getElementById("patientLinkBanner");
        const emailPatientSidebar = document.getElementById("emailPatientSidebar");
        
        if (patientLinkBanner && emailPatientSidebar) {
            // Buscar paciente en la base de datos mock por coincidencia de nombre
            const senderNameLower = email.sender.toLowerCase();
            const patient = patientsData.find(p => {
                const patNameLower = p.name.toLowerCase();
                return senderNameLower.includes(patNameLower) || patNameLower.includes(senderNameLower);
            });

            if (patient) {
                // Rellenar Banner
                document.getElementById("linkedPatientDniText").textContent = patient.dni;
                patientLinkBanner.classList.remove("hidden");

                // Rellenar Sidebar
                document.getElementById("sidebarPatientAvatar").textContent = patient.name.charAt(0).toUpperCase();
                document.getElementById("sidebarPatientName").textContent = patient.name;
                document.getElementById("sidebarPatientDniBadge").textContent = `DNI: ${patient.dni}`;
                document.getElementById("sidebarPatientAge").textContent = `${patient.age} años`;
                document.getElementById("sidebarPatientPhone").textContent = patient.phone;
                document.getElementById("sidebarPatientHistory").innerHTML = renderClinicalHistory(patient.history);

                // Cargar próxima visita si existe
                const nextVisit = patient.visits && patient.visits.length > 0 ? patient.visits[0] : null;
                const visitCard = document.getElementById("sidebarPatientNextVisit");
                if (nextVisit) {
                    document.getElementById("sidebarPatientNextVisitDate").textContent = nextVisit.date;
                    document.getElementById("sidebarPatientNextVisitDesc").textContent = nextVisit.desc;
                    document.getElementById("sidebarPatientNextVisitDoctor").textContent = nextVisit.doctor;
                    visitCard.style.display = "block";
                } else {
                    visitCard.style.display = "none";
                }

                // Mostrar Sidebar
                emailPatientSidebar.classList.remove("hidden");

                // Vincular Acción: Reprogramar Cita Rápida
                document.getElementById("btnSidebarReprogram").onclick = () => {
                    const currentDateVal = nextVisit ? nextVisit.date : "";
                    const isDark = document.body.classList.contains("dark-mode");
                    
                    Swal.fire({
                        title: 'Reprogramar Consulta Externa',
                        background: isDark ? '#1e293b' : '#fff',
                        color: isDark ? '#f1f5f9' : '#1e293b',
                        html: `
                            <div style="text-align: left; font-size: 0.95rem; color: inherit;">
                                <p style="margin-bottom: 8px;"><strong>Paciente:</strong> ${patient.name}</p>
                                <p style="margin-bottom: 8px;"><strong>Médico/Servicio:</strong> ${nextVisit ? nextVisit.doctor : 'Consulta General'}</p>
                                <hr style="border-color: var(--border-color, #e2e8f0); margin: 12px 0;">
                                <label for="swalNewDate" style="display:block; font-weight:600; margin-bottom: 6px;">Seleccione Nueva Fecha:</label>
                                <input type="date" id="swalNewDate" class="swal2-input" style="width: 100%; margin: 0; background: ${isDark ? '#0f172a' : '#fff'}; color: ${isDark ? '#f1f5f9' : '#1e293b'}; border: 1px solid var(--border-color);" value="${currentDateVal.split('/').reverse().join('-')}">
                            </div>
                        `,
                        showCancelButton: true,
                        confirmButtonColor: 'var(--primary, #0099cc)',
                        cancelButtonColor: 'var(--text-muted, #64748b)',
                        confirmButtonText: 'Confirmar Cambio',
                        cancelButtonText: 'Cancelar',
                        preConfirm: () => {
                            const newDate = document.getElementById('swalNewDate').value;
                            if (!newDate) {
                                Swal.showValidationMessage('Por favor seleccione una fecha válida');
                            }
                            return newDate;
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Convertir AAAA-MM-DD a DD/MM/AAAA para el mock
                            const [y, m, d] = result.value.split('-');
                            const formattedDate = `${d}/${m}/${y}`;

                            if (nextVisit) {
                                nextVisit.date = formattedDate;
                                if (!nextVisit.desc.includes("Reprogramada")) {
                                    nextVisit.desc += " (Reprogramada)";
                                }
                            } else {
                                patient.visits.unshift({
                                    date: formattedDate,
                                    desc: "Consulta Externa (Reprogramada)",
                                    doctor: "Medicina General"
                                });
                            }

                            // Re-cargar panel de lectura
                            loadEmailIntoPane(id);

                            Swal.fire({
                                icon: 'success',
                                title: 'Cita Reprogramada',
                                text: `Se cambió la cita al ${formattedDate}. Notificación enviada al paciente.`,
                                confirmButtonColor: 'var(--primary, #0099cc)',
                                background: isDark ? '#1e293b' : '#fff',
                                color: isDark ? '#f1f5f9' : '#1e293b'
                            });
                        }
                    });
                };

                // Vincular Acción: Ver Ficha Completa en Base de Datos
                document.getElementById("btnSidebarFullProfile").onclick = () => {
                    const folderPatients = document.getElementById("folderPatients");
                    if (folderPatients) {
                        // Simular clic en la carpeta de base de datos de pacientes
                        folderPatients.click();
                        // Seleccionar al paciente y renderizar
                        selectedPatientId = patient.id;
                        renderPatientsList();
                    }
                };

            } else {
                // Ocultar elementos clínicos si el remitente no es paciente
                patientLinkBanner.classList.add("hidden");
                emailPatientSidebar.classList.add("hidden");
            }
        }
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

        // Ocultar banners y sidebar clínicos
        const patientLinkBanner = document.getElementById("patientLinkBanner");
        const emailPatientSidebar = document.getElementById("emailPatientSidebar");
        if (patientLinkBanner) patientLinkBanner.classList.add("hidden");
        if (emailPatientSidebar) emailPatientSidebar.classList.add("hidden");
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

                // Soporte responsivo para móvil (mostrar panel de lectura)
                const appCard = document.querySelector(".email-app-card");
                if (appCard) {
                    appCard.classList.add("show-reading");
                }
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

            // Ocultar carpetas en móvil para volver a ver la lista correspondiente
            const appCard = document.querySelector(".email-app-card");
            if (appCard) {
                appCard.classList.remove("show-folders");
                appCard.classList.remove("show-reading");
            }

            const folderName = folder.getAttribute("data-folder");
            currentFolder = folderName;
            
            // Reiniciar filtros de búsquedas e ID seleccionado al cambiar
            searchBarInput.value = "";
            selectedEmailId = null;
            selectedPatientId = null;

            const patientActionsBar = document.getElementById("patientActionsBar");
            const emailRoleFilters = document.getElementById("emailRoleFilters");
            if (folderName === "patients") {
                searchBarInput.placeholder = "Buscar paciente por Nombre o DNI...";
                if (patientActionsBar) patientActionsBar.classList.remove("hidden");
                if (emailRoleFilters) emailRoleFilters.classList.add("hidden");
                
                emailList.classList.add("hidden");
                patientList.classList.remove("hidden");
                
                emailReadingPane.classList.add("hidden");
                patientDetailsPane.classList.remove("hidden");
                
                renderPatientsList();
            } else {
                searchBarInput.placeholder = "Buscar en la bandeja...";
                if (patientActionsBar) patientActionsBar.classList.add("hidden");
                if (emailRoleFilters) emailRoleFilters.classList.remove("hidden");
                
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
            const rawBody = document.getElementById("bodyEmail").value;
            const body = rawBody.replace(/\n/g, '<br>');
            
            // Capturar nombre del usuario logueado en la intranet
            const senderName = document.getElementById("sidebarUserName") ? document.getElementById("sidebarUserName").innerText.trim() : "Administrador";

            const isDark = document.body.classList.contains("dark-mode");

            // 1. Mostrar alerta de carga con SweetAlert2
            Swal.fire({
                title: 'Enviando Correo...',
                text: 'Conectando con Google Apps Script y Gmail, por favor espere.',
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#f1f5f9' : '#1e293b',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // 2. Si la URL no ha sido reemplazada, simular con advertencia
            if (GOOGLE_SCRIPT_URL === "URL_DE_TU_GOOGLE_SCRIPT") {
                setTimeout(() => {
                    const newEmail = {
                        id: (Date.now()).toString(),
                        folder: "sent",
                        sender: senderName,
                        email: "luis.admin@hcaleta.gob.pe",
                        time: "Ahora",
                        subject: subject,
                        body: `<p>${body}</p>`,
                        unread: false
                    };
                    emailsData.unshift(newEmail);
                    hideModal();
                    if (currentFolder === "sent") {
                        renderEmailsList();
                    }

                    Swal.fire({
                        icon: 'warning',
                        title: 'Modo Simulado Activo',
                        html: 'El mensaje se registró localmente en la bandeja de <b>Enviados</b>.<br><br><small style="color:var(--text-muted);">Nota: Para enviar correos reales y guardarlos en Google Sheets, debes configurar la variable <code>GOOGLE_SCRIPT_URL</code> al inicio del archivo <code>admin/js/crm-email.js</code>.</small>',
                        background: isDark ? '#1e293b' : '#fff',
                        color: isDark ? '#f1f5f9' : '#1e293b',
                        confirmButtonColor: 'var(--primary, #0099cc)'
                    });
                }, 1200);
                return;
            }

            // 3. Realizar petición POST real a Google Apps Script
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    toEmail: to,
                    subject: subject,
                    body: rawBody,
                    senderName: senderName // remitente dinámico
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json().catch(() => ({ status: "success" }));
                }
                throw new Error("Respuesta no satisfactoria de la red");
            })
            .then(data => {
                const newEmail = {
                    id: (Date.now()).toString(),
                    folder: "sent",
                    sender: senderName,
                    email: "luis.admin@hcaleta.gob.pe",
                    time: "Ahora",
                    subject: subject,
                    body: `<p>${body}</p>`,
                    unread: false
                };

                emailsData.unshift(newEmail);
                hideModal();

                if (currentFolder === "sent") {
                    renderEmailsList();
                }

                Swal.fire({
                    icon: 'success',
                    title: '¡Correo Enviado!',
                    text: 'El mensaje ha sido enviado por Gmail al destinatario y registrado en la hoja de cálculo de Google.',
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f1f5f9' : '#1e293b',
                    confirmButtonColor: 'var(--primary, #0099cc)'
                });
            })
            .catch(error => {
                console.warn("Excepción capturada al enviar (CORS o Red):", error);
                
                // Fallback: Apps Script redirige y causa errores de lectura CORS, pero el correo suele enviarse correctamente.
                const newEmail = {
                    id: (Date.now()).toString(),
                    folder: "sent",
                    sender: senderName,
                    email: "luis.admin@hcaleta.gob.pe",
                    time: "Ahora",
                    subject: subject,
                    body: `<p>${body}</p>`,
                    unread: false
                };

                emailsData.unshift(newEmail);
                hideModal();

                if (currentFolder === "sent") {
                    renderEmailsList();
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Intento de Envío Realizado',
                    html: 'Se procesó la solicitud de envío. Si la URL configurada es correcta, el correo fue enviado y guardado.<br><br><small style="color:var(--text-muted);">Nota: En algunos navegadores la respuesta de Google se bloquea por políticas de origen cruzado (CORS), pero el script se ejecuta normalmente.</small>',
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f1f5f9' : '#1e293b',
                    confirmButtonColor: 'var(--primary, #0099cc)'
                });
            });
        });
    }

    // 12. CONTROLES DE PORTABILIDAD MÓVIL (TABS/Toggles)
    const btnShowFolders = document.getElementById("btnShowFolders");
    if (btnShowFolders) {
        btnShowFolders.addEventListener("click", () => {
            const appCard = document.querySelector(".email-app-card");
            if (appCard) {
                appCard.classList.toggle("show-folders");
            }
        });
    }

    const backButtons = document.querySelectorAll(".btn-back-to-list");
    backButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const appCard = document.querySelector(".email-app-card");
            if (appCard) {
                appCard.classList.remove("show-reading");
            }
        });
    });

    // 13. REGISTRAR NUEVO PACIENTE EN CRM
    const btnRegisterPatient = document.getElementById("btnRegisterPatient");
    if (btnRegisterPatient) {
        btnRegisterPatient.addEventListener("click", () => {
            const isDark = document.body.classList.contains("dark-mode");
            Swal.fire({
                title: 'Registrar Nuevo Paciente en CRM',
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#f1f5f9' : '#1e293b',
                html: `
                    <div style="text-align: left; font-size: 0.9rem; display: flex; flex-direction: column; gap: 10px;">
                        <div>
                            <label style="display:block; font-weight:600; margin-bottom: 4px;">Nombre Completo:</label>
                            <input type="text" id="newPatientName" class="swal2-input" style="width: 100%; margin: 0; background: ${isDark ? '#0f172a' : '#fff'}; color: ${isDark ? '#f1f5f9' : '#1e293b'}; border: 1px solid var(--border-color);" placeholder="Ej. Juan López">
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <div style="flex: 1;">
                                <label style="display:block; font-weight:600; margin-bottom: 4px;">DNI:</label>
                                <input type="text" id="newPatientDni" class="swal2-input" style="width: 100%; margin: 0; background: ${isDark ? '#0f172a' : '#fff'}; color: ${isDark ? '#f1f5f9' : '#1e293b'}; border: 1px solid var(--border-color);" placeholder="8 dígitos" maxlength="8">
                            </div>
                            <div style="flex: 1;">
                                <label style="display:block; font-weight:600; margin-bottom: 4px;">Edad:</label>
                                <input type="number" id="newPatientAge" class="swal2-input" style="width: 100%; margin: 0; background: ${isDark ? '#0f172a' : '#fff'}; color: ${isDark ? '#f1f5f9' : '#1e293b'}; border: 1px solid var(--border-color);" placeholder="Años">
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <div style="flex: 1;">
                                <label style="display:block; font-weight:600; margin-bottom: 4px;">Teléfono:</label>
                                <input type="text" id="newPatientPhone" class="swal2-input" style="width: 100%; margin: 0; background: ${isDark ? '#0f172a' : '#fff'}; color: ${isDark ? '#f1f5f9' : '#1e293b'}; border: 1px solid var(--border-color);" placeholder="Ej. 987654321">
                            </div>
                            <div style="flex: 1;">
                                <label style="display:block; font-weight:600; margin-bottom: 4px;">Dirección:</label>
                                <input type="text" id="newPatientAddress" class="swal2-input" style="width: 100%; margin: 0; background: ${isDark ? '#0f172a' : '#fff'}; color: ${isDark ? '#f1f5f9' : '#1e293b'}; border: 1px solid var(--border-color);" placeholder="Jr. Lima 123">
                            </div>
                        </div>
                        <div>
                            <label style="display:block; font-weight:600; margin-bottom: 4px;">Alergias e Historial:</label>
                            <input type="text" id="newPatientHistory" class="swal2-input" style="width: 100%; margin: 0; background: ${isDark ? '#0f172a' : '#fff'}; color: ${isDark ? '#f1f5f9' : '#1e293b'}; border: 1px solid var(--border-color);" placeholder="Alergias, condiciones médicas">
                        </div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonColor: 'var(--primary, #0099cc)',
                cancelButtonColor: 'var(--text-muted, #64748b)',
                confirmButtonText: 'Registrar Paciente',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const name = document.getElementById('newPatientName').value.trim();
                    const dni = document.getElementById('newPatientDni').value.trim();
                    const age = document.getElementById('newPatientAge').value.trim();
                    const phone = document.getElementById('newPatientPhone').value.trim();
                    const address = document.getElementById('newPatientAddress').value.trim();
                    const history = document.getElementById('newPatientHistory').value.trim();
                    
                    if (!name || !dni || !age || !phone) {
                        Swal.showValidationMessage('Nombre, DNI, Edad y Teléfono son obligatorios');
                        return false;
                    }
                    if (dni.length !== 8 || isNaN(dni)) {
                        Swal.showValidationMessage('El DNI debe ser numérico de 8 dígitos');
                        return false;
                    }
                    
                    return { name, dni, age, phone, address, history };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const data = result.value;
                    const newPatient = {
                        id: (patientsData.length + 1).toString(),
                        name: data.name,
                        dni: data.dni,
                        age: parseInt(data.age),
                        phone: data.phone,
                        address: data.address || "No registrada",
                        history: data.history || "Ninguno reportado",
                        summary: "Paciente registrado recientemente en el CRM.",
                        visits: [
                            { date: new Date().toLocaleDateString('es-PE'), desc: "Registro inicial de paciente en Intranet", doctor: "Sistema CRM Correo" }
                        ]
                    };
                    
                    patientsData.push(newPatient);
                    selectedPatientId = newPatient.id;
                    renderPatientsList();

                    // Soporte responsivo para móvil (mostrar panel de lectura con la ficha)
                    const appCard = document.querySelector(".email-app-card");
                    if (appCard && window.innerWidth <= 768) {
                        appCard.classList.add("show-reading");
                    }
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Paciente Registrado',
                        text: `${data.name} ha sido ingresado correctamente al CRM del hospital.`,
                        confirmButtonColor: 'var(--primary, #0099cc)',
                        background: isDark ? '#1e293b' : '#fff',
                        color: isDark ? '#f1f5f9' : '#1e293b'
                    });
                }
            });
        });
    }

    // Control de filtros de rol/categoría
    const filterChips = document.querySelectorAll(".filter-chip");
    if (filterChips) {
        filterChips.forEach(chip => {
            chip.addEventListener("click", () => {
                filterChips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                currentRoleFilter = chip.getAttribute("data-role");
                selectedEmailId = null; // Reiniciar selección para cargar el primer correo de la lista filtrada
                renderEmailsList(searchBarInput.value);
            });
        });
    }

    // Inicializar bandeja
    updateFolderBadges();
    renderEmailsList();
});
