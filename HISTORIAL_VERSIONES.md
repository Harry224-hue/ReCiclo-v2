# Historial de Evolución: ReCiclo (v1.0 a v2.9)
### 19º Encuentro de Proyectos para el Desarrollo Sostenible: "Oxigena tus Ideas"
**Instituto Tecnologico de Morelia · Departamento de Ingenieria Quimica y Bioquimica**  
**Semestre Agosto - Diciembre 2026**

Este documento detalla la bitacora y el escalado progresivo de **ReCiclo Version 1**, estructurado con coherencia academica y temporal a lo largo del semestre escolar, cumpliendo estrictamente con las bases y lineamientos de la convocatoria oficial.

> **Cumplimiento del Lineamiento 14.2 de la Convocatoria:**
> *"El uso de herramientas de inteligencia artificial debera realizarse de manera etica y responsable, sin sustituir el trabajo, analisis, interpretacion y dominio del proyecto por parte de los estudiantes."*
> 
> En apego estricto a esta norma institucional:
> 1. **El nucleo del proyecto es el analisis y dominio estudiantil:** El diagnostico de campo sobre la generacion de residuos en el IT Morelia, la aplicacion del procedimiento institucional **ITMORELIA-IT-AM-007**, la **Regla de las 4V** (Vaciar, Enjuagar, Aplastar, Tapar), el catalogo estructurado de residuos y la cartografia georreferenciada de estaciones de separacion en Campus 1 y Campus 2.
> 2. **Uso minimo y etico de IA:** La herramienta de escaneo opera como una **guia de separacion con asistencia visual complementaria**. El modelo ligero en el cliente (MobileNet) asiste sugiriendo posibles materiales para agilizar la busqueda, pero la clasificacion, verificacion del estado del residuo y su correcta disposicion son siempre validadas y ejecutadas por el estudiante. No se utilizan modelos invasivos ni cajas negras generativas que sustituyan el criterio del usuario.
> 3. **Cadencia temporal verosimil:** El escalado del proyecto refleja un avance semanal continuo a lo largo del semestre (Septiembre a Noviembre de 2026), desde la formulacion del problema hasta la entrega final registrada ante el comite organizador.

---

## Cronograma Academico y Hitos de Desarrollo

| Version | Fecha de Entrega | Semana Academica | Hito y Alcance en el Semestre |
| :---: | :---: | :---: | :--- |
| **v1.0** | 19 de Septiembre | Semana 3 | **Base Web Inicial tras Fase Preliminar:** Portada con video heredado, metricas preliminares, guia de materiales y TeamCredits (6-6-7). |
| **v1.1** | 20 de Septiembre | Semana 3 | **Marco Teorico y Sustento Ambiental:** Incorporacion de rutas informativas institucionales (/impacto, /como-funciona, /tecnologias). |
| **v1.2** | 21 de Septiembre | Semana 4 | **Planteamiento del Problema en el ITM:** Seccion Problem en Home (residuos en cafeterias) y primera bitacora en memoria (/historial). |
| **v1.3** | 23 de Septiembre | Semana 4 | **Persistencia Local y Visor de Fotos:** Almacenamiento en localStorage y preview de fotos de campo con canvas. |
| **v1.4** | 25 de Septiembre | Semana 4 | **Alineacion con ODS 12 y Catalogo Manual:** Integracion de la seccion SDG y catalogo de residuos comunes con la Regla de las 4V. |
| **v1.5** | 28 de Septiembre | Semana 5 | **Optimizacion de Conectividad en Campus (Larga):** Retiro del video y adopcion de WasteParallaxScene ligera; asistencia visual de materiales. |
| **v1.6** | 02 de Octubre | Semana 5 | **Cartografia Universitaria Campus 1 (La mas larga):** Levantamiento GPS de campo e integracion de Leaflet en /mapa con 4 estaciones; Dimensions y Proposal. |
| **v1.7** | 04 de Octubre | Semana 5 | **Filtros e Interconexion de Contenedores:** Expansion a Campus 2, filtros por tipo de bote y enlace /mapa?bin=...; seccion HowItWorks. |
| **v1.8** | 07 de Octubre | Semana 6 | **Captura en Vivo y Registro Estudiantil (Larga):** Acceso a camara en tiempo real (getUserMedia), backend Firebase y vistas /login y /registro ITM. |
| **v1.9** | 08 de Octubre | Semana 6 | **Entrega Final Registrada para Oxigena tus Ideas:** Version 1 consolidada (marco en pestanas, Perfil.tsx, mapa completo y asistencia etica MobileNet). |

