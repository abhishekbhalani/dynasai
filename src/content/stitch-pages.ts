/** Stitch screen content — routes mapped to `.stitch/` HTML exports. */

export type MarketingSection =
  | { type: 'split'; title: string; paragraphs: string[] }
  | { type: 'stats'; title: string; subtitle?: string; items: { value: string; label: string; source?: string }[] }
  | { type: 'grid'; title: string; subtitle?: string; items: { title: string; body: string; href?: string; icon?: string }[] }
  | { type: 'numbered'; title: string; subtitle?: string; items: { num: string; title: string; body: string; icon?: string }[] }
  | { type: 'cta'; title: string; body: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } };

export type MarketingPage = {
  title: string;
  description: string;
  badge?: string;
  headline: string;
  highlight?: string;
  subhead: string;
  breadcrumb?: { label: string; href: string }[];
  sections: MarketingSection[];
};

export const seoServices = [
  {
    label: 'Multi-Cloud AI Platform',
    description: 'One front layer on AWS, Azure, or GCP — you choose the backend.',
    href: '/platform/intelligence',
  },
  {
    label: 'Data Ingestion & Processing',
    description: 'Collect raw data from any source, evaluate quality, and prepare for AI.',
    href: '/platform/data-processing',
  },
  {
    label: 'Agent & Workflow Automation',
    description: 'Governed agents with human approval gates and audit trails.',
    href: '/pricing#engineering',
  },
  {
    label: 'Cloud Strategy & Cost Optimization',
    description: 'Right-size AWS, Azure, or GCP for your automation workloads.',
    href: '/pricing#strategy',
  },
  {
    label: 'GDPR & US Compliance',
    description: 'EU privacy, US enterprise standards, and customer data control.',
    href: '/platform/governance',
  },
  {
    label: 'Insurance AI Solutions',
    description: 'Underwriting, claims, and telematics agent automation.',
    href: '/solutions/insurance',
  },
  {
    label: 'Financial Services AI',
    description: 'Risk, compliance, and regulated workflow automation.',
    href: '/solutions/financial-services',
  },
  {
    label: 'Dynas Toolkit',
    description: 'Templates, evals, and pipelines for faster delivery.',
    href: '/platform/toolkit',
  },
] as const;

export const solutionsHub: MarketingPage = {
  title: 'Industry Solutions',
  description: 'AI automation solutions for insurance, financial services, healthcare, manufacturing, and more.',
  badge: 'Industries',
  headline: 'AI automation across',
  highlight: 'industries',
  subhead: 'Industry-specific agent patterns, integrations, and delivery playbooks — built on one governed platform.',
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/solutions' },
  ],
  sections: [
    {
      type: 'grid',
      title: 'Industries we serve',
      subtitle: 'Start with a proven vertical playbook, then customize on the DynasAI workspace.',
      items: [
        { title: 'Insurance', body: 'Data streamlining for underwriting, claims, and telematics — on your cloud.', href: '/solutions/insurance' },
        { title: 'Financial Services', body: 'Risk assessment, compliance workflows, and customer operations.', href: '/solutions/financial-services' },
        { title: 'Healthcare', body: 'Clinical ops, prior auth, and document intelligence at scale.', href: '/contact' },
        { title: 'Manufacturing', body: 'Supply chain agents, quality inspection, and planning automation.', href: '/contact' },
        { title: 'Retail & CPG', body: 'Demand forecasting, merchandising insights, and service automation.', href: '/contact' },
        { title: 'Technology & Media', body: 'Product ops, support automation, and content workflows.', href: '/contact' },
      ],
    },
    {
      type: 'cta',
      title: 'Need a vertical not listed?',
      body: 'Our studio team ships custom agent programs on the same platform and toolkit.',
      primary: { label: 'Talk to an expert', href: '/contact' },
      secondary: { label: 'View impact stories', href: '/impact' },
    },
  ],
};

