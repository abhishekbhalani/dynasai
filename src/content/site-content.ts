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
    href: '/platform/data-processing',
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
  { name: 'Amazon Web Services', short: 'AWS', logo: 'aws', body: 'Bedrock, S3, Lambda, and VPC-native deployments.' },
  { name: 'Microsoft Azure', short: 'Azure', logo: 'azure', body: 'OpenAI, Entra ID, Fabric, and enterprise app integrations.' },
  { name: 'Google Cloud', short: 'GCP', logo: 'gcp', body: 'Vertex AI, BigQuery, and secure data processing pipelines.' },
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
    { title: 'GDPR & EU privacy', body: 'Data minimization, purpose limitation, DPA support, and residency options for EU customers.', href: '/platform/governance' },
    { title: 'US enterprise standards', body: 'SOC-aligned controls, encryption in transit/at rest, and access logging.', href: '/platform/governance' },
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
    title: 'Insurance data processing — streamlining for underwriting, claims, and risk',
    description:
      'DynasAI is the front layer for insurance data: collect, evaluate, process, and automate on AWS, Azure, or GCP you already run. Policy, claims, and documents stay in your account.',
  },
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Insurance', href: '/solutions/insurance' },
  ],
  hero: {
    headline: 'Streamline insurance data.',
    highlight: 'Then automate with control.',
    subhead:
      'Carriers sit on policy, claims, billing, documents, and telematics that never meet. DynasAI ingests those sources, scores quality, and feeds governed agents — on your AWS, Azure, or GCP.',
  },
  promo: {
    title: 'Insurance data streamlining playbook',
    body: 'How we collect, evaluate, process, and automate insurance data without moving it off your cloud.',
    cta: 'Read the playbook',
    href: '/solutions/insurance/playbook',
  },
  intro: {
    title: 'Industry data processing, not a black-box model dump',
    body:
      'Insurance AI fails when submissions, FNOL packs, policy admin extracts, and third-party files are incomplete or untrusted. DynasAI is the easy front layer: one workspace to connect sources, evaluate quality, and streamline context for underwriting, claims, and operations.',
    body2:
      'Backend compute, storage, and models stay in the cloud you choose. We do not ask you to pick a server on a marketing form. Production uses least-privilege access to your tenant — with EU or US residency you approve.',
  },
  capabilities: [
    {
      num: '01',
      title: 'Multi-source collection',
      body: 'Connect policy admin, claims systems, document stores, APIs, and batch files. Keep systems of record where they are; DynasAI collects a governed working set.',
    },
    {
      num: '02',
      title: 'Quality evaluation',
      body: 'Score completeness, freshness, duplicates, and retrieval quality before an agent or underwriter uses the data. Fail closed when the packet is not ready.',
    },
    {
      num: '03',
      title: 'Streamlining & context',
      body: 'Normalize, enrich, and version transforms so submissions, loss runs, and correspondence become one audit-ready context layer.',
    },
    {
      num: '04',
      title: 'Underwriting workflows',
      body: 'Prefill and risk packets with human review gates. Agents propose; underwriters decide. Every enrichment is traced.',
    },
    {
      num: '05',
      title: 'Claims & document intake',
      body: 'Classify FNOL, photos, and correspondence; route exceptions; keep evidence with the claim file in your cloud.',
    },
    {
      num: '06',
      title: 'Governed automation',
      body: 'Evals, approval gates, and logs for EU GDPR and US privacy. No training public models on customer insurance content.',
    },
  ],
  stories: [
    {
      title: 'Underwriting packets',
      body: 'Unify application data, third-party enrichments, and documents into a review-ready file — then attach an agent with a human gate.',
      href: '/solutions/insurance/playbook',
    },
    {
      title: 'Claims intake',
      body: 'Streamline FNOL, images, and notes into structured context so adjusters spend time on judgment, not hunting files.',
      href: '/platform/data-processing',
    },
    {
      title: 'Telematics & third-party feeds',
      body: 'Land TSP and bureau data next to policy records, evaluate quality, and only then activate pricing or claims workflows.',
      href: '/platform/data-processing',
    },
  ],
  cta: {
    title: 'Map your insurance data path',
    body: 'Tell us where policy, claims, and documents live today. We recommend a streamlining path on your existing cloud.',
    primary: { label: 'Get a recommended path', href: '/start' },
    secondary: { label: 'Read the playbook', href: '/solutions/insurance/playbook' },
  },
} as const;

export const homeHero = {
  badge: 'AI Delivery Studio + Developer Platform',
  headline: 'Turn enterprise complexity into',
  highlight: 'intelligent action',
  lede:
    'DynasAI orchestrates AI agents, enterprise data, and human intelligence into one governed execution layer — build yourself, implement with our studio, or run both in parallel.',
  stats: [
    { value: '3', label: 'Cloud backends: AWS, Azure, GCP' },
    { value: 'BYO', label: 'VPC and data stay in your account' },
    { value: 'EU / US', label: 'Residency you approve' },
  ],
  primaryCta: { label: 'Start Building', href: 'https://app.dynasai.ai' },
  secondaryCta: { label: 'Insurance solutions', href: '/solutions/insurance' },
  tertiaryCta: { label: 'Explore Toolkit', href: '/platform/toolkit' },
} as const;
