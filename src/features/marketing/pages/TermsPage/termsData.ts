export interface TermsSection {
  title: string;
  body: string;
  bullets: string[];
}

export interface TermsData {
  effectiveDate: string;
  lastUpdated: string;
  jurisdiction: string;
  sections: TermsSection[];
}

export const termsData: TermsData = {
  effectiveDate: "January 1, 2024",
  lastUpdated: "July 2026",
  jurisdiction: "Republic of Ghana",
  sections: [
    {
      title: "Acceptance of Terms",
      body: "By accessing, browsing, or using the QYVORA platform (the \"Platform\"), including all websites, applications, APIs, training environments, laboratories, and related services (collectively, the \"Services\"), you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service (\"Terms\") and our Privacy Policy. If you do not agree to these Terms in their entirety, you must immediately discontinue all use of the Services.",
      bullets: [
        "These Terms constitute a legally binding agreement between you (\"User,\" \"you,\" or \"your\") and QYVORA OFFSEC (\"QYVORA,\" \"we,\" \"us,\" or \"our\").",
        "Your continued use of the Services following any changes to these Terms constitutes your acceptance of such changes.",
        "We reserve the right to modify, suspend, or discontinue any part of the Services at any time without prior notice or liability.",
        "By creating an account, you confirm that you are at least 18 years of age or the age of legal majority in your jurisdiction, whichever is greater."
      ]
    },
    {
      title: "Eligibility & Account Registration",
      body: "The Services are intended solely for individuals and entities that can form legally binding agreements under applicable law. By registering an account, you represent and warrant that all information provided is accurate, complete, and current, and that you will maintain and promptly update such information.",
      bullets: [
        "You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        "You must immediately notify QYVORA of any unauthorized use of your account or any other breach of security.",
        "QYVORA reserves the right to suspend or terminate accounts that contain false, misleading, or outdated information.",
        "You may not share your account credentials with any third party or allow multiple individuals to use a single account.",
        "QYVORA shall not be liable for any loss or damage arising from your failure to comply with the security obligations outlined in this section."
      ]
    },
    {
      title: "Permitted Use & Prohibited Conduct",
      body: "QYVORA provides a platform for cybersecurity education, offensive security training, and professional engagement. All use of the Services must comply with applicable local, national, and international laws and regulations. You are granted a limited, non-exclusive, non-transferable, and revocable license to use the Services for their intended purpose.",
      bullets: [
        "You may use the Platform solely for lawful educational, research, and professional purposes directly related to cybersecurity.",
        "Any penetration testing, vulnerability assessment, or offensive security activity must be conducted only on systems for which you have explicit, written authorization from the system owner.",
        "You must not use skills, techniques, or knowledge acquired through QYVORA services to gain unauthorized access to any system, network, or data belonging to third parties.",
        "Reverse engineering, decompiling, disassembling, or attempting to extract source code from any part of the Platform is strictly prohibited.",
        "You must not use the Services to transmit, distribute, or store any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.",
        "Automated access to the Platform, including the use of bots, scrapers, or similar tools, is prohibited without prior written consent from QYVORA.",
        "Any attempt to circumvent, disable, or interfere with security features, access controls, or usage limitations of the Services is strictly forbidden."
      ]
    },
    {
      title: "Training Programs & Laboratories",
      body: "QYVORA offers structured training programs, hands-on laboratories, bootcamps, and certification pathways. All training content, lab environments, exercises, and associated materials are proprietary and protected under applicable intellectual property laws.",
      bullets: [
        "Training materials, lab configurations, challenge designs, and course content are owned by QYVORA and may not be reproduced, distributed, or shared without explicit written permission.",
        "Lab environments are provided for educational purposes only. Any activity conducted within these environments must remain within the designated boundaries of each exercise.",
        "QYVORA reserves the right to modify, update, or remove training content, labs, or certifications at any time without prior notice.",
        "Completion of training programs or laboratories does not guarantee employment, certification by third-party bodies, or any specific outcome.",
        "QYVORA makes no representations regarding the recognition or transferability of any training completion records by external institutions or employers."
      ]
    },
    {
      title: "Professional Services & Engagements",
      body: "QYVORA may provide professional cybersecurity services including penetration testing, security assessments, consulting, and advisory engagements. These services are governed by separate agreements and statements of work executed between the parties.",
      bullets: [
        "Professional engagements require execution of a formal Statement of Work (SOW) or Master Service Agreement (MSA) prior to commencement.",
        "All findings, reports, and deliverables produced during professional engagements are confidential and subject to the terms of the applicable engagement agreement.",
        "QYVORA shall not be held liable for any security vulnerabilities, breaches, or incidents that are discovered but not addressed due to scope limitations defined in the engagement agreement.",
        "Clients are solely responsible for obtaining all necessary authorizations and permissions prior to the commencement of any security testing activities."
      ]
    },
    {
      title: "Intellectual Property Rights",
      body: "All content, materials, trademarks, service marks, trade names, logos, designs, source code, algorithms, documentation, and other intellectual property associated with the Platform and Services are the exclusive property of QYVORA or its licensors and are protected by applicable intellectual property laws.",
      bullets: [
        "No license or right to use any QYVORA intellectual property is granted except the limited right to use the Services as expressly permitted under these Terms.",
        "User-generated content submitted to the Platform remains your property; however, by submitting content, you grant QYVORA a worldwide, irrevocable, royalty-free license to use, modify, display, and distribute such content.",
        "QYVORA's name, logo, and all related marks are trademarks of QYVORA OFFSEC. Unauthorized use of these marks is strictly prohibited.",
        "Any feedback, suggestions, or ideas provided by users regarding the Services may be used by QYVORA without obligation or compensation to the user."
      ]
    },
    {
      title: "Payment, Billing & Refunds",
      body: "Certain features and services on the Platform require payment. All fees are stated in United States Dollars (USD) unless otherwise specified. By selecting a paid service, you authorize QYVORA to charge the applicable fees to your designated payment method.",
      bullets: [
        "All payments are non-refundable unless expressly stated otherwise in writing or required by applicable consumer protection laws.",
        "QYVORA reserves the right to change pricing at any time. Price changes will not affect fees already paid for active subscription periods.",
        "Failure to make timely payment may result in suspension or termination of your access to paid features and services.",
        "You are responsible for all taxes, duties, or levies imposed by taxing authorities in your jurisdiction. QYVORA is not responsible for collecting or remitting taxes on your behalf unless explicitly required by law.",
        "Chargebacks or payment disputes initiated without first contacting QYVORA's support team may result in immediate account suspension."
      ]
    },
    {
      title: "Cancellations & Termination by User",
      body: "You may cancel your account at any time by contacting QYVORA support or through the account settings on the Platform. Cancellation does not entitle you to a refund unless required by applicable law.",
      bullets: [
        "Upon cancellation, your access to the Platform and all associated services will be revoked at the end of the current billing period.",
        "QYVORA may retain your data for a period necessary to fulfill legal obligations, resolve disputes, and enforce agreements, after which it will be deleted in accordance with our Privacy Policy.",
        "Certain data, including training completion records and achievement history, may be retained indefinitely in anonymized form for statistical and analytical purposes."
      ]
    },
    {
      title: "Termination by QYVORA",
      body: "QYVORA reserves the right to suspend or terminate your access to the Services immediately, without prior notice or liability, for any reason, including but not limited to a breach of these Terms, suspected fraudulent or illegal activity, or conduct that QYVORA, in its sole discretion, deems harmful to other users, the Platform, or third parties.",
      bullets: [
        "Upon termination, all rights and licenses granted to you under these Terms will immediately cease.",
        "Termination does not relieve you of any obligations or liabilities incurred prior to the effective date of termination.",
        "QYVORA shall not be liable to you or any third party for any termination of your access to the Services.",
        "Sections of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property rights, limitation of liability, indemnification, and dispute resolution provisions."
      ]
    },
    {
      title: "Limitation of Liability",
      body: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, QYVORA, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.",
      bullets: [
        "QYVORA's total aggregate liability to you for all claims arising out of or relating to the use of or inability to use the Services shall not exceed the greater of one hundred US dollars (USD $100.00) or the amount paid by you to QYVORA in the twelve (12) months immediately preceding the event giving rise to the claim.",
        "The limitations of liability apply regardless of the legal theory, whether based on warranty, contract, tort (including negligence), strict liability, or any other basis, even if QYVORA has been advised of the possibility of such damages.",
        "Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you. In such cases, QYVORA's liability shall be limited to the fullest extent permitted by applicable law.",
        "QYVORA shall not be liable for any damages, harm, or losses arising from your participation in unauthorized activities, your violation of these Terms, or your violation of any applicable law or regulation."
      ]
    },
    {
      title: "Indemnification",
      body: "You agree to defend, indemnify, and hold harmless QYVORA, its officers, directors, employees, contractors, agents, licensors, suppliers, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from or related to:",
      bullets: [
        "Your use of and access to the Services, including any data or content transmitted or received through your account.",
        "Your violation of any provision of these Terms, including but not limited to your representations, warranties, and obligations herein.",
        "Your violation of any third-party right, including intellectual property rights, privacy rights, or proprietary rights.",
        "Any activity conducted through your account, whether or not authorized by you, including unauthorized access to systems or data.",
        "Your violation of any applicable law, rule, or regulation, including but not limited to computer fraud and abuse laws, data protection regulations, and cybercrime legislation."
      ]
    },
    {
      title: "Disclaimer of Warranties",
      body: "THE SERVICES ARE PROVIDED ON AN \"AS IS\" AND \"AS AVAILABLE\" BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.",
      bullets: [
        "QYVORA does not warrant that the Services will be uninterrupted, timely, secure, error-free, or free of viruses or other harmful components.",
        "QYVORA does not warrant that the results obtained from the use of the Services will be accurate, reliable, or complete.",
        "Any reliance you place on the Services, training content, lab environments, or professional advice obtained through the Platform is strictly at your own risk.",
        "QYVORA makes no warranties regarding the accuracy, completeness, or reliability of any third-party content, links, or resources accessed through the Services."
      ]
    },
    {
      title: "Data Protection & Privacy",
      body: "Your use of the Services is also governed by our Privacy Policy, which describes how we collect, use, store, and disclose your personal information. By using the Services, you consent to the collection and use of your data as described in the Privacy Policy.",
      bullets: [
        "QYVORA processes personal data in accordance with applicable data protection laws, including the Ghana Data Protection Act, 2012 (Act 843) and other relevant legislation.",
        "You acknowledge that data transmitted over the internet may not be completely secure, and QYVORA cannot guarantee the security of data transmitted to or from the Platform.",
        "QYVORA may collect and process usage data, including logs, analytics, and performance metrics, to improve the Services and ensure platform integrity.",
        "You are responsible for ensuring that your use of the Platform complies with all applicable data protection laws in your jurisdiction."
      ]
    },
    {
      title: "Confidentiality",
      body: "Certain aspects of the Services may involve access to confidential or proprietary information. You agree to maintain the confidentiality of any non-public information disclosed to you through the Services.",
      bullets: [
        "Confidential information includes but is not limited to lab solutions, challenge designs, training methodologies, business strategies, and unpublished platform features.",
        "You must not disclose confidential information to any third party without prior written consent from QYVORA.",
        "The obligations of confidentiality shall survive the termination or expiration of your account for a period of three (3) years."
      ]
    },
    {
      title: "Governing Law & Dispute Resolution",
      body: "These Terms shall be governed by and construed in accordance with the laws of the Republic of Ghana, without regard to its conflict of law provisions. Any dispute arising out of or relating to these Terms or the Services shall be resolved in accordance with the provisions set forth below.",
      bullets: [
        "You agree to first attempt to resolve any dispute informally by contacting QYVORA at the email address provided in these Terms. The parties shall attempt to resolve the dispute through good-faith negotiation for a period of thirty (30) days before initiating formal proceedings.",
        "Any dispute that cannot be resolved informally shall be submitted to binding arbitration administered by the Alternative Dispute Resolution Centre (ADRC) in Accra, Ghana, in accordance with its prevailing rules and procedures.",
        "The language of arbitration shall be English. The arbitral tribunal shall consist of a sole arbitrator mutually agreed upon by the parties.",
        "The decision of the arbitrator shall be final and binding on both parties and may be enforced in any court of competent jurisdiction.",
        "Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights or confidential information."
      ]
    },
    {
      title: "Force Majeure",
      body: "QYVORA shall not be liable for any failure or delay in performing its obligations under these Terms where such failure or delay results from circumstances beyond QYVORA's reasonable control, including but not limited to acts of God, natural disasters, pandemics, war, terrorism, civil unrest, government actions, power failures, internet or telecommunications disruptions, or cybersecurity incidents.",
      bullets: [
        "In the event of a force majeure occurrence, QYVORA's obligations under these Terms shall be suspended for the duration of such event.",
        "QYVORA shall use commercially reasonable efforts to mitigate the effects of any force majeure event and resume performance as soon as practicable.",
        "If a force majeure event continues for more than ninety (90) consecutive days, either party may terminate the affected Services without liability."
      ]
    },
    {
      title: "Severability",
      body: "If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, and the remaining provisions shall continue in full force and effect.",
      bullets: [
        "The invalidity or unenforceability of any provision shall not affect the validity or enforceability of any other provision of these Terms.",
        "Both parties agree to negotiate in good faith a valid, enforceable substitute provision that most closely achieves the economic, business, and other purposes of the invalid or unenforceable provision."
      ]
    },
    {
      title: "Entire Agreement",
      body: "These Terms, together with the Privacy Policy and any other legal notices or agreements published by QYVORA on the Platform, constitute the entire agreement between you and QYVORA regarding the use of the Services and supersede all prior and contemporaneous agreements, proposals, representations, and understandings, whether written or oral, relating to the subject matter herein.",
      bullets: [
        "Any failure by QYVORA to exercise or enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.",
        "No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term, and QYVORA's failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision."
      ]
    },
    {
      title: "Contact Information",
      body: "If you have any questions, concerns, or notices regarding these Terms of Service, please contact QYVORA at:",
      bullets: [
        "Email: qyvorasec@gmail.com",
        "Website: https://qyvora.com",
        "QYVORA OFFSEC - Republic of Ghana",
        "For matters requiring formal legal notice, please send written correspondence to the above email address with \"Legal Notice\" in the subject line."
      ]
    }
  ]
};
