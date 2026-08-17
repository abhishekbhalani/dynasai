export const site = {
  name: 'DynasAI',
  legalName: 'DynasAI',
  url: 'https://dynasai.ai',
  appUrl: 'https://app.dynasai.ai',
  locale: 'en_US',
  description:
    'DynasAI orchestrates AI agents, enterprise data, and human intelligence into a unified execution layer. Automate sophisticated workflows with precision and control.',
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
  { href: '/features', label: 'Solutions' },
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
      icon: 'B',
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
      icon: 'C',
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
      icon: 'U',
      links: [
        { label: 'Knowledge & RAG', href: '/features#understand' },
        { label: 'Document Intelligence', href: '/features#understand' },
        { label: 'Enterprise Search', href: '/features#understand' },
        { label: 'Memory', href: '/features#understand' },
      ],
    },
    {
      label: 'Operate',
      icon: 'O',
      links: [
        { label: 'AI Observability', href: '/features#operate' },
        { label: 'Evaluation', href: '/features#operate' },
        { label: 'Monitoring', href: '/features#operate' },
        { label: 'AI Governance', href: '/features#operate' },
        { label: 'Security', href: '/features#operate' },
      ],
    },
  ],
} as const;

export const resourcesMegaMenu = {
  links: [
    { label: 'Dynas Toolkit', href: '/platform/toolkit', description: 'Modular accelerators for agent delivery.' },
    { label: 'Blog', href: '/blog', description: 'Delivery notes and platform updates.' },
    { label: 'Documentation', href: '/docs', description: 'Getting started and API overview.' },
    { label: 'RSS Feed', href: '/rss.xml', description: 'Subscribe to new articles.' },
  ],
} as const;

export const companyMegaMenu = {
  links: [
    { label: 'About', href: '/about', description: 'Our story, mission, and leadership.' },
    { label: 'Careers', href: '/careers', description: 'Open roles and culture.' },
    { label: 'Contact', href: '/contact', description: 'Talk to an AI expert.' },
  ],
} as const;

export const companyNav = [
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
] as const;

export { stitchScreens as stitch } from './stitch-screens';
