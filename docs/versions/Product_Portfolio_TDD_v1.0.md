# Technical Design Document

## AI-Enabled Product Engineering Portfolio Suite

**Document Type:** Technical Design Document  
**Content Type:** Markdown  
**Version:** 1.0  
**Status:** Ready for development  
**Scope:** Shared platform architecture plus technical design for four sample projects  

---

## 1. Document Purpose

This document defines the technical design for a portfolio suite that demonstrates product engineering, product rebuilding, workflow automation, data handling, and practical AI-enabled features. It is designed as a development-ready reference for engineering, UI, QA, deployment, and demo preparation.

The suite contains four projects:

1. AI Capability Portfolio Platform
2. Product Audit and Rebuild Planner
3. MVP Builder and Product Launch Kit
4. AI Document and Workflow Automation Platform

The design uses a shared platform foundation so authentication, roles, AI orchestration, file handling, exports, audit logs, templates, and admin features do not need to be rebuilt separately for each project.

---

## 2. Technical Goals

### 2.1 Primary Goals

- Build a modular web application that can showcase multiple product capabilities.
- Reuse shared services across all projects.
- Support public portfolio pages and authenticated workspaces.
- Provide practical AI features with controlled inputs, structured outputs, and editable results.
- Ensure generated content is stored with traceability, versioning, and export support.
- Provide development-ready architecture, schema, APIs, background jobs, security controls, and deployment plan.

### 2.2 Engineering Principles

- Keep business logic separate from UI logic.
- Keep AI prompt templates versioned and testable.
- Store AI outputs as structured JSON plus rendered markdown.
- Require user approval before converting AI outputs into final workflow records.
- Treat uploaded documents and generated outputs as private by default.
- Use role-based access for admin and workspace features.
- Build all features as modules that can be enabled, disabled, or extended later.

---

## 3. Recommended Technology Stack

The stack below is recommended for fast development, clean architecture, and production-ready demo deployment.

| Layer | Recommended Choice | Notes |
|---|---|---|
| Frontend | React with TypeScript | Component-based UI, reusable screens, strong typing |
| Frontend Styling | Tailwind CSS or CSS modules | Fast layout development and design consistency |
| Backend | Python API backend | Strong support for AI workflows, document parsing, background jobs |
| API Style | REST for CRUD, streaming endpoint for AI responses | Simple to build and easy to test |
| Database | PostgreSQL | Relational data, JSON fields, indexing, full-text support |
| Vector Search | PostgreSQL vector extension or dedicated vector index | Start with database-native vector search for MVP |
| Cache and Queue Broker | Redis | Background jobs, rate limits, temporary state |
| Background Jobs | Celery, RQ, or equivalent worker system | File parsing, embeddings, exports, long AI jobs |
| Object Storage | S3-compatible storage or local storage for MVP | Store uploads, exports, screenshots |
| Auth | Session-based or token-based auth | Role-based access required |
| Exports | Markdown first, PDF and DOCX later | MVP should support markdown export |
| Deployment | Docker-based deployment | Repeatable local, staging, and production setup |
| Observability | Structured logs, error tracking, health checks | Required for AI job debugging |

---

## 4. High-Level Architecture

### 4.1 System Components

```text
Browser Client
  |
  | HTTPS
  v
Frontend Web App
  |
  | REST / Streaming API
  v
Backend API Server
  |
  |-- Auth and RBAC Service
  |-- Portfolio Service
  |-- Product Audit Service
  |-- MVP Planning Service
  |-- Document Workflow Service
  |-- AI Orchestration Service
  |-- Template Service
  |-- Export Service
  |-- Admin Service
  |
  | Database Queries
  v
PostgreSQL Database
  |
  | Vector Queries
  v
Vector Index

Backend API Server
  |
  | Enqueue Jobs
  v
Redis Queue
  |
  v
Background Worker
  |
  |-- File Parsing Jobs
  |-- Embedding Jobs
  |-- Report Generation Jobs
  |-- Export Jobs
  |-- Cleanup Jobs

Object Storage
  |-- Uploaded Files
  |-- Generated Exports
  |-- Screenshots and Demo Assets
```

### 4.2 Application Boundaries

| Area | Responsibility |
|---|---|
| Frontend | Screens, forms, dashboards, assistant UI, export actions, review flows |
| Backend API | Authentication, validation, business logic, permissions, response formatting |
| AI Orchestration | Prompt selection, context retrieval, model call, schema validation, output versioning |
| Background Workers | Long-running and retryable jobs |
| Database | Users, projects, content, reports, generated outputs, tasks, logs |
| Object Storage | Files, screenshots, generated downloadable artifacts |

---

## 5. Shared Platform Modules

These modules are used by all four projects.

### 5.1 Authentication and Roles Module

#### Responsibilities

- User registration and login.
- Password reset or invite-based account creation.
- Role-based access control.
- Workspace ownership checks.
- Admin-only content management routes.

#### Roles

| Role | Access |
|---|---|
| Public Visitor | Public portfolio and public case study pages |
| Registered User | Own workspaces, generated reports, uploaded documents, exports |
| Admin | Portfolio CMS, templates, sample data, user management |
| Super Admin | Full settings, AI configuration, system maintenance |

#### Permission Rules

- Public routes must never expose private documents, private outputs, or user workspaces.
- Registered users can only access records they own or records shared with them.
- Admin users can manage public content but should not automatically access private user files unless explicitly allowed.
- Super Admin can access system settings and maintenance tools.

---

### 5.2 AI Orchestration Module

#### Responsibilities

- Select prompt template by workflow type.
- Build context from user input, portfolio records, documents, or generated plans.
- Call configured language model provider through a model gateway.
- Validate response against expected JSON schema.
- Store raw output, parsed output, rendered markdown, prompt template version, and generation metadata.
- Support retry for failed generation jobs.
- Support streaming responses for assistant-style interfaces.

#### AI Workflow Pattern

```text
User Input
  -> Validate input
  -> Select workflow type
  -> Load prompt template
  -> Retrieve context if needed
  -> Build model request
  -> Call model gateway
  -> Validate structured output
  -> Store generated output
  -> Return rendered response to UI
```

#### Common AI Workflow Types

| Workflow Type | Used By |
|---|---|
| portfolio_qa | Portfolio Assistant |
| sector_capability_summary | Portfolio Platform |
| product_audit_report | Product Audit Planner |
| rebuild_recommendation | Product Audit Planner |
| modernization_roadmap | Product Audit Planner |
| mvp_prd_generation | MVP Builder |
| feature_prioritization | MVP Builder |
| user_story_generation | MVP Builder |
| document_summary | Document Workflow Platform |
| document_qa | Document Workflow Platform |
| risk_extraction | Document Workflow Platform |
| task_extraction | Document Workflow Platform |

#### Output Storage Requirements

Each AI output must store:

- Workflow type
- Input snapshot
- Prompt template ID and version
- Model configuration alias
- Parsed JSON output
- Rendered markdown output
- Status
- Error message if failed
- Created by user
- Created timestamp
- Parent entity reference

