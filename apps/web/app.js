const state = {
  data: null,
  activeSector: "All",
  search: ""
};

const selectors = {
  capabilityGrid: document.querySelector("#capability-grid"),
  suiteGrid: document.querySelector("#suite-grid"),
  sectorFilters: document.querySelector("#sector-filters"),
  projectGrid: document.querySelector("#project-grid"),
  projectSearch: document.querySelector("#project-search"),
  teamGrid: document.querySelector("#team-grid"),
  matrixGrid: document.querySelector("#matrix-grid"),
  auditForm: document.querySelector("#audit-form"),
  auditOutput: document.querySelector("#audit-output"),
  mvpForm: document.querySelector("#mvp-form"),
  mvpOutput: document.querySelector("#mvp-output"),
  documentForm: document.querySelector("#document-form"),
  documentOutput: document.querySelector("#document-output"),
  assistantForm: document.querySelector("#assistant-form"),
  assistantQuery: document.querySelector("#assistant-query"),
  assistantAnswer: document.querySelector("#assistant-answer"),
  suggestions: document.querySelector("#suggestions"),
  adminGrid: document.querySelector("#admin-grid")
};

async function loadData() {
  const response = await fetch("/data/portfolio.seed.json");
  if (!response.ok) {
    throw new Error(`Unable to load portfolio seed data: ${response.status}`);
  }
  return response.json();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCapabilities() {
  selectors.capabilityGrid.innerHTML = state.data.capabilities
    .map((capability) => `
      <article class="capability-card">
        <h3>${escapeHtml(capability.name)}</h3>
        <p>${escapeHtml(capability.description)}</p>
      </article>
    `)
    .join("");
}

function renderSuiteModules() {
  selectors.suiteGrid.innerHTML = state.data.suiteModules
    .map((module) => `
      <article class="suite-card">
        <span class="tag">${escapeHtml(module.status)}</span>
        <h3>${escapeHtml(module.name)}</h3>
        <ul>
          ${module.prdCoverage.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        <a class="text-link" href="#${escapeHtml(module.anchor)}">Open module</a>
      </article>
    `)
    .join("");
}

function renderFilters() {
  const filters = ["All", ...state.data.sectors];
  selectors.sectorFilters.innerHTML = filters
    .map((sector) => `
      <button class="filter-button ${state.activeSector === sector ? "active" : ""}" type="button" data-sector="${escapeHtml(sector)}">
        ${escapeHtml(sector)}
      </button>
    `)
    .join("");

  selectors.sectorFilters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeSector = button.dataset.sector;
      renderFilters();
      renderProjects();
    });
  });
}

function projectMatches(project) {
  const sectorMatch = state.activeSector === "All" || project.sectors.includes(state.activeSector);
  const haystack = [
    project.title,
    project.status,
    project.problem,
    project.solution,
    project.impact,
    ...project.sectors,
    ...project.capabilities,
    ...project.features,
    ...project.stack
  ].join(" ").toLowerCase();
  const searchMatch = !state.search || haystack.includes(state.search.toLowerCase());
  return sectorMatch && searchMatch;
}

function renderProjects() {
  const projects = state.data.projects.filter(projectMatches);

  if (!projects.length) {
    selectors.projectGrid.innerHTML = `
      <article class="project-card">
        <h3>No matching projects</h3>
        <p>Try another sector or search term.</p>
      </article>
    `;
    return;
  }

  selectors.projectGrid.innerHTML = projects
    .map((project) => `
      <article class="project-card ${project.featured ? "featured" : ""}" id="${escapeHtml(project.slug)}">
        <div>
          <div class="project-meta">
            ${project.sectors.map((sector) => `<span class="tag">${escapeHtml(sector)}</span>`).join("")}
          </div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.solution)}</p>
          <div class="tag-row" aria-label="Capabilities">
            ${project.capabilities.map((capability) => `<span class="tag">${escapeHtml(capability)}</span>`).join("")}
          </div>
        </div>
        <div class="project-proof">
          <strong>${escapeHtml(project.status)}</strong>
          <span>${escapeHtml(project.problem)}</span>
          <span>${escapeHtml(project.impact)}</span>
        </div>
      </article>
    `)
    .join("");
}

function renderTeam() {
  selectors.teamGrid.innerHTML = state.data.teamMembers
    .map((member) => `
      <article class="team-card" id="${escapeHtml(member.slug)}">
        <div class="avatar" aria-hidden="true">${escapeHtml(member.name.split(" ").map((part) => part[0]).join(""))}</div>
        <div>
          <h3>${escapeHtml(member.name)}</h3>
          <p><strong>${escapeHtml(member.role)}</strong></p>
          <p>${escapeHtml(member.summary)}</p>
        </div>
        <div class="tag-row">
          ${member.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}
        </div>
      </article>
    `)
    .join("");
}

