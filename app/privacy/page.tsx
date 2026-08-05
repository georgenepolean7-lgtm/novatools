import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: July 26, 2026
          </p>

          <div className="mt-8 space-y-8 leading-7 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-slate-900">
                1. About Nova Tools
              </h2>

              <p className="mt-3">
                Nova Tools is an online file utility service provided by
                Nova Code Tech. Our tools help users perform common tasks
                such as image compression, image resizing, PDF processing,
                file conversion and text extraction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                2. Files You Process
              </h2>

              <p className="mt-3">
                Many Nova Tools features process files directly in your
                web browser. When a tool works entirely in your browser,
                the selected file does not need to be uploaded to our
                server for processing.
              </p>

              <p className="mt-3">
                If we introduce server-based processing in the future,
                this Privacy Policy will be updated to explain how those
                files are handled.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                3. Information We May Collect
              </h2>

              <p className="mt-3">
                We may collect basic technical information such as browser
                type, device type, pages visited, approximate location,
                referring pages and usage statistics.
              </p>

              <p className="mt-3">
                This information may be used to improve performance,
                understand how visitors use Nova Tools and maintain the
                security of the website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                4. Cookies
              </h2>

              <p className="mt-3">
                Nova Tools may use cookies or similar technologies for
                essential website functions, analytics, preferences and
                advertising where applicable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                5. Analytics and Advertising
              </h2>

              <p className="mt-3">
                We may use third-party analytics and advertising services.
                These providers may use cookies or similar technologies in
                accordance with their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                6. Third-Party Links
              </h2>

              <p className="mt-3">
                Nova Tools may contain links to external websites. We are
                not responsible for the privacy practices or content of
                third-party websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                7. Data Security
              </h2>

              <p className="mt-3">
                We use reasonable technical and organizational measures to
                protect the website and information processed through our
                services. No internet-based service can guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                8. Changes to This Policy
              </h2>

              <p className="mt-3">
                We may update this Privacy Policy when our services,
                technology or legal requirements change. The latest
                version will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                9. Contact
              </h2>

              <p className="mt-3">
                If you have questions about this Privacy Policy, you can
                contact Nova Code Tech through the contact information
                provided on Nova Tools.
              </p>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}