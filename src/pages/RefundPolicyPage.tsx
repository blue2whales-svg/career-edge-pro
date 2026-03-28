import PageLayout from "@/components/PageLayout";

export default function RefundPolicyPage() {
  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-3xl mx-auto prose prose-invert prose-sm prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
          <h1>Refund Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: 28 March 2026</p>

          <h2>1. Digital Service Nature</h2>
          <p>CV Edge provides digital career document services. Because our deliverables are digital products created specifically for each client, refunds are handled on a case‑by‑case basis as outlined below.</p>

          <h2>2. When You May Request a Refund</h2>
          <ul>
            <li><strong>Non‑delivery:</strong> If CV Edge fails to deliver your completed documents within 72 hours of confirmed payment (excluding circumstances communicated to you), you are entitled to a full refund.</li>
            <li><strong>Duplicate payment:</strong> If you are charged more than once for the same Order, the duplicate amount will be refunded in full.</li>
            <li><strong>Service not started:</strong> If you request a cancellation before work on your Order has begun, you may receive a full refund.</li>
          </ul>

          <h2>3. When Refunds Are Not Available</h2>
          <ul>
            <li><strong>After delivery:</strong> Once your completed documents have been delivered and made available for download or review, refunds are generally not available, as the digital product has been consumed.</li>
            <li><strong>Dissatisfaction with outcomes:</strong> CV Edge does not guarantee employment, interviews, or shortlisting. Refunds will not be issued based on employment outcomes.</li>
            <li><strong>Failure to provide information:</strong> If delivery is delayed because you did not provide the required career information, a refund will not be issued.</li>
          </ul>

          <h2>4. Revisions</h2>
          <p>If you are unsatisfied with the quality of your delivered documents, CV Edge offers revisions as specified in your package:</p>
          <ul>
            <li><strong>Starter:</strong> 1 revision</li>
            <li><strong>Professional:</strong> 2 revisions</li>
            <li><strong>Executive:</strong> Unlimited revisions for 30 days</li>
          </ul>
          <p>Revision requests must be submitted within 14 days of delivery. We encourage using the revision process before requesting a refund.</p>

          <h2>5. Recruiter &amp; Employer Services</h2>
          <p>Job posting fees are non‑refundable once the listing has been published on the Platform. If a listing is removed by CV Edge for violating our Terms, no refund will be issued.</p>
          <p>Recruiter Pro subscription fees are non‑refundable for the current billing period but you may cancel future renewals.</p>

          <h2>6. How to Request a Refund</h2>
          <p>To request a refund, contact us within 14 days of payment with your Order ID and reason for the request:</p>
          <ul>
            <li>Email: <a href="mailto:support@cvedge.live">support@cvedge.live</a></li>
            <li>Phone: <a href="tel:+254793919962">+254 793 919 962</a></li>
          </ul>
          <p>Refunds will be processed within 7–14 business days via the original payment method (M‑Pesa reversal or bank transfer).</p>

          <h2>7. Dispute Resolution</h2>
          <p>If you are not satisfied with the outcome of a refund request, disputes will be resolved in accordance with the dispute resolution provisions in our <a href="/terms">Terms &amp; Conditions</a>.</p>
        </div>
      </section>
    </PageLayout>
  );
}
