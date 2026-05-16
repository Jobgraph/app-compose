import type { ComposeRequest } from './types';

export function getMockDocument(request: ComposeRequest): string {
  const { documentType, tone, length } = request;
  const brief = request.brief.trim();

  const toneAdj = tone === 'professional' ? 'professional' : tone === 'friendly' ? 'warm and approachable' : tone === 'formal' ? 'formal and authoritative' : 'relaxed and conversational';
  const closingStyle = tone === 'formal' ? 'Yours faithfully' : tone === 'friendly' ? 'Warm regards' : tone === 'casual' ? 'Cheers' : 'Best regards';

  const topic = brief.length > 60 ? brief.slice(0, 57) + '...' : brief || 'your recent enquiry';

  const extras = length === 'long'
    ? '\n\nWe believe this approach will deliver measurable improvements across the organisation. Our team has conducted extensive research and benchmarking to validate these recommendations. Early indicators suggest a 15-20% improvement in key metrics within the first quarter of implementation.\n\nPlease do not hesitate to reach out if you have any further questions or require additional detail on any aspect of this document.'
    : length === 'short'
      ? ''
      : '\n\nPlease let me know if you require any further information or would like to discuss this in more detail.';

  switch (documentType) {
    case 'email':
      return `**Subject: Re: ${topic}**

Dear Colleague,

Thank you for reaching out regarding ${topic}. I appreciate you bringing this to my attention and I'm happy to provide a ${toneAdj} response.

After reviewing the details, I'd like to highlight the following key points:

- **Timeline**: We can begin work within the next two weeks, with an initial review milestone at the 30-day mark.
- **Resources**: The project will require input from both the operations and product teams, with a dedicated project lead coordinating activities.
- **Budget**: Initial estimates suggest this falls within our quarterly allocation, though I'd recommend setting aside a 10% contingency.
- **Next steps**: I'll circulate a detailed project brief by end of week for your review and feedback.

I'm confident we can deliver strong results on this initiative. I'd suggest we schedule a 30-minute alignment call early next week to finalise the scope and assign responsibilities.${extras}

${closingStyle},
[Your name]
[Your title]`;

    case 'letter':
      return `**${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}**

[Recipient Name]
[Organisation]
[Address Line 1]
[City, Postcode]

**Re: ${topic}**

Dear Sir/Madam,

I am writing to you in connection with ${topic}. This letter serves to outline our position and proposed course of action in a ${toneAdj} manner.

Having carefully considered all relevant factors, we wish to convey the following:

Our organisation remains fully committed to delivering excellence in this area. We have undertaken a thorough review of current processes and identified several opportunities for improvement that we believe will be of significant mutual benefit.

We propose the following steps:

1. An initial consultation meeting to align on objectives and expectations.
2. A comprehensive review phase lasting approximately four to six weeks.
3. Delivery of a detailed findings report with actionable recommendations.
4. A follow-up session to discuss implementation priorities and timelines.${extras}

We look forward to your response and remain at your disposal for any questions or clarifications you may require.

${closingStyle},

[Your name]
[Your title]
[Organisation]`;

    case 'report':
      return `**Executive Summary Report**
**Subject: ${topic}**
**Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}**
**Classification: Internal**

---

**1. Executive Summary**

This report provides a ${toneAdj} analysis of ${topic}. The findings are based on data collected over the past quarter and input from key stakeholders across the organisation.

**2. Key Findings**

- Overall performance has improved by 12% compared to the previous period, driven primarily by operational efficiencies and process automation.
- Customer satisfaction scores remain strong at 87%, though there is room for improvement in response times and first-contact resolution.
- Three critical risk areas have been identified that require immediate attention and mitigation planning.
- Staff engagement levels have increased following the introduction of new development programmes and flexible working arrangements.

**3. Analysis**

The data indicates a positive trajectory across most key performance indicators. However, sustained investment in infrastructure and talent development will be essential to maintain this momentum. Market conditions remain favourable, though increased competition in Q3 may create pricing pressure.

**4. Recommendations**

- **Priority 1**: Allocate additional resources to the customer experience workstream to address response time gaps.
- **Priority 2**: Implement the proposed risk mitigation framework within the next 60 days.
- **Priority 3**: Commission a feasibility study for the technology upgrade programme.
- **Priority 4**: Review staffing levels in key operational areas ahead of the peak period.${extras}

**5. Next Steps**

A follow-up review is recommended in 90 days to assess progress against these recommendations.`;

    case 'memo':
      return `**INTERNAL MEMORANDUM**

**To:** All Staff / [Department]
**From:** [Your name], [Your title]
**Date:** ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
**Subject:** ${topic}

---

This memo is to inform you regarding ${topic}. Please read the following carefully and direct any questions to the undersigned.

**Background**

Following recent discussions at the leadership level, a decision has been made to move forward with changes in this area. This ${toneAdj} communication aims to ensure all relevant parties are informed and aligned.

**Key Points**

1. The new process will take effect from the start of next month. All teams should begin preparing for the transition immediately.
2. Training sessions will be scheduled during the week of [date] to ensure smooth adoption. Attendance is strongly encouraged.
3. Updated documentation and guidelines will be distributed via the intranet by end of this week.
4. A dedicated support channel has been established for questions and feedback during the transition period.

**Action Required**

All team leads are asked to review the updated procedures with their teams and confirm readiness by [date]. Please ensure any dependencies or concerns are raised at the earliest opportunity.${extras}

Thank you for your attention to this matter and your continued cooperation.`;

    case 'proposal':
      return `**Business Proposal**
**${topic}**
**Prepared by: [Your name] | ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}**

---

**1. Overview**

This proposal outlines a ${toneAdj} approach to ${topic}. It is designed to provide a clear framework for delivery while ensuring alignment with organisational objectives and stakeholder expectations.

**2. Objectives**

- Deliver a comprehensive solution that addresses the core requirements identified during initial discussions.
- Achieve measurable outcomes within the agreed timeline, with clear milestones and success criteria.
- Ensure minimal disruption to existing operations during the implementation phase.
- Establish a foundation for long-term value creation and continuous improvement.

**3. Proposed Approach**

The project will be delivered in three phases:

- **Phase 1 — Discovery & Planning** (Weeks 1-3): Stakeholder interviews, requirements gathering, and detailed project planning.
- **Phase 2 — Implementation** (Weeks 4-10): Core build and delivery, with iterative review cycles and regular progress updates.
- **Phase 3 — Launch & Optimisation** (Weeks 11-14): Deployment, testing, training, and handover with a structured support period.

**4. Investment**

| Item | Cost |
|------|------|
| Phase 1 — Discovery | £8,500 |
| Phase 2 — Implementation | £32,000 |
| Phase 3 — Launch | £9,500 |
| **Total** | **£50,000** |

Payment terms: 30% on commencement, 40% at Phase 2 completion, 30% on final delivery.

**5. Timeline**

Estimated duration: 14 weeks from project kick-off. We are available to commence within two weeks of proposal acceptance.${extras}

**6. Next Steps**

We welcome the opportunity to discuss this proposal in further detail. Please do not hesitate to reach out to arrange a follow-up meeting.`;
  }
}
