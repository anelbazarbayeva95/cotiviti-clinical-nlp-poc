const pptxgen = require("pptxgenjs");
const path = require("path");

const ICONS = path.join(__dirname, "icons");
const ASSETS = path.join(__dirname, "assets");

const PRIMARY = "241E4E"; // deep indigo
const SECONDARY_BG = "F4F2FB"; // very light lavender
const ACCENT = "C13584"; // magenta
const TEXT_DARK = "2A2540";
const TEXT_MUTED = "6B6580";
const WHITE = "FFFFFF";
const GOOD = "1B7A5A";
const GOOD_BG = "E4F3EC";
const THREAT_BG = "FBEAF2";

const FONT_HEAD = "Cambria";
const FONT_BODY = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5 in

function darkSlide() {
  const s = pres.addSlide();
  s.background = { color: PRIMARY };
  return s;
}

function lightSlide() {
  const s = pres.addSlide();
  s.background = { color: SECONDARY_BG };
  return s;
}

function footer(s, n) {
  s.addText(`Cotiviti Intern Assessment  |  Anel Bazarbayeva  |  ${n}`, {
    x: 0.5, y: 7.12, w: 12.3, h: 0.3, fontFace: FONT_BODY, fontSize: 9, color: TEXT_MUTED, align: "right",
  });
}

function iconCircle(s, iconName, x, y, diameter, circleColor) {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: diameter, h: diameter, fill: { color: circleColor }, line: { type: "none" } });
  const pad = diameter * 0.28;
  s.addImage({ path: path.join(ICONS, `${iconName}.png`), x: x + pad / 2, y: y + pad / 2, w: diameter - pad, h: diameter - pad });
}

// ---------- Slide 1: Title ----------
{
  const s = darkSlide();
  iconCircle(s, "llm", 11.3, 0.7, 1.5, "382F6E");
  s.addText("Clinical Natural Language\nTechnology for Health Care", {
    x: 0.8, y: 1.9, w: 11.5, h: 2.05, fontFace: FONT_HEAD, fontSize: 36, bold: true, color: WHITE, align: "left", lineSpacingMultiple: 1.08,
  });
  s.addText("Past, Present, and Future Approaches — NLP, OCR, Computer Vision, LLM, LMM", {
    x: 0.8, y: 4.05, w: 11.3, h: 0.6, fontFace: FONT_BODY, fontSize: 18, italic: true, color: "CADCFC",
  });
  s.addText("Anel Bazarbayeva", { x: 0.8, y: 6.1, w: 8, h: 0.4, fontFace: FONT_BODY, fontSize: 16, bold: true, color: WHITE });
  s.addText("Cotiviti Intern Assessment — Generative AI Research Engineer  |  August 2026", {
    x: 0.8, y: 6.5, w: 10, h: 0.4, fontFace: FONT_BODY, fontSize: 13, color: "CADCFC",
  });
}

// ---------- Slide 2: The Concept ----------
{
  const s = lightSlide();
  s.addText("What Is Clinical NLP?", { x: 0.6, y: 0.5, w: 12, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: PRIMARY });
  s.addText(
    "The set of methods that turn unstructured health care information — clinician notes, faxed records, " +
    "scanned forms, imaging reports — into a form software can act on. Cotiviti's payment-integrity work " +
    "depends directly on reading exactly this kind of material.",
    { x: 0.6, y: 1.35, w: 12.1, h: 1.0, fontFace: FONT_BODY, fontSize: 15, color: TEXT_DARK, lineSpacingMultiple: 1.15 }
  );

  const items = [
    { icon: "nlp", label: "NLP", desc: "Parsing free text" },
    { icon: "ocr", label: "OCR", desc: "Digitizing scans" },
    { icon: "cv", label: "Computer\nVision", desc: "Reading images" },
    { icon: "llm", label: "LLM", desc: "Extraction & summary" },
    { icon: "lmm", label: "LMM", desc: "Multimodal reasoning" },
  ];
  const startX = 0.9, gap = 2.42, circleD = 1.3;
  items.forEach((item, i) => {
    const x = startX + i * gap;
    iconCircle(s, item.icon, x, 2.85, circleD, i % 2 === 0 ? PRIMARY : ACCENT);
    s.addText(item.label, { x: x - 0.35, y: 4.25, w: circleD + 0.7, h: 0.55, fontFace: FONT_BODY, bold: true, fontSize: 14, color: TEXT_DARK, align: "center" });
    s.addText(item.desc, { x: x - 0.35, y: 4.78, w: circleD + 0.7, h: 0.5, fontFace: FONT_BODY, fontSize: 10.5, color: TEXT_MUTED, align: "center" });
  });

  s.addText(
    "For a healthcare informatics company processing high volumes of TPO content, the maturity of these " +
    "technologies determines how much can be structured and acted on without manual review.",
    { x: 0.9, y: 5.85, w: 11.3, h: 0.9, fontFace: FONT_BODY, fontSize: 13, italic: true, color: TEXT_MUTED, lineSpacingMultiple: 1.15 }
  );
  footer(s, 2);
}