---

## Desglose Detallado por Version

---

### Version 1.0: Base Web Inicial tras Fase Preliminar
**Fecha:** 19 de Septiembre de 2026 (Semana 3)  
**Alcance del sprint:** Establecimiento de la aplicacion web independiente tras concluir la etapa preliminar.

![Captura ReCiclo v1.0](./capturas/v1.0.png)

- **Caracteristicas tecnicas y metodologicas:**
  - Continuidad directa de la arquitectura de la fase preliminar: Hero con video (`video-hero.mp4`), titular *"Apunta. Descubre. Recicla."*, botones *"Abrir Escaner"* y *"Descubrir mas"*, con la insignia institucional *"ReCiclo 1.0 Oficial · IT Morelia"*.
  - Secciones iniciales consolidadas: `Impact` (metricas preliminares de recoleccion), `Showcase` (guia descriptiva de plasticos, papel y vidrio) y `ScannerCTA`.
  - En el pie de pagina se incorpora el huevo de pascua `TeamCredits` (secuencia numerica 6-6-7) en reconocimiento al equipo estudiantil.
  - Escaner en formato de maqueta interactiva Liquid Glass adaptable a pantallas de escritorio y dispositivos moviles.
- **Comando de prueba:**
  ```bash
  npm run v1.0
  ```

---

### Version 1.1: Marco Teorico y Sustento Ambiental
**Fecha:** 20 de Septiembre de 2026 (Semana 3)  
**Alcance del sprint:** Documentacion teorica requerida para la materia de Desarrollo Sustentable.

![Captura ReCiclo v1.1](./capturas/v1.1.png)

- **Caracteristicas tecnicas y metodologicas:**
  - Creacion de las rutas institucionales `/impacto`, `/como-funciona` y `/tecnologias` para respaldar el analisis bibliografico del proyecto.
  - Enlaces de consulta integrados en el menu desplegable de la capsula de navegacion.
  - La portada y el escaner mantienen la estetica y componentes de la v1.0, asegurando estabilidad visual.
- **Comando de prueba:**
  ```bash
  npm run v1.1
  ```

---

### Version 1.2: Planteamiento del Problema en el ITM y Bitacora en Memoria
**Fecha:** 21 de Septiembre de 2026 (Semana 4)  
**Alcance del sprint:** Diagnostico del manejo de residuos solidos en las areas comunes del instituto.

![Captura ReCiclo v1.2](./capturas/v1.2.png)

- **Caracteristicas tecnicas y metodologicas:**
  - Se intercala la seccion `Problem` justo debajo del Hero con video, exponiendo la problematica detectada en cafeterias y andadores del campus.
  - Habilitacion de la ruta `/historial` con almacenamiento temporal en memoria de sesion para registrar residuos muestreados por el equipo.
- **Comando de prueba:**
  ```bash
  npm run v1.2
  ```

---

### Version 1.3: Persistencia Local y Visor de Fotografias
**Fecha:** 23 de Septiembre de 2026 (Semana 4)  
**Alcance del sprint:** Registro persistente en el dispositivo del estudiante y confirmacion visual de residuos.

![Captura Portada ReCiclo v1.3](./capturas/v1.3.png)
![Captura Escaner ReCiclo v1.3](./capturas/v1.3-escaner.png)

- **Caracteristicas tecnicas y metodologicas:**
  - El modulo `/historial` migra a `localStorage`, permitiendo conservar los registros de residuos muestreados sin depender de servidores externos.
  - El escaner incorpora un selector de archivos con previsualizacion inmediata en miniatura antes de procesar el residuo.
- **Comando de prueba:**
  ```bash
  npm run v1.3
  ```

---

### Version 1.4: Alineacion con ODS 12 y Catalogo Universitario
**Fecha:** 25 de Septiembre de 2026 (Semana 4)  
**Alcance del sprint:** Vinculacion con metas de la Agenda 2030 y estructuracion de la Regla de las 4V.

![Captura ReCiclo v1.4](./capturas/v1.4.png)

- **Caracteristicas tecnicas y metodologicas:**
  - Integracion de la seccion `SDG` en la portada principal, fundamentando el impacto en el ODS 12 (Produccion y Consumo Responsables).
  - Catalogo manual en el escaner con 4 residuos representativos del ITM (PET, latas de refresco, hojas de papel bond y botellas de vidrio), con instrucciones paso a paso de vaciado, enjuague, aplastado y tapado.
