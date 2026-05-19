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
  lastUpdated: "May 15, 2024",
  jurisdiction: "South Africa",
  sections: [
    {
      title: "Agreement to Terms",
      body: "By accessing or using HSOCIETY services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use our services.",
      bullets: [
        "These terms apply to all visitors, users, and others who access the service.",
        "Your access to and use of the service is conditioned on your acceptance of and compliance with these terms."
      ]
    },
    {
      title: "Training and Professional Engagement",
      body: "HSOCIETY provides cybersecurity training and offensive security services. Participation in these programs requires strict adherence to ethical guidelines and legal frameworks.",
      bullets: [
        "Users must not use skills learned for illegal purposes.",
        "Unauthorized testing of third-party systems is strictly prohibited.",
        "Compliance with the Cybercrimes Act is mandatory."
      ]
    },
    {
      title: "Intellectual Property",
      body: "The service and its original content, features, and functionality are and will remain the exclusive property of HSOCIETY OFFSEC.",
      bullets: [
        "Training materials are for personal use only.",
        "Distribution or reproduction of content without consent is prohibited.",
        "Proprietary tooling remains the property of HSOCIETY."
      ]
    },
    {
      title: "User Accounts",
      body: "When you create an account with us, you must provide information that is accurate, complete, and current at all times.",
      bullets: [
        "Failure to do so constitutes a breach of the Terms.",
        "You are responsible for safeguarding your password.",
        "You must notify us immediately upon becoming aware of any breach of security."
      ]
    },
    {
      title: "Termination",
      body: "We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
      bullets: [
        "All provisions of the Terms which by their nature should survive termination shall survive.",
        "Breach of ethical guidelines will result in immediate ban.",
        "Refunds for terminated accounts are at our sole discretion."
      ]
    }
  ]
};
