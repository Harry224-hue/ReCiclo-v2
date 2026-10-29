# PENDIENTES DE VERIFICACIÓN — PROYECTO RECICLO
## Lista de Chequeo Previa a la Entrega Oficial
**Convocatoria: Semana de Oxigena tus Ideas**  
*Instituto Tecnológico de Morelia — Departamento de Química y Bioquímica*

---

### 1. Datos Administrativos del Equipo y Asesor

Los siguientes campos fueron marcados con `[DATO PENDIENTE DE CONFIRMAR]` en el documento Word corregido (`Documento_ReCiclo_Corregido_Oficial.docx`) y deben ser completados por el equipo con información oficial:

- [ ] **Números de Control de los Integrantes:**
  - García Montañez, Ulises Jasen: `____________________` *(Escribir únicamente los dígitos numéricos, sin la letra "l" al inicio)*.
  - Medina Cuamba, Juan Pablo: `____________________`.
  - Solis Calvillo, Juan Pablo: `____________________`.
  *(Nota: Se verificó la secuencia alfabética requerida por el formato. La cuarta fila de la tabla en el documento Word se dejó vacía para no fingir un integrante inexistente).*
- [ ] **Docente Asesor:**
  - Nombre completo comenzando por apellido paterno: `[Apellido Paterno] [Apellido Materno] [Nombre(s)]`.
- [ ] **Carrera de Adscripción:**
  - Especificar la carrera oficial en la que están matriculados los integrantes (ej. *Ingeniería en Sistemas Computacionales*, *Ingeniería Bioquímica*, etc.).
- [ ] **Semestre y Grupo:**
  - Semestre que cursan (ej. *4° Semestre*) y grupo correspondiente a la materia de Desarrollo Sustentable (*Clave: ACD-0908*).
- [ ] **Clave del Proyecto:**
  - Consultar con el docente si el comité organizador asignó una clave oficial o si se registra formalmente la clave propuesta: `DS-2026-ITM-RECICLO`.
- [ ] **Confirmación de Fechas y Convocatoria:**
  - Confirmar con el docente si se está cerrando la entrega de la edición Enero-Junio 2026 o si el formato corresponde a una edición subsecuente del concurso. Ajustar los plazos de entrega y fecha de presentación según el calendario vigente indicado por la academia.

---

### 2. Entregables Multimedia Requeridos

La convocatoria establece dos enlaces que deben agregarse en los apartados 15 y 16 antes de la entrega final:

- [ ] **Apartado 15: Enlace al Cartel Oficial:**
  - [ ] Descargar la plantilla oficial: `Cartel Semana Bioquimica DS Ene_Junio 2026.pptx`.
  - [ ] Desarrollar el cartel manteniendo total coherencia con el documento honesto (sin inventar porcentajes de precisión ni resultados no probados).
  - [ ] Exportar a formato PDF.
  - [ ] Subir el archivo a Google Drive o OneDrive y configurar el acceso público a **"Cualquier persona con el enlace puede ver"**.
  - [ ] Probar la apertura del enlace en modo incógnito y pegarlo en la sección 15 del documento Word.

- [ ] **Apartado 16: Enlace al Video Explicativo:**
  - [ ] **Duración estricta:** Máximo 3 minutos (videos que exceden la duración suelen ser penalizados).
  - [ ] **Frase de apertura obligatoria:** El video **DEBE COMENZAR** textualmente con la leyenda reglamentaria:
    > *"Buenos días, somos del Tecnológico Nacional de México / Instituto Tecnológico de Morelia del semestre Enero – Junio 2026..."*
  - [ ] **Estructura del video:**
    1. Carrera a la que pertenece el proyecto y el grupo.
    2. Nombre del proyecto (*ReCiclo*).
    3. Nombres y apellidos de las personas que realizaron el trabajo.
    4. ODS de impacto principal (*ODS 12: Producción y Consumo Responsables*).
    5. Explicación breve de la propuesta y demostración de las funciones implementadas en el software.
  - [ ] Subir a YouTube (en modo público u oculto) o Google Drive y verificar la apertura del enlace sin inicio de sesión.

---

### 3. Verificaciones de Campo y Fuentes Institucionales

Para contar con respaldo real antes de defender la propuesta:

- [ ] **Cotejo del Procedimiento de RSU con el SGI:**
  - Acudir a la Coordinación Ambiental del SGI del ITM para verificar cuál es la revisión oficial vigente del procedimiento *ITMORELIA-IT-AM-007*.
  - En el documento corregido se utiliza la **Rev. 2 (10 de octubre de 2019)**, que es la copia pública accesible en el portal del instituto. Si el SGI confirma una revisión más reciente (como la Rev. 3), solicitar una copia para verificar si existen cambios en los colores o criterios antes de citarla.
- [ ] **Levantamiento Físico de Contenedores en el Campus:**
  - Realizar una visita de inspección a las áreas consideradas preliminarmente en el mapa (exteriores de cafeterías, andadores de aulas y plazas cívicas de Campus 1 y 2).
  - Registrar con fotografías qué recipientes existen actualmente, qué colores presentan y qué señalización tienen.
  - *Postura honesta ante el jurado:* Si los jueces preguntan por el mapa, la respuesta correcta es: *"Los marcadores actuales son puntos de referencia preliminares basados en los planos arquitectónicos; nuestro siguiente paso es concluir el censo físico en campo para registrar la ubicación exacta y el estado de los contenedores"*.
- [ ] **Matrícula Estudiantil Oficial:**
  - Obtener del departamento de Planeación o de la página oficial del ITM el número aproximado de alumnos inscritos para fundamentar con certeza la población potencial descrita en el impacto.

---

### 4. Verificaciones Técnicas y de Seguridad del Software

Controles técnicos obligatorios para asegurar la estabilidad y seguridad del prototipo:

- [ ] **Protección y Seguridad de la API de Google Gemini:**
  - [ ] **Verificar que la clave de API no esté expuesta en el código del cliente:** Confirmar que las peticiones a Gemini se realicen exclusivamente a través del backend serverless (`/api/gemini` en `api/gemini.js`), manteniendo la variable de entorno `GEMINI_API_KEY` en el servidor sin exponerla en el bundle frontend de React ni en el APK de Capacitor.
  - [ ] **Privacidad de las imágenes:** Verificar que el sistema no procese ni almacene imágenes que contengan rostros, identificaciones o datos personales innecesarios.
  - [ ] **Límites de cuota y disponibilidad:** Probar que la cuota de la API en Google AI Studio soporte las peticiones necesarias sin exceder los límites de frecuencia (rate limits) del nivel utilizado.
  - [ ] **Manejo de errores de conectividad:** Confirmar que la aplicación muestre un mensaje claro si no hay conexión a internet o si el servicio de la API no responde.

- [ ] **Preparación para Demostraciones Técnicas:**
  - [ ] Probar la aplicación en los dispositivos móviles que se utilizarán para la demostración, verificando que la cámara web o del teléfono funcione sin permisos bloqueados.
  - [ ] Contar con una alternativa de conectividad móvil (datos móviles compartidos) por si la red del recinto presenta intermitencias.
  - [ ] Llevar los dispositivos con carga completa de batería.
  - [ ] Disponer de 3 o 4 muestras físicas limpias de prueba (por ejemplo, una botella vacía de PET aplastada, una lata de aluminio limpia y un empaque de cartón) para mostrar la interacción del módulo de escaneo.
