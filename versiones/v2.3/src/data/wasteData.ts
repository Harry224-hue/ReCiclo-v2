/**
 * ReCiclo - Datos Verificables de Residuos y Cartografía Ambiental
 * Contexto: Instituto Tecnológico de Morelia (ITM), Michoacán
 * Fuentes Oficiales de Referencia:
 * - SEMARNAT (Secretaría de Medio Ambiente y Recursos Naturales)
 * - LGPGIR (Ley General para la Prevención y Gestión Integral de los Residuos)
 * - INEGI (Censo de Gestión de Residuos Sólidos Urbanos)
 * - ONU Medio Ambiente / PNUMA
 */

export type WasteCategory = "organicos" | "reciclables" | "no_reciclables" | "manejo_especial";

export interface WasteItem {
  id: string;
  name: string;
  brand?: string;
  material: string;
  category: WasteCategory;
  categoryLabel: string;
  categoryReason: string;
  recommendedBin: {
    color: string;
    label: string;
    description: string;
  };
  handlingInstructions: string[];
  recommendations3R: {
    reducir: string;
    reutilizar: string;
    reciclar: string;
  };
  degradationTime: {
    estimate: string;
    isApproximate: boolean;
    conditionsNote: string;
  };
  environmentalImpact: {
    description: string;
    source: string;
  };
  examples: string[];
}

export type ContainerId = "bin-verde" | "bin-amarillo" | "bin-negro" | "bin-azul" | "bin-pilas";

