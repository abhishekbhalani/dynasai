export const onboardingQuestions = [
  {
    id: 'job',
    label: 'What should AI do first?',
    hint: 'Pick the highest-pain workflow — not a full transformation.',
    options: [
      { value: 'underwriting', label: 'Underwriting / prefill' },
      { value: 'claims', label: 'Claims / document intake' },
      { value: 'support', label: 'Customer support / operations' },
      { value: 'finance', label: 'Finance, risk, or reporting' },
      { value: 'other', label: 'Something else / not sure yet' },
    ],
  },
  {
    id: 'industry',
    label: 'Which industry is this for?',
    hint: 'Used only to pick a template — not to lock you in.',
    options: [
      { value: 'insurance', label: 'Insurance' },
      { value: 'financial', label: 'Financial services' },
      { value: 'healthcare', label: 'Healthcare / life sciences' },
      { value: 'other', label: 'Other / multiple' },
    ],
  },
  {
    id: 'cloud',
    label: 'Where does data live today?',
    hint: 'We stay on your existing cloud. This is not a server picker.',
    options: [
      { value: 'aws', label: 'Amazon Web Services' },
      { value: 'azure', label: 'Microsoft Azure' },
      { value: 'gcp', label: 'Google Cloud' },
      { value: 'onprem', label: 'On-prem / private cloud' },
      { value: 'unsure', label: 'Not sure / none yet' },
    ],
  },
  {
    id: 'residency',
    label: 'Where must data stay?',
    hint: 'Residency follows GDPR / US privacy — we will not move regions without you.',
    options: [
      { value: 'eu', label: 'European Union' },
      { value: 'us', label: 'United States' },
      { value: 'either', label: 'Either / mixed' },
    ],
  },
  {
    id: 'start',
    label: 'How do you want to start?',
    hint: 'Production still runs in your account. Managed is for pilots only.',
    options: [
      { value: 'workspace', label: 'Self-serve workspace' },
      { value: 'sprint', label: 'Discovery / data-readiness sprint' },
      { value: 'unsure', label: 'Recommend a path' },
    ],
  },
] as const;

export type OnboardingAnswers = {
  job: string;
  industry: string;
  cloud: string;
  residency: string;
  start: string;
};

export type OnboardingPlan = {
  serviceTitle: string;
  serviceHref: string;
  cloudTitle: string;
  cloudBody: string;
  engagement: string;
  summary: string;
};

const cloudNames: Record<string, string> = {
  aws: 'AWS',
  azure: 'Azure',
  gcp: 'Google Cloud',
};

export function recommendPlan(answers: OnboardingAnswers): OnboardingPlan {
  const industry = answers.industry;
  const job = answers.job;

  let serviceTitle = 'Strategy & cloud advisory';
  let serviceHref = '/pricing#strategy';

  if (industry === 'insurance' || job === 'underwriting' || job === 'claims') {
    serviceTitle = 'Insurance agents + data processing';
    serviceHref = '/solutions/insurance';
  } else if (industry === 'financial' || job === 'finance') {
    serviceTitle = 'Financial services agents + governed data';
    serviceHref = '/solutions/financial-services';
  } else if (job === 'support') {
    serviceTitle = 'Agent workflows + integrations';
    serviceHref = '/platform/agents';
  } else if (industry === 'healthcare') {
    serviceTitle = 'Data-readiness sprint (regulated data)';
    serviceHref = '/platform/data-processing';
  }

  if (job === 'other' && industry === 'other') {
    serviceTitle = 'Discovery sprint — map use case and data';
    serviceHref = '/pricing#strategy';
  }

  let cloudTitle = 'We will recommend a cloud after a short discovery';
  let cloudBody =
    'No need to pick a server now. If you have no cloud yet, we can start on a managed template, then move to your account.';

  if (answers.cloud === 'aws' || answers.cloud === 'azure' || answers.cloud === 'gcp') {
    const name = cloudNames[answers.cloud];
    cloudTitle = `Stay on ${name} (recommended)`;
    cloudBody = `We will not migrate you off ${name}. DynasAI is the front layer; compute, storage, and models stay in your ${name} account with least-privilege access.`;
  } else if (answers.cloud === 'onprem') {
    cloudTitle = 'Hybrid — data stays private';
    cloudBody =
      'Sensitive stores stay on-prem or in your private cloud. The front layer and selected models use private networking. We do not need standing admin on your estate.';
  }

  if (answers.residency === 'eu') {
    cloudBody += ' EU personal data stays in EU regions you approve.';
  } else if (answers.residency === 'us') {
    cloudBody += ' US workloads stay in US regions you approve.';
  }

  let engagement = 'We will confirm a 2–4 week data-readiness sprint, then production in your tenant.';
  if (answers.start === 'workspace') {
    engagement = 'Self-serve workspace after a short residency and identity check. Production data still stays in your cloud.';
  } else if (answers.start === 'sprint') {
    engagement = 'Discovery or data-readiness sprint (2–4 weeks): source map, quality eval, cloud path, then build.';
  }

  const summary = `${serviceTitle}. ${cloudTitle}.`;

  return { serviceTitle, serviceHref, cloudTitle, cloudBody, engagement, summary };
}
