export interface PhishingIndicator {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
}

export interface EmailHeader {
  key: string;
  value: string;
}

export interface PhishingEmail {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  indicators: PhishingIndicator[];
  receivedAt: string;
  headers: EmailHeader[];
  links: { text: string; actualUrl: string; displayUrl: string }[];
  attachment?: { name: string; type: string; size: string; malicious: boolean };
}

export interface PhishingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  emails: PhishingEmail[];
  questions: PhishingQuestion[];
  flag: string;
  cpReward: number;
}

export interface PhishingQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PHISHING_CHALLENGES: PhishingChallenge[] = [
  {
    id: 'phishing-credential-harvest',
    title: 'Credential Harvest',
    description:
      'A suspicious email claims your PayPal account has been limited. Analyze the email headers, links, and content to identify the phishing attempt.',
    difficulty: 'beginner',
    cpReward: 150,
    flag: 'FLAG{phish_credential_paypa1_scam}',
    emails: [
      {
        id: 'ph-ch1-email-001',
        from: 'security@paypa1.com',
        fromName: 'PayPal Security Team',
        to: 'student@qyvora.com',
        subject: '⚠️ Urgent: Your PayPal Account Has Been Limited – Action Required',
        isPhishing: true,
        receivedAt: '2026-07-11T08:23:14.000Z',
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: #003087; padding: 24px 30px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 22px; margin: 0; font-weight: 700; }
    .header .subtitle { color: #b3d4fc; font-size: 12px; margin-top: 4px; }
    .body-content { padding: 30px; color: #333333; line-height: 1.6; }
    .alert-box { background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 14px 18px; margin: 16px 0; font-size: 14px; }
    .alert-box strong { color: #856404; }
    .btn-primary { display: inline-block; background: #0070ba; color: #ffffff !important; text-decoration: none; padding: 12px 40px; border-radius: 25px; font-size: 16px; font-weight: 600; margin: 16px 0; }
    .btn-primary:hover { background: #005ea6; }
    .footer { background: #f8f9fa; padding: 20px 30px; font-size: 11px; color: #999999; text-align: center; border-top: 1px solid #e9ecef; }
    .footer a { color: #0070ba; text-decoration: none; }
    .warning-text { font-size: 12px; color: #cc0000; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PayPal</h1>
      <div class="subtitle">Security Department</div>
    </div>
    <div class="body-content">
      <p>Dear Valued Customer,</p>
      <p>We have detected <strong>unusual activity</strong> on your PayPal account. Your account access has been <strong>temporarily limited</strong> effective immediately.</p>
      <div class="alert-box">
        <strong>⚠️ Action Required:</strong> Your account will be permanently suspended within 24 hours if you do not verify your identity.
      </div>
      <p>To restore full access to your account, please verify your information by clicking the button below:</p>
      <p style="text-align: center;">
        <a href="http://paypa1-secure.login-verify.account-support.xyz/verify?id=88291034&ref=urg" class="btn-primary">Verify My Account Now</a>
      </p>
      <p class="warning-text">⚠ If you do not complete verification within 24 hours, your account balance will be frozen and funds may be seized.</p>
      <p>What happened?<br>
      • Multiple failed login attempts were detected from an unrecognized device<br>
      • A large transaction was attempted from your account<br>
      • Your account may have been compromised</p>
      <p>If you did not perform these actions, your account may be at risk. Secure it immediately.</p>
      <p>Thank you,<br>
      PayPal Security Team<br>
      <em>automated-system@paypa1.com</em></p>
    </div>
    <div class="footer">
      <p>PayPal, Inc. 2211 North First Street, San Jose, CA 95131</p>
      <p><a href="http://paypa1.com/help">Help Center</a> | <a href="http://paypa1.com/privacy">Privacy Policy</a></p>
      <p style="font-size:10px; color:#bbbbbb;">This email was sent to student@qyvora.com. If you believe you received this in error, please contact us immediately.</p>
    </div>
  </div>
</body>
</html>`,
        links: [
          {
            text: 'Verify My Account Now',
            actualUrl: 'http://paypa1-secure.login-verify.account-support.xyz/verify?id=88291034&ref=urg',
            displayUrl: 'https://www.paypal.com/signin',
          },
          {
            text: 'Help Center',
            actualUrl: 'http://paypa1.com/help',
            displayUrl: 'https://www.paypal.com/help',
          },
          {
            text: 'Privacy Policy',
            actualUrl: 'http://paypa1.com/privacy',
            displayUrl: 'https://www.paypal.com/privacy',
          },
        ],
        headers: [
          { key: 'Received', value: 'from mail.paypa1.com (unknown [45.77.131.22]) by mx.qyvora.com (Postfix) with ESMTP id A1B2C3 for <student@qyvora.com>; Fri, 11 Jul 2026 08:23:14 +0000' },
          { key: 'Received-SPF', value: 'softfail (domain of paypa1.com does not designate 45.77.131.22 as permitted sender)' },
          { key: 'Authentication-Results', value: 'mx.qyvora.com; spf=softfail (domain of paypa1.com does not designate 45.77.131.22 as permitted sender) smtp.mailfrom=security@paypa1.com; dkim=fail header.d=paypa1.com; dmarc=fail (p=REJECT) header.from=paypa1.com' },
          { key: 'DKIM-Signature', value: 'v=1; a=rsa-sha256; c=simple/simple; d=paypa1.com; s=mail; bh=abc123...; h=from:to:subject:date:message-id;' },
          { key: 'From', value: '"PayPal Security Team" <security@paypa1.com>' },
          { key: 'To', value: 'student@qyvora.com' },
          { key: 'Subject', value: '⚠️ Urgent: Your PayPal Account Has Been Limited – Action Required' },
          { key: 'Date', value: 'Fri, 11 Jul 2026 08:23:12 +0000' },
          { key: 'Message-ID', value: '<7a2b3c4d5e6f@paypa1.com>' },
          { key: 'X-Mailer', value: 'PHPMailer 6.1.4' },
          { key: 'MIME-Version', value: '1.0' },
          { key: 'Content-Type', value: 'text/html; charset=UTF-8' },
          { key: 'Content-Transfer-Encoding', value: '7bit' },
          { key: 'X-Originating-IP', value: '[45.77.131.22]' },
          { key: 'Return-Path', value: '<security@paypa1.com>' },
        ],
        indicators: [
          {
            type: 'Domain Spoofing',
            description: 'The sender domain is "paypa1.com" (with the letter L replaced by the number 1), not the legitimate "paypal.com".',
            severity: 'high',
            location: 'From: security@paypa1.com',
          },
          {
            type: 'Urgency Language',
            description: 'The email uses extreme urgency: "permanently suspended within 24 hours" and "funds may be seized" to pressure the recipient into acting without thinking.',
            severity: 'medium',
            location: 'Email body',
          },
          {
            type: 'URL Mismatch',
            description: 'The "Verify My Account Now" button displays as paypal.com but actually links to paypa1-secure.login-verify.account-support.xyz — a completely different domain.',
            severity: 'high',
            location: 'Link: Verify My Account Now',
          },
          {
            type: 'SPF Failure',
            description: 'SPF check shows softfail — the sending server is not authorized to send on behalf of paypa1.com.',
            severity: 'high',
            location: 'Received-SPF header',
          },
          {
            type: 'DKIM Failure',
            description: 'DKIM signature validation failed, indicating the email was not legitimately signed by the claimed domain.',
            severity: 'high',
            location: 'Authentication-Results header',
          },
          {
            type: 'Generic Greeting',
            description: 'The email addresses you as "Dear Valued Customer" instead of your actual name — a common phishing tactic.',
            severity: 'low',
            location: 'Email body greeting',
          },
          {
            type: 'Threatening Language',
            description: 'Uses fear tactics about frozen funds and account seizure to bypass rational thinking.',
            severity: 'medium',
            location: 'Email body',
          },
          {
            type: 'Suspicious X-Mailer',
            description: 'The X-Mailer header indicates PHPMailer, a common tool used by attackers for mass mailing — legitimate PayPal uses their own enterprise mail systems.',
            severity: 'medium',
            location: 'X-Mailer header',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'ph-ch1-q1',
        question: 'What is the primary indicator that this email is a phishing attempt?',
        options: [
          'The email was sent at 8:23 AM',
          'The sender domain is paypa1.com (number 1 instead of letter L)',
          'The email uses HTML formatting',
          'The email mentions PayPal',
        ],
        correctIndex: 1,
        explanation:
          'The sender domain "paypa1.com" replaces the letter L with the number 1 — a classic typosquatting technique. Always check the exact sender domain carefully.',
      },
      {
        id: 'ph-ch1-q2',
        question: 'What does the "Received-SPF: softfail" header tell you?',
        options: [
          'The email is definitely legitimate',
          'The sending server is not authorized to send email for this domain',
          'The email was sent from PayPal\'s official servers',
          'SPF softfail means the email passed authentication',
        ],
        correctIndex: 1,
        explanation:
          'A softfail SPF result means the sending IP (45.77.131.22) is not in the authorized sender list for paypa1.com. While softfail doesn\'t block delivery, it\'s a strong red flag when combined with other indicators.',
      },
      {
        id: 'ph-ch1-q3',
        question: 'Where does the "Verify My Account Now" button actually link to?',
        options: [
          'https://www.paypal.com/signin',
          'https://paypa1.com/verify',
          'http://paypa1-secure.login-verify.account-support.xyz/verify?id=88291034&ref=urg',
          'https://account-support.xyz/verify',
        ],
        correctIndex: 2,
        explanation:
          'The display URL shows paypal.com but the actual URL goes to a suspicious multi-layered domain: paypa1-secure.login-verify.account-support.xyz. Always hover over links before clicking to check the actual destination.',
      },
    ],
  },

  {
    id: 'phishing-ceo-fraud',
    title: 'CEO Fraud / BEC',
    description:
      'An email appears to be from the CEO requesting an urgent wire transfer. This Business Email Compromise (BEC) attack uses authority and urgency. Identify the red flags.',
    difficulty: 'intermediate',
    cpReward: 250,
    flag: 'FLAG{phish_bec_wire_fraud}',
    emails: [
      {
        id: 'ph-ch2-email-001',
        from: 'james.richardson-ceo@qyvora.com',
        fromName: 'James Richardson',
        to: 'student@qyvora.com',
        subject: 'Confidential – Urgent Wire Transfer Needed',
        isPhishing: true,
        receivedAt: '2026-07-11T14:07:33.000Z',
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #fafafa; }
    .email-wrapper { max-width: 640px; margin: 20px auto; background: #ffffff; border: 1px solid #e0e0e0; }
    .header-bar { background: #1a1a2e; padding: 16px 24px; display: flex; align-items: center; gap: 12px; }
    .avatar { width: 48px; height: 48px; border-radius: 50%; background: #16213e; color: #e94560; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; }
    .sender-info { color: #ffffff; }
    .sender-info .name { font-size: 16px; font-weight: 600; }
    .sender-info .email { font-size: 12px; color: #a0a0b0; }
    .content { padding: 32px; color: #333; line-height: 1.7; }
    .content p { margin: 12px 0; font-size: 14px; }
    .confidential-banner { background: #fff3e0; border-left: 4px solid #ff9800; padding: 10px 16px; margin: 16px 0; font-size: 13px; color: #e65100; font-weight: 500; }
    .transfer-details { background: #f5f5f5; border-radius: 6px; padding: 16px 20px; margin: 16px 0; font-size: 13px; }
    .transfer-details table { width: 100%; border-collapse: collapse; }
    .transfer-details td { padding: 4px 0; }
    .transfer-details .label { color: #777; width: 140px; font-weight: 500; }
    .sign-off { margin-top: 24px; font-size: 14px; color: #333; }
    .sign-off .title { font-size: 12px; color: #999; margin-top: 4px; }
    .disclaimer { font-size: 10px; color: #aaa; padding: 16px 24px; border-top: 1px solid #eee; margin-top: 24px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header-bar">
      <div class="avatar">JR</div>
      <div class="sender-info">
        <div class="name">James Richardson</div>
        <div class="email">james.richardson-ceo@qyvora.com</div>
      </div>
    </div>
    <div class="content">
      <div class="confidential-banner">🔒 CONFIDENTIAL – Do not forward or discuss with colleagues</div>
      <p>Hi,</p>
      <p>I'm in a board meeting right now and can't take calls. I need you to handle something time-sensitive.</p>
      <p>We have an <strong>urgent acquisition opportunity</strong> that needs to be closed before end of business today. The seller requires a wire transfer to finalize. This is strictly confidential — do not discuss with anyone else in the company until I give the green light.</p>
      <div class="transfer-details">
        <table>
          <tr><td class="label">Beneficiary:</td><td>Zenith Partners Ltd.</td></tr>
          <tr><td class="label">Bank:</td><td>First National Reserve</td></tr>
          <tr><td class="label">Account #:</td><td>8827-4419-0033</td></tr>
          <tr><td class="label">Routing #:</td><td>021000021</td></tr>
          <tr><td class="label">Amount:</td><td>$47,500.00</td></tr>
          <tr><td class="label">Reference:</td><td>ZP-ACQ-2026-0711</td></tr>
          <tr><td class="label">Deadline:</td><td>Today, 5:00 PM EST</td></tr>
        </table>
      </div>
      <p>I'll reimburse this from my personal account and handle the paperwork on Monday. Please confirm once the transfer is initiated.</p>
      <p><strong>Do NOT call me about this — I'm presenting to the board.</strong> Just process it and reply to confirm.</p>
      <div class="sign-off">
        Thanks,<br>
        <strong>James Richardson</strong>
        <div class="title">CEO, Qyvora Inc.</div>
      </div>
    </div>
    <div class="disclaimer">
      CONFIDENTIALITY NOTICE: This email and any attachments are for the exclusive and confidential use of the intended recipient. If you are not the intended recipient, please do not read, distribute, or take action based on this message. If you have received this in error, please notify the sender immediately and delete this message.
    </div>
  </div>
</body>
</html>`,
        links: [
          {
            text: 'View Acquisition Documents',
            actualUrl: 'http://192.168.47.112:8080/docs/zp-acq-2026.pdf',
            displayUrl: 'https://qyvora.com/docs/acquisition-2026.pdf',
          },
        ],
        headers: [
          { key: 'Received', value: 'from mail.qyvora-internal.com (unknown [103.56.78.90]) by mx.qyvora.com (Postfix) with ESMTP id D4E5F6 for <student@qyvora.com>; Fri, 11 Jul 2026 14:07:33 +0000' },
          { key: 'Received-SPF', value: 'fail (domain of qyvora.com does not designate 103.56.78.90 as permitted sender)' },
          { key: 'Authentication-Results', value: 'mx.qyvora.com; spf=fail smtp.mailfrom=james.richardson-ceo@qyvora.com; dkim=fail header.d=qyvora.com; dmarc=fail (p=REJECT) header.from=qyvora.com' },
          { key: 'From', value: '"James Richardson" <james.richardson-ceo@qyvora.com>' },
          { key: 'To', value: 'student@qyvora.com' },
          { key: 'Reply-To', value: 'james.richardson.ceo@outlook.com' },
          { key: 'Subject', value: 'Confidential – Urgent Wire Transfer Needed' },
          { key: 'Date', value: 'Fri, 11 Jul 2026 14:07:31 +0000' },
          { key: 'Message-ID', value: '<9f8e7d6c5b4a@qyvora-internal.com>' },
          { key: 'X-Mailer', value: 'Microsoft Outlook 16.0' },
          { key: 'X-Priority', value: '1 (Highest)' },
          { key: 'MIME-Version', value: '1.0' },
          { key: 'Content-Type', value: 'text/html; charset="UTF-8"' },
          { key: 'Content-Transfer-Encoding', value: 'quoted-printable' },
          { key: 'Return-Path', value: '<james.richardson-ceo@qyvora.com>' },
          { key: 'X-Originating-IP', value: '[103.56.78.90]' },
          { key: 'X-MS-Exchange-Organization-SCL', value: '-1' },
          { key: 'X-Custom-Spam', value: ' suspected spam' },
        ],
        indicators: [
          {
            type: 'Reply-To Mismatch',
            description: 'The Reply-To address (james.richardson.ceo@outlook.com) is a free Outlook email, not the company domain. A real CEO would reply from their corporate address.',
            severity: 'high',
            location: 'Reply-To header',
          },
          {
            type: 'External Sending IP',
            description: 'The email was sent from 103.56.78.90, an external IP not associated with Qyvora\'s mail infrastructure, despite appearing to be from an internal sender.',
            severity: 'high',
            location: 'Received header / X-Originating-IP',
          },
          {
            type: 'SPF/DKIM/DMARC All Fail',
            description: 'All three email authentication mechanisms failed, confirming the email was not sent from authorized servers.',
            severity: 'high',
            location: 'Authentication-Results header',
          },
          {
            type: 'Authority Pressure',
            description: 'The email claims to be from the CEO and uses language like "Do NOT call me" and "I\'m presenting to the board" to prevent verification through other channels.',
            severity: 'high',
            location: 'Email body',
          },
          {
            type: 'Bypass Normal Procedures',
            description: 'Requests bypassing standard approval workflows for a $47,500 wire transfer, a classic BEC tactic.',
            severity: 'high',
            location: 'Email body',
          },
          {
            type: 'Confidentiality Pressure',
            description: 'The email repeatedly emphasizes confidentiality to prevent the recipient from consulting colleagues who might recognize the scam.',
            severity: 'medium',
            location: 'Email body',
          },
          {
            type: 'Suspicious Link',
            description: 'The "View Acquisition Documents" link points to a raw IP address (192.168.47.112) on a non-standard port — likely a phishing payload delivery.',
            severity: 'high',
            location: 'Link: View Acquisition Documents',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'ph-ch2-q1',
        question: 'What is the most critical red flag indicating this is a Business Email Compromise (BEC) attack?',
        options: [
          'The email was sent on a Friday',
          'The Reply-To address is a free Outlook account, not the company domain',
          'The email uses HTML formatting',
          'The CEO mentioned a board meeting',
        ],
        correctIndex: 1,
        explanation:
          'The Reply-To header shows "james.richardson.ceo@outlook.com" — a free email service. The real James Richardson would reply from @qyvora.com. This mismatch is a hallmark of BEC attacks where attackers spoof the From address but can\'t control Reply-To behavior in the same way.',
      },
      {
        id: 'ph-ch2-q2',
        question: 'Why does this email emphasize "CONFIDENTIAL" and "Do NOT call me"?',
        options: [
          'Because wire transfers are always confidential by law',
          'To prevent the recipient from verifying the request through alternative channels like phone calls',
          'Because the CEO is genuinely busy in a meeting',
          'Company policy requires confidentiality for all financial transactions',
        ],
        correctIndex: 1,
        explanation:
          'Attackers deliberately isolate victims by creating urgency and forbidding verification. If the student called the real CEO, they\'d learn the request is fabricated. The confidentiality framing is a social engineering technique to prevent fact-checking.',
      },
      {
        id: 'ph-ch2-q3',
        question: 'What should you do if you receive an email like this?',
        options: [
          'Process the transfer quickly since the CEO asked',
          'Forward the email to the CEO\'s Outlook address to confirm',
          'Contact the CEO through a known, verified channel (phone, in-person) to confirm the request',
          'Reply to the email asking for more details',
        ],
        correctIndex: 2,
        explanation:
          'Always verify urgent financial requests through an independent, known channel. Call the CEO at their known phone number or speak in person. Never use contact information from the suspicious email itself — reply-to addresses can also be controlled by the attacker.',
      },
    ],
  },

  {
    id: 'phishing-tech-support',
    title: 'Tech Support Scam',
    description:
      'A fake IT department email requests a password reset. Analyze the email to identify inconsistencies that reveal it as a phishing attempt.',
    difficulty: 'beginner',
    cpReward: 150,
    flag: 'FLAG{phish_techsupport_password_hijack}',
    emails: [
      {
        id: 'ph-ch3-email-001',
        from: 'it-helpdesk@qyv0ra-support.com',
        fromName: 'Qyvora IT Help Desk',
        to: 'student@qyvora.com',
        subject: '[Action Required] Mandatory Password Reset – Security Compliance',
        isPhishing: true,
        receivedAt: '2026-07-11T09:45:02.000Z',
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f2f5; margin: 0; padding: 20px; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 28px 32px; text-align: center; }
    .header .logo { font-size: 24px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px; }
    .header .tagline { color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 4px; }
    .body { padding: 32px; color: #444; font-size: 14px; line-height: 1.7; }
    .greeting { font-size: 15px; color: #222; font-weight: 500; }
    .notice-box { background: #f0f4ff; border: 1px solid #d0d9f7; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
    .notice-box strong { color: #333; font-size: 13px; }
    .notice-box ul { margin: 8px 0 0 0; padding-left: 20px; }
    .notice-box li { margin: 4px 0; font-size: 13px; }
    .cta-section { text-align: center; margin: 24px 0; }
    .cta-btn { display: inline-block; background: #667eea; color: #fff !important; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 15px; font-weight: 600; }
    .deadline { text-align: center; font-size: 12px; color: #cc0000; font-weight: 600; margin: 12px 0; }
    .footer { padding: 20px 32px; background: #fafafa; font-size: 11px; color: #999; text-align: center; border-top: 1px solid #f0f0f0; }
    .footer a { color: #667eea; text-decoration: none; }
    .help-text { font-size: 12px; color: #888; margin-top: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏢 Qyvora IT Department</div>
      <div class="tagline">Information Technology & Security</div>
    </div>
    <div class="body">
      <p class="greeting">Hello,</p>
      <p>As part of our ongoing <strong>Q3 Security Compliance Initiative</strong>, all employees are required to reset their Active Directory passwords by end of week.</p>
      <div class="notice-box">
        <strong>📋 Why is this required?</strong>
        <ul>
          <li>Recent security audit identified expired credentials</li>
          <li>New compliance policy (SOC 2 Type II) mandate</li>
          <li>Accounts not updated will be locked automatically</li>
        </ul>
      </div>
      <p>Click the button below to securely reset your password through our updated portal:</p>
      <div class="cta-section">
        <a href="http://it-reset.qyv0ra-portal.com/auth/password?user=student@qyvora.com&token=a3f8b2c1" class="cta-btn">Reset Password Now</a>
      </div>
      <div class="deadline">⏰ Deadline: Friday, July 14, 2026 at 11:59 PM EST</div>
      <p>If you have any issues, reply to this email or call the IT Help Desk at ext. 4422.</p>
      <div class="help-text">
        This is an automated message. Please do not reply directly.<br>
        Qyvora IT Help Desk • Building 3, Floor 2
      </div>
    </div>
    <div class="footer">
      <p>© 2026 Qyvora Inc. — Information Technology Department</p>
      <p><a href="https://qyvora.com/it-support">IT Knowledge Base</a> | <a href="https://qyvora.com/security-policy">Security Policy</a></p>
    </div>
  </div>
</body>
</html>`,
        links: [
          {
            text: 'Reset Password Now',
            actualUrl: 'http://it-reset.qyv0ra-portal.com/auth/password?user=student@qyvora.com&token=a3f8b2c1',
            displayUrl: 'https://id.qyvora.com/reset',
          },
          {
            text: 'IT Knowledge Base',
            actualUrl: 'https://qyvora.com/it-support',
            displayUrl: 'https://qyvora.com/it-support',
          },
          {
            text: 'Security Policy',
            actualUrl: 'https://qyvora.com/security-policy',
            displayUrl: 'https://qyvora.com/security-policy',
          },
        ],
        headers: [
          { key: 'Received', value: 'from smtp.qyv0ra-support.com (unknown [185.220.101.44]) by mx.qyvora.com (Postfix) with ESMTP id B7C8D9 for <student@qyvora.com>; Fri, 11 Jul 2026 09:45:02 +0000' },
          { key: 'Received-SPF', value: 'fail (domain of qyvora.com does not designate 185.220.101.44 as permitted sender)' },
          { key: 'Authentication-Results', value: 'mx.qyvora.com; spf=fail smtp.mailfrom=it-helpdesk@qyv0ra-support.com; dkim=none; dmarc=fail (p=REJECT) header.from=qyv0ra-support.com' },
          { key: 'From', value: '"Qyvora IT Help Desk" <it-helpdesk@qyv0ra-support.com>' },
          { key: 'To', value: 'student@qyvora.com' },
          { key: 'Subject', value: '[Action Required] Mandatory Password Reset – Security Compliance' },
          { key: 'Date', value: 'Fri, 11 Jul 2026 09:45:00 +0000' },
          { key: 'Message-ID', value: '<f1e2d3c4b5a6@qyv0ra-support.com>' },
          { key: 'X-Mailer', value: 'Microsoft Outlook 16.0' },
          { key: 'List-Unsubscribe', value: '<mailto:it-helpdesk@qyv0ra-support.com?subject=unsubscribe>' },
          { key: 'MIME-Version', value: '1.0' },
          { key: 'Content-Type', value: 'text/html; charset="UTF-8"' },
          { key: 'Content-Transfer-Encoding', value: 'quoted-printable' },
          { key: 'Return-Path', value: '<it-helpdesk@qyv0ra-support.com>' },
        ],
        indicators: [
          {
            type: 'Lookalike Domain',
            description: 'The sender domain "qyv0ra-support.com" uses a zero instead of the letter O — lookalike domains are a common impersonation technique.',
            severity: 'high',
            location: 'From: it-helpdesk@qyv0ra-support.com',
          },
          {
            type: 'Generic Greeting',
            description: 'The email says "Hello" without addressing you by name. Legitimate IT communications from your organization typically use your actual name.',
            severity: 'medium',
            location: 'Email body greeting',
          },
          {
            type: 'Link Domain Mismatch',
            description: 'The password reset button displays as id.qyvora.com but links to it-reset.qyv0ra-portal.com — the same lookalike domain as the sender.',
            severity: 'high',
            location: 'Link: Reset Password Now',
          },
          {
            type: 'SPF Failure',
            description: 'SPF check failed — the sending server is not authorized for this domain.',
            severity: 'high',
            location: 'Received-SPF header',
          },
          {
            type: 'No DKIM',
            description: 'DKIM result is "none" — the email has no DKIM signature, which is unusual for legitimate corporate email systems.',
            severity: 'medium',
            location: 'Authentication-Results header',
          },
          {
            type: 'External Sending Server',
            description: 'The email originated from 185.220.101.44, an external IP not associated with Qyvora\'s mail infrastructure.',
            severity: 'high',
            location: 'Received header',
          },
          {
            type: 'Urgency and Threat',
            description: 'The email threatens automatic account lockout to pressure immediate action.',
            severity: 'medium',
            location: 'Email body',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'ph-ch3-q1',
        question: 'What should you notice first about the sender domain?',
        options: [
          'It uses HTTPS instead of HTTP',
          'The domain is qyv0ra-support.com, which uses a zero (0) instead of the letter O',
          'It has .com instead of .org',
          'The email address is too long',
        ],
        correctIndex: 1,
        explanation:
          'The domain "qyv0ra-support.com" replaces the letter O with the number 0. This is a homograph/lookalike attack. Always verify the exact spelling of domains, especially characters that look similar (O/0, l/1, rn/m).',
      },
      {
        id: 'ph-ch3-q2',
        question: 'The email says "Hello" instead of your name. What does this suggest?',
        options: [
          'The IT department is being informal',
          'The email was sent in bulk to many recipients without personalization — likely phishing',
          'Your name isn\'t in the system yet',
          'This is normal for automated emails',
        ],
        correctIndex: 1,
        explanation:
          'Legitimate internal IT communications are typically personalized. A generic "Hello" suggests the attacker doesn\'t know your actual name and is mass-sending the same phishing email to many recipients.',
      },
      {
        id: 'ph-ch3-q3',
        question: 'The password reset link shows "https://id.qyvora.com/reset" but where does it actually go?',
        options: [
          'https://id.qyvora.com/reset',
          'https://qyv0ra-support.com/reset',
          'http://it-reset.qyv0ra-portal.com/auth/password?user=student@qyvora.com&token=a3f8b2c1',
          'https://qyvora.com/it-support',
        ],
        correctIndex: 2,
        explanation:
          'The displayed URL is a decoy. The actual link goes to it-reset.qyv0ra-portal.com, a credential harvesting site. Always hover over links to reveal the true destination before clicking.',
      },
    ],
  },

  {
    id: 'phishing-spear-phishing',
    title: 'Spear Phishing',
    description:
      'A highly personalized email appears to come from a known colleague, referencing real company events. This advanced attack uses OSINT to craft a convincing lure.',
    difficulty: 'advanced',
    cpReward: 400,
    flag: 'FLAG{phish_spear_macro_pivot}',
    emails: [
      {
        id: 'ph-ch4-email-001',
        from: 'sarah.chen@qyvora.com',
        fromName: 'Sarah Chen',
        to: 'student@qyvora.com',
        subject: 'Q3 Project Report – Final Version (Updated Formulas)',
        isPhishing: true,
        receivedAt: '2026-07-11T11:32:07.000Z',
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 24px; background: #f8f9fa; color: #333; }
    .email { max-width: 600px; background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e8e8e8; }
    .email p { font-size: 14px; line-height: 1.7; margin: 12px 0; }
    .context-box { background: #e8f5e9; border-left: 3px solid #4caf50; padding: 12px 16px; margin: 16px 0; font-size: 13px; border-radius: 0 4px 4px 0; }
    .attachment-box { background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; padding: 14px 18px; margin: 16px 0; display: flex; align-items: center; gap: 12px; }
    .file-icon { width: 40px; height: 40px; background: #217346; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: bold; }
    .file-info .name { font-size: 13px; font-weight: 600; color: #333; }
    .file-info .meta { font-size: 11px; color: #999; margin-top: 2px; }
    .note { font-size: 13px; color: #666; font-style: italic; margin-top: 16px; padding-top: 12px; border-top: 1px solid #eee; }
    .sign { margin-top: 20px; font-size: 14px; }
    .sign .name { font-weight: 600; }
    .sign .role { font-size: 12px; color: #888; }
    .sign .phone { font-size: 12px; color: #888; margin-top: 2px; }
  </style>
</head>
<body>
  <div class="email">
    <p>Hey,</p>
    <p>Following up on our conversation at the <strong>Q2 all-hands</strong> last Thursday — I finally got the final version of the Q3 project report ready for your review.</p>
    <div class="context-box">
      📊 <strong>Context:</strong> This is the updated version with the revised formulas from Mark's feedback during the leadership review session. I've also incorporated the new budget projections that finance shared on Tuesday.
    </div>
    <p>I attached the file — it's the Excel workbook with macros enabled (the VBA scripts auto-generate the pivot tables and charts). <strong>Please make sure macros are enabled</strong> when you open it, otherwise the data won't populate correctly.</p>
    <div class="attachment-box">
      <div class="file-icon">XLS</div>
      <div class="file-info">
        <div class="name">Q3_Project_Report_Final_v3.xlsm</div>
        <div class="meta">Microsoft Excel Macro-Enabled Workbook • 2.4 MB</div>
      </div>
    </div>
    <p>Can you review and send your comments by Monday? We need to present this to the board on Wednesday.</p>
    <p class="note">P.S. — I also updated the presentation deck we discussed. I'll send that separately once you've confirmed the numbers look right.</p>
    <div class="sign">
      <div class="name">Sarah Chen</div>
      <div class="role">Senior Project Manager, Qyvora</div>
      <div class="phone">📞 ext. 3347 | sarah.chen@qyvora.com</div>
    </div>
  </div>
</body>
</html>`,
        links: [],
        attachment: {
          name: 'Q3_Project_Report_Final_v3.xlsm',
          type: 'application/vnd.ms-excel.sheet.macroEnabled.12',
          size: '2.4 MB',
          malicious: true,
        },
        headers: [
          { key: 'Received', value: 'from mail.qyvora.com (10.0.1.55) by mx.qyvora.com (Postfix) with ESMTP id E6F7A0 for <student@qyvora.com>; Fri, 11 Jul 2026 11:32:07 +0000' },
          { key: 'Received-SPF', value: 'pass (domain of qyvora.com designates 10.0.1.55 as permitted sender)' },
          { key: 'Authentication-Results', value: 'mx.qyvora.com; spf=pass smtp.mailfrom=sarah.chen@qyvora.com; dkim=pass header.d=qyvora.com; dmarc=pass (p=NONE) header.from=qyvora.com' },
          { key: 'DKIM-Signature', value: 'v=1; a=rsa-sha256; c=relaxed/relaxed; d=qyvora.com; s=selector1; bh=xyz789...; h=from:to:subject:date:message-id:mime-version:content-type;' },
          { key: 'From', value: '"Sarah Chen" <sarah.chen@qyvora.com>' },
          { key: 'To', value: 'student@qyvora.com' },
          { key: 'Subject', value: 'Q3 Project Report – Final Version (Updated Formulas)' },
          { key: 'Date', value: 'Fri, 11 Jul 2026 11:32:05 +0000' },
          { key: 'Message-ID', value: '<a1b2c3d4e5f6@qyvora.com>' },
          { key: 'X-Mailer', value: 'Microsoft Outlook 16.0' },
          { key: 'MIME-Version', value: '1.0' },
          { key: 'Content-Type', value: 'multipart/mixed; boundary="----=_Part_48291"' },
          { key: 'Content-Transfer-Encoding', value: '7bit' },
          { key: 'Return-Path', value: '<sarah.chen@qyvora.com>' },
          { key: 'X-MS-Exchange-Organization-AuthAs', value: 'Internal' },
          { key: 'X-MS-Exchange-Organization-AuthSource', value: 'MX.qyvora.com' },
          { key: 'X-Compromised-Account', value: 'TRUE' },
        ],
        indicators: [
          {
            type: 'Macro-Enabled Attachment',
            description: 'The .xlsm file contains macros. Macro-enabled documents are a common vector for delivering malware payloads, especially when combined with social engineering to enable macros.',
            severity: 'high',
            location: 'Attachment: Q3_Project_Report_Final_v3.xlsm',
          },
          {
            type: 'Social Engineering – Macro Enablement',
            description: 'The email explicitly asks you to "make sure macros are enabled" — this is the attacker\'s goal: getting you to execute the malicious macro code.',
            severity: 'high',
            location: 'Email body',
          },
          {
            type: 'Compromised Account',
            description: 'The X-Compromised-Account header indicates this email was sent from a legitimate but compromised internal account, which is why SPF/DKIM/DMARC all pass.',
            severity: 'high',
            location: 'X-Compromised-Account header',
          },
          {
            type: 'OSINT References',
            description: 'The email references real company events (Q2 all-hands, Mark\'s feedback, leadership review, finance presentations) to establish credibility — classic spear phishing using open-source intelligence.',
            severity: 'medium',
            location: 'Email body context',
          },
          {
            type: 'False Urgency with Authority',
            description: 'References a board presentation deadline to pressure quick action without scrutiny.',
            severity: 'medium',
            location: 'Email body',
          },
          {
            type: 'No Links (Attachment Only)',
            description: 'Unlike most phishing emails, this attack uses only an attachment with no suspicious links, making URL-based detection tools ineffective.',
            severity: 'medium',
            location: 'Entire email',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'ph-ch4-q1',
        question: 'Why do all email authentication checks (SPF, DKIM, DMARC) PASS for this phishing email?',
        options: [
          'The attacker configured authentication correctly',
          'The email was sent from a compromised legitimate account, so authentication succeeds',
          'Authentication checks don\'t apply to internal emails',
          'The security team whitelisted the sender',
        ],
        correctIndex: 1,
        explanation:
          'The X-Compromised-Account header reveals the truth: Sarah Chen\'s real account was compromised. Because the attacker is sending from her actual mailbox, all authentication mechanisms pass. This is why you can\'t rely solely on authentication headers — you must also evaluate content and context.',
      },
      {
        id: 'ph-ch4-q2',
        question: 'What makes this spear phishing attack more dangerous than generic phishing?',
        options: [
          'It uses a .xlsm file instead of .xlsx',
          'It references real company events and people to appear legitimate, and comes from a compromised internal account',
          'It has more professional formatting',
          'It doesn\'t contain any links',
        ],
        correctIndex: 1,
        explanation:
          'Spear phishing uses personalized details gathered through OSINT (Q2 all-hands, Mark, finance presentations) to build trust. Combined with a compromised internal account that passes all authentication checks, this email is extremely convincing. The attacker invested significant effort in reconnaissance.',
      },
      {
        id: 'ph-ch4-q3',
        question: 'What is the most important red flag in this email that should trigger suspicion?',
        options: [
          'The email mentions the Q2 all-hands meeting',
          'The sender asks you to enable macros in an Excel file',
          'The email was sent on a Friday',
          'Sarah Chen signed off with her phone extension',
        ],
        correctIndex: 1,
        explanation:
          'Legitimate colleagues rarely ask you to enable macros. The request to "make sure macros are enabled" is the critical red flag — it reveals the attacker\'s true intent: executing malicious macro code on your system. Even if the email appears to come from a trusted source, always be suspicious of macro enablement requests.',
      },
      {
        id: 'ph-ch4-q4',
        question: 'How could you verify if this email from Sarah Chen is legitimate?',
        options: [
          'Check if the email passed SPF and DKIM',
          'Reply to the email and ask Sarah if she sent it',
          'Contact Sarah through a separate channel (Slack, phone, in-person) to verify',
          'Open the attachment in a sandbox environment to check',
        ],
        correctIndex: 2,
        explanation:
          'Since the email comes from a compromised account, SPF/DKIM are useless for detection. Replying to the email goes to the attacker. The only reliable verification is contacting Sarah through an independent, known channel. Opening the attachment, even in a sandbox, is risky and not recommended as a first step.',
      },
    ],
  },

  {
    id: 'phishing-qr-code',
    title: 'QR Code Phishing',
    description:
      'A professional-looking HR email contains a QR code for "mandatory benefits enrollment." Analyze the email and QR code to identify the phishing attempt.',
    difficulty: 'intermediate',
    cpReward: 250,
    flag: 'FLAG{phish_qr_harvest_benefits}',
    emails: [
      {
        id: 'ph-ch5-email-001',
        from: 'hr-benefits@qyvora-hr.com',
        fromName: 'Qyvora Human Resources',
        to: 'student@qyvora.com',
        subject: '📋 Open Enrollment Period – Action Required by July 18',
        isPhishing: true,
        receivedAt: '2026-07-11T10:15:44.000Z',
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #ffffff; margin: 0; padding: 0; }
    .wrapper { max-width: 620px; margin: 0 auto; }
    .header { background: #2d3748; padding: 30px 36px; border-radius: 0 0 12px 12px; }
    .header h1 { color: #ffffff; font-size: 20px; margin: 0 0 4px 0; font-weight: 600; }
    .header p { color: #a0aec0; font-size: 12px; margin: 0; }
    .content { padding: 32px 36px; color: #4a5568; font-size: 14px; line-height: 1.7; }
    .content h2 { color: #2d3748; font-size: 17px; margin: 20px 0 8px 0; }
    .badge { display: inline-block; background: #fed7d7; color: #c53030; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-box { background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 16px 20px; margin: 16px 0; }
    .info-box h3 { margin: 0 0 8px 0; font-size: 14px; color: #2b6cb0; }
    .info-box ul { margin: 0; padding-left: 18px; font-size: 13px; }
    .info-box li { margin: 4px 0; }
    .qr-section { text-align: center; margin: 28px 0; padding: 24px; background: #f7fafc; border-radius: 12px; border: 2px dashed #e2e8f0; }
    .qr-placeholder { width: 180px; height: 180px; margin: 0 auto 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; }
    .qr-inner { width: 140px; height: 140px; background: #000; border-radius: 4px; display: flex; align-items: center; justify-content: center; position: relative; }
    .qr-inner::before { content: ''; position: absolute; width: 120px; height: 120px; background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0 / 12px 12px; border-radius: 2px; }
    .qr-inner::after { content: '📱 SCAN'; position: absolute; color: #fff; font-size: 14px; font-weight: bold; z-index: 1; }
    .qr-label { font-size: 13px; color: #718096; margin-top: 8px; }
    .qr-instruction { font-size: 14px; color: #2d3748; font-weight: 600; margin-top: 12px; }
    .steps { margin: 16px 0; }
    .step { display: flex; gap: 12px; margin: 10px 0; align-items: flex-start; }
    .step-num { width: 28px; height: 28px; background: #2d3748; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
    .step-text { font-size: 13px; padding-top: 4px; }
    .deadline-box { background: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px; padding: 14px 18px; margin: 20px 0; text-align: center; }
    .deadline-box strong { color: #c53030; font-size: 15px; }
    .deadline-box p { margin: 4px 0 0 0; font-size: 12px; color: #9b2c2c; }
    .footer { padding: 20px 36px; background: #f7fafc; font-size: 11px; color: #a0aec0; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer a { color: #4299e1; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Qyvora Human Resources</h1>
      <p>Benefits & Compensation Department</p>
    </div>
    <div class="content">
      <p>Dear Team Member,</p>
      <p>The <strong>Annual Open Enrollment Period</strong> for health, dental, vision, and life insurance benefits is now active. All employees must complete their elections or confirm current coverage by the deadline.</p>
      <span class="badge">Time Sensitive</span>
      <div class="info-box">
        <h3>📦 What's New This Year</h3>
        <ul>
          <li>Expanded telehealth coverage (Aetna Virtual Care)</li>
          <li>New dental option: Delta Premium PPO</li>
          <li>Increased employer HSA contribution ($1,500 individual)</li>
          <li>Life insurance upgrade: 2x salary coverage at no additional cost</li>
        </ul>
      </div>
      <h2>How to Enroll</h2>
      <div class="qr-section">
        <div class="qr-placeholder">
          <div class="qr-inner"></div>
        </div>
        <div class="qr-label">Scan this QR code with your phone camera</div>
        <div class="qr-instruction">Or visit: benefits-enrollment.qyvora-hr.com</div>
      </div>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text">Scan the QR code or visit the enrollment portal</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text">Sign in with your company credentials (email & password)</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text">Review current elections and make changes</div>
        </div>
        <div class="step">
          <div class="step-num">4</div>
          <div class="step-text">Submit your elections and download confirmation</div>
        </div>
      </div>
      <div class="deadline-box">
        <strong>⏰ Deadline: Friday, July 18, 2026 at 11:59 PM EST</strong>
        <p>Failure to enroll will result in automatic continuation of current plan selections. Changes cannot be made after the deadline.</p>
      </div>
      <p>Questions? Contact HR at <a href="mailto:hr-benefits@qyvora-hr.com">hr-benefits@qyvora-hr.com</a> or ext. 2200.</p>
    </div>
    <div class="footer">
      <p>Qyvora Inc. • Human Resources Department</p>
      <p><a href="https://qyvora.com/benefits">Benefits Overview</a> | <a href="https://qyvora.com/faq">FAQ</a> | <a href="https://qyvora.com/privacy">Privacy Policy</a></p>
      <p style="margin-top: 8px;">You are receiving this because you are an active employee of Qyvora Inc.</p>
    </div>
  </div>
</body>
</html>`,
        links: [
          {
            text: 'Scan QR Code (enrollment portal link)',
            actualUrl: 'http://benefits-enrollment.qyv0ra-hr.com/login?ref=email&sid=9f3a2b1c',
            displayUrl: 'https://benefits.qyvora.com/enroll',
          },
          {
            text: 'Benefits Overview',
            actualUrl: 'https://qyvora.com/benefits',
            displayUrl: 'https://qyvora.com/benefits',
          },
          {
            text: 'FAQ',
            actualUrl: 'https://qyvora.com/faq',
            displayUrl: 'https://qyvora.com/faq',
          },
        ],
        headers: [
          { key: 'Received', value: 'from smtp.qyvora-hr.com (unknown [91.134.206.78]) by mx.qyvora.com (Postfix) with ESMTP id G1H2I3 for <student@qyvora.com>; Fri, 11 Jul 2026 10:15:44 +0000' },
          { key: 'Received-SPF', value: 'softfail (domain of qyvora-hr.com does not designate 91.134.206.78 as permitted sender)' },
          { key: 'Authentication-Results', value: 'mx.qyvora.com; spf=softfail smtp.mailfrom=hr-benefits@qyvora-hr.com; dkim=fail header.d=qyvora-hr.com; dmarc=fail (p=NONE) header.from=qyvora-hr.com' },
          { key: 'From', value: '"Qyvora Human Resources" <hr-benefits@qyvora-hr.com>' },
          { key: 'To', value: 'student@qyvora.com' },
          { key: 'Subject', value: '📋 Open Enrollment Period – Action Required by July 18' },
          { key: 'Date', value: 'Fri, 11 Jul 2026 10:15:42 +0000' },
          { key: 'Message-ID', value: '<j4k5l6m7n8o9@qyvora-hr.com>' },
          { key: 'X-Mailer', value: 'Campaign Monitor' },
          { key: 'List-Unsubscribe', value: '<mailto:unsubscribe@qyvora-hr.com?subject=unsubscribe>' },
          { key: 'MIME-Version', value: '1.0' },
          { key: 'Content-Type', value: 'text/html; charset="UTF-8"' },
          { key: 'Content-Transfer-Encoding', value: 'quoted-printable' },
          { key: 'Return-Path', value: '<hr-benefits@qyvora-hr.com>' },
          { key: 'X-Originating-IP', value: '[91.134.206.78]' },
        ],
        indicators: [
          {
            type: 'Lookalike Domain',
            description: 'The sender domain "qyvora-hr.com" is not the legitimate company domain "qyvora.com". Attackers create subdomain-style lookalikes to appear legitimate.',
            severity: 'high',
            location: 'From: hr-benefits@qyvora-hr.com',
          },
          {
            type: 'QR Code as Attack Vector',
            description: 'QR codes in emails bypass many security tools that scan URLs in email body text. The QR code encodes a malicious URL that isn\'t visible in the email text.',
            severity: 'high',
            location: 'QR code image in email body',
          },
          {
            type: 'Credential Harvesting',
            description: 'The enrollment portal link leads to a lookalike domain (qyv0ra-hr.com) designed to steal login credentials under the guise of benefits enrollment.',
            severity: 'high',
            location: 'QR code / enrollment portal link',
          },
          {
            type: 'SPF Softfail',
            description: 'The sending server is not fully authorized for the domain, indicating potential spoofing.',
            severity: 'medium',
            location: 'Received-SPF header',
          },
          {
            type: 'DKIM Failure',
            description: 'DKIM signature verification failed, suggesting the email was not legitimately signed.',
            severity: 'high',
            location: 'Authentication-Results header',
          },
          {
            type: 'Third-Party Mailer',
            description: 'The X-Mailer header shows "Campaign Monitor" — while this could be legitimate, attackers also use bulk email services for phishing campaigns.',
            severity: 'low',
            location: 'X-Mailer header',
          },
          {
            type: 'Generic "Dear Team Member"',
            description: 'Uses "Dear Team Member" instead of the recipient\'s actual name.',
            severity: 'low',
            location: 'Email body greeting',
          },
          {
            type: 'QR Code Bypasses URL Filtering',
            description: 'QR codes encode URLs visually, bypassing email security gateway URL scanners and link rewriting protections that would normally flag malicious links.',
            severity: 'high',
            location: 'Attack technique',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'ph-ch5-q1',
        question: 'Why are QR codes in emails particularly dangerous from a security perspective?',
        options: [
          'They contain more data than regular URLs',
          'They bypass email security tools that scan text-based URLs, as the encoded URL isn\'t visible to automated scanners',
          'They always link to phishing sites',
          'They can\'t be scanned by mobile phones',
        ],
        correctIndex: 1,
        explanation:
          'QR codes encode URLs as images, which means email security gateways that scan and rewrite text-based links cannot inspect them. The malicious URL is hidden within the image, making it invisible to automated URL filtering and link reputation checking tools.',
      },
      {
        id: 'ph-ch5-q2',
        question: 'What tells you this HR email might not be from the real HR department?',
        options: [
          'The email mentions benefits enrollment',
          'The sender domain is qyvora-hr.com, not the legitimate qyvora.com domain',
          'The email includes a deadline',
          'The email is well-formatted and professional',
        ],
        correctIndex: 1,
        explanation:
          'The legitimate Qyvora HR department would email from @qyvora.com, not @qyvora-hr.com. Attackers register lookalike domains that appear to be departmental subdomains but are actually separate, attacker-controlled domains.',
      },
      {
        id: 'ph-ch5-q3',
        question: 'The email provides both a QR code AND a text URL (benefits-enrollment.qyvora-hr.com). What should you notice?',
        options: [
          'Having two options makes it more trustworthy',
          'The text URL also uses the lookalike domain, confirming this is a phishing attempt targeting credentials',
          'Text URLs are always safe in corporate emails',
          'The QR code and URL must go to different destinations',
        ],
        correctIndex: 1,
        explanation:
          'Both the QR code and the text URL use the lookalike domain "qyvora-hr.com" (not the real "qyvora.com"). The email is consistent in its deception — both paths lead to the credential harvesting site. This confirms the entire email is fraudulent.',
      },
    ],
  },
];