// ---------- Slide 3: Trends timeline ----------
{
  const s = lightSlide();
  s.addText("Trends: Past, Present, and Future", { x: 0.6, y: 0.5, w: 12, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: PRIMARY });

  const cols = [
    {
      icon: "doc", title: "Past", color: "594E8A",
      bullets: [
        "Rule-based pattern matching & curated dictionaries",
        "Statistical models (CRFs) — one hand-built pipeline per use case",
        "OCR on scanned/handwritten forms was separate & brittle (Rasmussen et al., 2012)",
      ],
    },
    {
      icon: "llm", title: "Present", color: PRIMARY,
      bullets: [
        "Domain-pretrained models: BioBERT, ClinicalBERT",
        "General LLMs pass medical licensing benchmarks (Singhal et al., 2023)",
        "One LLM call + structured schema replaces a custom pipeline — this POC's approach",
      ],
    },
    {
      icon: "lmm", title: "Future", color: ACCENT,
      bullets: [
        "Multimodal models (Med-PaLM M) reason over text + imaging + genomics jointly",
        "One review pipeline instead of parallel OCR / NLP / CV systems",
      ],
    },
  ];

  const colW = 3.95, gap = 0.25, startX = 0.6;
  cols.forEach((col, i) => {
    const x = startX + i * (colW + gap);
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.45, w: colW, h: 5.3, rectRadius: 0.12, fill: { color: WHITE }, line: { color: "E3DFF2", width: 1 }, shadow: { type: "outer", color: "000000", opacity: 0.12, blur: 6, offset: 2, angle: 90 } });
    iconCircle(s, col.icon, x + 0.35, 1.8, 0.9, col.color);
    s.addText(col.title, { x: x + 1.45, y: 1.85, w: colW - 1.6, h: 0.8, fontFace: FONT_HEAD, bold: true, fontSize: 20, color: col.color, valign: "middle" });
    s.addText(
      col.bullets.map((b, bi) => ({ text: b, options: { bullet: { code: "25CF", indent: 14 }, breakLine: bi < col.bullets.length - 1, paraSpaceAfter: 10 } })),
      { x: x + 0.35, y: 2.95, w: colW - 0.7, h: 3.6, fontFace: FONT_BODY, fontSize: 12.5, color: TEXT_DARK, lineSpacingMultiple: 1.15 }
    );
  });
  footer(s, 3);
}

