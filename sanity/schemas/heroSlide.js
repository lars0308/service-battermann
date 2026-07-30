// Vorbereitung für Sanity Studio — noch nicht mit einem Sanity-Projekt verbunden.
// Siehe sanity/README.md für den Migrationsplan.
export default {
  name: "heroSlide",
  title: "Hero-Slide (Startseite)",
  type: "document",
  fields: [
    { name: "order", title: "Reihenfolge", type: "number" },
    { name: "image", title: "Hintergrundbild", type: "image", options: { hotspot: true } },
    { name: "prefix", title: "Textzeile 1 (fix)", type: "string", initialValue: "Lars Battermann:" },
    {
      name: "verb",
      title: "Textzeile 2 (Verb/Aussage)",
      type: "string",
      description: "Z. B. „Pflegt Objekte“. Beim ersten Slide: Feld roundTexts nutzen statt eines festen Werts."
    },
    {
      name: "roundTexts",
      title: "Rotierende Texte (nur erster Slide)",
      type: "array",
      of: [{ type: "string" }],
      description: "3 Varianten, die abwechselnd bei jedem vollen Zyklus des Sliders erscheinen."
    },
    { name: "dotLabel", title: "Aria-Label für den Auswahlpunkt", type: "string" }
  ]
};
