/** Marketing copy — studio + platform positioning (Tiger-inspired structure, agentic focus). */

export const servicePillars = [
  {
    id: 'strategy',
    title: 'Strategy & Advisory',
    summary: 'Turn AI ambition into a prioritized roadmap with clear ROI, governance, and platform choices.',
    href: '/pricing#strategy',
    items: ['AI & automation roadmap', 'Platform and vendor strategy', 'Operating model design'],
  },
  {
    id: 'engineering',
    title: 'Agent & Application Engineering',
    summary: 'Design, build, and integrate governed agents, workflows, and GenAI applications on your stack.',
    href: '/pricing#engineering',
    items: ['Custom AI agents', 'Workflow orchestration', 'GenAI product builds'],
  },
  {
    id: 'data',
    title: 'Data & Integration Foundation',
    summary: 'Connect enterprise systems, knowledge bases, and APIs so agents act on trusted, fresh context.',
    href: '/pricing#data',
    items: ['Enterprise integrations', 'Knowledge & RAG pipelines', 'Identity-aware tool access'],
  },
  {
    id: 'operate',
    title: 'Operate & Scale',
    summary: 'Run production automation with observability, evals, drift monitoring, and continuous improvement.',
    href: '/pricing#operate',
    items: ['AgentOps & monitoring', 'Evaluation frameworks', 'Managed iteration retainers'],
  },
] as const;

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