function renderMatrix() {
  const capabilityScores = state.data.capabilities.map((capability) => {
    const projectCount = state.data.projects.filter((project) => project.capabilities.includes(capability.name)).length;
    const score = Math.max(45, Math.min(95, 45 + projectCount * 15));
    return { ...capability, score };
  });

  selectors.matrixGrid.innerHTML = capabilityScores
    .map((capability) => `
      <article class="matrix-card">
        <strong>${escapeHtml(capability.name)}</strong>
        <div class="meter" aria-label="${escapeHtml(capability.name)} strength ${capability.score}%">
          <span style="width: ${capability.score}%"></span>
        </div>
      </article>
    `)
    .join("");
}

function renderAdminControls() {
  selectors.adminGrid.innerHTML = state.data.adminControls
    .map((control) => `
      <article class="admin-card">
        <h3>${escapeHtml(control.name)}</h3>
        <p>${escapeHtml(control.description)}</p>
      </article>
    `)
    .join("");
}

function fieldValue(form, name) {
  return new FormData(form).get(name)?.toString().trim() || "";
}

function sentenceList(value) {
  return value
    .split(/[\n,.]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function renderReport(target, title, sections) {
  target.innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    ${sections
      .map((section) => `
        <div class="report-section">
          <strong>${escapeHtml(section.label)}</strong>
          ${
            Array.isArray(section.items)
              ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
              : `<p>${escapeHtml(section.items)}</p>`
          }
        </div>
      `)
      .join("")}
    <div class="export-strip">
      <span>Markdown export ready</span>
      <span>Generated output remains editable before approval</span>
    </div>
  `;
}

function generateAuditReport() {
  const description = fieldValue(selectors.auditForm, "description");
  const stack = fieldValue(selectors.auditForm, "stack");
  const painPoints = sentenceList(fieldValue(selectors.auditForm, "painPoints"));
  const goals = sentenceList(fieldValue(selectors.auditForm, "goals"));
  const riskCount = painPoints.length + (stack.toLowerCase().includes("shared") ? 1 : 0);
  const score = Math.max(38, 88 - riskCount * 7);
  const recommendation = score < 55 ? "Rebuild" : score < 70 ? "Refactor" : "Improve";

  renderReport(selectors.auditOutput, "Generated Product Audit Report", [
    { label: "Executive summary", items: `${description} The current stack (${stack}) shows modernization pressure and should be handled through a phased roadmap.` },
    { label: "Product health score", items: `${score}/100 with ${recommendation.toLowerCase()} as the recommended path.` },
    { label: "Risk and dependency matrix", items: painPoints.map((point) => `Risk: ${point}. Mitigation: assign owner, verify impact, and phase into roadmap.`) },
    { label: "Business goals", items: goals },
    { label: "Modernization roadmap", items: ["Discovery and audit", "Stabilization", "Architecture and data planning", "Development or rebuild", "Migration and testing", "Launch and monitoring"] },
    { label: "Assumptions", items: ["Generated from user-provided intake only", "Needs technical validation before final estimate", "Private records should require authenticated workspace access"] }
  ]);
}

function generateMvpKit() {
  const idea = fieldValue(selectors.mvpForm, "idea");
  const sector = fieldValue(selectors.mvpForm, "sector");
  const features = sentenceList(fieldValue(selectors.mvpForm, "features"));
  const constraints = sentenceList(fieldValue(selectors.mvpForm, "constraints"));
  const stories = features.map((feature) => `As a ${sector.toLowerCase()} user, I can use ${feature.toLowerCase()} so that planning work becomes clearer and faster.`);

  renderReport(selectors.mvpOutput, "Generated MVP Launch Kit", [
    { label: "PRD overview", items: `${idea} The first release should focus on a narrow, reviewable workflow for ${sector}.` },
    { label: "MVP scope", items: features },
    { label: "Future scope", items: ["Integrations", "Advanced analytics", "Team collaboration", "Custom template marketplace"] },
    { label: "User stories", items: stories },
    { label: "Development blueprint", items: ["Authenticated workspace", "Intake records", "Generated output records", "Template versions", "Markdown export endpoint"] },
    { label: "Launch checklist", items: ["Seed demo data", "Validate output schema", "Review privacy copy", "Run smoke tests", "Prepare walkthrough"] },
    { label: "Constraints and non-goals", items: constraints }
  ]);
}

function analyzeDocument() {
  const documentText = fieldValue(selectors.documentForm, "documentText");
  const question = fieldValue(selectors.documentForm, "question");
  const sourceItems = sentenceList(documentText);
  const deadlines = sourceItems.filter((item) => /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2})\b/i.test(item));
  const risks = sourceItems.filter((item) => /risk|delay|manual|security|required|missed|sensitive/i.test(item));
  const tasks = sourceItems
    .filter((item) => /should|required|provide|review|upload|ask|deadline|lead/i.test(item))
    .map((item) => `Draft task: ${item}`);

  renderReport(selectors.documentOutput, "Generated Document Intelligence Report", [
    { label: "Question", items: question },
    { label: "Summary", items: `The document contains ${sourceItems.length} extracted notes with ${risks.length} risk indicators and ${tasks.length} draft tasks.` },
    { label: "Risks and obligations", items: risks.length ? risks : ["No explicit risks found in the pasted sample"] },
    { label: "Deadlines", items: deadlines.length ? deadlines : ["No explicit deadline detected"] },
    { label: "Draft tasks for review", items: tasks.length ? tasks : ["Review source notes manually before approving tasks"] },
    { label: "Approval flow", items: ["Draft", "Edit or merge", "Assign owner", "Approve", "Export task list"] },
    { label: "Source reference", items: sourceItems.slice(0, 4) }
  ]);
}

function renderSuggestions() {
  selectors.suggestions.innerHTML = state.data.assistantSuggestions
    .map((suggestion) => `
      <button class="suggestion-button" type="button">${escapeHtml(suggestion)}</button>
    `)
    .join("");

  selectors.suggestions.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectors.assistantQuery.value = button.textContent.trim();
      answerQuestion(selectors.assistantQuery.value);
    });
  });
}

function scoreRecord(query, record) {
  const terms = query.toLowerCase().split(/\W+/).filter(Boolean);
  const content = JSON.stringify(record).toLowerCase();
  return terms.reduce((score, term) => score + (content.includes(term) ? 1 : 0), 0);
}

function buildAnswer(query) {
  const approvedProjects = state.data.projects.filter((project) => project.approvedForAI);
  const projectMatches = approvedProjects
    .map((project) => ({ project, score: scoreRecord(query, project) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const peopleMatches = state.data.teamMembers
    .map((member) => ({ member, score: scoreRecord(query, member) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (!projectMatches.length && !peopleMatches.length) {
    return {
      title: "Not enough approved content yet",
      body: "The approved portfolio records do not currently contain enough information to answer that question. Add or approve more project, case study, or contribution records before using this answer in a pitch.",
      projects: [],
      people: []
    };
  }

  const leadingProject = projectMatches[0]?.project;
  const title = leadingProject ? `${leadingProject.title} is the strongest match` : "Relevant team capability";
  const projectText = projectMatches
    .map(({ project }) => `${project.title}: ${project.solution}`)
    .join(" ");
  const peopleText = peopleMatches
    .map(({ member }) => `${member.name} contributes through ${member.skills.join(", ")}.`)
    .join(" ");

  return {
    title,
    body: [projectText, peopleText].filter(Boolean).join(" "),
    projects: projectMatches.map(({ project }) => project),
    people: peopleMatches.map(({ member }) => member)
  };
}

function answerQuestion(query) {
  const answer = buildAnswer(query);
  selectors.assistantAnswer.innerHTML = `
    <h3>${escapeHtml(answer.title)}</h3>
    <p>${escapeHtml(answer.body)}</p>
    <div class="source-list">
      <strong>Sources and related records</strong>
      ${answer.projects.map((project) => `<a href="#${escapeHtml(project.slug)}">${escapeHtml(project.title)}</a>`).join("")}
      ${answer.people.map((member) => `<a href="#${escapeHtml(member.slug)}">${escapeHtml(member.name)} - ${escapeHtml(member.role)}</a>`).join("")}
    </div>
  `;
}

function renderEmptyAnswer() {
  selectors.assistantAnswer.innerHTML = `
    <div class="answer-empty">
      <div>
        <h3>Ask about sectors, people, projects, or capabilities.</h3>
        <p>Answers are generated from approved local portfolio records in this phase.</p>
      </div>
    </div>
  `;
}

function bindEvents() {
  selectors.projectSearch.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderProjects();
  });

  selectors.assistantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    answerQuestion(selectors.assistantQuery.value.trim());
  });

  selectors.auditForm.addEventListener("submit", (event) => {
    event.preventDefault();
    generateAuditReport();
  });

  selectors.mvpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    generateMvpKit();
  });

  selectors.documentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    analyzeDocument();
  });
}

async function init() {
  try {
    state.data = await loadData();
    renderCapabilities();
    renderSuiteModules();
    renderFilters();
    renderProjects();
    renderTeam();
    renderMatrix();
    renderAdminControls();
    renderSuggestions();
    renderEmptyAnswer();
    bindEvents();
    generateAuditReport();
    generateMvpKit();
    analyzeDocument();
  } catch (error) {
    document.body.innerHTML = `
      <main class="section">
        <h1>Portfolio could not load</h1>
        <p>${escapeHtml(error.message)}</p>
      </main>
    `;
  }
}

init();
