/** Original DynasAI playbook pages — used by the gated PDF viewer and Worker PDF download. */

export type PlaybookPage = {
  number: string;
  kicker: string;
  title: string;
  body: string[];
};

export const playbookMeta = {
  title: 'Insurance Data Streamlining Playbook',
  subtitle: 'Collect, evaluate, process, automate — on the cloud you already run.',
  filename: 'dynasai-insurance-data-streamlining-playbook.pdf',
  source: 'playbook',
} as const;

export const playbookPages: PlaybookPage[] = [
  {
    number: '01',
    kicker: 'DynasAI · Original guide',
    title: 'Make insurance data usable before you automate',
    body: [
      'Policy admin, claims, billing, documents, and telematics rarely share a trusted packet. Carriers stall on AI when submissions and FNOL files are incomplete — not because they lack another model.',
      'DynasAI is the front layer. We collect a working set, evaluate quality, process a versioned context layer, then attach governed agents with human gates.',
      'Compute, storage, and models stay in your AWS, Azure, or GCP account (or private network). We do not force a hyperscaler or ask for a network diagram on a public form.',
    ],
  },
  {
    number: '02',
    kicker: 'Step 01–02',
    title: 'Collect, then evaluate',
    body: [
      'Collect: connect cores, document stores, APIs, and batch files. Leave systems of record in place. DynasAI holds a governed working set — not a shadow copy of your estate.',
      'Evaluate: score completeness, freshness, duplicates, and retrieval quality. If the packet is not ready, the workflow stops instead of inventing coverage.',
      'This is how underwriters and adjusters get a file they can trust before an agent proposes the next action.',
    ],
  },
  {
    number: '03',
    kicker: 'Step 03–04',
    title: 'Process, then automate',
    body: [
      'Process: normalize, enrich, and version transforms so submissions, loss runs, and correspondence become one audit-ready context.',
      'Automate: attach agents for prefill, intake, and routing with approval gates, evals, and logs. EU or US residency follows the regions you approve.',
      'We do not train public models on customer insurance content. Production access is least privilege.',
    ],
  },
  {
    number: '04',
    kicker: 'Where it attaches',
    title: 'Underwriting, claims, and feeds',
    body: [
      'Underwriting packets: application data, documents, and third-party enrichments in one review file. Agents propose; underwriters decide.',
      'Claims intake: FNOL, images, and notes classified and routed with evidence remaining in your tenant.',
      'Telematics and bureau feeds: land external data next to policy records and evaluate before pricing or claims use.',
    ],
  },
  {
    number: '05',
    kicker: 'Next step',
    title: 'Map your cloud and residency path',
    body: [
      'Tell us where policy, claims, and documents live today. We recommend whether to stay on AWS, Azure, or GCP, then a data-readiness sprint if sources are not ready.',
      'Start at dynasai.ai/start. This playbook is DynasAI original content — not a reprint of any third-party brochure.',
      'Questions: hello@dynasai.ai',
    ],
  },
];
