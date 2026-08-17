/** Marketing copy — studio + platform positioning (Tiger-inspired structure, agentic focus). */

export const servicePillars = [
  {
    id: 'strategy',
    title: 'Strategy & Cloud Advisory',
    summary: 'Choose the right cloud mix (AWS, Azure, GCP), data residency model, and AI roadmap with clear ROI.',
    href: '/pricing#strategy',
    items: ['Multi-cloud & cost optimization', 'Data residency planning', 'AI automation roadmap'],
  },
  {
    id: 'engineering',
    title: 'Agent & Automation Engineering',
    summary: 'Build governed agents and workflows on the DynasAI front layer — connected to your chosen cloud backend.',
    href: '/pricing#engineering',
    items: ['Custom AI agents', 'Workflow orchestration', 'Human-in-the-loop automation'],
  },
  {
    id: 'data',
    title: 'Data Ingestion & Processing',
    summary: 'Collect raw data from any source, normalize it, evaluate quality, and prepare it for AI — without losing control.',
    href: '/pricing#data',
    items: ['Multi-source data pipelines', 'Raw-to-ready processing', 'Evaluation & lineage'],
  },
  {
    id: 'operate',
    title: 'Secure Operate & Compliance',
    summary: 'Run production automation with GDPR, US privacy standards, audit trails, and continuous AgentOps.',
    href: '/pricing#operate',
    items: ['GDPR & US data controls', 'AgentOps & monitoring', 'Security review artifacts'],
  },
] as const;

export const cloudProviders = [
  { name: 'Amazon Web Services', short: 'AWS', body: 'Bedrock, S3, Lambda, and VPC-native deployments.' },
  { name: 'Microsoft Azure', short: 'Azure', body: 'OpenAI, Entra ID, Fabric, and enterprise app integrations.' },
  { name: 'Google Cloud', short: 'GCP', body: 'Vertex AI, BigQuery, and secure data processing pipelines.' },
] as const;

export const platformModel = {
  title: 'Simple front layer. Your cloud. Your data.',
  subtitle:
    'DynasAI sits between your teams and the hyperscalers — one workspace to build, evaluate, and automate while backend services run where you choose.',
  frontLayer: [
    'Visual agent & workflow builder',
    'Unified data evaluation workbench',
    'Pre-built industry templates',
    'One login for business and engineering users',
  ],
  backendLayer: [
    'Customer-selected AWS, Azure, or GCP services',
    'Bring your own VPC, tenant, or data lake',
    'Cost-optimized architecture recommendations',
    'No forced cloud lock-in',
  ],
} as const;

export const dataProcessing = {
  title: 'From raw sources to trusted automation',
  body:
    'Enterprises sit on fragmented data — APIs, files, warehouses, SaaS exports, and streaming feeds. DynasAI ingests from multiple sources, profiles and evaluates quality, applies processing rules, and exposes clean context to agents and analysts.',
  steps: [
    { title: 'Collect', body: 'Connect databases, APIs, documents, webhooks, and batch files from any source.' },
    { title: 'Evaluate', body: 'Score completeness, freshness, bias risk, and retrieval quality before use.' },
    { title: 'Process', body: 'Normalize, enrich, chunk, and govern pipelines with versioned transforms.' },
    { title: 'Automate', body: 'Feed governed agents and workflows with audit-ready context and approvals.' },
  ],
} as const;

export const complianceStandards = {
  title: 'Security and privacy by design',
  body:
    'We follow enterprise security practices and regional privacy requirements so customers can deploy with confidence — whether data stays in the EU, US, or a hybrid model.',
  items: [
    { title: 'GDPR & EU privacy', body: 'Data minimization, purpose limitation, DPA support, and residency options for EU customers.' },
    { title: 'US enterprise standards', body: 'SOC-aligned controls, encryption in transit/at rest, and access logging.' },
    { title: 'Customer data control', body: 'Use our managed cloud templates or keep data in your own AWS, Azure, or GCP account.' },
    { title: 'Audit-ready operations', body: 'Trace logs, eval reports, and policy gates for regulated industries.', href: '/platform/governance' },
  ],
} as const;

export const toolkitModules = [
  {
    id: 'explore',
    title: 'Knowledge & Context Workbench',
    body: 'Inspect documents, run health checks on knowledge sources, and validate retrieval quality before agents go live.',
    items: ['Source health checks', 'Retrieval quality reports', 'Context preview & sharing'],
  },
  {
    id: 'build',
    title: 'Agent & Workflow Templates',
    body: 'Start from proven blueprints for support, ops, finance, and research — customize in Workflow Studio.',
    items: ['Solution templates', 'Multi-agent patterns', 'Human-in-the-loop flows'],
  },
  {
    id: 'evaluate',
    title: 'Evaluation & Explainability',
    body: 'Score agent outputs, compare prompt and model variants, and produce audit-ready evaluation reports.',
    items: ['Eval suites & leaderboards', 'Trace and decision logs', 'Side-by-side model comparison'],
  },
  {
    id: 'deploy',
    title: 'Deploy, Monitor & Govern',
    body: 'Ship agents through composable pipelines with drift alerts, policy guardrails, and retraining triggers.',
    items: ['Deployment pipelines', 'Performance & drift monitors', 'Governance documentation'],
  },
] as const;

