# ReCiclo: Dirección de Diseño (Versión 1 Web)

## Identidad y Propósito
- **Producto:** ReCiclo, asistente web de apoyo para la separación de residuos sólidos urbanos en el Instituto Tecnológico de Morelia (TecNM / ITM), desarrollado para la convocatoria académica *Oxigena tus Ideas*.
- **Audiencia:** Comunidad estudiantil, docente y personal administrativo de Campus 1 (Av. Tecnológico) y Campus 2 (San José de la Huerta), principalmente desde navegador móvil en andadores y cafeterías, así como escritorio en laboratorios y aulas.
- **Personalidad:** Editorial universitaria, directa, sobria y verificable. Prioriza la claridad rápida frente a un bote de basura (identificar material, cómo prepararlo, qué color de contenedor corresponde) por encima de adornos tecnológicos.
- **Lectura de diseño (Design Read):** Aplicación web institucional y guía ambiental para comunidad universitaria del ITM, con lenguaje editorial técnico-ambiental, diales `ENERGY 2 / RHYTHM 3 / MOTION 2`.

## Tres Diales (Liveliness Toolkit)
- **ENERGY: 2 (Equilibrado)**
  - Presentación firme con contraste tipográfico claro y jerarquía inmediata hacia las acciones reales (`/escanear` y `/mapa`), sin efectos estridentes ni saturación neón.
- **RHYTHM: 3 (Variado y conducido por el contenido)**
  - Las secciones cambian visiblemente de composición según lo que comunican: Hero con escena física o audiovisual enfocada; Diagnóstico en diseño editorial dividido (contexto nacional SEMARNAT a un lado y problemáticas cotidianas listadas al otro); Dimensiones de la Sustentabilidad en matriz comparativa horizontal/tabular; Propuesta de 3 preguntas en franjas numeradas asimétricas; Cómo Funciona en flujo alternado imagen-instrucción; Estaciones ITM en panel maestro-detalle interactivo; ODS en bloque sobrio de 3 metas justificadas; Cierre con selector expandible de herramientas.
- **MOTION: 2 (Transiciones con propósito y respuesta al scroll)**
  - Transiciones suaves de aparición única (`viewport={{ once: true }}`), indicador activo deslizante en navegación, desplazamiento fluido opcional con Lenis (desactivado automáticamente en `prefers-reduced-motion` o modo esencial). Prohibidos los pulsos infinitos (`animate-ping` sin estado vivo) y rotaciones eternas decorativas.

## Paleta y Temas (R-01, R-21, R-25, R-29, R-34)
- **Base neutra dual (Claro y Oscuro obligatorios y verificados):**
  - Modo claro: lienzo `zinc-50` (`#fafafa`), superficies `white` (`#ffffff`) y `zinc-100` (`#f4f4f5`), texto principal `zinc-900` (`#18181b`, ratio > 15:1), texto secundario `zinc-600` (`#52525b`, ratio >= 5.9:1 sobre `#fafafa` y `7.0:1` sobre `#ffffff`).
  - Modo oscuro: lienzo `zinc-950` (`#09090b`), superficies `zinc-900` (`#18181b`), texto principal `zinc-100` (`#f4f4f5`, ratio > 17:1), texto secundario `zinc-400` (`#a1a1aa`, ratio `7.3:1` sobre `#09090b` y `5.9:1` sobre `#18181b`). Prohibido `zinc-500` para texto normal sobre fondos oscuros cuando baje de 4.5:1.
- **Color de acento principal (1 acento deliberado a la vez):**
  - Predeterminado institucional: Esmeralda (`emerald-600` `#059669` / `emerald-700` `#047857` con texto blanco para cumplir contraste AA en botones, y `emerald-400` `#34d399` sobre fondos oscuros).
  - Personalización heredada de `v0.9` en el modal de Ajustes: Esmeralda, Azul, Ámbar/Morado y Rosa. Solo se aplica el acento activo elegido por la persona en los puntos focales (acción primaria, estado activo de navegación y marcadores clave).
- **Colores semánticos normativos (exclusivos para representar los botes reales de `ITMORELIA-IT-AM-007`):**
  - Verde (Orgánicos), Amarillo (Papel, cartón, vidrio y metales), Azul (Plásticos y PET), Negro/Gris oscuro (No reciclables), Ámbar/Rojo (Manejo especial / Pilas). Su uso responde estrictamente al código físico de contenedores del campus, nunca como decoración aleatoria.

