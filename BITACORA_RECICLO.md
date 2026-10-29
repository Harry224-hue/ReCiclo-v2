# Bitacora de Desarrollo: ReCiclo (v1.0 a v2.9)
### 19º Encuentro de Proyectos para el Desarrollo Sostenible: "Oxigena tus Ideas"
**Instituto Tecnologico de Morelia · Departamento de Ingenieria Quimica y Bioquimica**  
**Semestre Agosto - Diciembre 2026**

**Integrantes:**
- Garcia Montanez Ulises Jasen
- Medina Cuamba Juan Pablo
- Solis Calvillo Juan Pablo

**Periodo del proyecto:** 19 de septiembre al 8 de octubre de 2026

---

## 1. Planteamiento del problema y marco normativo institucional

El proyecto **ReCiclo Version 1** se origino en el marco de la materia de Desarrollo Sustentable impartida por el Departamento de Ingenieria Quimica y Bioquimica del Instituto Tecnologico de Morelia.

Durante el semestre Agosto - Diciembre 2026, el equipo identifico una problematica recurrente en el campus: la deficiente separacion en la fuente de los Residuos Solidos Urbanos (RSU) generados en cafeterias, andadores y areas comunes (Pony Plaza). Pese a que el IT Morelia cuenta con el procedimiento oficial **ITMORELIA-IT-AM-007**, una porcion considerable de envases de plastico (PET), latas de aluminio y residuos de carton terminan contaminados con restos liquidos o de comida, impidiendo su valorizacion y reciclaje.

### Compromiso con el Lineamiento 14.2 de la Convocatoria
La convocatoria oficial de la 19ª Feria Cientifica "Oxigena tus Ideas" (publicada el 5 de octubre de 2026) establece en sus consideraciones generales:
> *"14.2. El uso de herramientas de inteligencia artificial debera realizarse de manera etica y responsable, sin sustituir el trabajo, analisis, interpretacion y dominio del proyecto por parte de los estudiantes."*

Por esta razon, la solucion tecnologica se diseno bajo los siguientes principios metodologicos:
1. **El valor central es el trabajo de campo y la investigacion de los estudiantes:** Se realizo un levantamiento de campo de los puntos de disposicion de Campus 1 y Campus 2, se estructuro el catalogo universitario de residuos habituales y se adapto la **Regla de las 4V** (Vaciar, Enjuagar, Aplastar, Tapar).
2. **Uso minimo y etico de IA:** La inteligencia artificial se implemento de forma complementaria y auxiliar (mediante un modelo ligero local en el navegador que asiste al estudiante sugiriendo el tipo de material). En ningun momento la IA reemplaza la observacion, analisis, toma de decisiones o ejecucion fisica del reciclaje por parte de la comunidad tecnologica.

---

## 2. Tecnologias utilizadas

- **React 19 y Vite 6:** Arquitectura modular en formato SPA pura (Single Page Application), sin dependencias nativas complejas.
- **React Router 7:** Enrutamiento web con BrowserRouter, carga diferida (React.lazy) para optimizar el rendimiento.
- **Tailwind CSS v4:** Diseno responsivo con soporte de tema claro/oscuro y contraste accesible para exteriores.
- **Framer Motion:** Animaciones suaves de scroll, transiciones de interfaz y la secuencia interactiva TeamCredits.
- **Lucide React:** Iconografia estandarizada para materiales, andadores y categorias de reciclaje.
- **Leaflet.js & OpenStreetMap:** Cartografia georreferenciada del IT Morelia con planos oficiales de Campus 1 y Campus 2 (incorporado en v1.6).
- **Firebase Web SDK:** Almacenamiento y autenticacion institucional con matricula y correo `@morelia.tecnm.mx` (incorporado en v1.8).
- **TensorFlow.js (MobileNet):** Modelo neuronal local ligero en el cliente que asiste eticamente sugiriendo posibles materiales sin sustituir el analisis del alumno (incorporado en v1.9).

---

## 3. Registro cronologico semanal (Semestre Agosto - Diciembre 2026)

---

### Version 1.0
**Fecha:** 19 de septiembre de 2026 (Semana 3)  
**Hito:** Base web inicial tras concluir la fase preliminar.  

![ReCiclo v1.0](./capturas/v1.0.png)

**Lo que se hizo:**
Se establecio la primera version web oficial e independiente del proyecto, preservando los elementos visuales alcanzados en las pruebas iniciales.