export const toolkitAccess = {
  headline: 'Where to get the Dynas Toolkit',
  intro:
    'Unlike legacy ML accelerators locked behind consulting engagements, DynasAI publishes toolkit docs and SDK entry points for builders — with the full workbench in the customer workspace.',
  channels: [
    {
      label: 'Documentation',
      description: 'Module overview, APIs, and getting-started guides on this site.',
      href: '/docs',
      status: 'Available now',
    },
    {
      label: 'Workspace',
      description: 'Visual builder, evals, and operated deployments on app.dynasai.ai.',
      href: 'https://app.dynasai.ai',
      status: 'Available now',
    },
    {
      label: 'npm SDK',
      description: 'Programmatic access to templates, eval helpers, and deployment utilities.',
      href: '/docs/getting-started',
      status: 'Preview',
    },
    {
      label: 'Delivery engagement',
      description: 'Implementation, customization, and operated AgentOps with our studio team.',
      href: '/contact',
      status: 'Contact sales',
    },
  ],
} as const;

export const differentiators = [
  {
    title: 'Platform + studio',
    body: 'Use the DynasAI workspace yourself, or pair it with a delivery team that ships on the same stack.',
  },
  {
    title: 'Agent-native, not bolt-on',
    body: 'Built for orchestration, tool use, memory, and governance — not retrofitted from batch ML pipelines.',
  },
  {
    title: 'Modular accelerators',
    body: 'Adopt the full toolkit or individual modules that complement your existing cloud and data platform.',
  },
  {
    title: 'Operated production',
    body: 'Move from pilot to production with evals, monitoring, and iteration — not slide-deck handoffs.',
  },
] as const;

export const insuranceIndustry = {
  slug: 'insurance',
  title: 'Insurance',
  meta: {
    title: 'Insurance — AI Agents for Underwriting, Claims & Risk',
    description:
      'Transform insurance decision-making with governed AI agents across underwriting, claims, telematics, and customer operations.',
  },
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Insurance', href: '/solutions/insurance' },
  ],
  hero: {
    headline: 'Transform decision-making in insurance with',
    highlight: 'AI agents and analytics',
    subhead:
      'See how DynasAI helps insurers drive operational excellence across the value chain with governed agent workflows.',
  },
  promo: {
    title: 'Bridge the AI gap in 3 steps',
    body: 'Proven agent automation patterns from production insurance deployments.',
    cta: 'Get the playbook',
    href: '/contact',
  },
  intro: {
    title: 'AI for enhanced effectiveness across the insurance value chain',
    body:
      'In a competitive insurance landscape with rising customer expectations, AI-powered agents are becoming essential to maintain a leading edge. From risk assessment and accelerated underwriting to claims management and customer service, a governed, data-driven approach helps uncover hidden insights, identify new opportunities, and deliver measurable value.',
    body2:
      'DynasAI combines deep expertise in agent orchestration, generative AI, enterprise integrations, and insurance domain patterns — so you can make informed decisions, optimize processes, and unlock growth while reducing cost and manual effort.',
  },
  capabilities: [
    {
      num: '01',
      title: 'Underwriting data prefill',
      body: 'Reimagine small-business underwriting with AI agents that enrich applications, validate sources, and deliver high fill rates with human review gates.',
    },
    {
      num: '02',
      title: 'Accelerated underwriting',
      body: 'Reduce evidence requests and manual effort in life and specialty lines. Improve quote-to-bind ratios with governed automation and clear escalation paths.',
    },
    {
      num: '03',
      title: 'Telematics & risk signals',
      body: 'Integrate TSP data, build feature stores, and orchestrate ML use cases for pricing, risk assessment, and claims — with end-to-end data governance.',
    },
    {
      num: '04',
      title: 'Computer vision for claims',
      body: 'Automate damage assessment workflows, shorten cycle times, and make risk evaluation more objective with vision agents and audit trails.',
    },
    {
      num: '05',
      title: 'Customer interaction analytics',
      body: 'Analyze call, chat, and email interactions to find coverage gaps, compliance issues, and coaching opportunities for representatives.',
    },
    {
      num: '06',
      title: 'Agent & model operations',
      body: 'Monitor production agents and models with drift alerts, eval suites, and automated retraining triggers — built for regulated environments.',
    },
  ],
  stories: [
    {
      title: 'Workers comp underwriting transformed for US SME',
      body: 'DynasAI agents achieved 85%+ data prefill with 90% accuracy, optimizing underwriting throughput for a regional carrier.',
      href: '/contact',
    },
    {
      title: '36 claims use cases for a US P&C insurer',
      body: 'Computer-vision agents accelerated auto damage estimation and reduced manual intervention across the claims lifecycle.',
      href: '/contact',
    },
    {
      title: '39% savings with governed AI/ML underwriting',
      body: 'Document intelligence and automated risk assessment improved accuracy while cutting manual extraction effort.',
      href: '/contact',
    },
  ],
  cta: {
    title: 'Revamp insurance operations with governed agents',
    body: 'Talk to our team about underwriting, claims, or full-stack agent delivery on the DynasAI platform.',
    primary: { label: 'Let\'s connect', href: '/contact' },
    secondary: { label: 'Explore platform', href: '/features' },
  },
} as const;

export const homeHero = {
  badge: 'AI Delivery Studio + Developer Platform',
  headline: 'Turn enterprise complexity into',
  highlight: 'intelligent action',
  lede:
    'DynasAI orchestrates AI agents, enterprise data, and human intelligence into one governed execution layer — build yourself, implement with our studio, or run both in parallel.',
  stats: [
    { value: '4×', label: 'Faster agent delivery' },
    { value: '85%+', label: 'Prefill accuracy' },
    { value: '36+', label: 'Production use cases' },
  ],
  primaryCta: { label: 'Start Building', href: 'https://app.dynasai.ai' },
  secondaryCta: { label: 'Insurance solutions', href: '/solutions/insurance' },
  tertiaryCta: { label: 'Explore Toolkit', href: '/platform/toolkit' },
} as const;
