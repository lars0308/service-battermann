// Kuratierte Sektions-Design-Overrides (sectionDesign/layoutVariante aus
// Sanity): ordnet jeder Sektion aller 7 Seiten ihr [data-design-section]-
// Markerelement zu und übersetzt die kuratierten Enum-Werte über feste
// Lookup-Tabellen in bestehende/neue CSS-Klassen. Kein gepflegter Wert
// ("standard"/fehlt) -> keine Klasse -> Erscheinungsbild bleibt exakt wie
// heute (gleiches Zero-Diff-Prinzip wie überall sonst in diesem Projekt).
(function () {
  "use strict";

  var SECTIONS = [
    {key: "pageHome.hero", doc: "pageHome", designField: "heroDesign"},
    {
      key: "pageHome.werHierAnpackt",
      doc: "pageHome",
      designField: "werHierAnpacktDesign",
      layoutField: "werHierAnpacktLayout",
      layoutTarget: ".about-layout",
      layoutMap: {"bild-rechts": "layout-flip"},
    },
    {key: "pageHome.leistungenExtra", doc: "pageHome", designField: "leistungenExtraDesign"},
    {key: "pageHome.mapBlock", doc: "pageHome", designField: "mapBlockDesign"},
    {key: "pageHome.formBlock", doc: "pageHome", designField: "formBlockDesign"},
    {key: "pageHome.bewertungen", doc: "pageHome", designField: "bewertungenDesign"},
    {key: "pageHome.gebietTeaser", doc: "pageHome", designField: "gebietTeaserDesign"},
    {key: "pageUeberMich.hero", doc: "pageUeberMich", designField: "heroDesign"},
    {
      key: "pageUeberMich.anfang",
      doc: "pageUeberMich",
      designField: "anfangDesign",
      layoutField: "anfangLayout",
      layoutTarget: ".split",
      layoutMap: {"bild-rechts": "reverse"},
    },
    {key: "pageUeberMich.arbeitsweise", doc: "pageUeberMich", designField: "arbeitsweiseDesign"},
    {key: "pageUeberMich.kunden", doc: "pageUeberMich", designField: "kundenDesign"},
    {key: "pageUeberMich.ctaBand", doc: "pageUeberMich", designField: "ctaBandDesign"},
    {key: "pageLeistungen.hero", doc: "pageLeistungen", designField: "heroDesign"},
    {key: "pageLeistungen.ctaBand", doc: "pageLeistungen", designField: "ctaBandDesign"},
    {key: "pageKontakt.hero", doc: "pageKontakt", designField: "heroDesign"},
    {key: "pageKontakt.direkterDraht", doc: "pageKontakt", designField: "direkterDrahtDesign"},
    {key: "pageEinsatzgebiet.hero", doc: "pageEinsatzgebiet", designField: "heroDesign"},
    {key: "pageEinsatzgebiet.faq", doc: "pageEinsatzgebiet", designField: "faqDesign"},
    {key: "pageEinsatzgebiet.ctaBand", doc: "pageEinsatzgebiet", designField: "ctaBandDesign"},
    {key: "pageImpressum", doc: "pageImpressum", designField: "design"},
    {key: "pageDatenschutz", doc: "pageDatenschutz", designField: "design"},
  ];

  var SIZE_CLASS = {klein: "dsize-klein", gross: "dsize-gross", "sehr-gross": "dsize-sehr-gross"};
  var COLOR_CLASS = {gold: "daccent-gold", gruen: "daccent-gruen"};
  var GLASS_CLASS = {kein: "dglas-kein", leicht: "dglas-leicht", stark: "dglas-stark"};
  var FADE_CLASS = {schnell: "dfade-schnell", sanft: "dfade-sanft", aus: "dfade-aus"};

  function applyDesign(el, design) {
    if (!el || !design) return;
    if (design.textGroesse && SIZE_CLASS[design.textGroesse]) el.classList.add(SIZE_CLASS[design.textGroesse]);
    if (design.farbe && COLOR_CLASS[design.farbe]) el.classList.add(COLOR_CLASS[design.farbe]);
    if (design.glas && GLASS_CLASS[design.glas]) el.classList.add(GLASS_CLASS[design.glas]);
    if (design.fadeTiming && FADE_CLASS[design.fadeTiming]) el.classList.add(FADE_CLASS[design.fadeTiming]);
  }

  function applyLayout(el, section, value) {
    if (!el || !value || !section.layoutMap || !section.layoutMap[value]) return;
    var target = section.layoutTarget ? el.querySelector(section.layoutTarget) : el;
    if (target) target.classList.add(section.layoutMap[value]);
  }

  window.__applySectionDesign = function (data) {
    SECTIONS.forEach(function (section) {
      var doc = data[section.doc];
      if (!doc) return;
      var el = document.querySelector('[data-design-section="' + section.key + '"]');
      if (!el) return;
      applyDesign(el, doc[section.designField]);
      if (section.layoutField) applyLayout(el, section, doc[section.layoutField]);
    });
  };
})();
