// Vorbereitung für Sanity Studio — noch nicht mit einem Sanity-Projekt verbunden.
export default {
  name: "service",
  title: "Leistungsbereich",
  type: "document",
  fields: [
    { name: "order", title: "Reihenfolge (01–05)", type: "number" },
    {
      name: "anchorId",
      title: "Anker-ID",
      type: "slug",
      description: "Muss mit der Sprungmarke übereinstimmen, auf die die Startseiten-Karte verlinkt (z. B. „leistung-garten“ für #leistung-garten)."
    },
    { name: "verb", title: "Verb (z. B. „Pflegt“)", type: "string" },
    { name: "title", title: "Titel", type: "string" },
    {
      name: "requiresLegalNote",
      title: "Sternchen-Hinweis nötig?",
      type: "boolean",
      description: "Aktiviert das dezente * hinter dem Titel (Elektro- & Sanitärarbeiten im gesetzlich zulässigen Rahmen)."
    },
    { name: "description", title: "Kurzbeschreibung", type: "text" },
    {
      name: "cardImage",
      title: "Kartenbild (Startseite)",
      type: "image",
      options: { hotspot: true },
      description: "Einzelnes Bild für die Bild-Karte auf der Startseite (dunkles Overlay wird per CSS gelegt)."
    },
    {
      name: "gallery",
      title: "Echte Projektbilder (Detailseite)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }]
    },
    { name: "ctaLabel", title: "CTA-Text (optional)", type: "string" },
    { name: "ctaUrl", title: "CTA-Link (optional)", type: "url" }
  ]
};