**Lo que se implemento:**
- Portada con video heredado de las pruebas de concepto (`video-hero.mp4`), titular *"Apunta. Descubre. Recicla."*, botones *"Abrir Escaner"* y *"Descubrir mas"*, e insignia *"ReCiclo 1.0 Oficial · IT Morelia"*.
- Secciones `Impact` (metricas preliminares), `Showcase` (guia descriptiva de plasticos, papel y vidrio) y `ScannerCTA`.
- Pie de pagina con el huevo de pascua `TeamCredits` (secuencia 6-6-7).
- Escaner en formato de maqueta interactiva Liquid Glass adaptable a movil y computadora.

---

### Version 1.1
**Fecha:** 20 de septiembre de 2026 (Semana 3)  
**Hito:** Marco teorico y sustento ambiental institucional.  

![ReCiclo v1.1](./capturas/v1.1.png)

**Lo que se hizo:**
Se prepararon las paginas de lectura tecnica y ambiental requeridas para la fundamentacion teorica de la materia de Desarrollo Sustentable.

**Lo que se implemento:**
- Rutas estaticas `/impacto`, `/como-funciona` y `/tecnologias`.
- Enlaces integrados en el menu desplegable de la barra de navegacion flotante.
- Portada y escaner identicos a v1.0 para mantener la estabilidad visual del sistema.

---

### Version 1.2
**Fecha:** 21 de septiembre de 2026 (Semana 4)  
**Hito:** Planteamiento del problema universitario y primera bitacora en memoria.  

![ReCiclo v1.2](./capturas/v1.2.png)

**Lo que se hizo:**
Se comenzo la documentacion del diagnostico de campo sobre los residuos recolectados en cafeterias del campus.

**Lo que se implemento:**
- Se creo e integro la seccion `Problem` en la portada principal, exponiendo el volumen de envases desechados en el instituto.
- Se habilito la ruta `/historial` con almacenamiento temporal en memoria de sesion para registrar las muestras de prueba del equipo.

---

### Version 1.3
**Fecha:** 23 de septiembre de 2026 (Semana 4)  
**Hito:** Persistencia local y visor de fotografias de residuos.  

![ReCiclo v1.3](./capturas/v1.3.png)
![ReCiclo v1.3 Escaner](./capturas/v1.3-escaner.png)

**Lo que se hizo:**
Se anadio memoria persistente para no perder los datos de muestreo de campo.

**Lo que se implemento:**
- Migracion de `/historial` hacia `localStorage`, asegurando que las muestras no se borren al recargar la pagina.
- En el escaner se incorporo la previsualizacion en miniatura de la imagen seleccionada por el estudiante antes de procesarla.

---

### Version 1.4
**Fecha:** 25 de septiembre de 2026 (Semana 4)  
**Hito:** Alineacion con ODS 12 y catalogo manual universitario.  

![ReCiclo v1.4](./capturas/v1.4.png)

**Lo que se hizo:**
Se vinculo la investigacion con los Objetivos de Desarrollo Sostenible de la ONU y se estructuro la Regla de las 4V.

**Lo que se implemento:**
- Integracion de la seccion `SDG` en Home (ODS 12: Produccion y Consumo Responsables).
- Catalogo manual universitario con 4 residuos representativos (PET, latas de aluminio, hojas de papel bond y botellas de vidrio) con recomendaciones de vaciado, enjuague, aplastado y tapado.

---

### Version 1.5
**Fecha:** 28 de septiembre de 2026 (Semana 5 - Sprint largo de rediseño)  
**Hito:** Optimizacion de datos en campus (Retiro de video y WasteParallaxScene).  

![ReCiclo v1.5](./capturas/v1.5.png)

**Lo que se hizo:**
Para resolver el alto consumo de datos celulares de los alumnos con el video en bucle, se rediseño la portada con fisicas interactivas y se inicio la asistencia de identificacion.

**Lo que se implemento:**
- Se retiro `video-hero.mp4` y nacio la escena interactiva ligera de residuos flotantes `WasteParallaxScene` bajo el titular *"Separacion y manejo responsable de residuos - IT Morelia"*.
- El escaner incorporo una interfaz de asistencia visual etica con sugerencias de materiales basadas en el catalogo del ITM (tiempo de respuesta de 1.2 s y desglose por capas).

---

### Version 1.6
**Fecha:** 02 de octubre de 2026 (Semana 5 - Sprint mas largo: trabajo de campo GPS y cartografia)  
**Hito:** Cartografia universitaria interactiva de Campus 1 (Leaflet).  

![ReCiclo v1.6](./capturas/v1.6.png)
![ReCiclo v1.6 Mapa](./capturas/v1.6-mapa.png)