---

### 5.3 Template Management Module

#### Responsibilities

- Store prompt templates.
- Store report templates.
- Store export templates.
- Version templates.
- Mark templates as active or archived.
- Support admin testing of templates with sample input.

#### Template Versioning Rules

- Editing an active template should create a new version.
- Existing generated outputs should retain the template version used at generation time.
- Archived templates should not be used for new generation jobs.

---

### 5.4 File Handling Module

#### Responsibilities

- Validate uploaded files by extension, MIME type, and size.
- Store original file in object storage.
- Extract text from supported files.
- Create document sections for chunking.
- Track processing status.
- Queue embedding jobs when needed.
- Allow user deletion and retention controls.

#### Supported MVP File Types

| Type | Processing Requirement |
|---|---|
| PDF | Extract text, preserve page references where possible |
| DOCX | Extract paragraphs and headings |
| TXT | Plain text extraction |
| Markdown | Preserve headings and sections |
| CSV | Parse as table text and structured rows for simple summaries |
| Pasted Text | Store directly as document content |

---

### 5.5 Export Module

#### Responsibilities

- Export generated outputs and reports.
- Support markdown export in MVP.
- Support PDF, DOCX, CSV, and JSON later.
- Store export files and track export history.

#### Export Types

| Export Type | Source |
|---|---|
| Project case study summary | Portfolio Platform |
| Product audit report | Product Audit Planner |
| Modernization roadmap | Product Audit Planner |
| Generated PRD | MVP Builder |
| User stories | MVP Builder |
| Document summary | Document Workflow Platform |
| Task list CSV | Document Workflow Platform |
| Full intelligence report | Document Workflow Platform |

---

### 5.6 Audit Logging Module

#### Responsibilities

- Track sensitive actions.
- Track admin changes.
- Track file upload, deletion, and export actions.
- Track generation events and failures.
- Support debugging and compliance-style review.

#### Logged Events

- User login
- File upload
- File deletion
- AI generation requested
- AI generation completed
- AI generation failed
- Export created
- Admin content update
- Task approved
- Role changed

---

## 6. Shared Database Schema

The schema below is development-ready for the MVP. Field names can be adapted to the selected backend framework conventions.

### 6.1 users

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | varchar(255) | Unique, indexed |
| full_name | varchar(255) | Required |
| password_hash | text | Nullable if external identity provider is used |
| status | varchar(30) | active, invited, suspended |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 6.2 roles

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | varchar(50) | public, registered_user, admin, super_admin |
| description | text | Optional |

### 6.3 user_roles

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK users.id |
| role_id | UUID | FK roles.id |
| created_at | timestamp | Required |

### 6.4 sectors

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | varchar(120) | Technology, General Business, Consulting, Finance |
| slug | varchar(140) | Unique |
| description | text | Optional |
| is_active | boolean | Default true |

### 6.5 skills

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | varchar(120) | Skill name |
| category | varchar(80) | product, frontend, backend, AI, data, DevOps, design |
| slug | varchar(140) | Unique |
| description | text | Optional |

### 6.6 prompt_templates

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| key | varchar(120) | Workflow key |
| name | varchar(255) | Human-readable name |
| version | integer | Incrementing version |
| system_instruction | text | Model instruction |
| user_template | text | Input template |
| output_schema | jsonb | Expected JSON schema |
| status | varchar(30) | draft, active, archived |
| created_by_id | UUID | FK users.id |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 6.7 generated_outputs

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| workflow_type | varchar(120) | Generation workflow |
| parent_type | varchar(120) | Entity type, such as audit, document, mvp_plan |
| parent_id | UUID | Parent entity ID |
| input_snapshot | jsonb | Inputs used for generation |
| prompt_template_id | UUID | FK prompt_templates.id |
| prompt_template_version | integer | Template version used |
| model_alias | varchar(120) | Configured model name alias |
| status | varchar(30) | queued, processing, completed, failed |
| structured_output | jsonb | Parsed model output |
| markdown_output | text | Rendered output |
| error_message | text | Nullable |
| created_by_id | UUID | FK users.id |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 6.8 uploaded_files

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| owner_id | UUID | FK users.id |
| original_filename | varchar(255) | Uploaded filename |
| storage_key | text | Object storage path |
| mime_type | varchar(120) | Validated MIME |
| file_size_bytes | bigint | Required |
| status | varchar(30) | uploaded, processing, processed, failed, deleted |
| extracted_text | text | Nullable for large files if stored in sections only |
| processing_error | text | Nullable |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 6.9 exports

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| owner_id | UUID | FK users.id |
| source_type | varchar(120) | Entity type |
| source_id | UUID | Entity ID |
| export_format | varchar(30) | markdown, pdf, docx, csv, json |
| storage_key | text | Object storage path |
| status | varchar(30) | queued, completed, failed |
| created_at | timestamp | Required |

### 6.10 audit_logs

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| actor_id | UUID | Nullable for public visitor actions |
| event_type | varchar(120) | Event key |
| entity_type | varchar(120) | Optional |
| entity_id | UUID | Optional |
| metadata | jsonb | Additional data |
| ip_address | varchar(80) | Optional |
| created_at | timestamp | Required |

---

## 7. Shared API Conventions

### 7.1 Response Format

Successful response:

```json
{
  "success": true,
  "data": {},
  "message": "Request completed successfully"
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Required field is missing",
    "details": {}
  }
}
```

### 7.2 Pagination Format

```json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total_count": 100,
  "total_pages": 5
}
```

### 7.3 Common Status Values

| Status | Meaning |
|---|---|
| draft | Created but not finalized |
| queued | Waiting for background worker |
| processing | Currently being processed |
| completed | Successfully completed |
| failed | Failed with error |
| archived | Hidden from default views |
| deleted | Soft-deleted |

---

# Project 1: AI Capability Portfolio Platform

## 8. Project Purpose

The AI Capability Portfolio Platform is a public and admin-managed portfolio system that shows team capabilities, individual profiles, project case studies, skills, sectors, proof links, and an AI assistant that answers questions from approved portfolio content.

---

## 9. Architecture

### 9.1 Module Components

```text
Portfolio Frontend
  |-- Landing Page
  |-- Team Page
  |-- Individual Profile Page
  |-- Project Case Study Page
  |-- Capability Filters
  |-- AI Assistant Drawer
  |-- Admin CMS Screens

Portfolio Backend Service
  |-- Team Member CRUD
  |-- Project CRUD
  |-- Case Study CRUD
  |-- Contribution Mapping
  |-- Skill and Sector Filtering
  |-- Public Content API
  |-- AI Portfolio Context Builder

AI Orchestration Service
  |-- Portfolio Q&A Workflow
  |-- Sector Capability Summary Workflow

Vector Index
  |-- Approved Portfolio Content Chunks
```

### 9.2 Data Flow for Public Portfolio Browsing

```text
Visitor opens page
  -> Frontend calls public portfolio API
  -> Backend returns published content only
  -> Frontend renders landing/team/profile/project pages
```