export interface CampusDisposalPoint {
  id: string;
  name: string;
  campus: "Campus 1 (Principal)" | "Campus 2 (San José de la Huerta)";
  officialBuildingCode: string; // Clave oficial del Plano General ITM (ej. Edificio A, R, X, S2, AF, LL, U, H, etc.)
  buildingRef: string;
  zoneType: "Pony Plaza / Explanada" | "Cafetería y Alimentos" | "Aulas e Ingenierías" | "Biblioteca e Información" | "Deportiva" | "Acceso";
  installedBins: ContainerId[];
  acceptedCategories: WasteCategory[];
  acceptedMaterials: string[];
  notAccepted: string[];
  schedule: string;
  walkingRoute: string; // Prioriza caminos transitables y prohíbe pisar áreas verdes (Punto 6)
  status: "Provisional (En proceso de validación en campus)" | "Verificado";
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface CampusContainerSpec {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  shortDescription: string;
  normativeReference: string;
  acceptedMaterials: string[];
  rejectedMaterials: string[];
  preparationRules: string[];
  campusDestination: string;
  handlingTip: string;
}

export const ITM_RSU_PROCEDURE = {
  code: "ITMORELIA-IT-AM-007",
  revision: "Rev. 3 (26 de junio de 2026)",
  title: "Gestión integral de residuos sólidos urbanos",
  objective:
      "Establecer los lineamientos y las actividades para el manejo, control y reducción de la generación de residuos sólidos urbanos en el ITM, respetar la política de 100% libres de plásticos de un solo uso y realizar en los productos clave análisis de ciclo de vida (ACV).",
  scope: "Aplica a todas las áreas y actividades desarrolladas en el ITM (Campus 1 y Campus 2).",
  operatingRules: {
    rule3_1: "El (la) RD y/o Coordinador del SGI verifica que se cumpla con el manejo de residuos sólidos urbanos.",
    rule3_2: "La Dirección del plantel establece como principio la separación y manejo de los residuos sólidos urbanos generados en el Instituto a través de un proceso participativo tendiente a promover la política de las 3R's (reducción, reutilización o reciclado), tomando en cuenta el Análisis de Ciclo de Vida y buscando respetar la política de 100% libres de plásticos de un solo uso.",
    rule3_3: "El Comité de Gestión Ambiental (CGA) y el Coordinador Ambiental deben difundir el procedimiento del manejo de los residuos sólidos urbanos a toda la comunidad tecnológica.",
    rule3_4: "El responsable de los programas de manejo de RSU planea y ejecuta las acciones establecidas en dichos programas.",
    rule3_5: "El contratista externo deberá retirar de las instalaciones cualquier residuo sólido urbano generado durante las actividades del servicio.",
  },
  separationRuleSection4_1: {
    verde: "Recipientes de color Verde para orgánicos (residuos de alimentos, madera).",
    amarillo: "Recipientes de color Amarillo para reciclables (papel, cartón, vidrio y metales).",
    negro: "Recipientes de color Negro para los residuos no reciclables (envases plastificados como envoltorios de golosinas, papel de fax y carbónico, catálogos, envases de comida, papel de fotografía, celofán, lentes, tazas, platos, macetas de cerámica, espejos, focos, latas con pintura, etc.).",
    azul: "Recipientes de color Azul para depositar plásticos, hules y PET.",
  },
  documentedRecords: [
    { code: "ITMORELIA-IT-AM-007-01", name: "Informe diagnóstico de RSU", retention: "2 años", responsible: "Jefe del departamento de Recursos Materiales" },
    { code: "ITMORELIA-IT-AM-007-02", name: "Bitácora de control de residuos sólidos urbanos", retention: "2 años", responsible: "Jefe del departamento de Recursos Materiales" },
    { code: "ITMORELIA-IT-AM-007-03", name: "Análisis de Ciclo de Vida (ACV)", retention: "2 años", responsible: "Jefe del departamento de Recursos Materiales" },
    { code: "ITMORELIA-IT-AM-007-04", name: "Informe Semestral de residuos generados y enviados a reciclaje/disposición", retention: "2 años", responsible: "Jefe del departamento de Recursos Materiales" },
  ],
  normativeStandards: [
    "NMX-AA-015-1985 (Muestreo de RSU - Método de Cuarteo)",
    "NMX-AA-019-1985 (Peso volumétrico in situ)",
    "NMX-AA-22-1985 (Selección y Cuantificación de Subproductos)",
    "NMX-AA-61-1985 (Determinación de la Generación)",
    "ISO 14001:2015 / NMX-SSA-14001-IMNC-2015 (Sistema de Gestión Ambiental ITM)",
    "ISO 21001:2018 (Sistema de Gestión para Organizaciones Educativas)",
    "LGPGIR y Reglamento de la LGPGIR",
  ],
};

export const CAMPUS_CONTAINERS_CATALOG: CampusContainerSpec[] = [
  {
    id: "bin-verde",
    name: "Verde — Orgánicos",
    colorName: "Verde",
    colorHex: "#16a34a",
    badgeBg: "bg-emerald-600 text-white",
    textColor: "text-emerald-700 dark:text-emerald-400",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    shortDescription: "Restos de alimentos y madera.",
    normativeReference: "ITMORELIA-IT-AM-007 Rev. 3 Sec. 4.1 & Criterios de Compostaje SGI",
    acceptedMaterials: [
      "Restos de frutas, cáscaras y corazones de manzana",
      "Residuos de verduras y ensaladas sin aderezo artificial",
      "Restos de madera y residuos de jardinería",
      "Posos (borra) de café molido y filtros de papel",
      "Bolsitas de té e infusiones de hierbas",
      "Servilletas de papel sin tintas manchadas de comida",
      "Cáscaras de huevo trituradas",
    ],
    rejectedMaterials: [
      "Bolsas plásticas (incluso etiquetadas 'oxo-biodegradables')",
      "Huesos grandes o trozos de carne con exceso de grasa",
      "Heces de mascotas o arena sanitaria",
      "Colillas de cigarro o cenizas",
      "Cubiertos y popotes de plástico",
    ],
    preparationRules: [
      "Escurrir caldos y líquidos excedentes antes de vaciar en el bote.",
      "Retirar etiquetas adhesivas y grapas metálicas de saquitos de té.",
      "Depositar directamente a granel, sin amarrar en bolsas plásticas.",
    ],
    campusDestination: "Módulo de Lombricompostaje y Abono Verde IT Morelia (Campus 1 y 2)",
    handlingTip: "La composta genera abono natural para los jardines del Tecnológico. Un solo plástico contamina el lote completo con microplásticos.",
  },
  {
    id: "bin-amarillo",
    name: "Amarillo — Reciclables",
    colorName: "Amarillo",
    colorHex: "#eab308",
    badgeBg: "bg-amber-500 text-zinc-950",
    textColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-300 dark:border-amber-700",
    shortDescription: "Papel, cartón, vidrio y metales.",
    normativeReference: "ITMORELIA-IT-AM-007 Rev. 3 Sec. 4.1 (Reciclables) & NMX-N-107-SCFI",
    acceptedMaterials: [
      "Hojas blancas y de cuaderno limpias y secas",
      "Cajas de cartón corrugado aplanadas y folders",
      "Latas de refresco, té frío y bebidas de aluminio (100% reciclable)",
      "Latas de conserva de atún y elotes (Hojalata lavada)",
      "Envases de vidrio no rotos",
      "Papel aluminio de cocina limpio",
    ],
    rejectedMaterials: [
      "Papel de fax o papel carbónico (va al bote negro)",
      "Papel térmico de tickets de compra (va al bote negro)",
      "Cajas de pizza o cartón con manchas de grasa (va al bote negro)",
      "Botes de aerosol con solvente a presión",
    ],
    preparationRules: [
      "Mantener el papel y cartón estrictamente SECO.",
      "Aplanar cajas de cartón y latas de aluminio para multiplicar la capacidad del contenedor.",
      "Enjuagar restos de líquido o grasa en latas de comida.",
    ],
    campusDestination: "Almacén temporal de RSU del ITM (Formato ITMORELIA-IT-AM-007-02) para empresas recicladoras autorizadas",
    handlingTip: "Reciclar una sola lata ahorra suficiente energía para operar una laptop por 5 horas; el papel seco se repulpa en nuevas libretas.",
  },
  {
    id: "bin-negro",
    name: "Negro — No reciclables",
    colorName: "Negro",
    colorHex: "#27272a",
    badgeBg: "bg-zinc-800 text-white",
    textColor: "text-zinc-700 dark:text-zinc-300",
    borderColor: "border-zinc-300 dark:border-zinc-700",
    shortDescription: "Envoltorios plastificados, celofán, cerámica y otros residuos de esta categoría.",
    normativeReference: "ITMORELIA-IT-AM-007 Rev. 3 Sec. 4.1 (No Reciclables)",
    acceptedMaterials: [
      "Envases plastificados como envoltorios de golosinas y botanas (BOPP multicapa)",
      "Envases de comida y unicel (EPS #6) impregnados de caldo o grasa",
      "Papel de fax, papel carbónico y papel térmico de tickets de compra",
      "Papel de fotografía, celofán y catálogos plastificados",
      "Lentes, tazas, platos y macetas de cerámica",
      "Espejos, focos y latas con pintura",
      "Servilletas usadas con grasa o salsa y papel sanitario de baño",
      "Plumas desechables sin tinta, curitas y cubrebocas usados",
    ],
    rejectedMaterials: [
      "Envases de PET y latas limpias recuperables",
      "Hojas de papel y cartón seco limpio",
      "Envases de plástico rígidos reciclables",
    ],
    preparationRules: [
      "Depositar en bolsas resistentes bien atadas para prevenir esparcimiento.",
      "Verificar que no contenga materiales que sí puedan reciclarse antes de tirar.",
      "Proteger puntas o vidrios rotos envolviéndolos en papel periódico.",
    ],
    campusDestination: "Relleno Sanitario Municipal Concesionado de Morelia",
    handlingTip: "Estos residuos tardarán siglos en degradarse. El mejor residuo no reciclable es aquel que evitamos generar trayendo termos y recipientes propios.",
  },
  {
    id: "bin-azul",
    name: "Azul — Plásticos, hules y PET",
    colorName: "Azul",
    colorHex: "#2563eb",
    badgeBg: "bg-blue-600 text-white",
    textColor: "text-blue-700 dark:text-blue-400",
    borderColor: "border-blue-300 dark:border-blue-700",
    shortDescription: "Envases de plástico y otros materiales de esta categoría.",
    normativeReference: "ITMORELIA-IT-AM-007 Rev. 3 Sec. 4.1 & Política 100% Libres de Plásticos de un Solo Uso",
    acceptedMaterials: [
      "Botellas de agua, jugo y refresco de PET (#1 transparente o color)",
      "Envases de leche, yogur bebible y limpiadores enjuagados (PEAD #2)",
      "Tapas plásticas de rosca (Polipropileno PP #5)",
      "Hules limpios y botes de plástico rígidos reciclables",
    ],
    rejectedMaterials: [
      "Envoltorios plastificados de golosinas o botanas (BOPP metalizado - va al negro)",
      "Vasos y platos de unicel (EPS #6 - va al negro)",
      "Botellas con residuos de aceite de motor",
      "Mangueras o jeringas médicas",
    ],
    preparationRules: [
      "Regla de las 4V: 1. Vaciar el líquido restante al 100%.",
      "2. Enjuagar con un poco de agua si contenía azúcar para evitar moscas.",
      "3. Aplastar y compactar desde la base para ahorrar hasta 70% de espacio.",
      "4. Volver a enroscar la tapa (las tapitas se reciclan y evitan derrames).",
    ],
    campusDestination: "Contenedores Centrales de Acopio Estudiantil para reciclaje industrial avalado por SGI ITM",
    handlingTip: "Fomentar el uso de termos propios para cumplir la política institucional del ITM 100% libres de plásticos de un solo uso.",
  },
  {
    id: "bin-pilas",
    name: "Contenedor Oficial — Pilas y RAEE",
    colorName: "Naranja Especial",
    colorHex: "#ea580c",
    badgeBg: "bg-orange-600 text-white",
    textColor: "text-orange-700 dark:text-orange-400",
    borderColor: "border-orange-300 dark:border-orange-700",
    shortDescription: "Pilas alcalinas, baterías y electrónicos menores.",
    normativeReference: "NOM-052-SEMARNAT & Campaña Institucional Reciclatón ITM",
    acceptedMaterials: [
      "Pilas alcalinas AA, AAA, C y D",
      "Pilas tipo botón (relojes y calculadoras)",
      "Baterías de litio de laptops y celulares",
      "Cables USB y cargadores dañados",
    ],
    rejectedMaterials: [
      "Baterías automotrices pesadas de plomo-ácido",
      "Basura común u orgánica",
      "Pilas sulfatadas sin aislar",
    ],
    preparationRules: [
      "Colocar cinta adhesiva transparente en ambos polos de las pilas antes de depositarlas.",
      "No mezclar con basura doméstica ni mojar bajo ninguna circunstancia.",
    ],
    campusDestination: "Almacén temporal de Residuos Peligrosos ITM para confinamiento y reciclaje certificado SEMARNAT",
    handlingTip: "Una sola pila de mercurio puede contaminar hasta 600,000 litros de agua si llega a un tiradero municipal.",
  },
];

export const CATEGORY_INFO: Record<WasteCategory, {
  name: string;
  colorBadge: string;
  textColor: string;
  bgLight: string;
  normativeBasis: string;
  description: string;
}> = {
  organicos: {
    name: "Residuos Orgánicos",
    colorBadge: "bg-emerald-600 text-white",
    textColor: "text-emerald-700 dark:text-emerald-400",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    normativeBasis: "LGPGIR Art. 5, Fracc. XXIX & Criterios SEMARNAT",
    description: "Residuos de origen biológico vegetal o animal capaces de degradarse naturalmente mediante procesos biológicos."
  },
  reciclables: {
    name: "Inorgánicos Reciclables",
    colorBadge: "bg-blue-600 text-white",
    textColor: "text-blue-700 dark:text-blue-400",
    bgLight: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    normativeBasis: "Norma Oficial Mexicana NOM-161-SEMARNAT & LGPGIR",
    description: "Materiales manufacturados que pueden incorporarse nuevamente a cadenas de transformación productiva si se mantienen limpios y secos."
  },
  no_reciclables: {
    name: "Inorgánicos No Reciclables",
    colorBadge: "bg-zinc-600 text-white",
    textColor: "text-zinc-700 dark:text-zinc-400",
    bgLight: "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
    normativeBasis: "SEMARNAT - Gestión Integral de RSU",
    description: "Materiales cuyo reciclaje no es viable técnica ni económicamente en la región, o que están contaminados con sustancias biológicas."
  },
  manejo_especial: {
    name: "Manejo Especial / Peligrosos",
    colorBadge: "bg-amber-600 text-white",
    textColor: "text-amber-700 dark:text-amber-400",
    bgLight: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    normativeBasis: "LGPGIR Art. 19 & NOM-052-SEMARNAT",
    description: "Residuos generados en procesos o productos que contienen sustancias tóxicas o metales pesados, requiriendo planes de manejo específicos."
  }
};

export const WASTE_DATABASE: WasteItem[] = [
  // ─── BEBIDAS Y ENVASES PLÁSTICOS RÍGIDOS (BOTE AZUL) ───
  {
    id: "pet-bottle",
    name: "Botella de Coca-Cola 600ml (PET)",
    brand: "The Coca-Cola Company",
    material: "Plástico PET #1 (cuerpo) y Polipropileno PP #5 (tapa)",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "El PET es un termoplástico con alta demanda en cadenas de reciclaje industrial en México si no contiene residuos orgánicos.",
    recommendedBin: {
      color: "Azul Cobalto",
      label: "Bote Azul · Plásticos Rígidos y PET",
      description: "Contenedor oficial del ITM para botellas y envases plásticos reciclables."
    },
    handlingInstructions: [
      "Vaciar completamente cualquier líquido residual.",
      "Enjuagar con poca agua para que el azúcar no atraiga hormigas o avispas.",
      "Aplanar y compactar la botella desde la base para ahorrar hasta 70% de espacio.",
      "Colocar la tapa enroscada (las tapitas de polipropileno también se reciclan)."
    ],
    recommendations3R: {
      reducir: "Portar un termo o botella reutilizable de acero o vidrio en las jornadas universitarias.",
      reutilizar: "Utilizar temporalmente para riego por goteo en huertos escolares antes de su disposición.",
      reciclar: "Depositar en el bote azul del ITM para su transformación en fibra de poliéster o nuevas botellas."
    },
    degradationTime: {
      estimate: "Aproximadamente entre 100 y 450 años",
      isApproximate: true,
      conditionsNote: "Depende de la radiación UV y temperatura; en rellenos sanitarios enterrados sin luz puede persistir indefinidamente."
    },
    environmentalImpact: {
      description: "La producción de PET nuevo consume petróleo y agua. Reciclar 1 tonelada de PET ahorra 3.8 barriles de petróleo crudo.",
      source: "SEMARNAT - Diagnóstico Básico para la Gestión Integral de los Residuos (2020)"
    },
    examples: ["Coca-Cola 600ml", "Pepsi 600ml", "Sprite", "Fanta"]
  },
  {
    id: "ciel-agua-pet",
    name: "Botella de Agua Ciel / Bonafont 1L",
    brand: "Ciel / Bonafont",
    material: "Plástico PET #1 transparente reciclado (Eco-Pura)",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "Las botellas de agua natural son el material PET más codiciado por las recicladoras al carecer de colorantes y grasas.",
    recommendedBin: {
      color: "Azul Cobalto",
      label: "Bote Azul · Plásticos Rígidos y PET",
      description: "Contenedor oficial del ITM para plásticos rígidos."
    },
    handlingInstructions: [
      "Vaciar las últimas gotas de agua.",
      "Aplanar desde el fondo girando el cuerpo de la botella.",
      "Apretar la tapa plástica sobre el pico compactado."
    ],
    recommendations3R: {
      reducir: "Utilizar los bebederos de agua potable filtrada en los edificios del campus ITM.",
      reutilizar: "Rellenar con agua purificada durante el día.",
      reciclar: "Directo al bote azul de reciclables limpios."
    },
    degradationTime: {
      estimate: "Entre 100 y 400 años",
      isApproximate: true,
      conditionsNote: "El plástico no se biodegrada, se fotodegrada en microplásticos."
    },
    environmentalImpact: {
      description: "En México se desechan más de 90 millones de botellas de agua y refresco al día.",
      source: "ECOCE / INEGI"
    },
    examples: ["Agua Ciel 1L", "Agua Bonafont 1L", "Agua Epura 600ml"]
  },
  {
    id: "electrolit-frasco",
    name: "Frasco de Suero Electrolit 625ml",
    brand: "Laboratorios PiSA",
    material: "Plástico rígido PEAD #2 / PET médico",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "Envase plástico rígido grado farmacéutico 100% reciclable tras su enjuague.",
    recommendedBin: {
      color: "Azul Cobalto",
      label: "Bote Azul · Plásticos Rígidos y PET",
      description: "Contenedor para envases plásticos rígidos limpios."
    },
    handlingInstructions: [
      "Escurrir los restos de suero salino.",
      "Enjuagar ligeramente para prevenir malos olores en el contenedor.",
      "Depositar con su tapa enroscada en el bote azul."
    ],
    recommendations3R: {
      reducir: "Tomar electrolitos solo en casos de deshidratación médica o deportiva real.",
      reutilizar: "Útil como frasco organizador para clavos o tornillos en talleres de ingeniería.",
      reciclar: "Canalizar a molienda de plástico en el ITM."
    },
    degradationTime: {
      estimate: "Aproximadamente 150 a 450 años",
      isApproximate: true,
      conditionsNote: "Plástico grueso de alta densidad resistente a impactos químicos y físicos."
    },
    environmentalImpact: {
      description: "Los frascos de electrolitos tienen mayor espesor que una botella común, requiriendo más polímero por unidad.",
      source: "SEMARNAT"
    },
    examples: ["Electrolit Fresa", "Electrolit Uva", "Suerox"]
  },
  {
    id: "jugo-del-valle-pet",
    name: "Botella de Jugo Del Valle / Néctar 413ml",
    brand: "Jugos Del Valle / Coca-Cola",
    material: "Plástico PET #1 con etiqueta termoencogible",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "Envase de PET de alta densidad recuperable en cadenas de reciclaje de botellas.",
    recommendedBin: {
      color: "Azul Cobalto",
      label: "Bote Azul · Plásticos Rígidos y PET",
      description: "Contenedor de botellas y plásticos reciclables."
    },
    handlingInstructions: [
      "Vaciar el néctar restante.",
      "Enjuagar con poca agua para no dejar residuos de azúcar.",
      "Aplanar y colocar en el bote azul."
    ],
    recommendations3R: {
      reducir: "Comprar fruta entera de temporada en lugar de jugos procesados en botella.",
      reutilizar: "Utilizar como recipiente dosificador en casa.",
      reciclar: "Acopio de PET en el ITM."
    },
    degradationTime: {
      estimate: "De 100 a 400 años",
      isApproximate: true,
      conditionsNote: "El plástico tarda siglos en degradarse por completo."
    },
    environmentalImpact: {
      description: "Los jugos embotellados acumulan un alto consumo de huella hídrica y de empaque plástico.",
      source: "SEMARNAT"
    },
    examples: ["Del Valle Mango", "Del Valle Durazno", "Fuze Tea Limón"]
  },
  {
    id: "yogurt-danone-bote",
    name: "Bote de Yogurt Danone / Yoplait 1kg",
    brand: "Danone / Yoplait",
    material: "Polipropileno (PP #5) rígido",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "El polipropileno rígido es reciclable mecánicamente SI se entrega libre de grasa láctea.",
    recommendedBin: {
      color: "Azul Cobalto",
      label: "Bote Azul · Plásticos Rígidos y PET",
      description: "Envases plásticos rígidos lavados y secos."
    },
    handlingInstructions: [
      "Lavar con agua el interior para eliminar completamente la nata y grasa del yogurt.",
      "Separar la tapa de aluminio desprendible (la tapa limpia va al bote amarillo).",
      "Secar el bote y depositar en el bote azul."
    ],
    recommendations3R: {
      reducir: "Comprar presentaciones familiares y servir porciones en recipientes reutilizables.",
      reutilizar: "Excelente contenedor para comida o maceta escolar.",
      reciclar: "Depositar limpio en el bote azul."
    },
    degradationTime: {
      estimate: "Entre 150 y 300 años",
      isApproximate: true,
      conditionsNote: "El polipropileno resiste ácidos lácticos pero se quiebra con radiación UV."
    },
    environmentalImpact: {
      description: "La grasa láctea residual arruina tinas enteras de reciclaje si no se lava previamente.",
      source: "Cámara Mexicana de la Industria Plástica"
    },
    examples: ["Yogurt Danone 1kg", "Yoplait Griego 1kg", "Alpura Yogurt 1kg"]
  },

  // ─── LATAS DE ALUMINIO Y METALES (BOTE AMARILLO) ───
  {
    id: "aluminum-can",
    name: "Lata de Coca-Cola / Pepsi 355ml",
    brand: "Coca-Cola / PepsiCo",
    material: "Aluminio grado alimenticio (100% reciclable infinito)",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "El aluminio es 100% reciclable de forma infinita sin perder sus propiedades mecánicas, ahorrando hasta un 95% de energía frente al aluminio virgen.",
    recommendedBin: {
      color: "Amarillo Dorado",
      label: "Bote Amarillo · Latas de Aluminio y Metales",
      description: "Módulo exclusivo para latas de bebidas y metales."
    },
    handlingInstructions: [
      "Vaciar el contenido líquido restante al 100%.",
      "Aplanar la lata verticalmente con el pie o mano para reducir su volumen.",
      "No introducir colillas de cigarro ni envoltorios plásticos en su interior."
    ],
    recommendations3R: {
      reducir: "Preferir bebidas preparadas en recipientes reutilizables.",
      reutilizar: "Posible uso didáctico en proyectos de física o manualidades escolares.",
      reciclar: "El reciclaje de aluminio tiene un mercado consolidado en Michoacán con alta retribución ambiental."
    },
    degradationTime: {
      estimate: "Aproximadamente entre 80 y 200 años",
      isApproximate: true,
      conditionsNote: "Crea una capa protectora de alúmina que ralentiza su desintegración en tierra."
    },
    environmentalImpact: {
      description: "Reciclar 1 lata ahorra energía suficiente para alimentar una laptop por 5 horas.",
      source: "International Aluminium Institute / SEMARNAT"
    },
    examples: ["Lata Coca-Cola 355ml", "Lata Sprite", "Lata Dr Pepper"]
  },
  {
    id: "arizona-lata",
    name: "Lata de Té Arizona 680ml",
    brand: "Arizona Beverage Company",
    material: "Aluminio de alto gramaje con recubrimiento epóxico interior",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "Gran volumen de aluminio puro recuperable con alto valor comercial de acopio.",
    recommendedBin: {
      color: "Amarillo Dorado",
      label: "Bote Amarillo · Latas de Aluminio y Metales",
      description: "Contenedor oficial de metales."
    },
    handlingInstructions: [
      "Vaciar por completo el té helado sobrante.",
      "Aplastar la lata alta para que no sature el contenedor del campus.",
      "Tirar en el bote amarillo."
    ],
    recommendations3R: {
      reducir: "Preparar té natural en casa y llevarlo en termo frío.",
      reutilizar: "Portalápices de escritorio resistente.",
      reciclar: "100% reciclable en fundición de aluminio."
    },
    degradationTime: {
      estimate: "Entre 100 y 250 años",
      isApproximate: true,
      conditionsNote: "Cuerpo de aluminio más grueso que una lata estándar de refresco."
    },
    environmentalImpact: {
      description: "Por su tamaño, cada lata equivale a casi 2 latas convencionales de aluminio.",
      source: "SEMARNAT"
    },
    examples: ["Arizona Té Verde con Miel", "Arizona Mucho Mango", "Arizona Sandía"]
  },
  {
    id: "atun-dolores-lata",
    name: "Lata de Atún Dolores / Herdez 140g",
    brand: "Atún Dolores / Herdez",
    material: "Hojalata de acero estañado (Metal ferromagnético)",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "El acero de hojalata se separa fácilmente con electroimanes y se refunde en acerías.",
    recommendedBin: {
      color: "Amarillo Dorado",
      label: "Bote Amarillo · Latas de Aluminio y Metales",
      description: "Contenedor de metales limpios."
    },
    handlingInstructions: [
      "Retirar la tapa abrefácil con cuidado e introducirla en el fondo de la lata.",
      "Lavar con agua y detergente para eliminar el aceite o agua residual (evita moscas y malos olores).",
      "Depositar seca en el bote amarillo."
    ],
    recommendations3R: {
      reducir: "Optar por presentaciones pouch o atún a granel cuando sea viable.",
      reutilizar: "Cenicero de taller o recipiente de mezcla.",
      reciclar: "Reciclaje de acero en plantas siderúrgicas mexicanas."
    },
    degradationTime: {
      estimate: "Entre 50 y 100 años",
      isApproximate: true,
      conditionsNote: "El estaño superficial se desgasta y el hierro se oxida con la humedad."
    },
    environmentalImpact: {
      description: "El acero reciclado consume 75% menos energía que extraer mineral de hierro virgen.",
      source: "Cámara Nacional del Acero (CANACERO)"
    },
    examples: ["Atún Dolores en Aceite", "Atún Herdez en Agua", "Lata de Granos de Elote"]
  },

  // ─── BOTANAS, GALLETAS Y ENVOLTURAS (BOTE NEGRO - NO RECICLABLES) ───
  {
    id: "snack-wrapper",
    name: "Bolsa de Sabritas Doritos Nacho 58g",
    brand: "Sabritas / PepsiCo",
    material: "Polipropileno biorientado (BOPP) metalizado con aluminio vaporizado (#7 Otros)",
    category: "no_reciclables",
    categoryLabel: "Inorgánico No Reciclable",
    categoryReason: "Película plástica con una capa microscópica de aluminio evaporado y condimentos grasos que no puede separarse económicamente en México.",
    recommendedBin: {
      color: "Gris Antracita / Negro",
      label: "Bote Negro · Basura Común / No Reciclables",
      description: "Módulo para desechos inorgánicos sin viabilidad de reciclaje local."
    },
    handlingInstructions: [
      "Sacudir migajas y residuos de queso/chile.",
      "Hacer un nudo o doblar la bolsa para reducir que vuele con el aire.",
      "Depositar en el bote negro de no reciclables."
    ],
    recommendations3R: {
      reducir: "Elegir fruta fresca o botanas preparadas en recipientes propios en lugar de paquetes ultraprocesados.",
      reutilizar: "Participar en iniciativas comunitarias de ecoladrillos para bioconstrucción en talleres del campus.",
      reciclar: "Actualmente sin cadena formal de reciclaje en Morelia; se envía a relleno sanitario."
    },
    degradationTime: {
      estimate: "Aproximadamente 100 a 300 años",
      isApproximate: true,
      conditionsNote: "El polipropileno metalizado es impermeable y se fragmenta en microplásticos sin biodegradarse."
    },
    environmentalImpact: {
      description: "Constituyen uno de los residuos más abundantes en andadores universitarios; obstruyen coladeras en Morelia durante lluvias.",
      source: "Secretaría de Urbanismo y Medio Ambiente de Michoacán (SUMA)"
    },
    examples: ["Doritos Nacho", "Cheetos Torciditos", "Ruffles Queso", "Fritos Sal y Limón"]
  },
  {
    id: "barcel-takis",
    name: "Bolsa de Takis Fuego Barcel 65g",
    brand: "Barcel / Grupo Bimbo",
    material: "Polímero multicapa BOPP metalizado con aceite y colorante rojo",
    category: "no_reciclables",
    categoryLabel: "Inorgánico No Reciclable",
    categoryReason: "Empaque multicapa plástico-metalizado que no tiene cadena de reciclaje mecánico viable.",
    recommendedBin: {
      color: "Gris Antracita / Negro",
      label: "Bote Negro · Basura Común / No Reciclables",
      description: "Contenedor de basura no reciclable."
    },
    handlingInstructions: [
      "Vaciar las migajas de picante al bote orgánico.",
      "Doblar la envoltura en triángulo o nudo plano.",
      "Tirar en el bote negro del campus."
    ],
    recommendations3R: {
      reducir: "Comprar botanas a granel en tienditas locales con tu propio tupper.",
      reutilizar: "Llenar botellas de ecoladrillo si hay campaña activa.",
      reciclar: "No reciclable comercialmente en Morelia."
    },
    degradationTime: {
      estimate: "De 150 a 400 años",
      isApproximate: true,
      conditionsNote: "Las capas termoselladas resisten la intemperie y conservan colorantes químicos."
    },
    environmentalImpact: {
      description: "Los colorantes químicos y polímeros no degradables contaminan el suelo si se tiran en áreas verdes.",
      source: "SEMARNAT"
    },
    examples: ["Takis Fuego", "Chips Jalapeño", "Hot Nuts Barcel"]
  },
  {
    id: "galletas-emperador",
    name: "Paquete de Galletas Emperador / Chokis",
    brand: "Gamesa / PepsiCo",
    material: "Película de polipropileno biorientado (BOPP) con charola de plástico interior",
    category: "no_reciclables",
    categoryLabel: "Inorgánico No Reciclable",
    categoryReason: "La envoltura exterior metalizada no se recicla. La charolita transparente interior suele estar contaminada de grasa de chocolate.",
    recommendedBin: {
      color: "Gris Antracita / Negro",
      label: "Bote Negro · Basura Común / No Reciclables",
      description: "Contenedor para residuos no reciclables."
    },
    handlingInstructions: [
      "Sacudir migajas de galleta.",
      "Compactar la charolita dentro de la bolsa exterior.",
      "Depositar en el bote negro."
    ],
    recommendations3R: {
      reducir: "Preparar galletas caseras o comprar a granel en panaderías locales.",
      reutilizar: "Charola útil para clasificar componentes electrónicos pequeños en laboratorio.",
      reciclar: "Disposición en relleno sanitario."
    },
    degradationTime: {
      estimate: "Entre 100 y 300 años",
      isApproximate: true,
      conditionsNote: "Película termoplástica ultrafina resistente a descomposición biológica."
    },
    environmentalImpact: {
      description: "Las envolturas de galletas representan hasta el 12% del volumen de basura plástica ligera en escuelas.",
      source: "Diagnóstico RSU Michoacán"
    },
    examples: ["Galletas Emperador Chocolate", "Chokis Clásica", "Galletas Marías paquete individual"]
  },
  {
    id: "gansito-marinela",
    name: "Envoltura de Gansito / Pingüinos Marinela",
    brand: "Marinela / Grupo Bimbo",
    material: "Película plástica metalizada termosellada",
    category: "no_reciclables",
    categoryLabel: "Inorgánico No Reciclable",
    categoryReason: "Plástico metalizado con residuo graso de betún y crema que anula cualquier posibilidad de reprocesamiento.",
    recommendedBin: {
      color: "Gris Antracita / Negro",
      label: "Bote Negro · Basura Común / No Reciclables",
      description: "Contenedor de basura no reciclable."
    },
    handlingInstructions: [
      "Doblar la envoltura para reducir volumen.",
      "Depositar en el bote negro de no reciclables."
    ],
    recommendations3R: {
      reducir: "Moderar el consumo de pastelitos ultraprocesados empaquetados individualmente.",
      reutilizar: "Compactar en ecoladrillos si hay recolección estudiantil.",
      reciclar: "No reciclable."
    },
    degradationTime: {
      estimate: "De 100 a 250 años",
      isApproximate: true,
      conditionsNote: "Se fotodegrada lentamente liberando micropartículas sintéticas."
    },
    environmentalImpact: {
      description: "Basura ligera que suele ser arrastrada por el viento a jardines y áreas verdes del campus.",
      source: "SEMARNAT"
    },
    examples: ["Gansito Marinela", "Pingüinos Marinela", "Choco Roles 2 piezas"]
  },

  // ─── CAFETERÍA, ALIMENTOS Y DESECHABLES (BOTE VERDE Y BOTE NEGRO) ───
  {
    id: "unicel",
    name: "Vaso de Sopa Maruchan / Ramen (Unicel)",
    brand: "Maruchan / Nissin",
    material: "Poliestireno Expandido (EPS #6 / Unicel) impregnado de caldo grasoso",
    category: "no_reciclables",
    categoryLabel: "Inorgánico No Reciclable (en manejo común)",
    categoryReason: "El unicel grasoso y mojado NO es aceptado por recicladoras. En Morelia se destina a entierro en el relleno sanitario.",
    recommendedBin: {
      color: "Gris Antracita / Negro",
      label: "Bote Negro · Basura Común / No Reciclables",
      description: "Contenedor para unicel, servilletas y desechables no reciclables."
    },
    handlingInstructions: [
      "Escurrir completamente el caldo residual en la tarja de cafetería.",
      "Separar la tapita de aluminio/cartón y el tenedor plástico.",
      "Aplastar el vaso de unicel y depositar en el bote negro."
    ],
    recommendations3R: {
      reducir: "Evitar sopas en vaso de unicel; preparar fideos o alimentos en recipientes propios de cerámica o vidrio.",
      reutilizar: "No reutilizar para alimentos calientes: libera estireno residual al calentarse.",
      reciclar: "No reciclable cuando está contaminado con grasas y caldos."
    },
    degradationTime: {
      estimate: "Más de 500 años (o indefinido)",
      isApproximate: true,
      conditionsNote: "El poliestireno expandido no es biodegradable; únicamente se fragmenta mecánicamente por fricción y sol en micropartículas plásticas."
    },
    environmentalImpact: {
      description: "Ocupa un volumen gigantesco en rellenos sanitarios y libera toxinas cancerígenas si se incinera.",
      source: "SEMARNAT & Alianza México Sin Plástico"
    },
    examples: ["Sopa Maruchan Instantánea", "Nissin Cup Noodles", "Vaso de sopa ramen"]
  },
  {
    id: "andatti-cafe-vaso",
    name: "Vaso de Café OXXO Andatti con Tapa",
    brand: "OXXO Andatti",
    material: "Cartón con recubrimiento interior de polietileno impermeabilizante + Tapa de Poliestireno #6",
    category: "no_reciclables",
    categoryLabel: "Inorgánico No Reciclable",
    categoryReason: "El vaso de café parece de papel, pero tiene una película plástica interna termosellada que impide disolverlo en agua para reciclarlo.",
    recommendedBin: {
      color: "Gris Antracita / Negro",
      label: "Bote Negro · Basura Común / No Reciclables",
      description: "Contenedor de residuos no reciclables."
    },
    handlingInstructions: [
      "Vaciar las últimas gotas de café.",
      "Separar la fajilla de cartón corrugado marrón exterior (si está limpia y seca, la fajilla sí va al bote amarillo de papel y cartón).",
      "El vaso encerado/plastificado y la tapa plástica van al bote negro."
    ],
    recommendations3R: {
      reducir: "Llevar termo o taza propia al OXXO o cafetería del ITM (frecuentemente ofrecen descuento).",
      reutilizar: "Utilizar temporalmente como semillero de jardín.",
      reciclar: "El vaso compuesto no se recicla en Morelia."
    },
    degradationTime: {
      estimate: "Aproximadamente 20 a 50 años",
      isApproximate: true,
      conditionsNote: "El cartón exterior se degrada pero la película interior de plástico persiste durante décadas."
    },
    environmentalImpact: {
      description: "En México se desechan más de 10,000 vasos de café descartables por minuto.",
      source: "Greenpeace México"
    },
    examples: ["Vaso Café Andatti Mediano", "Vaso Café Starbucks", "Vaso Cafetería ITM"]
  },
  {
    id: "charola-unicel-comida",
    name: "Charola de Unicel con Divisiones (Comida Corrida)",
    brand: "Genérico / Cafetería ITM",
    material: "Poliestireno expandido (EPS #6) impregnado con salsa y grasa",
    category: "no_reciclables",
    categoryLabel: "Inorgánico No Reciclable",
    categoryReason: "El unicel manchado con alimentos grasos es considerado residuo sólido urbano no valorizable.",
    recommendedBin: {
      color: "Gris Antracita / Negro",
      label: "Bote Negro · Basura Común / No Reciclables",
      description: "Contenedor para residuos no reciclables."
    },
    handlingInstructions: [
      "Limpiar las sobras de comida y tirarlas al bote verde de orgánicos.",
      "Partir la charola limpia de comida para compactar su volumen.",
      "Depositar en el bote negro."
    ],
    recommendations3R: {
      reducir: "Pedir la comida en plato lavable si se come en cafetería, o llevar tupper propio para llevar.",
      reutilizar: "No apto para microondas ni alimentos calientes repetidos.",
      reciclar: "No reciclable localmente."
    },
    degradationTime: {
      estimate: "Más de 500 años",
      isApproximate: true,
      conditionsNote: "Material altamente persistente y voluminoso."
    },
    environmentalImpact: {
      description: "Unicel fragmentado es consumido por aves y roedores causando asfixia y obstrucciones digestivas.",
      source: "PNUMA"
    },
    examples: ["Charola de comida corrida", "Plato hondo de unicel pozolero", "Vaso térmico de esquites"]
  },
  {
    id: "organic-food",
    name: "Cáscara de Plátano Tabasco",
    brand: "Fruta natural",
    material: "Materia orgánica biodegradable rica en potasio y fibra vegetal",
    category: "organicos",
    categoryLabel: "Residuo Orgánico Biodegradable",
    categoryReason: "Material de origen vegetal susceptible de compostaje y reintegración biológica al suelo.",
    recommendedBin: {
      color: "Verde Bosque",
      label: "Bote Verde · Orgánicos Biodegradables",
      description: "Módulo exclusivo para restos de frutas, verduras y residuos de jardinería."
    },
    handlingInstructions: [
      "Retirar cualquier etiqueta engomada adhesiva de la cáscara.",
      "Separar completamente de servilletas plastificadas o cubiertos.",
      "Depositar a granel en el bote verde del ITM (sin amarrar en bolsa plástica)."
    ],
    recommendations3R: {
      reducir: "Aprovechar al máximo la fruta fresca.",
      reutilizar: "Frotar la cara interna en hojas de plantas del campus para darles brillo natural.",
      reciclar: "Se transforma en abono natural en la lombricomposta del ITM para nutrir jardines y áreas verdes."
    },
    degradationTime: {
      estimate: "De 2 a 6 semanas",
      isApproximate: true,
      conditionsNote: "Bajo compostaje aireado y temperatura adecuada se reintegra rápidamente como abono fértil."
    },
    environmentalImpact: {
      description: "Si los orgánicos se mezclan con plástico en tiraderos anaeróbicos producen gas metano de efecto invernadero.",
      source: "SEMARNAT - Guía de Compostaje Municipal"
    },
    examples: ["Cáscara de plátano", "Plátano macho", "Plátano dominico"]
  },
  {
    id: "manzana-corazon",
    name: "Corazón y Cáscara de Manzana",
    brand: "Fruta natural",
    material: "Materia orgánica biodegradable vegetal",
    category: "organicos",
    categoryLabel: "Residuo Orgánico Biodegradable",
    categoryReason: "Restos de fruta ricos en celulosa y agua que enriquecen el compostaje universitario.",
    recommendedBin: {
      color: "Verde Bosque",
      label: "Bote Verde · Orgánicos Biodegradables",
      description: "Contenedor oficial de residuos orgánicos."
    },
    handlingInstructions: [
      "Quitar cualquier estampita comercial de la cáscara.",
      "Tirar directamente en el bote verde del campus.",
      "No envolver en servilleta de papel blanqueado si es posible."
    ],
    recommendations3R: {
      reducir: "Consumir la manzana completa respetando solo las semillas.",
      reutilizar: "Abono vegetal directo en jardineras.",
      reciclar: "Compostaje en el módulo agronómico del campus."
    },
    degradationTime: {
      estimate: "De 3 semanas a 2 meses",
      isApproximate: true,
      conditionsNote: "Se descompone rápidamente por acción microbiana y humedad natural."
    },
    environmentalImpact: {
      description: "Los nutrientes regresan al suelo en lugar de podrirse en un relleno sanitario.",
      source: "SEMARNAT"
    },
    examples: ["Corazón de manzana", "Cáscara de pera", "Hueso de durazno"]
  },
  {
    id: "servilleta-usada",
    name: "Servilletas de Papel con Grasa o Salsa",
    brand: "Pétalo / Kimberly-Clark",
    material: "Fibras cortas de celulosa contaminadas con grasa vegetal o animal",
    category: "no_reciclables",
    categoryLabel: "Inorgánico No Reciclable",
    categoryReason: "La grasa y los aceites arruinan las tinas de repulpado de papel. Las servilletas manchadas de comida NO van a papel limpio, van al bote negro.",
    recommendedBin: {
      color: "Gris Antracita / Negro",
      label: "Bote Negro · Basura Común / No Reciclables",
      description: "Contenedor para residuos sanitarios y servilletas grasosas."
    },
    handlingInstructions: [
      "Depositar en el bote negro de no reciclables.",
      "Si la servilleta solo tiene agua limpia sin grasa, puede ir a composta en el bote verde."
    ],
    recommendations3R: {
      reducir: "Tomar únicamente 1 o 2 servilletas en la cafetería, no puñados enteros.",
      reutilizar: "Llevar servilleta de tela lavable en la mochila.",
      reciclar: "No reciclable para producir nuevo papel bond."
    },
    degradationTime: {
      estimate: "Entre 2 y 6 meses",
      isApproximate: true,
      conditionsNote: "El papel se degrada rápido pero la grasa atrae fauna nociva."
    },
    environmentalImpact: {
      description: "El abuso de servilletas desechables genera miles de toneladas de celulosa desperdiciada anualmente.",
      source: "INEGI"
    },
    examples: ["Servilletas con salsa", "Papel manchado de pizza", "Toalla de papel secamanos"]
  },

  // ─── ENVASES MULTICAPA TETRA PAK (BOTE AZUL) ───
  {
    id: "tetra-pak",
    name: "Envase Tetra Brik de Leche Lala 1L",
    brand: "Grupo Lala / Alpura",
    material: "Envase multicapa: Cartón virgen (75%), Polietileno (20%) y Hoja de Aluminio (5%)",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "Sus componentes se separan mediante un proceso de despulpado hidromecánico para recuperar cartón virgen y polialuminio.",
    recommendedBin: {
      color: "Azul Cobalto",
      label: "Bote Azul · Plásticos Rígidos y Envases",
      description: "Contenedor de envases recuperables."
    },
    handlingInstructions: [
      "Despegar las 4 pestañas triangulares de las esquinas superiores e inferiores.",
      "Aplanar el envase por completo hasta dejarlo plano como una hoja.",
      "Enjuagar con un poco de agua para retirar la leche y evitar olores agrios.",
      "Colocar la tapita plástica enroscada."
    ],
    recommendations3R: {
      reducir: "Comprar presentaciones grandes de mayor rendimiento en lugar de minienvases individuales.",
      reutilizar: "Excelente maceta para germinar hortalizas en proyectos de química o agronomía del campus.",
      reciclar: "Se transforma en cuadernos ecológicos y láminas para techos de polialuminio en México."
    },
    degradationTime: {
      estimate: "De 30 a 35 años (el cartón) y más de 300 años (el polialuminio)",
      isApproximate: true,
      conditionsNote: "La mezcla de plástico y aluminio en capas delgadas resiste la intemperie."
    },
    environmentalImpact: {
      description: "El cartón proviene de bosques certificados FSC. Reciclarlo evita talar árboles para celulosa virgen.",
      source: "Tetra Pak México / SEMARNAT"
    },
    examples: ["Leche Lala Entera 1L", "Leche Alpura Clásica", "Leche Santa Clara"]
  },
  {
    id: "boing-triangulo",
    name: "Envase Boing de Frutas en Tetra Pak 250ml",
    brand: "Sociedad Cooperativa Pascual",
    material: "Cartón multicapa con foil de aluminio interior",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "Envase multicapa reciclable en cadenas de recuperación de Tetra Pak en México.",
    recommendedBin: {
      color: "Azul Cobalto",
      label: "Bote Azul · Plásticos Rígidos y Envases",
      description: "Contenedor de envases limpios."
    },
    handlingInstructions: [
      "Vaciar el néctar de fruta sobrante.",
      "Introducir el popote dentro del envase para que no se pierda en el camino.",
      "Aplanar las esquinas y depositar en el bote azul."
    ],
    recommendations3R: {
      reducir: "Consumir agua natural o jugo preparado en cantimplora.",
      reutilizar: "Uso escolar para maquetas.",
      reciclar: "Separar para acopio de Tetra Pak en el campus."
    },
    degradationTime: {
      estimate: "Más de 30 años",
      isApproximate: true,
      conditionsNote: "Polietileno impermeable que resguarda el cartón de la humedad."
    },
    environmentalImpact: {
      description: "Cooperativa Pascual promueve la recolección estudiantil de envases en Michoacán.",
      source: "Pascual Boing / SEMARNAT"
    },
    examples: ["Boing Mango 250ml", "Boing Guayaba", "Boing Manzana"]
  },

  // ─── PAPELERÍA, CUADERNOS Y CARTÓN (AMARILLO — RECICLABLES) ───
  {
    id: "notebook-paper",
    name: "Hojas de Cuaderno Scribe Profesional",
    brand: "Scribe México",
    material: "Fibras de celulosa bond blanco (Papel reciclable)",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "Las fibras de celulosa pueden repulparse y transformarse en nuevo papel hasta 5-7 ciclos si se mantienen secas y libres de grasa.",
    recommendedBin: {
      color: "Amarillo",
      label: "Amarillo — Reciclables",
      description: "Papel, cartón, vidrio y metales limpios y secos (ITM Sec. 4.1)."
    },
    handlingInstructions: [
      "Verificar que el papel esté completamente SECO y sin manchas de comida.",
      "Retirar la espiral metálica o plástica de la libreta (el metal también va al bote amarillo).",
      "Depositar las hojas extendidas o dobladas en el bote amarillo."
    ],
    recommendations3R: {
      reducir: "Aprovechar ambas caras de las hojas y preferir notas digitales para apuntes de clase.",
      reutilizar: "Usar hojas con una cara en blanco como hojas de borrador para cálculos y tareas.",
      reciclar: "Depositar en el contenedor amarillo de reciclables del ITM para donación a campañas de reciclaje escolar."
    },
    degradationTime: {
      estimate: "Entre 2 y 6 meses (en condiciones favorables)",
      isApproximate: true,
      conditionsNote: "El papel se biodegrada con rapidez en presencia de humedad, oxígeno y microorganismos."
    },
    environmentalImpact: {
      description: "Reciclar 1 tonelada de papel salva 17 árboles y ahorra 28,000 litros de agua en comparación con papel virgen.",
      source: "INEGI & CONAFOR"
    },
    examples: ["Hojas de cuaderno Scribe", "Copias de exámenes secas", "Hojas de máquina bond"]
  },
  {
    id: "caja-carton-amazon",
    name: "Caja de Cartón corrugado (Amazon / Mercado Libre)",
    brand: "Amazon / Mercado Libre / Paquetería",
    material: "Cartón corrugado kraft de fibra larga",
    category: "reciclables",
    categoryLabel: "Inorgánico Reciclable",
    categoryReason: "El cartón corrugado tiene la tasa de reciclaje más alta en la industria de empaque mexicana.",
    recommendedBin: {
      color: "Amarillo",
      label: "Amarillo — Reciclables",
      description: "Papel, cartón, vidrio y metales (cajas desarmadas y aplanadas)."
    },
    handlingInstructions: [
      "Despegar o cortar la cinta plástica de embalaje.",
      "Desarmar la caja y aplastarla por completo para no saturar el contenedor.",
      "Asegurarse de que no esté mojada por lluvia."
    ],
    recommendations3R: {
      reducir: "Consolidar compras para recibir menos cajas de paquetería en campus.",
      reutilizar: "Caja ideal para almacenar proyectos, herramientas o enviar paquetes nuevos.",
      reciclar: "Directo al acopio de cartón para plantas de Morelia."
    },
    degradationTime: {
      estimate: "De 2 a 5 meses",
      isApproximate: true,
      conditionsNote: "Se desintegra con lluvia y calor en contacto con tierra fértil."
    },
    environmentalImpact: {
      description: "El cartón reciclado reduce en 60% la contaminación atmosférica frente al cartón nuevo.",
      source: "Cámara del Papel"
    },
    examples: ["Caja de envío Amazon", "Caja Mercado Libre", "Caja de zapatos de cartón"]
  },
  {
    id: "ticket-oxxo-termico",
    name: "Ticket de Compra de OXXO / Tienda (Papel Térmico)",
    brand: "OXXO / Terminal Punto de Venta",
    material: "Papel térmico químico recubierto con Bisfenol A (BPA) reactivo",
    category: "no_reciclables",
    categoryLabel: "Inorgánico No Reciclable",
    categoryReason: "El papel térmico contiene BPA. Si se mezcla con papel reciclable, contamina las tinas de despulpado e inutiliza el papel ecológico para contacto humano. Va al bote negro.",
    recommendedBin: {
      color: "Gris Antracita / Negro",
      label: "Bote Negro · Basura Común / No Reciclables",
      description: "Contenedor de residuos no reciclables."
    },
    handlingInstructions: [
      "No tirar en el contenedor de papel y cartón.",
      "Depositar en el bote negro de basura general."
    ],
    recommendations3R: {
      reducir: "Solicitar ticket digital o factura electrónica por correo cuando sea posible.",
      reutilizar: "Comprobante contable temporal antes de desechar.",
      reciclar: "No reciclable debido a reactivos químicos térmicos."
    },
    degradationTime: {
      estimate: "De 5 a 10 años",
      isApproximate: true,
      conditionsNote: "Los químicos preservantes retrasan la descomposición natural de la fibra."
    },
    environmentalImpact: {
      description: "El bisfenol A es un disruptor endocrino que se transfiere a mantos acuíferos si se composta.",
      source: "EPA / SEMARNAT"
    },
    examples: ["Ticket de caja OXXO", "Comprobante de cajero automático", "Factura de papelería"]
  },
  {
    id: "pluma-bic-cristal",
    name: "Bolígrafo Bic Cristal / Pluma Desgastada",
    brand: "Bic México",
    material: "Cuerpo de poliestireno rígido, tapón de polipropileno y punta de tungsteno/latón",
    category: "no_reciclables",
    categoryLabel: "Inorgánico No Reciclable",
    categoryReason: "Producto multimaterial inseparable con residuo de tinta al óleo sintética. No viable para reciclaje convencional.",
    recommendedBin: {
      color: "Gris Antracita / Negro",
      label: "Bote Negro · Basura Común / No Reciclables",
      description: "Contenedor de basura general."
    },
    handlingInstructions: [
      "Asegurarse de agotar la tinta por completo.",
      "Depositar en el bote negro del salón o pasillo."
    ],
    recommendations3R: {
      reducir: "Comprar plumas con repuesto de tinta recargable o portaminas duraderos.",
      reutilizar: "Usar tubos vacíos para proyectos de aerodinámica o maquetas en física.",
      reciclar: "Programas especializados de marcas (TerraCycle) cuando existen en campus."
    },
    degradationTime: {
      estimate: "Más de 400 años",
      isApproximate: true,
      conditionsNote: "Poliestireno cristal de alta dureza."
    },
    environmentalImpact: {
      description: "Se estima que se desechan miles de millones de bolígrafos de plástico cada año en el mundo.",
      source: "UNEP"
    },
    examples: ["Pluma Bic Cristal azul", "Marcador para pizarrón seco", "Bolígrafo de gel agotado"]
  },

  // ─── PILAS Y MANEJO ESPECIAL (PUNTO VERDE NARANJA) ───
  {
    id: "battery-alkaline",
    name: "Pila Alcalina Duracell / Energizer AA",
    brand: "Duracell / Energizer",
    material: "Zinc, Dióxido de Manganeso, Hidróxido de Potasio (Electrolito corrosivo y metales pesados)",
    category: "manejo_especial",
    categoryLabel: "Residuo de Manejo Especial / Peligroso",
    categoryReason: "Contiene sustancias químicas y metales pesados que lixivian en el suelo y contaminan mantos freáticos si se tiran en la basura común.",
    recommendedBin: {
      color: "Naranja Especial",
      label: "Contenedor Oficial — Pilas y RAEE",
      description: "Punto verde naranja del ITM para pilas, baterías y electrónicos de manejo especial."
    },
    handlingInstructions: [
      "Colocar cinta adhesiva transparente o de aislar en ambos polos (+ y -) para evitar cortocircuitos térmicos.",
      "Nunca abrir, quemar, perforar ni mojar las pilas.",
      "Depositar en el contenedor naranja de pilas o en módulos de acopio del campus."
    ],
    recommendations3R: {
      reducir: "Migrar a pilas recargables de NiMH o aparatos alimentados por cable USB.",
      reutilizar: "Comprobar el voltaje con multímetro en taller antes de descartar.",
      reciclar: "Entrega a empresas autorizadas por SEMARNAT para neutralización y confinamiento seguro."
    },
    degradationTime: {
      estimate: "Entre 500 y 1,000 años para el blindaje; los metales pesados no se degradan jamás",
      isApproximate: true,
      conditionsNote: "La carcasa metálica se corroe con el tiempo pero los metales pesados persisten eternamente como contaminantes."
    },
    environmentalImpact: {
      description: "Una sola pila alcalina puede contaminar hasta 167,000 litros de agua, equivalentes a una alberca familiar.",
      source: "SEMARNAT - Programa Nacional de Manejo de Pilas"
    },
    examples: ["Pila Duracell AA", "Pila Energizer AAA", "Pila de botón 2032 de reloj"]
  },
  {
    id: "cable-cargador-usb",
    name: "Cable USB / Cargador de Celular Roto",
    brand: "Genérico / Apple / Samsung",
    material: "Alambres de cobre estañado con cubierta termoplástica de PVC/TPE y conectores de níquel",
    category: "manejo_especial",
    categoryLabel: "Residuo de Manejo Especial / Electrónico",
    categoryReason: "Residuo de Aparato Eléctrico y Electrónico (RAEE). Contiene metales valiosos (cobre) que no deben terminar en el relleno sanitario.",
    recommendedBin: {
      color: "Naranja Especial",
      label: "Contenedor Oficial — Pilas y RAEE",
      description: "Cables y electrónicos de manejo especial: entregar en el punto verde naranja o campañas del ITM."
    },
    handlingInstructions: [
      "Enrollar el cable dañado de forma compacta.",
      "Llevar al punto verde de residuos electrónicos en el ITM durante las jornadas 'Reciclatón'."
    ],
    recommendations3R: {
      reducir: "Proteger los extremos del cable con cinta o espiral protectora para duplicar su vida útil.",
      reutilizar: "Desarmar en taller de ingeniería para aprovechar alambres de cobre en proyectos electrónicos.",
      reciclar: "Recuperación de cobre mediante reciclaje especializado de chatarra electrónica."
    },
    degradationTime: {
      estimate: "Más de 300 años para la cubierta plástica",
      isApproximate: true,
      conditionsNote: "El cobre no se biodegrada y los plásticos de PVC liberan dioxinas si se queman."
    },
    environmentalImpact: {
      description: "La quema clandestina de cables para extraer cobre contamina el aire con humos altamente tóxicos.",
      source: "Convenio de Basilea / SEMARNAT"
    },
    examples: ["Cable USB-C roto", "Cable Lightning de iPhone", "Cargador quemado"]
  }
];

export const ITM_DISPOSAL_POINTS: CampusDisposalPoint[] = [
  // ─── CAMPUS 1: PLANO GENERAL OFICIAL ITM (LOMAS DE SANTIAGUITO) ───
  {
    id: "itm-c1-quimica-b-d",
    name: "Laboratorio de Química Analítica y Aulas (B – D)",
    campus: "Campus 1 (Principal)",
    officialBuildingCode: "Edificios B / C / D",
    buildingRef: "Entre B (Lab. Química Analítica), C (Coordinación de Inglés) y D (Lab. Ing. Bioquímica)",
    zoneType: "Aulas e Ingenierías",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Orgánicos (restos de fruta)", "Botellas PET", "Latas de aluminio", "Envolturas y no reciclables"],
    notAccepted: ["Pilas", "Electrónicos", "Residuos peligrosos"],
    schedule: "Lunes a Viernes de 07:00 a 20:00 hrs",
    walkingRoute: "Andador interior entre los edificios B y D, saliendo del Estacionamiento 5. Caminar solo por andadores.",
    status: "Verificado",
    coordinates: { lat: 19.723354, lng: -101.185351 }
  },
  {
    id: "itm-c1-canchas-g-h",
    name: "Canchas Techadas y Alberca (entre G y H)",
    campus: "Campus 1 (Principal)",
    officialBuildingCode: "Canchas / Edificio H",
    buildingRef: "Junto a las canchas techadas y la alberca, frente a la Unidad Deportiva H",
    zoneType: "Deportiva",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Orgánicos (restos de fruta)", "Botellas PET", "Latas de aluminio", "Envolturas y no reciclables"],
    notAccepted: ["Pilas", "Electrónicos", "Residuos peligrosos"],
    schedule: "Lunes a Viernes de 07:00 a 20:00 hrs",
    walkingRoute: "Andador pavimentado al oriente de G, junto a las canchas techadas. Caminar solo por andadores.",
    status: "Verificado",
    coordinates: { lat: 19.722673, lng: -101.184192 }
  },
  {
    id: "itm-c1-f-g",
    name: "Laboratorios de Mecánica y Eléctrica (F – G)",
    campus: "Campus 1 (Principal)",
    officialBuildingCode: "Edificios F / G",
    buildingRef: "Entre F (Sala Audiovisual) y G (Laboratorios Ing. Mecánica e Ing. Eléctrica)",
    zoneType: "Aulas e Ingenierías",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Orgánicos (restos de fruta)", "Botellas PET", "Latas de aluminio", "Envolturas y no reciclables"],
    notAccepted: ["Pilas", "Electrónicos", "Residuos peligrosos"],
    schedule: "Lunes a Viernes de 07:00 a 20:00 hrs",
    walkingRoute: "Andador entre los edificios F y G. Caminar solo por andadores.",
    status: "Verificado",
    coordinates: { lat: 19.722555, lng: -101.184975 }
  },
  {
    id: "itm-c1-titulacion-j",
    name: "Aulas de Titulación (J) y Sala Audiovisual (F)",
    campus: "Campus 1 (Principal)",
    officialBuildingCode: "Edificios J / F",
    buildingRef: "Junto al punto de reunión de J, al oeste de F",
    zoneType: "Aulas e Ingenierías",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Orgánicos (restos de fruta)", "Botellas PET", "Latas de aluminio", "Envolturas y no reciclables"],
    notAccepted: ["Pilas", "Electrónicos", "Residuos peligrosos"],
    schedule: "Lunes a Viernes de 07:00 a 20:00 hrs",
    walkingRoute: "Andador frente al edificio J y el punto de reunión. Caminar solo por andadores.",
    status: "Verificado",
    coordinates: { lat: 19.722494, lng: -101.185627 }
  },
  {
    id: "itm-c1-administracion-l",
    name: "Aulas Lic. Administración (Edificio L)",
    campus: "Campus 1 (Principal)",
    officialBuildingCode: "Edificio L",
    buildingRef: "Patio oriente del edificio L, junto al punto de reunión",
    zoneType: "Aulas e Ingenierías",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Orgánicos (restos de fruta)", "Botellas PET", "Latas de aluminio", "Envolturas y no reciclables"],
    notAccepted: ["Pilas", "Electrónicos", "Residuos peligrosos"],
    schedule: "Lunes a Viernes de 07:00 a 20:00 hrs",
    walkingRoute: "Andador central desde el Edificio A hacia el patio del edificio L. Caminar solo por andadores.",
    status: "Verificado",
    coordinates: { lat: 19.721936, lng: -101.186425 }
  },
  {
    id: "itm-c1-canchas-k",
    name: "Canchas Centrales (junto a K)",
    campus: "Campus 1 (Principal)",
    officialBuildingCode: "Canchas / Edificio K",
    buildingRef: "Costado oriente de K, junto a las canchas centrales",
    zoneType: "Deportiva",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Orgánicos (restos de fruta)", "Botellas PET", "Latas de aluminio", "Envolturas y no reciclables"],
    notAccepted: ["Pilas", "Electrónicos", "Residuos peligrosos"],
    schedule: "Lunes a Viernes de 07:00 a 20:00 hrs",
    walkingRoute: "Andador junto al módulo de internet y las canchas centrales. Caminar solo por andadores.",
    status: "Verificado",
    coordinates: { lat: 19.721927, lng: -101.184914 }
  },
  {
    id: "itm-c1-aulas-k",
    name: "Aulas y Delegación Sindical (Edificio K)",
    campus: "Campus 1 (Principal)",
    officialBuildingCode: "Edificio K",
    buildingRef: "Extremo poniente de K, junto a O y Ñ",
    zoneType: "Aulas e Ingenierías",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Orgánicos (restos de fruta)", "Botellas PET", "Latas de aluminio", "Envolturas y no reciclables"],
    notAccepted: ["Pilas", "Electrónicos", "Residuos peligrosos"],
    schedule: "Lunes a Viernes de 07:00 a 20:00 hrs",
    walkingRoute: "Pasillo frente al edificio K. Caminar solo por andadores.",
    status: "Verificado",
    coordinates: { lat: 19.721908, lng: -101.185472 }
  },
  {
    id: "itm-c1-cafeteria-r",
    name: "Cafetería Principal (Edificio R)",
    campus: "Campus 1 (Principal)",
    officialBuildingCode: "Edificio R (Cafetería)",
    buildingRef: "Al norte de la Cafetería R, junto a P (Lab. Física) y LL",
    zoneType: "Cafetería y Alimentos",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Orgánicos (restos de fruta)", "Botellas PET", "Latas de aluminio", "Envolturas y no reciclables"],
    notAccepted: ["Pilas", "Electrónicos", "Residuos peligrosos"],
    schedule: "Lunes a Viernes de 07:00 a 20:00 hrs",
    walkingRoute: "Andador al norte de la cafetería R, desde el Centro de Cómputo (LL). Caminar solo por andadores.",
    status: "Verificado",
    coordinates: { lat: 19.721544, lng: -101.185281 }
  },
  {
    id: "itm-c1-comedor-x",
    name: "Comedor Estudiantil (Edificio X)",
    campus: "Campus 1 (Principal)",
    officialBuildingCode: "Edificio X (Comedor estudiantil)",
    buildingRef: "Al sur del comedor X, frente al Gimnasio Auditorio U",
    zoneType: "Cafetería y Alimentos",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Orgánicos (restos de fruta)", "Botellas PET", "Latas de aluminio", "Envolturas y no reciclables"],
    notAccepted: ["Pilas", "Electrónicos", "Residuos peligrosos"],
    schedule: "Lunes a Viernes de 07:00 a 20:00 hrs",
    walkingRoute: "Calzada peatonal entre el Gimnasio Auditorio (U) y el comedor X. Caminar solo por andadores.",
    status: "Verificado",
    coordinates: { lat: 19.720896, lng: -101.18517 }
  },

  // ─── CAMPUS 2: PLANO GENERAL OFICIAL ITM (SAN JOSÉ DE LA HUERTA) ───
  {
    id: "itm-c2-administrativo-a",
    name: "Edificio Administrativo y Cafetería C2 (Edificio A)",
    campus: "Campus 2 (San José de la Huerta)",
    officialBuildingCode: "Edificio A (Campus 2)",
    buildingRef: "Edificio A (Edificio Administrativo central y terraza de comensales)",
    zoneType: "Cafetería y Alimentos",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Restos de alimentos", "Latas de refresco", "Envases PET", "Servilletas usadas"],
    notAccepted: ["Pilas", "Electrónicos", "Químicos"],
    schedule: "Lunes a Viernes de 07:00 a 19:00 hrs",
    walkingRoute: "Andador central adoquinado que desciende desde el estacionamiento hacia el edificio semicircular administrativo.",
    status: "Verificado",
    coordinates: { lat: 19.644721, lng: -101.225224 }
  },
  {
    id: "itm-c2-plaza-poniente",
    name: "Plaza Cívica Poniente (Edificios B y C)",
    campus: "Campus 2 (San José de la Huerta)",
    officialBuildingCode: "Plaza Cívica Poniente (Edif. B y C)",
    buildingRef: "Edificio B (Salones y cubículos) y C (Centro de cómputo educación a distancia)",
    zoneType: "Pony Plaza / Explanada",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul", "bin-pilas"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables", "manejo_especial"],
    acceptedMaterials: ["Orgánicos de fruta", "Papel de cómputo seco", "Botellas PET", "Pilas gastadas (aisladas)"],
    notAccepted: ["Baterías automotrices", "Aceites de taller"],
    schedule: "Lunes a Viernes de 07:00 a 19:30 hrs",
    walkingRoute: "Plaza circular adoquinada poniente rodeada por los arcos de los edificios B y C.",
    status: "Verificado",
    coordinates: { lat: 19.644336, lng: -101.225712 }
  },
  {
    id: "itm-c2-plaza-oriente",
    name: "Plaza Cívica Oriente (Edificios E y D)",
    campus: "Campus 2 (San José de la Huerta)",
    officialBuildingCode: "Plaza Cívica Oriente (Edif. E y D)",
    buildingRef: "Edificio E (Salones Ingeniería) y D (Contaduría)",
    zoneType: "Pony Plaza / Explanada",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Botellas PET", "Latas de bebidas", "Hojas de apuntes", "Envolturas"],
    notAccepted: ["Químicos", "Vidrio roto"],
    schedule: "Lunes a Viernes de 07:00 a 19:30 hrs",
    walkingRoute: "Plaza circular adoquinada oriente rodeada por los arcos de los edificios E y D.",
    status: "Verificado",
    coordinates: { lat: 19.644336, lng: -101.224741 }
  },
  {
    id: "itm-c2-canchas-ptar",
    name: "Área Deportiva y P.T.A.R. Campus 2",
    campus: "Campus 2 (San José de la Huerta)",
    officialBuildingCode: "Canchas / PTAR (C2)",
    buildingRef: "Canchas de Usos Múltiples y Planta de Tratamiento de Aguas Residuales",
    zoneType: "Deportiva",
    installedBins: ["bin-verde", "bin-amarillo", "bin-negro", "bin-azul"],
    acceptedCategories: ["organicos", "reciclables", "no_reciclables"],
    acceptedMaterials: ["Botellas deportivas de agua/sueros", "Latas de bebidas", "Cáscaras de fruta", "Envolturas"],
    notAccepted: ["Lodos residuales", "Pilas"],
    schedule: "Lunes a Viernes de 07:00 a 18:30 hrs",
    walkingRoute: "Andador poniente que comunica los salones con la cancha deportiva y áreas verdes.",
    status: "Verificado",
    coordinates: { lat: 19.645077, lng: -101.225633 }
  },
  {
    id: "itm-c2-acceso-arboleda",
    name: "Acceso Principal y Estacionamiento (Camino de la Arboleda)",
    campus: "Campus 2 (San José de la Huerta)",
    officialBuildingCode: "Acceso y Estacionamiento C2",
    buildingRef: "Pórtico de Acceso Peatonal y Vehicular, Bahía de Descenso sobre Camino de la Arboleda",
    zoneType: "Acceso",
    installedBins: ["bin-azul", "bin-amarillo", "bin-negro"],
    acceptedCategories: ["reciclables", "no_reciclables"],
    acceptedMaterials: ["Botellas PET de viaje", "Latas de aluminio", "Envolturas de golosinas"],
    notAccepted: ["Escombros", "Residuos peligrosos"],
    schedule: "Lunes a Viernes de 06:30 a 20:00 hrs",
    walkingRoute: "Banqueta principal exterior contigua a la bahía de descenso y parada del transporte público sobre Camino de la Arboleda S/N.",
    status: "Verificado",
    coordinates: { lat: 19.646065, lng: -101.224086 }
  }
];

