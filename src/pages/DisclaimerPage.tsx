import PageLayout from "@/components/PageLayout";

export default function DisclaimerPage() {
  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-3xl mx-auto prose prose-invert prose-sm prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
          <h1>Disclaimer</h1>
          <p className="text-xs text-muted-foreground">Last updated: 28 March 2026</p>

          <h2>1. General Disclaimer</h2>
          <p>The information, services, and content provided on CV Edge (<a href="https://cvedge.live">cvedge.live</a>) are for general career‑development purposes only. While we strive to provide high‑quality, accurate, and up‑to‑date services, CV Edge makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the Platform or its content.</p>

          <h2>2. No Employment Guarantee</h2>
          <p><strong>CV Edge does not guarantee employment, job interviews, shortlisting, visa approvals, scholarship awards, or any specific career outcome.</strong> Our Services are designed to improve the quality of your career documents and enhance your professional presentation. Hiring, admissions, and visa decisions are made solely by third parties over whom CV Edge has no control.</p>

          <h2>3. Job Listings</h2>
          <p>Job listings displayed on the Platform are sourced from employers, recruiters, and third‑party data providers. CV Edge does not verify the accuracy of every job listing and is not responsible for:</p>
          <ul>
            <li>The legitimacy or existence of any advertised position</li>
            <li>The hiring practices or decisions of any employer</li>
            <li>Salary, benefits, or working conditions described in listings</li>
            <li>Any losses arising from applying to jobs through the Platform</li>
          </ul>
          <p>Users should exercise due diligence when applying to any position.</p>

          <h2>4. AI‑Generated Content</h2>
          <p>Certain features of the Platform use artificial intelligence to generate or optimise career documents. AI‑generated content is provided as a starting point and may require review and editing. CV Edge is not liable for errors, omissions, or inaccuracies in AI‑generated content. Users are responsible for reviewing all documents before use.</p>

          <h2>5. Third‑Party Links &amp; Services</h2>
          <p>The Platform may contain links to third‑party websites and services. CV Edge does not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third‑party sites.</p>

          <h2>6. Professional Advice</h2>
          <p>CV Edge does not provide legal, financial, immigration, or employment advice. Our Services are limited to career document preparation and related support. For specific professional advice, please consult a qualified professional in the relevant field.</p>

          <h2>7. Service Availability</h2>
          <p>CV Edge strives to maintain uninterrupted access to the Platform but does not guarantee continuous or error‑free availability. The Platform may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.</p>

          <h2>8. Limitation of Liability</h2>
          <p>To the fullest extent permitted by the laws of Kenya, CV Edge, its directors, employees, partners, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:</p>
          <ul>
            <li>Your use of or inability to use the Platform</li>
            <li>Any errors or omissions in Platform content</li>
            <li>Unauthorised access to or alteration of your data</li>
            <li>Any third‑party conduct on the Platform</li>
            <li>Any employment or career outcomes</li>
          </ul>

          <h2>9. Indemnification</h2>
          <p>You agree to indemnify and hold harmless CV Edge from any claims, losses, or damages arising from your use of the Platform, violation of these terms, or infringement of any third‑party rights.</p>

          <h2>10. Governing Law</h2>
          <p>This Disclaimer is governed by the laws of the Republic of Kenya. Any disputes shall be resolved in accordance with the dispute resolution provisions in our <a href="/terms">Terms &amp; Conditions</a>.</p>

          <h2>11. Contact</h2>
          <p>If you have questions about this Disclaimer:</p>
          <ul>
            <li>Email: <a href="mailto:support@cvedge.live">support@cvedge.live</a></li>
            <li>Phone: <a href="tel:+254793919962">+254 793 919 962</a></li>
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