### 9.3 Data Flow for Portfolio Assistant

```text
Visitor asks question
  -> Backend validates question
  -> Context builder searches approved portfolio content
  -> AI workflow receives question + retrieved context
  -> Structured answer is generated
  -> Answer includes related projects, people, and links
  -> Conversation is logged without storing sensitive private data
```

---

## 10. Project-Specific Database Schema

### 10.1 team_members

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Nullable FK users.id |
| full_name | varchar(255) | Required |
| slug | varchar(255) | Unique |
| role_title | varchar(255) | Required |
| summary | text | Required |
| profile_image_file_id | UUID | Nullable FK uploaded_files.id |
| years_experience | integer | Optional |
| location_label | varchar(120) | Optional |
| display_order | integer | Default 0 |
| is_public | boolean | Default true |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 10.2 team_member_skills

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| team_member_id | UUID | FK team_members.id |
| skill_id | UUID | FK skills.id |
| proficiency_level | varchar(50) | beginner, intermediate, advanced, expert |
| evidence_text | text | Optional proof statement |

### 10.3 portfolio_projects

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | varchar(255) | Required |
| slug | varchar(255) | Unique |
| short_summary | text | Required |
| full_description | text | Required |
| project_type | varchar(80) | sample, client, internal, demo |
| status | varchar(50) | planned, in_progress, completed, archived |
| demo_url | text | Optional |
| repository_url | text | Optional |
| cover_file_id | UUID | Nullable FK uploaded_files.id |
| is_featured | boolean | Default false |
| is_public | boolean | Default true |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 10.4 portfolio_project_sectors

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| project_id | UUID | FK portfolio_projects.id |
| sector_id | UUID | FK sectors.id |

### 10.5 portfolio_project_skills

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| project_id | UUID | FK portfolio_projects.id |
| skill_id | UUID | FK skills.id |

### 10.6 case_studies

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| project_id | UUID | FK portfolio_projects.id |
| problem_statement | text | Required |
| solution_overview | text | Required |
| key_features | jsonb | Array of feature objects |
| ai_capabilities | jsonb | Array of AI capability objects |
| architecture_summary | text | Optional |
| tech_stack | jsonb | Frontend, backend, database, AI, deployment |
| impact_statement | text | Required |
| future_scope | text | Optional |
| is_public | boolean | Default true |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 10.7 contributions

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| team_member_id | UUID | FK team_members.id |
| project_id | UUID | FK portfolio_projects.id |
| role_on_project | varchar(255) | Required |
| owned_modules | jsonb | Array of module names |
| contribution_summary | text | Required |
| proof_links | jsonb | Optional links or assets |
| created_at | timestamp | Required |

### 10.8 portfolio_content_chunks

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| source_type | varchar(80) | team_member, project, case_study, contribution |
| source_id | UUID | Source entity ID |
| title | varchar(255) | Chunk title |
| content | text | Indexed content |
| is_approved_for_ai | boolean | Default false |
| embedding | vector | Nullable depending on vector setup |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

---

## 11. APIs

### 11.1 Public APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/public/portfolio/home | Landing page content |
| GET | /api/public/team-members | List public team members |
| GET | /api/public/team-members/{slug} | Team member detail |
| GET | /api/public/projects | List public projects with filters |
| GET | /api/public/projects/{slug} | Project detail and case study |
| GET | /api/public/sectors | List active sectors |
| GET | /api/public/skills | List skills used in public portfolio |
| POST | /api/public/portfolio-assistant/query | Ask assistant a portfolio question |

### 11.2 Admin APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/admin/team-members | Create team member |
| PATCH | /api/admin/team-members/{id} | Update team member |
| DELETE | /api/admin/team-members/{id} | Archive team member |
| POST | /api/admin/projects | Create portfolio project |
| PATCH | /api/admin/projects/{id} | Update project |
| DELETE | /api/admin/projects/{id} | Archive project |
| POST | /api/admin/case-studies | Create case study |
| PATCH | /api/admin/case-studies/{id} | Update case study |
| POST | /api/admin/contributions | Add contribution |
| POST | /api/admin/portfolio-content/reindex | Rebuild approved AI index |

---

## 12. AI Workflow Design

### 12.1 Portfolio Q&A Workflow

#### Input

```json
{
  "question": "Which projects are relevant for finance?",
  "visitor_context": {
    "selected_sector": "Finance"
  }
}
```

#### Context Retrieval

- Search approved portfolio content chunks.
- Prioritize matching sector, capability, project, and team member names.
- Return top relevant chunks with source metadata.

#### Output Schema

```json
{
  "answer": "string",
  "related_projects": [
    {
      "title": "string",
      "slug": "string",
      "reason": "string"
    }
  ],
  "related_people": [
    {
      "name": "string",
      "slug": "string",
      "reason": "string"
    }
  ],
  "limitations": "string"
}
```

#### Guardrails

- Answer only from approved portfolio content.
- If the answer is not available, state that the portfolio does not currently include enough information.
- Do not claim project experience that is not present in portfolio records.
- Provide related pages when possible.

---

## 13. Background Jobs

| Job | Trigger | Purpose |
|---|---|---|
| portfolio_content_index_job | Admin publishes or updates content | Create searchable content chunks |
| portfolio_embedding_job | Content chunks created | Generate embeddings for assistant search |
| portfolio_export_job | Export requested | Generate markdown or PDF summary |
| demo_asset_cleanup_job | Scheduled | Remove unused draft uploads |

---

## 14. Security Design

- Public endpoints return only records where `is_public = true`.
- Admin endpoints require admin role.
- Assistant context builder uses only `is_approved_for_ai = true` chunks.
- Proof links should be validated and manually approved before publishing.
- Private repository URLs or internal notes should not be exposed publicly unless marked public.
- File access must use signed URLs or backend-proxied downloads.

---

## 15. Testing Strategy

### 15.1 Unit Tests

- Team member CRUD validation.
- Project filter logic.
- Case study rendering logic.
- Contribution mapping rules.
- AI context retrieval filters.

### 15.2 API Tests

- Public route returns only public content.
- Admin route rejects non-admin users.
- Portfolio assistant rejects empty questions.
- Project filtering works for sector, skill, and capability.

### 15.3 AI Evaluation Tests

- Assistant answers known questions from seeded content.
- Assistant refuses unsupported claims.
- Assistant returns relevant project links.
- Assistant output matches JSON schema.

### 15.4 UI Tests

- Landing page renders featured content.
- Team member profile opens correctly.
- Project filters update results.
- Assistant drawer opens, submits query, and renders response.
- Admin can create and publish a project.

---

# Project 2: Product Audit and Rebuild Planner

## 16. Project Purpose

The Product Audit and Rebuild Planner helps users evaluate an existing product and generate a structured audit report, health score, modernization recommendation, risk matrix, and roadmap.

---

## 17. Architecture

### 17.1 Module Components

