// Vorbereitung für Sanity Studio — noch nicht mit einem Sanity-Projekt verbunden.
export default {
  name: "contactInfo",
  title: "Kontaktdaten",
  type: "document",
  fields: [
    { name: "phone", title: "Telefon (Anzeige)", type: "string", initialValue: "+49 155 / 674 677 63" },
    { name: "phoneHref", title: "Telefon (tel:-Link)", type: "string", initialValue: "+4915567467763" },
    { name: "whatsapp", title: "WhatsApp-Link", type: "url", initialValue: "https://wa.me/4915567467763" },
    { name: "email", title: "E-Mail", type: "string", initialValue: "service.battermann@gmx.de" },
    { name: "openingHours", title: "Erreichbarkeit", type: "string", initialValue: "Mo–Sa, 09:00–20:00 Uhr" }
  ]
};
