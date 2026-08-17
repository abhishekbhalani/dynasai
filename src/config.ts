export const site = {
  name: 'DynasAI',
  legalName: 'DynasAI',
  url: 'https://dynasai.ai',
  appUrl: 'https://app.dynasai.ai',
  locale: 'en_US',
  description:
    'DynasAI designs, ships, and operates AI systems for businesses — and gives developers APIs, SDKs, and a workspace to build on.',
  tagline: 'AI systems for operators. APIs for builders.',
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
  { href: '/features', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
  { href: '/blog', label: 'Blog' },
] as const;

export const companyNav = [
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
] as const;
