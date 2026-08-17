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
  logo: '/img/dynasai_logo_system.png',
  ogImage: '/img/dynasai_logo_system.png',
  sameAs: [
    'https://github.com/abhishekbhalani/dynasai',
  ],
} as const;

export const nav = [
  { href: '/features', label: 'Platform' },
  { href: '/pricing', label: 'Services' },
  { href: '/features', label: 'Solutions' },
  { href: '/blog', label: 'Resources' },
  { href: '/about', label: 'Company' },
] as const;

export const companyNav = [
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
] as const;

export { stitchScreens as stitch } from './stitch-screens';