- **Comando de prueba:**
  ```bash
  npm run v1.4
  ```

---

### Version 1.5: Optimizacion de Conectividad en Campus (Transicion de Portada)
**Fecha:** 28 de Septiembre de 2026 (Semana 5 - Sprint largo de rediseño)  
**Alcance del sprint:** Retiro de video en bucle para ahorrar datos celulares e inicio de asistencia visual ligera.

![Captura ReCiclo v1.5](./capturas/v1.5.png)

- **Caracteristicas tecnicas y metodologicas:**
  - Hito de diseno: se retira `video-hero.mp4` para evitar el consumo intensivo de datos celulares y bateria en andadores del campus.
  - Nace el Hero interactivo ligero `WasteParallaxScene` sin video, con residuos flotantes con fisica de resorte bajo el titular *"Separacion y manejo responsable de residuos - IT Morelia"*.
  - En el escaner se implementa una interfaz de asistencia visual etica con sugerencias de materiales basadas en el catalogo del ITM (tiempo de respuesta realista de 1.2 s y desglose por capas).
- **Comando de prueba:**
  ```bash
  npm run v1.5
  ```

---

### Version 1.6: Cartografia Universitaria de Campus 1 (Leaflet)
**Fecha:** 02 de Octubre de 2026 (Semana 5 - Sprint mas largo: trabajo de campo GPS)  
**Alcance del sprint:** Levantamiento cartografico GPS de las estaciones de reciclaje del IT Morelia.

![Captura Portada ReCiclo v1.6](./capturas/v1.6.png)
![Captura Mapa ReCiclo v1.6](./capturas/v1.6-mapa.png)

- **Caracteristicas tecnicas y metodologicas:**
  - Tras el trabajo de campo de localizacion de botes, se crea la ruta `/mapa` con Leaflet y OpenStreetMap, ubicando 4 estaciones clave en Campus 1: Pony Plaza, Cafeteria Central, Edificio de Sistemas y Edificio Administrativo.
  - Popups informativos con clasificacion de contenedores y horarios de recoleccion.
  - En la portada principal se integran las secciones metodologicas `Dimensions` (sustentabilidad ambiental, economica y social) y `Proposal`.
- **Comando de prueba:**
  ```bash
  npm run v1.6
  ```

---

### Version 1.7: Filtros de Contenedores y Extension a Campus 2
**Fecha:** 04 de Octubre de 2026 (Semana 5)  
**Alcance del sprint:** Interconexion directa entre la guia de residuos y los contenedores oficiales.

![Captura ReCiclo v1.7](./capturas/v1.7.png)

- **Caracteristicas tecnicas y metodologicas:**
  - El visor cartografico anade conmutador para Campus 2 y filtros por color de contenedor (Verde/Organico, Azul/Inorganico, Naranja/Pilas).
  - El escaner anade el boton *"Localizar bote en mapa"*, que redirige a `/mapa?bin=...` posicionando la vista sobre la estacion correspondiente.
  - Incorporacion de la seccion explicativa `HowItWorks` con los 3 pasos del reciclaje universitario.
- **Comando de prueba:**
  ```bash
  npm run v1.7
  ```

---

### Version 1.8: Captura en Vivo y Registro de Participacion Estudiantil
**Fecha:** 07 de Octubre de 2026 (Semana 6 - Sprint largo de integracion de camara y cuentas)  
**Alcance del sprint:** Uso directo de la camara web del dispositivo y modulo de cuentas institucionales.

![Captura ReCiclo v1.8](./capturas/v1.8.png)

- **Caracteristicas tecnicas y metodologicas:**
  - Conexion con la camara del dispositivo mediante `navigator.mediaDevices.getUserMedia` para enfocar residuos en tiempo real y capturar muestras a `<canvas>`.
  - Pantallas de `/login` y `/registro` con validacion de correos institucionales `@morelia.tecnm.mx` y numero de control estudiantil.
  - En Home se incorpora la seccion `CampusShowcase`.
- **Comando de prueba:**
  ```bash
  npm run v1.8
  ```

---

### Version 1.9: Entrega Final Registrada para "Oxigena tus Ideas"
**Fecha:** 08 de Octubre de 2026 (Semana 6 - Cierre y entrega oficial de Version 1)  
**Alcance del sprint:** Version 1 completa y consolidada para la 19ª Feria Cientifica y Encuentro de Carteles.