export const financialServices: MarketingPage = {
  title: 'Financial Services AI Solutions',
  description: 'Governed AI agents for banking, insurance, and capital markets — risk, compliance, and customer operations.',
  badge: 'Financial Services',
  headline: 'Transform financial operations with',
  highlight: 'governed AI agents',
  subhead: 'From KYC and risk scoring to customer service and reporting — automate with audit-ready controls.',
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Financial Services', href: '/solutions/financial-services' },
  ],
  sections: [
    {
      type: 'split',
      title: 'AI for regulated financial workflows',
      paragraphs: [
        'Financial institutions face rising compliance burden, fragmented data, and pressure to modernize customer experience. Agentic automation helps teams move faster without sacrificing control.',
        'DynasAI combines platform governance, enterprise integrations, and delivery expertise so you can deploy agents for risk, operations, and customer workflows on one stack.',
      ],
    },
    {
      type: 'numbered',
      title: 'What we deliver',
      items: [
        { num: '01', title: 'KYC & onboarding automation', body: 'Accelerate identity verification and document collection with human review gates.' },
        { num: '02', title: 'Risk & fraud detection', body: 'Orchestrate models and rules with real-time agent workflows and explainability.' },
        { num: '03', title: 'Regulatory reporting', body: 'Extract, validate, and assemble reporting packages with traceable pipelines.' },
        { num: '04', title: 'Customer service agents', body: 'Resolve inquiries with governed tool access to core banking and CRM systems.' },
        { num: '05', title: 'Credit & underwriting assist', body: 'Prefill applications, summarize financials, and route exceptions to analysts.' },
        { num: '06', title: 'Model & agent operations', body: 'Monitor drift, run evals, and maintain production agents in regulated environments.' },
      ],
    },
    {
      type: 'cta',
      title: 'Modernize financial workflows with governed agents',
      body: 'Connect with our team to scope a pilot or full production program.',
      primary: { label: 'Let\'s connect', href: '/contact' },
      secondary: { label: 'Explore platform', href: '/platform/intelligence' },
    },
  ],
};

export const impactPage: MarketingPage = {
  title: 'Impact',
  description:
    'How DynasAI streamlines industry data and runs governed agents on AWS, Azure, or GCP you already use — without claiming third-party case stats as our own.',
  badge: 'Impact',
  headline: 'Industry data, streamlined.',
  highlight: 'Automation you can audit.',
  subhead:
    'We publish patterns and platform capabilities. Named ROI stays off this site until we have permissioned DynasAI outcomes.',
  sections: [
    {
      type: 'grid',
      title: 'What we put in production',
      items: [
        { title: 'Insurance data streamlining', body: 'Collect policy, claims, and documents; evaluate quality; then automate with governed agents on your cloud.', href: '/solutions/insurance' },
        { title: 'Underwriting context layer', body: 'One working packet for submissions — systems of record stay in your AWS, Azure, or GCP account.', href: '/solutions/insurance/playbook' },
        { title: 'Claims intake without shadow copies', body: 'FNOL and correspondence processed in place, with evals and human gates.', href: '/platform/data-processing' },
        { title: 'Regulated operations', body: 'GDPR / US privacy patterns, audit logs, and no public-model training on customer content.', href: '/platform/governance' },
      ],
    },
    {
      type: 'cta',
      title: 'Ready to build your case study?',
      body: 'Start with a discovery sprint or toolkit pilot on app.dynasai.ai.',
      primary: { label: 'Contact sales', href: '/contact' },
      secondary: { label: 'View services', href: '/pricing' },
    },
  ],
};

