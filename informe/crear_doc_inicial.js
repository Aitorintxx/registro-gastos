const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, WidthType,
  Table, TableRow, TableCell, ShadingType
} = require("docx");
const fs = require("fs");
const path = require("path");

const AZUL = "0098CD";
const AZUL_CLARO = "E6F4F9";

function apartado(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 28, color: "1E293B" })],
    spacing: { before: 400, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" } },
  });
}

function parrafo(text, opciones = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, ...opciones })],
    spacing: { after: 160, line: 300, lineRule: "auto" },
  });
}

function vieta(text, negrita = false) {
  return new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 22, bold: negrita })],
    spacing: { after: 100 },
  });
}

function subvieta(text) {
  return new Paragraph({
    bullet: { level: 1 },
    children: [new TextRun({ text, size: 22 })],
    spacing: { after: 80 },
  });
}

function espacio() {
  return new Paragraph({ spacing: { after: 200 } });
}

function filaTablaPrioridad(req, prioridad, color) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 5500, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: req, size: 20 })] })],
      }),
      new TableCell({
        width: { size: 2000, type: WidthType.DXA },
        shading: { fill: color, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: prioridad, size: 20, bold: true })],
        })],
      }),
    ],
  });
}

const doc = new Document({
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1418, right: 1843, bottom: 1418, left: 1843 },
      },
    },
    children: [

      // CABECERA
      new Paragraph({
        children: [new TextRun({ text: "Documento de Definición del Proyecto", size: 28, color: "64748B" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Registro de Gastos Personales", size: 48, bold: true, color: "1E293B" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Actividad 1 — Desarrollo de aplicaciones con asistentes de programación basados en IA", size: 22, color: "64748B" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Aitor Intxauste Múgica  ·  Junio 2026", size: 22, color: "64748B" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: AZUL } },
        spacing: { after: 400 },
        children: [],
      }),

      // 1. DESCRIPCIÓN
      apartado("1. Descripción funcional de la aplicación"),
      parrafo("La aplicación a desarrollar es un gestor de gastos personales accesible desde el navegador. El objetivo principal es ofrecer una herramienta sencilla que permita al usuario registrar sus gastos del día a día, consultarlos con filtros, y obtener un resumen visual de en qué categorías está gastando más dinero."),
      parrafo("La motivación detrás de esta elección es que se trata de una aplicación con una utilidad real y cotidiana, con un alcance técnico bien definido (operaciones CRUD sobre una entidad principal), y que permite demostrar tanto el desarrollo del backend como del frontend de forma equilibrada."),
      parrafo("El usuario final de la aplicación es cualquier persona que quiera llevar un control básico de sus finanzas personales sin depender de servicios externos ni aplicaciones de terceros. Los datos se almacenan en local, en el propio equipo."),

      espacio(),

      // 2. REQUISITOS MÍNIMOS
      apartado("2. Requisitos mínimos"),
      parrafo("Se consideran requisitos mínimos aquellas funcionalidades sin las cuales la aplicación no cumple su propósito básico:"),
      espacio(),
      vieta("Registro de gastos", true),
      subvieta("El usuario puede añadir un gasto introduciendo: importe (€), categoría, descripción opcional y fecha."),
      subvieta("Los datos se guardan de forma persistente en una base de datos local."),
      espacio(),
      vieta("Consulta y gestión de gastos", true),
      subvieta("El usuario puede ver todos los gastos registrados en formato de tabla."),
      subvieta("Puede editar cualquier gasto existente directamente desde la tabla."),
      subvieta("Puede eliminar gastos con confirmación previa."),
      espacio(),
      vieta("Filtrado", true),
      subvieta("Filtrar gastos por categoría."),
      subvieta("Filtrar por rango de fechas (fecha inicio y fecha fin)."),
      subvieta("Posibilidad de combinar ambos filtros o limpiarlos."),
      espacio(),
      vieta("Resumen por categoría", true),
      subvieta("Vista con el total gastado en cada categoría."),
      subvieta("Total general de todos los gastos."),

      espacio(),

      // 3. FUNCIONALIDADES ADICIONALES
      apartado("3. Funcionalidades adicionales"),
      parrafo("Además de los requisitos mínimos, se plantean las siguientes funcionalidades que enriquecen la experiencia de uso:"),
      vieta("Gráfico de tarta interactivo que muestre el porcentaje de gasto por categoría, generado con Chart.js."),
      vieta("Exportación de todos los gastos a un archivo CSV descargable, para su uso en hojas de cálculo."),
      vieta("Categorías predefinidas disponibles desde el inicio (Alimentación, Transporte, Ocio, Salud, Hogar, Educación, Otros), más las que el usuario vaya creando."),

      espacio(),

      // 4. STACK TECNOLÓGICO
      apartado("4. Stack tecnológico"),
      parrafo("Se ha definido el siguiente stack antes de iniciar el desarrollo, con el objetivo de transmitírselo al asistente de IA desde el primer prompt:"),
      espacio(),
      new Table({
        width: { size: 7500, type: WidthType.DXA },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: AZUL, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Capa", bold: true, color: "FFFFFF", size: 20 })] })],
              }),
              new TableCell({
                width: { size: 5000, type: WidthType.DXA },
                shading: { fill: AZUL, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Tecnología", bold: true, color: "FFFFFF", size: 20 })] })],
              }),
            ],
          }),
          ...[
            ["Backend", "Python 3 + Flask + SQLite"],
            ["Frontend", "React 18 + Vite"],
            ["Gráficos", "Chart.js + react-chartjs-2"],
            ["Estilos", "CSS propio (sin frameworks externos)"],
            ["Control de versiones", "Git + GitHub (repositorio público)"],
            ["Tests (Act. 2)", "Pytest + pytest-flask"],
          ].map(([capa, tech], i) => new TableRow({
            children: [
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: i % 2 === 0 ? AZUL_CLARO : "FFFFFF", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: capa, bold: true, size: 20 })] })],
              }),
              new TableCell({
                width: { size: 5000, type: WidthType.DXA },
                shading: { fill: i % 2 === 0 ? AZUL_CLARO : "FFFFFF", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: tech, size: 20 })] })],
              }),
            ],
          })),
        ],
      }),

      espacio(),

      // 5. TABLA PRIORIDADES
      apartado("5. Priorización de requisitos"),
      parrafo("Para organizar el trabajo con el asistente de IA, se priorizaron los requisitos de la siguiente manera:"),
      espacio(),
      new Table({
        width: { size: 7500, type: WidthType.DXA },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 5500, type: WidthType.DXA },
                shading: { fill: AZUL, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Requisito", bold: true, color: "FFFFFF", size: 20 })] })],
              }),
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                shading: { fill: AZUL, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Prioridad", bold: true, color: "FFFFFF", size: 20 })] })],
              }),
            ],
          }),
          filaTablaPrioridad("CRUD de gastos (crear, editar, eliminar)", "Alta", "D1FAE5"),
          filaTablaPrioridad("Persistencia en base de datos local", "Alta", "D1FAE5"),
          filaTablaPrioridad("Filtrado por categoría y fecha", "Alta", "D1FAE5"),
          filaTablaPrioridad("Resumen de totales por categoría", "Media", "FEF9C3"),
          filaTablaPrioridad("Gráfico de tarta interactivo", "Media", "FEF9C3"),
          filaTablaPrioridad("Exportación a CSV", "Baja", "FEE2E2"),
        ],
      }),

      espacio(),

      // 6. RESTRICCIONES
      apartado("6. Restricciones del desarrollo"),
      parrafo("De acuerdo con las pautas de la actividad, se establecen las siguientes restricciones que deben respetarse durante todo el proceso:"),
      vieta("Todo el código debe ser generado mediante interacción con el asistente de IA (ChatGPT con GPT-5.5)."),
      vieta("No se permite escribir código manualmente. Cualquier modificación debe ser solicitada al asistente."),
      vieta("El alumno es responsable de guiar, especificar y verificar las respuestas del asistente."),
      vieta("Se documentarán las conversaciones más relevantes con el asistente en el informe técnico final."),

    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  const outPath = path.join(__dirname, "Documento_Inicial_RegistroGastos.docx");
  fs.writeFileSync(outPath, buffer);
  console.log("Documento inicial creado:", outPath);
});