```text
Product Audit Frontend
  |-- Audit Intake Wizard
  |-- Product Health Score View
  |-- Audit Report View
  |-- Recommendation View
  |-- Risk Matrix View
  |-- Roadmap View
  |-- Export Actions

Product Audit Backend Service
  |-- Audit Session CRUD
  |-- Intake Validation
  |-- Health Score Calculation
  |-- AI Report Generation
  |-- Recommendation Engine
  |-- Roadmap Generator
  |-- Risk Matrix Generator

AI Orchestration Service
  |-- product_audit_report
  |-- rebuild_recommendation
  |-- modernization_roadmap
```

### 17.2 Data Flow

```text
User creates audit session
  -> Completes intake wizard
  -> Backend validates required sections
  -> Health score rules calculate baseline score
  -> AI workflow generates audit report
  -> Recommendation workflow generates modernization path
  -> Roadmap workflow creates phases
  -> Results are saved as structured outputs
  -> User reviews, edits, exports report
```

---

## 18. Project-Specific Database Schema

### 18.1 product_audits

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| owner_id | UUID | FK users.id |
| title | varchar(255) | Required |
| product_name | varchar(255) | Required |
| sector_id | UUID | Nullable FK sectors.id |
| product_description | text | Required |
| target_users | jsonb | Array of user groups |
| current_features | jsonb | Array of feature objects |
| known_pain_points | jsonb | Array of pain point objects |
| current_tech_stack | jsonb | Frontend, backend, database, hosting, integrations |
| performance_issues | jsonb | Optional array |
| security_concerns | jsonb | Optional array |
| business_goals | jsonb | Array of goals |
| data_sensitivity | varchar(80) | low, medium, high, regulated |
| integration_dependencies | jsonb | Optional array |
| desired_timeline | varchar(120) | Optional |
| status | varchar(30) | draft, ready_for_generation, completed, archived |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 18.2 audit_health_scores

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| audit_id | UUID | FK product_audits.id |
| overall_score | integer | 0 to 100 |
| ux_score | integer | 0 to 100 |
| architecture_score | integer | 0 to 100 |
| performance_score | integer | 0 to 100 |
| maintainability_score | integer | 0 to 100 |
| security_score | integer | 0 to 100 |
| scalability_score | integer | 0 to 100 |
| scoring_details | jsonb | Score explanation |
| created_at | timestamp | Required |

### 18.3 audit_recommendations

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| audit_id | UUID | FK product_audits.id |
| recommendation_type | varchar(50) | improve, refactor, rebuild, migrate, retire |
| recommendation_summary | text | Required |
| reasoning | text | Required |
| confidence_level | varchar(30) | low, medium, high |
| generated_output_id | UUID | FK generated_outputs.id |
| created_at | timestamp | Required |

### 18.4 audit_risks

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| audit_id | UUID | FK product_audits.id |
| risk_category | varchar(80) | data, security, integration, migration, adoption, scope, performance |
| title | varchar(255) | Required |
| description | text | Required |
| severity | varchar(30) | low, medium, high, critical |
| likelihood | varchar(30) | low, medium, high |
| mitigation | text | Required |
| source | varchar(80) | user_input, ai_generated, manual |
| created_at | timestamp | Required |

### 18.5 audit_roadmap_phases

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| audit_id | UUID | FK product_audits.id |
| phase_number | integer | Required |
| title | varchar(255) | Required |
| objective | text | Required |
| activities | jsonb | Array of activities |
| deliverables | jsonb | Array of deliverables |
| estimated_duration | varchar(120) | Optional |
| dependencies | jsonb | Optional array |
| risks | jsonb | Optional array |
| created_at | timestamp | Required |

### 18.6 audit_versions

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| audit_id | UUID | FK product_audits.id |
| version_number | integer | Required |
| snapshot | jsonb | Full audit snapshot |
| created_by_id | UUID | FK users.id |
| created_at | timestamp | Required |

---

## 19. APIs

### 19.1 Audit Session APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/product-audits | Create audit session |
| GET | /api/product-audits | List user's audits |
| GET | /api/product-audits/{id} | Get audit detail |
| PATCH | /api/product-audits/{id} | Update audit intake |
| DELETE | /api/product-audits/{id} | Archive audit |
| POST | /api/product-audits/{id}/validate | Validate readiness for generation |

### 19.2 Generation APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/product-audits/{id}/generate-health-score | Generate score |
| POST | /api/product-audits/{id}/generate-report | Generate audit report |
| POST | /api/product-audits/{id}/generate-recommendation | Generate rebuild recommendation |
| POST | /api/product-audits/{id}/generate-roadmap | Generate roadmap |
| POST | /api/product-audits/{id}/generate-risks | Generate risk matrix |
| GET | /api/product-audits/{id}/outputs | List generated outputs |
| POST | /api/product-audits/{id}/export | Export report |

### 19.3 Version APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/product-audits/{id}/versions | Create version snapshot |
| GET | /api/product-audits/{id}/versions | List versions |
| GET | /api/product-audits/{id}/versions/{version_id} | Read version |
| POST | /api/product-audits/{id}/compare | Compare two versions |

---

## 20. Health Score Design

### 20.1 Score Categories

| Category | Weight |
|---|---:|
| UX and usability | 15% |
| Architecture | 20% |
| Performance | 15% |
| Maintainability | 15% |
| Security | 15% |
| Scalability | 10% |
| Business alignment | 10% |

### 20.2 Scoring Inputs

- Number and severity of pain points.
- Age and complexity of technology stack.
- Known performance issues.
- Security concerns.
- Manual workflow dependency.
- Integration complexity.
- Data sensitivity.
- Business goal alignment.

### 20.3 Score Interpretation

| Score Range | Meaning |
|---|---|
| 80-100 | Healthy product; improve selectively |
| 60-79 | Stable but needs focused modernization |
| 40-59 | Significant issues; refactor or partial rebuild likely |
| 20-39 | High risk; rebuild or migration likely |
| 0-19 | Critical condition; immediate stabilization required |

---

## 21. AI Workflow Design

### 21.1 Product Audit Report Workflow

#### Input

```json
{
  "product_name": "string",
  "sector": "string",
  "description": "string",
  "target_users": [],
  "current_features": [],
  "pain_points": [],
  "tech_stack": {},
  "performance_issues": [],
  "security_concerns": [],
  "business_goals": [],
  "data_sensitivity": "medium"
}
```

#### Output Schema

```json
{
  "executive_summary": "string",
  "current_state_assessment": "string",
  "key_findings": ["string"],
  "ux_issues": ["string"],
  "technical_debt_indicators": ["string"],
  "workflow_gaps": ["string"],
  "security_concerns": ["string"],
  "scalability_concerns": ["string"],
  "recommended_next_steps": ["string"],
  "assumptions": ["string"],
  "missing_information": ["string"]
}
```

### 21.2 Rebuild Recommendation Workflow

#### Output Schema