export const partnersPage: MarketingPage = {
  title: 'Cloud Partners — AWS, Azure & GCP',
  description:
    'DynasAI is the front layer for enterprise AI. Backend services run on Amazon Web Services, Microsoft Azure, or Google Cloud — in your account or a managed template, with cost-aware architecture.',
  badge: 'Partners',
  headline: 'Your cloud. Our front layer.',
  highlight: 'No lock-in.',
  subhead:
    'Customers choose AWS, Azure, or GCP for compute, storage, and models. DynasAI makes agents, data processing, and governance easy on top — with residency and cost recommendations, not a forced hyperscaler.',
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Partners', href: '/partners' },
  ],
  sections: [
    {
      type: 'stats',
      title: 'Why enterprises keep three clouds in play',
      subtitle:
        'Agent workloads follow data gravity, identity, and sovereignty — not a single vendor logo. We architect for the mix you already have.',
      items: [
        { value: '3', label: 'Primary backends we design for: AWS, Azure, and Google Cloud' },
        { value: 'BYO', label: 'Bring your own VPC, tenant, or data lake — or start from a managed template' },
        { value: 'EU / US', label: 'Region and residency follow your GDPR or US privacy requirements' },
        { value: 'Cost', label: 'We recommend the cheaper fit for each workload — models, storage, and pipelines' },
      ],
    },
    {
      type: 'split',
      title: 'Simple for users. Serious in the backend.',
      paragraphs: [
        'Business and engineering teams work in DynasAI: visual workflows, data evaluation, templates, and audit trails. They should not have to assemble Bedrock, Vertex, and Azure OpenAI by hand.',
        'Underneath, we wire the hyperscaler you select. Identity can follow Entra ID, IAM, or Cloud Identity. Data can stay in S3, ADLS, or GCS / BigQuery. Models stay behind your private endpoints. That is how we avoid lock-in and keep customer data control.',
      ],
    },
    {
      type: 'grid',
      title: 'Hyperscaler backends',
      subtitle: 'We suggest the cost-effective service mix for each use case — you approve the account and region.',
      items: [
        {
          title: 'Amazon Web Services',
          body: 'Bedrock, S3, Lambda, VPC, KMS, and PrivateLink-style patterns for agents and pipelines in your AWS account.',
          href: '/platform/data-processing',
          icon: 'aws',
        },
        {
          title: 'Microsoft Azure',
          body: 'Azure OpenAI, Entra ID, Fabric / ADLS, and enterprise app connectors for teams already on Microsoft 365.',
          href: '/platform/governance',
          icon: 'azure',
        },
        {
          title: 'Google Cloud',
          body: 'Vertex AI, BigQuery, Cloud Storage, and document AI-style processing for analytics-heavy estates.',
          href: '/platform/data-processing',
          icon: 'gcp',
        },
        {
          title: 'Databricks',
          body: 'Lakehouse context and model ops alongside the DynasAI front layer — not a replacement for your lake.',
          icon: 'database',
        },
        {
          title: 'Snowflake',
          body: 'Secure data sharing and warehouse retrieval so agents read governed tables instead of shadow copies.',
          icon: 'database',
        },
        {
          title: 'Enterprise SaaS',
          body: 'Salesforce, ServiceNow, SAP, and custom APIs — connected with identity-aware tool access.',
          href: '/platform/integrations',
          icon: 'plug',
        },
      ],
    },
    {
      type: 'numbered',
      title: 'How we pick a cost-effective stack',
      subtitle: 'Advisory first, then implementation on the same platform you will operate.',
      items: [
        { num: '01', title: 'Map data gravity', body: 'Where the raw sources already live usually wins. Moving petabytes to a new cloud is rarely the cheapest AI plan.' },
        { num: '02', title: 'Match identity & compliance', body: 'Entra-centric enterprises often stay on Azure. GDPR residency may pin EU data to EU regions on any of the three.' },
        { num: '03', title: 'Right-size models & pipelines', body: 'Batch processing, RAG indexes, and agent calls have different cost curves. We recommend managed vs self-hosted per workload.' },
        { num: '04', title: 'Keep an exit ramp', body: 'Open connectors, your VPC, and no training on your corpus. Switching a model provider should not mean rewriting the business layer.' },
      ],
    },
    {
      type: 'grid',
      title: 'Engagement models',
      items: [
        { title: 'Customer-owned cloud', body: 'Agents and data processing run in your AWS, Azure, or GCP project. DynasAI is the control plane you log into.', icon: 'key' },
        { title: 'Managed template', body: 'We provision a reference architecture in a dedicated tenant. You still choose region and can migrate to BYO later.', icon: 'layers' },
        { title: 'Hybrid', body: 'Sensitive stores stay on-prem or private cloud; the front layer and selected models run in public cloud with private networking.', icon: 'globe' },
        { title: 'SI & ISV partners', body: 'Systems integrators and software vendors can co-deliver on DynasAI. Talk to us about a partner motion.', icon: 'users' },
      ],
    },
    {
      type: 'cta',
      title: 'Get a cloud and residency recommendation',
      body: 'Bring your current AWS, Azure, or GCP footprint. We will map a cost-aware architecture and a governed DynasAI front layer.',
      primary: { label: 'Talk to an expert', href: '/contact' },
      secondary: { label: 'Governance & GDPR', href: '/platform/governance' },
    },
  ],
};

