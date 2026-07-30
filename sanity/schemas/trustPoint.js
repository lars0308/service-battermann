// Vorbereitung für Sanity Studio — noch nicht mit einem Sanity-Projekt verbunden.
export default {
  name: "trustPoint",
  title: "Vorteil (unter dem Hero)",
  type: "document",
  fields: [
    { name: "order", title: "Reihenfolge", type: "number" },
    { name: "text", title: "Text", type: "string", validation: (Rule) => Rule.max(140) }
  ]
};