// ---------- Slide 4: Opportunities & Threats ----------
{
  const s = lightSlide();
  s.addText("Opportunities and Threats", { x: 0.6, y: 0.5, w: 12, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: PRIMARY });

  const half = 5.85, gapX = 0.6, startX = 0.6, top = 1.5, h = 5.3;
  // Opportunities
  s.addShape(pres.ShapeType.roundRect, { x: startX, y: top, w: half, h, rectRadius: 0.12, fill: { color: GOOD_BG }, line: { type: "none" } });
  iconCircle(s, "opportunity", startX + 0.4, top + 0.4, 0.85, GOOD);
  s.addText("Opportunities", { x: startX + 1.4, y: top + 0.42, w: half - 1.6, h: 0.7, fontFace: FONT_HEAD, bold: true, fontSize: 20, color: GOOD, valign: "middle" });
  s.addText(
    [
      { text: "Far more resilient to noisy OCR text than rule-based pipelines", options: { bullet: { code: "25CF" }, breakLine: true, paraSpaceAfter: 12 } },
      { text: "No bespoke NER model to train per document type", options: { bullet: { code: "25CF" }, breakLine: true, paraSpaceAfter: 12 } },
      { text: "Reduces manual abstraction burden on TPO reviewers", options: { bullet: { code: "25CF" }, breakLine: true, paraSpaceAfter: 12 } },
      { text: "Measurable time savings already seen in ambient scribes (Aguilar, 2026)", options: { bullet: { code: "25CF" } } },
    ],
    { x: startX + 0.4, y: top + 1.5, w: half - 0.8, h: 3.6, fontFace: FONT_BODY, fontSize: 13.5, color: TEXT_DARK, lineSpacingMultiple: 1.2 }
  );

  const x2 = startX + half + gapX;
  s.addShape(pres.ShapeType.roundRect, { x: x2, y: top, w: half, h, rectRadius: 0.12, fill: { color: THREAT_BG }, line: { type: "none" } });
  iconCircle(s, "threat", x2 + 0.4, top + 0.4, 0.85, ACCENT);
  s.addText("Threats", { x: x2 + 1.4, y: top + 0.42, w: half - 1.6, h: 0.7, fontFace: FONT_HEAD, bold: true, fontSize: 20, color: ACCENT, valign: "middle" });
  s.addText(
    [
      { text: "Hallucination: fabricated details repeated in 50–83% of test cases (Omar et al., 2025)", options: { bullet: { code: "25CF" }, breakLine: true, paraSpaceAfter: 12 } },
      { text: "Growing regulatory exposure: FDA AI/ML SaMD plan, HHS ePHI rules", options: { bullet: { code: "25CF" }, breakLine: true, paraSpaceAfter: 12 } },
      { text: "Bias risk when models train on cost/utilization proxies (Obermeyer et al., 2019)", options: { bullet: { code: "25CF" } } },
    ],
    { x: x2 + 0.4, y: top + 1.5, w: half - 0.8, h: 3.6, fontFace: FONT_BODY, fontSize: 13.5, color: TEXT_DARK, lineSpacingMultiple: 1.2 }
  );
  footer(s, 4);
}

// ---------- Slide 5: Recommended Options ----------
{
  const s = lightSlide();
  s.addText("Recommended Options for Cotiviti", { x: 0.6, y: 0.5, w: 12, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: PRIMARY });

  const rows = [
    { icon: "pilot", title: "1. Pilot a governed extraction service", desc: "Apply the OCR-plus-LLM pattern in this POC to a real, high-volume input Cotiviti already receives, scoped narrowly with a human reviewer in the loop." },
    { icon: "shield", title: "2. Build the AI governance layer first", desc: "Hallucination spot-checks, bias audits, and a change-control process aligned to FDA SaMD and HHS ePHI expectations — before scaling, not after." },
    { icon: "radar", title: "3. Track multimodal models as a medium-term bet", desc: "Monitor Med-PaLM-M-style systems as a path to a single text-plus-image TPO review pipeline over the next 2–3 years." },
  ];
  const top = 1.55, rowH = 1.75;
  rows.forEach((row, i) => {
    const y = top + i * (rowH + 0.15);
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y, w: 12.1, h: rowH, rectRadius: 0.1, fill: { color: WHITE }, line: { color: "E3DFF2", width: 1 } });
    iconCircle(s, row.icon, 1.0, y + rowH / 2 - 0.45, 0.9, i === 1 ? ACCENT : PRIMARY);
    s.addText(row.title, { x: 2.15, y: y + 0.18, w: 10.2, h: 0.55, fontFace: FONT_HEAD, bold: true, fontSize: 16.5, color: PRIMARY });
    s.addText(row.desc, { x: 2.15, y: y + 0.72, w: 10.2, h: 0.9, fontFace: FONT_BODY, fontSize: 12.5, color: TEXT_DARK, lineSpacingMultiple: 1.15 });
  });
  footer(s, 5);
}

