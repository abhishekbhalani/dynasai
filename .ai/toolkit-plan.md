# Toolkit & positioning plan

Reference: [Tiger Analytics](https://www.tigeranalytics.com/) (consulting + Open IP) and [TigerML](https://www.tigeranalytics.com/open-ip/foundation/tigerml/) (ML practitioner toolkit).

## TigerML — where to get it

**Tiger Analytics TigerML is not a public pip/npm download.** It is proprietary "Open IP" — reusable accelerators delivered to clients through consulting engagements. Access paths:

| Channel | How |
|--------|-----|
| Marketing | [tigeranalytics.com/open-ip/foundation/tigerml](https://www.tigeranalytics.com/open-ip/foundation/tigerml/) |
| Brochure | ML Core PDF on their site |
| Actual toolkit | Client engagement / Tiger delivery team |
| GitHub | **Not** Tiger Analytics — unrelated repos (tigerlab-ai/tiger, etc.) |

TigerML modules: data exploration, feature engineering, modeling (AutoML/templates), evaluation/explainability, deployment/monitoring.

## DynasAI positioning vs Tiger

| Dimension | Tiger Analytics | DynasAI |
|-----------|-----------------|---------|
| Scale | ~5k people, enterprise consulting | Studio + platform (smaller, focused) |
| Core offer | Analytics + ML + agentic services | Agent platform + delivery studio |
| IP model | Client-only Open IP (TigerML, AI Hub) | Public docs + workspace + planned SDK |
| Era | Classic ML/MLOps + agentic add-on | Agent-native from day one |

**Do not copy Tiger's scale claims or fake leadership.** Differentiate on platform + modular public toolkit.

## Services mapping (implemented on `/pricing`)

1. **Strategy & Advisory** ← Tiger Strategy & Advisory
2. **Agent & Application Engineering** ← Tiger Differentiate with AI/ML
3. **Data & Integration Foundation** ← Tiger Engineer Your Data (lighter)
4. **Operate & Scale** ← Tiger Operationalize Insights / MLOps

## Dynas Toolkit — build plan

### Phase 1 — Marketing (done)
- [x] `/platform/toolkit` page
- [x] Homepage + services copy rewrite
- [x] Nav links to toolkit

### Phase 2 — Docs & templates (2–4 weeks)
- [ ] MDX docs per module (explore, build, evaluate, deploy)
- [ ] 3–5 agent workflow templates (support, ops, research)
- [ ] Eval checklist + sample eval dataset format

### Phase 3 — SDK preview (4–8 weeks)
- [ ] `@dynasai/toolkit` npm package: template loader, eval helpers, trace export
- [ ] GitHub public repo for blueprints (YAML/JSON workflows)
- [ ] CI example: deploy agent via API from GitHub Actions

### Phase 4 — Workbench in app.dynasai.ai (8–16 weeks)
- [ ] Knowledge/context workbench UI
- [ ] Visual workflow studio (Stitch designs → app)
- [ ] Eval leaderboard + side-by-side comparison
- [ ] Deployment pipelines + drift monitors

### Phase 5 — Operated offering
- [ ] AgentOps retainer SKU tied to monitoring in platform
- [ ] SLAs for eval regression, incident response

## Can we build this?

**Yes — phased and realistic:**

| TigerML capability | DynasAI equivalent | Feasibility |
|--------------------|-------------------|-------------|
| Data exploration workbench | Knowledge/context workbench + RAG eval | High (Phase 4) |
| Feature engineering | Tool connectors + data prep pipelines | Medium |
| Modeling / AutoML | Agent template library + model routing | High (agent era) |
| Eval / explainability | Trace logs + eval suites | High (Phase 2–3) |
| Deploy / monitor | app.dynasai.ai + Workers | High (core product) |

**Start now:** content + docs + 2 templates. **Defer:** AutoML-style genetic search, PySpark feature store — not core to agentic positioning.

## Content changes (2026-08-17)

- Homepage: studio + platform dual motion, service pillars, toolkit CTA
- `/pricing`: renamed positioning to Services with 4 pillars + engagement table
- `/platform/toolkit`: TigerML-style module page with access channels