**Lo que se hizo:**
Tras realizar el levantamiento de campo con coordenadas GPS de los botes del IT Morelia, se desarrollo el primer visor cartografico interactivo.

**Lo que se implemento:**
- Ruta `/mapa` con Leaflet y OpenStreetMap, ubicando 4 estaciones clave en Campus 1: Pony Plaza, Cafeteria Central, Aulas de Sistemas y Edificio Administrativo.
- Popups informativos con clasificacion de contenedores y horarios de recoleccion.
- En la portada principal se integraron las secciones analiticas `Dimensions` y `Proposal`.

---

### Version 1.7
**Fecha:** 04 de octubre de 2026 (Semana 5)  
**Hito:** Filtros de botes e interconexion directa entre Escaner y Mapa.  

![ReCiclo v1.7](./capturas/v1.7.png)

**Lo que se hizo:**
Se extendio la cartografia al segundo campus y se vinculo la identificacion de residuos con la ubicacion del contenedor adecuado.

**Lo que se implemento:**
- Conmutador para Campus 2 y barra de filtros por color de contenedor (Verde/Organico, Azul/Inorganico, Naranja/Pilas).
- En el escaner se implemento el boton *"Localizar bote en mapa"* (`/mapa?bin=...`).
- Incorporacion de la seccion metodologica `HowItWorks` con los 3 pasos del reciclaje guiado.

---

### Version 1.8
**Fecha:** 07 de octubre de 2026 (Semana 6 - Sprint largo de integracion de camara y Firebase)  
**Hito:** Captura con camara web del dispositivo y registro estudiantil.  

![ReCiclo v1.8](./capturas/v1.8.png)

**Lo que se hizo:**
Se habilito la captura directa de residuos con la camara del smartphone y las cuentas con correo institucional del ITM enlazadas a Firebase.

**Lo que se implemento:**
- Uso de la API `navigator.mediaDevices.getUserMedia` para enfocar residuos en vivo y capturar fotogramas a `<canvas>`.
- Vistas de `/login` y `/registro` con validacion de correos `@morelia.tecnm.mx` y numero de control.
- En Home se agrego la seccion `CampusShowcase`.

---

### Version 1.9
**Fecha:** 08 de octubre de 2026 (Semana 6 - Entrega oficial registrada)  
**Hito:** Version final registrada formalmente para la 19ª Feria Cientifica Oxigena tus Ideas.  

![ReCiclo v1.9](./capturas/v1.9.png)
![ReCiclo v1.9 Perfil](./capturas/v1.9-perfil.png)

**Lo que se hizo:**
Consolidacion definitiva del sistema en apego total a los lineamientos de la convocatoria, lista para su exposicion en el arco-techo del IT Morelia.

**Lo que se implemento:**
- **Inicio Agil y Marco Institucional en Pestanas:** Enfoque prioritario en la accion (Hero, Como Funciona, CampusShowcase y CTA) con integracion del modulo `ProjectFrameworkTabs` que agrupa en pestanas interactivas y colapsables las 4 secciones teoricas (`Problem`, `Dimensions`, `Proposal`, `SDG`).
- **Modulo de Perfil Estudiantil (`Perfil.tsx`):** Carrera academica, semestre, racha de dias, eco-puntos acumulados, insignias y recorte de avatar en `<canvas>`.
- **Guia de Residuos con Asistencia Visual Etica:** Modelo ligero en cliente (MobileNet) como sugerencia complementaria, cumpliendo el lineamiento 14.2 de la convocatoria (no sustituye el analisis ni la decision del estudiante).
- **Cartografia Completa:** Visor Leaflet final con rutas peatonales para proteger las areas verdes del ITM.
- **Normativa Institucional:** Enlace al procedimiento oficial ITMORELIA-IT-AM-007 y persistencia del huevo de pascua `TeamCredits` (secuencia 6-6-7).

---

## 4. Resumen comparativo de evolucion

