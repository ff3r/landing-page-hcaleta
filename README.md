# 🏥 Landing Page - Hospital La Caleta

Landing page moderna para el Hospital La Caleta

👉 Demo en vivo: https://ff3r.github.io/landing-page-hcaleta/

---
## 👥 Colaboradores

- Fernando Chinchay (@ff3r) 
- Gerardo Marcelo (@grdie) 
- Juan Briones (@John117-JCLB)
  
## 🚀 Características

### Portal Público
- Diseño moderno y responsivo para el paciente.
- Programación de citas y consulta de cupos médicos en tiempo real.
- Buzón de comentarios, sugerencias y valoración del servicio.

### Intranet Administrativa (ERP & CRM)
- **Dashboard ERP:** Monitoreo de camas, médicos de turno, recursos e inventario crítico.
- **Módulos Integrados:** Finanzas (ingresos/egresos) y Recursos Humanos (Gantt interactivo y control de asistencia).
- **CRM Correo:** Bandeja de entrada con vinculación automática de correos a fichas clínicas EHR/ERP.
- **CRM Fidelización:** Clasificación de pacientes en Tiers (Platino, Oro, Plata, Bronce) con canje de puntos de recompensa.
- **Tema Claro / Oscuro:** Soporte nativo y consistente para ambos temas a nivel global.

---

## 🛠️ Tecnologías usadas

- HTML5
- CSS3 (Variables y sistema de diseño adaptativo)
- JavaScript (Vainilla para la lógica e interactividad)
- Chart.js (Visualización de datos)
- SweetAlert2 (Notificaciones y modales interactivos)

---

## 📁 Estructura del proyecto

```plaintext
landing-page-hcaleta/
│
├── index.html                   # Página de inicio del portal público
├── institucional.html           # Información institucional
├── convocatorias.html           # Convocatorias laborales
├── consulta-cupos.html         # Consulta de cupos de citas
├── consulta-cita.html          # Consulta y reserva de citas
├── contactenos.html             # Formulario de contacto
├── comentarios-sugerencias.html # Registro de sugerencias y reclamos
├── valoracion-usuarios.html     # Valoración del servicio médico
│
├── admin/                       # Intranet Administrativa (ERP & CRM)
│   ├── index.html               # Inicio de sesión (Login)
│   ├── dashboard.html           # Dashboard ERP y accesos a Finanzas y RRHH
│   ├── crm-email.html           # CRM Correo (Inbox clínico)
│   ├── crm-fidelidad.html       # CRM Fidelización (Puntos y niveles)
│   ├── css/                     # Hojas de estilo específicas del admin
│   │   ├── shared.css           # Estilos comunes y variables globales
│   │   ├── login.css            # Estilos del login con mesh gradient
│   │   ├── dashboard.css        # Estilos de métricas, Gantt y ERP
│   │   ├── crm-email.css        # Estilos de bandeja de entrada y EHR
│   │   └── crm-fidelidad.css    # Estilos de tiers metálicos y puntos
│   └── js/                      # Lógica de la intranet
│       ├── auth.js              # Validación de sesión
│       ├── common.js            # Temas claro/oscuro y perfil común
│       ├── dashboard.js         # Lógica de finanzas, camas y Gantt
│       ├── crm-email.js         # Lógica de bandeja e historial clínico
│       ├── crm-fidelidad.js     # Lógica de acumulación de puntos y tiers
│       └── templates.js         # Plantillas HTML dinámicas
│
├── css/                         # Estilos del portal público
│   └── styles.css
│
├── js/                          # Scripts del portal público
│   ├── script.js
│   ├── comentarios.js
│   └── valoracion.js
│
├── assets/                      # Recursos multimedia (logos, imágenes)
├── .gitignore
└── README.md
```

📌 Nota
Este proyecto fue desarrollado con fines académicos. Se utilizó asistencia de inteligencia artificial exclusivamente como apoyo para la aplicación de buenas prácticas y la gestión del flujo de trabajo en Git (commits, push y pull).
