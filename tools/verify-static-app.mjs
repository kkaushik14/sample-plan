import { readFile } from "node:fs/promises";

const requiredFiles = [
  "apps/web/index.html",
  "apps/web/styles.css",
  "apps/web/app.js",
  "data/portfolio.seed.json",
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
for (const marker of ["#work", "#studio", "#audit", "#mvp", "#documents", "#assistant", "#admin", "./app.js", "./styles.css"]) {
  if (!html.includes(marker)) {
    throw new Error(`apps/web/index.html is missing ${marker}`);
  }
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

console.log("Static app verification passed.");