// ---------- Slide 6: POC architecture ----------
{
  const s = lightSlide();
  s.addText("Proof of Concept: How It Works", { x: 0.6, y: 0.5, w: 12, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: PRIMARY });
  s.addText(
    "A minimal, working pipeline demonstrating the “present” pattern from the trends analysis: OCR handles " +
    "the historical digitization problem, then a single Claude tool-use call does the structuring work that " +
    "used to require a purpose-built NER pipeline.",
    { x: 0.6, y: 1.3, w: 12.1, h: 0.85, fontFace: FONT_BODY, fontSize: 14, color: TEXT_DARK, lineSpacingMultiple: 1.15 }
  );

  const steps = [
    { icon: "doc", label: "Synthetic\nscanned note", color: "594E8A" },
    { icon: "ocr", label: "OCR\n(pytesseract)", color: PRIMARY },
    { icon: "robot", label: "Claude tool-use\nextraction", color: ACCENT },
    { icon: "table", label: "Structured\nJSON output", color: PRIMARY },
  ];
  const circleD = 1.5, stepGap = 2.85, startX = 1.3, y = 3.1;
  steps.forEach((step, i) => {
    const x = startX + i * stepGap;
    iconCircle(s, step.icon, x, y, circleD, step.color);
    s.addText(step.label, { x: x - 0.5, y: y + circleD + 0.15, w: circleD + 1.0, h: 0.7, fontFace: FONT_BODY, bold: true, fontSize: 12.5, color: TEXT_DARK, align: "center", lineSpacingMultiple: 1.05 });
    if (i < steps.length - 1) {
      s.addShape(pres.ShapeType.ellipse, { x: x + circleD + 0.15, y: y + circleD / 2 - 0.35, w: 0.7, h: 0.7, fill: { color: TEXT_MUTED }, line: { type: "none" } });
      s.addImage({ path: path.join(ICONS, "arrow.png"), x: x + circleD + 0.29, y: y + circleD / 2 - 0.21, w: 0.42, h: 0.42 });
    }
  });

  s.addText(
    "Engineering rigor: 4 pytest tests cover the OCR wrapper and the Claude tool-call contract (mocked, no network dependency). " +
    "Stack: FastAPI, pytesseract, Anthropic Python SDK, vanilla HTML/JS front end — no build step, by design, for a fast “hack.”",
    { x: 0.6, y: 5.7, w: 12.1, h: 1.0, fontFace: FONT_BODY, fontSize: 13, italic: true, color: TEXT_MUTED, lineSpacingMultiple: 1.15 }
  );
  footer(s, 6);
}

// ---------- Slide 7: POC demo screenshot ----------
{
  const s = lightSlide();
  s.addText("Proof of Concept: Live Demo", { x: 0.6, y: 0.5, w: 12, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: PRIMARY });
  s.addText(
    "A synthetic scanned note goes through OCR, then Claude structures it into chief complaint, diagnoses, " +
    "medications, procedures, and follow-up — no real patient data anywhere in this project.",
    { x: 0.6, y: 1.25, w: 5.4, h: 2.0, fontFace: FONT_BODY, fontSize: 14, color: TEXT_DARK, lineSpacingMultiple: 1.2 }
  );
  s.addText(
    "See it live: run the demo yourself from the repo README, or watch the accompanying video recording.",
    { x: 0.6, y: 5.9, w: 5.4, h: 0.9, fontFace: FONT_BODY, fontSize: 12.5, italic: true, color: TEXT_MUTED, lineSpacingMultiple: 1.15 }
  );
  s.addShape(pres.ShapeType.roundRect, { x: 6.35, y: 1.15, w: 6.4, h: 5.95, rectRadius: 0.08, fill: { color: WHITE }, line: { color: "E3DFF2", width: 1.5 }, shadow: { type: "outer", color: "000000", opacity: 0.15, blur: 8, offset: 3, angle: 90 } });
  s.addImage({ path: path.join(ASSETS, "poc-demo-crop.png"), x: 6.55, y: 1.35, w: 6.0, h: 5.55, sizing: { type: "contain", w: 6.0, h: 5.55 } });
  footer(s, 7);
}

// ---------- Slide 8: Closing ----------
{
  const s = darkSlide();
  iconCircle(s, "github", 5.9, 1.1, 1.5, "382F6E");
  s.addText("Thank You", { x: 0.8, y: 3.0, w: 11.5, h: 0.9, fontFace: FONT_HEAD, fontSize: 38, bold: true, color: WHITE, align: "center" });
  s.addText("Code, report, and this deck are all in the public repository below.", {
    x: 0.8, y: 3.85, w: 11.5, h: 0.5, fontFace: FONT_BODY, fontSize: 15, color: "CADCFC", align: "center",
  });
  s.addText("github.com/anelbazarbayeva95/cotiviti-clinical-nlp-poc", {
    x: 0.8, y: 4.5, w: 11.5, h: 0.5, fontFace: FONT_BODY, fontSize: 16, bold: true, color: ACCENT, align: "center",
  });
  s.addText("Anel Bazarbayeva  |  anelb195@gmail.com", {
    x: 0.8, y: 6.6, w: 11.5, h: 0.4, fontFace: FONT_BODY, fontSize: 12, color: "CADCFC", align: "center",
  });
}

pres.writeFile({ fileName: "/workspace/cotiviti-clinical-nlp-poc/deliverables/Clinical_NLP_Slides_Bazarbayeva.pptx" }).then(() => {
  console.log("wrote slides");
});