| Version | Fecha | Semana | Portada | Asistencia Visual (Lineamiento 14.2) | Cartografia | Participacion / Cuentas |
| :---: | :---: | :---: | :--- | :--- | :---: | :--- |
| **v1.0** | 19 Sep | Sem 3 | Video cinemático (heredado) | Maqueta Liquid Glass | No | Modal basico |
| **v1.1** | 20 Sep | Sem 3 | Video cinemático | Maqueta Liquid Glass | No | Rutas /impacto, /como-funciona |
| **v1.2** | 21 Sep | Sem 4 | Video + Problem | Maqueta Liquid Glass | No | Ruta /historial en memoria |
| **v1.3** | 23 Sep | Sem 4 | Video + Problem | Preview de foto | No | localStorage local |
| **v1.4** | 25 Sep | Sem 4 | Video + Problem + SDG | Catalogo manual 4 residuos (Regla 4V) | No | Catalogo institucional |
| **v1.5** | 28 Sep | Sem 5 | WasteParallax (Sin video) | Sugerencia asistida (1.2 s) | No | Datos celulares protegidos |
| **v1.6** | 02 Oct | Sem 5 | WasteParallax + Dimensions | Sugerencia asistida | Leaflet Campus 1 | Marcadores y popups |
| **v1.7** | 04 Oct | Sem 5 | WasteParallax + HowItWorks | Enlace directo a contenedor | Campus 1 y 2 + Filtros | Boton ubicar contenedor |
| **v1.8** | 07 Oct | Sem 6 | WasteParallax + CampusShowcase | Camara web real (getUserMedia) | Campus 1 y 2 + Filtros | Login y Registro ITM |
| **v1.9** | 08 Oct | Sem 6 | Inicio agil + Marco en pestanas | Guia etica con MobileNet local | Leaflet + Rutas a pie | Perfil completo (Perfil.tsx) |

---

## 5. Ciclo 3: Escalado a Web Pura, Modularización y Resiliencia (v2.0 a v2.9)
**Periodo del sprint:** 18 al 28 de octubre de 2026

En esta etapa, el equipo de estudiantes (García Montañez Ulises Jasen, Medina Cuamba Juan Pablo y Solís Calvillo Juan Pablo) abordó la optimización de producción de ReCiclo, prescindiendo de dependencias nativas pesadas e integrando el archivo histórico como evidencia de desarrollo.

### Version 2.0 (18 de Octubre)
- **Hito:** Arquitectura Web Pura y CI.
- **Implementación:** Eliminación de Electron y Capacitor. Configuración de GitHub Actions para verificación automatizada en cada commit y distintivo v2.0 en navbar.

### Version 2.1 (18 de Octubre)
- **Hito:** Despliegue en Vercel y API Serverless.
- **Implementación:** Configuración de `vercel.json` con SPA rewrites y endpoint `/api/gemini` para proteger la API Key de Gemini en servidor.

### Version 2.2 (21 de Octubre, 12:06)
- **Hito:** Seguridad en Autenticación.
- **Implementación:** Validación obligatoria de matrícula institucional del IT Morelia y control de estados de autenticación con Firebase.

### Version 2.3 (21 de Octubre, 21:50)
- **Hito:** Isla Dinámica y Accesibilidad.
- **Implementación:** Componente flotante `NotchIsland.tsx`, sincronización global con `ThemeContext` y contraste reforzado en modo claro y oscuro.

### Version 2.4 (21 de Octubre, 23:08)
- **Hito:** Modularización de Perfil y Ajustes.
- **Implementación:** Desacoplamiento de `ProfileHistoryAndResources.tsx` y `SettingsSecondaryTabs.tsx` para mejorar la fluidez y mantenibilidad.

### Version 2.5 (21 de Octubre, 23:23)
- **Hito:** Sustento Ambiental Verificado.
- **Implementación:** Rediseño editorial profundo de `/como-funciona` e `/impacto` con datos oficiales de SEMARNAT/INEGI y guía pedagógica de acondicionamiento físico.

### Version 2.6 (22 de Octubre, 01:34)
- **Hito:** Catálogo Tecnológico Institucional.
- **Implementación:** Creación de `techCategories.ts` organizando las 6 capas del proyecto (IA, Frontend, Backend, Datos, Mapas, Normativa) con licencias y justificación.

### Version 2.7 (22 de Octubre, 02:44)
- **Hito:** Gamificación e Historial Estudiantil.
- **Implementación:** Medallas de logro, estadísticas de reciclaje y sincronización automática en Cloud Firestore.

### Version 2.8 (28 de Octubre, 12:15)
- **Hito:** El Museo de la Evolución.
- **Implementación:** Creación de la ruta interactiva `/museo` con emuladores sandbox de 20 versiones históricas y pestañas institucionales en portada.

### Version 2.9 (28 de Octubre, 12:22)
- **Hito:** Consolidación de Producción y Resiliencia en Campus.
- **Implementación:** Protección contra bloqueadores de anuncios (desactivación de GTM en Firebase para prevenir `ERR_BLOCKED_BY_CLIENT`), catálogo completo de 30 versiones históricas e interfaz optimizada para redes del IT Morelia.

