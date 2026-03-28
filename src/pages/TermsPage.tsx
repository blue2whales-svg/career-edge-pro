import PageLayout from "@/components/PageLayout";

export default function TermsPage() {
  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-3xl mx-auto prose prose-invert prose-sm prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
          <h1>Terms &amp; Conditions</h1>
          <p className="text-xs text-muted-foreground">Last updated: 28 March 2026</p>

          <h2>1. Introduction</h2>
          <p>These Terms and Conditions ("Terms") govern your use of the CV Edge website at <a href="https://cvedge.live">cvedge.live</a> and all related services (the "Platform"). By accessing or using the Platform you agree to be bound by these Terms. If you do not agree, please do not use the Platform.</p>
          <p>CV Edge is a digital career‑services platform based in Kenya, serving clients worldwide.</p>

          <h2>2. Definitions</h2>
          <ul>
            <li><strong>"Services"</strong> means CV writing, cover letter writing, scholarship essay writing, LinkedIn profile optimisation, ATS compatibility checks, job listings, recruiter services, career documents, document vault storage, and any other service offered through the Platform.</li>
            <li><strong>"User"</strong> means any individual or entity accessing the Platform, whether as a job seeker, recruiter, employer, or visitor.</li>
            <li><strong>"Order"</strong> means a confirmed request for one or more Services submitted through the Platform.</li>
          </ul>

          <h2>3. Eligibility</h2>
          <p>You must be at least 18 years old (or the age of majority in your jurisdiction) to use the Platform. By creating an account you represent that the information you provide is accurate and complete.</p>

          <h2>4. Services &amp; Digital Delivery</h2>
          <p>All Services are delivered digitally. Upon confirmed payment, CV Edge will begin processing your Order. Delivery timelines are estimates and not guarantees. Standard delivery is within 24 hours; same‑day delivery is available for selected packages.</p>
          <p>CV Edge reserves the right to decline or cancel any Order at its discretion, in which case a full refund will be issued.</p>

          <h2>5. Payments</h2>
          <p>Payments are processed through M‑Pesa (Safaricom) and other payment methods as made available on the Platform. All prices are quoted in Kenya Shillings (KES) unless otherwise stated. You agree to pay the full amount at the time of placing an Order.</p>
          <p>CV Edge is not responsible for payment failures caused by your mobile money provider, insufficient funds, or incorrect payment details.</p>

          <h2>6. No Employment Guarantee</h2>
          <p><strong>CV Edge does not guarantee employment, interviews, shortlisting, or any specific career outcome.</strong> Our Services are designed to improve the quality of your career documents and increase your competitiveness, but hiring decisions are made solely by prospective employers.</p>

          <h2>7. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify CV Edge immediately of any unauthorised use. CV Edge is not liable for losses arising from unauthorised access to your account.</p>

          <h2>8. Document Vault</h2>
          <p>The Document Vault allows you to store career documents on the Platform. CV Edge takes reasonable measures to protect stored documents but does not guarantee against data loss. You are responsible for maintaining independent backups of your documents.</p>

          <h2>9. Recruiter &amp; Employer Responsibilities</h2>
          <p>Recruiters and employers using the Platform to post job listings represent and warrant that:</p>
          <ul>
            <li>All job postings are for legitimate, existing positions.</li>
            <li>Postings comply with all applicable labour and employment laws.</li>
            <li>They will not post misleading, discriminatory, or fraudulent listings.</li>
            <li>They have the authority to post on behalf of the hiring organisation.</li>
          </ul>
          <p>CV Edge reserves the right to remove any job listing that violates these Terms without notice or refund.</p>

          <h2>10. Intellectual Property</h2>
          <p>All content, designs, templates, algorithms, and branding on the Platform are the intellectual property of CV Edge. Upon full payment, you receive a non‑exclusive, personal licence to use the documents created for you. CV Edge retains the right to use anonymised samples for marketing and training purposes.</p>
          <p>You retain ownership of the personal information and career data you provide. CV Edge does not claim ownership of your personal content.</p>

          <h2>11. Prohibited Conduct</h2>
          <p>You agree not to: (a) use the Platform for any unlawful purpose; (b) reverse‑engineer, copy, or redistribute Platform content; (c) submit false or misleading information; (d) interfere with Platform operations or security; (e) resell Services without written authorisation.</p>

          <h2>12. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, CV Edge shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, employment opportunities, or data, arising from or related to your use of the Platform.</p>
          <p>CV Edge's total aggregate liability shall not exceed the amount you paid for the specific Service giving rise to the claim.</p>

          <h2>13. Indemnification</h2>
          <p>You agree to indemnify and hold harmless CV Edge, its officers, employees, and agents from any claims, damages, or expenses arising from your use of the Platform or violation of these Terms.</p>

          <h2>14. Modifications</h2>
          <p>CV Edge may update these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the Platform after changes constitutes acceptance of the revised Terms.</p>

          <h2>15. Governing Law &amp; Dispute Resolution</h2>
          <p>These Terms are governed by the laws of the Republic of Kenya. Any dispute arising from these Terms shall first be resolved through good‑faith negotiation. If unresolved, disputes shall be referred to arbitration in Nairobi, Kenya, in accordance with the Arbitration Act (Cap 49, Laws of Kenya).</p>

          <h2>16. Contact</h2>
          <p>For questions about these Terms, contact us at:</p>
          <ul>
            <li>Email: <a href="mailto:support@cvedge.live">support@cvedge.live</a></li>
            <li>Phone: <a href="tel:+254793919962">+254 793 919 962</a></li>
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
