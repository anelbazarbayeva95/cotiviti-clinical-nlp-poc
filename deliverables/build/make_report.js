const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageBreak, LevelFormat,
} = require("docx");

const FONT = "Times New Roman";
const BODY_SIZE = 22; // 11pt in half-points
const TITLE_SIZE = 30; // 15pt

const body = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 160, ...(opts.spacing || {}) },
    children: Array.isArray(text) ? text : [new TextRun({ text, font: FONT, size: BODY_SIZE, ...opts.run })],
  });

const cite = (label, rest) => [
  new TextRun({ text: `${label} `, font: FONT, size: BODY_SIZE, bold: true }),
  new TextRun({ text: rest, font: FONT, size: BODY_SIZE }),
];

const heading = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: FONT, bold: true, size: 24, color: "000000" })],
  });

const refPara = (text) =>
  new Paragraph({
    spacing: { after: 160 },
    indent: { left: 720, hanging: 720 },
    children: [new TextRun({ text, font: FONT, size: BODY_SIZE })],
  });

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: FONT, size: BODY_SIZE } },
    },
  },
  numbering: {
    config: [
      {
        reference: "options-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.START }],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
        },
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: "Clinical Natural Language Technology for Health Care: Past, Present, and Future Approaches",
              font: FONT, bold: true, size: TITLE_SIZE,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: "Anel Bazarbayeva  |  Cotiviti Intern Assessment (Generative AI Research Engineer)  |  August 2026",
              font: FONT, italics: true, size: 20,
            }),
          ],
        }),

        heading("The Concept"),
        body(
          "Clinical natural language technology is the set of methods that turn unstructured health care " +
          "information — clinician notes, faxed records, scanned forms, imaging reports — into a form software " +
          "can act on. It spans several distinct but converging technologies: natural language processing (NLP) " +
          "for parsing text, optical character recognition (OCR) for digitizing scanned or faxed documents, " +
          "computer vision (CV) for interpreting images and imaging reports, large language models (LLMs) for " +
          "extracting and summarizing meaning from free text, and large multimodal models (LMMs) that reason " +
          "jointly across text and images. For a healthcare informatics company processing high volumes of " +
          "unstructured clinical, billing, and correspondence content across treatment, payment, and operations " +
          "(TPO) use cases, the maturity of these technologies directly determines how much of that content can " +
          "be structured, verified, and acted on without manual review. Cotiviti's payment-integrity work in " +
          "particular depends on reading exactly this kind of unstructured material — medical records, payer-" +
          "provider contracts, clinical documentation attached to a claim — so the pace of progress in clinical " +
          "NLP is not an academic curiosity for the company; it is a direct input to how much of that review " +
          "work can be automated versus staffed."
        ),

        heading("Trends: Past, Present, and Future"),
        body(cite(
          "Past.",
          "Before deep learning, clinical NLP relied on rule-based pattern matching, curated medical " +
          "dictionaries, and statistical models such as conditional random fields trained for narrow extraction " +
          "tasks — each new use case required its own hand-built pipeline (Wu et al., 2020). Digitizing scanned " +
          "or handwritten records was a separate, brittle problem: even combining multiple general-purpose OCR " +
          "engines produced meaningful error rates on real clinical form fields (Rasmussen et al., 2012), a " +
          "constraint this assessment's proof of concept reproduces directly."
        )),
        body(cite(
          "Present.",
          "Transformer-based language models changed both halves of the problem. Domain-pretrained models " +
          "such as BioBERT and ClinicalBERT closed much of the gap on biomedical entity recognition and " +
          "note-level prediction tasks (Lee et al., 2020; Huang et al., 2019). More recently, general-purpose " +
          "LLMs have absorbed enough medical knowledge to exceed passing-level performance on medical licensing " +
          "exam benchmarks (Singhal et al., 2023) and are already deployed at the point of care: a 2026 " +
          "multi-site study of ambient AI documentation scribes found meaningful, if inconsistent, time savings " +
          "for clinicians (Aguilar, 2026). The practical shift for a company like Cotiviti is that a single LLM " +
          "call with a structured output schema can now do what used to require a purpose-built extraction " +
          "pipeline per document type (Thirunavukarasu et al., 2023) — the same pattern this assessment's proof " +
          "of concept demonstrates on a synthetic clinical note."
        )),
        body(cite(
          "Future.",
          "The next step is multimodal: models such as Med-PaLM M reason jointly over clinical text, medical " +
          "imaging, and genomic data with a single set of weights rather than separate pipelines stitched " +
          "together after the fact (Tu et al., 2024). For TPO workflows that already combine text (notes, " +
          "policies) with image attachments (itemized bills, imaging studies), this points toward a single " +
          "review pipeline instead of parallel OCR, NLP, and CV systems maintained independently."
        )),

        heading("Opportunities and Threats"),
        body(cite(
          "Opportunities.",
          "LLM-based extraction is markedly more resilient to the noisy, inconsistent text that OCR produces " +
          "from real scanned documents than older rule-based pipelines were, and it requires far less " +
          "engineering investment per new document type or use case — no bespoke named-entity model to train " +
          "and maintain for each one. Deployed carefully, this can reduce the manual abstraction burden on " +
          "clinical and payment-integrity reviewers, and, per Aguilar (2026), measurably reduce documentation " +
          "time even in today's imperfect deployments."
        )),
        body(cite(
          "Threats.",
          "The same generality that makes LLMs flexible also makes them unreliable in high-stakes ways: a 2025 " +
          "adversarial study found leading LLMs repeated a single fabricated clinical detail in 50–83% of test " +
          "cases when it was planted in a prompt (Omar et al., 2025). Regulatory exposure is real and growing " +
          "— the FDA's AI/ML-based Software as a Medical Device action plan sets expectations for change-control " +
          "and real-world monitoring (U.S. Food and Drug Administration, 2021), and HHS's 2024 proposed HIPAA " +
          "Security Rule updates would explicitly extend compliance obligations to AI systems and training data " +
          "that touch electronic protected health information (U.S. Department of Health and Human Services, " +
          "2024). Bias is not hypothetical either: a widely used population-health algorithm was shown to " +
          "under-flag Black patients for extra care because it used cost, not need, as its training proxy — " +
          "correcting it nearly tripled the share of Black patients identified as high-risk (Obermeyer et al., " +
          "2019). Any TPO-facing model trained on historical cost or utilization data inherits this exact risk."
        )),

        heading("Recommended Options for Cotiviti"),
        new Paragraph({
          numbering: { reference: "options-list", level: 0 },
          spacing: { after: 140 },
          children: cite(
            "Pilot a governed extraction service.",
            "Apply the OCR-plus-LLM pattern demonstrated in the accompanying proof of concept to a real, " +
            "high-volume unstructured input Cotiviti already receives — for example, faxed medical records or " +
            "provider correspondence attached to payment-integrity claims — with a human reviewer confirming any " +
            "output before it reaches an automated decision. Scope the pilot narrowly at first (one document " +
            "type, one downstream workflow) so accuracy and time-savings can be measured against the existing " +
            "manual process before any expansion decision is made."
          ),
        }),
        new Paragraph({
          numbering: { reference: "options-list", level: 0 },
          spacing: { after: 140 },
          children: cite(
            "Build the AI governance layer first, not after.",
            "Before scaling any LLM-based TPO tool, invest in the AI Governance Program already referenced in " +
            "Cotiviti's own intern job description: hallucination spot-checks against source documents, bias " +
            "audits on any model trained with cost or utilization signals (informed directly by the Obermeyer et " +
            "al. finding above), and a change-control process aligned to the FDA's AI/ML SaMD framework and " +
            "HHS's proposed ePHI rules. Treat this as a standing function, not a one-time review, since both the " +
            "underlying models and the regulatory expectations around them are still changing quickly."
          ),
        }),
        new Paragraph({
          numbering: { reference: "options-list", level: 0 },
          spacing: { after: 140 },
          children: cite(
            "Track multimodal models as a medium-term bet.",
            "Multimodal systems like Med-PaLM M are not yet a build priority, but Cotiviti should monitor them " +
            "as a path toward unifying text- and image-based TPO review into a single pipeline over the next two " +
            "to three years, revisiting the build decision once a narrow-scope model is available for evaluation " +
            "rather than committing engineering time to it today."
          ),
        }),

        body(
          "These three options are sequenced deliberately: piloting first, on a narrow and easily reviewed " +
          "scope, produces the evidence needed to justify investment in governance; governance, in turn, is " +
          "what makes it defensible to widen the pilot's scope later without repeating the same hallucination, " +
          "privacy, and bias risks at larger scale. The accompanying proof of concept is a small, concrete " +
          "illustration of the first step — an OCR-plus-LLM pipeline that turns a scanned clinical note into " +
          "structured fields in seconds rather than requiring a purpose-built extraction model — not a finished " +
          "product, but evidence that the underlying pattern is fast to stand up and worth piloting properly.",
          { spacing: { before: 40 } }
        ),

        new Paragraph({ children: [new PageBreak()] }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "References", font: FONT, bold: true, size: 26 })],
        }),

        refPara("Aguilar, M. (2026, April 1). Large AI scribe study finds modest time savings, inconsistent use. STAT News. https://www.statnews.com/2026/04/01/ai-ambient-scribes-modest-time-savings-clinical-documentation/"),
        refPara("Huang, K., Altosaar, J., & Ranganath, R. (2019). ClinicalBERT: Modeling clinical notes and predicting hospital readmission. arXiv. https://arxiv.org/abs/1904.05342"),
        refPara("Lee, J., Yoon, W., Kim, S., Kim, D., Kim, S., So, C. H., & Kang, J. (2020). BioBERT: A pre-trained biomedical language representation model for biomedical text mining. Bioinformatics, 36(4), 1234–1240. https://doi.org/10.1093/bioinformatics/btz682"),
        refPara("Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. Science, 366(6464), 447–453. https://doi.org/10.1126/science.aax2342"),
        refPara("Omar, M., Sorin, V., Collins, J. D., Reich, D., Freeman, R., Gavin, N., et al. (2025). Multi-model assurance analysis showing large language models are highly vulnerable to adversarial hallucination attacks during clinical decision support. Communications Medicine, 5(1), Article 330. https://doi.org/10.1038/s43856-025-01021-3"),
        refPara("Rasmussen, L. V., Peissig, P. L., McCarty, C. A., & Starren, J. (2012). Development of an optical character recognition pipeline for handwritten form fields from an electronic health record. Journal of the American Medical Informatics Association, 19(e1), e90–e95. https://doi.org/10.1136/amiajnl-2011-000182"),
        refPara("Singhal, K., Azizi, S., Tu, T., Mahdavi, S. S., Wei, J., Chung, H. W., et al. (2023). Large language models encode clinical knowledge. Nature, 620(7972), 172–180. https://doi.org/10.1038/s41586-023-06291-2"),
        refPara("Thirunavukarasu, A. J., Ting, D. S. J., Elangovan, K., Gutierrez, L., Tan, T. F., & Ting, D. S. W. (2023). Large language models in medicine. Nature Medicine, 29(8), 1930–1940. https://doi.org/10.1038/s41591-023-02448-8"),
        refPara("Tu, T., Azizi, S., Driess, D., Schaekermann, M., Amin, M., Chang, P.-C., et al. (2024). Towards generalist biomedical AI. NEJM AI, 1(3), Article AIoa2300138. https://doi.org/10.1056/AIoa2300138"),
        refPara("U.S. Department of Health and Human Services, Office for Civil Rights. (2024). HIPAA Security Rule notice of proposed rulemaking to strengthen cybersecurity for electronic protected health information [Fact sheet]. https://www.hhs.gov/hipaa/for-professionals/security/hipaa-security-rule-nprm/factsheet/index.html"),
        refPara("U.S. Food and Drug Administration. (2021). Artificial Intelligence/Machine Learning (AI/ML)-based Software as a Medical Device (SaMD) action plan. https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-software-medical-device"),
        refPara("Wu, S., Roberts, K., Datta, S., Du, J., Ji, Z., Si, Y., Soni, S., Wang, Q., Wei, Q., Xiang, Y., Zhao, B., & Xu, H. (2020). Deep learning in clinical natural language processing: A methodical review. Journal of the American Medical Informatics Association, 27(3), 457–470. https://doi.org/10.1093/jamia/ocz200"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/workspace/cotiviti-clinical-nlp-poc/deliverables/Clinical_NLP_Report_Bazarbayeva.docx", buffer);
  console.log("wrote report");
});