```json
{
  "recommendation_type": "improve | refactor | rebuild | migrate | retire",
  "summary": "string",
  "reasoning": ["string"],
  "benefits": ["string"],
  "tradeoffs": ["string"],
  "risks": ["string"],
  "confidence_level": "low | medium | high"
}
```

### 21.3 Roadmap Workflow

#### Output Schema

```json
{
  "phases": [
    {
      "phase_number": 1,
      "title": "string",
      "objective": "string",
      "activities": ["string"],
      "deliverables": ["string"],
      "estimated_duration": "string",
      "dependencies": ["string"],
      "risks": ["string"]
    }
  ]
}
```

---

## 22. Background Jobs

| Job | Trigger | Purpose |
|---|---|---|
| audit_report_generation_job | User clicks generate report | Produce audit report |
| audit_recommendation_job | Report completed | Produce recommendation |
| audit_roadmap_job | Recommendation completed | Produce roadmap |
| audit_export_job | Export requested | Generate downloadable report |
| audit_version_snapshot_job | Major generation completed | Save version snapshot |

---

## 23. Security Design

- Audit data is private to the owner.
- All audit APIs require authentication.
- Admin users cannot view private audit details unless granted explicit access.
- Generated recommendations should include assumptions and should not be shown as guaranteed outcomes.
- Uploaded product documents must follow file validation and retention rules.
- Export links must expire or require authenticated access.

---

## 24. Testing Strategy

### 24.1 Unit Tests

- Intake validation rules.
- Health score calculation.
- Recommendation type mapping.
- Risk severity sorting.
- Roadmap phase ordering.

### 24.2 API Tests

- User can create and update own audit.
- User cannot access another user's audit.
- Generation APIs reject incomplete audits.
- Export API creates export record.

### 24.3 AI Evaluation Tests

- Audit report output matches schema.
- Recommendation type is one of allowed values.
- Roadmap contains required phases.
- Missing information is flagged when inputs are weak.

### 24.4 UI Tests

- Intake wizard saves draft state.
- Validation errors are shown clearly.
- Generated report page renders all sections.
- User can export report.

---

# Project 3: MVP Builder and Product Launch Kit

## 25. Project Purpose

The MVP Builder and Product Launch Kit converts a raw product idea into structured planning documents, including PRD, MVP scope, user stories, user flows, data entity suggestions, API module suggestions, sprint plan, and launch checklist.

---

## 26. Architecture

### 26.1 Module Components

```text
MVP Builder Frontend
  |-- Idea Intake Wizard
  |-- Generated PRD Viewer
  |-- Feature Prioritization Board
  |-- User Story Table
  |-- Development Blueprint View
  |-- Sprint Plan View
  |-- Launch Checklist View
  |-- Export Actions

MVP Builder Backend Service
  |-- MVP Plan CRUD
  |-- Idea Intake Validation
  |-- PRD Generator
  |-- Feature Prioritization Engine
  |-- User Story Generator
  |-- Blueprint Generator
  |-- Launch Checklist Generator

AI Orchestration Service
  |-- mvp_prd_generation
  |-- feature_prioritization
  |-- user_story_generation
  |-- development_blueprint_generation
  |-- launch_checklist_generation
```

### 26.2 Data Flow

```text
User enters idea
  -> Backend creates MVP plan draft
  -> User completes intake wizard
  -> Backend validates readiness
  -> AI generates PRD
  -> Feature scoring classifies MVP scope
  -> AI generates user stories
  -> AI suggests screens, entities, and API modules
  -> AI generates sprint plan and launch checklist
  -> User edits and exports planning pack
```

---

## 27. Project-Specific Database Schema

### 27.1 mvp_plans

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| owner_id | UUID | FK users.id |
| title | varchar(255) | Required |
| sector_id | UUID | Nullable FK sectors.id |
| product_idea | text | Required |
| problem_statement | text | Required |
| target_users | jsonb | Array |
| business_goals | jsonb | Array |
| user_pain_points | jsonb | Array |
| existing_alternatives | jsonb | Optional array |
| timeline | varchar(120) | Optional |
| budget_level | varchar(80) | low, medium, high, unknown |
| technical_constraints | jsonb | Optional array |
| compliance_notes | text | Optional |
| status | varchar(30) | draft, generated, archived |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 27.2 mvp_features

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| mvp_plan_id | UUID | FK mvp_plans.id |
| title | varchar(255) | Required |
| description | text | Required |
| source | varchar(50) | user_input, ai_generated, manual |
| business_value_score | integer | 1 to 5 |
| user_value_score | integer | 1 to 5 |
| effort_score | integer | 1 to 5 |
| risk_score | integer | 1 to 5 |
| dependency_score | integer | 1 to 5 |
| priority_bucket | varchar(50) | must_have, should_have, could_have, later, not_needed |
| reasoning | text | Optional |
| sort_order | integer | Required |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 27.3 mvp_user_stories

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| mvp_plan_id | UUID | FK mvp_plans.id |
| feature_id | UUID | Nullable FK mvp_features.id |
| persona | varchar(255) | Required |
| story | text | Required |
| acceptance_criteria | jsonb | Array |
| priority | varchar(50) | low, medium, high, critical |
| dependencies | jsonb | Optional array |
| edge_cases | jsonb | Optional array |
| suggested_tests | jsonb | Optional array |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 27.4 mvp_blueprint_entities

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| mvp_plan_id | UUID | FK mvp_plans.id |
| entity_name | varchar(120) | Required |
| description | text | Required |
| suggested_fields | jsonb | Array of field objects |
| relationships | jsonb | Optional array |
| created_at | timestamp | Required |

### 27.5 mvp_blueprint_api_modules

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| mvp_plan_id | UUID | FK mvp_plans.id |
| module_name | varchar(120) | Required |
| purpose | text | Required |
| endpoints | jsonb | Array of endpoint suggestions |
| auth_required | boolean | Default true |
| created_at | timestamp | Required |

### 27.6 mvp_sprint_items

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| mvp_plan_id | UUID | FK mvp_plans.id |
| sprint_number | integer | Required |
| title | varchar(255) | Required |
| description | text | Required |
| item_type | varchar(50) | setup, frontend, backend, AI, QA, deployment |
| priority | varchar(50) | low, medium, high |
| estimated_effort | varchar(80) | Optional |
| dependencies | jsonb | Optional |
| created_at | timestamp | Required |

### 27.7 launch_checklist_items

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| mvp_plan_id | UUID | FK mvp_plans.id |
| category | varchar(80) | product, engineering, QA, security, content, deployment, support |
| title | varchar(255) | Required |
| description | text | Optional |
| status | varchar(30) | pending, completed, skipped |
| sort_order | integer | Required |
| created_at | timestamp | Required |

---

## 28. APIs

### 28.1 MVP Plan APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/mvp-plans | Create MVP plan |
| GET | /api/mvp-plans | List user's MVP plans |
| GET | /api/mvp-plans/{id} | Get MVP plan detail |
| PATCH | /api/mvp-plans/{id} | Update idea intake |
| DELETE | /api/mvp-plans/{id} | Archive plan |
| POST | /api/mvp-plans/{id}/validate | Validate generation readiness |