export const governancePage: MarketingPage = {
  title: 'Governance, GDPR & Security',
  description:
    'Governed AI agents with GDPR, EU AI Act, NIS2, and US privacy controls. Customer data stays on AWS, Azure, or GCP — with audit trails, human oversight, and residency you choose.',
  badge: 'Platform',
  headline: 'One evidence pack for GDPR,',
  highlight: 'AI Act, and US privacy',
  subhead:
    'The AI Act does not replace GDPR. DynasAI is the front layer that logs, redacts, and gates agents so EU and US teams can prove control — while compute and data stay on the cloud you choose.',
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Platform', href: '/platform/intelligence' },
    { label: 'Governance', href: '/platform/governance' },
  ],
  sections: [
    {
      type: 'stats',
      title: 'The 2026 compliance clock',
      subtitle:
        'Enterprises now face stacked EU duties plus a US state-privacy patchwork. Buyers want continuous evidence, not a one-time policy PDF.',
      items: [
        { value: '2 Aug 2026', label: 'EU AI Act general application and Article 50 transparency duties', source: 'European Commission AI Act timeline' },
        { value: '72h', label: 'GDPR Article 33 breach notification window when personal data is involved', source: 'GDPR Art. 33' },
        { value: '24h / 72h', label: 'NIS2 early warning and formal incident reporting for essential entities', source: 'NIS2 incident-reporting duties' },
        { value: '7%', label: 'maximum AI Act fine of global turnover (or €35M) for prohibited practices', source: 'EU AI Act penalty framework' },
      ],
    },
    {
      type: 'split',
      title: 'GDPR still applies. The AI Act adds more.',
      paragraphs: [
        'Today: any personal data in training, prompts, retrieval, or monitoring still needs a GDPR legal basis, minimization, purpose limits, and data-subject rights. DPIAs (Art. 35) sit alongside AI Act fundamental-rights assessments where those apply. Article 22 protections against solely automated decisions still require a human path. Transparency duties under AI Act Article 50 — chatbot disclosure, synthetic-content marking — apply from 2 August 2026.',
        'Next: high-risk obligations (logging, human oversight, data governance, technical documentation) are the operating system for credit, insurance, employment, and essential services. Annex III high-risk duties are widely expected toward December 2027, with product-embedded systems later — but insurance and financial deployers should not pause FRIA and logging work. In the US, CCPA/CPRA plus 20+ state laws, plus SOC 2 Type II as a procurement default, demand encryption, access logs, and proof that customer data is not used to train public models.',
      ],
    },
    {
      type: 'grid',
      title: 'Where governance programs fail',
      subtitle: 'Policy binders and three separate incident templates do not survive a real event. Technical controls have to produce one evidence trail.',
      items: [
        { title: 'Three reports, one incident', body: 'GDPR, NIS2, and AI Act Article 73 can all fire on the same agent failure. Separate spreadsheets produce inconsistent facts.' },
        { title: 'No legal basis for AI data', body: 'The AI Act does not create a GDPR legal basis. Training and monitoring still need Art. 6 — and a record of processing.' },
        { title: 'Logs that cannot answer SAR', body: 'Subject access, deletion, and CCPA “right to know” fail when prompts, retrieval, and tool calls are not queryable.' },
        { title: 'Human oversight on paper', body: 'High-risk and Art. 22 workflows need named reviewers with authority — not a checkbox after the agent already acted.' },
        { title: 'Cloud lock-in vs residency', body: 'EU customers need EU residency options; US customers need SOC-aligned tenants. One vendor region is not a strategy.' },
        { title: 'Point-in-time audits', body: 'SOC 2 Type II and ongoing GDPR duties expect continuous evidence: policy versions, redactions, and tool-call history.' },
      ],
    },
    {
      type: 'numbered',
      title: 'Controls DynasAI runs in the front layer',
      subtitle: 'You keep data in AWS, Azure, or GCP. We make the agent surface governable: identity, policy, logs, and eval gates.',
      items: [
        { num: '01', title: 'Identity & scoped access', body: 'SSO, RBAC/ABAC, and environment-scoped agent permissions so retrieval inherits the user’s rights — not a shared service account.' },
        { num: '02', title: 'Minimization & redaction', body: 'Block, redact, or escalate PII and sensitive categories before prompts and tool calls leave your tenant.' },
        { num: '03', title: 'Immutable traces', body: 'Log prompts, retrieved sources, tool calls, policy version, and human overrides. Retention aligned to six-month+ AI Act logging and SOC evidence windows.' },
        { num: '04', title: 'Human-in-the-loop gates', body: 'Pause for review on automated decisions, conflicts, or policy hits. Named approvers with authority — required for Art. 22 and high-risk oversight.' },
        { num: '05', title: 'Residency & customer control', body: 'EU or US regions, your VPC, or a managed template. Customer-managed keys where the cloud allows. No forced training on your corpus.' },
        { num: '06', title: 'One incident evidence pack', body: 'Map the same traces to GDPR 72h, NIS2 24h/72h, and AI Act serious-incident fields so legal, security, and ops tell one story.' },
      ],
    },
    {
      type: 'grid',
      title: 'Frameworks we design for',
      items: [
        { title: 'GDPR', body: 'Legal basis, DPIA support, minimization, DPA language, SAR/deletion workflows, and EU residency options.', href: '/legal/privacy' },
        { title: 'EU AI Act', body: 'Art. 50 transparency now; logging, human oversight, and documentation patterns for high-risk and insurance/credit deployers.' },
        { title: 'NIS2', body: 'Incident records and early-warning evidence when agents sit in essential or important entity supply chains.' },
        { title: 'US privacy & SOC-aligned', body: 'CCPA/CPRA-style access and deletion, encryption in transit/at rest, access logs, and procurement-ready control descriptions.' },
        { title: 'NIST AI RMF', body: 'Map Govern, Map, Measure, Manage to eval gates, drift monitors, and policy versions — useful for US buyers and insurers.' },
        { title: 'Data processing layer', body: 'Quality, lineage, and permission-aware retrieval so governance is not bolted onto a dirty index.', href: '/platform/data-processing' },
      ],
    },
    {
      type: 'numbered',
      title: 'Governance readiness sprint',
      subtitle: 'A focused engagement that leaves you with a control map, evidence pack, and cloud residency plan — not a slide deck.',
      items: [
        { num: '01', title: 'System & data inventory', body: 'Classify agents, personal data, high-risk use (credit, insurance, HR), and subprocessors.' },
        { num: '02', title: 'Gap map', body: 'GDPR legal basis, DPIA/FRIA need, Art. 50 disclosures, logging gaps, and US state-privacy overlap.' },
        { num: '03', title: 'Control build', body: 'RBAC, redaction, eval gates, human approval paths, and residency on AWS, Azure, or GCP.' },
        { num: '04', title: 'Evidence pack', body: 'Unified incident template, retention schedule, and security-review artifacts for procurement and DPO review.' },
      ],
    },
    {
      type: 'cta',
      title: 'Put GDPR and AI Act controls in the product, not the binder',
      body: 'Request a security review or start a governance sprint. Data stays in your cloud; DynasAI is the governed front layer.',
      primary: { label: 'Talk to an expert', href: '/contact' },
      secondary: { label: 'Data processing', href: '/platform/data-processing' },
    },
  ],
};