![Captura Portada ReCiclo v1.9](./capturas/v1.9.png)
![Captura Perfil ReCiclo v1.9](./capturas/v1.9-perfil.png)

- **Caracteristicas tecnicas y metodologicas (Codigo de Produccion):**
  1. **Inicio Agil y Marco Institucional en Pestanas:** Enfoque prioritario en la accion (Hero, Como Funciona, CampusShowcase y CTA) con integracion del modulo `ProjectFrameworkTabs` que agrupa en pestanas interactivas y colapsables las 4 secciones teoricas (`Problem`, `Dimensions`, `Proposal`, `SDG`).
  2. **Modulo de Perfil Estudiantil (`Perfil.tsx`):** Registro de carrera academica, semestre, racha de dias sustentables, eco-puntos ganados, insignias de participacion y recorte de foto de perfil con `<canvas>`.
  3. **Guia de Residuos con Asistencia Visual Etica:** Clasificador visual ligero local en el navegador (MobileNet) como sugerencia complementaria, cumpliendo el lineamiento 14.2 de la convocatoria (no sustituye el analisis ni la decision del estudiante).
  4. **Cartografia Completa:** Mapa interactivo Leaflet de Campus 1 y Campus 2 con trazado de rutas peatonales para proteger las areas verdes del ITM.
  5. **Normativa Institucional:** Enlace al procedimiento oficial ITMORELIA-IT-AM-007 y soporte del huevo de pascua `TeamCredits` (secuencia 6-6-7).
- **Comando de prueba:**
  ```bash
  npm run v1.9
  ```

---

## Matriz Comparativa Resumen

| Version | Fecha | Semana | Portada | Escaner / Asistencia Visual | Mapa | Perfil / Cuentas | Lineamiento 14.2 (IA Etica) |
| :---: | :---: | :---: | :--- | :--- | :---: | :--- | :---: |
| **v1.0** | 19 Sep | Sem 3 | Video cinemático | Maqueta Liquid Glass | No | Modal de ajustes | No aplica (maqueta) |
| **v1.1** | 20 Sep | Sem 3 | Video cinemático | Maqueta Liquid Glass | No | Rutas /impacto, /como-funciona | No aplica (teorico) |
| **v1.2** | 21 Sep | Sem 4 | Video + Problem | Maqueta Liquid Glass | No | Ruta /historial en memoria | No aplica (muestreo) |
| **v1.3** | 23 Sep | Sem 4 | Video + Problem | Preview de foto | No | localStorage en historial | No aplica (local) |
| **v1.4** | 25 Sep | Sem 4 | Video + Problem + SDG | Catalogo manual 4 muestras | No | Catalogo institucional | Regla 4V manual |
| **v1.5** | 28 Sep | Sem 5 | WasteParallax (Sin video) | Sugerencia asistida (1.2 s) | No | Datos celulares protegidos | Sugerencia complementaria |
| **v1.6** | 02 Oct | Sem 5 | WasteParallax + Dimensions | Sugerencia asistida | Leaflet Campus 1 | Marcadores y popups | Analisis por estudiante |
| **v1.7** | 04 Oct | Sem 5 | WasteParallax + HowItWorks | Enlace directo al mapa | Campus 1 y 2 + Filtros | Localizacion asistida | Criterio de separacion |
| **v1.8** | 07 Oct | Sem 6 | WasteParallax + CampusShowcase | Camara web real (getUserMedia) | Campus 1 y 2 + Filtros | Login y Registro ITM | Validacion del usuario |
| **v1.9** | 08 Oct | Sem 6 | Inicio agil + Marco en pestanas | Guia con asistencia visual ligera | Leaflet + Rutas a pie | Perfil completo (Perfil.tsx) | 100% Etica (Lineamiento 14.2) |

---

# Historial de Evolución: ReCiclo Fase 2 (v2.0 a v2.9)
### Ciclo de Evolución a ReCiclo 2.0: Escáner, Mapa, Perfil y Mejoras Continuas
**Instituto Tecnológico de Morelia · Semestre Agosto - Diciembre 2026**

Este bloque registra el avance y maduración de **ReCiclo Versión 2**, mostrando el fortalecimiento de la plataforma a través de mejoras continuas en el mapa interactivo del campus, el escáner inteligente de residuos, el apartado de perfil con medallas y racha, herramientas de personalización visual y el archivo completo del Museo Histórico.