### 28.2 Generation APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/mvp-plans/{id}/generate-prd | Generate PRD |
| POST | /api/mvp-plans/{id}/prioritize-features | Score and classify features |
| POST | /api/mvp-plans/{id}/generate-user-stories | Generate stories |
| POST | /api/mvp-plans/{id}/generate-blueprint | Generate screens, entities, and APIs |
| POST | /api/mvp-plans/{id}/generate-sprint-plan | Generate sprint plan |
| POST | /api/mvp-plans/{id}/generate-launch-checklist | Generate checklist |
| POST | /api/mvp-plans/{id}/export | Export planning pack |

### 28.3 Editing APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/mvp-plans/{id}/features | Add feature |
| PATCH | /api/mvp-features/{feature_id} | Update feature |
| DELETE | /api/mvp-features/{feature_id} | Delete feature |
| PATCH | /api/mvp-user-stories/{story_id} | Update user story |
| PATCH | /api/launch-checklist-items/{item_id} | Update checklist item status |

---

## 29. Feature Prioritization Design

### 29.1 Scoring Formula

```text
priority_score =
  (business_value_score * 0.30) +
  (user_value_score * 0.30) +
  ((6 - effort_score) * 0.15) +
  ((6 - risk_score) * 0.15) +
  ((6 - dependency_score) * 0.10)
```

### 29.2 Priority Bucket Rules

| Score | Bucket |
|---|---|
| 4.2 - 5.0 | Must Have |
| 3.4 - 4.19 | Should Have |
| 2.6 - 3.39 | Could Have |
| 1.8 - 2.59 | Later |
| 1.0 - 1.79 | Not Needed |

Manual override should be allowed and must store override reason.

---

## 30. AI Workflow Design

### 30.1 PRD Generation Workflow

#### Input

```json
{
  "product_idea": "string",
  "sector": "string",
  "target_users": [],
  "problem_statement": "string",
  "business_goals": [],
  "pain_points": [],
  "must_have_features": [],
  "nice_to_have_features": [],
  "timeline": "string",
  "constraints": []
}
```

#### Output Schema

```json
{
  "overview": "string",
  "problem_statement": "string",
  "goals": ["string"],
  "non_goals": ["string"],
  "personas": [
    {
      "name": "string",
      "description": "string",
      "needs": ["string"]
    }
  ],
  "user_journeys": ["string"],
  "mvp_scope": ["string"],
  "future_scope": ["string"],
  "functional_requirements": [
    {
      "id": "string",
      "requirement": "string",
      "priority": "must_have | should_have | could_have"
    }
  ],
  "acceptance_criteria": ["string"],
  "success_metrics": ["string"]
}
```

### 30.2 User Story Workflow

#### Output Schema

```json
{
  "stories": [
    {
      "feature_title": "string",
      "persona": "string",
      "story": "As a user, I want to...",
      "acceptance_criteria": ["string"],
      "dependencies": ["string"],
      "edge_cases": ["string"],
      "suggested_tests": ["string"]
    }
  ]
}
```

### 30.3 Development Blueprint Workflow

#### Output Schema

```json
{
  "screens": [
    {
      "name": "string",
      "purpose": "string",
      "primary_actions": ["string"]
    }
  ],
  "entities": [
    {
      "name": "string",
      "description": "string",
      "fields": [
        {
          "name": "string",
          "type": "string",
          "required": true
        }
      ],
      "relationships": ["string"]
    }
  ],
  "api_modules": [
    {
      "name": "string",
      "purpose": "string",
      "endpoints": ["string"]
    }
  ],
  "background_jobs": ["string"],
  "admin_features": ["string"]
}
```

---

## 31. Background Jobs

| Job | Trigger | Purpose |
|---|---|---|
| mvp_prd_generation_job | User clicks generate PRD | Generate structured PRD |
| feature_prioritization_job | Features saved or generated | Score features |
| user_story_generation_job | Feature prioritization completed | Generate user stories |
| blueprint_generation_job | PRD completed | Generate entities, screens, API modules |
| sprint_plan_generation_job | Blueprint completed | Generate sprint plan |
| mvp_export_job | Export requested | Generate planning pack |

---

## 32. Security Design

- MVP plans are private to owner.
- Generated planning outputs are editable but should retain original generated version.
- Exports require authenticated access.
- Public demo mode should use seeded sample data only.
- User-provided product ideas should not be exposed in public pages.

---

## 33. Testing Strategy

### 33.1 Unit Tests

- Idea intake validation.
- Priority score calculation.
- Feature bucket classification.
- Launch checklist status updates.
- Export markdown rendering.

### 33.2 API Tests

- User can create and update plan.
- User cannot access another user's plan.
- Generation APIs reject missing product idea.
- Feature editing persists correctly.

### 33.3 AI Evaluation Tests

- PRD output includes all required sections.
- User stories match selected MVP features.
- Blueprint entities are relevant to PRD.
- Launch checklist includes product, QA, security, and deployment categories.

### 33.4 UI Tests

- Intake wizard saves step progress.
- Generated PRD renders in sections.
- Feature board supports manual priority override.
- Export action creates downloadable file.

---

# Project 4: AI Document and Workflow Automation Platform

## 34. Project Purpose

The AI Document and Workflow Automation Platform converts uploaded or pasted business content into summaries, Q&A answers, risks, obligations, deadlines, action items, and reviewable workflow tasks.

---

## 35. Architecture

### 35.1 Module Components

```text
Document Workflow Frontend
  |-- Document Upload Screen
  |-- Document Library
  |-- Document Summary View
  |-- Document Q&A Panel
  |-- Risk and Obligation View
  |-- Draft Task Review Board
  |-- Approved Task Board
  |-- Export Actions

Document Workflow Backend Service
  |-- Document CRUD
  |-- File Validation
  |-- Text Extraction
  |-- Chunking and Indexing
  |-- Summary Generator
  |-- Document Q&A
  |-- Risk Extraction
  |-- Task Extraction
  |-- Task Review and Approval

Background Worker
  |-- File Processing
  |-- Embedding Generation
  |-- Summary Generation
  |-- Extraction Jobs
  |-- Export Jobs
```

### 35.2 Data Flow

```text
User uploads document or pastes text
  -> Backend validates input
  -> File stored in object storage
  -> Worker extracts text
  -> Worker creates document sections
  -> Worker creates embeddings when Q&A is enabled
  -> User requests summary, Q&A, risks, or task extraction
  -> AI workflow generates structured output
  -> Extracted tasks are saved as draft tasks
  -> User reviews and approves tasks
  -> User exports summary, risks, or tasks
```

---

## 36. Project-Specific Database Schema

### 36.1 documents

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| owner_id | UUID | FK users.id |
| uploaded_file_id | UUID | Nullable FK uploaded_files.id |
| title | varchar(255) | Required |
| document_type | varchar(80) | report, policy, contract, note, transcript, brief, unknown |
| source_type | varchar(50) | upload, pasted_text |
| raw_text | text | Nullable if content stored only in sections |
| status | varchar(30) | draft, processing, ready, failed, archived |
| processing_error | text | Nullable |
| metadata | jsonb | Page count, word count, parser details |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