export const agentsPage: MarketingPage = {
  title: 'AI Agent Library',
  description: 'Pre-built agent templates for support, ops, finance, research, and industry workflows.',
  badge: 'Platform',
  headline: 'Start from proven',
  highlight: 'agent templates',
  subhead: 'Browse the DynasAI agent library — customize in Workflow Studio and ship with evals and governance.',
  sections: [
    {
      type: 'grid',
      title: 'Agent categories',
      items: [
        { title: 'Customer support', body: 'Ticket triage, knowledge answers, and escalation workflows.' },
        { title: 'Operations', body: 'Exception handling, scheduling, and cross-system coordination.' },
        { title: 'Finance & accounting', body: 'Reconciliation, invoice processing, and controls automation.' },
        { title: 'Research & analysis', body: 'Multi-step research with citations and human review.' },
        { title: 'Sales & marketing', body: 'Lead enrichment, outreach drafts, and campaign ops.' },
        { title: 'Industry verticals', body: 'Insurance, BFS, and supply chain starter agents.', href: '/solutions' },
      ],
    },
    {
      type: 'cta',
      title: 'Explore agents in the workspace',
      body: 'Templates, builder, and operated deployments on app.dynasai.ai.',
      primary: { label: 'Open workspace', href: 'https://app.dynasai.ai' },
      secondary: { label: 'Dynas Toolkit', href: '/platform/toolkit' },
    },
  ],
};

export const intelligencePage: MarketingPage = {
  title: 'Platform Intelligence Layer',
  description: 'The orchestration layer that connects enterprise data, AI agents, and people into governed execution.',
  badge: 'Platform',
  headline: 'One intelligence layer for',
  highlight: 'enterprise action',
  subhead: 'DynasAI orchestrates agents, tools, memory, and human approvals — with full observability.',
  sections: [
    {
      type: 'split',
      title: 'From inputs to outcomes',
      paragraphs: [
        'Enterprise data, AI agents, and people feed a unified orchestration layer that routes work, enforces policy, and records every decision.',
        'Build visual workflows, connect APIs and knowledge bases, and operate production automation with evals and drift monitoring — not one-off scripts.',
      ],
    },
    {
      type: 'grid',
      title: 'Platform layers',
      items: [
        { title: 'Build', body: 'Agent builder, workflow studio, and template library.', href: '/platform/workflow-builder' },
        { title: 'Connect', body: 'Integrations marketplace and secure tool access.', href: '/platform/integrations' },
        { title: 'Understand', body: 'Data processing, RAG, document intelligence, and enterprise search.', href: '/platform/data-processing' },
        { title: 'Operate', body: 'Observability, evals, and governance controls.', href: '/platform/governance' },
      ],
    },
    {
      type: 'cta',
      title: 'See the platform in action',
      body: 'Read the docs or start building in the workspace.',
      primary: { label: 'Platform docs', href: '/docs' },
      secondary: { label: 'Start building', href: 'https://app.dynasai.ai' },
    },
  ],
};