## Tipografía (R-06)
- **Titulares (`h1`-`h6`):** `Urbanist` (geométrica humanista que aporta identidad editorial propia y legibilidad limpia en encabezados grandes sin caer en estéticas de terminal).
- **Cuerpo, formularios y datos técnicos:** `Geist` (alta legibilidad en tamaños pequeños para fichas de materiales, coordenadas, claves de edificios e instrucciones en pantalla móvil).
- **Escala fluida:** Tamaños adaptados por punto de quiebre (`clamp()` o escalones responsivos reales en móvil, tableta y escritorio) sin contenedores que recorten el texto al hacer zoom al 200%.

## Reglas de Superficie, Elevación e Iconografía (R-04, R-08..R-13, R-31)
1. **Por qué esta paleta:** Vincula la sobriedad académica del proyecto con el referente ambiental esmeralda heredado desde `v0.0`-`v0.9`, reservando otros colores solo para el código real de contenedores del ITM.
2. **Por qué este layout variado:** Evita la monotonía de plantillas generadas por IA; cada sección adopta la estructura que exige su contenido (comparativa normativa, catálogo maestro-detalle, flujo operativo).
3. **Por qué esta tipografía:** `Urbanist` distingue la voz editorial de los títulos y `Geist` asegura lectura nítida en etiquetas densas del escáner y del mapa.
4. **Límite de cristal (`backdrop-blur`, R-10):** Reservado únicamente a las superficies flotantes de navegación (barra superior / dock móvil) y al modal de ajustes. Las tarjetas y paneles de contenido usan fondos sólidos con bordes definidos.
5. **Límite de resplandor y sombras (R-12, R-13):** Sin orbes difuminados (`blur-[140px]`) decorativos detrás de cada sección. Las sombras se reservan para elevar menús desplegables, modales y controles flotantes sobre el mapa o la cámara.
6. **Radios de borde con jerarquía (R-11):** Botones de barra y navegación en cápsula heredados de `v0.9`; paneles y tarjetas en `rounded-2xl`; entradas de formulario, etiquetas técnicas de edificio y botones internos en `rounded-lg` o `rounded-xl`. No todo es píldora.
7. **Iconografía con propósito (R-04):** Prohibidos `Sparkles`, `Wand`, `Zap` o íconos genéricos de "magia IA". Se emplean íconos descriptivos de la acción física (`Camera`, `ScanLine`, `MapPin`, `Trash2`, `Recycle`, `FileText`, `User`) acompañados siempre de etiqueta textual accesible.
8. **Motivo de identidad repetido:** Ficha técnica estilo cédula ambiental del ITM (clave de edificio o código normativo en etiqueta rectangular sobria + barra indicadora del color real del contenedor correspondiente).
9. **Excepción explícita del propietario (`R-37`):** Se conserva en todas las versiones (`v1.0` a `v1.9` y raíz) el componente interactivo `TeamCredits` en el pie de página heredado de `v0.9` (huevo de pascua con secuencia de clics `6-6-7` sobre los tres integrantes y efecto de partículas/resplandor esmeralda), cuidando que sus botones mantengan contraste legible WCAG AA en reposo y foco visible por teclado.

## Voz, Textos y Honestidad Académica (R-02, R-15..R-18, R-36, R-38, C-5)
- **Prohibido el guion largo** en cualquier texto de interfaz, datos o documentación nueva; usar coma, punto, dos puntos o paréntesis.
- **Cero cifras inventadas:** Prohibido mostrar "99% de precisión", "150,000 objetos", "12,400 árboles", "rutas que evitan jardineras" o "GPS verificado en campo". Solo se citan cifras nacionales con fuente explícita (Diagnóstico Básico SEMARNAT / INEGI) y se declara con transparencia qué mediciones en el ITM están en fase preliminar o pendientes de muestreo presencial.
- **Llamados a la acción específicos (R-15):** "Abrir escáner de residuos", "Consultar mapa de Campus 1 y 2", "Revisar bitácora de consultas", en lugar de textos vagos como "Descubrir más" o "Explorar".