### 36.2 document_sections

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| document_id | UUID | FK documents.id |
| section_index | integer | Required |
| heading | varchar(255) | Optional |
| content | text | Required |
| page_start | integer | Optional |
| page_end | integer | Optional |
| token_count | integer | Optional |
| embedding | vector | Nullable depending on vector setup |
| created_at | timestamp | Required |

### 36.3 document_questions

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| document_id | UUID | FK documents.id |
| asked_by_id | UUID | FK users.id |
| question | text | Required |
| answer | text | Required |
| cited_sections | jsonb | Array of document_section IDs and snippets |
| confidence_level | varchar(30) | low, medium, high |
| created_at | timestamp | Required |

### 36.4 document_summaries

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| document_id | UUID | FK documents.id |
| summary_type | varchar(80) | executive, bullet, detailed, one_page, role_specific |
| role_context | varchar(120) | Optional |
| structured_summary | jsonb | Parsed output |
| markdown_summary | text | Rendered output |
| generated_output_id | UUID | FK generated_outputs.id |
| created_at | timestamp | Required |

### 36.5 document_risks

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| document_id | UUID | FK documents.id |
| title | varchar(255) | Required |
| description | text | Required |
| category | varchar(80) | deadline, payment, responsibility, compliance, missing_info, dependency, wording, other |
| severity | varchar(30) | low, medium, high, critical |
| source_section_id | UUID | Nullable FK document_sections.id |
| source_quote | text | Short supporting excerpt |
| recommendation | text | Optional |
| created_at | timestamp | Required |

### 36.6 workflow_tasks

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| owner_id | UUID | FK users.id |
| document_id | UUID | Nullable FK documents.id |
| title | varchar(255) | Required |
| description | text | Required |
| priority | varchar(30) | low, medium, high, urgent |
| status | varchar(30) | draft, approved, in_progress, blocked, completed |
| assigned_to_label | varchar(255) | Optional placeholder |
| due_date | date | Optional |
| category | varchar(80) | follow_up, review, approval, delivery, finance, compliance, other |
| source_section_id | UUID | Nullable FK document_sections.id |
| source_reference | text | Optional |
| created_from | varchar(80) | ai_extraction, manual |
| approved_by_id | UUID | Nullable FK users.id |
| approved_at | timestamp | Nullable |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

---

## 37. APIs

### 37.1 Document APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/documents/upload | Upload document |
| POST | /api/documents/pasted-text | Create document from pasted text |
| GET | /api/documents | List user's documents |
| GET | /api/documents/{id} | Get document detail |
| DELETE | /api/documents/{id} | Archive document |
| GET | /api/documents/{id}/sections | List document sections |

### 37.2 AI Document APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/documents/{id}/generate-summary | Generate document summary |
| POST | /api/documents/{id}/ask | Ask question over document |
| POST | /api/documents/{id}/extract-risks | Extract risks and obligations |
| POST | /api/documents/{id}/extract-tasks | Extract draft tasks |
| GET | /api/documents/{id}/summaries | List summaries |
| GET | /api/documents/{id}/risks | List risks |

### 37.3 Workflow Task APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/workflow-tasks | List tasks |
| POST | /api/workflow-tasks | Create manual task |
| PATCH | /api/workflow-tasks/{id} | Update task |
| POST | /api/workflow-tasks/{id}/approve | Approve draft task |
| POST | /api/workflow-tasks/bulk-approve | Approve multiple draft tasks |
| DELETE | /api/workflow-tasks/{id} | Delete task |
| POST | /api/documents/{id}/export | Export document intelligence report |

---

## 38. Document Processing Design

### 38.1 File Validation

Validation rules:

- Allowed extensions only.
- Allowed MIME types only.
- Maximum file size configurable.
- Reject encrypted or unreadable files.
- Reject empty extracted text.

### 38.2 Text Extraction Flow

```text
Uploaded file
  -> Validate file
  -> Store original file
  -> Extract text
  -> Normalize whitespace
  -> Detect title and document type
  -> Split into sections
  -> Save sections
  -> Generate embeddings if Q&A enabled
  -> Mark document ready
```

### 38.3 Chunking Rules

- Split by headings when available.
- If headings are unavailable, split by approximate token count.
- Preserve page references when available.
- Avoid splitting tables in the middle when possible.
- Store section index for citation and traceability.

---

## 39. AI Workflow Design

### 39.1 Summary Workflow

#### Input

```json
{
  "document_id": "uuid",
  "summary_type": "executive",
  "role_context": "finance reviewer",
  "document_sections": []
}
```

#### Output Schema

```json
{
  "summary_title": "string",
  "executive_summary": "string",
  "key_points": ["string"],
  "decisions": ["string"],
  "risks": ["string"],
  "action_items": ["string"],
  "missing_information": ["string"],
  "recommended_next_steps": ["string"]
}
```

### 39.2 Document Q&A Workflow

#### Retrieval

- Embed user question.
- Search document sections by vector similarity and keyword fallback.
- Use top sections as context.
- Return answer with cited section references.

#### Output Schema

```json
{
  "answer": "string",
  "cited_sections": [
    {
      "section_id": "uuid",
      "reason": "string"
    }
  ],
  "confidence_level": "low | medium | high",
  "limitations": "string"
}
```

### 39.3 Risk Extraction Workflow

#### Output Schema

```json
{
  "risks": [
    {
      "title": "string",
      "description": "string",
      "category": "deadline | payment | responsibility | compliance | missing_info | dependency | wording | other",
      "severity": "low | medium | high | critical",
      "source_reference": "string",
      "recommendation": "string"
    }
  ]
}
```

### 39.4 Task Extraction Workflow

#### Output Schema

```json
{
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "priority": "low | medium | high | urgent",
      "assigned_to_label": "string",
      "due_date": "YYYY-MM-DD or null",
      "category": "follow_up | review | approval | delivery | finance | compliance | other",
      "source_reference": "string"
    }
  ]
}
```

---

## 40. Background Jobs

| Job | Trigger | Purpose |
|---|---|---|
| file_processing_job | Document uploaded | Extract text and metadata |
| document_chunking_job | Text extracted | Create document sections |
| document_embedding_job | Sections created | Generate vector embeddings |
| summary_generation_job | User requests summary | Generate summary |
| risk_extraction_job | User requests risks | Extract risks |
| task_extraction_job | User requests tasks | Create draft tasks |
| document_export_job | Export requested | Generate document intelligence report |
| file_retention_cleanup_job | Scheduled | Delete expired files if configured |

---

## 41. Security Design

- Documents are private to owner.
- File downloads require authenticated access and ownership check.
- Extracted text must not be added to public portfolio content.
- Q&A retrieval must be scoped to the selected document or workspace.
- Task approval must be explicit.
- Deleted files should be soft-deleted first, then physically removed by retention job.
- Generated outputs should include source references where possible.
- Large files should be scanned and validated before processing.