export const integrationsPage: MarketingPage = {
  title: 'Integrations Marketplace',
  description: 'Connect DynasAI agents to enterprise apps, data warehouses, APIs, and custom tools.',
  badge: 'Platform',
  headline: 'Connect agents to your',
  highlight: 'entire stack',
  subhead: 'Pre-built connectors, webhooks, and SDK access — with identity-aware permissions for every tool call.',
  sections: [
    {
      type: 'grid',
      title: 'Integration categories',
      items: [
        { title: 'CRM & service', body: 'Salesforce, Zendesk, ServiceNow, and custom ticketing.' },
        { title: 'Data & analytics', body: 'Snowflake, BigQuery, Databricks, and SQL sources.' },
        { title: 'Productivity', body: 'Microsoft 365, Google Workspace, Slack, and email.' },
        { title: 'ERP & finance', body: 'SAP, NetSuite, and payment platforms.' },
        { title: 'Developer tools', body: 'GitHub, Jira, CI/CD, and internal APIs.' },
        { title: 'Custom tools', body: 'OpenAPI, MCP, and webhook-based extensions.' },
      ],
    },
    {
      type: 'cta',
      title: 'Need a connector we don\'t list?',
      body: 'Our engineering team builds secure integrations as part of delivery programs.',
      primary: { label: 'Request integration', href: '/contact' },
      secondary: { label: 'API overview', href: '/docs/api-overview' },
    },
  ],
};