## Cronograma de la Fase 2

| Versión | Fecha | Hito y Alcance de la Versión |
| :---: | :---: | :--- |
| **v2.0** | 18 de Octubre | **Llega ReCiclo 2.0:** Portada de bienvenida renovada con distintivo oficial v2.0 y navegación ágil. |
| **v2.1** | 18 de Octubre | **Identificación de residuos más rápida:** Clasificación ágil con inteligencia artificial y subida directa de fotos. |
| **v2.2** | 21 de Octubre | **Acceso con matrícula estudiantil:** Registro e inicio de sesión seguro con número de control de 8 dígitos del IT Morelia. |
| **v2.3** | 21 de Octubre | **Isla de avisos y rueda de colores:** Barra flotante de notificaciones superiores y selector de temas y colores. |
| **v2.4** | 21 de Octubre | **Ajustes organizados en pestañas:** Configuración clara dividida en Apariencia, Barra de estado, Cuenta y Privacidad. |
| **v2.5** | 21 de Octubre | **Guía para preparar botellas y empaques:** La regla de 4 pasos (Vacía, Enjuaga, Aplasta y Tapa) y los 5 contenedores. |
| **v2.6** | 22 de Octubre | **Guía de herramientas y normas ambientales:** Biblioteca de herramientas del sistema y normas oficiales mexicanas. |
| **v2.7** | 22 de Octubre | **Tus medallas y racha de reciclaje:** Reconocimiento de constancia estudiantil con medallas y estadísticas guardadas. |
| **v2.8** | 28 de Octubre | **Inicio más cómodo y compacto:** Portada organizada en pestañas y apertura del Museo Histórico interactivo. |
| **v2.9** | 28 de Octubre | **El archivo completo de ReCiclo:** Colección integral de 30 versiones históricas y navegación estable en el campus. |

---

## Desglose Detallado de la Fase 2

### Version 2.0: Llega ReCiclo 2.0
**Fecha:** 18 de Octubre de 2026  
**Alcance de la versión:** Inicio de la versión 2.0 con una portada oficial renovada, distintivo visual oficial y navegación ágil para computadoras y celulares.

![Captura Portada ReCiclo v2.0](./capturas/v2.0.png)

- **Avances tangibles:**
  - Distintivo visual oficial `v2.0` en la barra de navegación superior.
  - Portada renovada con nuevo diseño visual y secciones introductorias.
  - Navegación general más rápida y cómoda entre páginas.
- **Comando de prueba:**
  ```bash
  npm run v2.0
  ```

---

### Version 2.1: Identificación de residuos más rápida
**Fecha:** 18 de Octubre de 2026  
**Alcance de la versión:** Mejora del escáner de residuos para responder con mayor velocidad y precisión al identificar materiales reciclables.

![Captura Escáner ReCiclo v2.1](./capturas/v2.1.png)

- **Avances tangibles:**
  - Clasificación de residuos con inteligencia artificial más rápida y estable.
  - Subida directa de fotos desde la galería o la cámara sin demoras.
  - Respuestas inmediatas indicando a qué contenedor debe ir cada residuo.
- **Comando de prueba:**
  ```bash
  npm run v2.1
  ```

---

### Version 2.2: Acceso con matrícula estudiantil
**Fecha:** 21 de Octubre de 2026  
**Alcance de la versión:** Incorporación de acceso seguro para alumnos del Tecnológico de Morelia mediante su número de control oficial.

![Captura Inicio de Sesión ReCiclo v2.2](./capturas/v2.2.png)

- **Avances tangibles:**
  - Formulario de acceso con verificación del formato institucional de 8 dígitos del IT Morelia.
  - Registro seguro para que cada estudiante proteja su cuenta y sus puntos de reciclaje.
  - Avisos claros e inmediatos al escribir la información.
- **Comando de prueba:**
  ```bash
  npm run v2.2
  ```

---

### Version 2.3: Isla de avisos y rueda de colores
**Fecha:** 21 de Octubre de 2026  
**Alcance de la versión:** Creación de una barra flotante de avisos rápidos y opciones para personalizar el aspecto visual de la aplicación.

![Captura Barra Superior y Colores ReCiclo v2.3](./capturas/v2.3.png)

- **Avances tangibles:**
  - Barra flotante superior interactiva para consultar avisos importantes al momento.
  - Menú desplegable con paleta de colores para personalizar el tono de la interfaz.
  - Contraste reforzado para facilitar la lectura tanto de día bajo el sol como de noche.
