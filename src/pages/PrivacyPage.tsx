import PageLayout from "@/components/PageLayout";

export default function PrivacyPage() {
  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-3xl mx-auto prose prose-invert prose-sm prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
          <h1>Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: 28 March 2026</p>

          <h2>1. Introduction</h2>
          <p>CV Edge ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and disclose your personal data when you use our website at <a href="https://cvedge.live">cvedge.live</a> and related services.</p>
          <p>This policy complies with the <strong>Kenya Data Protection Act, 2019</strong> and applicable international data‑protection standards including GDPR where applicable to our global users.</p>

          <h2>2. Data Controller</h2>
          <p>CV Edge, based in Kenya, is the data controller responsible for your personal data. Contact: <a href="mailto:support@cvedge.live">support@cvedge.live</a>.</p>

          <h2>3. Data We Collect</h2>
          <h3>3.1 Information You Provide</h3>
          <ul>
            <li>Full name, email address, phone number</li>
            <li>Career information: work experience, education, skills, certifications</li>
            <li>Uploaded documents (CVs, certificates, cover letters)</li>
            <li>Payment details (M‑Pesa phone number, transaction references)</li>
            <li>Account login credentials</li>
            <li>Recruiter/employer company details and job posting content</li>
          </ul>
          <h3>3.2 Automatically Collected Data</h3>
          <ul>
            <li>IP address, browser type, device information</li>
            <li>Pages visited, time spent, referral source</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>4. How We Use Your Data</h2>
          <ul>
            <li>To deliver ordered Services (CV writing, document generation, etc.)</li>
            <li>To process payments and send order confirmations</li>
            <li>To provide the Document Vault storage feature</li>
            <li>To match your profile to relevant job opportunities</li>
            <li>To improve our Platform and develop new features</li>
            <li>To send service‑related communications and, with your consent, marketing messages</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>5. Legal Basis for Processing</h2>
          <p>We process your data on the following bases under the Kenya Data Protection Act, 2019:</p>
          <ul>
            <li><strong>Consent</strong> — when you create an account, place an order, or opt into communications.</li>
            <li><strong>Contractual necessity</strong> — to fulfil your Service orders.</li>
            <li><strong>Legitimate interest</strong> — to improve our services, prevent fraud, and ensure platform security.</li>
            <li><strong>Legal obligation</strong> — to comply with applicable laws and regulations.</li>
          </ul>

          <h2>6. Data Sharing</h2>
          <p>We do not sell your personal data. We may share data with:</p>
          <ul>
            <li><strong>Payment processors</strong> (Safaricom M‑Pesa) to process transactions.</li>
            <li><strong>Cloud infrastructure providers</strong> to host and secure the Platform.</li>
            <li><strong>Employers/recruiters</strong> only when you explicitly apply to a job listing through the Platform.</li>
            <li><strong>Law enforcement</strong> when required by court order or applicable law.</li>
          </ul>

          <h2>7. Data Retention</h2>
          <p>We retain your personal data for as long as your account is active or as needed to provide Services. Order records and payment data are retained for 7 years for tax and legal compliance. You may request deletion of your account and data at any time, subject to legal retention requirements.</p>

          <h2>8. Data Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your data, including encryption in transit and at rest, access controls, and regular security reviews. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

          <h2>9. Your Rights</h2>
          <p>Under the Kenya Data Protection Act, 2019, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability — receive your data in a structured format</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with the Office of the Data Protection Commissioner of Kenya</li>
          </ul>

          <h2>10. Cookies</h2>
          <p>We use cookies and similar technologies for analytics (Google Analytics), advertising (Facebook Pixel), and essential Platform functionality. You can manage cookie preferences through your browser settings.</p>

          <h2>11. International Transfers</h2>
          <p>Your data may be processed on servers located outside Kenya. We ensure that any international transfers comply with the Kenya Data Protection Act, 2019 and are subject to appropriate safeguards.</p>

          <h2>12. Children's Privacy</h2>
          <p>The Platform is not intended for individuals under 18. We do not knowingly collect data from minors. If you believe a minor has provided data, please contact us for deletion.</p>

          <h2>13. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated date. Continued use of the Platform constitutes acceptance of the updated policy.</p>

          <h2>14. Contact</h2>
          <p>For privacy‑related enquiries or to exercise your data rights:</p>
          <ul>
            <li>Email: <a href="mailto:support@cvedge.live">support@cvedge.live</a></li>
            <li>Phone: <a href="tel:+254793919962">+254 793 919 962</a></li>
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
