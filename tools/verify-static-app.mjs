import { readFile } from "node:fs/promises";

const requiredFiles = [
  "apps/web/index.html",
  "index.html",
  "apps/web/styles.css",
  "apps/web/app.js",
  "api/health.js",
  "api/public/portfolio/home.js",
  "data/portfolio.seed.json",
  "server.mjs",
  "vercel.json",
  "docs/EXECUTION_PLAN_v1.0.md",
  "docs/UI_DESIGN_DOCUMENT_v0.1.md",
  "docs/adr/0001-phase-1-stack.md",
  "docs/versions/Product_Portfolio_PRD_v1.0.md",
  "docs/versions/Product_Portfolio_TDD_v1.0.md"
];

async function assertFile(path) {
  const contents = await readFile(path, "utf8");
  if (!contents.trim()) {
    throw new Error(`${path} is empty`);
  }
  return contents;
}

for (const file of requiredFiles) {
  await assertFile(file);
}

const html = await assertFile("apps/web/index.html");
for (const marker of ["#work", "#studio", "#audit", "#mvp", "#documents", "#assistant", "#admin", "/apps/web/app.js", "/apps/web/styles.css"]) {
  if (!html.includes(marker)) {
    throw new Error(`apps/web/index.html is missing ${marker}`);
  }
}

const rootHtml = await assertFile("index.html");
if (!rootHtml.includes("/apps/web")) {
  throw new Error("Root index.html must link to the web app");
}

const seed = JSON.parse(await assertFile("data/portfolio.seed.json"));

if (!Array.isArray(seed.sectors) || seed.sectors.length < 4) {
  throw new Error("Seed data must include the four target sectors");
}

if (!Array.isArray(seed.projects) || seed.projects.length < 4) {
  throw new Error("Seed data must include at least four suite projects");
}

if (!Array.isArray(seed.suiteModules) || seed.suiteModules.length < 4) {
  throw new Error("Seed data must include the four product suite modules");
}

const expectedModules = [
  "AI Capability Portfolio Platform",
  "Product Audit and Rebuild Planner",
  "MVP Builder and Product Launch Kit",
  "AI Document and Workflow Automation Platform"
];

for (const moduleName of expectedModules) {
  if (!seed.suiteModules.some((module) => module.name === moduleName)) {
    throw new Error(`Seed data is missing suite module: ${moduleName}`);
  }
}

if (!seed.projects.every((project) => project.title && project.slug && project.problem && project.solution)) {
  throw new Error("Every project needs title, slug, problem, and solution");
}

if (!Array.isArray(seed.teamMembers) || seed.teamMembers.length < 3) {
  throw new Error("Seed data must include team members");
}

if (!Array.isArray(seed.adminControls) || seed.adminControls.length < 6) {
  throw new Error("Seed data must include shared admin/platform controls");
}

const appJs = await assertFile("apps/web/app.js");
for (const workflow of ["generateAuditReport", "generateMvpKit", "analyzeDocument", "answerQuestion"]) {
  if (!appJs.includes(workflow)) {
    throw new Error(`apps/web/app.js is missing workflow: ${workflow}`);
  }
}

const packageJson = JSON.parse(await assertFile("package.json"));
if (packageJson.scripts?.dev !== "node server.mjs") {
  throw new Error("package.json dev script must run the Node.js server");
}

const server = await assertFile("server.mjs");
for (const marker of ["createServer", "/health", "/api/public/portfolio/home", "serveStatic"]) {
  if (!server.includes(marker)) {
    throw new Error(`server.mjs is missing ${marker}`);
  }
}

const vercelConfig = JSON.parse(await assertFile("vercel.json"));
if (!Array.isArray(vercelConfig.rewrites) || !vercelConfig.rewrites.some((rewrite) => rewrite.source === "/health")) {
  throw new Error("vercel.json must rewrite /health to the health API");
}

const healthApi = await assertFile("api/health.js");
if (!healthApi.includes("sahara-vercel-api")) {
  throw new Error("api/health.js must expose the Vercel health service");
}

const portfolioApi = await assertFile("api/public/portfolio/home.js");
for (const marker of ["portfolio.seed.json", "readFile", "response.status(200).json"]) {
  if (!portfolioApi.includes(marker)) {
    throw new Error(`api/public/portfolio/home.js is missing ${marker}`);
  }
}

console.log("Static app verification passed.");
