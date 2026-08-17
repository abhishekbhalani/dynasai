export const site = {
  name: 'DynasAI',
  legalName: 'DynasAI',
  url: 'https://dynasai.ai',
  appUrl: 'https://app.dynasai.ai',
  locale: 'en_US',
  description:
    'DynasAI is the easy front layer for enterprise AI — governed agents, data processing, and automation on AWS, Azure, or GCP. You keep data control; we handle orchestration, evaluation, and compliance.',
  tagline: 'Turn enterprise complexity into intelligent action.',
  email: 'hello@dynasai.ai',
  gtmId: 'GTM-KDPPRVV2',
  twitter: '@dynasai',
  logo: '/img/transparent-logo.svg',
  logoMark: '/img/logo-mark.svg',
  logoColored: '/img/colored-logo.svg',
  logoMarkColored: '/img/logo-mark-colored.svg',
  ogImage: '/img/logo-mark-colored.svg',
  sameAs: [
    'https://github.com/abhishekbhalani/dynasai',
  ],
} as const;

export const nav = [
  { href: '/features', label: 'Platform', mega: 'platform' },
  { href: '/pricing', label: 'Services' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/blog', label: 'Resources', mega: 'resources' },
  { href: '/about', label: 'Company', mega: 'company' },
] as const;

export const platformMegaMenu = {
  title: 'AI Automation Platform',
  description: 'The complete operating system for enterprise AI agents.',
  featured: {
    title: 'See DynasAI in Action',
    description: 'Watch how enterprise teams orchestrate complex multi-agent workflows.',
    cta: 'Explore the Platform',
    href: '/docs',
  },
  columns: [
    {
      label: 'Build',
      icon: 'hammer',
      links: [
        { label: 'AI Automation', href: '/features#build' },
        { label: 'AI Agents', href: '/features#build' },
        { label: 'Workflow Orchestration', href: '/features#build' },
        { label: 'Agent Builder', href: '/features#build' },
        { label: 'Dynas Toolkit', href: '/platform/toolkit' },
      ],
    },
    {
      label: 'Connect',
      icon: 'plug',
      links: [
        { label: 'Integrations', href: '/docs' },
        { label: 'APIs', href: '/docs/api-overview' },
        { label: 'Webhooks', href: '/docs/api-overview' },
        { label: 'Tools', href: '/docs' },
        { label: 'Enterprise Apps', href: '/features#connect' },
      ],
    },
    {
      label: 'Understand',
      icon: 'database',
      links: [
        { label: 'Data Processing', href: '/platform/data-processing' },
        { label: 'Knowledge & RAG', href: '/platform/data-processing' },
        { label: 'Document Intelligence', href: '/platform/data-processing' },
        { label: 'Enterprise Search', href: '/features#understand' },
        { label: 'Memory', href: '/features#understand' },
      ],
    },
    {
      label: 'Operate',
      icon: 'shield',
      links: [
        { label: 'AI Observability', href: '/platform/governance' },
        { label: 'Evaluation', href: '/platform/governance' },
        { label: 'Monitoring', href: '/platform/governance' },
        { label: 'AI Governance', href: '/platform/governance' },
        { label: 'GDPR & Security', href: '/platform/governance' },
      ],
    },
  ],
} as const;

export const resourcesMegaMenu = {
  title: 'Resources & Insights',
  description: 'Delivery notes, documentation, and tools for builders and operators.',
  links: [
    { label: 'Dynas Toolkit', href: '/platform/toolkit', description: 'Modular accelerators for agent delivery.', icon: 'wrench' },
    { label: 'Blog', href: '/blog', description: 'Delivery notes and platform updates.', icon: 'book' },
    { label: 'Documentation', href: '/docs', description: 'Getting started and API overview.', icon: 'file-text' },
    { label: 'RSS Feed', href: '/rss.xml', description: 'Subscribe to new articles.', icon: 'rss' },
  ],
} as const;

export const companyMegaMenu = {
  title: 'Company',
  description: 'Learn about our team, culture, and how to work with DynasAI.',
  links: [
    { label: 'About', href: '/about', description: 'Our story, mission, and leadership.', icon: 'users' },
    { label: 'Careers', href: '/careers', description: 'Open roles and culture.', icon: 'briefcase' },
    { label: 'Partners', href: '/partners', description: 'AWS, Azure, GCP — your cloud, our front layer.', icon: 'cloud' },
    { label: 'Get started', href: '/start', description: 'Five questions. Recommended service and cloud path.', icon: 'rocket' },
    { label: 'Contact', href: '/contact', description: 'Talk to an AI expert.', icon: 'phone' },
  ],
} as const;

export { stitchScreens as stitch } from './stitch-screens';