---

## 42. Testing Strategy

### 42.1 Unit Tests

- File type validation.
- Text normalization.
- Section chunking.
- Task status transitions.
- Risk severity sorting.

### 42.2 API Tests

- User can upload supported document.
- Unsupported file type is rejected.
- User cannot access another user's document.
- Q&A rejects document that is not ready.
- Task approval updates status and approval metadata.

### 42.3 AI Evaluation Tests

- Summary contains required fields.
- Q&A answer cites document sections.
- Risk extraction returns valid categories.
- Task extraction returns draft tasks only.
- Model output is rejected when schema validation fails.

### 42.4 UI Tests

- Upload progress is shown.
- Processing status updates are visible.
- Summary page renders cleanly.
- Draft task review allows edit, delete, approve.
- Export button creates file.

---

# Shared Deployment Design

## 43. Environment Strategy

Use three environments:

| Environment | Purpose |
|---|---|
| Local | Developer workstations and feature development |
| Staging | QA, demo review, sample data validation |
| Production | Public portfolio and stable demos |

---

## 44. Environment Variables

| Variable | Purpose |
|---|---|
| APP_ENV | local, staging, production |
| DATABASE_URL | PostgreSQL connection |
| REDIS_URL | Queue and cache |
| STORAGE_BACKEND | local or object_storage |
| STORAGE_BUCKET | Object storage bucket |
| AI_MODEL_GATEWAY_URL | Model gateway endpoint |
| AI_MODEL_API_KEY | Secret key for configured provider |
| MAX_UPLOAD_SIZE_MB | File upload limit |
| JWT_SECRET or SESSION_SECRET | Auth signing secret |
| EXPORT_STORAGE_PREFIX | Export file path prefix |
| CORS_ALLOWED_ORIGINS | Allowed frontend origins |
| LOG_LEVEL | Logging verbosity |

Secrets must be managed through environment-level secret storage and must not be committed to the repository.

---

## 45. Docker Services

Recommended containers:

| Service | Purpose |
|---|---|
| frontend | Web application |
| backend | API server |
| worker | Background jobs |
| postgres | Database |
| redis | Queue and cache |
| object-storage | Optional local object storage for development |

---

## 46. CI/CD Pipeline

### 46.1 Pull Request Checks

- Install dependencies.
- Run linting.
- Run type checks.
- Run unit tests.
- Run API tests.
- Build frontend.
- Validate database migrations.

### 46.2 Staging Deployment

- Build images.
- Apply migrations.
- Deploy backend, frontend, and worker.
- Run smoke tests.
- Seed demo data if needed.
- Verify AI workflows with test templates.

### 46.3 Production Deployment

- Build immutable release image.
- Backup database before migrations.
- Apply migrations.
- Deploy backend and worker.
- Deploy frontend.
- Run health checks.
- Verify public portfolio pages.
- Verify sample project demo paths.

---

## 47. Database Migration Strategy

- Use versioned migrations.
- Never edit already-applied production migrations.
- Back up database before destructive changes.
- Use nullable columns for phased releases when possible.
- Backfill data through controlled migration jobs.
- Add indexes after measuring query needs.
- Validate migration on staging before production.

---

## 48. Monitoring and Logging

### 48.1 Logs

Log these events with structured metadata:

- API errors
- AI generation failures
- Background job failures
- File processing failures
- Authentication failures
- Export failures
- Permission denials

### 48.2 Health Checks

Required endpoints:

| Endpoint | Purpose |
|---|---|
| /health | Basic API health |
| /health/database | Database connectivity |
| /health/queue | Queue connectivity |
| /health/storage | Storage connectivity |
| /health/ai | AI model gateway connectivity |

### 48.3 Metrics

Track:

- API latency
- Background job duration
- AI generation duration
- File processing duration
- Failed job count
- Export count
- Assistant query count
- Document upload count

---

# Development Plan

## 49. Implementation Milestones

### Milestone 1: Platform Foundation

- Project setup.
- Database setup.
- Authentication and roles.
- Base frontend layout.
- Admin shell.
- Shared sectors and skills.
- File upload foundation.
- Prompt template model.

### Milestone 2: Portfolio Platform

- Public landing page.
- Team member pages.
- Project pages.
- Case study pages.
- Admin CMS.
- Project filtering.
- Portfolio content indexing.

### Milestone 3: AI Portfolio Assistant

- Approved content chunking.
- Portfolio assistant API.
- Retrieval workflow.
- Assistant UI.
- Unsupported-claim guardrails.

### Milestone 4: Product Audit Planner

- Audit intake wizard.
- Health score engine.
- Report generation.
- Recommendation generation.
- Risk matrix.
- Roadmap.
- Export.

### Milestone 5: MVP Builder

- Idea intake wizard.
- PRD generation.
- Feature prioritization.
- User stories.
- Development blueprint.
- Sprint plan.
- Launch checklist.
- Export.

### Milestone 6: Document Workflow Automation

- Document upload.
- Text extraction.
- Section chunking.
- Summary generation.
- Document Q&A.
- Risk extraction.
- Draft task extraction.
- Task approval.
- Export.

### Milestone 7: Demo Readiness and QA

- Seed sample data.
- Add demo documents.
- Add screenshots and placeholders.
- Complete regression testing.
- Optimize public pages.
- Validate security rules.
- Prepare deployment checklist.

---

## 50. MVP Cutline

### 50.1 Must Build

- Authentication and roles.
- Public portfolio pages.
- Admin CMS for team, projects, case studies.
- Portfolio assistant using approved content.
- Product audit intake and report generation.
- MVP builder intake and PRD generation.
- Document upload, summary, Q&A, and task extraction.
- Markdown export.
- Demo data for four target sectors.

### 50.2 Should Build

- PDF export.
- Project capability summary export.
- Audit version snapshots.
- Feature priority board.
- Risk matrix editing.
- Bulk task approval.

### 50.3 Later

- Real-time collaboration.
- Advanced analytics.
- Multi-tenant enterprise workspaces.
- Native mobile app.
- Third-party workflow integrations.
- Full document redlining.
- Automated code generation.

---

## 51. Final Development Readiness Checklist

Before starting development, confirm:

- Repository structure is finalized.
- Backend and frontend stack are finalized.
- Database migration tool is selected.
- Queue worker system is selected.
- Object storage approach is selected.
- AI model gateway configuration is selected.
- Authentication method is finalized.
- Seed demo data is prepared.
- Prompt templates are written for MVP workflows.
- JSON output schemas are added to the codebase.
- API routes are mapped to engineering tickets.
- UI design document is prepared before frontend implementation.

---

## 52. Suggested Next Document

The next required document should be a UI Design Document in markdown. It should define the design system, layout hierarchy, wireframe pattern, page structure, component library, typography, color schema, spacing system, interaction states, responsive behavior, and screen-by-screen wireframe notes for all four projects.