export const SUSTAINABLE_DIMENSIONS = [
  {
    id: "ambiental",
    title: "Dimensión Ambiental",
    subtitle: "Prevención, reducción del impacto y conservación",
    description: "Evitar la contaminación de mantos freáticos y suelos en Morelia reduciendo el volumen de residuos que llegan al relleno sanitario municipal. Clasificar en origen evita la mezcla contaminante que arruina materiales potencialmente reciclables.",
    indicators: [
      "Separación correcta de plásticos y metales para reinserción industrial",
      "Confinamiento seguro de sustancias peligrosas como metales pesados en pilas",
      "Reducción de lixiviados y emisiones de metano por compostaje de orgánicos"
    ],
    verifiedSource: "SEMARNAT - Estrategia Nacional para la Gestión Integral de Residuos"
  },
  {
    id: "social",
    title: "Dimensión Social",
    subtitle: "Educación comunitaria y dignificación del trabajo",
    description: "Cultura ambiental activa dentro de la comunidad de estudiantes, docentes y personal de apoyo del IT Morelia. La separación limpia en origen previene accidentes y dignifica las condiciones de los trabajadores de intendencia y recolectores urbanos.",
    indicators: [
      "Capacitación accesible: de dudas cotidianas a hábitos responsables",
      "Protección a brigadas de limpieza reduciendo riesgos biológicos y punzocortantes",
      "Participación estudiantil transversal en proyectos de desarrollo sustentable"
    ],
    verifiedSource: "UNESCO - Educación para el Desarrollo Sostenible (EDS)"
  },
  {
    id: "economica",
    title: "Dimensión Económica",
    subtitle: "Eficiencia de recursos y circularidad de materiales",
    description: "Aprovechamiento del valor remanente de materiales reciclables (aluminio, PET, cartón). La correcta clasificación disminuye los costos municipales de traslado y disposición final de basura, abriendo oportunidades para reinvertir en proyectos verdes del campus.",
    indicators: [
      "Disminución de costos por gestión de residuos mezclados en campus",
      "Retorno de valor en campañas de recolección de aluminio y cartón",
      "Cuidado de la infraestructura sanitaria y pluvial al evitar taponamientos"
    ],
    verifiedSource: "INEGI - Indicadores de Bienestar y Economía Circular"
  }
];

