// Vorbereitung für Sanity Studio — noch nicht mit einem Sanity-Projekt verbunden.
export default {
  name: "siteSettings",
  title: "Website-Einstellungen",
  type: "document",
  fields: [
    { name: "companyName", title: "Firmenname", type: "string" },
    { name: "ownerName", title: "Inhaber", type: "string" },
    { name: "logoIcon", title: "Logo (Icon)", type: "image" },
    { name: "logoFull", title: "Logo (vollständig)", type: "image" },
    { name: "serviceAreaTowns", title: "Einsatzgebiet (Orte)", type: "array", of: [{ type: "string" }] },
    { name: "serviceAreaRadiusKm", title: "Einsatzradius (km)", type: "number" },
    {
      name: "legalNotice",
      title: "Rechtlicher Footer-Hinweis",
      type: "string",
      initialValue: "Ausführung ausschließlich im gesetzlich zulässigen Rahmen für meisterfreie Instandsetzungsarbeiten."
    }
  ]
};
