/** Stitch screen content — routes mapped to `.stitch/` HTML exports. */

export type MarketingSection =
  | { type: 'split'; title: string; paragraphs: string[] }
  | { type: 'stats'; title: string; subtitle?: string; items: { value: string; label: string; source?: string }[] }
  | { type: 'grid'; title: string; subtitle?: string; items: { title: string; body: string; href?: string }[] }
  | { type: 'numbered'; title: string; subtitle?: string; items: { num: string; title: string; body: string }[] }
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
        { title: 'Insurance', body: 'Underwriting prefill, claims automation, telematics, and customer analytics.', href: '/solutions/insurance' },
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
  title: 'Impact & Case Studies',
  description: 'Production outcomes from DynasAI agent deployments across insurance, financial services, and enterprise operations.',
  badge: 'Impact',
  headline: 'Measured outcomes from',
  highlight: 'production AI',
  subhead: 'Real deployments — not slide decks. See how teams ship governed agents and operate them at scale.',
  sections: [
    {
      type: 'grid',
      title: 'Customer stories',
      items: [
        { title: '85%+ underwriting prefill for US SME carrier', body: 'Workers comp underwriting transformed with governed data enrichment agents.', href: '/solutions/insurance' },
        { title: '36 claims use cases for US P&C insurer', body: 'Computer vision agents accelerated auto damage estimation and reduced manual touch.', href: '/solutions/insurance' },
        { title: '39% savings with AI/ML underwriting', body: 'Document intelligence and automated risk assessment improved accuracy and throughput.', href: '/solutions/insurance' },
        { title: 'Enterprise data foundation', body: 'Centralized data platform reduced quality improvement effort by 50%.', href: '/contact' },
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
  title: 'Partners & Ecosystem',
  description: 'DynasAI partners with cloud, data, and AI platforms to deliver enterprise agent automation.',
  badge: 'Partners',
  headline: 'Built for your',
  highlight: 'enterprise stack',
  subhead: 'We integrate with the platforms you already trust — and co-deliver with leading cloud and data partners.',
  sections: [
    {
      type: 'grid',
      title: 'Technology partners',
      subtitle: 'Native integrations and co-selling with major cloud and data platforms.',
      items: [
        { title: 'Microsoft Azure', body: 'Identity, OpenAI, and enterprise app integrations.' },
        { title: 'Google Cloud', body: 'Vertex AI, BigQuery, and workspace connectors.' },
        { title: 'AWS', body: 'Bedrock, Lambda, and secure VPC deployments.' },
        { title: 'Databricks', body: 'Lakehouse data and MLflow model operations.' },
        { title: 'Snowflake', body: 'Secure data sharing and analytics pipelines.' },
        { title: 'Enterprise SaaS', body: 'Salesforce, ServiceNow, SAP, and custom APIs.' },
      ],
    },
    {
      type: 'cta',
      title: 'Partner with DynasAI',
      body: 'ISVs, SIs, and cloud partners — let\'s build together.',
      primary: { label: 'Become a partner', href: '/contact' },
    },
  ],
};

export const governancePage: MarketingPage = {
  title: 'Governance & Security',
  description: 'Enterprise-grade security, audit trails, and policy controls for AI agent automation.',
  badge: 'Platform',
  headline: 'Governance built in,',
  highlight: 'not bolted on',
  subhead: 'Role-aware access, eval gates, trace logging, and policy guardrails for regulated teams.',
  sections: [
    {
      type: 'grid',
      title: 'Security & compliance capabilities',
      items: [
        { title: 'Identity & access', body: 'SSO, RBAC, and environment-scoped agent permissions.' },
        { title: 'Audit trails', body: 'Full trace logs for prompts, tool calls, and human decisions.' },
        { title: 'Policy guardrails', body: 'Block, redact, or escalate based on content and context rules.' },
        { title: 'Evaluation gates', body: 'Require eval scores before promotion to production.' },
        { title: 'Data residency', body: 'Deployment options aligned to your cloud and compliance needs.' },
        { title: 'Vendor risk', body: 'Documented subprocessors and security review artifacts.' },
      ],
    },
    {
      type: 'cta',
      title: 'Review our security posture',
      body: 'Request architecture docs or schedule a security review with our team.',
      primary: { label: 'Contact us', href: '/contact' },
      secondary: { label: 'Platform overview', href: '/docs' },
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