export const ODS_ALIGNMENT = [
  {
    code: "ODS 12",
    name: "Producción y Consumo Responsables",
    badge: "Meta Central del Proyecto",
    whyItMatters: "Es el núcleo directo de ReCiclo. La meta 12.5 exige 'reducir considerablemente la generación de desechos mediante actividades de prevención, reducción, reciclado y reutilización'.",
    howWeContribute: "La herramienta transforma la intención en acción concreta: enseña a la persona a no comprar innecesariamente (reducir), preparar el envase (reutilizar) y canalizarlo al contenedor exacto (reciclar)."
  },
  {
    code: "ODS 4",
    name: "Educación de Calidad",
    badge: "Meta Transversal 4.7",
    whyItMatters: "Asegura que los estudiantes adquieran conocimientos teóricos y prácticos para promover el desarrollo sostenible y estilos de vida en armonía con la naturaleza.",
    howWeContribute: "ReCiclo no es un videojuego ni una app comercial; funciona como un auxiliar didáctico de bolsillo para materias de Desarrollo Sustentable e inducción ambiental en el IT Morelia."
  },
  {
    code: "ODS 11",
    name: "Ciudades y Comunidades Sostenibles",
    badge: "Meta 11.6",
    whyItMatters: "Busca reducir el impacto ambiental negativo per cápita de las ciudades, prestando especial atención a la gestión de los desechos municipales.",
    howWeContribute: "Al implementarse en el Instituto Tecnológico de Morelia y proyectarse hacia Morelia y Michoacán, alivia la carga de saturación de los sitios de disposición final regionales."
  }
];