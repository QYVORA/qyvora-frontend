import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import type { LegalDocument } from '../legalTypes';

const CONTACT_EMAIL = SITE_CONFIG.contact.opsEmail;

export const refundPolicy: LegalDocument = {
  slug: 'refunds',
  kicker: 'Legal · Payments',
  title: 'Refund & Cancellation Policy',
  summary:
    'How cancellations, refunds, and instalment payments work for QYVORA bootcamps, labs, and professional services.',
  effectiveDate: '5 November 2026',
  lastUpdated: 'November 2026',
  jurisdiction: 'Republic of Ghana',
  sections: [
    {
      title: 'Scope',
      shortTitle: 'Scope',
      body: 'This policy covers paid QYVORA bootcamps, labs, and professional services. It should be read with our Terms of Service and the programme page for the specific offering you purchased. Nothing in this policy limits a right you have under applicable consumer-protection law.',
      bullets: [
        'Where a separate written agreement or statement of work applies to a professional engagement, that agreement controls if it conflicts with this policy.',
        'Programme dates, inclusions, and tuition are published on the relevant programme page.',
      ],
    },
    {
      title: 'Bootcamp tuition and instalments',
      shortTitle: 'Instalments',
      body: 'QOSE is a three-month programme with a total tuition of GH\u20b5800, paid in three instalments. The first instalment is GH\u20b5300 and confirms your place in the cohort; the remaining two instalments are set out on the QOSE programme page.',
      bullets: [
        'Paying the first instalment reserves your seat for the published cohort start date.',
        'Each later instalment unlocks the next stage of the programme. You keep access to material you have already completed even if you do not continue.',
        'Overdue payments first enter a grace period; new content is paused while previous progress is retained.',
        'We do not delete accounts or erase completed progress solely because an instalment is late.',
      ],
    },
    {
      title: 'Cancelling before the programme starts',
      shortTitle: 'Before start',
      body: 'If you cancel before the published cohort start date, contact us as soon as possible. We will refund the tuition you have paid for content that has not started, less any non-recoverable payment-processing costs, unless applicable law requires a different outcome.',
      bullets: [
        'Request the cancellation in writing from the email address on your registration.',
        'Include your full name, programme, and payment reference so we can locate the payment.',
        'If we cancel or reschedule a cohort and you cannot attend the new dates, you may choose a full refund of unused tuition or a place in the next available cohort.',
      ],
    },
    {
      title: 'Cancelling after the programme starts',
      shortTitle: 'After start',
      body: 'Once a stage has started, the instalment for that stage is non-refundable because access to the curriculum, labs, and instruction has already been provided. Future instalments that are not yet due can be cancelled.',
      bullets: [
        'If you have paid ahead for a future month that has not started, you may request a refund of that unused month.',
        'Missed live sessions do not create a refund entitlement, but you keep access to recordings and materials where they are provided.',
        'If you are removed for a serious breach of our Terms or Acceptable Use policy, fees already paid are not refundable unless the law requires otherwise.',
      ],
    },
    {
      title: 'Labs and digital content',
      shortTitle: 'Labs',
      body: 'Self-paced labs and digital materials are delivered immediately on purchase. Because access cannot be returned, they are generally non-refundable once you have started the lab, except where the law requires a refund or where the content is materially defective.',
      bullets: [
        'If you are charged in error or cannot access a lab you paid for, contact us and we will investigate and correct it.',
        'If a lab is withdrawn before you start, we will refund the amount you paid for it.',
      ],
    },
    {
      title: 'Professional services',
      shortTitle: 'Services',
      body: 'Penetration tests, assessments, and consulting engagements follow the cancellation and payment terms in the applicable statement of work or master service agreement. Unless that agreement says otherwise, deposits become non-refundable once scheduling or work has begun.',
      bullets: [
        'Rescheduling is subject to the notice period in the statement of work.',
        'Deliverables already produced remain payable.',
      ],
    },
    {
      title: 'How to request a refund',
      shortTitle: 'Request',
      body: `Email ${CONTACT_EMAIL} with the subject "Refund request". Include your full name, the programme or service, the email used at registration, the payment reference, and the reason for the request. We may ask for additional information to verify the payment and protect against fraud.`,
      bullets: [
        'We aim to acknowledge refund requests within 3 business days and to decide within 10 business days after we have the information we need.',
        'Approved refunds are returned through the original payment method where possible. Processing time after approval depends on your bank or payment provider.',
        'We may deduct non-recoverable transaction fees where the law allows it.',
      ],
    },
    {
      title: 'Chargebacks and disputes',
      shortTitle: 'Disputes',
      body: 'Please contact us before starting a chargeback or payment dispute. Most issues can be resolved faster directly. If you do raise a dispute, we may pause access while the payment provider investigates, and we will cooperate with that process.',
      bullets: [],
    },
    {
      title: 'Your statutory rights',
      shortTitle: 'Your rights',
      body: 'This policy explains our standard practice. It does not exclude or limit any mandatory consumer right available to you in Ghana or your country of residence. If a mandatory right gives you a better outcome than this policy, that right applies.',
      bullets: [],
    },
    {
      title: 'Changes and contact',
      shortTitle: 'Contact',
      body: `We may update this policy to reflect changes to our programmes or the law. The updated version will appear on this page with a revised date. Questions can be sent to ${CONTACT_EMAIL} with the subject "Refund question".`,
      bullets: [],
    },
  ],
};
