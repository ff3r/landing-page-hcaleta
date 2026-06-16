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
├── index.html
├── institucional.html
├── convocatorias.html
├── consulta-cupos.html
├── consulta-cita.html
├── contactenos.html
├── comentarios-sugerencias.html
├── valoracion-usuarios.html
│
├── admin/
│   ├── index.html
│   ├── dashboard.html
│   ├── crm-email.html
│   ├── crm-fidelidad.html
│   ├── css/
│   │   ├── shared.css
│   │   ├── login.css
│   │   ├── dashboard.css
│   │   ├── crm-email.css
│   │   └── crm-fidelidad.css
│   └── js/
│       ├── auth.js
│       ├── common.js
│       ├── dashboard.js
│       ├── crm-email.js
│       ├── crm-fidelidad.js
│       └── templates.js
│
├── css/
│   └── styles.css
│
├── js/
│   ├── script.js
│   ├── comentarios.js
│   └── valoracion.js
│
├── assets/
├── .gitignore
└── README.md
```

📌 Nota
Este proyecto fue desarrollado con fines académicos. Se utilizó asistencia de inteligencia artificial exclusivamente como apoyo para la aplicación de buenas prácticas y la gestión del flujo de trabajo en Git (commits, push y pull).
