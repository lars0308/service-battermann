// Vorbereitung für Sanity Studio — 1:1-Abbildung der bestehenden content/vorher-nachher.json,
// die aktuell über das Sveltia-CMS (admin/config.yml) gepflegt wird.
export default {
  name: "vorherNachherProjekt",
  title: "Vorher/Nachher-Projekt",
  type: "document",
  fields: [
    { name: "titel", title: "Titel", type: "string" },
    { name: "beschreibung", title: "Beschreibung", type: "text" },
    {
      name: "kategorie",
      title: "Leistungsbereich",
      type: "string",
      options: {
        list: [
          { title: "Hausmeisterservice", value: "hausmeister" },
          { title: "Montage", value: "montage" },
          { title: "Garten", value: "garten" },
          { title: "Bad & Sanitär", value: "bad" },
          { title: "Elektro", value: "elektro" }
        ]
      }
    },
    { name: "vorherBild", title: "Bild vorher", type: "image", options: { hotspot: true } },
    { name: "vorherAlt", title: "Alt-Text vorher", type: "string" },
    { name: "nachherBild", title: "Bild nachher", type: "image", options: { hotspot: true } },
    { name: "nachherAlt", title: "Alt-Text nachher", type: "string" }
  ]
};