export const dataProcessingPage: MarketingPage = {
  title: 'Data Processing & Context Layer',
  description:
    'Collect raw data from any source, evaluate quality, and process it into governed context for AI agents — on AWS, Azure, or GCP with customer data control, GDPR, and US privacy standards.',
  badge: 'Platform',
  headline: 'Turn raw, fragmented data into',
  highlight: 'trusted AI context',
  subhead:
    'The 2026 bottleneck is not the model. It is data readiness. DynasAI is the front layer that collects, evaluates, and processes multi-source data — then feeds governed agents while compute stays on the cloud you choose.',
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Platform', href: '/platform/intelligence' },
    { label: 'Data processing', href: '/platform/data-processing' },
  ],
  sections: [
    {
      type: 'stats',
      title: 'The market gap in 2026',
      subtitle:
        'Enterprises are funding agents faster than they are preparing the data those agents need. Independent 2026 research points to the same hole: plumbing, context, and governance — not GPUs.',
      items: [
        { value: '85%', label: 'of enterprises lack a data foundation to run agentic AI securely at scale', source: 'Fivetran / Redpoint 2026 Agentic AI Readiness Index' },
        { value: '15%', label: 'have the data foundation required for production agents', source: 'Fivetran / Redpoint 2026' },
        { value: '95%', label: 'of architects delayed or cancelled AI projects over data, governance, or compliance', source: 'Cloudera enterprise survey, via CIO' },
        { value: '≤20%', label: 'of enterprise data is sufficiently described and contextualized for agents', source: 'Teradata 2026 Agentic AI report' },
      ],
    },
    {
      type: 'split',
      title: 'Why pilots stall — and what comes next',
      paragraphs: [
        'Today: 60% of enterprises invest millions in agentic AI while 41% still run agents on unreliable, poorly governed data. Silent failures look correct until stale, siloed, or mis-permissioned context compounds. RAG demos hide this — production corpora, ambiguous queries, and retrieval noise drop decision-ready accuracy sharply. Only about 12% of enterprises have centralized control over the agents they already run.',
        'Through 2026–2027: EU AI Act enforcement, GDPR incident reporting, and NIS2 raise the bar for lineage, access control, and audit evidence. Hybrid and private deployments are rising as teams reclaim sovereignty — 66% moved AI workloads back from public cloud in the last year. Buyers now rank permissions and ingestion equally, and they refuse to lock the context layer to a single model vendor. The winning stack is a governed context layer on the customer’s AWS, Azure, or GCP — not another demo chatbot.',
      ],
    },
    {
      type: 'grid',
      title: 'Where the market is underserved',
      subtitle: 'Vendors sell pipelines, lakes, or models. Few own the front layer that makes multi-source data easy to evaluate, process, and automate — with the customer still in control.',
      items: [
        { title: 'Data not ready for agents', body: 'Pipelines exist for analytics, not for real-time agent context, freshness SLAs, or permission-aware retrieval.' },
        { title: 'Context fragmentation', body: 'Silos across SaaS, warehouses, files, and streams. Agents cannot reason across functions without unified lineage and meaning.' },
        { title: 'Evaluation after the fact', body: 'Teams ship RAG without retrieval quality, faithfulness, or conflict-handling checks — then discover silent failure in production.' },
        { title: 'Cloud lock-in vs sovereignty', body: 'Provider-native retrieval is convenient, but most enterprises will not consolidate context onto one vendor. They need BYO cloud and residency.' },
        { title: 'Compliance as paperwork', body: 'GDPR, US privacy, and the EU AI Act need technical controls — DPIA evidence, audit logs, and data minimization — not slide decks.' },
        { title: 'Cost without architecture', body: 'Hyperscaler spend grows while data quality stays unmeasured. Teams need cost-aware processing on the cloud they already pay for.' },
      ],
    },
    {
      type: 'numbered',
      title: 'How DynasAI processes data',
      subtitle: 'One front layer. Your backend. Collect from anywhere, evaluate before use, process with versioned transforms, automate with audit trails.',
      items: [
        { num: '01', title: 'Collect from any source', body: 'APIs, warehouses, SaaS exports, documents, webhooks, and batch files — unified ingestion without moving ownership off your cloud.' },
        { num: '02', title: 'Evaluate before agents touch it', body: 'Score completeness, freshness, PII risk, retrieval recall, and groundedness. Gate indexes the way CI gates code.' },
        { num: '03', title: 'Process and contextualize', body: 'Normalize, enrich, chunk, and attach lineage so agents receive meaning — not raw dumps. Hybrid retrieval and reranking ready for production RAG.' },
        { num: '04', title: 'Govern access at retrieval time', body: 'RBAC/ABAC follows the data. Agents inherit permissions; queries, sources, and decisions are logged for EU and US audits.' },
        { num: '05', title: 'Run on the cloud you choose', body: 'AWS, Azure, or GCP — managed templates or your VPC. We recommend the cost-effective mix; you keep data control and residency.' },
        { num: '06', title: 'Automate with human gates', body: 'Feed governed workflows. Pause for review on conflicts, knowledge gaps, or policy hits — then promote with eval evidence.' },
      ],
    },
    {
      type: 'grid',
      title: 'Built for today’s rules and tomorrow’s scale',
      items: [
        { title: 'GDPR & EU AI Act', body: 'Minimization, purpose limits, residency options, and evidence packs that support incident reporting — not separate binders per framework.', href: '/platform/governance' },
        { title: 'US enterprise standards', body: 'Encryption, access logs, SOC-aligned controls, and customer-owned tenants for regulated US workloads.' },
        { title: 'Multi-cloud backends', body: 'Bedrock, Vertex AI, Azure OpenAI, BigQuery, S3, Fabric — DynasAI orchestrates; your hyperscaler runs the work.', href: '/partners' },
        { title: 'Future-ready context layer', body: 'Independent of any single model provider. Hybrid retrieval, eval suites, and incremental re-index as agents become multi-step operators.' },
      ],
    },
    {
      type: 'numbered',
      title: 'Data-readiness sprint',
      subtitle: 'A 2–4 week engagement that maps sources, scores quality, picks AWS / Azure / GCP, and leaves a governed pipeline — before you scale agents.',
      items: [
        { num: '01', title: 'Source inventory', body: 'Catalog warehouses, APIs, SaaS, files, and streams. Mark ownership, residency, and PII.' },
        { num: '02', title: 'Quality & retrieval eval', body: 'Freshness, completeness, permission gaps, recall@k, and groundedness on a golden question set.' },
        { num: '03', title: 'Cloud & cost recommendation', body: 'Stay in your VPC or use a managed template. Right-size Bedrock, Vertex, or Azure OpenAI.' },
        { num: '04', title: 'Governed pipeline', body: 'Versioned transforms, lineage, access at retrieval time, and an eval gate before production indexes.' },
      ],
    },
    {
      type: 'cta',
      title: 'Close the 85/15 data gap before you scale agents',
      body: 'Start with a data-readiness sprint: source map, quality eval, cloud recommendation, and a governed pipeline on AWS, Azure, or GCP.',
      primary: { label: 'Talk to an expert', href: '/contact' },
      secondary: { label: 'View services', href: '/pricing#data' },
    },
  ],
};