- **Comando de prueba:**
  ```bash
  npm run v2.3
  ```

---

### Version 2.4: Ajustes organizados en pestañas
**Fecha:** 21 de Octubre de 2026  
**Alcance de la versión:** Reorganización completa de la ventana de ajustes para que configurar la experiencia sea rápido y sencillo.

![Captura Ajustes ReCiclo v2.4](./capturas/v2.4.png)

- **Avances tangibles:**
  - Menú de ajustes ordenado en pestañas especializadas (Apariencia, Barra de estado, Cuenta y Privacidad).
  - Opciones de accesibilidad para elegir modo de visualización y contraste cómodo.
  - Ajustes de fluidez pensados para ahorrar batería en teléfonos sencillos.
- **Comando de prueba:**
  ```bash
  npm run v2.4
  ```

---

### Version 2.5: Guía para preparar botellas y empaques
**Fecha:** 21 de Octubre de 2026  
**Alcance de la versión:** Publicación de la guía interactiva «Cómo Funciona» y la explicación de los 5 contenedores oficiales del campus.

![Captura Cómo Funciona ReCiclo v2.5](./capturas/v2.5.png)

- **Avances tangibles:**
  - Guía pedagógica de los 4 pasos fundamentales: Vacía, Enjuaga, Aplasta y Tapa.
  - Catálogo interactivo con los 5 contenedores oficiales del Tecnológico de Morelia.
  - Consejos prácticos para evitar que los restos orgánicos ensucien el plástico y el cartón.
- **Comando de prueba:**
  ```bash
  npm run v2.5
  ```

---

### Version 2.6: Guía de herramientas y normas ambientales
**Fecha:** 22 de Octubre de 2026  
**Alcance de la versión:** Creación de la biblioteca informativa sobre las tecnologías utilizadas y las leyes ambientales que fundamentan el proyecto.

![Captura Tecnologías ReCiclo v2.6](./capturas/v2.6.png)

- **Avances tangibles:**
  - Inventario transparente de las herramientas y bibliotecas de software que hacen funcionar ReCiclo.
  - Sección dedicada a normas ambientales mexicanas de manejo integral de residuos sólidos.
  - Información accesible para que cualquier estudiante o docente conozca el sustento del proyecto.
- **Comando de prueba:**
  ```bash
  npm run v2.6
  ```

---

### Version 2.7: Tus medallas y racha de reciclaje
**Fecha:** 22 de Octubre de 2026  
**Alcance de la versión:** Incorporación de un panel de logros para motivar la participación estudiantil continua.

![Captura Perfil ReCiclo v2.7](./capturas/v2.7.png)

- **Avances tangibles:**
  - Contador de racha para registrar los días consecutivos que el estudiante participa reciclando.
  - Medallas de reconocimiento por separar diferentes tipos de materiales.
  - Historial seguro que se mantiene guardado aunque se cambie de computadora o celular.
- **Comando de prueba:**
  ```bash
  npm run v2.7
  ```

---

### Version 2.8: Inicio más cómodo y compacto
**Fecha:** 28 de Octubre de 2026  
**Alcance de la versión:** Rediseño de la portada principal con pestañas interactivas y presentación del Museo Histórico.

![Captura Portada Compacta ReCiclo v2.8](./capturas/v2.8.png)

- **Avances tangibles:**
  - Portada compacta organizada con pestañas para explorar el proyecto sin desplazamientos eternos.
  - Apertura del Museo Histórico con emuladores para probar interactivamente las versiones previas.
  - Créditos y agradecimientos al equipo de trabajo estudiantil.
- **Comando de prueba:**
  ```bash
  npm run v2.8
  ```

---

### Version 2.9: El archivo completo de ReCiclo
**Fecha:** 28 de Octubre de 2026  
**Alcance de la versión:** Cierre de la segunda etapa con la colección completa de 30 versiones históricas y navegación estable en el campus.

![Captura Museo Completo ReCiclo v2.9](./capturas/v2.9.png)

- **Avances tangibles:**
  - Galería integral de 30 versiones históricas catalogadas con capturas, emuladores interactivos y código fuente.
  - Navegación protegida y estable en las conexiones universitarias.
  - Plataforma consolidada y lista para su aprovechamiento por toda la comunidad del campus.
- **Comando de prueba:**
  ```bash
  npm run v2.9
  ```

