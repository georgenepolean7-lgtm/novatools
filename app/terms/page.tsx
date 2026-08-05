import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Terms & Conditions
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: July 26, 2026
          </p>

          <div className="mt-8 space-y-8 leading-7 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-slate-900">
                1. Acceptance of Terms
              </h2>

              <p className="mt-3">
                By accessing or using Nova Tools, you agree to these
                Terms & Conditions. If you do not agree with these terms,
                please do not use the website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                2. About the Service
              </h2>

              <p className="mt-3">
                Nova Tools provides online utilities for tasks such as
                image compression, image resizing, PDF processing, file
                conversion and text extraction.
              </p>

              <p className="mt-3">
                Features may be added, changed or removed as the service
                develops.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                3. User Responsibilities
              </h2>

              <p className="mt-3">
                You are responsible for the files and content you process
                using Nova Tools. You must have the necessary rights or
                permission to use those files.
              </p>

              <p className="mt-3">
                You must not use Nova Tools for unlawful activities or in
                a way that could damage, disrupt or interfere with the
                website or other users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                4. File Processing
              </h2>

              <p className="mt-3">
                Some Nova Tools features process files directly in your
                browser. Processing results can vary depending on the
                original file, browser, device and selected settings.
              </p>

              <p className="mt-3">
                You should check downloaded files before using them for
                important applications, submissions or documents.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                5. Availability
              </h2>

              <p className="mt-3">
                We aim to keep Nova Tools available and working correctly,
                but we do not guarantee uninterrupted or error-free
                access. Maintenance, technical problems or other factors
                may temporarily affect the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                6. Intellectual Property
              </h2>

              <p className="mt-3">
                The Nova Tools name, website design, original content and
                related branding belong to Nova Code Tech unless stated
                otherwise.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                7. Third-Party Services
              </h2>

              <p className="mt-3">
                Nova Tools may use or link to third-party services.
                Third-party services are governed by their own terms and
                policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                8. Limitation of Liability
              </h2>

              <p className="mt-3">
                Nova Tools is provided as an online utility service. You
                are responsible for verifying that processed files meet
                your requirements before submitting, printing, sharing or
                relying on them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                9. Changes to These Terms
              </h2>

              <p className="mt-3">
                We may update these Terms & Conditions when the service or
                applicable requirements change. The latest version will be
                published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                10. Contact
              </h2>

              <p className="mt-3">
                Questions about these terms can be sent to Nova Code Tech
                through the contact information provided on Nova Tools.
              </p>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}