export const workflowBuilderPage: MarketingPage = {
  title: 'Workflow Builder',
  description: 'Visual workflow studio for designing governed multi-agent automations with human-in-the-loop controls.',
  badge: 'Platform',
  headline: 'Design agent workflows',
  highlight: 'visually',
  subhead: 'Drag-and-drop orchestration, tool nodes, branching logic, and approval gates — versioned and deployable.',
  sections: [
    {
      type: 'numbered',
      title: 'Builder capabilities',
      items: [
        { num: '01', title: 'Visual canvas', body: 'Map multi-step flows with agents, tools, and conditional branches.' },
        { num: '02', title: 'Human-in-the-loop', body: 'Pause for review, approval, or correction before continuing.' },
        { num: '03', title: 'Version control', body: 'Track changes and promote workflows through environments.' },
        { num: '04', title: 'Test & eval', body: 'Run scenarios and eval suites before production rollout.' },
      ],
    },
    {
      type: 'cta',
      title: 'Open Workflow Studio',
      body: 'Build your first flow in the DynasAI workspace.',
      primary: { label: 'Start building', href: 'https://app.dynasai.ai' },
      secondary: { label: 'Getting started', href: '/docs/getting-started' },
    },
  ],
};

export const insurancePlaybook: MarketingPage = {
  title: 'Insurance data streamlining playbook',
  description:
    'Original DynasAI guide: collect, evaluate, process, and automate insurance data on AWS, Azure, or GCP you already operate. Not a reprint of any third-party playbook.',
  badge: 'Playbook',
  headline: 'Make insurance data usable',
  highlight: 'before you automate.',
  subhead:
    'Policy admin, claims, billing, documents, and telematics rarely share a trusted packet. DynasAI is the front layer that streamlines that data in your cloud, then attaches governed agents.',
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Insurance', href: '/solutions/insurance' },
    { label: 'Playbook', href: '/solutions/insurance/playbook' },
  ],
  sections: [
    {
      type: 'split',
      title: 'Why carriers stall on AI',
      paragraphs: [
        'The problem is usually not “we need another model.” It is that FNOL files, submissions, loss runs, and bureau extracts live in different systems, with different quality, and no evaluation before an agent sees them.',
        'DynasAI does not replace your policy or claims core. We collect a working set, evaluate it, process a versioned context layer, and only then automate — with human gates. Compute and storage stay on the AWS, Azure, or GCP footprint you already have.',
      ],
    },
    {
      type: 'numbered',
      title: 'The DynasAI streamlining loop',
      subtitle: 'Same four steps as the rest of the platform — applied to insurance sources.',
      items: [
        { num: '01', title: 'Collect', body: 'Connect cores, document stores, APIs, and batch files. Leave systems of record in place. No public form asks for your network diagram.' },
        { num: '02', title: 'Evaluate', body: 'Score completeness, freshness, duplicates, and retrieval quality. If the packet is not ready, the workflow stops instead of hallucinating coverage.' },
        { num: '03', title: 'Process', body: 'Normalize, enrich, and version transforms so underwriters and adjusters share one audit-ready context — not a shadow warehouse copy of the estate.' },
        { num: '04', title: 'Automate', body: 'Attach agents for prefill, intake, and routing with approval gates, evals, and logs. EU or US residency follows the regions you approve.' },
      ],
    },
    {
      type: 'grid',
      title: 'Where the loop attaches',
      subtitle: 'Patterns we implement. Named customer ROI is published only with permission.',
      items: [
        { title: 'Underwriting packets', body: 'Application data, documents, and third-party enrichments in one review file.', href: '/solutions/insurance', icon: 'clipboard' },
        { title: 'Claims intake', body: 'FNOL, images, and notes classified and routed with evidence in your tenant.', href: '/platform/data-processing', icon: 'camera' },
        { title: 'Telematics & bureau feeds', body: 'Land external data next to policy records; evaluate before pricing or claims use.', href: '/platform/data-processing', icon: 'car' },
        { title: 'Your cloud backend', body: 'Stay on AWS, Azure, or GCP. We recommend cost-aware services; we do not force a hyperscaler.', href: '/partners', icon: 'cloud' },
      ],
    },
    {
      type: 'cta',
      title: 'Get a cloud and residency path',
      body: 'Five questions. We recommend a service and whether to stay on your existing AWS, Azure, or GCP — then a data-readiness sprint if the sources are not ready.',
      primary: { label: 'Get a recommended path', href: '/start' },
      secondary: { label: 'Insurance solutions', href: '/solutions/insurance' },
    },
  ],
};
