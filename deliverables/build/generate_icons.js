const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const fa = require("react-icons/fa");
const md = require("react-icons/md");

const ICONS = {
  nlp: fa.FaLanguage,
  ocr: md.MdDocumentScanner,
  cv: fa.FaEye,
  llm: fa.FaBrain,
  lmm: fa.FaLayerGroup,
  opportunity: fa.FaChartLine,
  threat: fa.FaExclamationTriangle,
  pilot: fa.FaFlask,
  shield: fa.FaShieldAlt,
  radar: fa.FaSatelliteDish,
  doc: fa.FaFileAlt,
  robot: fa.FaRobot,
  table: fa.FaTable,
  github: fa.FaGithub,
  mail: fa.FaEnvelope,
  arrow: fa.FaArrowRight,
};

const OUT_DIR = path.join(__dirname, "icons");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  for (const [name, Icon] of Object.entries(ICONS)) {
    const svgString = ReactDOMServer.renderToStaticMarkup(
      React.createElement(Icon, { color: "#FFFFFF", size: 256 })
    );
    const outPath = path.join(OUT_DIR, `${name}.png`);
    await sharp(Buffer.from(svgString)).resize(256, 256).png().toFile(outPath);
    console.log("wrote", outPath);
  }
}

main();
