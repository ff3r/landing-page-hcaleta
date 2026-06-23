# Guía de Configuración: Formulario CRM conectado a Google Sheets y Gmail

Esta guía explica paso a paso cómo conectar el formulario de **Redactar Correo** del CRM con una Hoja de Cálculo de Google y enviar correos reales por Gmail utilizando Google Apps Script, tal como lo solicita el diagrama del profesor.

---

## Paso 1: Crear la Hoja de Cálculo de Google
1. Entra a tu cuenta de Google Drive y abre [Google Sheets](https://sheets.google.com).
2. Crea una nueva hoja de cálculo en blanco.
3. Ponle como título en la esquina superior izquierda: **"Historial Correos CRM - La Caleta"**.
4. En la primera fila, puedes escribir las siguientes cabeceras en las columnas **A, B, C, D y E** para identificar los datos guardados:
   - **A1:** `Fecha y Hora`
   - **B1:** `Remitente`
   - **C1:** `Destinatario`
   - **D1:** `Asunto`
   - **E1:** `Mensaje`

---

## Paso 2: Abrir y Pegar el Código en Google Apps Script
1. En la parte superior de tu hoja de cálculo, haz clic en el menú **Extensiones** y selecciona **Apps Script**.
2. Se abrirá una nueva pestaña con el editor de código. Por defecto verás un archivo llamado `Código.gs`.
3. Borra todo el código que viene por defecto y pega el siguiente script:

```javascript
function doPost(e) {
  // Configurar las cabeceras de CORS para permitir peticiones externas
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    // 1. Procesar datos entrantes de la petición POST
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    var remitente = "Administración - Hospital La Caleta";
    var destinatario = data.toEmail || data.email;
    var asunto = data.subject || data.asunto || "Sin Asunto";
    var mensaje = data.body || data.mensaje || "";
    var fecha = new Date();

    if (!destinatario) {
      throw new Error("El correo electrónico del destinatario es obligatorio");
    }

    // 2. Registrar la fila en la Hoja de Cálculo activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([fecha, remitente, destinatario, asunto, mensaje]);

    // 3. Enviar correo electrónico real mediante GmailApp
    var htmlBody = 
      "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px; color: #1e293b;'>" +
      "  <h2 style='color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 8px;'>Hospital La Caleta - Intranet</h2>" +
      "  <p>Estimado(a) paciente / usuario,</p>" +
      "  <p>Se le ha enviado un mensaje oficial desde el área de administración:</p>" +
      "  <div style='background-color: #f8fafc; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0; font-style: italic; white-space: pre-wrap;'>" +
           mensaje +
      "  </div>" +
      "  <p style='margin-top: 20px; font-size: 0.9rem; color: #64748b;'>Por favor, no responda a este correo directamente, fue enviado desde una cuenta automatizada.</p>" +
      "  <hr style='border: 0; border-top: 1px solid #e2e8f0; margin-top: 25px;'>" +
      "  <p style='font-size: 0.8rem; color: #94a3b8; text-align: center;'>Av. Malecon Grau s/n - Urb. La Caleta, Chimbote | Teléfono: (043) 327589</p>" +
      "</div>";

    MailApp.sendEmail({
      to: destinatario,
      subject: asunto,
      htmlBody: htmlBody
    });

    // 4. Retornar JSON de éxito
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Mensaje enviado por Gmail y registrado en Google Sheets con éxito."
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);

  } catch (error) {
    // Retornar JSON de error
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

// Configurar respuesta a peticiones previas OPTIONS (CORS preflight)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
}
```

4. Haz clic en el icono del disquete (**Guardar proyecto**) en la barra de herramientas superior.

---

## Paso 3: Desplegar el Script como Aplicación Web Pública
Para que tu formulario web local pueda conectarse a este script de Google, debes desplegarlo públicamente:
1. Haz clic en el botón azul **Implementar** (arriba a la derecha) y selecciona **Nueva implementación**.
2. Haz clic en el icono de engranaje (a la izquierda de "Seleccionar tipo") y elige **Aplicación web**.
3. Completa los siguientes campos:
   - **Descripción:** Escribe `v1.0 Envío de Correos`.
   - **Ejecutar como:** Selecciona **Yo (tu-correo@gmail.com)**.
   - **Quién tiene acceso:** Selecciona **Cualquiera** *(esto es indispensable para permitir solicitudes externas sin inicio de sesión obligatoria)*.
4. Haz clic en el botón **Implementar**.
5. **Otorgar Permisos:** Te saldrá una ventana solicitando acceso a tu cuenta. 
   - Haz clic en **Autorizar acceso**.
   - Elige tu cuenta de Google.
   - Verás un aviso de "Google no ha verificado esta aplicación". Haz clic en las letras pequeñas que dicen **Avanzado** o **Configuración avanzada** abajo a la izquierda.
   - Haz clic en el enlace **Ir a Proyecto sin título (no seguro)**.
   - En la pantalla de permisos, haz clic en **Permitir**.
6. Una vez completado, verás una ventana de confirmación. Copia el enlace largo bajo el título **URL de la aplicación web** (termina en `/exec`).

---

## Paso 4: Enlazar la URL con el Código de tu Proyecto
1. Abre tu editor de código en tu computadora.
2. Ve al archivo `admin/js/crm-email.js` (línea 2).
3. Busca la línea:
   ```javascript
   const GOOGLE_SCRIPT_URL = "URL_DE_TU_GOOGLE_SCRIPT";
   ```
4. Reemplaza `"URL_DE_TU_GOOGLE_SCRIPT"` pegando la URL de la aplicación web que copiaste en el Paso 3. Por ejemplo:
   ```javascript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1..._abc123/exec";
   ```
5. Guarda el archivo. ¡Listo! Ya está todo conectado.

---

## Paso 5: Probar el Envío
1. Abre la Intranet (`admin/crm-email.html`) en tu navegador.
2. Haz clic en el botón azul **Redactar** en la columna de carpetas de correo.
3. Llena los datos:
   - **Para:** Escribe tu correo personal (u otro que puedas revisar).
   - **Asunto:** Escribe `Prueba desde CRM Hospital`.
   - **Mensaje:** Escribe un mensaje de prueba.
4. Presiona **Enviar Correo**.
5. Aparecerá una pantalla de carga y luego una alerta de confirmación con SweetAlert2.
6. Revisa tu Hoja de Cálculo de Google y tu bandeja de entrada de correo. Verás que:
   - Se ha registrado la fila con los detalles del envío y la hora exacta.
   - Has recibido un correo HTML con un diseño profesional del Hospital La Caleta.
